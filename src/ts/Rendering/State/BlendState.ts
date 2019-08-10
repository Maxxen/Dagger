import { gl } from "../../Graphics/gl";
import { Color } from "../../Graphics/Color";

export enum BlendFunc {
  ADD = gl.FUNC_ADD,
  SUBTRACT = gl.FUNC_SUBTRACT,
  REVERSE_SUBTRACT = gl.FUNC_REVERSE_SUBTRACT
}

export enum Blend {
  ONE = gl.ONE,
  ZERO = gl.ZERO,
  SOURCE_ALPHA = gl.SRC_ALPHA,
  ONE_MINUS_SOURCE_ALPHA = gl.ONE_MINUS_SRC_ALPHA
}

export class BlendState {
  constructor(
    public alphaBlendFunc: BlendFunc = BlendFunc.ADD,
    public alphaSourceBlend: Blend = Blend.ONE,
    public alphaDestinationBlend: Blend = Blend.ONE,

    public blendFactor: Color = Color.WHITE,

    public colorBlendFunc: BlendFunc = BlendFunc.ADD,
    public colorSourceBlend: Blend = Blend.ONE,
    public colorDestinationBlend: Blend = Blend.ONE
  ) {}

  static Opaque = new BlendState(
    undefined,
    undefined,
    Blend.ZERO,
    undefined,
    undefined,
    undefined,
    Blend.ZERO
  );

  static Additive = new BlendState(
    undefined,
    undefined,
    Blend.ONE_MINUS_SOURCE_ALPHA,
    undefined,
    undefined,
    undefined,
    Blend.ONE_MINUS_SOURCE_ALPHA
  );
}
