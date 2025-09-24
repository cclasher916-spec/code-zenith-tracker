-- Fix recursive RLS policies by introducing SECURITY DEFINER helper functions
-- and rewriting policies to avoid self-referential subqueries on the same table

-- 1) Helper functions
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS user_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE user_id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.get_current_user_department_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT department_id FROM public.profiles WHERE user_id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.get_current_user_section_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT section_id FROM public.profiles WHERE user_id = auth.uid();
$$;

-- 2) Recreate problematic policies to eliminate recursive references
-- PROFILES
DROP POLICY IF EXISTS "Admins can manage all user profiles" ON public.profiles;
CREATE POLICY "Admins can manage all user profiles"
ON public.profiles
FOR ALL
TO authenticated
USING (public.get_current_user_role() = 'admin')
WITH CHECK (public.get_current_user_role() = 'admin');

DROP POLICY IF EXISTS "Admins can view all user profiles" ON public.profiles;
CREATE POLICY "Admins can view all user profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (public.get_current_user_role() = 'admin');

DROP POLICY IF EXISTS "Advisors can view profiles in their sections" ON public.profiles;
CREATE POLICY "Advisors can view profiles in their sections"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  public.get_current_user_role() = 'advisor'
  AND profiles.section_id IS NOT NULL
  AND profiles.section_id = public.get_current_user_section_id()
);

DROP POLICY IF EXISTS "HODs and admins can view all profiles in department" ON public.profiles;
CREATE POLICY "HODs and admins can view all profiles in department"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  (public.get_current_user_role() = 'hod' AND profiles.department_id = public.get_current_user_department_id())
  OR public.get_current_user_role() = 'admin'
);

DROP POLICY IF EXISTS "Users can view profiles in their department" ON public.profiles;
CREATE POLICY "Users can view profiles in their department"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  profiles.department_id = public.get_current_user_department_id()
);

-- Keep the existing self-access policy (assumed present):
-- "Users can view their own profile" FOR ALL USING (auth.uid() = user_id)

-- DEPARTMENTS
DROP POLICY IF EXISTS "Admins can manage all departments" ON public.departments;
CREATE POLICY "Admins can manage all departments"
ON public.departments
FOR ALL
TO authenticated
USING (public.get_current_user_role() = 'admin')
WITH CHECK (public.get_current_user_role() = 'admin');

DROP POLICY IF EXISTS "HODs and admins can manage departments" ON public.departments;
CREATE POLICY "HODs and admins can manage departments"
ON public.departments
FOR ALL
TO authenticated
USING (public.get_current_user_role() IN ('hod','admin'))
WITH CHECK (public.get_current_user_role() IN ('hod','admin'));

-- Keep: "Authenticated users can view departments" unchanged

-- SECTIONS
DROP POLICY IF EXISTS "Advisors, HODs and admins can manage sections" ON public.sections;
CREATE POLICY "Advisors, HODs and admins can manage sections"
ON public.sections
FOR ALL
TO authenticated
USING (public.get_current_user_role() IN ('advisor','hod','admin'))
WITH CHECK (public.get_current_user_role() IN ('advisor','hod','admin'));

-- Keep: "Authenticated users can view sections" unchanged

-- SYSTEM SETTINGS
DROP POLICY IF EXISTS "Admins can manage system settings" ON public.system_settings;
CREATE POLICY "Admins can manage system settings"
ON public.system_settings
FOR ALL
TO authenticated
USING (public.get_current_user_role() = 'admin')
WITH CHECK (public.get_current_user_role() = 'admin');

-- Keep: "Public settings readable by authenticated users" unchanged

-- ADMIN ACTIONS
DROP POLICY IF EXISTS "Admins can view admin actions" ON public.admin_actions;
CREATE POLICY "Admins can view admin actions"
ON public.admin_actions
FOR SELECT
TO authenticated
USING (public.get_current_user_role() = 'admin');
