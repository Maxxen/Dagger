export class Color {
  constructor(
    public r: number = 1,
    public g: number = 1,
    public b: number = 1,
    public a: number = 1
  ) {}

  public static readonly Red = new Color(1, 0, 0, 1);
  public static readonly Green = new Color(0, 1, 0, 1);
  public static readonly Blue = new Color(0, 0, 1, 1);
  public static readonly White = new Color(1, 1, 1, 1);
  public static readonly Black = new Color(0, 0, 0, 1);

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
}
