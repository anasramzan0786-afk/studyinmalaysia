'use client';

import React, { useState, useEffect } from 'react';
import { Download, Smartphone, Check } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallAppButton({ className = '' }: { className?: string }) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);

  useEffect(() => {
    // Check if running in standalone
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;

    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleClick = async () => {
    if (isInstalled) return;

    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      // Trigger instruction modal for iOS or browsers without native prompt
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
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-800 hover:to-indigo-900 text-white shadow-xs transition-all active:scale-95 ${className}`}
      >
        <Smartphone className="w-3.5 h-3.5 text-amber-300" />
        <span>Install App</span>
      </button>

      {/* Manual Install Instruction Modal if native prompt not supported by browser */}
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
              To install this portal as a standalone app on your phone:
            </p>

            <div className="space-y-2 text-xs text-slate-200 bg-white/5 p-3 rounded-xl border border-white/10">
              <p>
                <strong>Android (Chrome / Samsung / Mi):</strong><br />
                Tap the <span className="text-amber-300 font-bold">3 dots (⋮)</span> at the top right of your browser and select <span className="text-amber-300 font-bold">&quot;Install app&quot;</span> or <span className="text-amber-300 font-bold">&quot;Add to Home screen&quot;</span>.
              </p>
              <div className="border-t border-white/10 pt-2">
                <p>
                  <strong>iPhone / iPad (Safari):</strong><br />
                  Tap the <span className="text-blue-400 font-bold">Share icon</span> at the bottom and select <span className="text-blue-400 font-bold">&quot;Add to Home Screen&quot;</span>.
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

