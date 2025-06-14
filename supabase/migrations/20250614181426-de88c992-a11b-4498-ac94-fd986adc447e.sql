
-- Clear existing sample data and add the real team members
DELETE FROM public.staff;

-- Insert the real team members
INSERT INTO public.staff (name_en, name_ar, name_ku, position_en, position_ar, position_ku, bio_en, bio_ar, bio_ku, image_url, display_order, is_active) VALUES
('Azad Abdulwahab Abdullah', 'ئازاد عبدالوهاب عبدواللە', 'ئازاد عبدالوهاب عبدواللە', 'Owner & President', 'المالك والرئيس', 'خاوەن و سەرۆک', 'Leading the organization with vision and dedication to serve our community.', 'يقود المنظمة برؤية وتفان لخدمة مجتمعنا.', 'ڕێبەری ڕێکخراوەکە بە بینین و خۆتەرخانکردن بۆ خزمەتکردنی کۆمەڵگاکەمان.', 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', 1, true),
('Raed Othman', 'رائد عثمان', 'ڕائید عوسمان', 'Head of Orphans Department', 'رئيس قسم الأيتام', 'بەرپرسی بەشی هەتیوان', 'Dedicated to caring for orphaned children and ensuring their well-being and future prospects.', 'مكرس لرعاية الأطفال الأيتام وضمان رفاهيتهم ومستقبلهم.', 'تەرخانکراو بۆ چاودێری منداڵە هەتیوەکان و دڵنیابوون لە باشی و داهاتووی ئەوان.', 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', 2, true),
('Haji Saood', 'حاجي سعود', 'حاجی سەعوود', 'Head of Poor Families Department', 'رئيس قسم العوائل الفقيرة', 'بەرپرسی بەشی خێزانە هەژارەکان', 'Committed to supporting poor families and improving their living conditions through various assistance programs.', 'ملتزم بدعم العوائل الفقيرة وتحسين ظروف معيشتهم من خلال برامج المساعدة المختلفة.', 'پابەند بە پشتگیریکردنی خێزانە هەژارەکان و باشترکردنی بارودۆخی ژیانیان لە ڕێگەی بەرنامە جۆراوجۆرەکانی یارمەتیەوە.', 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', 3, true);
