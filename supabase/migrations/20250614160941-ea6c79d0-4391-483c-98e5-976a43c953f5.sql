
-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create news table for dynamic news content
CREATE TABLE public.news (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title_en TEXT NOT NULL,
  title_ar TEXT,
  title_ku TEXT,
  description_en TEXT NOT NULL,
  description_ar TEXT,
  description_ku TEXT,
  category TEXT NOT NULL CHECK (category IN ('placesVisited', 'visitors', 'certificatesReceived', 'certificatesAwarded')),
  image_url TEXT,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on news (public read access)
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

-- News policies - allow public read access
CREATE POLICY "Anyone can view news" ON public.news
  FOR SELECT TO anon, authenticated
  USING (true);

-- Create projects table for dynamic project content
CREATE TABLE public.projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title_en TEXT NOT NULL,
  title_ar TEXT,
  title_ku TEXT,
  description_en TEXT NOT NULL,
  description_ar TEXT,
  description_ku TEXT,
  category TEXT NOT NULL CHECK (category IN ('education', 'healthcare', 'water', 'emergency')),
  image_url TEXT,
  location TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'planned')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on projects (public read access)
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Projects policies - allow public read access
CREATE POLICY "Anyone can view projects" ON public.projects
  FOR SELECT TO anon, authenticated
  USING (true);

