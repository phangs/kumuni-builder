import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, ShieldCheck, Clock, CheckCircle2, ChevronRight } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [company, setCompany] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const { register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await register({
        email,
        password,
        fullName,
        company
      });
      if (success) {
        toast.success('Registration request submitted successfully!');
        setRegistrationSuccess(true);
      } else {
        toast.error('Registration failed. Please try again.');
      }
    } catch (error) {
      toast.error('An error occurred during registration.');
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (registrationSuccess) {
    return (
      <div className="dark min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden text-foreground">
        {/* Dynamic Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <div className="bg-card/50 backdrop-blur-xl border border-border/60 rounded-[3rem] shadow-2xl p-12 w-full max-w-lg relative z-10 animate-in fade-in zoom-in-95 duration-700 text-center">
          <div className="mx-auto bg-gradient-to-br from-amber-500 to-orange-600 text-white w-24 h-24 rounded-[2rem] flex items-center justify-center mb-10 shadow-2xl shadow-amber-500/20 rotate-6 animate-bounce-subtle">
            <Clock size={48} strokeWidth={2.5} />
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight mb-4">Verification Pending</h1>
          <p className="text-muted-foreground text-lg mb-10 leading-relaxed mx-auto max-w-sm">
            Thank you, <span className="text-foreground font-bold">{fullName.split(' ')[0]}</span>. Your identity has been recorded and is currently awaiting admin verification.
          </p>

          <div className="space-y-4 mb-10">
            <div className="flex items-start gap-4 p-5 bg-muted/30 rounded-2xl border border-border/40 text-left">
              <div className="bg-primary/20 p-2 rounded-lg text-primary mt-0.5">
                <CheckCircle2 size={18} />
              </div>
              <div>
                <p className="text-sm font-bold mb-0.5 text-foreground">Identity Created</p>
                <p className="text-xs text-muted-foreground">Your account details have been securely stored in our systems.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-5 bg-muted/30 rounded-2xl border border-border/40 text-left">
              <div className="bg-amber-500/20 p-2 rounded-lg text-amber-500 mt-0.5">
                <ShieldCheck size={18} />
              </div>
              <div>
                <p className="text-sm font-bold mb-0.5 text-foreground">Awaiting Review</p>
                <p className="text-xs text-muted-foreground">An administrator will review your application within 24-48 business hours.</p>
              </div>
            </div>
          </div>

          <Link
            to="/login"
            className="w-full bg-primary text-primary-foreground py-4 rounded-2xl font-bold text-sm shadow-xl shadow-primary/20 hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
          >
            Back to Initial Session
            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>

          <p className="mt-8 text-xs text-muted-foreground font-medium uppercase tracking-widest opacity-60">
            System Message ID: {Math.random().toString(36).substring(7).toUpperCase()}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="dark min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="bg-card/50 backdrop-blur-xl border border-border/60 rounded-[2.5rem] shadow-2xl p-10 w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center mb-8">
          <div className="mx-auto bg-gradient-to-br from-primary to-indigo-600 text-white w-20 h-20 rounded-3xl flex items-center justify-center mb-6 shadow-lg shadow-primary/20 -rotate-3 hover:rotate-0 transition-transform duration-300">
            <UserPlus size={40} />
          </div>
          <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-2">New Recruitment</p>
          <h1 className="text-4xl font-extrabold text-foreground tracking-tight">Register</h1>
          <p className="text-muted-foreground mt-3 text-sm font-medium opacity-80">Join the elite builder squadron</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="full-name" className="text-[11px] font-bold text-foreground/60 uppercase tracking-widest px-1">
              Full Name
            </label>
            <input
              id="full-name"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="styled-input px-4"
              placeholder="John Doe"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="company" className="text-[11px] font-bold text-foreground/60 uppercase tracking-widest px-1">
              Company
            </label>
            <input
              id="company"
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
              className="styled-input px-4"
              placeholder="Kumuni"
            />
          </div>

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
            <label htmlFor="password" className="text-[11px] font-bold text-foreground/60 uppercase tracking-widest px-1">
              Access Key
            </label>
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

          <div className="flex items-center px-1 py-1">
            <input
              id="terms"
              type="checkbox"
              required
              className="h-4 w-4 bg-muted border-border rounded text-primary focus:ring-primary/20"
            />
            <label htmlFor="terms" className="ml-2 block text-[11px] text-muted-foreground font-medium">
              I accept the <a href="#" className="text-primary hover:underline">Protocols</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-primary-foreground py-4 rounded-2xl font-bold text-sm shadow-xl shadow-primary/20 hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 mt-2"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
                Processing...
              </span>
            ) : (
              'Create Identity'
            )}
          </button>
        </form>

        <div className="mt-8 text-center pt-6 border-t border-border/40">
          <p className="text-muted-foreground text-sm font-medium">
            Already verified?{' '}
            <Link to="/login" className="font-bold text-primary hover:underline">
              Initialize Session
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};