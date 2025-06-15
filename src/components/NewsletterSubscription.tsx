
import React, { useState } from 'react';
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSubscribeNewsletter } from '@/hooks/useEmailSubscriptions';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

const NewsletterSubscription = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { mutate: subscribe, isPending } = useSubscribeNewsletter();
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    subscribe(email, {
      onSuccess: () => {
        setIsSubscribed(true);
        setEmail('');
        toast.success('Successfully subscribed to our newsletter!');
      },
      onError: (error: any) => {
        if (error.code === '23505') {
          toast.error('This email is already subscribed');
        } else {
          toast.error('Failed to subscribe. Please try again.');
        }
      }
    });
  };

  if (isSubscribed) {
    return (
      <Card className="bg-green-50 border-green-200">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 text-green-700">
            <CheckCircle className="w-6 h-6" />
            <div>
              <p className="font-medium">Thank you for subscribing!</p>
              <p className="text-sm text-green-600">You'll receive updates about our latest news and projects.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mb-4">
          <Mail className="w-6 h-6 text-white" />
        </div>
        <CardTitle className="text-xl font-bold">Stay Updated</CardTitle>
        <CardDescription>
          Get the latest news about our projects and impact in your community
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full"
            disabled={isPending}
          />
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            disabled={isPending}
          >
            {isPending ? 'Subscribing...' : 'Subscribe to Newsletter'}
          </Button>
          <p className="text-xs text-gray-500 text-center">
            By subscribing, you agree to receive email updates. You can unsubscribe at any time.
          </p>
        </form>
      </CardContent>
    </Card>
  );
};

export default NewsletterSubscription;
