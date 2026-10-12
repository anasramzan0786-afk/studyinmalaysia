'use client';

import React, { useState, useEffect } from 'react';
import { Smartphone, Check } from 'lucide-react';

export function InstallAppButton({ className = '' }: { className?: string }) {
  const [hasPrompt, setHasPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);

  useEffect(() => {
    // Check if running in standalone mode
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true ||
      document.referrer.includes('android-app://');

    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    // Check if window already captured early install prompt
    if ((window as any).__meezab_install_prompt) {
      setHasPrompt(true);
    }

    const onCanInstall = () => {
      setHasPrompt(true);
    };

    const onBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      (window as any).__meezab_install_prompt = e;
      setHasPrompt(true);
    };

    window.addEventListener('meezab_can_install', onCanInstall);
    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);

    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setHasPrompt(false);
      (window as any).__meezab_install_prompt = null;
    });

    return () => {
      window.removeEventListener('meezab_can_install', onCanInstall);
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt);
    };
  }, []);

  const handleClick = async () => {
    if (isInstalled) return;

    const promptEvent = (window as any).__meezab_install_prompt;
    if (promptEvent) {
      // 1-Click Native Chrome Prompt!
      try {
        await promptEvent.prompt();
        const choice = await promptEvent.userChoice;
        if (choice.outcome === 'accepted') {
          setIsInstalled(true);
        }
        (window as any).__meezab_install_prompt = null;
        setHasPrompt(false);
      } catch (err) {
        console.error('Install prompt error:', err);
      }
    } else {
      // Browser doesn't support direct trigger or has blocked it (e.g. iOS Safari)
      setShowIOSModal(true);
    }
  };

  if (isInstalled) {
    return (
      <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 ${className}`}>
        <Check className="w-3.5 h-3.5" />
        <span>App Installed</span>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={handleClick}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-800 hover:to-indigo-900 text-white shadow-xs transition-all active:scale-95 cursor-pointer ${className}`}
      >
        <Smartphone className="w-3.5 h-3.5 text-amber-300" />
        <span>Install App</span>
      </button>

      {/* Fallback instruction modal ONLY when browser strictly prevents 1-click (like Safari) */}
      {showIOSModal && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowIOSModal(false)}
        >
          <div
            className="bg-[#08182b] text-white p-5 rounded-2xl max-w-sm w-full border border-blue-500/30 shadow-2xl space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-sm">Install on Your Phone</h3>
              </div>
              <button
                onClick={() => setShowIOSModal(false)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              If your browser doesn&apos;t show the 1-click popup automatically:
            </p>

            <div className="space-y-2 text-xs text-slate-200 bg-white/5 p-3 rounded-xl border border-white/10">
              <p>
                <strong>Android (Chrome / Samsung / Mi):</strong><br />
                Tap the <span className="text-amber-300 font-bold">3 dots (⋮)</span> at top right &rarr; select <span className="text-amber-300 font-bold">&quot;Install app&quot;</span>.
              </p>
              <div className="border-t border-white/10 pt-2">
                <p>
                  <strong>iPhone / iPad (Safari):</strong><br />
                  Tap the <span className="text-blue-400 font-bold">Share icon</span> at bottom &rarr; select <span className="text-blue-400 font-bold">&quot;Add to Home Screen&quot;</span>.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}
