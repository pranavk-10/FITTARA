import React from 'react';
import { ShieldCheck, Lock, Clock, EyeOff } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-zinc-900 bg-[#08080a] text-zinc-400 py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <span className="font-heading text-lg font-bold tracking-editorial text-white uppercase">
              FITTARA
            </span>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Virtual fitting, reimagined.
            </p>
            <p className="text-[11px] text-zinc-500 font-sans leading-normal">
              Your body. Your clothes. Your fit. In 3D.
            </p>
          </div>

          {/* Privacy Commitments */}
          <div className="space-y-3 md:col-span-2">
            <h4 className="text-[11px] font-semibold uppercase tracking-editorial text-zinc-200 font-heading flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              Private by Design
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Your fitting session is temporary. Your body information, images and generated fitting assets are automatically removed according to the session lifecycle. We do not persist consumer identities or store biometric profiles.
            </p>
            <div className="flex flex-wrap gap-4 pt-1 text-[10px] font-mono uppercase tracking-wider text-zinc-400">
              <span className="flex items-center gap-1">
                <Lock className="h-3 w-3 text-zinc-400" /> Ephemeral Memory
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-zinc-400" /> 15-Minute TTL
              </span>
              <span className="flex items-center gap-1">
                <EyeOff className="h-3 w-3 text-emerald-400" /> Zero Biometric Logs
              </span>
            </div>
          </div>

          {/* Technology Spec */}
          <div className="space-y-2 text-xs text-zinc-400">
            <h4 className="text-[11px] font-semibold uppercase tracking-editorial text-zinc-200 font-heading">
              Technology
            </h4>
            <div className="space-y-1 font-mono text-[11px] text-zinc-400">
              <p>Parametric Human Rig</p>
              <p>Physics Cloth Solver</p>
              <p>Three.js WebGPU / WebGL2</p>
              <p>Authoritative TTL</p>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-zinc-900/60 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500">
          <p>© 2026 FITTARA. Virtual fitting, reimagined.</p>
          <p className="font-mono text-[10px] uppercase tracking-wider mt-2 sm:mt-0">
            Session data destroyed upon exit
          </p>
        </div>
      </div>
    </footer>
  );
};
