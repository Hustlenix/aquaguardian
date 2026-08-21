'use client'

import { useMemo } from 'react'
import { useStore } from '@/store/useStore'
import { EffectComposer, Bloom, Vignette, Noise, ChromaticAberration } from '@react-three/postprocessing'

/**
 * Cinematic grade: bloom carries the glows (light rays, robot core, caustic
 * highlights), vignette frames the composition, film grain keeps it organic,
 * and a whisper of chromatic aberration adds lens character — but only at
 * high quality. Mobile/medium gets bloom alone to protect the frame budget.
 */
export default function Effects() {
  const quality = useStore((s) => s.quality)

  const cfg = useMemo(() => {
    const isHigh = quality > 0.75
    return {
      isHigh,
      bloomIntensity: isHigh ? 0.9 : 0.7,
      bloomRadius: isHigh ? 0.85 : 0.7,
      multisampling: isHigh ? 4 : 0,
    }
  }, [quality])

  return (
    <EffectComposer multisampling={cfg.multisampling}>
      <Bloom
        intensity={cfg.bloomIntensity}
        luminanceThreshold={0.2}
        luminanceSmoothing={0.9}
        mipmapBlur
        radius={cfg.bloomRadius}
      />
      {cfg.isHigh ? (
        <>
          <Vignette eskil={false} offset={0.2} darkness={0.7} />
          <Noise premultiply opacity={0.028} />
          <ChromaticAberration offset={[0.0018, 0.0014]} />
        </>
      ) : (
        <></>
      )}
    </EffectComposer>
  )
}
