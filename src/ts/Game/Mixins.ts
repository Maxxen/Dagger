type Constructor<T = {}> = new (...args: any[]) => T;

function Renderable<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    isRenderable() {
      return true;
    }

    draw() {
      console.log("drawn");
    }
  };
}