-- Create staff table for team members
CREATE TABLE public.staff (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name_en TEXT NOT NULL,
  name_ar TEXT,
  name_ku TEXT,
  position_en TEXT NOT NULL,
  position_ar TEXT,
  position_ku TEXT,
  bio_en TEXT,
  bio_ar TEXT,
  bio_ku TEXT,
  image_url TEXT,
  email TEXT,
  phone TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on staff (public read access)
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;

-- Staff policies - allow public read access
CREATE POLICY "Anyone can view staff" ON public.staff
  FOR SELECT TO anon, authenticated
  USING (is_active = true);

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample news data
INSERT INTO public.news (title_en, title_ar, title_ku, description_en, description_ar, description_ku, category, image_url, date) VALUES
('Visit to Erbil Schools', 'زيارة مدارس أربيل', 'سەردانی قوتابخانەکانی هەولێر', 'Successful visit to 5 schools in Erbil province to assess educational needs and infrastructure.', 'زيارة ناجحة لـ 5 مدارس في محافظة أربيل لتقييم الاحتياجات التعليمية والبنية التحتية.', 'سەردانێکی سەرکەوتوو بۆ 5 قوتابخانە لە پارێزگای هەولێر بۆ هەڵسەنگاندنی پێداویستیە پەروەردەیەکان.', 'placesVisited', 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=400&h=250&fit=crop', '2024-06-10'),

('UN Representative Visit', 'زيارة ممثل الأمم المتحدة', 'سەردانی نوێنەری نەتەوە یەکگرتووەکان', 'Meeting with UN officials to discuss collaboration opportunities and humanitarian projects.', 'اجتماع مع مسؤولي الأمم المتحدة لمناقشة فرص التعاون والمشاريع الإنسانية.', 'چاوپێکەوتن لەگەڵ کارمەندانی نەتەوە یەکگرتووەکان بۆ گفتوگۆ لەسەر دەرفەتەکانی هاوکاری.', 'visitors', 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&h=250&fit=crop', '2024-06-08'),

('Excellence in Education Award', 'جائزة التميز في التعليم', 'خەڵاتی باشی لە پەروەردە', 'Received recognition for outstanding educational initiatives serving displaced communities.', 'تلقينا اعترافًا بالمبادرات التعليمية المتميزة التي تخدم المجتمعات النازحة.', 'ناسینەوەمان وەرگرت بۆ دەستپێشخەری پەروەردەیی نایاب کە خزمەت بە کۆمەڵگا کۆچبەرەکان دەکات.', 'certificatesReceived', 'https://images.unsplash.com/photo-1569025743873-ea3a9ade89f9?w=400&h=250&fit=crop', '2024-05-30'),

('Community Leader Certification', 'شهادة قائد المجتمع', 'بڕوانامەی ڕابەری کۆمەڵگا', 'Awarded certificates to outstanding community leaders for their dedication to social development.', 'منحنا شهادات لقادة المجتمع المتميزين لتفانيهم في التنمية الاجتماعية.', 'بڕوانامەمان دا بە ڕابەرانی نایابی کۆمەڵگا بۆ تەرخانکردنیان بۆ گەشەسەندنی کۆمەڵایەتی.', 'certificatesAwarded', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop', '2024-06-01');

-- Insert sample projects data
INSERT INTO public.projects (title_en, title_ar, title_ku, description_en, description_ar, description_ku, category, image_url, location, status) VALUES
('Clean Water Initiative', 'مبادرة المياه النظيفة', 'دەستپێشخەری ئاوی پاک', 'Bringing clean water to rural communities through sustainable well construction and maintenance programs.', 'جلب المياه النظيفة للمجتمعات الريفية من خلال برامج بناء وصيانة الآبار المستدامة.', 'هێنانی ئاوی پاک بۆ کۆمەڵگا لادێیەکان لە ڕێگەی بیرەکانی بەردەوام و پڕۆگرامەکانی چاککردنەوە.', 'water', 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=250&fit=crop', 'Dohuk Province', 'active'),

('Education Support Program', 'برنامج دعم التعليم', 'پڕۆگرامی پشتگیری پەروەردە', 'Providing school supplies, scholarships, and educational infrastructure to underprivileged children.', 'توفير المستلزمات المدرسية والمنح الدراسية والبنية التحتية التعليمية للأطفال المحرومين.', 'دابینکردنی کەرەستەی قوتابخانە، بورس و بنکەی تەکنەلۆژیای پەروەردە بۆ منداڵانی بێبەش.', 'education', 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=400&h=250&fit=crop', 'Erbil Province', 'active'),

('Healthcare Mobile Clinic', 'العيادة المتنقلة للرعاية الصحية', 'نەخۆشخانەی گواستراوەی چاودێری تەندروستی', 'Mobile medical units providing primary healthcare services to remote rural communities.', 'وحدات طبية متنقلة تقدم خدمات الرعاية الصحية الأولية للمجتمعات الريفية النائية.', 'یەکە پزیشکیە گواستراوەکان کە خزمەتگوزاری چاودێری تەندروستی سەرەتایی دەگەیەنن بۆ کۆمەڵگا لادێیە دوورەکان.', 'healthcare', 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=250&fit=crop', 'Sulaymaniyah Province', 'active'),

('Emergency Relief Effort', 'جهد الإغاثة الطارئة', 'هەوڵی فریاکەوتنی لەناکاو', 'Disaster response providing food, shelter, medical aid, and psychological support to affected families.', 'الاستجابة للكوارث بتوفير الطعام والمأوى والمساعدة الطبية والدعم النفسي للعائلات المتضررة.', 'وەڵامدانەوەی کارەسات بە دابینکردنی خۆراک، پەناگا، یارمەتی پزیشکی و پشتگیری دەروونی بۆ خێزانە زیانمەندەکان.', 'emergency', 'https://images.unsplash.com/photo-1469041797191-50ace28483c3?w=400&h=250&fit=crop', 'Kurdistan Region', 'completed');

-- Insert sample staff data
INSERT INTO public.staff (name_en, name_ar, name_ku, position_en, position_ar, position_ku, bio_en, bio_ar, bio_ku, image_url, email, display_order) VALUES
('Dr. Ahmad Rahman', 'د. أحمد رحمن', 'د. ئەحمەد ڕەحمان', 'Executive Director', 'المدير التنفيذي', 'بەڕێوەبەری جێبەجێکار', 'Leading healthcare initiatives across the Kurdistan region with over 15 years of experience in humanitarian work.', 'يقود مبادرات الرعاية الصحية عبر منطقة كردستان مع أكثر من 15 عاماً من الخبرة في العمل الإنساني.', 'ڕابەری دەستپێشخەری چاودێری تەندروستی لە سەرانسەری هەرێمی کوردستان لەگەڵ زیاتر لە 15 ساڵ ئەزموون لە کاری مرۆیی.', 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop', 'ahmad@mrovdostan.org', 1),

('Sarah Mohammed', 'سارة محمد', 'سارا محەمەد', 'Education Program Manager', 'مدير برنامج التعليم', 'بەڕێوەبەری پڕۆگرامی پەروەردە', 'Developing educational programs and managing school construction projects across rural communities.', 'تطوير البرامج التعليمية وإدارة مشاريع بناء المدارس عبر المجتمعات الريفية.', 'گەشەپێدانی پڕۆگرامەکانی پەروەردە و بەڕێوەبردنی پڕۆژەکانی دروستکردنی قوتابخانە لە کۆمەڵگا لادێیەکان.', 'https://images.unsplash.com/photo-1494790108755-2616c7ae5bad?w=400&h=400&fit=crop', 'sarah@mrovdostan.org', 2),

('Omar Hassan', 'عمر حسن', 'عومەر حەسەن', 'Community Outreach Coordinator', 'منسق التواصل المجتمعي', 'هەماهەنگکەری پەیوەندی کۆمەڵگا', 'Building bridges between communities and coordinating volunteer activities throughout the region.', 'بناء جسور بين المجتمعات وتنسيق أنشطة المتطوعين في جميع أنحاء المنطقة.', 'دروستکردنی پرد لە نێوان کۆمەڵگاکان و هەماهەنگکردنی چالاکیەکانی خۆبەخشان لە سەرانسەری هەرێمەکە.', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop', 'omar@mrovdostan.org', 3),

('Rojin Khalil', 'روژين خليل', 'رۆژین خەلیل', 'Healthcare Coordinator', 'منسق الرعاية الصحية', 'هەماهەنگکەری چاودێری تەندروستی', 'Managing mobile health clinics and medical supply distribution programs in remote areas.', 'إدارة العيادات الصحية المتنقلة وبرامج توزيع الإمدادات الطبية في المناطق النائية.', 'بەڕێوەبردنی نەخۆشخانە گواستراوەکان و پڕۆگرامەکانی دابەشکردنی کەرەستەی پزیشکی لە ناوچە دوورەکان.', 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop', 'rojin@mrovdostan.org', 4);
