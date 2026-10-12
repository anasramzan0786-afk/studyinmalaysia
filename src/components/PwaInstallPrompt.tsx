'use client';

import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Sparkles, MoreVertical, Share } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    // 1. Register Service Worker for PWA compliance
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        console.warn('SW registration skipped:', err);
      });
    }

    // 2. Check if already running in standalone / installed app mode
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true ||
      document.referrer.includes('android-app://');

    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    // 3. Detect iOS device
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isAppleDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isAppleDevice);

    // 4. Check session-level dismissal (only hide for current session, not 7 days)
    const sessionDismissed = sessionStorage.getItem('meezab_pwa_session_dismissed');
    if (sessionDismissed) {
      return;
    }

    // 5. Listen for native Android/Chrome beforeinstallprompt
    if ((window as any).__meezab_install_prompt) {
      setDeferredPrompt((window as any).__meezab_install_prompt);
      setIsVisible(true);
    }

    const onCanInstall = () => {
      if ((window as any).__meezab_install_prompt) {
        setDeferredPrompt((window as any).__meezab_install_prompt);
        setIsVisible(true);
      }
    };

    window.addEventListener('meezab_can_install', onCanInstall);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      (window as any).__meezab_install_prompt = e;
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // 6. Fallback: on mobile devices where beforeinstallprompt doesn't fire (Samsung Internet, Mi Browser, Safari)
    const isMobile = /android|iphone|ipad|ipod|mobile/i.test(userAgent);
    const timer = setTimeout(() => {
      if (!isStandalone && isMobile) {
        setIsVisible(true);
      }
    }, 2000);

    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setIsVisible(false);
      setDeferredPrompt(null);
      (window as any).__meezab_install_prompt = null;
    });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('meezab_can_install', onCanInstall);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    const promptEvent = deferredPrompt || (window as any).__meezab_install_prompt;
    if (promptEvent) {
      // Direct 1-tap native prompt
      try {
        await promptEvent.prompt();
        const choice = await promptEvent.userChoice;
        if (choice.outcome === 'accepted') {
          setIsVisible(false);
        }
        setDeferredPrompt(null);
        (window as any).__meezab_install_prompt = null;
      } catch (err) {
        setShowInstructions(true);
      }
    } else {
      // Browser didn't expose native event -> Show instant 2-step manual instruction
      setShowInstructions(true);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('meezab_pwa_session_dismissed', 'true');
  };

  if (isInstalled || !isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-md z-50 bg-[#08182b] text-white p-4 rounded-2xl shadow-2xl border border-blue-500/30 backdrop-blur-md animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center shrink-0 text-amber-400">
          <Smartphone className="w-5 h-5" />
        </div>

        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400">
              Mobile App Available
            </span>
            <Sparkles className="w-3 h-3 text-amber-400" />
          </div>

          <h4 className="text-sm font-bold text-white leading-snug mt-0.5">
            Install Meezab Staff Portal App
          </h4>

          {!showInstructions ? (
            <>
              <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                Install on your phone for 1-tap quick admissions &amp; student CRM access without browser bars.
              </p>

              <div className="flex items-center gap-2 mt-3">
                <button
                  onClick={handleInstallClick}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold text-xs shadow-md transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Install App</span>
                </button>
                <button
                  onClick={handleDismiss}
                  className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white text-xs font-semibold transition-colors"
                >
                  Later
                </button>
              </div>
            </>
          ) : (
            <div className="mt-2 bg-blue-950/80 border border-blue-800 rounded-xl p-3 text-[11px] text-slate-200 space-y-1.5">
              <span className="font-bold text-amber-300 block">
                {isIOS ? 'Install on iPhone / iPad:' : 'Install via Browser Menu:'}
              </span>
              {isIOS ? (
                <ol className="list-decimal list-inside space-y-1 text-slate-300 text-[11px]">
                  <li>
                    Tap the <strong className="text-white">Share</strong> button{' '}
                    <Share className="w-3 h-3 inline text-blue-400 mx-0.5" /> in Safari.
                  </li>
                  <li>
                    Scroll down and tap <strong className="text-white">&quot;Add to Home Screen&quot;</strong>.
                  </li>
                </ol>
              ) : (
                <ol className="list-decimal list-inside space-y-1 text-slate-300 text-[11px]">
                  <li>
                    Tap browser menu <strong className="text-white">3 dots</strong>{' '}
                    <MoreVertical className="w-3 h-3 inline text-amber-400 mx-0.5" /> at the top right.
                  </li>
                  <li>
                    Select <strong className="text-white">&quot;Install app&quot;</strong> or{' '}
                    <strong className="text-white">&quot;Add to Home screen&quot;</strong>.
                  </li>
                </ol>
              )}
              <div className="pt-1.5">
                <button
                  onClick={handleDismiss}
                  className="text-[10px] text-blue-300 underline font-bold"
                >
                  Got it, close
                </button>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={handleDismiss}
          className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          aria-label="Dismiss banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
