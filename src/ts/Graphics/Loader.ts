import { Texture2D, TextureWrap, TextureFilter } from "./Texture2D";

export class Loader {
  private cache: { [key: string]: Texture2D } = {};

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

  batch: [string, string, boolean, TextureWrap, TextureFilter][] = [];
  public add(
    name: string,
    url: string,
    mipmap: boolean = false,
    wrapmode: TextureWrap = TextureWrap.CLAMP_EDGE,
    filtermode: TextureFilter = TextureFilter.LINEAR
  ) {
    this.batch.push([name, url, mipmap, wrapmode, filtermode]);
    return this;
  }

  public load(onLoad: (textures: { [key: string]: Texture2D }) => void) {
    const textures: { [key: string]: Texture2D } = {};
    let loaded = 0;
    const toLoad = this.batch.length;

    this.batch.forEach(([name, url, mipmap, wrapmode, filtermode]) => {
      this.loadTexture(name, url, mipmap, wrapmode, filtermode, tex => {
        textures[name] = tex;
        loaded++;
        if (loaded == toLoad) {
          this.batch = [];
          onLoad(textures);
        }
      });
    });
    return this;
  }

  public isLoaded(name: string): boolean {
    return name in this.cache;
  }
  public getLoaded(name: string) {
    return this.cache[name];
  }
}
