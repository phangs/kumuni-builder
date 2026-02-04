import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { MainLayout } from './MainLayout';
import { User, Mail, Calendar, Edit3, Save, X, LogOut, Camera } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Updating profile:', formData);
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-muted-foreground">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();

  return (
    <MainLayout>
      <div className="h-full overflow-y-auto custom-scrollbar bg-background dot-pattern">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header Section */}
          <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <User size={24} />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-foreground">My Profile</h1>
                <p className="text-muted-foreground leading-relaxed">Personal identity and account management</p>
              </div>
            </div>

            <button
              onClick={logout}
              className="flex items-center gap-2 px-5 py-2.5 bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground rounded-xl font-bold transition-all border border-destructive/20"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar info */}
            <div className="lg:col-span-1 space-y-6 animate-in fade-in slide-in-from-left-4 duration-700 delay-200">
              <div className="bg-card/50 backdrop-blur-xl border border-border/40 rounded-[2.5rem] p-8 shadow-2xl flex flex-col items-center text-center">
                <div className="relative group mb-6">
                  <div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground font-black text-4xl shadow-2xl shadow-primary/30 group-hover:scale-105 transition-transform duration-500">
                    {initials}
                  </div>
                  <button className="absolute -bottom-2 -right-2 p-3 bg-card border border-border rounded-2xl text-primary shadow-xl opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110 active:scale-95">
                    <Camera size={18} />
                  </button>
                </div>

                <h3 className="text-2xl font-bold text-foreground mb-1">{user.firstName} {user.lastName}</h3>
                <p className="text-primary font-medium text-sm mb-6">{user.email}</p>

                <div className="w-full pt-6 border-t border-border/40 space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground font-medium">Role</span>
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full font-bold text-[10px] tracking-widest uppercase">Developer</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground font-medium">Status</span>
                    <span className="flex items-center gap-1.5 text-green-500 font-bold text-[10px] tracking-widest uppercase">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                      Active
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 animate-in fade-in slide-in-from-right-4 duration-700 delay-300">
              <div className="bg-card/50 backdrop-blur-xl border border-border/40 rounded-[2.5rem] p-8 sm:p-10 shadow-2xl h-full">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-bold text-foreground tracking-tight">Personal Details</h2>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-2.5 rounded-xl bg-muted text-foreground hover:bg-muted/80 border border-border/60 transition-all flex items-center gap-2 text-sm font-bold"
                    >
                      <Edit3 size={16} />
                      Edit
                    </button>
                  )}
                </div>

                {isEditing ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest pl-1">First Name</label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="w-full bg-muted/30 border border-border/40 hover:border-border focus:border-primary rounded-2xl px-5 py-3.5 text-sm font-medium transition-all focus:outline-none focus:ring-4 focus:ring-primary/5"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest pl-1">Last Name</label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="w-full bg-muted/30 border border-border/40 hover:border-border focus:border-primary rounded-2xl px-5 py-3.5 text-sm font-medium transition-all focus:outline-none focus:ring-4 focus:ring-primary/5"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest pl-1">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full bg-muted/30 border border-border/40 hover:border-border focus:border-primary rounded-2xl px-5 py-3.5 text-sm font-medium transition-all focus:outline-none focus:ring-4 focus:ring-primary/5"
                      />
                    </div>

                    <div className="pt-6 flex items-center gap-3">
                      <button
                        type="submit"
                        className="flex-1 py-3.5 bg-primary text-primary-foreground rounded-2xl font-bold shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all flex items-center justify-center gap-2"
                      >
                        <Save size={18} />
                        Save Profile
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-6 py-3.5 bg-muted text-foreground border border-border hover:bg-muted/80 rounded-2xl font-bold transition-all flex items-center gap-2"
                      >
                        <X size={18} />
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-10 gap-x-12">
                      <DetailItem icon={<User size={14} />} label="Full Name" value={`${user.firstName} ${user.lastName}`} />
                      <DetailItem icon={<Mail size={14} />} label="Email Address" value={user.email} />
                      <DetailItem icon={<Calendar size={14} />} label="Join Date" value={user.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'} />
                      <DetailItem icon={<Shield size={14} />} label="Security" value="Two-Factor Enabled" status="secure" />
                    </div>

                    <div className="p-6 bg-primary/5 rounded-3xl border border-primary/10 flex items-start gap-4">
                      <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                        <User size={20} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-foreground mb-1">Developer Account</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">Your account is authorized for SDUI microapp creation and cloud deployment on the Kumuni Network.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

const DetailItem = ({ icon, label, value, status }: { icon: any, label: string, value: string, status?: string }) => (
  <div className="space-y-2 group">
    <div className="flex items-center gap-2 text-[10px] font-extrabold text-muted-foreground uppercase tracking-[0.2em] opacity-60">
      {icon}
      {label}
    </div>
    <div className="flex items-center gap-2">
      <p className="text-base font-bold text-foreground group-hover:text-primary transition-colors">{value}</p>
      {status === 'secure' && (
        <span className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
      )}
    </div>
  </div>
);

const Shield = ({ size, className }: { size?: number, className?: string }) => (
  <svg
    width={size || 24}
    height={size || 24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);