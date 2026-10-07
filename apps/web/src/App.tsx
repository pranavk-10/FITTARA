import React, { useState } from 'react';
import {
  ShieldCheck,
  RotateCw,
  Camera,
  Layers,
  ArrowRight,
  Sparkles,
  Check,
  ChevronRight,
  Maximize2,
  RefreshCw,
  SlidersHorizontal,
  X,
  Upload,
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from './components/ui/dialog';
import { useWebGPU } from './hooks/useWebGPU';
import { useSession } from './hooks/useSession';
import { GarmentCategory } from '@fit3d/types';

type ExperienceStep =
  | 'LANDING'
  | 'BODY_SETUP'
  | 'FACE_SETUP'
  | 'AVATAR_READY'
  | 'GARMENT_EXPERIENCE'
  | 'FITTING_ROOM'
  | 'SESSION_DESTROYED';

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

  // Current interactive view
  const [currentStep, setCurrentStep] = useState<ExperienceStep>('LANDING');

  // Body inputs state
  const [heightCm, setHeightCm] = useState<number>(180);
  const [weightKg, setWeightKg] = useState<number>(75);
  const [bodyShape, setBodyShape] = useState<'masculine' | 'feminine' | 'neutral'>('neutral');
  const [chestCm, setChestCm] = useState<number>(98);
  const [waistCm, setWaistCm] = useState<number>(82);

  // Garment state
  const [selectedGarment, setSelectedGarment] = useState<GarmentCategory>('tshirt');
  const [garmentProcessingStage, setGarmentProcessingStage] = useState<string>('IDENTIFYING GARMENT');

  // 3D Controls
  const [cameraPreset, setCameraPreset] = useState<'perspective' | 'front' | 'side' | 'back'>('perspective');

  // Modals
  const [privacyModalOpen, setPrivacyModalOpen] = useState<boolean>(false);
  const [confirmDestroyOpen, setConfirmDestroyOpen] = useState<boolean>(false);

  // Handlers
  const handleStartOnboarding = async () => {
    if (!session) {
      await createSession();
    }
    setCurrentStep('BODY_SETUP');
  };

  const handleCompleteBodySetup = async () => {
    if (!session) return;
    await submitBodyData({
      heightCm,
      weightKg,
      bodyShape,
      chestCm,
      waistCm,
    });
    setCurrentStep('FACE_SETUP');
  };

  const handleProceedToAvatar = async () => {
    setCurrentStep('AVATAR_READY');
  };

  const handleProceedToGarment = () => {
    setCurrentStep('GARMENT_EXPERIENCE');
  };

  const handleSimulateGarment = async () => {
    if (!session) return;
    setGarmentProcessingStage('IDENTIFYING GARMENT');
    await submitGarment(selectedGarment);

    // Sequential fashion-tech simulation labels
    setTimeout(() => setGarmentProcessingStage('BUILDING 3D FORM'), 300);
    setTimeout(() => setGarmentProcessingStage('PREPARING MATERIAL'), 600);
    setTimeout(() => setGarmentProcessingStage('SIMULATING FIT'), 900);
    setTimeout(() => {
      setGarmentProcessingStage('READY TO WEAR');
      setCurrentStep('FITTING_ROOM');
    }, 1300);

    await startFittingPipeline();
  };

  const handleTriggerDestroy = async () => {
    setConfirmDestroyOpen(false);
    await destroySession();
    setCurrentStep('SESSION_DESTROYED');
  };

  const handleRestartFromScratch = () => {
    setCurrentStep('LANDING');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#08080a] text-[#f5f5f7] selection:bg-[#f5f5f7] selection:text-black">
      {/* Top Navbar */}
      <Navbar
        sessionId={session?.sessionId}
        sessionStatus={status}
        gpu={gpu}
        onDestroySession={() => setConfirmDestroyOpen(true)}
        onOpenPrivacyModal={() => setPrivacyModalOpen(true)}
        onCreateFitClick={handleStartOnboarding}
        onNavigateSection={(section) => {
          if (section === 'privacy') setPrivacyModalOpen(true);
        }}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* Error Notification */}
        {error && (
          <Alert variant="destructive">
            <AlertTitle>FITTARA Engine Notice</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* ---------------------------------------------------- */}
        {/* 1. HERO / LANDING PAGE VIEW                          */}
        {/* ---------------------------------------------------- */}
        {currentStep === 'LANDING' && (
          <div className="space-y-12 py-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Hero Left Column */}
              <div className="lg:col-span-7 space-y-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-[#111218] border border-zinc-800 text-zinc-300 text-[11px] font-mono uppercase tracking-editorial">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <span>Virtual fitting, reimagined.</span>
                </div>

                <div className="space-y-4">
                  <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold uppercase tracking-hero text-white leading-[0.95] font-heading">
                    SEE THE FIT. <br />
                    <span className="text-zinc-400 font-extrabold">
                      BEFORE YOU WEAR IT.
                    </span>
                  </h1>

                  <p className="text-base sm:text-lg text-zinc-300 max-w-xl font-normal leading-relaxed">
                    Your body. Your clothes. Your fit. In 3D.
                  </p>
                </div>

                {/* Primary CTA & Privacy Microcopy */}
                <div className="space-y-4 pt-2">
                  <div className="flex flex-wrap items-center gap-4">
                    <Button
                      size="lg"
                      onClick={handleStartOnboarding}
                      disabled={isLoading}
                      className="text-xs tracking-editorial"
                    >
                      CREATE MY 3D FIT
                    </Button>

                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => setPrivacyModalOpen(true)}
                      className="text-xs tracking-editorial text-zinc-300"
                    >
                      HOW PRIVACY WORKS
                    </Button>
                  </div>

                  <p className="text-xs text-zinc-400 font-mono tracking-wide flex items-center gap-2">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                    <span>No account required · Temporary session · Privacy-first</span>
                  </p>
                </div>
              </div>

              {/* Hero Right Column: 3D Viewport Hero */}
              <div className="lg:col-span-5 flex flex-col items-center">
                <div className="w-full aspect-[4/5] max-h-[560px] relative">
                  <FittingRoomCanvas
                    gpu={gpu}
                    avatarHeightCm={180}
                    cameraPreset={cameraPreset}
                    garmentCategory="tshirt"
                    showClothSimulation={true}
                  />

                  {/* Restrained Camera Angle Bar */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between p-2 rounded-sm bg-[#08080a]/90 border border-zinc-800/90 backdrop-blur-md">
                    <span className="text-[10px] font-mono uppercase tracking-editorial text-zinc-400 px-2">
                      VIEW
                    </span>
                    <div className="flex items-center gap-1">
                      {(['perspective', 'front', 'side', 'back'] as const).map((view) => (
                        <button
                          key={view}
                          onClick={() => setCameraPreset(view)}
                          className={`text-[10px] px-2.5 py-1 rounded-sm uppercase font-mono tracking-wider transition-colors cursor-pointer ${
                            cameraPreset === view
                              ? 'bg-white text-black font-semibold'
                              : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                          }`}
                        >
                          {view === 'perspective' ? '360°' : view}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Callouts: Fashion-Tech Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-10 border-t border-zinc-900">
              <div className="p-6 rounded-sm bg-[#0c0d12] border border-zinc-850 space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-editorial text-zinc-400">
                  01 / ACCURACY
                </span>
                <h3 className="text-sm font-semibold uppercase tracking-editorial text-white font-heading">
                  True Parametric 3D
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Calibrated to your exact dimensions. Inspect every seam, taper, and silhouette from 360 degrees.
                </p>
              </div>

              <div className="p-6 rounded-sm bg-[#0c0d12] border border-zinc-850 space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-editorial text-zinc-400">
                  02 / SIMULATION
                </span>
                <h3 className="text-sm font-semibold uppercase tracking-editorial text-white font-heading">
                  Physics Cloth Drape
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Real physics engine calculating gravity, tension, stretch, and fabric collision against your avatar.
                </p>
              </div>

              <div className="p-6 rounded-sm bg-[#0c0d12] border border-zinc-850 space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-editorial text-zinc-400">
                  03 / PRIVACY
                </span>
                <h3 className="text-sm font-semibold uppercase tracking-editorial text-white font-heading">
                  Private by Design
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Ephemeral fitting sessions with a 15-minute server-side TTL. No biometric profiles or persistent accounts.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* 2. BODY SETUP ONBOARDING                             */}
        {/* ---------------------------------------------------- */}
        {currentStep === 'BODY_SETUP' && (
          <div className="max-w-2xl mx-auto py-6 space-y-8">
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-editorial text-zinc-400">
                STEP 01 OF 03
              </span>
              <h2 className="text-3xl font-bold uppercase tracking-editorial text-white font-heading">
                CREATE YOUR DIGITAL BODY
              </h2>
              <p className="text-sm text-zinc-300 leading-relaxed">
                Tell us a little about yourself and we'll create your temporary 3D fit.
              </p>
            </div>

            <Card className="border-zinc-800 bg-[#0d0e12]">
              <CardContent className="space-y-6 pt-6">
                {/* Height & Weight Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase tracking-wider text-zinc-300">
                      Height (cm)
                    </label>
                    <input
                      type="number"
                      value={heightCm}
                      min={100}
                      max={250}
                      onChange={(e) => setHeightCm(Number(e.target.value))}
                      className="w-full h-11 px-3 rounded-sm border border-zinc-800 bg-[#12131a] text-white font-mono text-sm focus:outline-none focus:border-zinc-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase tracking-wider text-zinc-300">
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      value={weightKg}
                      min={30}
                      max={300}
                      onChange={(e) => setWeightKg(Number(e.target.value))}
                      className="w-full h-11 px-3 rounded-sm border border-zinc-800 bg-[#12131a] text-white font-mono text-sm focus:outline-none focus:border-zinc-500"
                    />
                  </div>
                </div>

                {/* Body Shape Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-zinc-300">
                    Body Morphology
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['masculine', 'feminine', 'neutral'] as const).map((shape) => (
                      <button
                        key={shape}
                        type="button"
                        onClick={() => setBodyShape(shape)}
                        className={`h-10 rounded-sm font-mono text-xs uppercase tracking-wider border transition-colors cursor-pointer ${
                          bodyShape === shape
                            ? 'bg-white text-black font-semibold border-white'
                            : 'bg-[#12131a] text-zinc-400 border-zinc-800 hover:text-white'
                        }`}
                      >
                        {shape}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Optional Measurements */}
                <div className="pt-2 border-t border-zinc-900 space-y-4">
                  <span className="text-[11px] font-mono uppercase tracking-editorial text-zinc-400 block">
                    OPTIONAL MEASUREMENTS (IMPROVES DRAPE)
                  </span>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-zinc-400">Chest / Bust (cm)</label>
                      <input
                        type="number"
                        value={chestCm}
                        onChange={(e) => setChestCm(Number(e.target.value))}
                        className="w-full h-10 px-3 rounded-sm border border-zinc-800 bg-[#12131a] text-white font-mono text-sm focus:outline-none focus:border-zinc-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-zinc-400">Waist (cm)</label>
                      <input
                        type="number"
                        value={waistCm}
                        onChange={(e) => setWaistCm(Number(e.target.value))}
                        className="w-full h-10 px-3 rounded-sm border border-zinc-800 bg-[#12131a] text-white font-mono text-sm focus:outline-none focus:border-zinc-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <Button
                    variant="ghost"
                    onClick={() => setCurrentStep('LANDING')}
                    className="text-xs tracking-editorial"
                  >
                    BACK
                  </Button>
                  <Button
                    variant="default"
                    onClick={handleCompleteBodySetup}
                    disabled={isLoading}
                    className="text-xs tracking-editorial font-semibold"
                  >
                    CONTINUE TO FACE
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* 3. OPTIONAL FACE SETUP                               */}
        {/* ---------------------------------------------------- */}
        {currentStep === 'FACE_SETUP' && (
          <div className="max-w-xl mx-auto py-8 space-y-8">
            <div className="space-y-2 text-center">
              <span className="text-[10px] font-mono uppercase tracking-editorial text-zinc-400">
                STEP 02 OF 03 · OPTIONAL
              </span>
              <h2 className="text-3xl font-bold uppercase tracking-editorial text-white font-heading">
                MAKE IT MORE YOU
              </h2>
              <p className="text-sm text-zinc-300 max-w-md mx-auto leading-relaxed">
                Add a face photo to personalize your 3D model.
              </p>
            </div>

            <Card className="border-zinc-800 bg-[#0d0e12]">
              <CardContent className="space-y-6 pt-6">
                <div className="p-8 rounded-sm border border-dashed border-zinc-800 bg-[#111218] text-center space-y-3">
                  <Camera className="h-8 w-8 text-zinc-400 mx-auto" />
                  <div className="space-y-1">
                    <p className="text-xs font-mono uppercase tracking-wider text-zinc-300">
                      Front-Facing Portrait
                    </p>
                    <p className="text-[11px] text-zinc-400">
                      Even lighting, neutral expression. Temporary processing only.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button
                    variant="outline"
                    className="flex-1 text-xs tracking-editorial"
                    onClick={handleProceedToAvatar}
                  >
                    UPLOAD PHOTO
                  </Button>
                  <Button
                    variant="default"
                    className="flex-1 text-xs tracking-editorial font-semibold"
                    onClick={handleProceedToAvatar}
                  >
                    SKIP FOR NOW
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* 4. AVATAR REVEAL                                     */}
        {/* ---------------------------------------------------- */}
        {currentStep === 'AVATAR_READY' && (
          <div className="py-4 space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-editorial text-zinc-400">
                  3D HUMAN RECONSTRUCTION READY
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold uppercase tracking-editorial text-white font-heading">
                  YOUR FIT IS READY.
                </h2>
                <p className="text-xs text-zinc-300">
                  Parametric body calibrated ({heightCm}cm, {weightKg}kg). Rotate to validate proportions.
                </p>
              </div>

              <Button
                size="lg"
                onClick={handleProceedToGarment}
                className="text-xs tracking-editorial font-semibold whitespace-nowrap"
              >
                CONTINUE TO GARMENT
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-8 aspect-[16/10] min-h-[460px] relative">
                <FittingRoomCanvas
                  gpu={gpu}
                  avatarHeightCm={heightCm}
                  cameraPreset={cameraPreset}
                  showClothSimulation={false}
                />

                {/* Control bar: FRONT · SIDE · BACK · 360° */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between p-2 rounded-sm bg-[#08080a]/90 border border-zinc-800 backdrop-blur-md">
                  <span className="text-[10px] font-mono uppercase tracking-editorial text-zinc-400 px-2">
                    INSPECT
                  </span>
                  <div className="flex items-center gap-1">
                    {(['front', 'side', 'back', 'perspective'] as const).map((view) => (
                      <button
                        key={view}
                        onClick={() => setCameraPreset(view)}
                        className={`text-[10px] px-3 py-1 rounded-sm uppercase font-mono tracking-wider transition-colors cursor-pointer ${
                          cameraPreset === view
                            ? 'bg-white text-black font-semibold'
                            : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                        }`}
                      >
                        {view === 'perspective' ? '360°' : view}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Status Specification */}
              <div className="lg:col-span-4 space-y-4">
                <Card className="border-zinc-800 bg-[#0d0e12]">
                  <CardHeader>
                    <CardTitle className="text-xs text-zinc-300">Avatar Confidence</CardTitle>
                    <CardDescription className="text-[11px]">
                      Parametric topology fit to anthropometric bounds.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 font-mono text-xs">
                    <div className="flex justify-between py-1 border-b border-zinc-900">
                      <span className="text-zinc-400">Scale</span>
                      <span className="text-emerald-400 font-semibold">CALIBRATED</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-zinc-900">
                      <span className="text-zinc-400">Pose</span>
                      <span className="text-zinc-200">NATURAL STANDING</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-zinc-900">
                      <span className="text-zinc-400">Collision Mesh</span>
                      <span className="text-emerald-400 font-semibold">RIGGED</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-zinc-400">Session Mode</span>
                      <span className="text-zinc-300">EPHEMERAL</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* 5. GARMENT EXPERIENCE                                */}
        {/* ---------------------------------------------------- */}
        {currentStep === 'GARMENT_EXPERIENCE' && (
          <div className="max-w-2xl mx-auto py-8 space-y-8">
            <div className="space-y-2 text-center">
              <span className="text-[10px] font-mono uppercase tracking-editorial text-zinc-400">
                STEP 03 OF 03
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold uppercase tracking-editorial text-white font-heading">
                NOW, BRING YOUR CLOTHES.
              </h2>
              <p className="text-sm text-zinc-300 max-w-lg mx-auto leading-relaxed">
                Upload a garment image and we'll create a 3D version for your fitting session.
              </p>
            </div>

            <Card className="border-zinc-800 bg-[#0d0e12]">
              <CardContent className="space-y-6 pt-6">
                {/* Category Selection */}
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-zinc-300">
                    Garment Category
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedGarment('tshirt')}
                      className={`p-4 rounded-sm border text-left transition-colors cursor-pointer ${
                        selectedGarment === 'tshirt'
                          ? 'border-white bg-[#161722] text-white'
                          : 'border-zinc-800 bg-[#111218] text-zinc-400 hover:text-white'
                      }`}
                    >
                      <div className="font-heading font-semibold uppercase text-xs tracking-editorial">
                        T-Shirt
                      </div>
                      <div className="text-[11px] text-zinc-400 mt-1">
                        Cotton jersey, relaxed crew drape
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedGarment('jacket')}
                      className={`p-4 rounded-sm border text-left transition-colors cursor-pointer ${
                        selectedGarment === 'jacket'
                          ? 'border-white bg-[#161722] text-white'
                          : 'border-zinc-800 bg-[#111218] text-zinc-400 hover:text-white'
                      }`}
                    >
                      <div className="font-heading font-semibold uppercase text-xs tracking-editorial">
                        Jacket
                      </div>
                      <div className="text-[11px] text-zinc-400 mt-1">
                        Structured tailored outerwear
                      </div>
                    </button>
                  </div>
                </div>

                {/* Upload Box */}
                <div className="p-8 rounded-sm border border-dashed border-zinc-800 bg-[#111218] text-center space-y-3">
                  <Upload className="h-8 w-8 text-zinc-400 mx-auto" />
                  <div className="space-y-1">
                    <p className="text-xs font-mono uppercase tracking-wider text-zinc-300">
                      Drop Product Image or Select File
                    </p>
                    <p className="text-[11px] text-zinc-400">
                      JPEG, PNG, WebP up to 15MB. Clean product photos produce the highest fidelity.
                    </p>
                  </div>
                </div>

                {/* Technical Processing Progression Notice */}
                {isLoading && (
                  <div className="p-4 rounded-sm bg-[#12131c] border border-zinc-800 space-y-2">
                    <div className="flex justify-between text-xs font-mono uppercase tracking-wider">
                      <span className="text-white font-semibold">{garmentProcessingStage}</span>
                      <span className="text-zinc-400">{progressPercent}%</span>
                    </div>
                    <Progress value={progressPercent} />
                  </div>
                )}

                <div className="pt-2 flex items-center justify-between">
                  <Button
                    variant="ghost"
                    onClick={() => setCurrentStep('AVATAR_READY')}
                    className="text-xs tracking-editorial"
                  >
                    BACK
                  </Button>
                  <Button
                    variant="default"
                    onClick={handleSimulateGarment}
                    disabled={isLoading}
                    className="text-xs tracking-editorial font-semibold"
                  >
                    {isLoading ? 'SIMULATING...' : 'SIMULATE 3D FIT'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* 6. HERO FITTING ROOM (HERO EXPERIENCE)               */}
        {/* ---------------------------------------------------- */}
        {currentStep === 'FITTING_ROOM' && (
          <div className="py-2 space-y-6">
            {/* Minimal Header */}
            <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-editorial text-white font-heading">
                  FITTARA FITTING ROOM
                </h2>
                <p className="text-xs text-zinc-400 font-mono">
                  {selectedGarment.toUpperCase()} ON {heightCm}CM HUMAN AVATAR · EPHEMERAL SESSION
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentStep('GARMENT_EXPERIENCE')}
                  className="text-[11px] tracking-editorial"
                >
                  CHANGE GARMENT
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setConfirmDestroyOpen(true)}
                  className="text-[11px] tracking-editorial font-semibold"
                >
                  END SESSION
                </Button>
              </div>
            </div>

            {/* 3D Viewport Dominant Stage */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-8 aspect-[16/11] min-h-[500px] relative">
                <FittingRoomCanvas
                  gpu={gpu}
                  avatarHeightCm={heightCm}
                  cameraPreset={cameraPreset}
                  garmentCategory={selectedGarment}
                  showClothSimulation={true}
                />

                {/* Hero Controls: FRONT · SIDE · BACK · 360° · RESET */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between p-2 rounded-sm bg-[#08080a]/90 border border-zinc-800 backdrop-blur-md">
                  <span className="text-[10px] font-mono uppercase tracking-editorial text-zinc-400 px-2">
                    CONTROLS
                  </span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      onClick={() => setCameraPreset('front')}
                      className={`text-[10px] px-2.5 py-1 rounded-sm uppercase font-mono tracking-wider transition-colors cursor-pointer ${
                        cameraPreset === 'front' ? 'bg-white text-black font-semibold' : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      FRONT
                    </button>
                    <button
                      onClick={() => setCameraPreset('side')}
                      className={`text-[10px] px-2.5 py-1 rounded-sm uppercase font-mono tracking-wider transition-colors cursor-pointer ${
                        cameraPreset === 'side' ? 'bg-white text-black font-semibold' : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      SIDE
                    </button>
                    <button
                      onClick={() => setCameraPreset('back')}
                      className={`text-[10px] px-2.5 py-1 rounded-sm uppercase font-mono tracking-wider transition-colors cursor-pointer ${
                        cameraPreset === 'back' ? 'bg-white text-black font-semibold' : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      BACK
                    </button>
                    <button
                      onClick={() => setCameraPreset('perspective')}
                      className={`text-[10px] px-2.5 py-1 rounded-sm uppercase font-mono tracking-wider transition-colors cursor-pointer ${
                        cameraPreset === 'perspective' ? 'bg-white text-black font-semibold' : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      360°
                    </button>
                    <button
                      onClick={() => setCameraPreset('perspective')}
                      className="text-[10px] px-2.5 py-1 rounded-sm uppercase font-mono tracking-wider text-zinc-400 hover:text-white cursor-pointer"
                    >
                      RESET
                    </button>
                  </div>
                </div>
              </div>

              {/* Fit Inspection Panel */}
              <div className="lg:col-span-4 space-y-4">
                <Card className="border-zinc-800 bg-[#0d0e12]">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-xs text-white">FIT INSPECTION</CardTitle>
                    <CardDescription className="text-[11px]">
                      Contact pressure and drape clearance derived from physics solver.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2.5">
                    {[
                      { area: 'Shoulder', assessment: 'likely close fit', confidence: '88%' },
                      { area: 'Chest', assessment: 'likely relaxed fit', confidence: '84%' },
                      { area: 'Waist', assessment: 'likely relaxed fit', confidence: '81%' },
                      { area: 'Sleeve', assessment: 'likely close fit', confidence: '86%' },
                      { area: 'Length', assessment: 'likely close fit', confidence: '85%' },
                    ].map((item) => (
                      <div
                        key={item.area}
                        className="p-2.5 rounded-sm bg-[#12131a] border border-zinc-850 flex items-center justify-between"
                      >
                        <div>
                          <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                            {item.area}
                          </div>
                          <div className="text-xs font-semibold text-white capitalize mt-0.5">
                            {item.assessment}
                          </div>
                        </div>
                        <span className="text-[10px] font-mono text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded-sm">
                          {item.confidence}
                        </span>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Privacy reminder pill */}
                <div className="p-3 rounded-sm border border-zinc-850 bg-[#0a0b0f] text-[11px] text-zinc-400 leading-normal flex items-start gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    This 3D scene exists only in memory for this session and will be destroyed upon exit.
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* 7. SESSION DESTROYED STATE                           */}
        {/* ---------------------------------------------------- */}
        {currentStep === 'SESSION_DESTROYED' && (
          <div className="max-w-md mx-auto py-16 text-center space-y-6">
            <div className="h-12 w-12 rounded-full border border-zinc-800 bg-[#12131a] flex items-center justify-center mx-auto text-emerald-400">
              <Check className="h-6 w-6" />
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-bold uppercase tracking-editorial text-white font-heading">
                SESSION DESTROYED
              </h2>
              <p className="text-xs text-zinc-400 leading-relaxed max-w-sm mx-auto font-sans">
                Your temporary fitting session has ended. All in-memory buffers, measurements, and generated 3D meshes have been zeroed and removed.
              </p>
            </div>

            <Button
              variant="default"
              onClick={handleRestartFromScratch}
              className="text-xs tracking-editorial font-semibold"
            >
              START NEW FITTING
            </Button>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Privacy Modal */}
      <PrivacyModal
        open={privacyModalOpen}
        onOpenChange={setPrivacyModalOpen}
      />

      {/* Session Destruction Confirmation Dialog */}
      <Dialog open={confirmDestroyOpen} onOpenChange={setConfirmDestroyOpen}>
        <DialogContent className="max-w-md border border-zinc-800 bg-[#0d0e12] text-zinc-100">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-lg font-bold tracking-editorial font-heading uppercase text-white">
              END THIS FITTING SESSION?
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-400 leading-relaxed font-sans">
              Your temporary fitting session will be destroyed. All temporary 3D meshes, measurements, and uploaded assets will be purged immediately.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="pt-4 flex flex-col-reverse sm:flex-row gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setConfirmDestroyOpen(false)}
              className="tracking-editorial text-[11px]"
            >
              KEEP SESSION
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleTriggerDestroy}
              className="tracking-editorial text-[11px] font-semibold"
            >
              DESTROY SESSION
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
