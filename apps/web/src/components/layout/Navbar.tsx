import React from 'react';
import { ShieldCheck, Cpu, Trash2, Sparkles, AlertCircle } from 'lucide-react';
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
}

export const Navbar: React.FC<NavbarProps> = ({
  sessionId,
  sessionStatus,
  gpu,
  onDestroySession,
  onOpenPrivacyModal,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-sky-400 to-blue-600 shadow-md shadow-sky-500/20">
            <Sparkles className="h-5 w-5 text-black font-bold" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-heading text-lg font-bold tracking-wider text-white">
                FIT<span className="text-sky-400">3D</span>
              </span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700/50">
                v0.1-Alpha
              </span>
            </div>
            <span className="text-[11px] text-zinc-400 hidden sm:inline">
              True 3D Virtual Fitting Room
            </span>
          </div>
        </div>

        {/* Status Badges & Controls */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* GPU Hardware Capability Badge */}
          <div className="hidden md:flex items-center">
            {gpu.tier === 'webgpu' ? (
              <Badge variant="default" className="gap-1.5 py-1 bg-sky-950/40 border-sky-800/60 text-sky-300">
                <Cpu className="h-3 w-3 text-sky-400" />
                <span>WebGPU Active</span>
              </Badge>
            ) : gpu.tier === 'webgl2' ? (
              <Badge variant="secondary" className="gap-1.5 py-1 text-zinc-300">
                <Cpu className="h-3 w-3 text-zinc-400" />
                <span>WebGL2 Fallback</span>
              </Badge>
            ) : (
              <Badge variant="destructive" className="gap-1.5 py-1">
                <AlertCircle className="h-3 w-3" />
                <span>Software Raster</span>
              </Badge>
            )}
          </div>

          {/* Privacy Guarantee Pill */}
          <button
            onClick={onOpenPrivacyModal}
            className="flex items-center gap-1.5 rounded-full bg-emerald-950/40 border border-emerald-800/50 px-2.5 py-1 text-xs text-emerald-400 hover:bg-emerald-900/40 transition-colors font-mono cursor-pointer"
            title="Click to view ephemeral privacy policy"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span className="hidden sm:inline">EPHEMERAL PRIVACY</span>
            <span className="sm:hidden">PRIVATE</span>
          </button>

          {/* Active Session & Destruction CTA */}
          {sessionId && sessionStatus !== 'DESTROYED' ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-400 font-mono hidden lg:inline">
                ID: {sessionId.slice(0, 8)}...
              </span>
              <Button
                variant="destructive"
                size="sm"
                onClick={onDestroySession}
                className="gap-1.5 text-xs h-8"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Destroy Session</span>
                <span className="sm:hidden">End</span>
              </Button>
            </div>
          ) : (
            <div className="text-xs text-zinc-500 font-mono hidden sm:inline">
              NO ACTIVE SESSION
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
