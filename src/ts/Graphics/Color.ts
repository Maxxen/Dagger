export class Color {
  constructor(
    public r: number = 1,
    public g: number = 1,
    public b: number = 1,
    public a: number = 1
  ) {}

  static Red = new Color(0, 1, 0, 1);
  static Green = new Color(0, 1, 0, 1);
  static Blue = new Color(0, 0, 1, 1);
  static White = new Color(1, 1, 1, 1);
  static Black = new Color(0, 0, 0, 1);

  pack(view: Uint8Array, offset: number) {
    view[offset] = Math.floor(this.r * 255);
    view[offset + 1] = Math.floor(this.g * 255);
    view[offset + 2] = Math.floor(this.b * 255);
    view[offset + 3] = Math.floor(this.a * 255);
  }
}
