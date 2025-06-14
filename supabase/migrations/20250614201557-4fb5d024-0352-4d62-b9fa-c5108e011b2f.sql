
-- Create gallery table for managing gallery images
CREATE TABLE public.gallery (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create website_images table for managing website content images
CREATE TABLE public.website_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create staff_accounts table for managing staff members
CREATE TABLE public.staff_accounts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'editor', 'viewer')),
  password_hash TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) to all tables
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_accounts ENABLE ROW LEVEL SECURITY;

-- Create policies for gallery table (allow all operations for now)
CREATE POLICY "Allow all operations on gallery" 
  ON public.gallery 
  FOR ALL 
  USING (true)
  WITH CHECK (true);

-- Create policies for website_images table (allow all operations for now)
CREATE POLICY "Allow all operations on website_images" 
  ON public.website_images 
  FOR ALL 
  USING (true)
  WITH CHECK (true);

-- Create policies for staff_accounts table (allow all operations for now)
CREATE POLICY "Allow all operations on staff_accounts" 
  ON public.staff_accounts 
  FOR ALL 
  USING (true)
  WITH CHECK (true);

-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public) VALUES ('dashboard-images', 'dashboard-images', true);

-- Create storage policies for the bucket
CREATE POLICY "Allow all operations on dashboard-images bucket" 
  ON storage.objects 
  FOR ALL 
  USING (bucket_id = 'dashboard-images')
  WITH CHECK (bucket_id = 'dashboard-images');
