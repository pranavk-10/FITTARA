import { useState, useEffect, useCallback, useRef } from 'react';
import {
  CreateSessionResponse,
  SessionStatus,
  SessionStatusResponse,
  FittingSceneResult,
  BodyMeasurements,
} from '@fit3d/types';
import { ApiClient } from '../lib/api-client';

export interface UseSessionReturn {
  session: CreateSessionResponse | null;
  status: SessionStatus;
  statusMessage: string;
  progressPercent: number;
  scene: FittingSceneResult | null;
  isLoading: boolean;
  error: string | null;
  createSession: () => Promise<void>;
  submitBodyData: (measurements: BodyMeasurements, bodyImageDataUrl?: string) => Promise<void>;
  submitGarment: (category: 'tshirt' | 'jacket', garmentImageDataUrl?: string) => Promise<void>;
  startFittingPipeline: () => Promise<void>;
  destroySession: () => Promise<void>;
}

export function useSession(): UseSessionReturn {
  const [session, setSession] = useState<CreateSessionResponse | null>(null);
  const [status, setStatus] = useState<SessionStatus>('CREATED');
  const [statusMessage, setStatusMessage] = useState<string>('Ready');
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [scene, setScene] = useState<FittingSceneResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const sessionIdRef = useRef<string | null>(null);
  sessionIdRef.current = session?.sessionId || null;

  // Best-effort cleanup on window unload / pagehide
  useEffect(() => {
    const handleUnload = () => {
      if (sessionIdRef.current) {
        ApiClient.beaconDestroy(sessionIdRef.current);
      }
    };

    window.addEventListener('pagehide', handleUnload);
    window.addEventListener('beforeunload', handleUnload);

    return () => {
      window.removeEventListener('pagehide', handleUnload);
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, []);

  const createSession = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const newSession = await ApiClient.createSession();
      setSession(newSession);
      setStatus(newSession.status);
      setStatusMessage('Temporary fitting session active.');
      setProgressPercent(0);
      setScene(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize session');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const submitBodyData = useCallback(
    async (measurements: BodyMeasurements, bodyImageDataUrl?: string) => {
      if (!session) return;
      setIsLoading(true);
      setError(null);
      try {
        await ApiClient.submitBodyInput(session.sessionId, measurements, bodyImageDataUrl);
        setStatus('UPLOADING');
        setStatusMessage('Body parameters calibrated.');
        setProgressPercent(20);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to submit body parameters');
      } finally {
        setIsLoading(false);
      }
    },
    [session]
  );

  const submitGarment = useCallback(
    async (category: 'tshirt' | 'jacket', garmentImageDataUrl?: string) => {
      if (!session) return;
      setIsLoading(true);
      setError(null);
      try {
        await ApiClient.submitGarment(session.sessionId, category, garmentImageDataUrl);
        setStatus('UPLOADING');
        setStatusMessage(`${category.toUpperCase()} uploaded for reconstruction.`);
        setProgressPercent(35);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to submit garment');
      } finally {
        setIsLoading(false);
      }
    },
    [session]
  );

  const pollPipelineStatus = useCallback(async (id: string) => {
    const pollInterval = setInterval(async () => {
      try {
        const statusRes = await ApiClient.getStatus(id);
        setStatus(statusRes.status);
        setStatusMessage(statusRes.statusMessage);
        setProgressPercent(statusRes.progressPercent);

        if (statusRes.status === 'READY') {
          clearInterval(pollInterval);
          const sceneRes = await ApiClient.getScene(id);
          setScene(sceneRes.scene);
        } else if (statusRes.status === 'FAILED' || statusRes.status === 'EXPIRED') {
          clearInterval(pollInterval);
          setError(statusRes.failureReason || 'Simulation could not be completed.');
        }
      } catch (err) {
        clearInterval(pollInterval);
        setError('Connection to session server lost.');
      }
    }, 400);

    return () => clearInterval(pollInterval);
  }, []);

  const startFittingPipeline = useCallback(async () => {
    if (!session) return;
    setIsLoading(true);
    setError(null);
    try {
      await ApiClient.generateAvatar(session.sessionId);
      await ApiClient.generateGarment(session.sessionId);
      await ApiClient.triggerSimulation(session.sessionId);
      pollPipelineStatus(session.sessionId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start fitting simulation');
    } finally {
      setIsLoading(false);
    }
  }, [session, pollPipelineStatus]);

  const destroySession = useCallback(async () => {
    if (!session) return;
    setIsLoading(true);
    try {
      await ApiClient.deleteSession(session.sessionId);
    } catch (err) {
      // Best-effort
    } finally {
      // In-memory zeroing of client references
      setSession(null);
      setStatus('DESTROYED');
      setStatusMessage('Session and all temporary data destroyed.');
      setProgressPercent(0);
      setScene(null);
      setIsLoading(false);
    }
  }, [session]);

  return {
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
  };
}
