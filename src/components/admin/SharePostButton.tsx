import React, { useState } from 'react';
import { Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ShareButtons from '@/components/site/ShareButtons';

interface SharePostButtonProps {
  /** Public path of the post, e.g. /news/19 */
  path: string;
  title: string;
  text?: string;
}

/**
 * Share a post from the dashboard.
 *
 * Opens the same share row the public page uses, rather than a second
 * implementation — the awkward parts (Facebook refusing pre-filled text, the
 * clipboard fallback, building an absolute URL) are solved once.
 */
const SharePostButton = ({ path, title, text }: SharePostButtonProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        size="sm"
        variant="ghost"
        className="h-8 w-8 rounded-lg p-0 text-gray-600 hover:bg-emerald-50 hover:text-emerald-600"
        onClick={() => setOpen(true)}
        title="Share this post"
      >
        <Share2 className="h-4 w-4" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md" dir="ltr">
          <DialogHeader>
            <DialogTitle>Share this post</DialogTitle>
            <DialogDescription>
              Facebook does not allow a website to type the caption for you, so the text is copied to your clipboard —
              paste it once Facebook opens. The photo, headline and link come across on their own. WhatsApp and
              Telegram take the text automatically.
            </DialogDescription>
          </DialogHeader>
          <ShareButtons url={path} title={title} text={text} className="pt-2" />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SharePostButton;
