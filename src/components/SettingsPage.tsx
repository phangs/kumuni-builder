import React, { useState } from 'react';
import { MainLayout } from './MainLayout';
import { Settings, Bell, Globe, Shield, Moon, Check, ChevronRight, Monitor, MessageSquare, Mail } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false
  });
  const [language, setLanguage] = useState('en');

  const toggleNotification = (type: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [type]: !prev[type] }));
  };

  return (
    <MainLayout>
      <div className="h-full overflow-y-auto custom-scrollbar bg-background dot-pattern">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header Section */}
          <div className="mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <Settings size={24} />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Settings</h1>
                <p className="text-muted-foreground leading-relaxed">System preferences and account configurations</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="md:col-span-1 space-y-2 animate-in fade-in slide-in-from-left-4 duration-700 delay-200">
              <NavButton icon={<Settings size={18} />} label="General" active />
              <NavButton icon={<Bell size={18} />} label="Notifications" />
              <NavButton icon={<Shield size={18} />} label="Security" />
              <NavButton icon={<Globe size={18} />} label="Language" />
            </div>

            {/* Content Area */}
            <div className="md:col-span-3 space-y-8 animate-in fade-in slide-in-from-right-4 duration-700 delay-300">
              {/* Appearance Section */}
              <section className="bg-card/50 backdrop-blur-xl border border-border/40 rounded-[2.5rem] p-8 sm:p-10 shadow-2xl">
                <div className="flex items-center gap-3 mb-8">
                  <Monitor className="text-primary" size={20} />
                  <h2 className="text-xl font-bold text-foreground tracking-tight">Appearance</h2>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between p-6 bg-muted/30 rounded-[2rem] border border-border/40">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                        <Moon size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">Theme Mode</p>
                        <p className="text-[11px] text-muted-foreground">Force high-fidelity dark mode across the builder.</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-primary/20 text-primary rounded-xl text-xs font-black tracking-widest uppercase">
                      <Check size={14} strokeWidth={3} />
                      Dark
                    </div>
                  </div>
                </div>
              </section>

              {/* Notifications Section */}
              <section className="bg-card/50 backdrop-blur-xl border border-border/40 rounded-[2.5rem] p-8 sm:p-10 shadow-2xl">
                <div className="flex items-center gap-3 mb-8">
                  <Bell className="text-primary" size={20} />
                  <h2 className="text-xl font-bold text-foreground tracking-tight">Notification Channels</h2>
                </div>

                <div className="space-y-4">
                  <ToggleItem
                    icon={<Mail size={18} />}
                    title="Email Notifications"
                    desc="Receive activity digests and security alerts."
                    enabled={notifications.email}
                    onToggle={() => toggleNotification('email')}
                  />
                  <ToggleItem
                    icon={<Monitor size={18} />}
                    title="Push Alerts"
                    desc="Real-time updates directly on your device."
                    enabled={notifications.push}
                    onToggle={() => toggleNotification('push')}
                  />
                  <ToggleItem
                    icon={<MessageSquare size={18} />}
                    title="SMS / Phone"
                    desc="Critical infrastructure and downtime alerts."
                    enabled={notifications.sms}
                    onToggle={() => toggleNotification('sms')}
                  />
                </div>
              </section>

              {/* Language Section */}
              <section className="bg-card/50 backdrop-blur-xl border border-border/40 rounded-[2.5rem] p-8 sm:p-10 shadow-2xl">
                <div className="flex items-center gap-3 mb-8">
                  <Globe className="text-primary" size={20} />
                  <h2 className="text-xl font-bold text-foreground tracking-tight">Regional Settings</h2>
                </div>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.2em] pl-1">Primary Language</label>
                    <div className="relative group">
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="w-full bg-muted/30 border border-border/40 hover:border-border focus:border-primary rounded-2xl px-6 py-4 text-sm font-bold transition-all appearance-none focus:outline-none focus:ring-4 focus:ring-primary/5 cursor-pointer"
                      >
                        <option value="en">English (United States)</option>
                        <option value="es">Español (España)</option>
                        <option value="ph">Tagalog (Philippines)</option>
                        <option value="de">Deutsch (Germany)</option>
                      </select>
                      <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 text-muted-foreground rotate-90 pointer-events-none" size={16} />
                    </div>
                  </div>
                </div>
              </section>

              <div className="pt-4 flex justify-end gap-4">
                <button className="px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-bold shadow-2xl shadow-primary/30 hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0 transition-all text-sm">
                  Save All Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

const NavButton = ({ icon, label, active = false }: { icon: any, label: string, active?: boolean }) => (
  <button className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all border ${active
    ? 'bg-primary/10 border-primary/20 text-primary shadow-lg shadow-primary/5'
    : 'bg-transparent border-transparent text-muted-foreground hover:bg-muted/30 hover:text-foreground'}`}>
    <div className="flex items-center gap-3 text-sm font-bold">
      {icon}
      {label}
    </div>
    {active && <div className="w-1.5 h-1.5 bg-primary rounded-full" />}
  </button>
);

const ToggleItem = ({ icon, title, desc, enabled, onToggle }: { icon: any, title: string, desc: string, enabled: boolean, onToggle: () => void }) => (
  <div className="flex items-center justify-between p-6 bg-muted/20 rounded-[2rem] border border-border/20 group hover:border-border/40 transition-colors">
    <div className="flex items-center gap-5">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${enabled ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
        {icon}
      </div>
      <div>
        <h4 className="text-sm font-bold text-foreground">{title}</h4>
        <p className="text-[11px] text-muted-foreground leading-tight">{desc}</p>
      </div>
    </div>

    <button
      onClick={onToggle}
      className={`w-14 h-8 rounded-full relative transition-all duration-300 ${enabled ? 'bg-primary shadow-lg shadow-primary/20' : 'bg-muted-foreground/30'}`}
    >
      <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform duration-300 shadow-md ${enabled ? 'translate-x-6' : 'translate-x-0'}`} />
    </button>
  </div>
);