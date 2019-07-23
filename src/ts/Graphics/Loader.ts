import { Texture2D, TextureWrap, TextureFilter } from "./Texture2D";
export type TextureImportParams = [
  string,
  string,
  boolean,
  TextureWrap,
  TextureFilter
];
export class Loader {
  private cache: { [key: string]: Texture2D } = {};

  public isLoaded(name: string): boolean {
    return name in this.cache;
  }
  public getLoaded(name: string) {
    return this.cache[name];
  }

  private loadImage([
    name,
    url,
    mipmap,
    wrap,
    filter
  ]: TextureImportParams): Promise<Texture2D> {
    return new Promise<Texture2D>((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => {
        const tex = new Texture2D(image, mipmap, wrap, filter);
        resolve(tex);
      });

      image.addEventListener("error", () => {
        reject(new Error("Failed to load texture " + name + " [" + url + "]"));
      });
      image.src = url;
    });
  }

  public load(...batch: TextureImportParams[]): Promise<Texture2D[]> {
    return Promise.all(batch.map(this.loadImage));
  }
}
