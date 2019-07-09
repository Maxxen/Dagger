"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Point = /** @class */ (function () {
    function Point(x, y) {
        this.x = x;
        this.y = y;
    }
    Point.prototype.copy = function () {
        return new Point(this.x, this.y);
    };
    Point.prototype.add = function (p) {
        return new Point(this.x + p.x, this.y + p.y);
    };
    ;
    Point.prototype.sub = function (p) {
        return new Point(this.x - p.x, this.y - p.y);
    };
    ;
    Point.prototype.distanceSquared = function (p) {
        return (p.x - this.x) ^ 2 + (p.y - this.y) ^ 2;
    };
    ;
    Point.prototype.distance = function (p) {
        return Math.sqrt((p.x - this.x) ^ 2 + (p.y - this.y) ^ 2);
    };
    ;
    return Point;
}());
exports.Point = Point;
//# sourceMappingURL=Point.js.map