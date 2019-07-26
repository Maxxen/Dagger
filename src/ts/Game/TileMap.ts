import { Tile } from "./Tile";

export class TileMap {
  
  public readonly width : number;
  public readonly height : number;

  private tiles : Tile[][]

  public constructor(width : number, height : number){
    this.width = width;
    this.height = height;

    this.tiles = [];

    for (let y : number = 0; y < width; y++){
      for (let x : number = 0; x < width; x++){
        this.tiles[x][y] = new Tile();
      }
    }
  }
}