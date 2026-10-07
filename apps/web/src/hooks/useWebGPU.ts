import { useState, useEffect } from 'react';

export interface GpuCapability {
  supported: boolean;
  tier: 'webgpu' | 'webgl2' | 'unsupported';
  adapterName?: string;
  isChecking: boolean;
  errorMessage?: string;
}

export function useWebGPU(): GpuCapability {
  const [capability, setCapability] = useState<GpuCapability>({
    supported: false,
    tier: 'webgl2',
    isChecking: true,
  });

  useEffect(() => {
    let isMounted = true;

    async function detectGPU() {
      // Check WebGPU first
      if (typeof navigator !== 'undefined' && 'gpu' in navigator && (navigator as any).gpu) {
        try {
          const adapter = await (navigator as any).gpu.requestAdapter();
          if (adapter && isMounted) {
            setCapability({
              supported: true,
              tier: 'webgpu',
              adapterName: adapter.info?.device || 'WebGPU Hardware Accelerated',
              isChecking: false,
            });
            return;
          }
        } catch (e) {
          // Graceful fallback to WebGL2
        }
      }

      // Check WebGL2 fallback
      if (typeof document !== 'undefined') {
        const canvas = document.createElement('canvas');
        const gl2 = canvas.getContext('webgl2');
        if (gl2 && isMounted) {
          const debugInfo = gl2.getExtension('WEBGL_debug_renderer_info');
          const renderer = debugInfo ? gl2.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'WebGL 2.0 Accelerated';
          setCapability({
            supported: true,
            tier: 'webgl2',
            adapterName: renderer,
            isChecking: false,
          });
          return;
        }
      }

      if (isMounted) {
        setCapability({
          supported: false,
          tier: 'unsupported',
          isChecking: false,
          errorMessage: 'Hardware acceleration required for 3D fitting is not available.',
        });
      }
    }

    detectGPU();

    return () => {
      isMounted = false;
    };
  }, []);

  return capability;
}
