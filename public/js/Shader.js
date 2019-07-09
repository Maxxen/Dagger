"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ShaderProgramInfo_1 = require("./ShaderProgramInfo");
var Shader = /** @class */ (function () {
    function Shader(gl, vsSource, fsSource, attributes, uniforms) {
        this.shaderProgram = null;
        this.shaderProgramInfo = null;
        var shaderProgram = this.initProgram(gl, vsSource, fsSource);
        if (shaderProgram) {
            this.shaderProgram = shaderProgram;
            this.shaderProgramInfo = new ShaderProgramInfo_1.ShaderProgramInfo(gl, this.shaderProgram, attributes, uniforms);
        }
    }
    Shader.prototype.initProgram = function (gl, vsSource, fsSource) {
        // TODO, properly handle when vertex and fragment loading fails
        var vertexShader = this.loadShader(gl, gl.VERTEX_SHADER, vsSource);
        var fragmentShader = this.loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
        var shaderProgram = gl.createProgram();
        if (shaderProgram) {
            gl.attachShader(shaderProgram, vertexShader);
            gl.attachShader(shaderProgram, fragmentShader);
            gl.linkProgram(shaderProgram);
            if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
                alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
                return null;
            }
        }
        else {
            alert("Could not create program");
            return null;
        }
        return shaderProgram;
    };
    Shader.prototype.loadShader = function (gl, type, source) {
        var shader = gl.createShader(type);
        if (shader) {
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                alert("Error compiling shader " + gl.getShaderInfoLog);
                gl.deleteShader(shader);
                return null;
            }
            return shader;
        }
        else {
            alert("failed to create shader");
            return null;
        }
    };
    return Shader;
}());
exports.Shader = Shader;
//# sourceMappingURL=Shader.js.map