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
import { ShieldCheck, Clock, Server, EyeOff, CheckCircle } from 'lucide-react';

interface PrivacyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-lg bg-emerald-950/60 border border-emerald-800/60 text-emerald-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <DialogTitle className="text-xl">FIT3D Privacy Architecture</DialogTitle>
          </div>
          <DialogDescription className="text-zinc-400">
            Our commitment is technical, architectural, and truthful.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2 text-sm text-zinc-300">
          <div className="rounded-lg border border-emerald-900/40 bg-emerald-950/20 p-4">
            <h4 className="text-sm font-semibold text-emerald-300 flex items-center gap-2 mb-1">
              <CheckCircle className="h-4 w-4" />
              The Truthful Guarantee
            </h4>
            <p className="text-xs text-zinc-300 leading-relaxed">
              "Your fitting data is temporary and is automatically destroyed when your session ends or expires."
              We do not fabricate unrealistic claims such as "data never exists anywhere." Instead, data exists only transiently in worker memory for 3D reconstruction and physics simulation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="rounded-md border border-zinc-800 bg-zinc-900/40 p-3 space-y-1">
              <span className="font-semibold text-white flex items-center gap-1.5 font-mono">
                <Clock className="h-3.5 w-3.5 text-amber-400" />
                15-Min TTL Backstop
              </span>
              <p className="text-zinc-400">
                Server-side garbage collection runs every 30s. If your tab closes or disconnects, all assets expire automatically.
              </p>
            </div>

            <div className="rounded-md border border-zinc-800 bg-zinc-900/40 p-3 space-y-1">
              <span className="font-semibold text-white flex items-center gap-1.5 font-mono">
                <EyeOff className="h-3.5 w-3.5 text-sky-400" />
                Zero Persistent Database
              </span>
              <p className="text-zinc-400">
                No face databases. No user body profiles. No permanent object store. No persistent consumer accounts required.
              </p>
            </div>

            <div className="rounded-md border border-zinc-800 bg-zinc-900/40 p-3 space-y-1">
              <span className="font-semibold text-white flex items-center gap-1.5 font-mono">
                <Server className="h-3.5 w-3.5 text-indigo-400" />
                No Sensitive Logs
              </span>
              <p className="text-zinc-400">
                Request bodies containing images or measurements are blocked from application logs, metrics, and CDN caches.
              </p>
            </div>

            <div className="rounded-md border border-zinc-800 bg-zinc-900/40 p-3 space-y-1">
              <span className="font-semibold text-white flex items-center gap-1.5 font-mono">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                Explicit Destruction
              </span>
              <p className="text-zinc-400">
                Clicking "Destroy Session" executes an immediate cryptographic wipe and buffer zeroing of all session data.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="default" onClick={() => onOpenChange(false)}>
            I Understand
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
