import React, { useEffect, useState } from 'react';
import { Languages, Loader2, RefreshCw, Save } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { apiClient, type PostTranslations } from '@/lib/apiClient';

const LANGUAGE_NAMES: Record<string, string> = { en: 'English', ar: 'Arabic (العربية)' };

interface TranslationDialogProps {
  table: 'news' | 'projects';
  id: number | string | null;
  open: boolean;
  onClose: () => void;
}

/**
 * Review and correct the machine translations of one post.
 *
 * Posts are written in Kurdish and translated automatically. Anything saved
 * here is marked as human-written on the server, so a later re-translation
 * leaves it alone. When the Kurdish source changes afterwards, the edit is kept
 * but flagged "needs review" rather than being silently replaced.
 */
const TranslationDialog = ({ table, id, open, onClose }: TranslationDialogProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [busyLang, setBusyLang] = useState<string | null>(null);
  const [source, setSource] = useState<{ title: string; body: string }>({ title: '', body: '' });
  const [translations, setTranslations] = useState<PostTranslations>({});
  const [drafts, setDrafts] = useState<Record<string, { title: string; body: string }>>({});
  const [enabled, setEnabled] = useState(true);
  const [languages, setLanguages] = useState<string[]>(['en', 'ar']);

  useEffect(() => {
    if (!open || id === null) return;
    let cancelled = false;

    setLoading(true);
    apiClient
      .getPostTranslations(table, id)
      .then((res) => {
        if (cancelled || !res.data) return;
        const current = res.data.translations || {};
        setSource({ title: res.data.title || '', body: res.data.body || '' });
        setTranslations(current);
        setEnabled(res.data.enabled);
        setLanguages(res.data.languages?.length ? res.data.languages : ['en', 'ar']);
        setDrafts(
          Object.fromEntries(
            (res.data.languages || ['en', 'ar']).map((l) => [
              l,
              { title: current[l]?.title || '', body: current[l]?.body || '' },
            ]),
          ),
        );
      })
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, [open, id, table]);

  const save = async (lang: string) => {
    if (id === null) return;
    setBusyLang(lang);
    const res = await apiClient.savePostTranslation(table, id, lang, drafts[lang]);
    setBusyLang(null);
    if (res.data) {
      setTranslations(res.data);
      toast({ title: 'Saved', description: `${LANGUAGE_NAMES[lang] || lang} will no longer be overwritten automatically.` });
    } else {
      toast({ title: 'Could not save', description: res.error || 'Please try again.', variant: 'destructive' });
    }
  };

  const regenerate = async (lang: string) => {
    if (id === null) return;
    setBusyLang(lang);
    const res = await apiClient.regeneratePostTranslation(table, id, lang);
    setBusyLang(null);
    if (res.data) {
      setTranslations(res.data);
      setDrafts((d) => ({ ...d, [lang]: { title: res.data![lang]?.title || '', body: res.data![lang]?.body || '' } }));
      toast({ title: 'Translated again', description: `${LANGUAGE_NAMES[lang] || lang} has been regenerated.` });
    } else {
      toast({ title: 'Could not translate', description: res.error || 'Please try again.', variant: 'destructive' });
    }
  };

  const statusBadge = (lang: string) => {
    const t = translations[lang];
    if (!t) return <Badge variant="outline">Not translated yet</Badge>;
    if (t.stale) return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Needs review — Kurdish text changed</Badge>;
    if (t.auto === false) return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Edited by you</Badge>;
    return <Badge variant="secondary">Automatic</Badge>;
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto" dir="ltr">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Languages className="h-5 w-5" />
            Translations
          </DialogTitle>
          <DialogDescription>
            This post is written in Kurdish and translated automatically. Correct anything below — your wording is kept
            and will not be overwritten.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12 text-muted-foreground">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading…
          </div>
        ) : (
          <div className="space-y-6">
            {!enabled && (
              <p className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                Automatic translation is not configured on the server, so nothing can be generated. You can still write
                translations by hand here.
              </p>
            )}

            <section className="rounded-md border bg-muted/40 p-4">
              <Label className="text-xs uppercase tracking-wide text-muted-foreground">Kurdish (original)</Label>
              <p className="mt-2 font-semibold" dir="rtl">{source.title}</p>
              <p className="mt-1 whitespace-pre-line text-sm text-muted-foreground" dir="rtl">{source.body}</p>
            </section>

            {languages.map((lang) => (
              <section key={lang} className="space-y-3 rounded-md border p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-semibold">{LANGUAGE_NAMES[lang] || lang}</h3>
                  {statusBadge(lang)}
                </div>

                <div className="space-y-1">
                  <Label htmlFor={`title-${lang}`}>Title</Label>
                  <Input
                    id={`title-${lang}`}
                    dir={lang === 'ar' ? 'rtl' : 'ltr'}
                    value={drafts[lang]?.title || ''}
                    onChange={(e) => setDrafts((d) => ({ ...d, [lang]: { ...d[lang], title: e.target.value } }))}
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor={`body-${lang}`}>Text</Label>
                  <Textarea
                    id={`body-${lang}`}
                    rows={6}
                    dir={lang === 'ar' ? 'rtl' : 'ltr'}
                    value={drafts[lang]?.body || ''}
                    onChange={(e) => setDrafts((d) => ({ ...d, [lang]: { ...d[lang], body: e.target.value } }))}
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button size="sm" onClick={() => save(lang)} disabled={busyLang === lang}>
                    {busyLang === lang ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Save my version
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => regenerate(lang)} disabled={busyLang === lang || !enabled}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Translate again
                  </Button>
                </div>
              </section>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TranslationDialog;
