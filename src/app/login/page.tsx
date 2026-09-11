'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Lock,
  User,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
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

      router.push(callbackUrl);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row font-sans">

      {/* ── LEFT PANEL: Petronas Twin Towers + Brand ── */}
      <div className="hidden md:flex w-1/2 relative overflow-hidden flex-col justify-between p-10 lg:p-14">

        {/* Twin Towers background photo */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=1400&q=85&auto=format&fit=crop')`,
          }}
        />
        {/* Deep navy overlay for brand readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B2553]/92 via-[#0B2553]/80 to-[#1a3a70]/70" />

        {/* Decorative crimson bar — Meezab signature */}
        <div className="absolute top-0 left-0 w-[6px] h-full bg-[#BA2E34]" />

        {/* Top: Logo */}
        <div className="relative z-10">
          <img
            src="https://meezabfuture.com/wp-content/uploads/2023/11/Total-White.png"
            alt="Meezab Future Consulting"
            className="h-12 object-contain"
          />
        </div>

        {/* Center: Headline copy */}
        <div className="relative z-10 space-y-6 -mt-10">
          <div className="space-y-4">
            <h2 className="text-4xl lg:text-5xl font-black text-white leading-tight">
              Your Gateway
              <br />
              to&nbsp;
              <span
                style={{
                  background: 'linear-gradient(95deg, #FFD166 0%, #E8A300 60%, #FFA300 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Malaysia.
              </span>
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed max-w-xs">
              Secure portal for Meezab counselors & admissions officers. Manage university programs, EMGS costs, and student inquiries.
            </p>
          </div>

          <div className="space-y-2.5 text-xs font-semibold text-slate-300">
            {[
              'Live program & fee database',
              'EMGS eVAL & visa calculator',
              'Direct student inquiry inbox',
            ].map((item) => (
              <div key={item} className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#E8A300] shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="relative z-10 text-xs text-slate-500">
          © {new Date().getFullYear()} Meezab Future Consulting Pvt Ltd. All Rights Reserved.
        </div>
      </div>

      {/* ── RIGHT PANEL: Login Form ── */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16 bg-[#F5F7FA]">
        <div className="w-full max-w-md space-y-8">

          {/* Mobile: show logo */}
          <div className="md:hidden flex justify-center">
            <img
              src="https://meezabfuture.com/wp-content/uploads/2023/11/Meezab-Logo-new.png"
              alt="Meezab Future Consulting"
              className="h-10 object-contain"
            />
          </div>

          {/* Header */}
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#3A60A1] bg-[#3A60A1]/10 border border-[#3A60A1]/20 px-3 py-1 rounded-full mb-4">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Counselor Portal Access</span>
            </div>
            <h1 className="text-3xl font-black text-[#0B2553] tracking-tight">
              Sign In
            </h1>
            <p className="text-slate-500 text-sm">
              Enter your credentials to access the advisory dashboard.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-xs text-red-700 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold block text-red-900">Sign In Failed</strong>
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">

            {/* Username */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
                Username / Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <User className="h-4.5 w-4.5" />
                </div>
                <input
                  id="login-username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username or email"
                  className="block w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#3A60A1] focus:border-[#3A60A1] transition-all shadow-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4.5 w-4.5" />
                </div>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="block w-full pl-11 pr-11 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#3A60A1] focus:border-[#3A60A1] transition-all shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center gap-2.5 py-4 px-6 rounded-xl text-sm font-extrabold bg-[#E8A300] hover:bg-[#d49400] text-[#0B2553] shadow-lg shadow-amber-200/40 transition-all active:scale-98 disabled:opacity-70 mt-2"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-[#0B2553]/30 border-t-[#0B2553] rounded-full animate-spin" />
                  Verifying...
                </span>
              ) : (
                <>
                  <span>Sign In to Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer note */}
          <p className="text-center text-xs text-slate-400">
            Internal use only &mdash; Meezab Future Consulting staff only.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0B2553] flex items-center justify-center">
        <img
          src="https://meezabfuture.com/wp-content/uploads/2023/11/Total-White.png"
          alt="Loading..."
          className="h-10 object-contain animate-pulse"
        />
      </div>
    }>
      <LoginFormContent />
    </Suspense>
  );
}
