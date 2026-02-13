import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, Settings, LayoutGrid, LogOut, ChevronDown, Users, LayoutDashboard } from 'lucide-react';

interface UserProfileMenuProps {
  user?: {
    id: string;
    email: string;
    fullName: string;
    company: string;
    role?: string;
  } | null;
}

export const UserProfileMenu: React.FC<UserProfileMenuProps> = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/30 rounded-full border border-border/40">
        <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Guest Session</span>
      </div>
    );
  }

  const initials = user.fullName
    ? user.fullName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    : user.email.charAt(0).toUpperCase();

  const isAdmin = user.role === 'Admin';

  return (
    <div className="relative" ref={menuRef} style={{ zIndex: 1000 }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-3 p-1.5 pr-4 rounded-2xl transition-all duration-300 group ${isOpen ? 'bg-muted/50 border-primary/20' : 'hover:bg-muted/30 border-transparent'} border`}
        aria-label="User menu"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <div className="relative">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-primary/80 to-accent flex items-center justify-center text-primary-foreground font-black text-sm shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform duration-300">
            {initials}
          </div>
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-background rounded-full flex items-center justify-center border-2 border-background">
            <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
          </div>
        </div>
        <div className="hidden md:block text-left">
          <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors leading-none mb-1">{user.fullName}</p>
          <p className="text-[10px] font-medium text-muted-foreground opacity-60 leading-none">{user.email}</p>
        </div>
        <ChevronDown
          size={16}
          className={`text-muted-foreground transition-transform duration-500 ease-out ${isOpen ? 'rotate-180 text-primary' : 'group-hover:translate-y-0.5'}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-64 rounded-[1.5rem] shadow-2xl bg-card border border-border/60 overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-300 origin-top-right">
          <div className="p-2 space-y-1" role="menu">
            <MenuLink
              icon={<User size={16} />}
              label="Profile Account"
              onClick={() => { navigate('/profile'); setIsOpen(false); }}
            />
            <MenuLink
              icon={<Settings size={16} />}
              label="Preferences"
              onClick={() => { navigate('/settings'); setIsOpen(false); }}
            />

            {/* Conditional menu items based on role */}
            {isAdmin ? (
              <>
                <MenuLink
                  icon={<LayoutDashboard size={16} />}
                  label="Dashboard"
                  onClick={() => { navigate('/admin/dashboard'); setIsOpen(false); }}
                />
                <MenuLink
                  icon={<Users size={16} />}
                  label="Developers"
                  onClick={() => { navigate('/admin/developers'); setIsOpen(false); }}
                />
              </>
            ) : (
              <MenuLink
                icon={<LayoutGrid size={16} />}
                label="My Applications"
                onClick={() => { navigate('/my-apps'); setIsOpen(false); }}
              />
            )}

            <div className="h-px bg-border/40 my-2 mx-3"></div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-500/10 rounded-xl transition-all group/logout"
              role="menuitem"
            >
              <LogOut size={16} className="group-hover/logout:-translate-x-1 transition-transform" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const MenuLink = ({ icon, label, onClick }: { icon: any, label: string, onClick: () => void }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm font-bold text-foreground hover:bg-muted/60 hover:text-primary rounded-xl transition-all group/link"
    role="menuitem"
  >
    <div className="text-muted-foreground group-hover/link:text-primary transition-colors">
      {icon}
    </div>
    {label}
  </button>
);