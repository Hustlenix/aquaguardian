'use client'

import { useMemo } from 'react'
import { useStore } from '@/store/useStore'
import {
  EffectComposer,
  Bloom,
  Vignette,
  Noise,
  ChromaticAberration,
  SSAO,
  DepthOfField,
  ToneMapping,
  HueSaturation,
  BrightnessContrast,
} from '@react-three/postprocessing'
import { ToneMappingMode } from 'postprocessing'

/**
 * Cinematic grade. High quality:
 * - Bloom carries the glows (light rays, robot core, caustic highlights).
 * - SSAO grounds the seabed geometry with soft contact occlusion.
 * - A very light depth of field keeps the foreground composition readable
 *   while the ruins melt into the haze.
 * - ACES filmic tone mapping for the final print.
 * - Vignette frames the composition; a whisper of grain and chromatic
 *   aberration add lens character.
 * Mobile/medium gets bloom alone to protect the frame budget.
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
    <EffectComposer multisampling={cfg.multisampling} enableNormalPass={cfg.isHigh}>
      <Bloom
        intensity={cfg.bloomIntensity}
        luminanceThreshold={0.2}
        luminanceSmoothing={0.9}
        mipmapBlur
        radius={cfg.bloomRadius}
      />
      {cfg.isHigh ? (
        <>
          {/* Soft contact occlusion — subtle so the scene stays luminous */}
          <SSAO
            radius={0.06}
            intensity={14}
            bias={0.03}
            luminanceInfluence={0.6}
            samples={11}
            resolutionScale={0.5}
            distanceThreshold={4}
            distanceFalloff={0.4}
          />
          {/* Very light DoF — focus on the mid-field, background dissolves */}
          <DepthOfField focusDistance={0.38} focalLength={0.1} bokehScale={1.4} height={480} />
          <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
          {/* Final grade — a whisper of contrast deepens the abyss, a slight
              desaturation sinks the blues while the golds stay warm */}
          <HueSaturation hue={-0.02} saturation={-0.1} />
          <BrightnessContrast brightness={-0.02} contrast={0.12} />
          <Vignette eskil={false} offset={0.25} darkness={0.55} />
          <Noise premultiply opacity={0.018} />
          <ChromaticAberration offset={[0.0012, 0.0008]} />
        </>
      ) : (
        <></>
      )}
    </EffectComposer>
  )
}
