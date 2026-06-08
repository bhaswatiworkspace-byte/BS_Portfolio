
-- Projects
CREATE TABLE IF NOT EXISTS projects (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  subtitle text DEFAULT '',
  description text DEFAULT '',
  external_url text DEFAULT '',
  tags text[] DEFAULT '{}',
  year text DEFAULT '',
  featured boolean DEFAULT false,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Project media (images + videos)
CREATE TABLE IF NOT EXISTS project_media (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  url text NOT NULL,
  media_type text DEFAULT 'image' CHECK (media_type IN ('image', 'video')),
  caption text DEFAULT '',
  is_primary boolean DEFAULT false,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Contact submissions
CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text DEFAULT '',
  phone text DEFAULT '',
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "projects_select_all" ON projects FOR SELECT USING (true);
CREATE POLICY "projects_insert_auth" ON projects FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "projects_update_auth" ON projects FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "projects_delete_auth" ON projects FOR DELETE TO authenticated USING (true);

CREATE POLICY "media_select_all" ON project_media FOR SELECT USING (true);
CREATE POLICY "media_insert_auth" ON project_media FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "media_update_auth" ON project_media FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "media_delete_auth" ON project_media FOR DELETE TO authenticated USING (true);

CREATE POLICY "contact_insert_all" ON contact_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "contact_select_auth" ON contact_submissions FOR SELECT TO authenticated USING (true);

-- Seed projects
INSERT INTO projects (title, subtitle, description, external_url, tags, year, featured, order_index) VALUES
  ('Morphic', 'Interactive Brand Experience', 'Award-winning immersive 3D brand experience for a global tech startup. Real-time particle simulations and custom shader effects that push the boundaries of creative web development.', 'https://example.com', ARRAY['WebGL', 'Three.js', 'Creative Dev'], '2024', true, 1),
  ('Lumina', 'Luxury E-Commerce Platform', 'Motion-driven luxury e-commerce platform with custom physics-based scroll, 3D product configurator, and seamless checkout flow. Built for performance and delight.', 'https://example.com', ARRAY['React', 'Motion', 'Design'], '2024', true, 2),
  ('Prism', 'Data Visualization Dashboard', 'Real-time analytics dashboard for a FinTech company. Custom SVG animations, live data streaming, and responsive data storytelling.', 'https://example.com', ARRAY['D3.js', 'TypeScript', 'Data Viz'], '2023', false, 3),
  ('Vanta', 'Architecture Studio Identity', 'Full digital identity and web presence for an award-winning architecture firm. Minimal, editorial design with cinematic transitions and immersive showcases.', 'https://example.com', ARRAY['Design', 'Development', 'Branding'], '2023', false, 4);

WITH p AS (SELECT id FROM projects WHERE title = 'Morphic' LIMIT 1)
INSERT INTO project_media (project_id, url, media_type, is_primary, order_index)
SELECT id, 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1280', 'image', true, 1 FROM p;

WITH p AS (SELECT id FROM projects WHERE title = 'Lumina' LIMIT 1)
INSERT INTO project_media (project_id, url, media_type, is_primary, order_index)
SELECT id, 'https://images.pexels.com/photos/5632388/pexels-photo-5632388.jpeg?auto=compress&cs=tinysrgb&w=1280', 'image', true, 1 FROM p;

WITH p AS (SELECT id FROM projects WHERE title = 'Prism' LIMIT 1)
INSERT INTO project_media (project_id, url, media_type, is_primary, order_index)
SELECT id, 'https://images.pexels.com/photos/669615/pexels-photo-669615.jpeg?auto=compress&cs=tinysrgb&w=1280', 'image', true, 1 FROM p;

WITH p AS (SELECT id FROM projects WHERE title = 'Vanta' LIMIT 1)
INSERT INTO project_media (project_id, url, media_type, is_primary, order_index)
SELECT id, 'https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg?auto=compress&cs=tinysrgb&w=1280', 'image', true, 1 FROM p;
