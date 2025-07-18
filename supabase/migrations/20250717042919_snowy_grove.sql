/*
  # Create Admin User in Supabase Auth

  This migration creates the admin user in Supabase Auth system.
  You need to manually create this user in your Supabase dashboard:
  
  1. Go to Authentication > Users in your Supabase dashboard
  2. Click "Add user"
  3. Email: megahoist.in@gmail.com
  4. Password: Sbr00216@
  5. Email Confirm: true
  
  OR run this SQL in your Supabase SQL Editor:
*/

-- Insert admin user into auth.users (this should be done via Supabase dashboard)
-- This is just for reference - use the dashboard method instead

-- Make sure the admin exists in our admins table
INSERT INTO admins (email, password) VALUES 
('megahoist.in@gmail.com', 'Sbr00216@')
ON CONFLICT (email) DO NOTHING;