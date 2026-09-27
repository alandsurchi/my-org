import React, { useState } from 'react';
import { Check, Facebook, Link2, MessageCircle, Send } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface ShareButtonsProps {
  /** Path or absolute URL of the post, e.g. /news/19 */
  url: string;
  title: string;
  /** The post's own words, shared alongside the link. */
  text?: string;
  className?: string;
}

/**
 * Share a post to Facebook, WhatsApp or Telegram, or copy its link.
 *
 * Facebook works differently from the other two, and not by our choice:
 * it no longer accepts caption text in a share link — the `quote` parameter was
 * removed — so nothing can pre-fill the box. What Facebook DOES read is the
 * post page's Open Graph tags, which already carry that post's own title,
 * description and photo. So the link alone produces a proper preview, and we
 * copy the text to the clipboard so it is one paste away.
 *
 * WhatsApp and Telegram accept the text directly, so those need no paste.
 */
const ShareButtons = ({ url, title, text, className }: ShareButtonsProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  // Absolute: WhatsApp and Facebook cannot resolve a path on their own.
  const absoluteUrl = /^https?:\/\//i.test(url)
    ? url
    : `${typeof window === 'undefined' ? '' : window.location.origin}${url.startsWith('/') ? '' : '/'}${url}`;

  const message = [title, text].filter(Boolean).join('\n\n');

  const openShare = (shareUrl: string) => {
    // noopener: the opened tab must not get a handle on this one.
    window.open(shareUrl, '_blank', 'noopener,noreferrer,width=680,height=640');
  };

  const copy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      return true;
    } catch {
      return false; // Denied clipboard permission, or an insecure context.
    }
  };

  const shareToFacebook = async () => {
    const ok = await copy(message);
    openShare(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(absoluteUrl)}`);
    if (ok) toast({ title: t('share'), description: t('textCopiedForFacebook') });
  };

  const shareToWhatsapp = () =>
    openShare(`https://wa.me/?text=${encodeURIComponent(`${message}\n\n${absoluteUrl}`)}`);

  const shareToTelegram = () =>
    openShare(
      `https://t.me/share/url?url=${encodeURIComponent(absoluteUrl)}&text=${encodeURIComponent(message)}`,
    );

  const copyLink = async () => {
    if (!(await copy(absoluteUrl))) return;
    setCopied(true);
    toast({ title: t('linkCopied') });
    setTimeout(() => setCopied(false), 2000);
  };

  const actions = [
    { key: 'facebook', label: t('shareOnFacebook'), icon: Facebook, onClick: shareToFacebook },
    { key: 'whatsapp', label: t('shareOnWhatsapp'), icon: MessageCircle, onClick: shareToWhatsapp },
    { key: 'telegram', label: t('shareOnTelegram'), icon: Send, onClick: shareToTelegram },
    { key: 'copy', label: t('copyLink'), icon: copied ? Check : Link2, onClick: copyLink },
  ];

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      <span className="me-1 text-sm font-medium text-muted-foreground">{t('share')}</span>
      {actions.map(({ key, label, icon: Icon, onClick }) => (
        <button
          key={key}
          type="button"
          onClick={onClick}
          aria-label={label}
          title={label}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-[color,background-color,border-color,transform] duration-150 ease-out hover:border-primary hover:bg-muted hover:text-primary motion-safe:hover:-translate-y-0.5 motion-safe:active:scale-95"
        >
          <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
        </button>
      ))}
    </div>
  );
};

export default ShareButtons;
