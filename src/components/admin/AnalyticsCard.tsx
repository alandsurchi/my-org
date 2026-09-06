import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BarChart3, Users, Eye, Smartphone, Monitor } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/apiClient';

const RANGES = [7, 30, 90] as const;

const LANG_NAMES: Record<string, string> = { ku: 'Kurdish', ar: 'Arabic', en: 'English' };

/** Visitor statistics from the site's own first-party analytics. */
const AnalyticsCard = () => {
  const [days, setDays] = useState<(typeof RANGES)[number]>(30);
  const { data, isLoading, error } = useQuery({
    queryKey: ['analytics', days],
    queryFn: async () => {
      const r = await apiClient.getAnalyticsSummary(days);
      if (r.error) throw new Error(r.error);
      return r.data!;
    },
    staleTime: 60 * 1000,
  });

  const maxDay = Math.max(1, ...(data?.byDay.map((d) => d.views) ?? [1]));

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Website visitors
            </CardTitle>
            <CardDescription>Counted on our own server. No cookies, no IP addresses, no third parties.</CardDescription>
          </div>
          <div className="flex gap-1">
            {RANGES.map((r) => (
              <Button key={r} size="sm" variant={days === r ? 'default' : 'outline'} onClick={() => setDays(r)}>
                {r} days
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading && <div className="text-sm text-gray-500">Loading statistics…</div>}
        {error && <div className="text-sm text-red-600">Could not load statistics: {(error as Error).message}</div>}
        {data && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="rounded-xl bg-blue-50 p-4">
                <div className="flex items-center gap-2 text-blue-700 text-sm"><Eye className="w-4 h-4" /> Page views</div>
                <div className="text-3xl font-bold text-gray-900 mt-1">{data.views.toLocaleString()}</div>
              </div>
              <div className="rounded-xl bg-purple-50 p-4">
                <div className="flex items-center gap-2 text-purple-700 text-sm"><Users className="w-4 h-4" /> Visitors</div>
                <div className="text-3xl font-bold text-gray-900 mt-1">{data.visitors.toLocaleString()}</div>
              </div>
              {(['mobile', 'desktop'] as const).map((d) => {
                const row = data.devices.find((x) => x.device === d);
                const pct = data.views ? Math.round(((row?.views ?? 0) / data.views) * 100) : 0;
                return (
                  <div key={d} className="rounded-xl bg-gray-50 p-4">
                    <div className="flex items-center gap-2 text-gray-700 text-sm">
                      {d === 'mobile' ? <Smartphone className="w-4 h-4" /> : <Monitor className="w-4 h-4" />}
                      {d === 'mobile' ? 'Mobile' : 'Desktop'}
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mt-1">{pct}%</div>
                  </div>
                );
              })}
            </div>

            {/* Daily bars */}
            <div>
              <div className="text-sm font-medium text-gray-700 mb-2">Views per day</div>
              {data.byDay.length === 0 ? (
                <div className="text-sm text-gray-500">No visits recorded yet.</div>
              ) : (
                <div className="flex items-end gap-1 h-28" dir="ltr">
                  {data.byDay.map((d) => (
                    <div key={d.day} className="flex-1 flex flex-col items-center justify-end h-full" title={`${d.day}: ${d.views} views, ${d.visitors} visitors`}>
                      <div className="w-full rounded-t bg-gradient-to-t from-blue-600 to-purple-500" style={{ height: `${Math.max(4, (d.views / maxDay) * 100)}%` }} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid md:grid-cols-3 gap-6 text-sm">
              <div>
                <div className="font-medium text-gray-700 mb-2">Top pages</div>
                <ul className="space-y-1">
                  {data.topPages.map((p) => (
                    <li key={p.path} className="flex justify-between gap-2"><span className="truncate font-mono text-xs">{p.path}</span><span className="text-gray-500">{p.views}</span></li>
                  ))}
                  {data.topPages.length === 0 && <li className="text-gray-500">—</li>}
                </ul>
              </div>
              <div>
                <div className="font-medium text-gray-700 mb-2">Came from</div>
                <ul className="space-y-1">
                  {data.referrers.map((r) => (
                    <li key={r.referrer} className="flex justify-between gap-2"><span className="truncate">{r.referrer}</span><span className="text-gray-500">{r.views}</span></li>
                  ))}
                  {data.referrers.length === 0 && <li className="text-gray-500">Direct visits only</li>}
                </ul>
              </div>
              <div>
                <div className="font-medium text-gray-700 mb-2">Languages</div>
                <ul className="space-y-1">
                  {data.languages.map((l) => (
                    <li key={l.lang} className="flex justify-between gap-2"><span>{LANG_NAMES[l.lang] || l.lang}</span><span className="text-gray-500">{l.views}</span></li>
                  ))}
                  {data.languages.length === 0 && <li className="text-gray-500">—</li>}
                </ul>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AnalyticsCard;
