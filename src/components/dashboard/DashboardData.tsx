import { useState, useEffect } from 'react';
import { dbService } from '@/services/database';
import { useAuth } from '@/hooks/useAuth';

export interface DashboardStats {
  personalStats?: {
    todayProblems: number;
    currentStreak: number;
    teamRank: number;
    totalSolved: number;
  };
  teamStats?: {
    teamAverage: number;
    activeMembers: number;
    teamRank: number;
    monthlyGoal: number;
  };
  sectionStats?: {
    sectionAverage: number;
    activeStudents: number;
    topPerformers: number;
    needAttention: number;
  };
  departmentStats?: {
    departmentAverage: number;
    totalStudents: number;
    placementReady: number;
    facultyUsage: number;
  };
  systemStats?: {
    systemHealth: number;
    totalUsers: number;
    apiSuccess: number;
    supportTickets: number;
  };
  upcomingContests?: {
    name: string;
    date: string;
    platform: string;
  }[];
  pendingTasks?: {
    title: string;
    due: string;
    difficulty: string;
  }[];
}

export const useDashboardData = (role: string) => {
  const { profile } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!profile || !role) return;

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch common data (contests, tasks)
        const contests = await dbService.query('contests', {
          orderBy: [['date', 'asc']],
          limit: 3
        });

        const upcomingContests = contests.map(c => ({
          name: c.name,
          date: new Date(c.date).toLocaleDateString(),
          platform: c.platform
        }));

        // Fetch tasks (simplified for now, fetching all pending)
        const tasks = await dbService.query('tasks', {
          where: [['status', '!=', 'completed']],
          limit: 3
        });

        const pendingTasks = tasks.map(t => ({
          title: t.title,
          due: new Date(t.due_date).toLocaleDateString(),
          difficulty: t.difficulty
        }));

        let roleStats = {};

        switch (role) {
          case 'student':
            roleStats = await fetchStudentStats();
            break;
          case 'team_lead':
            roleStats = await fetchTeamLeadStats();
            break;
          case 'advisor':
            roleStats = await fetchAdvisorStats();
            break;
          case 'hod':
            roleStats = await fetchHODStats();
            break;
          case 'admin':
            roleStats = await fetchAdminStats();
            break;
        }

        setStats({
          ...roleStats,
          upcomingContests,
          pendingTasks
        });

      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [profile, role]);

  const fetchStudentStats = async () => {
    if (!profile) return {};

    // Get personal daily stats
    const today = new Date().toISOString().split('T')[0];
    const dailyStats = await dbService.query('daily_stats', {
      where: [
        ['user_id', '==', profile.user_id],
        ['date', '==', today]
      ]
    });

    // Calculate totals (mock logic if no historical data)
    const todayProblems = dailyStats?.reduce((sum, stat) => sum + stat.daily_increase, 0) || 0;

    // For total solved, we might need a separate aggregation or field in profile
    const totalSolved = profile.total_solved || 0;
    const currentStreak = profile.streak || 0;

    // Mock rank for now
    const teamRank = Math.floor(Math.random() * 8) + 1;

    return {
      personalStats: {
        todayProblems,
        currentStreak,
        teamRank,
        totalSolved,
      }
    };
  };

  const fetchTeamLeadStats = async () => {
    if (!profile) return {};

    // Get team information
    const teams = await dbService.query('teams', {
      where: [['team_lead_id', '==', profile.user_id]]
    });

    const team = teams?.[0];
    if (!team) {
      return {
        teamStats: {
          teamAverage: 0,
          activeMembers: 0,
          teamRank: 0,
          monthlyGoal: 0,
        }
      };
    }

    // Get team member stats
    // Note: Firestore 'in' query is limited to 10 items. 
    // Assuming team size is small.
    const memberIds = team.members || [];

    let activeMembers = 0;
    let teamAverage = 0;

    if (memberIds.length > 0) {
      const today = new Date().toISOString().split('T')[0];
      // We can't easily do 'in' query for large arrays, so we might need to fetch individually or restructure.
      // For now, let's assume we fetch stats for the team.
      // Alternatively, fetch all daily_stats for today and filter in memory (if dataset is small)
      // or rely on a pre-calculated team stat.

      // Mocking for now as we don't have the full backend logic for aggregation
      activeMembers = Math.floor(memberIds.length * 0.8);
      teamAverage = 3.5;
    }

    return {
      teamStats: {
        teamAverage,
        activeMembers,
        teamRank: Math.floor(Math.random() * 15) + 1,
        monthlyGoal: 85,
      }
    };
  };

  const fetchAdvisorStats = async () => {
    if (!profile?.section_id) return {};

    // Get section students
    const sectionStudents = await dbService.query('profiles', {
      where: [
        ['section_id', '==', profile.section_id],
        ['role', '==', 'student']
      ]
    });

    if (!sectionStudents?.length) {
      return {
        sectionStats: {
          sectionAverage: 0,
          activeStudents: 0,
          topPerformers: 0,
          needAttention: 0,
        }
      };
    }

    const activeStudents = Math.floor(sectionStudents.length * 0.7);
    const needAttention = sectionStudents.length - activeStudents;

    return {
      sectionStats: {
        sectionAverage: 4.2,
        activeStudents,
        topPerformers: Math.floor(sectionStudents.length * 0.1),
        needAttention,
      }
    };
  };

  const fetchHODStats = async () => {
    if (!profile?.department_id) return {};

    // Get department students
    const deptStudents = await dbService.query('profiles', {
      where: [
        ['department_id', '==', profile.department_id],
        ['role', '==', 'student']
      ]
    });

    if (!deptStudents?.length) {
      return {
        departmentStats: {
          departmentAverage: 0,
          totalStudents: 0,
          placementReady: 0,
          facultyUsage: 0,
        }
      };
    }

    // Get faculty count
    const faculty = await dbService.query('profiles', {
      where: [
        ['department_id', '==', profile.department_id],
        ['role', 'in', ['advisor', 'hod']]
      ]
    });

    return {
      departmentStats: {
        departmentAverage: 3.8,
        totalStudents: deptStudents.length,
        placementReady: Math.floor(deptStudents.length * 0.82),
        facultyUsage: faculty?.length || 0,
      }
    };
  };

  const fetchAdminStats = async () => {
    // Get total user counts
    // Note: Counting all documents in Firestore is expensive. 
    // Ideally we should have a counter document.
    // For now, we'll fetch all profiles (careful with large datasets) or just use a mock/limit.

    // Using a small limit to avoid fetching everything just for a count in this demo
    const allUsers = await dbService.getAll('profiles');
    const totalUsers = allUsers.length;

    return {
      systemStats: {
        systemHealth: 99.2,
        totalUsers,
        apiSuccess: 98.7,
        supportTickets: Math.floor(Math.random() * 5) + 1,
      }
    };
  };

  return { stats, loading, error };
};