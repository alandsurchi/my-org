import type { Lang } from './types';

/**
 * Strings added after the original LanguageContext literal.
 *
 * They live here instead of in that 679-line object because the typing below
 * makes a missing translation a COMPILE error. In the original literal a
 * missing key is silent: `t()` returns the key name and the raw key renders
 * into the page. `Record<Lang, Record<UiStringKey, string>>` cannot compile
 * unless all three languages define every key.
 *
 * LanguageContext merges these over the base block, so `t('faqTitle')` works
 * exactly like any other key.
 */
export type UiStringKey =
  | 'breadcrumbLabel'
  | 'faqEyebrow'
  | 'faqTitle'
  | 'faqDescription'
  | 'faqQ1'
  | 'faqA1'
  | 'faqQ2'
  | 'faqA2'
  | 'faqQ3'
  | 'faqA3'
  | 'faqQ4'
  | 'faqA4'
  | 'faqQ5'
  | 'faqA5'
  | 'privacyEyebrow'
  | 'privacyTitle'
  | 'privacyMetaDescription'
  | 'privacyLastUpdatedLabel'
  | 'projectImageAlt'
  | 'newsImageAlt'
  | 'galleryPhotoAlt'
  | 'exploreMore'
  | 'machineTranslated'
  | 'newsAll';

/** The five questions, in order, for the FAQ section and its structured data. */
export const FAQ_KEYS = [1, 2, 3, 4, 5] as const;

