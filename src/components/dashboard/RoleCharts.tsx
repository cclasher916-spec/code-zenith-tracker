import {
  LineChart,
  Line,
  BarChart,
  Bar,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

// Sample data for charts - In production, this would come from props
const weeklyTrendData = [
  { day: 'Mon', problems: 12, streak: 5 },
  { day: 'Tue', problems: 15, streak: 6 },
  { day: 'Wed', problems: 8, streak: 7 },
  { day: 'Thu', problems: 18, streak: 8 },
  { day: 'Fri', problems: 14, streak: 9 },
  { day: 'Sat', problems: 22, streak: 10 },
  { day: 'Sun', problems: 16, streak: 11 },
];

const difficultyData = [
  { category: 'Easy', value: 65 },
  { category: 'Medium', value: 45 },
  { category: 'Hard', value: 25 },
];

const teamMemberData = [
  { name: 'Member 1', problems: 45 },
  { name: 'Member 2', problems: 38 },
  { name: 'Member 3', problems: 52 },
  { name: 'Member 4', problems: 28 },
  { name: 'Member 5', problems: 41 },
];

const sectionLeaderboardData = [
  { name: 'Student A', score: 95 },
  { name: 'Student B', score: 88 },
  { name: 'Student C', score: 82 },
  { name: 'Student D', score: 78 },
  { name: 'Student E', score: 75 },
];

const departmentTrendData = [
  { month: 'Jan', avg: 3.2, target: 4 },
  { month: 'Feb', avg: 3.8, target: 4 },
  { month: 'Mar', avg: 4.2, target: 4 },
  { month: 'Apr', avg: 4.5, target: 4 },
  { month: 'May', avg: 4.8, target: 4 },
  { month: 'Jun', avg: 5.1, target: 4 },
];

const userRoleDistribution = [
  { role: 'Students', count: 450 },
  { role: 'Team Leads', count: 58 },
  { role: 'Advisors', count: 12 },
  { role: 'HODs', count: 3 },
  { role: 'Admins', count: 2 },
];

interface ChartProps {
  color: string;
}

export const StudentPerformanceChart = ({ color }: ChartProps) => (
  <ResponsiveContainer width="100%" height={250}>
    <AreaChart data={weeklyTrendData}>
      <defs>
        <linearGradient id="colorProblems" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
          <stop offset="95%" stopColor={color} stopOpacity={0}/>
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
      <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
      <YAxis stroke="hsl(var(--muted-foreground))" />
      <Tooltip 
        contentStyle={{ 
          backgroundColor: 'hsl(var(--card))', 
          border: '1px solid hsl(var(--border))',
          borderRadius: '8px'
        }} 
      />
      <Area 
        type="monotone" 
        dataKey="problems" 
        stroke={color} 
        fillOpacity={1} 
        fill="url(#colorProblems)" 
        strokeWidth={2}
      />
    </AreaChart>
  </ResponsiveContainer>
);

export const StudentDifficultyRadar = ({ color }: ChartProps) => (
  <ResponsiveContainer width="100%" height={250}>
    <RadarChart data={difficultyData}>
      <PolarGrid stroke="hsl(var(--border))" />
      <PolarAngleAxis dataKey="category" stroke="hsl(var(--muted-foreground))" />
      <PolarRadiusAxis stroke="hsl(var(--muted-foreground))" />
      <Radar 
        dataKey="value" 
        stroke={color} 
        fill={color} 
        fillOpacity={0.3} 
        strokeWidth={2}
      />
      <Tooltip 
        contentStyle={{ 
          backgroundColor: 'hsl(var(--card))', 
          border: '1px solid hsl(var(--border))',
          borderRadius: '8px'
        }} 
      />
    </RadarChart>
  </ResponsiveContainer>
);

export const TeamMemberBarChart = ({ color }: ChartProps) => (
  <ResponsiveContainer width="100%" height={250}>
    <BarChart data={teamMemberData}>
      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
      <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
      <YAxis stroke="hsl(var(--muted-foreground))" />
      <Tooltip 
        contentStyle={{ 
          backgroundColor: 'hsl(var(--card))', 
          border: '1px solid hsl(var(--border))',
          borderRadius: '8px'
        }} 
      />
      <Bar dataKey="problems" fill={color} radius={[8, 8, 0, 0]} />
    </BarChart>
  </ResponsiveContainer>
);

export const SectionLeaderboardChart = ({ color }: ChartProps) => (
  <ResponsiveContainer width="100%" height={250}>
    <BarChart data={sectionLeaderboardData} layout="vertical">
      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
      <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
      <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" width={80} />
      <Tooltip 
        contentStyle={{ 
          backgroundColor: 'hsl(var(--card))', 
          border: '1px solid hsl(var(--border))',
          borderRadius: '8px'
        }} 
      />
      <Bar dataKey="score" fill={color} radius={[0, 8, 8, 0]} />
    </BarChart>
  </ResponsiveContainer>
);

export const DepartmentTrendChart = ({ color }: ChartProps) => (
  <ResponsiveContainer width="100%" height={250}>
    <LineChart data={departmentTrendData}>
      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
      <YAxis stroke="hsl(var(--muted-foreground))" />
      <Tooltip 
        contentStyle={{ 
          backgroundColor: 'hsl(var(--card))', 
          border: '1px solid hsl(var(--border))',
          borderRadius: '8px'
        }} 
      />
      <Legend />
      <Line type="monotone" dataKey="avg" stroke={color} strokeWidth={3} name="Actual" />
      <Line type="monotone" dataKey="target" stroke="hsl(var(--muted-foreground))" strokeWidth={2} strokeDasharray="5 5" name="Target" />
    </LineChart>
  </ResponsiveContainer>
);

export const UserDistributionChart = ({ color }: ChartProps) => (
  <ResponsiveContainer width="100%" height={250}>
    <BarChart data={userRoleDistribution}>
      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
      <XAxis dataKey="role" stroke="hsl(var(--muted-foreground))" />
      <YAxis stroke="hsl(var(--muted-foreground))" />
      <Tooltip 
        contentStyle={{ 
          backgroundColor: 'hsl(var(--card))', 
          border: '1px solid hsl(var(--border))',
          borderRadius: '8px'
        }} 
      />
      <Bar dataKey="count" fill={color} radius={[8, 8, 0, 0]} />
    </BarChart>
  </ResponsiveContainer>
);
