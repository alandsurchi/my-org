import React, { useState } from 'react';
import { KeyRound, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { apiClient } from '@/lib/apiClient';

/** Lets the logged-in staff member change their own password. */
const ChangePasswordCard = () => {
  const { toast } = useToast();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (next.length < 8) return toast({ title: 'Too short', description: 'Use at least 8 characters.', variant: 'destructive' });
    if (next !== confirm) return toast({ title: 'Passwords differ', description: 'The two new passwords do not match.', variant: 'destructive' });
    setBusy(true);
    const result = await apiClient.changePassword(current, next);
    setBusy(false);
    if (result.error) return toast({ title: 'Could not change password', description: result.error, variant: 'destructive' });
    setCurrent(''); setNext(''); setConfirm('');
    toast({ title: 'Password changed', description: 'Use the new password next time you log in.' });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><KeyRound className="w-5 h-5" /> My password</CardTitle>
        <CardDescription>Change the password for your own account.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="grid gap-4 md:grid-cols-3 items-end">
          <div className="space-y-2">
            <Label htmlFor="pwCurrent">Current password</Label>
            <Input id="pwCurrent" type="password" autoComplete="current-password" required value={current} onChange={(e) => setCurrent(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pwNew">New password</Label>
            <Input id="pwNew" type="password" autoComplete="new-password" required minLength={8} value={next} onChange={(e) => setNext(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pwConfirm">Repeat new password</Label>
            <Input id="pwConfirm" type="password" autoComplete="new-password" required minLength={8} value={confirm} onChange={(e) => setConfirm(e.target.value)} />
          </div>
          <div className="md:col-span-3">
            <Button type="submit" disabled={busy}>
              {busy && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {busy ? 'Saving…' : 'Change password'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ChangePasswordCard;
