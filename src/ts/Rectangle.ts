import { Point } from './Point';

export class Rectangle {
  
  p1 : Point;
  p2 : Point;

  get width() : number {
    return this.p2.x - this.p1.x;
  }

  get height() : number {
    return this.p1.y - this.p2.y;
  }

  constructor(p1 : Point, p2 : Point){
    this.p1 = p1;
    this.p2 = p2;
  }

  public contains(p : Point) {
    return p.x > this.p1.x && p.x < this.p2.x && p.y < this.p1.y && p.y > this.p2.y;
  }

  public expand(w : number, h : number) : Rectangle {
    const offset = new Point(w, h);
    return new Rectangle(this.p1.add(offset), this.p2.sub(offset));
  }

  public splitX(x : number) : [Rectangle, Rectangle] | null {
    if(x < this.width && x > 1){
      return [
        new Rectangle(this.p1, new Point(this.p1.x + x, this.p2.y)),
        new Rectangle(new Point(this.p1.x + x, this.p1.y), this.p2)
      ]
    } else return null;
  }

  public splitY(y : number) : [Rectangle, Rectangle] | null {
    if(y < this.height && y > 1){
      return [
        new Rectangle(this.p1, new Point(this.p2.x, this.p2.y + y)),
        new Rectangle(new Point(this.p1.x, this.p1.y + y), this.p2)
      ]
    } else return null;
  }

  public split() : [Rectangle, Rectangle] | null {
    if (this.width > this.height)
      return this.splitX(Math.floor(this.width));
    else
      return this.splitY(Math.floor(this.height));
  }

  public connect(p1 : Point, p2 : Point, margin : number) : [Rectangle, Rectangle] {
    const joint = new Point(p1.x + (p2.x - p1.x), p2.y + (p1.y - p2.y));

    const r1 = new Rectangle(p1, joint).expand(margin, margin);
    const r2 = new Rectangle(joint, p2).expand(margin, margin);

    return [r1, r2];
  }
}