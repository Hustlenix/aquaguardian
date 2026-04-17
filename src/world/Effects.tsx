'use client'

import { useMemo } from 'react'
import { useStore } from '@/store/useStore'
import { EffectComposer, Bloom, Vignette, Noise, ChromaticAberration } from '@react-three/postprocessing'

export default function Effects() {
  const quality = useStore((s) => s.quality)

  const cfg = useMemo(() => {
    const isHigh = quality > 0.75
    return {
      isHigh,
      bloomIntensity: isHigh ? 0.85 : 0.7,
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
        radius={0.7}
      />
      {cfg.isHigh ? (
        <>
          <Vignette eskil={false} offset={0.24} darkness={0.72} />
          <Noise premultiply opacity={0.032} />
          <ChromaticAberration offset={[0.0015, 0.0012]} />
        </>
      ) : (
        <></>
      )}
    </EffectComposer>
  )
}
