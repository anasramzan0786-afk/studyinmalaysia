'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  GraduationCap, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  KeyRound, 
  AlertCircle,
  ArrowRight,
  Sparkles,
  Users
} from 'lucide-react';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get('callbackUrl') || '/';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Invalid credentials.');
      }

      // Successful login -> Redirect to portal or callbackUrl
      router.push(callbackUrl);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const fillCounselorPreset = () => {
    setUsername('counselor');
    setPassword('counselor123');
    setError('');
  };

  const fillAdminPreset = () => {
    setUsername('admin');
    setPassword('admin123');
    setError('');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Background Decorative Atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(30,58,138,0.25),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(10,37,64,0.35),transparent_50%)]" />
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        {/* Brand Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-semibold mb-6 backdrop-blur-md">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Meezab Authorized Personnel Only</span>
        </div>

        {/* Logo */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#0a2540] to-blue-600 border border-blue-400/30 flex items-center justify-center shadow-2xl text-amber-400">
            <GraduationCap className="w-10 h-10" />
          </div>
        </div>

        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          Study<span className="text-blue-400">Malaysia</span> Portal
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Internal Counselor & Advisory Team Authentication Desk
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="bg-slate-900/80 backdrop-blur-xl py-8 px-6 shadow-2xl rounded-3xl border border-slate-800/80 sm:px-10">
          <form className="space-y-6" onSubmit={handleLogin}>
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 text-xs text-red-300 flex items-start gap-3 animate-in fade-in duration-200">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold block text-red-200">Access Denied</strong>
                  <span>{error}</span>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Username / Counselor ID
              </label>
              <div className="relative rounded-2xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. counselor or admin"
                  className="block w-full pl-11 pr-4 py-3 bg-slate-950/60 border border-slate-800 rounded-2xl text-slate-100 placeholder-slate-500 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative rounded-2xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="block w-full pl-11 pr-11 py-3 bg-slate-950/60 border border-slate-800 rounded-2xl text-slate-100 placeholder-slate-500 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg shadow-blue-900/30 transition-all active:scale-98 disabled:opacity-70"
              >
                {isLoading ? (
                  <span>Authenticating Session...</span>
                ) : (
                  <>
                    <span>Unlock Portal Access</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick Presets for Demo / Easy Access */}
          <div className="mt-8 pt-6 border-t border-slate-800/80">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 text-center mb-3">
              ⚡ Quick Fill Credentials Demo
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={fillCounselorPreset}
                className="flex items-center justify-center gap-2 py-2.5 px-3 bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-xl text-xs font-semibold text-slate-300 hover:text-white transition-colors"
              >
                <Users className="w-3.5 h-3.5 text-blue-400" />
                <span>Counselor Desk</span>
              </button>

              <button
                type="button"
                onClick={fillAdminPreset}
                className="flex items-center justify-center gap-2 py-2.5 px-3 bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-xl text-xs font-semibold text-slate-300 hover:text-white transition-colors"
              >
                <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                <span>Admin Master</span>
              </button>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          Protected by Meezab Future Consulting Security Services &copy; 2026
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white text-sm">
        Loading Authentication...
      </div>
    }>
      <LoginFormContent />
    </Suspense>
  );
}
