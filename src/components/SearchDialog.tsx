
import React, { useState } from 'react';
import { Search, X, Calendar, ExternalLink } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSearch } from '@/hooks/useSearch';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useLanguage } from '@/contexts/LanguageContext';

interface SearchDialogProps {
  children: React.ReactNode;
}

const SearchDialog = ({ children }: SearchDialogProps) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { data: results = [], isLoading } = useSearch(query);
  const { trackSearch, trackClick } = useAnalytics();
  const { t } = useLanguage();

  const handleSearch = (value: string) => {
    setQuery(value);
    if (value.length >= 2) {
      trackSearch(window.location.pathname, value);
    }
  };

  const handleResultClick = (result: any) => {
    trackClick(window.location.pathname, {
      search_result_type: result.type,
      search_result_id: result.id,
      search_query: query
    });
    setIsOpen(false);
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      'news': '📰',
      'project': '🚀',
      'gallery': '📸'
    };
    return icons[type as keyof typeof icons] || '📄';
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Search Content
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search news, projects, gallery..."
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
              autoFocus
            />
          </div>

          <div className="max-h-96 overflow-y-auto space-y-3">
            {isLoading && query.length >= 2 && (
              <div className="text-center py-8 text-gray-500">
                Searching...
              </div>
            )}

            {!isLoading && query.length >= 2 && results.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No results found for "{query}"
              </div>
            )}

            {results.map((result) => (
              <Card key={`${result.type}-${result.id}`} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleResultClick(result)}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getTypeIcon(result.type)}</span>
                      <div>
                        <CardTitle className="text-lg line-clamp-1">{result.title}</CardTitle>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span className="capitalize">{result.type}</span>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(result.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="line-clamp-2">
                    {result.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>

          {query.length > 0 && query.length < 2 && (
            <div className="text-center py-4 text-gray-500 text-sm">
              Type at least 2 characters to search
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchDialog;
