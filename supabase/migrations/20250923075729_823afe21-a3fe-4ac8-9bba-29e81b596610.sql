-- MVIT Coding Tracker Database Schema
-- Complete database structure with role-based security

-- Create custom types for roles and statuses
CREATE TYPE user_role AS ENUM ('student', 'team_lead', 'advisor', 'hod', 'admin');
CREATE TYPE approval_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE team_status AS ENUM ('pending', 'approved', 'active', 'inactive');

-- Departments table
CREATE TABLE public.departments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  code TEXT NOT NULL UNIQUE,
  hod_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Sections table  
CREATE TABLE public.sections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  department_id UUID NOT NULL REFERENCES public.departments(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  advisor_id UUID,
  academic_year TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(department_id, code, academic_year)
);

-- User profiles table (extends auth.users)
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  roll_number TEXT UNIQUE,
  phone TEXT,
  department_id UUID REFERENCES public.departments(id),
  section_id UUID REFERENCES public.sections(id),
  role user_role NOT NULL DEFAULT 'student',
  academic_year TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Teams table
CREATE TABLE public.teams (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  department_id UUID NOT NULL REFERENCES public.departments(id),
  section_id UUID NOT NULL REFERENCES public.sections(id),
  academic_year TEXT NOT NULL,
  team_lead_id UUID NOT NULL REFERENCES public.profiles(id),
  max_members INTEGER NOT NULL DEFAULT 8,
  current_count INTEGER NOT NULL DEFAULT 1,
  status team_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Team members junction table
CREATE TABLE public.team_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true,
  UNIQUE(team_id, user_id)
);

-- Platform profiles for each user
CREATE TABLE public.platform_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('leetcode', 'github', 'codechef', 'hackerrank', 'skillrack')),
  username TEXT NOT NULL,
  profile_url TEXT,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, platform)
);

-- Daily statistics from platforms
CREATE TABLE public.daily_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  platform TEXT NOT NULL CHECK (platform IN ('leetcode', 'github', 'codechef', 'hackerrank', 'skillrack')),
  total_solved INTEGER NOT NULL DEFAULT 0,
  daily_increase INTEGER NOT NULL DEFAULT 0,
  rank_in_team INTEGER,
  rank_in_section INTEGER,
  coding_streak INTEGER NOT NULL DEFAULT 0,
  last_activity_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, date, platform)
);

-- Team approval requests
CREATE TABLE public.approval_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  approver_id UUID NOT NULL REFERENCES public.profiles(id),
  approval_level TEXT NOT NULL CHECK (approval_level IN ('advisor', 'hod', 'admin')),
  status approval_status NOT NULL DEFAULT 'pending',
  comments TEXT,
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('info', 'success', 'warning', 'error')),
  is_read BOOLEAN NOT NULL DEFAULT false,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User preferences for notifications
CREATE TABLE public.user_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  email_notifications BOOLEAN NOT NULL DEFAULT true,
  whatsapp_notifications BOOLEAN NOT NULL DEFAULT false,
  daily_reports BOOLEAN NOT NULL DEFAULT true,
  weekly_reports BOOLEAN NOT NULL DEFAULT true,
  privacy_level TEXT NOT NULL DEFAULT 'public' CHECK (privacy_level IN ('public', 'friends', 'private')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approval_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_profiles_department_section ON public.profiles(department_id, section_id);
CREATE INDEX idx_daily_stats_user_date ON public.daily_stats(user_id, date);
CREATE INDEX idx_daily_stats_date_platform ON public.daily_stats(date, platform);
CREATE INDEX idx_team_members_team_id ON public.team_members(team_id);
CREATE INDEX idx_notifications_user_id_read ON public.notifications(user_id, is_read);

-- RLS Policies

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR ALL USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view profiles in their department" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.user_id::text = auth.uid()::text 
      AND p.department_id = profiles.department_id
    )
  );

CREATE POLICY "Advisors can view profiles in their sections" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.user_id::text = auth.uid()::text 
      AND p.role IN ('advisor', 'hod', 'admin')
      AND p.section_id = profiles.section_id
    )
  );

CREATE POLICY "HODs and admins can view all profiles in department" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.user_id::text = auth.uid()::text 
      AND p.role IN ('hod', 'admin')
      AND (p.department_id = profiles.department_id OR p.role = 'admin')
    )
  );

-- Teams policies
CREATE POLICY "Users can view teams in their section" ON public.teams
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.user_id::text = auth.uid()::text 
      AND p.section_id = teams.section_id
    )
  );

