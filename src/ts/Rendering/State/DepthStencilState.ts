import { gl } from "../../Graphics/gl";

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
    public stencilWriteMask: number = Number.MAX_VALUE,
    public twoSidedStencilMode: boolean = false
  ) {}
}
