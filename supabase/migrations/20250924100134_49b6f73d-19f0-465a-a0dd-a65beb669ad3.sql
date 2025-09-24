-- Insert missing departments
INSERT INTO departments (name, code) VALUES 
('Information Communication and Bio-Technology', 'ICB'),
('Robotics and Automation', 'RA'),
('Electrical and Electronics Engineering', 'EEE'),
('Mechanical Engineering', 'MECH'),
('Food Technology', 'FT')
ON CONFLICT (name) DO NOTHING;

-- Create admin action logs table for audit trail
CREATE TABLE IF NOT EXISTS admin_actions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID NOT NULL,
  action_type TEXT NOT NULL,
  target_table TEXT,
  target_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on admin actions
ALTER TABLE admin_actions ENABLE ROW LEVEL SECURITY;

-- Admin actions can only be viewed by admins
DROP POLICY IF EXISTS "Admins can view admin actions" ON admin_actions;
CREATE POLICY "Admins can view admin actions" ON admin_actions
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE user_id::text = auth.uid()::text 
    AND role = 'admin'
  )
);

-- Create system settings table for dynamic configuration
CREATE TABLE IF NOT EXISTS system_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value JSONB NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on system settings
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- Admins can manage system settings
DROP POLICY IF EXISTS "Admins can manage system settings" ON system_settings;
CREATE POLICY "Admins can manage system settings" ON system_settings
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE user_id::text = auth.uid()::text 
    AND role = 'admin'
  )
);

-- Public settings can be read by authenticated users
DROP POLICY IF EXISTS "Public settings readable by authenticated users" ON system_settings;
CREATE POLICY "Public settings readable by authenticated users" ON system_settings
FOR SELECT USING (is_public = true AND auth.uid() IS NOT NULL);

-- Insert default system settings
INSERT INTO system_settings (setting_key, setting_value, description, is_public) VALUES
('platform_maintenance_mode', 'false', 'Enable/disable platform maintenance mode', true),
('max_team_size', '8', 'Maximum number of members allowed per team', true),
('registration_enabled', 'true', 'Enable/disable new user registrations', true),
('supported_platforms', '["leetcode", "skillrack", "codechef", "hackerrank", "github"]', 'List of supported coding platforms', true)
ON CONFLICT (setting_key) DO NOTHING;

-- Add trigger for updated_at on system_settings
DROP TRIGGER IF EXISTS update_system_settings_updated_at ON system_settings;
CREATE TRIGGER update_system_settings_updated_at
  BEFORE UPDATE ON system_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enhanced RLS policies for admin access
DROP POLICY IF EXISTS "Admins can manage all departments" ON departments;
CREATE POLICY "Admins can manage all departments" ON departments
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE user_id::text = auth.uid()::text 
    AND role = 'admin'
  )
);

DROP POLICY IF EXISTS "Admins can view all user profiles" ON profiles;
CREATE POLICY "Admins can view all user profiles" ON profiles
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM profiles p 
    WHERE p.user_id::text = auth.uid()::text 
    AND p.role = 'admin'
  )
);

DROP POLICY IF EXISTS "Admins can manage all user profiles" ON profiles;
CREATE POLICY "Admins can manage all user profiles" ON profiles
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles p 
    WHERE p.user_id::text = auth.uid()::text 
    AND p.role = 'admin'
  )
);