export const uiStrings: Record<Lang, Record<UiStringKey, string>> = {
  en: {
    breadcrumbLabel: 'Breadcrumb',

    faqEyebrow: 'Questions',
    faqTitle: 'Frequently asked questions',
    faqDescription: 'Answers to the things people ask us most often about our work.',
    faqQ1: 'What does Mrovdostan do?',
    faqA1: 'Mrovdostan is a humanitarian, non-profit organisation. We provide emergency aid, educational support and long-term development for people living in difficult circumstances.',
    faqQ2: 'Where do you work?',
    faqA2: 'We work in the Kurdistan Region of Iraq, alongside the affected and vulnerable communities there.',
    faqQ3: 'Who can receive your help?',
    faqA3: 'We provide humanitarian assistance regardless of religion, race, nationality or political views. Our aim is to deliver aid justly and quickly to those who need it.',
    faqQ4: 'What kind of work do you focus on?',
    faqA4: 'Our goals are quality education for underserved communities, better access to healthcare, sustainable economic development, and the promotion of human rights and dignity.',
    faqQ5: 'How can I follow your work or get in touch?',
    faqA5: 'You can follow our Activities, News and Gallery pages, or find us on Facebook, Instagram and YouTube. To contact us directly, write to ohumanism@gmail.com.',

    privacyEyebrow: 'Legal',
    privacyTitle: 'Privacy Policy',
    privacyMetaDescription: 'How Mrovdostan handles visitor information on this website: what we measure, what we never collect, and which other services are involved.',
    privacyLastUpdatedLabel: 'Last updated',

    projectImageAlt: 'Photograph from this activity',
    newsImageAlt: 'Photograph from this news post',
    galleryPhotoAlt: 'Photograph from our work',

    exploreMore: 'Explore the site',
    machineTranslated: 'This post was written in Kurdish and translated automatically.',
    newsAll: 'All',
  },

  ar: {
    breadcrumbLabel: 'مسار التنقل',

    faqEyebrow: 'أسئلة',
    faqTitle: 'الأسئلة الشائعة',
    faqDescription: 'إجابات عن أكثر ما يسألنا الناس عنه بخصوص عملنا.',
    faqQ1: 'ماذا تعمل منظمة مرؤفدوستان؟',
    faqA1: 'مرؤفدوستان منظمة إنسانية غير ربحية. نقدّم الإغاثة الطارئة والدعم التعليمي والتنمية طويلة الأمد للأشخاص الذين يعيشون في ظروف صعبة.',
    faqQ2: 'أين تعملون؟',
    faqA2: 'نعمل في إقليم كردستان العراق، إلى جانب المجتمعات المتضررة والهشّة هناك.',
    faqQ3: 'من يمكنه تلقّي المساعدة؟',
    faqA3: 'نقدّم المساعدة الإنسانية بغضّ النظر عن الدين أو العرق أو القومية أو الآراء السياسية. هدفنا إيصال المساعدة بعدالة وسرعة إلى من يحتاجها.',
    faqQ4: 'ما هي مجالات عملكم؟',
    faqA4: 'أهدافنا هي توفير تعليم جيد للمجتمعات المحرومة، وتحسين الوصول إلى الرعاية الصحية، ودعم التنمية الاقتصادية المستدامة، وتعزيز حقوق الإنسان والكرامة.',
    faqQ5: 'كيف أتابع عملكم أو أتواصل معكم؟',
    faqA5: 'يمكنك متابعة صفحات الأنشطة والأخبار والمعرض، أو إيجادنا على فيسبوك وإنستغرام ويوتيوب. للتواصل المباشر راسلنا على ohumanism@gmail.com.',

    privacyEyebrow: 'قانوني',
    privacyTitle: 'سياسة الخصوصية',
    privacyMetaDescription: 'كيف تتعامل مرؤفدوستان مع معلومات الزوار على هذا الموقع: ما الذي نقيسه، وما الذي لا نجمعه أبداً، وما الخدمات الأخرى المشارِكة.',
    privacyLastUpdatedLabel: 'آخر تحديث',

    projectImageAlt: 'صورة من هذا النشاط',
    newsImageAlt: 'صورة من هذا الخبر',
    galleryPhotoAlt: 'صورة من عملنا',

    exploreMore: 'استكشف الموقع',
    machineTranslated: 'كُتب هذا المنشور بالكردية وتُرجم آلياً.',
    newsAll: 'الكل',
  },

  ku: {
    breadcrumbLabel: 'ڕێڕەوی ناوەڕۆک',

    faqEyebrow: 'پرسیارەکان',
    faqTitle: 'پرسیارە دووبارەکان',
    faqDescription: 'وەڵامی ئەو شتانەی زۆرترین جار خەڵک لێمان دەپرسێت دەربارەی کارەکانمان.',
    faqQ1: 'مرۆڤدۆستان چی دەکات؟',
    faqA1: 'مرۆڤدۆستان ڕێکخراوێکی مرۆڤدۆستانەی بێ‌قازانجە. یارمەتی لەناکاو، پشتیوانی پەروەردەیی و گەشەپێدانی درێژخایەن بۆ ئەو کەسانە دابین دەکەین کە لە بارودۆخی سەختدا دەژین.',
    faqQ2: 'لە کوێ کار دەکەن؟',
    faqA2: 'لە هەرێمی کوردستانی عێراق کار دەکەین، لەگەڵ ئەو کۆمەڵگا زیان‌لێکەوتوو و لاوازانەی لەوێن.',
    faqQ3: 'کێ دەتوانێت یارمەتی وەربگرێت؟',
    faqA3: 'یارمەتی مرۆڤدۆستانە دابین دەکەین بەبێ جیاوازی ئایین، ڕەگەز، نەتەوە یان بۆچوونی سیاسی. ئامانجمان گەیاندنی یارمەتییە بە دادپەروەرانە و خێرایی بۆ ئەوانەی پێویستیانە.',
    faqQ4: 'جەختتان لەسەر چ جۆرە کارێکە؟',
    faqA4: 'ئامانجەکانمان بریتین لە دابینکردنی پەروەردەی باش بۆ کۆمەڵگا کەم‌دەرفەتەکان، باشترکردنی دەستگەیشتن بە چاودێری تەندروستی، گەشەپێدانی ئابووری بەردەوام، و بەرزڕاگرتنی مافی مرۆڤ و کەرامەت.',
    faqQ5: 'چۆن دەتوانم کارەکانتان بەدوادابچم یان پەیوەندیتان پێوە بکەم؟',
    faqA5: 'دەتوانیت لاپەڕەکانی چالاکییەکان، هەواڵەکان و گەلەری بەدوادابچیت، یان لە فەیسبووک، ئینستاگرام و یوتیوب بماندۆزیتەوە. بۆ پەیوەندی ڕاستەوخۆ بنووسە بۆ ohumanism@gmail.com.',

    privacyEyebrow: 'یاسایی',
    privacyTitle: 'سیاسەتی تایبەتی',
    privacyMetaDescription: 'چۆن مرۆڤدۆستان مامەڵە لەگەڵ زانیاری سەردانکەران دەکات لەم ماڵپەڕەدا: چی دەپێوین، چی هەرگیز کۆناکەینەوە، و کام خزمەتگوزاری تر بەشدارە.',
    privacyLastUpdatedLabel: 'دوایین نوێکردنەوە',

    projectImageAlt: 'وێنەیەک لەم چالاکییە',
    newsImageAlt: 'وێنەیەک لەم هەواڵە',
    galleryPhotoAlt: 'وێنەیەک لە کارەکانمان',

    exploreMore: 'گەڕان بە ماڵپەڕدا',
    machineTranslated: 'ئەم بابەتە بە کوردی نووسراوە و بە شێوەی خۆکار وەرگێڕدراوە.',
    newsAll: 'هەموو',
  },
};
