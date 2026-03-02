import React from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, ChromaticAberration, Noise, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { Vector2 } from 'three';

interface Props {
  isDeepDive: boolean;
  isLowPerformance: boolean;
}

const CHROMATIC_ABERRATION_OFFSET = new Vector2(0.005, 0.005);

const PostProcessingOverlay: React.FC<Props> = ({ isDeepDive, isLowPerformance }) => {
  if (!isDeepDive) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-[45]">
      <Canvas
        flat
        gl={{ antialias: false, stencil: false, depth: false }}
        style={{ pointerEvents: 'none' }}
      >
        <EffectComposer>
          <ChromaticAberration
            blendFunction={BlendFunction.NORMAL}
            offset={CHROMATIC_ABERRATION_OFFSET}
          />
          {!isLowPerformance ? (
            <Noise opacity={0.15} blendFunction={BlendFunction.SOFT_LIGHT} />
          ) : <></>}
          <Vignette eskil={false} offset={0.05} darkness={1.3} />
        </EffectComposer>
      </Canvas>
    </div>
  );
};

export default PostProcessingOverlay;
