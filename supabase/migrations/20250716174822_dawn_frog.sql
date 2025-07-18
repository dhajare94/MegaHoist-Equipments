/*
  # Megahoist Equipments Database Schema

  1. New Tables
    - `admins` - Admin authentication
    - `products` - Main products (RSP, Hoist, Scaffolding)
    - `spare_parts` - Spare parts linked to products
    - `enquiries` - Customer enquiries for spare parts

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for public access and admin management

  3. Initial Data
    - Insert default admin user
    - Add sample products and spare parts
*/

-- Create admins table
CREATE TABLE IF NOT EXISTS admins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  image_url text NOT NULL,
  description text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Create spare_parts table
CREATE TABLE IF NOT EXISTS spare_parts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  image_url text NOT NULL,
  unit text NOT NULL,
  price numeric NOT NULL,
  description text DEFAULT '',
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Create enquiries table
CREATE TABLE IF NOT EXISTS enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  spare_part_id uuid REFERENCES spare_parts(id) ON DELETE CASCADE,
  quantity integer NOT NULL,
  unit text NOT NULL,
  additional text DEFAULT '',
  email text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE spare_parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Admins can manage all admin data"
  ON admins
  FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Products are viewable by everyone"
  ON products
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can manage products"
  ON products
  FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Spare parts are viewable by everyone"
  ON spare_parts
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can manage spare parts"
  ON spare_parts
  FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Enquiries are insertable by everyone"
  ON enquiries
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can view all enquiries"
  ON enquiries
  FOR SELECT
  TO authenticated
  USING (true);

-- Insert default admin user (password: Sbr00216@)
INSERT INTO admins (email, password) VALUES 
('megahoist.in@gmail.com', '$2b$10$8K1p3UOFwqvAL3/wz5RGj.p1/kJJKhDnxWgwmJGxhEyTwU8RhgGXG');

-- Insert sample products
INSERT INTO products (name, image_url, description) VALUES
('RSP (Rack & Pinion Platform)', 'https://images.pexels.com/photos/162568/crane-construction-site-build-162568.jpeg', 'High-quality rack and pinion platforms for construction projects'),
('Material Hoist Machine', 'https://images.pexels.com/photos/1117452/pexels-photo-1117452.jpeg', 'Efficient material hoisting solutions for vertical transportation'),
('Cuplock Scaffolding', 'https://images.pexels.com/photos/3661191/pexels-photo-3661191.jpeg', 'Durable cuplock scaffolding systems for safe construction work');

-- Insert sample spare parts
INSERT INTO spare_parts (name, image_url, unit, price, description, product_id) VALUES
('Rack Bar', 'https://images.pexels.com/photos/162568/crane-construction-site-build-162568.jpeg', 'Nos', 2500.00, 'High-grade steel rack bar for RSP systems', (SELECT id FROM products WHERE name = 'RSP (Rack & Pinion Platform)' LIMIT 1)),
('Pinion Gear', 'https://images.pexels.com/photos/162568/crane-construction-site-build-162568.jpeg', 'Nos', 1800.00, 'Precision engineered pinion gear', (SELECT id FROM products WHERE name = 'RSP (Rack & Pinion Platform)' LIMIT 1)),
('Hoist Motor', 'https://images.pexels.com/photos/1117452/pexels-photo-1117452.jpeg', 'Nos', 15000.00, 'Electric motor for material hoist', (SELECT id FROM products WHERE name = 'Material Hoist Machine' LIMIT 1)),
('Safety Brake', 'https://images.pexels.com/photos/1117452/pexels-photo-1117452.jpeg', 'Nos', 3500.00, 'Emergency safety brake system', (SELECT id FROM products WHERE name = 'Material Hoist Machine' LIMIT 1)),
('Cuplock Standard', 'https://images.pexels.com/photos/3661191/pexels-photo-3661191.jpeg', 'Nos', 450.00, 'Standard vertical cuplock component', (SELECT id FROM products WHERE name = 'Cuplock Scaffolding' LIMIT 1)),
('Ledger Beam', 'https://images.pexels.com/photos/3661191/pexels-photo-3661191.jpeg', 'Nos', 380.00, 'Horizontal ledger beam for scaffolding', (SELECT id FROM products WHERE name = 'Cuplock Scaffolding' LIMIT 1));