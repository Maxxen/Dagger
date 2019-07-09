"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Tile_1 = require("./Tile");
var MapGenerator = /** @class */ (function () {
    function MapGenerator() {
    }
    MapGenerator.blank = function (width, height) {
        var tiles = [];
        for (var y = 0; y < height; y++) {
            for (var x = 0; x < width; x++) {
                tiles[x][y] = new Tile_1.Tile(Tile_1.TileType.FLOOR);
            }
        }
        return tiles;
    };
    return MapGenerator;
}());
exports.MapGenerator = MapGenerator;
//# sourceMappingURL=MapGenerator.js.map