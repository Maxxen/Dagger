export class Color {
  constructor(
    public r: number = 255,
    public g: number = 255,
    public b: number = 255,
    public a: number = 255
  ) {}

  public static readonly RED = new Color(255, 0, 0, 255);
  public static readonly GREEN = new Color(0, 255, 0, 255);
  public static readonly BLUE = new Color(0, 0, 255, 255);
  public static readonly WHITE = new Color(255, 255, 255, 255);
  public static readonly BLACK = new Color(0, 0, 0, 255);
  public static readonly PURPLE = new Color(255, 0, 255, 255);

  pack(view: Uint8Array, offset: number) {
    view.set([this.r, this.g, this.b, this.a], offset);
  }

  toArray(): [number, number, number, number] {
    return [this.r, this.g, this.b, this.a];
  }
}
