
export enum TileType {
  FLOOR,
  WALL
}

export class Tile {
  
  public readonly type : TileType;

  constructor(type? : TileType){
    this.type = type || TileType.FLOOR;
  }
}