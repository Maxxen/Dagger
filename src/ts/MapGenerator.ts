import { Tile, TileType } from "./Tile";

export class MapGenerator {

  public static blank(width : number, height : number) : Tile[][] {
    
    const tiles : Tile[][] = [];

    for (let y : number = 0; y < height; y++){
      for (let x : number = 0; x < width; x++){
        tiles[x][y] = new Tile(TileType.FLOOR);
      }
    }

    return tiles;
  }
}
