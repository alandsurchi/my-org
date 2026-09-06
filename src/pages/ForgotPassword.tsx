import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { usePageMeta } from '@/hooks/usePageMeta';
import { apiClient } from '@/lib/apiClient';

const ForgotPassword = () => {
  usePageMeta({ title: 'Reset password', noindex: true });
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    await apiClient.requestPasswordReset(email.trim());
    setBusy(false);
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4" dir="ltr">
      <div className="w-full max-w-md">
        <Link to="/staff-login" className="inline-flex items-center text-gray-300 hover:text-white mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to login
        </Link>
        <Card className="border-0 shadow-2xl bg-white/10 backdrop-blur-md border border-white/20">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4">
              <KeyRound className="text-white w-8 h-8" />
            </div>
            <CardTitle className="text-2xl font-bold text-white">Forgot your password?</CardTitle>
            <CardDescription className="text-gray-300">Enter your staff email and we will send you a reset link.</CardDescription>
          </CardHeader>
          <CardContent>
            {sent ? (
              <div className="text-center text-gray-200 space-y-3">
                <p>If an account exists for <span className="font-medium text-white">{email}</span>, a reset link is on its way. It is valid for one hour.</p>
                <p className="text-sm text-gray-400">Check your spam folder if it does not arrive within a few minutes.</p>
                <Button asChild variant="outline" className="mt-2"><Link to="/staff-login">Back to login</Link></Button>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="forgotEmail" className="text-gray-200">Staff email</Label>
                  <Input id="forgotEmail" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="bg-white/10 border-white/20 text-white placeholder:text-gray-400" placeholder="you@example.org" />
                </div>
                <Button type="submit" className="w-full" disabled={busy}>{busy ? 'Sending…' : 'Send reset link'}</Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
