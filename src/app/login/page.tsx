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
  AlertCircle,
  ArrowRight,
  Sparkles,
  Users,
  KeyRound,
  CheckCircle2
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
    <div className="min-h-screen w-full bg-slate-50 flex flex-col md:flex-row font-sans">
      {/* LEFT SIDE: Big Brand Logo & Visual Hero Banner */}
      <div className="w-full md:w-1/2 bg-[#08182b] text-white p-8 lg:p-16 flex flex-col justify-between relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top badge */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-semibold text-emerald-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Meezab Future Advisory Network</span>
          </div>
        </div>

        {/* Center: BIG LOGO & BRANDING */}
        <div className="relative z-10 my-12 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-blue-700 to-indigo-600 border border-blue-400/40 flex items-center justify-center shadow-2xl text-amber-400">
              <GraduationCap className="w-12 h-12" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-3xl sm:text-4xl tracking-tight text-white">
                  Study<span className="text-blue-400">Malaysia</span>
                </span>
                <span className="bg-blue-900/80 text-blue-200 text-xs font-bold px-2 py-0.5 rounded border border-blue-700">
                  Portal
                </span>
              </div>
              <p className="text-sm text-slate-300 font-medium mt-1">
                Meezab Future Education Advisory Desk
              </p>
            </div>
          </div>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-md">
            Official internal portal for counselors &amp; admissions officers. Access verified Malaysian university tuition fees, semester breakdowns, and EMGS visa tools.
          </p>

          <div className="pt-4 grid grid-cols-2 gap-3 max-w-md text-xs font-semibold text-slate-300">
            <div className="flex items-center gap-2 bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>MOHE &amp; MQA Recognized</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span>EMGS Visa Calculator</span>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="relative z-10 text-xs text-slate-500">
          &copy; {new Date().getFullYear()} Meezab Future Consulting. All Rights Reserved.
        </div>
      </div>

      {/* RIGHT SIDE: CLEAN MINIMALIST LOGIN FORM */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16 bg-white">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Counselor Sign In
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Please enter your credentials to open the portal.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-xs text-red-700 flex items-start gap-3 animate-in fade-in duration-200">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold block text-red-900">Sign In Failed</strong>
                  <span>{error}</span>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Username / Email ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username or email"
                  className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="block w-full pl-11 pr-11 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-[#0a2540] hover:bg-[#15385d] focus:outline-hidden focus:ring-2 focus:ring-blue-600 shadow-md transition-all active:scale-98 disabled:opacity-70"
            >
              {isLoading ? (
                <span>Verifying Credentials...</span>
              ) : (
                <>
                  <span>Sign In to Portal</span>
                  <ArrowRight className="w-4 h-4 text-emerald-400" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Helper */}
          <div className="pt-6 border-t border-slate-200">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 text-center mb-3">
              Quick Fill Demo Credentials
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={fillCounselorPreset}
                className="flex items-center justify-center gap-2 py-2.5 px-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl text-xs font-semibold text-blue-900 transition-colors"
              >
                <Users className="w-3.5 h-3.5 text-blue-700" />
                <span>Counselor Desk</span>
              </button>

              <button
                type="button"
                onClick={fillAdminPreset}
                className="flex items-center justify-center gap-2 py-2.5 px-3 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl text-xs font-semibold text-amber-900 transition-colors"
              >
                <KeyRound className="w-3.5 h-3.5 text-amber-700" />
                <span>Admin Master</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white text-sm">
        Loading Authentication...
      </div>
    }>
      <LoginFormContent />
    </Suspense>
  );
}
