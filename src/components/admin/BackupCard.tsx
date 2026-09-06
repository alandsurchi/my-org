import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Database, Download, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { apiClient } from '@/lib/apiClient';

const formatBytes = (b: number) => (b > 1024 * 1024 ? `${(b / 1024 / 1024).toFixed(1)} MB` : `${Math.round(b / 1024)} KB`);

/** Lets a super admin download everything (database rows + uploaded images) as one zip. */
const BackupCard = () => {
  const { toast } = useToast();
  const [downloading, setDownloading] = useState(false);
  const { data } = useQuery({
    queryKey: ['backup-info'],
    queryFn: async () => {
      const r = await apiClient.getBackupInfo();
      if (r.error) throw new Error(r.error);
      return r.data!;
    },
    staleTime: 60 * 1000,
  });

  const download = async () => {
    setDownloading(true);
    try {
      const { blob, filename } = await apiClient.downloadBackup();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 10_000);
      toast({ title: 'Backup downloaded', description: `${filename} (${formatBytes(blob.size)}). Keep it somewhere safe.` });
    } catch (error) {
      toast({ title: 'Backup failed', description: error instanceof Error ? error.message : 'Unknown error', variant: 'destructive' });
    } finally {
      setDownloading(false);
    }
  };

  const content = data ? Object.entries(data.tables).filter(([t]) => t !== 'page_views') : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="w-5 h-5" />
          Backup
        </CardTitle>
        <CardDescription>
          Download a complete copy of the website: every post, project, photo and staff account in one zip file. Do this regularly and keep the file private.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {data && (
          <div className="text-sm text-gray-600 flex flex-wrap gap-x-6 gap-y-1">
            {content.map(([t, n]) => (
              <span key={t}><span className="font-medium text-gray-900">{n}</span> {t.replace(/_/g, ' ')}</span>
            ))}
            <span><span className="font-medium text-gray-900">{data.uploads.files}</span> images ({formatBytes(data.uploads.bytes)})</span>
          </div>
        )}
        <Button onClick={download} disabled={downloading}>
          {downloading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
          {downloading ? 'Preparing backup…' : 'Download backup (.zip)'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default BackupCard;
