export class Color {
  constructor(
    public r: number = 1,
    public g: number = 1,
    public b: number = 1,
    public a: number = 1
  ) {}

  public static readonly RED = new Color(1, 0, 0, 1);
  public static readonly GREEN = new Color(0, 1, 0, 1);
  public static readonly BLUE = new Color(0, 0, 1, 1);
  public static readonly WHITE = new Color(1, 1, 1, 1);
  public static readonly BLACK = new Color(0, 0, 0, 1);
  public static readonly PURPLE = new Color(1, 0, 1, 1);

  pack(view: Uint8Array, offset: number) {
    view[offset] = Math.floor(this.r * 255);
    view[offset + 1] = Math.floor(this.g * 255);
    view[offset + 2] = Math.floor(this.b * 255);
    view[offset + 3] = Math.floor(this.a * 255);
  }

  packAsFloat(view: Float32Array, offset: number) {
    view[offset] = this.r;
    view[offset + 1] = this.g;
    view[offset + 2] = this.b;
    view[offset + 3] = this.a;
  }

  toArray() {
    return [this.r, this.g, this.b, this.a];
  }
}
