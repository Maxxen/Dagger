"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Tile_1 = require("./Tile");
var TileMap = /** @class */ (function () {
    function TileMap(width, height) {
        this.width = width;
        this.height = height;
        this.tiles = [];
        for (var y = 0; y < width; y++) {
            for (var x = 0; x < width; x++) {
                this.tiles[x][y] = new Tile_1.Tile();
            }
        }
    }
    return TileMap;
}());
exports.TileMap = TileMap;
//# sourceMappingURL=TileMap.js.map