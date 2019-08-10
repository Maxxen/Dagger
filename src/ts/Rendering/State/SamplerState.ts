import { gl } from "../../Graphics/gl";

export enum TextureWrapMode {
  REPEAT = gl.REPEAT,
  MIRRORED_REPEAT = gl.MIRRORED_REPEAT,
  CLAMP_EDGE = gl.CLAMP_TO_EDGE
}

// Currently we only support two filter modes to keep things simple.
// TODO: Add support for additional filter modes
export enum TextureFilterMode {
  LINEAR = gl.LINEAR,
  POINT = gl.NEAREST
}

// TODO: Add support for different wrapmodes for U and V coordinates
// TODO: Add support for other sampler state options like mips and lod-bias
export class SamplerState {
  constructor(
    public wrapMode: TextureWrapMode = TextureWrapMode.CLAMP_EDGE,
    public filterMode: TextureFilterMode = TextureFilterMode.LINEAR,
    public maxMipLevel = 0
  ) {}
}

export function useSamplerState(state: SamplerState) {
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, state.wrapMode);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, state.wrapMode);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, state.filterMode);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, state.filterMode);
}
