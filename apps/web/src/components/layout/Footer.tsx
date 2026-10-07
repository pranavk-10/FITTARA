import React from 'react';
import { ShieldCheck, Lock, Clock, EyeOff } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-zinc-850 bg-zinc-950/90 text-zinc-400 py-10 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <span className="font-heading text-lg font-bold tracking-wider text-white">
              FIT<span className="text-sky-400">3D</span>
            </span>
            <p className="text-xs text-zinc-400 leading-relaxed">
              True 3D virtual fitting room. Physics-backed cloth drape with zero persistent biometric tracking.
            </p>
          </div>

          {/* Privacy Commitments */}
          <div className="space-y-2 md:col-span-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-300 font-mono flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              Non-Negotiable Privacy Architecture
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              We never store persistent body profiles or face likenesses. All measurements, images, and generated 3D meshes exist solely in volatile worker memory and are purged immediately when you leave or when the 15-minute server-side TTL triggers.
            </p>
            <div className="flex flex-wrap gap-4 pt-1 text-[11px] font-mono text-zinc-400">
              <span className="flex items-center gap-1">
                <Lock className="h-3 w-3 text-sky-400" /> In-Memory State
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-amber-400" /> 15-Min TTL Backstop
              </span>
              <span className="flex items-center gap-1">
                <EyeOff className="h-3 w-3 text-emerald-400" /> Zero Biometric Logs
              </span>
            </div>
          </div>

          {/* Architecture Badge */}
          <div className="space-y-2 text-xs font-mono text-zinc-400">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
              Engine Spec
            </h4>
            <p>Three.js WebGPU / WebGL2</p>
            <p>React Three Fiber</p>
            <p>Watermelon UI Tokens</p>
            <p>SMPL-H Parametric Mesh</p>
          </div>
        </div>

        <div className="pt-6 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500">
          <p>© 2026 FIT3D Technologies. "Try the fit before you try the room."</p>
          <p className="font-mono text-[11px] mt-2 sm:mt-0">
            Authoritative Server-Side TTL Enforced
          </p>
        </div>
      </div>
    </footer>
  );
};
