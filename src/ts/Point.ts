
export class Point{
  x : number;
  y : number;

  constructor(x : number, y : number){
    this.x = x;
    this.y = y;
  }

  public copy() : Point {
    return new Point(this.x, this.y);
  }
  
  public add(p : Point) : Point { 
    return new Point(this.x + p.x, this.y + p.y) 
  };

  public sub(p : Point) : Point { 
    return new Point(this.x - p.x, this.y - p.y) 
  };

  public distanceSquared(p : Point) : number { 
    return (p.x - this.x)^2 + (p.y - this.y)^2 
  };

  public distance(p : Point) {
    return Math.sqrt((p.x - this.x)^2 + (p.y - this.y)^2)
  };
}