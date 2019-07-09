"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Point_1 = require("./Point");
var Rectangle = /** @class */ (function () {
    function Rectangle(p1, p2) {
        this.p1 = p1;
        this.p2 = p2;
    }
    Object.defineProperty(Rectangle.prototype, "width", {
        get: function () {
            return this.p2.x - this.p1.x;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rectangle.prototype, "height", {
        get: function () {
            return this.p1.y - this.p2.y;
        },
        enumerable: true,
        configurable: true
    });
    Rectangle.prototype.contains = function (p) {
        return p.x > this.p1.x && p.x < this.p2.x && p.y < this.p1.y && p.y > this.p2.y;
    };
    Rectangle.prototype.expand = function (w, h) {
        var offset = new Point_1.Point(w, h);
        return new Rectangle(this.p1.add(offset), this.p2.sub(offset));
    };
    Rectangle.prototype.splitX = function (x) {
        if (x < this.width && x > 1) {
            return [
                new Rectangle(this.p1, new Point_1.Point(this.p1.x + x, this.p2.y)),
                new Rectangle(new Point_1.Point(this.p1.x + x, this.p1.y), this.p2)
            ];
        }
        else
            return null;
    };
    Rectangle.prototype.splitY = function (y) {
        if (y < this.height && y > 1) {
            return [
                new Rectangle(this.p1, new Point_1.Point(this.p2.x, this.p2.y + y)),
                new Rectangle(new Point_1.Point(this.p1.x, this.p1.y + y), this.p2)
            ];
        }
        else
            return null;
    };
    Rectangle.prototype.split = function () {
        if (this.width > this.height)
            return this.splitX(Math.floor(this.width));
        else
            return this.splitY(Math.floor(this.height));
    };
    Rectangle.prototype.connect = function (p1, p2, margin) {
        var joint = new Point_1.Point(p1.x + (p2.x - p1.x), p2.y + (p1.y - p2.y));
        var r1 = new Rectangle(p1, joint).expand(margin, margin);
        var r2 = new Rectangle(joint, p2).expand(margin, margin);
        return [r1, r2];
    };
    return Rectangle;
}());
exports.Rectangle = Rectangle;
//# sourceMappingURL=Rectangle.js.map