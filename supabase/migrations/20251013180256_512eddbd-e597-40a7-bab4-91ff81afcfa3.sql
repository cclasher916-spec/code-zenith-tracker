-- Drop the problematic policy that causes infinite recursion
DROP POLICY IF EXISTS "Users can view team members for their teams" ON public.team_members;

-- Create a security definer function to check if user is in the same team
CREATE OR REPLACE FUNCTION public.is_team_member(_user_id uuid, _team_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.team_members
    WHERE user_id = _user_id
      AND team_id = _team_id
      AND is_active = true
  )
$$;

-- Create a security definer function to check if user is team lead
CREATE OR REPLACE FUNCTION public.is_team_lead(_user_id uuid, _team_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.teams
    WHERE id = _team_id
      AND team_lead_id = _user_id
  )
$$;

-- Create new RLS policy without recursion
CREATE POLICY "Users can view team members for their teams"
ON public.team_members
FOR SELECT
USING (
  -- User can see their own membership
  (user_id = auth.uid())
  OR
  -- User can see members of teams they lead
  public.is_team_lead(auth.uid(), team_id)
  OR
  -- User can see other members of their teams
  public.is_team_member(auth.uid(), team_id)
);