-- Create skills table
CREATE TABLE public.skills (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT,
  level TEXT CHECK (level IN ('Beginner', 'Intermediate', 'Advanced', 'Expert')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, name)
);

-- Create experience table
CREATE TABLE public.experience (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company TEXT NOT NULL,
  position TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  is_current BOOLEAN NOT NULL DEFAULT false,
  description TEXT,
  skills_used TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create education table
CREATE TABLE public.education (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  institution TEXT NOT NULL,
  degree TEXT NOT NULL,
  field TEXT,
  start_year INTEGER NOT NULL,
  end_year INTEGER,
  percentage_cgpa DECIMAL(5,2),
  achievements TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create achievements table
CREATE TABLE public.achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  icon TEXT,
  is_locked BOOLEAN NOT NULL DEFAULT false
);

-- Create activity_log table
CREATE TABLE public.activity_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  message TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add additional fields to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS date_of_birth DATE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS gender TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS cgpa DECIMAL(4,2);
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS semester INTEGER;

-- Enable RLS
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies for skills
CREATE POLICY "Users can manage their own skills"
ON public.skills FOR ALL
USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view skills of team members"
ON public.skills FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM team_members tm1
    JOIN team_members tm2 ON tm1.team_id = tm2.team_id
    WHERE tm1.user_id::text = auth.uid()::text
    AND tm2.user_id = skills.user_id
  )
);

-- RLS Policies for experience
CREATE POLICY "Users can manage their own experience"
ON public.experience FOR ALL
USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view experience of team members"
ON public.experience FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM team_members tm1
    JOIN team_members tm2 ON tm1.team_id = tm2.team_id
    WHERE tm1.user_id::text = auth.uid()::text
    AND tm2.user_id = experience.user_id
  )
);

-- RLS Policies for education
CREATE POLICY "Users can manage their own education"
ON public.education FOR ALL
USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view education of team members"
ON public.education FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM team_members tm1
    JOIN team_members tm2 ON tm1.team_id = tm2.team_id
    WHERE tm1.user_id::text = auth.uid()::text
    AND tm2.user_id = education.user_id
  )
);

-- RLS Policies for achievements
CREATE POLICY "Users can view their own achievements"
ON public.achievements FOR SELECT
USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view achievements of team members"
ON public.achievements FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM team_members tm1
    JOIN team_members tm2 ON tm1.team_id = tm2.team_id
    WHERE tm1.user_id::text = auth.uid()::text
    AND tm2.user_id = achievements.user_id
  )
);

-- RLS Policies for activity_log
CREATE POLICY "Users can view their own activity"
ON public.activity_log FOR SELECT
USING (auth.uid()::text = user_id::text);

-- Triggers for updated_at
CREATE TRIGGER update_experience_updated_at
BEFORE UPDATE ON public.experience
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_education_updated_at
BEFORE UPDATE ON public.education
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();