import { gl } from "../../Graphics/gl";
import { StateCache } from "./StateCache";

export enum StencilOperation {
  KEEP = gl.KEEP,
  ZERO = gl.ZERO,
  REPLACE = gl.REPLACE,
  INCREMENT_CLAMP = gl.INCR,
  INCREMENT_WRAP = gl.INCR_WRAP,
  DECREMENT_CLAMP = gl.DECR,
  DECREMENT_WRAP = gl.DECR_WRAP,
  INVERT = gl.INVERT
}

export enum StencilCompareFunc {
  ALWAYS = gl.ALWAYS,
  NEVER = gl.NEVER,
  LESS = gl.LESS,
  LESS_EQUAL = gl.LEQUAL,
  EQUAL = gl.EQUAL,
  GREATER_EQUAL = gl.GEQUAL,
  GREATER = gl.GREATER,
  NOT_EQUAL = gl.NOTEQUAL
}

export class DepthStencilState {
  constructor(
    public ccStencilDepthBufferFail: StencilOperation = StencilOperation.KEEP,
    public ccStencilFail: StencilOperation = StencilOperation.KEEP,
    public ccFunc: StencilCompareFunc = StencilCompareFunc.ALWAYS,
    public ccStencilPass: StencilOperation = StencilOperation.KEEP,

    public enableDepthBuffer: boolean = true,
    public depthBufferFunc: StencilCompareFunc = StencilCompareFunc.LESS_EQUAL,
    public depthBufferWrite: boolean = true,

    public enableStencil: boolean = false,
    public referenceStencil: number = 0,
    public stencilDepthBufferFail: StencilOperation = StencilOperation.KEEP,
    public stencilFail: StencilOperation = StencilOperation.KEEP,
    public stencilFunc: StencilCompareFunc = StencilCompareFunc.ALWAYS,
    public stencilMask: number = Number.MAX_VALUE, // Is this safe, should be int32.max?
    public stencilPass: StencilOperation = StencilOperation.KEEP,
    public stencilWriteMask: number = Number.MAX_VALUE
  ) {}
}

export class DepthStencilStateCache extends StateCache<DepthStencilState> {
  constructor() {
    super(new DepthStencilState());
  }

  protected updateState(
    oldState: DepthStencilState,
    newState: DepthStencilState
  ): void {
    // Enable depth testing
    if (oldState.enableDepthBuffer != newState.enableDepthBuffer) {
      newState.enableDepthBuffer
        ? gl.enable(gl.DEPTH_TEST)
        : gl.disable(gl.DEPTH_TEST);

      oldState.enableDepthBuffer = newState.enableDepthBuffer;
    }

    // Depth Buffer Function
    if (oldState.depthBufferFunc != newState.depthBufferFunc) {
      gl.depthFunc(newState.depthBufferFunc);

      oldState.depthBufferFunc = newState.depthBufferFunc;
    }

    // Depth Buffer Write
    if (oldState.depthBufferWrite != newState.depthBufferWrite) {
      gl.depthMask(newState.depthBufferWrite);

      oldState.depthBufferWrite = newState.depthBufferWrite;
    }

    // Enable stencil testing
    if (oldState.enableStencil != newState.enableStencil) {
      newState.enableStencil
        ? gl.enable(gl.STENCIL_TEST)
        : gl.disable(gl.STENCIL_TEST);

      oldState.enableStencil = newState.enableStencil;
    }

    // Stencil function
    if (
      oldState.stencilFunc != newState.stencilFunc ||
      oldState.referenceStencil != newState.referenceStencil ||
      oldState.stencilMask != newState.stencilMask
    ) {
      gl.stencilFunc(
        newState.stencilFunc,
        newState.referenceStencil,
        newState.stencilMask
      );

      oldState.stencilFunc = newState.stencilFunc;
      oldState.referenceStencil = newState.referenceStencil;
      oldState.stencilMask = newState.stencilMask;
    }

    // Stencil Op
    if (
      oldState.stencilFail != newState.stencilFail ||
      oldState.stencilDepthBufferFail != newState.stencilDepthBufferFail ||
      oldState.stencilPass != newState.stencilPass
    ) {
      gl.stencilOp(
        newState.stencilFail,
        newState.stencilDepthBufferFail,
        newState.stencilPass
      );

      oldState.stencilFail = newState.stencilFail;
      oldState.stencilDepthBufferFail = newState.stencilDepthBufferFail;
      oldState.stencilPass = newState.stencilPass;
    }

    // Stencil write mask
    if (oldState.stencilWriteMask != newState.stencilWriteMask) {
      gl.stencilMask(newState.stencilWriteMask);

      oldState.stencilWriteMask = newState.stencilWriteMask;
    }
  }
}
