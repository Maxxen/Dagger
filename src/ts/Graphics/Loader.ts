import { Texture2D, TextureWrap, TextureFilter } from "./Texture2D";

export class Loader {
  private cache: { [key: string]: Texture2D } = {};
  private nextAction: () => void = () => {};

  private loadTexture(
    name: string,
    url: string,
    mipmap: boolean,
    wrapmode: TextureWrap,
    filtermode: TextureFilter,
    onLoad: (tex: Texture2D) => void
  ): void {
    if (this.cache[name] == null) {
      const image = new Image();
      image.onload = () => {
        const tex = new Texture2D(image, mipmap, wrapmode, filtermode);
        this.cache[name] = tex;
        onLoad(tex);
      };
      image.src = url;
    } else {
      onLoad(this.cache[name]);
    }
  }

  public isLoaded(name: string): boolean {
    return name in this.cache;
  }
  public getLoaded(name: string) {
    return this.cache[name];
  }

  private loadImage(
    elem: string,
    collection: HTMLImageElement[]
  ): Promise<HTMLImageElement[]> {
    return new Promise<HTMLImageElement[]>((resolve, reject) => {
      let img = new Image();
      img.addEventListener("load", e => {
        collection.push(img);
        resolve(collection);
      });

      img.addEventListener("error", () => {
        reject(new Error(`Failed to load image's URL: ${elem}`));
      });
      img.src = elem;
    });
  }

  public foldPromises<T, K>(
    input: T[],
    collection: K[],
    foldFunc: PromiseFoldFunc<T, K>
  ): Promise<K[]> {
    if (input.length == 0) {
      return new Promise((resolve, reject) => {
        resolve(collection);
      });
    } else {
      const promise = foldFunc(input.pop()!, collection);

      promise.then(collection =>
        this.foldPromises(input, collection, foldFunc)
      );
      return promise;
    }
  }

  public loadMany(...batch: string[]) {
    return this.foldPromises(batch, [], this.loadImage);
  }
}
type PromiseFoldFunc<T, K> = (elem: T, collection: K[]) => Promise<K[]>;
type onLoadCallback = (textures: { [key: string]: Texture2D }) => void;
type TextureParam = [string, string, boolean, TextureWrap, TextureFilter];
