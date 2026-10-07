/**
 * FIT3D Domain Types
 * Privacy-first, True-3D Virtual Fitting Room
 */

export type SessionStatus =
  | 'CREATED'
  | 'UPLOADING'
  | 'PROCESSING_BODY'
  | 'AVATAR_READY'
  | 'PROCESSING_GARMENT'
  | 'GARMENT_READY'
  | 'SIMULATING'
  | 'READY'
  | 'FAILED'
  | 'DESTROYED'
  | 'EXPIRED';

export type BodyGenderShape = 'masculine' | 'feminine' | 'neutral';

export interface BodyMeasurements {
  /** Height in centimeters (Required: 100 - 250 cm) */
  heightCm: number;
  /** Weight in kilograms (Required: 30 - 300 kg) */
  weightKg: number;
  /** General body morphology baseline */
  bodyShape?: BodyGenderShape;
  /** Optional shoulder width in cm */
  shoulderCm?: number;
  /** Optional chest/bust circumference in cm */
  chestCm?: number;
  /** Optional waist circumference in cm */
  waistCm?: number;
  /** Optional hip circumference in cm */
  hipCm?: number;
  /** Optional inseam length in cm */
  inseamCm?: number;
  /** Optional arm length in cm */
  armLengthCm?: number;
}

export interface BodyPhotoMeta {
  uploaded: boolean;
  mimeType?: string;
  sizeBytes?: number;
  detectedPersonConfidence?: number;
  poseValidationStatus?: 'valid' | 'poor_lighting' | 'occluded' | 'scale_uncertain';
}

export interface FacePhotoMeta {
  uploaded: boolean;
  mimeType?: string;
  sizeBytes?: number;
  likenessConsent: boolean;
}

export type GarmentCategory = 'tshirt' | 'jacket';

export interface GarmentPhotoMeta {
  uploaded: boolean;
  category: GarmentCategory;
  mimeType?: string;
  sizeBytes?: number;
  segmentationQuality?: 'high' | 'medium' | 'low';
}

export type FitAssessment =
  | 'likely close fit'
  | 'likely relaxed fit'
  | 'possible tightness'
  | 'possible looseness'
  | 'insufficient confidence';

export interface FitInspectionRegion {
  area: 'shoulder' | 'chest' | 'waist' | 'sleeve' | 'length' | 'silhouette';
  assessment: FitAssessment;
  confidenceScore: number; // 0.0 to 1.0 (actual system signal, never fabricated)
  note?: string;
}

export interface FitInspectionResult {
  overallAssessment: FitAssessment;
  regions: FitInspectionRegion[];
  garmentCategory: GarmentCategory;
  timestamp: string;
}

export interface AvatarSceneSpec {
  avatarMeshUrl: string;
  collisionMeshUrl?: string;
  topologyVersion: string;
  heightCm: number;
  proportionsConfidence: 'HIGH' | 'GOOD' | 'CALIBRATED';
  poseStatus: 'T_POSE' | 'A_POSE' | 'NATURAL_STANDING';
  hasFaceLikeness: boolean;
}

export interface GarmentSceneSpec {
  garmentMeshUrl: string;
  category: GarmentCategory;
  materialPbrUrl?: string;
  simulatedMeshUrl?: string;
  uvStatus: 'valid' | 'generated';
}

export interface FittingSceneResult {
  sessionId: string;
  avatar: AvatarSceneSpec;
  garment?: GarmentSceneSpec;
  fitInspection?: FitInspectionResult;
  sceneEnvironment: 'dark_studio' | 'editorial_warm' | 'minimal_neutral';
  rendererRequirements: {
    recommended: 'webgpu';
    fallback: 'webgl2';
    minMemoryMb: number;
  };
}

export interface FittingSession {
  id: string;
  createdAt: string;
  expiresAt: string;
  status: SessionStatus;
  statusMessage?: string;
  progressPercent?: number;
  bodyMeasurements?: BodyMeasurements;
  bodyPhotoMeta?: BodyPhotoMeta;
  facePhotoMeta?: FacePhotoMeta;
  garmentPhotoMeta?: GarmentPhotoMeta;
  scene?: FittingSceneResult;
  failureReason?: string;
}

export interface CreateSessionResponse {
  sessionId: string;
  expiresAt: string;
  ttlSeconds: number;
  status: SessionStatus;
  privacyNotice: string;
}

export interface SessionStatusResponse {
  sessionId: string;
  status: SessionStatus;
  statusMessage: string;
  progressPercent: number;
  expiresAt: string;
  failureReason?: string;
}

export interface SessionSceneResponse {
  sessionId: string;
  status: SessionStatus;
  scene: FittingSceneResult | null;
  fitInspection: FitInspectionResult | null;
}

export interface SessionDeletionResponse {
  sessionId: string;
  status: 'DESTROYED';
  destroyedAt: string;
  clearedAssets: {
    bodyInputs: boolean;
    faceInputs: boolean;
    garmentInputs: boolean;
    meshAssets: boolean;
    sessionRecord: boolean;
  };
}

export interface ApiErrorResponse {
  error: string;
  code: string;
  details?: unknown;
  timestamp: string;
}
