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

  public queue(param: TextureParam[], onLoad: onLoadCallback) {
    const oldAction = this.nextAction;
    this.nextAction = () => {
      this.loadAction(param, result => {
        onLoad(result), oldAction();
      });
    };
    return this;
  }

  public load() {
    this.nextAction();
    this.nextAction = () => {};
    return this;
  }

  public loadAction(batch: TextureParam[], onLoad: onLoadCallback) {
    const textures: { [key: string]: Texture2D } = {};
    let loaded = 0;
    const count = batch.length;

    batch.forEach(([name, url, mipmap, wrapmode, filtermode]) => {
      this.loadTexture(name, url, mipmap, wrapmode, filtermode, tex => {
        textures[name] = tex;
        loaded++;
        if (loaded == count) {
          onLoad(textures);
        }
      });
    });
    return this;
  }

  public makePromise(url: string, loaded: HTMLImageElement[]) {
    return new Promise(
      (resolve: (loaded: HTMLImageElement[]) => void, reject) => {
        let img = new Image();

        img.addEventListener("load", e => {
          loaded.push(img);
          resolve(loaded);
        });

        img.addEventListener("error", () => {
          reject(new Error(`Failed to load image's URL: ${url}`));
        });
        img.src = url;
      }
    );
  }

  public recurse(
    urls: string[],
    loaded: HTMLImageElement[]
  ): Promise<HTMLImageElement[]> {
    if (urls.length == 0) {
      return new Promise((resolve, reject) => {
        resolve(loaded);
      });
    } else {
      const url = urls.pop()!;
      const p = new Promise<HTMLImageElement[]>((resolve, reject) => {
        let img = new Image();
        img.addEventListener("load", e => {
          loaded.push(img);
          resolve(loaded);
        });

        img.addEventListener("error", () => {
          reject(new Error(`Failed to load image's URL: ${url}`));
        });
        img.src = url;
      });

      p.then(loaded => this.recurse(urls, loaded));
      return p;
    }
  }

  public loadMany(...batch: string[]) {
    return this.recurse(batch, []);
  }
}
type onLoadCallback = (textures: { [key: string]: Texture2D }) => void;
type TextureParam = [string, string, boolean, TextureWrap, TextureFilter];
