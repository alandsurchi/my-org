import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useLanguage } from '@/contexts/LanguageContext';
import { FAQ_KEYS } from '@/content/uiStrings';
import Section from '@/components/site/Section';
import SectionHeading from '@/components/site/SectionHeading';

/**
 * Answers to the questions people ask most often.
 *
 * The English text is mirrored as FAQPage structured data in server.mjs, which
 * cannot import from src/ (the image ships only dist/ and server.mjs). An e2e
 * test asserts the two lists stay the same length.
 *
 * id="faq" is required, not optional: useHeaderState resets the active nav item
 * to "home" whenever it observes an intersecting <section> that has no id.
 */
const FAQSection = () => {
  const { t } = useLanguage();

  return (
    <Section id="faq" tone="muted">
      <div className="container-site max-w-3xl">
        <SectionHeading eyebrow={t('faqEyebrow')} title={t('faqTitle')} description={t('faqDescription')} />

        {/* One reveal target on the wrapper rather than a stagger per item: the
            e2e scroll test allows 800ms and the transition alone is 400ms. */}
        <Accordion type="single" collapsible className="fade-in-on-scroll card-surface divide-y divide-border px-5">
          {FAQ_KEYS.map((n) => (
            <AccordionItem key={n} value={`faq-${n}`} className="border-b-0">
              <AccordionTrigger className="text-start font-display text-base font-semibold hover:no-underline md:text-lg">
                {t(`faqQ${n}`)}
              </AccordionTrigger>
              <AccordionContent className="text-base leading-relaxed text-muted-foreground">
                {t(`faqA${n}`)}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </Section>
  );
};

export default FAQSection;
