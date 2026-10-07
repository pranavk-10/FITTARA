import {
  CreateSessionResponse,
  SessionStatusResponse,
  SessionSceneResponse,
  SessionDeletionResponse,
  BodyMeasurements,
} from '@fit3d/types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

export class ApiClient {
  private static async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
      let errorMessage = `HTTP error ${response.status}`;
      try {
        const errorJson = await response.json();
        errorMessage = errorJson.error || errorMessage;
      } catch {
        // Fallback to status text
      }
      throw new Error(errorMessage);
    }

    return response.json();
  }

  public static async createSession(): Promise<CreateSessionResponse> {
    return this.request<CreateSessionResponse>('/v1/sessions', {
      method: 'POST',
    });
  }

  public static async submitBodyInput(
    sessionId: string,
    measurements: BodyMeasurements,
    bodyImageDataUrl?: string
  ): Promise<{ sessionId: string; status: string }> {
    return this.request<{ sessionId: string; status: string }>(`/v1/sessions/${sessionId}/body-input`, {
      method: 'POST',
      body: JSON.stringify({
        ...measurements,
        bodyImageDataUrl,
      }),
    });
  }

  public static async submitGarment(
    sessionId: string,
    category: 'tshirt' | 'jacket',
    garmentImageDataUrl?: string
  ): Promise<{ sessionId: string; category: string; status: string }> {
    return this.request<{ sessionId: string; category: string; status: string }>(
      `/v1/sessions/${sessionId}/garment`,
      {
        method: 'POST',
        body: JSON.stringify({
          category,
          garmentImageDataUrl,
        }),
      }
    );
  }

  public static async generateAvatar(sessionId: string): Promise<SessionStatusResponse> {
    return this.request<SessionStatusResponse>(`/v1/sessions/${sessionId}/generate-avatar`, {
      method: 'POST',
    });
  }

  public static async generateGarment(sessionId: string): Promise<SessionStatusResponse> {
    return this.request<SessionStatusResponse>(`/v1/sessions/${sessionId}/generate-garment`, {
      method: 'POST',
    });
  }

  public static async triggerSimulation(sessionId: string): Promise<SessionStatusResponse> {
    return this.request<SessionStatusResponse>(`/v1/sessions/${sessionId}/simulate`, {
      method: 'POST',
    });
  }

  public static async getStatus(sessionId: string): Promise<SessionStatusResponse> {
    return this.request<SessionStatusResponse>(`/v1/sessions/${sessionId}/status`);
  }

  public static async getScene(sessionId: string): Promise<SessionSceneResponse> {
    return this.request<SessionSceneResponse>(`/v1/sessions/${sessionId}/scene`);
  }

  public static async deleteSession(sessionId: string): Promise<SessionDeletionResponse> {
    return this.request<SessionDeletionResponse>(`/v1/sessions/${sessionId}`, {
      method: 'DELETE',
    });
  }

  /**
   * Best-effort cleanup during browser unload using navigator.sendBeacon
   */
  public static beaconDestroy(sessionId: string): void {
    if (typeof navigator !== 'undefined' && 'sendBeacon' in navigator) {
      const url = `${API_BASE}/v1/sessions/${sessionId}`;
      fetch(url, {
        method: 'DELETE',
        keepalive: true,
      }).catch(() => {});
    }
  }
}
