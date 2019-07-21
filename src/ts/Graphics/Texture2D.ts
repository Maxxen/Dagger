import { gl } from "./gl";

export enum TextureFilter {
  LINEAR = gl.LINEAR,
  NEAREST = gl.NEAREST,
  NEAREST_MIPMAP_NEAREST = gl.NEAREST_MIPMAP_NEAREST,
  LINEAR_MIPMAP_NEAREST = gl.LINEAR_MIPMAP_NEAREST,
  NEAREST_MIPMAP_LINEAR = gl.NEAREST_MIPMAP_LINEAR,
  LINEAR_MIPMAP_LINEAR = gl.LINEAR_MIPMAP_LINEAR
}

export enum TextureWrap {
  REPEAT = gl.REPEAT,
  MIRRORED_REPEAT = gl.MIRRORED_REPEAT,
  CLAMP_EDGE = gl.CLAMP_TO_EDGE
}

export enum TexturePixelFormat {
  RGBA = gl.RGBA
}

export enum TexturePixelType {
  UBYTE = gl.UNSIGNED_BYTE
}

export class Texture2D {
  private textureID: WebGLTexture;

  public readonly wrapMode: TextureWrap;
  public readonly filterMode: TextureFilter;
  public readonly internalFormat: number;
  public readonly srcFormat: number;
  public readonly srcType: number;

  constructor(
    source: HTMLImageElement | Uint8Array,
    mipmap: boolean = true,
    wrapMode: TextureWrap = TextureWrap.CLAMP_EDGE,
    filterMode: TextureFilter = TextureFilter.LINEAR,
    internalFormat: TexturePixelFormat = TexturePixelFormat.RGBA,
    srcFormat: TexturePixelFormat = TexturePixelFormat.RGBA,
    srcType: TexturePixelType = gl.UNSIGNED_BYTE
  ) {
    this.wrapMode = wrapMode;
    this.filterMode = filterMode;
    this.internalFormat = internalFormat;
    this.srcFormat = srcFormat;
    this.srcType = srcType;

    this.textureID = gl.createTexture()!;

    gl.bindTexture(gl.TEXTURE_2D, this.textureID);

    if (this.sourceIsImage(source)) {
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        this.internalFormat,
        this.srcFormat,
        this.srcType,
        source
      );

      if (mipmap) {
        if (this.isPowerOf2(source.width) && this.isPowerOf2(source.height)) {
          gl.generateMipmap(gl.TEXTURE_2D);
        } else {
          console.log(
            "WARNING: Cannot generate mipmaps on non power of 2 texture ( " +
              source.src +
              " )"
          );
        }
      }
    } else {
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        this.internalFormat,
        1,
        1,
        0,
        this.srcFormat,
        this.srcType,
        source
      );
    }

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, this.wrapMode);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, this.wrapMode);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, this.filterMode);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, this.filterMode);
  }

  private sourceIsImage(
    source: Uint8Array | HTMLImageElement
  ): source is HTMLImageElement {
    return (source as HTMLImageElement).width !== undefined;
  }

  public static generateDefault() {
    return new Texture2D(new Uint8Array([0, 0, 255, 255]));
  }

  private isPowerOf2(number: number) {
    return (number & (number - 1)) === 0;
  }

  public bind() {
    gl.bindTexture(gl.TEXTURE_2D, this.textureID);
  }
}
