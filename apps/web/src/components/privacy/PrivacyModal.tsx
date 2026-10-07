import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { ShieldCheck, Clock, EyeOff, Server, Check } from 'lucide-react';

interface PrivacyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg border border-zinc-800 bg-[#0d0e12] text-zinc-100">
        <DialogHeader className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 border border-emerald-900/50 bg-emerald-950/20 px-2 py-0.5 rounded-sm">
              PRIVACY-FIRST
            </span>
          </div>
          <DialogTitle className="text-xl font-bold tracking-editorial font-heading uppercase text-white">
            PRIVATE BY DESIGN.
          </DialogTitle>
          <DialogDescription className="text-xs text-zinc-400 leading-relaxed font-sans">
            Your fitting session is temporary. Your body information, images and generated fitting assets are automatically removed according to the session lifecycle.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2 text-xs text-zinc-300">
          <div className="p-3.5 rounded-sm bg-[#12141c] border border-zinc-800/80 space-y-1">
            <h4 className="font-semibold text-white flex items-center gap-1.5 font-heading tracking-wide uppercase text-[11px]">
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              The Accurate Product Guarantee
            </h4>
            <p className="text-zinc-400 leading-relaxed text-[11px]">
              We do not fabricate unrealistic claims such as "data never exists." Instead, temporary processing data exists transiently in worker memory only while generating your 3D avatar and cloth simulation, and is destroyed when your session ends or expires.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="p-3 rounded-sm bg-[#111218] border border-zinc-850 space-y-1">
              <span className="font-semibold text-white flex items-center gap-1.5 font-mono text-[10px] uppercase">
                <Clock className="h-3.5 w-3.5 text-zinc-400" />
                15-Min TTL Backstop
              </span>
              <p className="text-zinc-400 text-[11px]">
                Server-side TTL independently destroys expired assets if you close your browser.
              </p>
            </div>

            <div className="p-3 rounded-sm bg-[#111218] border border-zinc-850 space-y-1">
              <span className="font-semibold text-white flex items-center gap-1.5 font-mono text-[10px] uppercase">
                <EyeOff className="h-3.5 w-3.5 text-zinc-400" />
                Zero Persistent DB
              </span>
              <p className="text-zinc-400 text-[11px]">
                No persistent biometric profile, user account, or permanent storage of photos.
              </p>
            </div>

            <div className="p-3 rounded-sm bg-[#111218] border border-zinc-850 space-y-1">
              <span className="font-semibold text-white flex items-center gap-1.5 font-mono text-[10px] uppercase">
                <Server className="h-3.5 w-3.5 text-zinc-400" />
                No Sensitive Logs
              </span>
              <p className="text-zinc-400 text-[11px]">
                Request bodies, measurements, and images are strictly blocked from telemetry.
              </p>
            </div>

            <div className="p-3 rounded-sm bg-[#111218] border border-zinc-850 space-y-1">
              <span className="font-semibold text-white flex items-center gap-1.5 font-mono text-[10px] uppercase">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                Explicit Destruction
              </span>
              <p className="text-zinc-400 text-[11px]">
                Ending your session immediately triggers zeroing and memory clearance.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="pt-2">
          <Button
            variant="default"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto tracking-editorial text-[11px]"
          >
            I UNDERSTAND
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
