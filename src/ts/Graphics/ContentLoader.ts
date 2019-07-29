import { Texture2D, TextureWrap, TextureFilter } from "./Texture2D";

export class ContentStore {
  private cache: ContentCache = {};

  public get(name: string): Texture2D | undefined {
    return this.cache[name];
  }
  public createLoader(onDone: () => void): ContentLoader {
    return new ContentLoader(this.cache, onDone);
  }
}

export interface ContentCache {
  [key: string]: Texture2D;
}

export type TextureImportParams = [
  string,
  string,
  boolean,
  TextureWrap,
  TextureFilter
];
export class ContentLoader {
  constructor(private cache: ContentCache, private onDone: () => void) {}

  private loadImage([
    name,
    url,
    mipmap,
    wrap,
    filter
  ]: TextureImportParams): Promise<[string, Texture2D]> {
    return new Promise<[string, Texture2D]>((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => {
        const tex = new Texture2D(image, mipmap, wrap, filter);
        resolve([name, tex]);
      });

      image.addEventListener("error", () => {
        reject(new Error("Failed to load texture " + name + " [" + url + "]"));
      });
      image.src = url;
    });
  }

  batch: TextureImportParams[] = [];

  public add(
    name: string,
    url: string,
    mipmap: boolean = false,
    wrap: TextureWrap = TextureWrap.REPEAT,
    filter: TextureFilter = TextureFilter.LINEAR
  ) {
    // Do not reload already cached assets
    if (!(name in this.cache)) {
      this.batch.push([name, url, mipmap, wrap, filter]);
    }
    return this;
  }
  public load(progressCallback: () => void = () => {}): void {
    this.loadWithProgress(progressCallback, this.batch.map(this.loadImage))
      .then((textures: [string, Texture2D][]) => {
        textures.forEach(([name, tex]: [string, Texture2D]) => {
          this.cache[name] = tex;
        });

        // Call only when all loading is done
        this.onDone();
      })
      .catch();
  }

  public loadWithProgress<T>(
    progressCallback: (progress: number) => void,
    promises: Promise<T>[]
  ): Promise<T[]> {
    const max = promises.length;
    let progress = 0;
    progressCallback(0);
    for (let p in promises) {
      promises[p].then(() => {
        progress++;
        progressCallback((progress * 100) / max);
      });
    }
    return Promise.all(promises);
  }
}
