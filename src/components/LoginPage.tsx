import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { useNavigate } from 'react-router-dom';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        toast.success('Login successful!');
        navigate('/my-apps');
      } else {
        toast.error('Login failed. Please check your credentials.');
      }
    } catch (error) {
      toast.error('An error occurred during login.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="dark min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="bg-card/50 backdrop-blur-xl border border-border/60 rounded-[2.5rem] shadow-2xl p-10 w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center mb-10">
          <div className="mx-auto bg-gradient-to-br from-primary to-indigo-600 text-white w-20 h-20 rounded-3xl flex items-center justify-center mb-6 shadow-lg shadow-primary/20 rotate-3 hover:rotate-0 transition-transform duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 00-1 1v1a2 2 0 11-4 0v-1a1 1 0 00-1-1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
            </svg>
          </div>
          <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-2">Cloud Infrastructure</p>
          <h1 className="text-4xl font-extrabold text-foreground tracking-tight">Builder</h1>
          <p className="text-muted-foreground mt-3 text-sm font-medium opacity-80">Welcome back to the command center</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="text-[11px] font-bold text-foreground/60 uppercase tracking-widest px-1">
              Command Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="styled-input"
              placeholder="operator@kumuni.io"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <label htmlFor="password" className="text-[11px] font-bold text-foreground/60 uppercase tracking-widest">
                Access Key
              </label>
              <a href="#" className="text-[10px] text-primary font-bold uppercase transition-colors hover:text-primary/70">
                Recovery?
              </a>
            </div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="styled-input"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-primary-foreground py-4 rounded-2xl font-bold text-sm shadow-xl shadow-primary/20 hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
                Authenticating...
              </span>
            ) : (
              'Initialize Session'
            )}
          </button>
        </form>

        <div className="mt-8 text-center pt-6 border-t border-border/40">
          <p className="text-muted-foreground text-sm font-medium">
            New operator?{' '}
            <a href="/register" className="font-bold text-primary hover:underline">
              Request Access
            </a>
          </p>
        </div>

        <div className="mt-8 flex justify-center space-x-4">
          {/* Social buttons simplified for premium look */}
          <div className="w-10 h-10 rounded-xl bg-muted/30 border border-border/40 flex items-center justify-center text-muted-foreground hover:bg-primary/20 hover:text-primary hover:border-primary/40 transition-all cursor-pointer">
            <span className="text-xs font-bold">G</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-muted/30 border border-border/40 flex items-center justify-center text-muted-foreground hover:bg-primary/20 hover:text-primary hover:border-primary/40 transition-all cursor-pointer">
            <span className="text-xs font-bold">X</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-muted/30 border border-border/40 flex items-center justify-center text-muted-foreground hover:bg-primary/20 hover:text-primary hover:border-primary/40 transition-all cursor-pointer">
            <span className="text-xs font-bold">F</span>
          </div>
        </div>
      </div>
    </div>
  );
};