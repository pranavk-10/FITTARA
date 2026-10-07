import React from 'react';
import { ShieldCheck, Cpu } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { GpuCapability } from '../../hooks/useWebGPU';
import { SessionStatus } from '@fit3d/types';

interface NavbarProps {
  sessionId?: string;
  sessionStatus?: SessionStatus;
  gpu: GpuCapability;
  onDestroySession: () => void;
  onOpenPrivacyModal: () => void;
  onCreateFitClick?: () => void;
  onNavigateSection?: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  sessionId,
  sessionStatus,
  gpu,
  onDestroySession,
  onOpenPrivacyModal,
  onCreateFitClick,
  onNavigateSection,
}) => {
  const isSessionActive = Boolean(sessionId && sessionStatus !== 'DESTROYED');

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-900 bg-[#08080a]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand: Exactly FITTARA */}
        <div className="flex items-center gap-8">
          <a
            href="/"
            className="flex items-center gap-2 group"
            aria-label="FITTARA Home"
          >
            <span className="font-heading text-lg font-bold tracking-editorial text-white uppercase group-hover:text-zinc-200 transition-colors">
              FITTARA
            </span>
          </a>

          {/* Navigation Links: How it works · Technology · Privacy */}
          {!isSessionActive && (
            <nav className="hidden md:flex items-center gap-6 text-xs uppercase tracking-editorial text-zinc-400">
              <button
                onClick={() => onNavigateSection?.('how-it-works')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                How it works
              </button>
              <button
                onClick={() => onNavigateSection?.('technology')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Technology
              </button>
              <button
                onClick={onOpenPrivacyModal}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Privacy
              </button>
            </nav>
          )}
        </div>

        {/* Right Side: GPU tier, Privacy Pill, and Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Subtle GPU Indicator */}
          <div className="hidden lg:flex items-center">
            {gpu.tier === 'webgpu' ? (
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                WebGPU
              </span>
            ) : (
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
                WebGL2
              </span>
            )}
          </div>

          {/* Privacy Pill */}
          <button
            onClick={onOpenPrivacyModal}
            className="flex items-center gap-1.5 rounded-sm border border-zinc-800 bg-[#12131a] px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors cursor-pointer"
            title="Privacy-first temporary session"
          >
            <ShieldCheck className="h-3 w-3 text-emerald-400" />
            <span>PRIVATE BY DESIGN</span>
          </button>

          {/* Primary Action / End Session CTA */}
          {isSessionActive ? (
            <Button
              variant="destructive"
              size="sm"
              onClick={onDestroySession}
              className="text-[11px] tracking-editorial font-semibold"
            >
              END SESSION
            </Button>
          ) : (
            <Button
              variant="default"
              size="sm"
              onClick={onCreateFitClick}
              className="text-[11px] tracking-editorial font-semibold"
            >
              CREATE MY FIT
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
