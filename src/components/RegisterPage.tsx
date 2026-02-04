import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { useNavigate } from 'react-router-dom';

export const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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
        firstName,
        lastName
      });
      if (success) {
        toast.success('Registration successful! Redirecting to dashboard...');
        navigate('/my-apps');
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="bg-card/50 backdrop-blur-xl border border-border/60 rounded-[2.5rem] shadow-2xl p-10 w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center mb-8">
          <div className="mx-auto bg-gradient-to-br from-primary to-indigo-600 text-white w-20 h-20 rounded-3xl flex items-center justify-center mb-6 shadow-lg shadow-primary/20 -rotate-3 hover:rotate-0 transition-transform duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-2">New Recruitment</p>
          <h1 className="text-4xl font-extrabold text-foreground tracking-tight">Register</h1>
          <p className="text-muted-foreground mt-3 text-sm font-medium opacity-80">Join the elite builder squadron</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="first-name" className="text-[11px] font-bold text-foreground/60 uppercase tracking-widest px-1">
                First Name
              </label>
              <input
                id="first-name"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="styled-input px-3"
                placeholder="John"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="last-name" className="text-[11px] font-bold text-foreground/60 uppercase tracking-widest px-1">
                Last Name
              </label>
              <input
                id="last-name"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="styled-input px-3"
                placeholder="Doe"
              />
            </div>
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
            <a href="/login" className="font-bold text-primary hover:underline">
              Initialize Session
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};