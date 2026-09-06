import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { usePageMeta } from '@/hooks/usePageMeta';
import { useToast } from '@/hooks/use-toast';
import { apiClient } from '@/lib/apiClient';

const ResetPassword = () => {
  usePageMeta({ title: 'Choose a new password', noindex: true });
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const token = params.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 8) return setError('Use at least 8 characters.');
    if (password !== confirm) return setError('The two passwords do not match.');
    setBusy(true);
    const result = await apiClient.resetPassword(token, password);
    setBusy(false);
    if (result.error) return setError(result.error);
    toast({ title: 'Password updated', description: 'You can log in with your new password now.' });
    navigate('/staff-login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4" dir="ltr">
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-2xl bg-white/10 backdrop-blur-md border border-white/20">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-4">
              <ShieldCheck className="text-white w-8 h-8" />
            </div>
            <CardTitle className="text-2xl font-bold text-white">Choose a new password</CardTitle>
            <CardDescription className="text-gray-300">At least 8 characters.</CardDescription>
          </CardHeader>
          <CardContent>
            {!token ? (
              <div className="text-center text-gray-200 space-y-3">
                <p>This link is missing its token. Request a new reset link.</p>
                <Button asChild variant="outline"><Link to="/forgot-password">Request a new link</Link></Button>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-4">
                {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-gray-200">New password</Label>
                  <Input id="newPassword" type="password" required minLength={8} autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-white/10 border-white/20 text-white" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-gray-200">Repeat new password</Label>
                  <Input id="confirmPassword" type="password" required minLength={8} autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="bg-white/10 border-white/20 text-white" />
                </div>
                <Button type="submit" className="w-full" disabled={busy}>{busy ? 'Saving…' : 'Save new password'}</Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
