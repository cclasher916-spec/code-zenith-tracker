-- Drop problematic policies that cause infinite recursion
DROP POLICY IF EXISTS "Users can view team members' stats" ON daily_stats;
DROP POLICY IF EXISTS "Users can view skills of team members" ON skills;
DROP POLICY IF EXISTS "Users can view experience of team members" ON experience;
DROP POLICY IF EXISTS "Users can view education of team members" ON education;
DROP POLICY IF EXISTS "Users can view achievements of team members" ON achievements;

-- Create security definer function to check team membership
CREATE OR REPLACE FUNCTION public.user_is_in_same_team(_user_id uuid, _target_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM team_members tm1
    INNER JOIN team_members tm2 ON tm1.team_id = tm2.team_id
    WHERE tm1.user_id = _user_id
      AND tm2.user_id = _target_user_id
      AND tm1.is_active = true
      AND tm2.is_active = true
  );
$$;

-- Recreate policies using the security definer function
CREATE POLICY "Users can view team members' stats" 
ON daily_stats FOR SELECT
USING (
  (auth.uid())::text = (user_id)::text 
  OR public.user_is_in_same_team(auth.uid(), user_id)
);

CREATE POLICY "Users can view skills of team members"
ON skills FOR SELECT
USING (public.user_is_in_same_team(auth.uid(), user_id));

CREATE POLICY "Users can view experience of team members"
ON experience FOR SELECT
USING (public.user_is_in_same_team(auth.uid(), user_id));

CREATE POLICY "Users can view education of team members"
ON education FOR SELECT
USING (public.user_is_in_same_team(auth.uid(), user_id));

CREATE POLICY "Users can view achievements of team members"
ON achievements FOR SELECT
USING (public.user_is_in_same_team(auth.uid(), user_id));