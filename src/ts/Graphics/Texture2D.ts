import { gl } from "./gl";
import { Color } from "./Color";

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
  private static nextID = 0;

  private textureHandle: WebGLTexture;
  public readonly width: number;
  public readonly height: number;
  public readonly id: number;

  constructor(
    source: HTMLImageElement | Color,
    mipmap: boolean = true,
    public readonly wrapMode: TextureWrap = TextureWrap.CLAMP_EDGE,
    public readonly filterMode: TextureFilter = TextureFilter.LINEAR,
    public readonly internalFormat: TexturePixelFormat = TexturePixelFormat.RGBA,
    public readonly srcFormat: TexturePixelFormat = TexturePixelFormat.RGBA,
    public readonly srcType: TexturePixelType = gl.UNSIGNED_BYTE
  ) {
    this.textureHandle = gl.createTexture()!;
    this.id = Texture2D.nextID++;

    gl.bindTexture(gl.TEXTURE_2D, this.textureHandle);

    if (this.sourceIsImage(source)) {
      this.width = source.width;
      this.height = source.height;
      this.generateFromImage(source, mipmap);
    } else {
      this.width = 1;
      this.height = 1;
      this.generateFromColor(source);
    }

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, this.wrapMode);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, this.wrapMode);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, this.filterMode);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, this.filterMode);
  }

  private generateFromImage(source: HTMLImageElement, mipmap: boolean) {
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
  }

  private generateFromColor(source: Color) {
    const arr = new Uint8Array(4);
    source.pack(arr, 0);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      this.internalFormat,
      1,
      1,
      0,
      this.srcFormat,
      this.srcType,
      arr
    );
  }

  private sourceIsImage(
    source: Color | HTMLImageElement
  ): source is HTMLImageElement {
    return (source as HTMLImageElement).width !== undefined;
  }

  private isPowerOf2(number: number) {
    return (number & (number - 1)) === 0;
  }

  public bind() {
    gl.bindTexture(gl.TEXTURE_2D, this.textureHandle);
  }

  static TEXTURE_DEFAULT = new Texture2D(Color.WHITE);

  public equals(other: Texture2D) {
    return this.id == other.id;
  }

  public compareTo(other: Texture2D) {
    return this.id - other.id;
  }
}