CREATE POLICY "Team leads can manage their teams" ON public.teams
  FOR ALL USING (auth.uid()::text = team_lead_id::text);

CREATE POLICY "Advisors can manage teams in their sections" ON public.teams
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.user_id::text = auth.uid()::text 
      AND p.role IN ('advisor', 'hod', 'admin')
      AND p.section_id = teams.section_id
    )
  );

-- Team members policies
CREATE POLICY "Users can view team members for their teams" ON public.team_members
  FOR SELECT USING (
    user_id::text = auth.uid()::text OR
    EXISTS (
      SELECT 1 FROM public.teams t 
      WHERE t.id = team_members.team_id 
      AND t.team_lead_id::text = auth.uid()::text
    ) OR
    EXISTS (
      SELECT 1 FROM public.team_members tm 
      WHERE tm.team_id = team_members.team_id 
      AND tm.user_id::text = auth.uid()::text
    )
  );

-- Platform profiles policies
CREATE POLICY "Users can manage their own platform profiles" ON public.platform_profiles
  FOR ALL USING (auth.uid()::text = user_id::text);

CREATE POLICY "Team members can view each other's platform profiles" ON public.platform_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.team_members tm1
      JOIN public.team_members tm2 ON tm1.team_id = tm2.team_id
      WHERE tm1.user_id::text = auth.uid()::text 
      AND tm2.user_id = platform_profiles.user_id
    )
  );

-- Daily stats policies
CREATE POLICY "Users can view their own stats" ON public.daily_stats
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view team members' stats" ON public.daily_stats
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.team_members tm1
      JOIN public.team_members tm2 ON tm1.team_id = tm2.team_id
      WHERE tm1.user_id::text = auth.uid()::text 
      AND tm2.user_id = daily_stats.user_id
    )
  );

CREATE POLICY "Faculty can view stats in their scope" ON public.daily_stats
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles p1
      JOIN public.profiles p2 ON (
        (p1.role = 'advisor' AND p1.section_id = p2.section_id) OR
        (p1.role = 'hod' AND p1.department_id = p2.department_id) OR
        (p1.role = 'admin')
      )
      WHERE p1.user_id::text = auth.uid()::text 
      AND p2.user_id = daily_stats.user_id
    )
  );

-- Notifications policies
CREATE POLICY "Users can view their own notifications" ON public.notifications
  FOR ALL USING (auth.uid()::text = user_id::text);

-- User preferences policies
CREATE POLICY "Users can manage their own preferences" ON public.user_preferences
  FOR ALL USING (auth.uid()::text = user_id::text);

-- Departments and sections - readable by authenticated users
CREATE POLICY "Authenticated users can view departments" ON public.departments
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can view sections" ON public.sections
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- HODs and admins can manage departments/sections
CREATE POLICY "HODs and admins can manage departments" ON public.departments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.user_id::text = auth.uid()::text 
      AND p.role IN ('hod', 'admin')
    )
  );

CREATE POLICY "Advisors, HODs and admins can manage sections" ON public.sections
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.user_id::text = auth.uid()::text 
      AND p.role IN ('advisor', 'hod', 'admin')
    )
  );

-- Functions for automatic updates
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for automatic timestamp updates
CREATE TRIGGER update_departments_updated_at
  BEFORE UPDATE ON public.departments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sections_updated_at
  BEFORE UPDATE ON public.sections
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_teams_updated_at
  BEFORE UPDATE ON public.teams
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_daily_stats_updated_at
  BEFORE UPDATE ON public.daily_stats
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON public.user_preferences
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data
INSERT INTO public.departments (name, code) VALUES 
('Artificial Intelligence and Machine Learning', 'AIML'),
('Computer Science and Engineering', 'CSE'),
('Information Technology', 'IT'),
('Electronics and Communication Engineering', 'ECE');

-- Insert sample sections
INSERT INTO public.sections (department_id, name, code, academic_year) 
SELECT d.id, 'Section A', 'A', '2024-25' FROM public.departments d WHERE d.code = 'AIML'
UNION ALL
SELECT d.id, 'Section B', 'B', '2024-25' FROM public.departments d WHERE d.code = 'AIML'
UNION ALL  
SELECT d.id, 'Section A', 'A', '2024-25' FROM public.departments d WHERE d.code = 'CSE'
UNION ALL
SELECT d.id, 'Section B', 'B', '2024-25' FROM public.departments d WHERE d.code = 'CSE';