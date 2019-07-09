"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ShaderProgramInfo = /** @class */ (function () {
    function ShaderProgramInfo(gl, program, attributes, uniforms) {
        this.attribLocations = {};
        this.uniformLocations = {};
        this.program = program;
        for (var key in attributes) {
            this.attribLocations[key] = gl.getAttribLocation(program, attributes[key]);
        }
        for (var key in uniforms) {
            var location_1 = gl.getUniformLocation(program, uniforms[key]);
            if (location_1 == null) {
                alert("Error, cant get location of uniform: '" + uniforms[key] + "'");
            }
            else {
                this.uniformLocations[key] = location_1;
            }
        }
    }
    return ShaderProgramInfo;
}());
exports.ShaderProgramInfo = ShaderProgramInfo;
//# sourceMappingURL=ShaderProgramInfo.js.map