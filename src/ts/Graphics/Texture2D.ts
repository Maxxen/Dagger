import { gl } from "../Game";

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

export class Texture2D {
  private textureID: WebGLTexture;

  public readonly wrapMode: TextureWrap;
  public readonly filterMode: TextureFilter;
  public readonly internalFormat: number;
  public readonly srcFormat: number;
  public readonly srcType: number;

  constructor(
    url: string,
    mipmap: boolean,
    wrapMode: TextureWrap,
    filterMode: TextureFilter,
    internalFormat: number = gl.RGBA,
    srcFormat: number = gl.RGBA,
    srcType: number = gl.UNSIGNED_BYTE
  ) {
    this.wrapMode = wrapMode;
    this.filterMode = filterMode;
    this.internalFormat = internalFormat;
    this.srcFormat = srcFormat;
    this.srcType = srcType;

    this.textureID = gl.createTexture()!;

    // Generate a default blue pixel image to use before texture is loaded
    this.generateDefault();
    this.loadImage(url, mipmap);
  }

  private generateDefault() {
    gl.bindTexture(gl.TEXTURE_2D, this.textureID);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      1,
      1,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      new Uint8Array([0, 0, 255, 255])
    );
  }

  private loadImage(url: string, mipmap: boolean) {
    const image = new Image();
    image.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, this.textureID);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        this.internalFormat,
        this.srcFormat,
        this.srcType,
        image
      );

      if (mipmap) {
        if (this.isPowerOf2(image.width) && this.isPowerOf2(image.height)) {
          gl.generateMipmap(gl.TEXTURE_2D);
        } else {
          console.log(
            "WARNING: Cannot generate mipmaps on non power of 2 texture ( " +
              url +
              " )"
          );
        }
      }
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, this.wrapMode);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, this.wrapMode);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, this.filterMode);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, this.filterMode);
    };

    image.src = url;
  }

  private isPowerOf2(number: number) {
    return (number & (number - 1)) === 0;
  }

  public bind() {
    gl.bindTexture(gl.TEXTURE_2D, this.textureID);
  }
}
