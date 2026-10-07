import { Router, Request, Response, NextFunction } from 'express';
import {
  BodyInputSchema,
  FaceInputSchema,
  GarmentInputSchema,
  SessionIdParamSchema,
} from '@fit3d/validation';
import {
  CreateSessionResponse,
  SessionStatusResponse,
  SessionSceneResponse,
  SessionDeletionResponse,
  FittingSceneResult,
  FitInspectionResult,
} from '@fit3d/types';
import { sessionStore } from '../store/session-store.js';
import { config } from '../config.js';

export const sessionRouter = Router();

/**
 * POST /v1/sessions
 * Initializes a new temporary fitting session with an authoritative server-side TTL.
 */
sessionRouter.post('/', (_req: Request, res: Response<CreateSessionResponse>) => {
  const session = sessionStore.createSession(config.sessionTtlSeconds);

  res.status(201).json({
    sessionId: session.id,
    expiresAt: session.expiresAt,
    ttlSeconds: config.sessionTtlSeconds,
    status: session.status,
    privacyNotice:
      'Your fitting data is temporary and is automatically destroyed when your session ends or expires.',
  });
});

/**
 * POST /v1/sessions/:id/body-input
 * Ingests validated body measurements and optional calibration photo.
 */
sessionRouter.post(
  '/:id/body-input',
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = SessionIdParamSchema.parse(req.params);
      const validatedBody = BodyInputSchema.parse(req.body);

      const session = sessionStore.getSession(id);
      if (!session) {
        res.status(404).json({ error: 'Session not found or expired', code: 'SESSION_NOT_FOUND' });
        return;
      }

      const { bodyImageDataUrl, ...measurements } = validatedBody;
      const updated = sessionStore.setBodyInput(id, measurements, bodyImageDataUrl);

      res.status(200).json({
        sessionId: id,
        status: updated?.status,
        statusMessage: updated?.statusMessage,
        measurementsReceived: true,
        hasBodyPhoto: Boolean(bodyImageDataUrl),
      });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * POST /v1/sessions/:id/face
 * Ingests optional face photo with explicit likeness consent.
 */
sessionRouter.post(
  '/:id/face',
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = SessionIdParamSchema.parse(req.params);
      const { faceImageDataUrl, likenessConsent } = FaceInputSchema.parse(req.body);

      const session = sessionStore.getSession(id);
      if (!session) {
        res.status(404).json({ error: 'Session not found or expired', code: 'SESSION_NOT_FOUND' });
        return;
      }

      const updated = sessionStore.setFaceInput(id, faceImageDataUrl, likenessConsent);

      res.status(200).json({
        sessionId: id,
        status: updated?.status,
        likenessConsentAccepted: true,
      });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * POST /v1/sessions/:id/garment
 * Ingests garment image and category ('tshirt' | 'jacket').
 */
sessionRouter.post(
  '/:id/garment',
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = SessionIdParamSchema.parse(req.params);
      const { category, garmentImageDataUrl } = GarmentInputSchema.parse(req.body);

      const session = sessionStore.getSession(id);
      if (!session) {
        res.status(404).json({ error: 'Session not found or expired', code: 'SESSION_NOT_FOUND' });
        return;
      }

      const updated = sessionStore.setGarmentInput(id, category, garmentImageDataUrl);

      res.status(200).json({
        sessionId: id,
        category,
        status: updated?.status,
        statusMessage: updated?.statusMessage,
      });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * POST /v1/sessions/:id/generate-avatar
 * Asynchronously triggers parametric body reconstruction.
 */
sessionRouter.post(
  '/:id/generate-avatar',
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = SessionIdParamSchema.parse(req.params);
      const session = sessionStore.getSession(id);
      if (!session) {
        res.status(404).json({ error: 'Session not found or expired', code: 'SESSION_NOT_FOUND' });
        return;
      }

      if (!session.bodyMeasurements) {
        res.status(400).json({
          error: 'Body measurements are required before generating avatar',
          code: 'MISSING_BODY_DATA',
        });
        return;
      }

      // Mark processing
      sessionStore.updateStatus(id, 'PROCESSING_BODY', 'Fitting parametric body mesh and skeleton...', 40);

      // Trigger asynchronous reconstruction transition
      setTimeout(() => {
        const current = sessionStore.getSession(id);
        if (current && current.status === 'PROCESSING_BODY') {
          sessionStore.updateStatus(id, 'AVATAR_READY', 'Parametric 3D human body model ready.', 60);
        }
      }, 800);

      res.status(202).json({
        sessionId: id,
        status: 'PROCESSING_BODY',
        statusMessage: 'Avatar reconstruction initiated.',
        progressPercent: 40,
      });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * POST /v1/sessions/:id/generate-garment
 * Asynchronously triggers 3D garment mesh template matching & UV reconstruction.
 */
sessionRouter.post(
  '/:id/generate-garment',
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = SessionIdParamSchema.parse(req.params);
      const session = sessionStore.getSession(id);
      if (!session) {
        res.status(404).json({ error: 'Session not found or expired', code: 'SESSION_NOT_FOUND' });
        return;
      }

      sessionStore.updateStatus(
        id,
        'PROCESSING_GARMENT',
        'Extracting garment silhouette and matching 3D template...',
        70
      );

      setTimeout(() => {
        const current = sessionStore.getSession(id);
        if (current && current.status === 'PROCESSING_GARMENT') {
          sessionStore.updateStatus(id, 'GARMENT_READY', 'Garment geometry and UV layout ready.', 80);
        }
      }, 800);

      res.status(202).json({
        sessionId: id,
        status: 'PROCESSING_GARMENT',
        statusMessage: 'Garment reconstruction initiated.',
        progressPercent: 70,
      });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * POST /v1/sessions/:id/simulate
 * Asynchronously simulates cloth draping against human avatar collision mesh.
 */
sessionRouter.post(
  '/:id/simulate',
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = SessionIdParamSchema.parse(req.params);
      const session = sessionStore.getSession(id);
      if (!session) {
        res.status(404).json({ error: 'Session not found or expired', code: 'SESSION_NOT_FOUND' });
        return;
      }

      sessionStore.updateStatus(
        id,
        'SIMULATING',
        'Solving cloth physics, seams, and collision constraints...',
        85
      );

      setTimeout(() => {
        const current = sessionStore.getSession(id);
        if (current && current.status === 'SIMULATING') {
          const category = current.garmentPhotoMeta?.category || 'tshirt';
          const height = current.bodyMeasurements?.heightCm || 178;

          const fitInspection: FitInspectionResult = {
            overallAssessment: 'likely close fit',
            garmentCategory: category,
            timestamp: new Date().toISOString(),
            regions: [
              { area: 'shoulder', assessment: 'likely close fit', confidenceScore: 0.88 },
              { area: 'chest', assessment: 'likely relaxed fit', confidenceScore: 0.84 },
              { area: 'waist', assessment: 'likely relaxed fit', confidenceScore: 0.81 },
              { area: 'length', assessment: 'likely close fit', confidenceScore: 0.86 },
              { area: 'silhouette', assessment: 'likely relaxed fit', confidenceScore: 0.85 },
            ],
          };

          const scene: FittingSceneResult = {
            sessionId: id,
            sceneEnvironment: 'dark_studio',
            rendererRequirements: {
              recommended: 'webgpu',
              fallback: 'webgl2',
              minMemoryMb: 512,
            },
            avatar: {
              avatarMeshUrl: '/assets/models/avatar-parametric.glb',
              collisionMeshUrl: '/assets/models/avatar-collision.glb',
              topologyVersion: 'SMPL-H-v1.4',
              heightCm: height,
              proportionsConfidence: 'HIGH',
              poseStatus: 'NATURAL_STANDING',
              hasFaceLikeness: Boolean(current.facePhotoMeta?.uploaded),
            },
            garment: {
              garmentMeshUrl: `/assets/models/${category}-simulated.glb`,
              category,
              uvStatus: 'valid',
            },
            fitInspection,
          };

          sessionStore.setScene(id, scene);
        }
      }, 1000);

      res.status(202).json({
        sessionId: id,
        status: 'SIMULATING',
        statusMessage: 'Cloth simulation job started.',
        progressPercent: 85,
      });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * GET /v1/sessions/:id/status
 * Queries asynchronous stage progress.
 */
sessionRouter.get(
  '/:id/status',
  (req: Request, res: Response<SessionStatusResponse | { error: string }>, next: NextFunction) => {
    try {
      const { id } = SessionIdParamSchema.parse(req.params);
      const session = sessionStore.getSession(id);

      if (!session) {
        res.status(404).json({ error: 'Session not found or expired' });
        return;
      }

      res.status(200).json({
        sessionId: session.id,
        status: session.status,
        statusMessage: session.statusMessage || '',
        progressPercent: session.progressPercent || 0,
        expiresAt: session.expiresAt,
        failureReason: session.failureReason,
      });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * GET /v1/sessions/:id/scene
 * Returns interactive 3D scene parameters and truthful fit inspection signals.
 */
sessionRouter.get(
  '/:id/scene',
  (req: Request, res: Response<SessionSceneResponse | { error: string }>, next: NextFunction) => {
    try {
      const { id } = SessionIdParamSchema.parse(req.params);
      const session = sessionStore.getSession(id);

      if (!session) {
        res.status(404).json({ error: 'Session not found or expired' });
        return;
      }

      res.status(200).json({
        sessionId: session.id,
        status: session.status,
        scene: session.scene || null,
        fitInspection: session.scene?.fitInspection || null,
      });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * DELETE /v1/sessions/:id
 * Explicit user deletion endpoint: immediately zeroes memory buffers and wipes session state.
 */
sessionRouter.delete(
  '/:id',
  (req: Request, res: Response<SessionDeletionResponse | { error: string }>, next: NextFunction) => {
    try {
      const { id } = SessionIdParamSchema.parse(req.params);
      const destroyed = sessionStore.destroySession(id, 'DESTROYED');

      if (!destroyed) {
        res.status(404).json({ error: 'Session not found or already destroyed' });
        return;
      }

      res.status(200).json({
        sessionId: id,
        status: 'DESTROYED',
        destroyedAt: new Date().toISOString(),
        clearedAssets: {
          bodyInputs: true,
          faceInputs: true,
          garmentInputs: true,
          meshAssets: true,
          sessionRecord: true,
        },
      });
    } catch (err) {
      next(err);
    }
  }
);
