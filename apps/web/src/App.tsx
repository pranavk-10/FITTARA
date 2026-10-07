import React, { useState } from 'react';
import {
  Sparkles,
  ShieldCheck,
  Eye,
  RotateCw,
  Compass,
  Layers,
  ArrowRight,
  CheckCircle2,
  Trash2,
  Activity,
  Maximize2,
} from 'lucide-react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { FittingRoomCanvas } from './components/viewer/FittingRoomCanvas';
import { PrivacyModal } from './components/privacy/PrivacyModal';
import { Button } from './components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { Alert, AlertTitle, AlertDescription } from './components/ui/alert';
import { Progress } from './components/ui/progress';
import { useWebGPU } from './hooks/useWebGPU';
import { useSession } from './hooks/useSession';

export default function App() {
  const gpu = useWebGPU();
  const {
    session,
    status,
    statusMessage,
    progressPercent,
    scene,
    isLoading,
    error,
    createSession,
    submitBodyData,
    submitGarment,
    startFittingPipeline,
    destroySession,
  } = useSession();

  const [cameraPreset, setCameraPreset] = useState<'perspective' | 'front' | 'side' | 'back'>('perspective');
  const [privacyModalOpen, setPrivacyModalOpen] = useState<boolean>(false);
  const [selectedGarmentCategory, setSelectedGarmentCategory] = useState<'tshirt' | 'jacket'>('tshirt');

  const handleStartSession = async () => {
    await createSession();
  };

  const handleRunFullSpike = async () => {
    if (!session) {
      await createSession();
    }
    // Submit default calibrated measurements
    await submitBodyData({
      heightCm: 180,
      weightKg: 75,
      bodyShape: 'masculine',
      chestCm: 98,
      waistCm: 82,
    });
    // Submit garment
    await submitGarment(selectedGarmentCategory);
    // Start simulation
    await startFittingPipeline();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050507] text-zinc-100 selection:bg-sky-500 selection:text-black">
      {/* Navigation */}
      <Navbar
        sessionId={session?.sessionId}
        sessionStatus={status}
        gpu={gpu}
        onDestroySession={destroySession}
        onOpenPrivacyModal={() => setPrivacyModalOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Error Notification if any */}
        {error && (
          <Alert variant="destructive" className="animate-in fade-in-50">
            <AlertTitle>Pipeline Alert</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2 pb-6">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-950/40 border border-sky-800/40 text-sky-400 text-xs font-mono">
              <Sparkles className="h-3.5 w-3.5" />
              <span>TRUE 3D VIRTUAL FITTING — PHASE 0 VERIFIED</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1] font-heading">
              TRY THE FIT <br />
              <span className="bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-300 bg-clip-text text-transparent">
                BEFORE YOU TRY THE ROOM.
              </span>
            </h1>

            <p className="text-lg text-zinc-300 max-w-xl leading-relaxed">
              Create a temporary 3D version of yourself. Drop in any garment. Rotate 360°. Inspect the fit from any angle.
              <span className="text-white font-medium"> Nothing stays.</span>
            </p>

            {/* Quick Session Launcher CTA */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              {!session || status === 'DESTROYED' ? (
                <Button
                  size="lg"
                  onClick={handleStartSession}
                  disabled={isLoading}
                  className="font-medium tracking-wide shadow-lg shadow-sky-500/25"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  {isLoading ? 'Initializing Session...' : 'Create My 3D Fit'}
                </Button>
              ) : (
                <Button
                  size="lg"
                  onClick={handleRunFullSpike}
                  disabled={isLoading}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium"
                >
                  <ArrowRight className="mr-2 h-4 w-4" />
                  {isLoading ? 'Running Pipeline...' : 'Test Reconstruction Pipeline'}
                </Button>
              )}

              <Button
                variant="outline"
                size="lg"
                onClick={() => setPrivacyModalOpen(true)}
                className="gap-2 text-zinc-300 hover:text-white"
              >
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                Inspect Privacy Model
              </Button>
            </div>

            {/* Privacy Promise Callout */}
            <div className="flex items-start gap-3 p-3.5 rounded-lg border border-zinc-800/80 bg-zinc-950/60 max-w-lg backdrop-blur-sm">
              <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-xs text-zinc-400 leading-snug">
                <strong className="text-zinc-200">Ephemeral-by-Design:</strong> Your fitting data is temporary and automatically destroyed when your session ends or expires (15m TTL).
              </div>
            </div>
          </div>

          {/* Hero 3D Stage Preview */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="w-full aspect-[4/5] max-h-[550px] relative">
              <FittingRoomCanvas
                gpu={gpu}
                avatarHeightCm={180}
                cameraPreset={cameraPreset}
              />

              {/* Floating Camera Preset Controller */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between p-2 rounded-lg bg-zinc-950/90 border border-zinc-800/90 backdrop-blur-md">
                <span className="text-[10px] font-mono uppercase text-zinc-400 px-2">
                  Camera:
                </span>
                <div className="flex items-center gap-1">
                  {(['perspective', 'front', 'side', 'back'] as const).map((view) => (
                    <button
                      key={view}
                      onClick={() => setCameraPreset(view)}
                      className={`text-xs px-2.5 py-1 rounded transition-colors font-mono uppercase ${
                        cameraPreset === view
                          ? 'bg-sky-500 text-black font-semibold'
                          : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                      }`}
                    >
                      {view.slice(0, 4)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Session & Pipeline Control HUD */}
        {session && status !== 'DESTROYED' && (
          <Card className="border-sky-900/40 bg-zinc-950/80">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="h-4 w-4 text-sky-400" />
                  Active Ephemeral Fitting Session
                </CardTitle>
                <CardDescription className="font-mono text-xs text-zinc-400">
                  ID: {session.sessionId} | TTL: {session.ttlSeconds}s | Expires: {new Date(session.expiresAt).toLocaleTimeString()}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={status === 'READY' ? 'privacy' : 'default'}
                  className="font-mono uppercase text-[11px]"
                >
                  {status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono text-zinc-400">
                  <span>{statusMessage}</span>
                  <span>{progressPercent}%</span>
                </div>
                <Progress value={progressPercent} />
              </div>

              {/* Garment Selector & Inspection Trigger */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-zinc-900">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-400 font-mono">Category:</span>
                  {(['tshirt', 'jacket'] as const).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedGarmentCategory(cat)}
                      className={`text-xs px-3 py-1 rounded-md font-mono uppercase transition-all ${
                        selectedGarmentCategory === cat
                          ? 'bg-sky-500/20 text-sky-300 border border-sky-500/50'
                          : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={destroySession}
                    className="gap-1.5 text-xs"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Purge All Session Data
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Fit Inspection Analysis HUD (Displays when simulation is ready) */}
        {scene?.fitInspection && (
          <Card className="border-zinc-800 bg-zinc-950/70">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Layers className="h-4 w-4 text-sky-400" />
                Physical Fit Inspection (Honest System Signals)
              </CardTitle>
              <CardDescription className="text-xs">
                Derived from garment drape physics against your reconstructed body collision mesh.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {scene.fitInspection.regions.map((region) => (
                  <div
                    key={region.area}
                    className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800/80 space-y-1"
                  >
                    <div className="text-[11px] font-mono uppercase text-zinc-400">
                      {region.area}
                    </div>
                    <div className="text-sm font-semibold text-white capitalize">
                      {region.assessment}
                    </div>
                    <div className="text-[10px] text-sky-400 font-mono">
                      Conf: {(region.confidenceScore * 100).toFixed(0)}%
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Architecture & Engineering Feasibility Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <Card className="bg-zinc-950/50 border-zinc-850">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-zinc-200 flex items-center gap-2 font-mono">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                01 / Temporary Session
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-zinc-400 space-y-2">
              <p>Express REST service with in-memory store and cryptographic ID generation.</p>
              <p className="font-mono text-zinc-500 text-[11px]">TTL: 900s | GC: 30s interval</p>
            </CardContent>
          </Card>

          <Card className="bg-zinc-950/50 border-zinc-850">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-zinc-200 flex items-center gap-2 font-mono">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                02 / True 3D Viewport
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-zinc-400 space-y-2">
              <p>Three.js + React Three Fiber with studio lighting, camera presets, and orbit controls.</p>
              <p className="font-mono text-zinc-500 text-[11px]">Hardware Tier: {gpu.tier.toUpperCase()}</p>
            </CardContent>
          </Card>

          <Card className="bg-zinc-950/50 border-zinc-850">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-zinc-200 flex items-center gap-2 font-mono">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                03 / Ephemeral Privacy
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-zinc-400 space-y-2">
              <p>Explicit DELETE endpoint, unload beacon, and in-memory buffer zeroing.</p>
              <p className="font-mono text-zinc-500 text-[11px]">No persistent DB | Zero biometrics in logs</p>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Privacy Guarantee Modal */}
      <PrivacyModal
        open={privacyModalOpen}
        onOpenChange={setPrivacyModalOpen}
      />
    </div>
  );
}
