import { gl } from "../../Graphics/gl";
import { Color } from "../../Graphics/Color";
import { StateCache } from "./StateCache";

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

export class BlendStateCache extends StateCache<BlendState> {
  private blendEnabled: boolean = false;

  protected updateState(oldState: BlendState, newState: BlendState) {
    // Is Blending even enabled in the new state?
    const newBlendEnabled: boolean = !(
      newState.colorSourceBlend == Blend.ONE &&
      newState.colorDestinationBlend == Blend.ZERO &&
      newState.alphaSourceBlend == Blend.ONE &&
      newState.alphaDestinationBlend == Blend.ZERO
    );

    if (this.blendEnabled != newBlendEnabled) {
      newBlendEnabled ? gl.enable(gl.BLEND) : gl.disable(gl.BLEND);
      this.blendEnabled = newBlendEnabled;
    }

    // Blend color
    if (!oldState.blendFactor.equals(newState.blendFactor)) {
      gl.blendColor(...newState.blendFactor.toNormalizedArray());
      oldState.blendFactor = newState.blendFactor;
    }

    // Blend function
    if (
      oldState.colorBlendFunc != newState.colorBlendFunc ||
      oldState.alphaBlendFunc != newState.alphaBlendFunc
    ) {
      gl.blendEquationSeparate(
        newState.colorBlendFunc,
        newState.alphaBlendFunc
      );
      oldState.colorBlendFunc = newState.colorBlendFunc;
      oldState.alphaBlendFunc = newState.alphaBlendFunc;
    }

    // Blend values
    if (
      oldState.colorSourceBlend != newState.colorSourceBlend ||
      oldState.colorDestinationBlend != newState.colorDestinationBlend ||
      oldState.alphaSourceBlend != newState.alphaSourceBlend ||
      oldState.alphaDestinationBlend != newState.alphaDestinationBlend
    ) {
      gl.blendFuncSeparate(
        newState.colorSourceBlend,
        newState.colorDestinationBlend,
        newState.alphaSourceBlend,
        newState.alphaDestinationBlend
      );
      oldState.colorSourceBlend = newState.colorSourceBlend;
      oldState.colorDestinationBlend = newState.colorDestinationBlend;
      oldState.alphaSourceBlend = newState.alphaSourceBlend;
      oldState.alphaDestinationBlend = newState.alphaDestinationBlend;
    }
  }
}
