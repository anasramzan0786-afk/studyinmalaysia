-- Enable RLS on tables
ALTER TABLE "university" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "program" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "inquiry" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;

-- University policies
CREATE POLICY "university_public_select" ON "university" FOR SELECT USING (true);
CREATE POLICY "university_admin_insert" ON "university" FOR INSERT USING (jwt.claims.role = 'admin');
CREATE POLICY "university_admin_update" ON "university" FOR UPDATE USING (jwt.claims.role = 'admin');
CREATE POLICY "university_admin_delete" ON "university" FOR DELETE USING (jwt.claims.role = 'admin');

-- Program policies
CREATE POLICY "program_public_select" ON "program" FOR SELECT USING (true);
CREATE POLICY "program_admin_insert" ON "program" FOR INSERT USING (jwt.claims.role = 'admin');
CREATE POLICY "program_admin_update" ON "program" FOR UPDATE USING (jwt.claims.role = 'admin');
CREATE POLICY "program_admin_delete" ON "program" FOR DELETE USING (jwt.claims.role = 'admin');

-- Inquiry policies
CREATE POLICY "inquiry_public_insert" ON "inquiry" FOR INSERT USING (true);
CREATE POLICY "inquiry_admin_select" ON "inquiry" FOR SELECT USING (jwt.claims.role = 'admin');
CREATE POLICY "inquiry_admin_update" ON "inquiry" FOR UPDATE USING (jwt.claims.role = 'admin');
CREATE POLICY "inquiry_admin_delete" ON "inquiry" FOR DELETE USING (jwt.claims.role = 'admin');

-- Users policies
CREATE POLICY "users_self_select" ON "users" FOR SELECT USING (auth.uid() = id);
CREATE POLICY "users_self_update" ON "users" FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "users_admin_all" ON "users" FOR ALL USING (jwt.claims.role = 'admin');
