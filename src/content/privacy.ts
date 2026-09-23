import type { Lang } from './types';

/**
 * Privacy policy content.
 *
 * Long-form prose does not fit LanguageContext's flat `key: 'string'` model, so
 * it lives here as structured sections. Everything below describes what this
 * codebase ACTUALLY does — see src/lib/analytics.ts, backend/routes/analytics.js,
 * src/lib/monitoring.ts and index.html. If any of those change, change this too.
 *
 * Keep the three languages' `sections` arrays the same length and in the same
 * order: an e2e test asserts the heading count matches across languages.
 */
export interface PrivacySection {
  /** Stable anchor id, identical across languages so deep links survive a language switch. */
  id: string;
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
}

export interface PrivacyDoc {
  intro: string;
  sections: PrivacySection[];
}

/** One date for all languages — three copies is three chances to forget one. */
export const PRIVACY_LAST_UPDATED = '2026-09-23';

export const privacyContent: Record<Lang, PrivacyDoc> = {
  en: {
    intro:
      'Mrovdostan Organization for Humanitarian Aid runs this website. We keep what we collect to the minimum needed to understand whether the site is working and being read. This page explains exactly what that means, in plain language.',
    sections: [
      {
        id: 'what-we-measure',
        heading: 'What we measure',
        paragraphs: [
          'When you open a page, our own server records a small, anonymous entry. No cookies are used and no advertising network is involved. Each entry contains only:',
        ],
        bullets: [
          'The date of the visit (not the time).',
          'The page address you opened, for example /news.',
          'A visitor code: a one-way cryptographic hash of your IP address, your browser identification, the date, and a secret key held on our server. It cannot be reversed, and it changes every day, so visits cannot be linked together across days or back to you.',
          'The website you arrived from, reduced to its domain name only — for example google.com. The rest of the address is discarded before anything is stored.',
          'The language you are reading the site in.',
          'Whether the screen is phone-sized or larger.',
        ],
      },
      {
        id: 'what-we-never-collect',
        heading: 'What we never collect',
        paragraphs: [
          'We do not store your IP address. We do not store your name, email address, or any other detail that identifies you, unless you choose to write to us yourself. We do not use advertising cookies, we do not track you across other websites, and we never sell or share visitor information with anyone for marketing.',
          'If your browser sends a "Do Not Track" signal, we record nothing at all. Pages in the staff area are never measured.',
        ],
      },
      {
        id: 'storage-on-your-device',
        heading: 'What is stored on your device',
        paragraphs: [
          'This site sets no cookies. It does save two small preferences in your browser\'s own storage so the site remembers them on your next visit: the language you chose, and whether you prefer light or dark appearance. These never leave your device and are never sent to us. Clearing your browser data removes them.',
        ],
      },
      {
        id: 'other-services',
        heading: 'Other services involved',
        paragraphs: [
          'Delivering a website always involves a few other companies. These are the ones that can see a request from you:',
        ],
        bullets: [
          'Railway hosts the website and its database. Their servers keep short-term technical logs.',
          'Cloudflare sits in front of the site to make it faster and to block attacks. They see the requests passing through and keep security logs.',
          'Cloudflare Web Analytics may be used to count visits. It sets no cookies and does not track people across websites. It is only active when we have switched it on.',
          'Google Fonts supplies the typefaces the site is set in. Your browser fetches these files from Google, which means Google can see your IP address when a page loads.',
          'Sentry receives automatic reports when a page breaks, so we can fix it. These reports describe the error, not you, and are only sent when error reporting is switched on.',
        ],
      },
      {
        id: 'if-you-write-to-us',
        heading: 'If you write to us',
        paragraphs: [
          'The email address on this site is an ordinary mailbox. If you send us a message, we keep it so we can reply and, where relevant, act on what you told us. We do not add your address to any mailing list, and we do not pass it to anyone else.',
        ],
      },
      {
        id: 'how-long',
        heading: 'How long we keep things',
        paragraphs: [
          'Visit records are kept for as long as they remain useful for understanding how the site is used. Because the visitor code changes every day, older records cannot be connected to each other or traced back to a person. Messages you send us are kept for as long as we need them to deal with your enquiry.',
        ],
      },
      {
        id: 'children',
        heading: 'Children',
        paragraphs: [
          'This website is not aimed at children and we do not knowingly collect information about them. If you believe a child has sent us personal information, please contact us and we will remove it.',
        ],
      },
      {
        id: 'your-choices',
        heading: 'Your choices',
        paragraphs: [
          'You can turn on "Do Not Track" in your browser settings and we will stop recording your visits entirely. You can clear the stored language and appearance preferences at any time by clearing your browser data. You can also write to us to ask what we hold, or to object to how we use it.',
        ],
      },
      {
        id: 'contact',
        heading: 'Contact and changes',
        paragraphs: [
          'For any question about this policy, or to make a request about your information, email ohumanism@gmail.com.',
          'If we change how we handle visitor information, we will update this page and the date shown above.',
        ],
      },
    ],
  },

  ar: {
    intro:
      'تدير منظمة مرؤفدوستان للإغاثة الإنسانية هذا الموقع. نحتفظ بأقل قدر ممكن من المعلومات، بما يكفي فقط لمعرفة ما إذا كان الموقع يعمل ويُقرأ. تشرح هذه الصفحة ما يعنيه ذلك بالضبط، بلغة واضحة.',
    sections: [
      {
        id: 'what-we-measure',
        heading: 'ما الذي نقيسه',
        paragraphs: [
          'عند فتحك لأي صفحة، يسجّل خادمنا الخاص مدخلاً صغيراً ومجهول الهوية. لا تُستخدم أي ملفات تعريف ارتباط ولا تشارك أي شبكة إعلانية. يحتوي كل مدخل على ما يلي فقط:',
        ],
        bullets: [
          'تاريخ الزيارة (دون الوقت).',
          'عنوان الصفحة التي فتحتها، مثل ‎/news‎.',
          'رمز زائر: بصمة تشفيرية أحادية الاتجاه مكوّنة من عنوان الـ IP الخاص بك ومعرّف متصفحك والتاريخ ومفتاح سري محفوظ على خادمنا. لا يمكن عكسه، ويتغيّر يومياً، لذا لا يمكن ربط الزيارات ببعضها عبر الأيام ولا ربطها بك.',
          'الموقع الذي وصلت منه، مختصراً إلى اسم النطاق فقط — مثل google.com. يُحذف باقي العنوان قبل التخزين.',
          'اللغة التي تقرأ بها الموقع.',
          'ما إذا كانت الشاشة بحجم هاتف أو أكبر.',
        ],
      },
      {
        id: 'what-we-never-collect',
        heading: 'ما الذي لا نجمعه أبداً',
        paragraphs: [
          'لا نخزّن عنوان الـ IP الخاص بك. ولا نخزّن اسمك أو بريدك الإلكتروني أو أي تفصيل آخر يعرّف بك، إلا إذا اخترت أنت مراسلتنا. لا نستخدم ملفات تعريف ارتباط إعلانية، ولا نتتبّعك عبر مواقع أخرى، ولا نبيع معلومات الزوار أو نشاركها مع أحد لأغراض تسويقية.',
          'إذا أرسل متصفحك إشارة «عدم التتبّع»، فلن نسجّل أي شيء على الإطلاق. كما أن صفحات قسم الموظفين لا تُقاس أبداً.',
        ],
      },
      {
        id: 'storage-on-your-device',
        heading: 'ما يُحفظ على جهازك',
        paragraphs: [
          'لا يضع هذا الموقع أي ملفات تعريف ارتباط. لكنه يحفظ تفضيلين صغيرين في ذاكرة متصفحك حتى يتذكّرهما في زيارتك القادمة: اللغة التي اخترتها، وتفضيلك للمظهر الفاتح أو الداكن. لا يغادران جهازك ولا يُرسلان إلينا أبداً، ويختفيان عند مسح بيانات المتصفح.',
        ],
      },
      {
        id: 'other-services',
        heading: 'خدمات أخرى مشارِكة',
        paragraphs: [
          'تقديم أي موقع إلكتروني يتطلّب دائماً مشاركة بعض الشركات الأخرى. وهذه هي الجهات التي يمكنها رؤية طلب قادم منك:',
        ],
        bullets: [
          'Railway تستضيف الموقع وقاعدة بياناته، وتحتفظ خوادمها بسجلات تقنية قصيرة الأمد.',
          'Cloudflare تقف أمام الموقع لتسريعه وصدّ الهجمات، وترى الطلبات المارّة وتحتفظ بسجلات أمنية.',
          'Cloudflare Web Analytics قد تُستخدم لعدّ الزيارات. لا تضع ملفات تعريف ارتباط ولا تتتبّع الأشخاص عبر المواقع، وهي تعمل فقط عندما نقوم بتفعيلها.',
          'Google Fonts توفّر الخطوط المستخدمة في الموقع. يجلب متصفحك هذه الملفات من Google، ما يعني أن Google يمكنها رؤية عنوان الـ IP الخاص بك عند تحميل الصفحة.',
          'Sentry تتلقّى تقارير تلقائية عند حدوث عطل في صفحة ما حتى نتمكّن من إصلاحه. تصف هذه التقارير الخطأ لا شخصك، وتُرسل فقط عند تفعيل الإبلاغ عن الأخطاء.',
        ],
      },
      {
        id: 'if-you-write-to-us',
        heading: 'إذا راسلتنا',
        paragraphs: [
          'عنوان البريد الإلكتروني الموجود على هذا الموقع هو صندوق بريد عادي. إذا أرسلت إلينا رسالة فسنحتفظ بها لنتمكّن من الردّ عليك والتصرّف بناءً عليها عند الاقتضاء. لا نضيف عنوانك إلى أي قائمة بريدية ولا نمرّره إلى أي جهة أخرى.',
        ],
      },
      {
        id: 'how-long',
        heading: 'مدة الاحتفاظ',
        paragraphs: [
          'تُحفظ سجلات الزيارات ما دامت مفيدة لفهم كيفية استخدام الموقع. ولأن رمز الزائر يتغيّر يومياً، لا يمكن ربط السجلات القديمة ببعضها ولا تتبّعها إلى شخص بعينه. أما الرسائل التي ترسلها إلينا فتُحفظ للمدة اللازمة لمعالجة طلبك.',
        ],
      },
      {
        id: 'children',
        heading: 'الأطفال',
        paragraphs: [
          'هذا الموقع غير موجّه للأطفال، ولا نجمع عن قصد أي معلومات عنهم. إذا كنت تعتقد أن طفلاً أرسل إلينا معلومات شخصية، فيرجى التواصل معنا وسنحذفها.',
        ],
      },
      {
        id: 'your-choices',
        heading: 'خياراتك',
        paragraphs: [
          'يمكنك تفعيل «عدم التتبّع» في إعدادات متصفحك وسنتوقّف عن تسجيل زياراتك تماماً. ويمكنك مسح تفضيلات اللغة والمظهر المحفوظة في أي وقت عبر مسح بيانات المتصفح. كما يمكنك مراسلتنا للسؤال عمّا نحتفظ به أو للاعتراض على طريقة استخدامه.',
        ],
      },
      {
        id: 'contact',
        heading: 'التواصل والتغييرات',
        paragraphs: [
          'لأي سؤال بخصوص هذه السياسة، أو لتقديم طلب يتعلّق بمعلوماتك، راسلنا على ohumanism@gmail.com.',
          'إذا غيّرنا طريقة تعاملنا مع معلومات الزوار، فسنحدّث هذه الصفحة والتاريخ المبيّن أعلاه.',
        ],
      },
    ],
  },

  ku: {
    intro:
      'ڕێکخراوی مرۆڤدۆستان بۆ یارمەتی مرۆڤدۆستانە ئەم ماڵپەڕە بەڕێوە دەبات. تەنها ئەو کەمترین زانیارییە هەڵدەگرین کە پێویستە بۆ زانینی ئەوەی ئایا ماڵپەڕەکە کار دەکات و دەخوێنرێتەوە. ئەم لاپەڕەیە بە زمانێکی ڕوون ڕوونی دەکاتەوە کە ئەمە بە تەواوی چی دەگەیەنێت.',
    sections: [
      {
        id: 'what-we-measure',
        heading: 'چی دەپێوین',
        paragraphs: [
          'کاتێک لاپەڕەیەک دەکەیتەوە، ڕاژەی خۆمان تۆمارێکی بچووک و نەناسراو هەڵدەگرێت. هیچ کوکییەک بەکارنایەت و هیچ تۆڕێکی ڕیکلامی تێیدا نییە. هەر تۆمارێک تەنها ئەمانە لەخۆدەگرێت:',
        ],
        bullets: [
          'ڕێکەوتی سەردانەکە (بەبێ کات).',
          'ناونیشانی ئەو لاپەڕەیەی کردتەوە، بۆ نموونە ‎/news‎.',
          'کۆدی سەردانکەر: شێوەیەکی شاراوەی یەک‌ئاراستە لە ناونیشانی IP، ناسێنەری وێبگەڕەکەت، ڕێکەوت، و کلیلێکی نهێنی کە لەسەر ڕاژەکەمان پارێزراوە. ناتوانرێت بگەڕێنرێتەوە، و هەموو ڕۆژێک دەگۆڕێت، بۆیە سەردانەکان نە بە یەکەوە دەبەسترێنەوە نە بۆ تۆ دەگەڕێنەوە.',
          'ئەو ماڵپەڕەی لێیەوە هاتوویت، تەنها وەک ناوی دۆمەین — بۆ نموونە google.com. باقی ناونیشانەکە پێش هەڵگرتن دەسڕدرێتەوە.',
          'ئەو زمانەی پێی ماڵپەڕەکە دەخوێنیتەوە.',
          'ئایا شاشەکە بە قەبارەی مۆبایلە یان گەورەتر.',
        ],
      },
      {
        id: 'what-we-never-collect',
        heading: 'چی هەرگیز کۆناکەینەوە',
        paragraphs: [
          'ناونیشانی IP هەڵناگرین. ناو، ئیمەیل، یان هیچ وردەکارییەکی تر کە تۆ بناسێنێت هەڵناگرین، مەگەر خۆت بڕیار بدەیت بنووسیت بۆمان. کوکیی ڕیکلامی بەکارناهێنین، بەسەر ماڵپەڕی تردا بەدواتدا ناگەڕێین، و هەرگیز زانیاری سەردانکەران نافرۆشین یان بۆ بازاڕکردن لەگەڵ کەس هاوبەش ناکەین.',
          'ئەگەر وێبگەڕەکەت ئاماژەی «بەدواداچوون مەکە» بنێرێت، هیچ شتێک تۆمار ناکەین. لاپەڕەکانی بەشی ستاف هەرگیز ناپێورێن.',
        ],
      },
      {
        id: 'storage-on-your-device',
        heading: 'چی لەسەر ئامێرەکەت هەڵدەگیرێت',
        paragraphs: [
          'ئەم ماڵپەڕە هیچ کوکییەک دانانێت. بەڵام دوو هەڵبژاردەی بچووک لە بیرگەی وێبگەڕەکەت هەڵدەگرێت تاکو لە سەردانی داهاتووتدا بیانهێنێتەوە بیر: ئەو زمانەی هەڵتبژاردووە، و ئەوەی ڕووکاری ڕووناک یان تاریکت پێ باشە. ئەمانە هەرگیز ئامێرەکەت بەجێ ناهێڵن و هەرگیز بۆ ئێمە نانێردرێن. بە سڕینەوەی داتای وێبگەڕ لادەچن.',
        ],
      },
      {
        id: 'other-services',
        heading: 'خزمەتگوزارییە ترەکانی بەشدار',
        paragraphs: [
          'پێشکەشکردنی هەر ماڵپەڕێک هەمیشە چەند کۆمپانیایەکی تر لەخۆدەگرێت. ئەمانە ئەو لایەنانەن کە دەتوانن داواکارییەکی تۆ ببینن:',
        ],
        bullets: [
          'Railway ماڵپەڕەکە و بنکەدراوەکەی هەڵدەگرێت، و ڕاژەکانیان تۆماری تەکنیکی کورت‌خایەن هەڵدەگرن.',
          'Cloudflare لە پێش ماڵپەڕەکەوەیە بۆ خێراترکردنی و ڕێگری لە هێرشەکان، داواکارییە تێپەڕیوەکان دەبینێت و تۆماری ئاسایشی هەڵدەگرێت.',
          'Cloudflare Web Analytics لەوانەیە بۆ ژماردنی سەردانەکان بەکاربهێنرێت. هیچ کوکییەک دانانێت و بەسەر ماڵپەڕەکاندا بەدوای کەسانەوە ناگەڕێت، و تەنها کاتێک کار دەکات کە ئێمە چالاکمان کردبێت.',
          'Google Fonts ئەو فۆنتانە دابین دەکات کە ماڵپەڕەکە پێی نووسراوە. وێبگەڕەکەت ئەم فایلانە لە Google وەردەگرێت، واتە Google دەتوانێت لە کاتی بارکردنی لاپەڕەدا ناونیشانی IP-ی تۆ ببینێت.',
          'Sentry ڕاپۆرتی خۆکار وەردەگرێت کاتێک لاپەڕەیەک تێکدەچێت، تاکو بتوانین چاکی بکەینەوە. ئەم ڕاپۆرتانە هەڵەکە باس دەکەن نەک تۆ، و تەنها کاتێک دەنێردرێن کە ڕاپۆرتکردنی هەڵە چالاک بێت.',
        ],
      },
      {
        id: 'if-you-write-to-us',
        heading: 'ئەگەر بنووسیت بۆمان',
        paragraphs: [
          'ئەو ناونیشانی ئیمەیلەی لەم ماڵپەڕەدایە سندوقێکی ئاسایی پۆستەیە. ئەگەر نامەیەکمان بۆ بنێریت، هەڵیدەگرین تاکو بتوانین وەڵامت بدەینەوە و، لە شوێنی پێویستدا، کار لەسەر ئەوە بکەین کە پێت وتووین. ناونیشانەکەت بۆ هیچ لیستێکی پۆستە زیاد ناکەین و بۆ هیچ لایەنێکی تر نایگوازینەوە.',
        ],
      },
      {
        id: 'how-long',
        heading: 'ماوەی هەڵگرتن',
        paragraphs: [
          'تۆمارەکانی سەردان هەتا ئەو کاتەی سوودبەخش بن بۆ تێگەیشتن لە چۆنیەتی بەکارهێنانی ماڵپەڕەکە هەڵدەگیرێن. لەبەر ئەوەی کۆدی سەردانکەر هەموو ڕۆژێک دەگۆڕێت، تۆمارە کۆنەکان نە بە یەکەوە دەبەسترێنەوە نە بۆ کەسێک دەگەڕێنەوە. ئەو نامانەی بۆمان دەنێریت بۆ ئەو ماوەیە هەڵدەگیرێن کە پێویستمانە بۆ چارەسەرکردنی داواکارییەکەت.',
        ],
      },
      {
        id: 'children',
        heading: 'منداڵان',
        paragraphs: [
          'ئەم ماڵپەڕە ئاراستەی منداڵان نەکراوە و بە ئەنقەست هیچ زانیارییەک دەربارەیان کۆناکەینەوە. ئەگەر پێت وایە منداڵێک زانیاری کەسی بۆمان ناردووە، تکایە پەیوەندیمان پێوە بکە و لایدەبەین.',
        ],
      },
      {
        id: 'your-choices',
        heading: 'هەڵبژاردەکانت',
        paragraphs: [
          'دەتوانیت «بەدواداچوون مەکە» لە ڕێکخستنەکانی وێبگەڕەکەت چالاک بکەیت و ئێمە بە تەواوی وازلە تۆمارکردنی سەردانەکانت دەهێنین. دەتوانیت هەر کاتێک هەڵبژاردەی زمان و ڕووکاری هەڵگیراو بە سڕینەوەی داتای وێبگەڕ لاببەیت. هەروەها دەتوانیت بنووسیت بۆمان و بپرسیت چیمان هەیە، یان ناڕەزایی دەربڕیت لە چۆنیەتی بەکارهێنانی.',
        ],
      },
      {
        id: 'contact',
        heading: 'پەیوەندی و گۆڕانکاری',
        paragraphs: [
          'بۆ هەر پرسیارێک دەربارەی ئەم سیاسەتە، یان بۆ داواکارییەک سەبارەت بە زانیارییەکانت، ئیمەیل بنێرە بۆ ohumanism@gmail.com.',
          'ئەگەر شێوازی مامەڵەکردنمان لەگەڵ زانیاری سەردانکەران بگۆڕین، ئەم لاپەڕە و ئەو ڕێکەوتەی لەسەرەوە نیشان دراوە نوێ دەکەینەوە.',
        ],
      },
    ],
  },
};
