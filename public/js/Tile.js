"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TileType;
(function (TileType) {
    TileType[TileType["FLOOR"] = 0] = "FLOOR";
    TileType[TileType["WALL"] = 1] = "WALL";
})(TileType = exports.TileType || (exports.TileType = {}));
var Tile = /** @class */ (function () {
    function Tile(type) {
        this.type = type || TileType.FLOOR;
    }
    return Tile;
}());
exports.Tile = Tile;
//# sourceMappingURL=Tile.js.map