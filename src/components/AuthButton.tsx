
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { LogIn, LogOut, User } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const AuthButton = () => {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();

  if (loading) {
    return (
      <Button variant="ghost" disabled className="min-w-[80px]">
        Loading...
      </Button>
    );
  }

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-600 hover:text-gray-800"
        >
          <User className="w-4 h-4 mr-2" />
          {user.user_metadata?.full_name || user.email}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={signOut}
          className="bg-white/80 backdrop-blur-sm border border-gray-200 hover:bg-gray-50"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => navigate('/auth')}
      className="bg-white/80 backdrop-blur-sm border border-gray-200 hover:bg-gray-50"
    >
      <LogIn className="w-4 h-4 mr-2" />
      Sign In
    </Button>
  );
};

export default AuthButton;
