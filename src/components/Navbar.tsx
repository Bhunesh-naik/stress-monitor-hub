import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Activity, LogOut } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, username, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) return null;

  const linkClass = (path: string) =>
    `text-sm font-medium transition-colors hover:text-primary ${
      location.pathname === path ? 'text-primary' : 'text-muted-foreground'
    }`;

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="max-w-6xl mx-auto flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link to="/dashboard" className="flex items-center gap-2 font-bold text-foreground">
            <Activity className="h-5 w-5 text-primary" />
            StressMonitor
          </Link>
          <Link to="/dashboard" className={linkClass('/dashboard')}>Dashboard</Link>
          <Link to="/history" className={linkClass('/history')}>History</Link>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">Hi, {username}</span>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="mr-1 h-4 w-4" /> Logout
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
