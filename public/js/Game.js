"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Shader_1 = require("./Shader");
var gl_matrix_1 = require("gl-matrix");
var Plane_1 = require("./Plane");
var Game = /** @class */ (function () {
    function Game() {
    }
    Game.prototype.start = function () {
        var canvas = document.querySelector("#glCanvas");
        // Initialize the GL context
        var gl = canvas.getContext("webgl");
        // Only continue if WebGL is available and working
        if (gl === null) {
            alert("Unable to initialize WebGL. Your browser or machine may not support it.");
            return;
        }
        var vsSource = "\n        attribute vec4 aVertexPosition;\n\n        uniform mat4 uModelViewMatrix;\n        uniform mat4 uProjectionMatrix;\n\n        void main() {\n          gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;\n        }\n      ";
        var fsSource = "\n        void main() {\n          gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);\n        }\n      ";
        var attributes = { "vertexPosition": 'aVertexPosition' };
        var uniforms = { "projectionMatrix": 'uProjectionMatrix', "modelViewMatrix": 'uModelViewMatrix' };
        var shader = new Shader_1.Shader(gl, vsSource, fsSource, attributes, uniforms);
        var plane = new Plane_1.Plane(gl);
        this.draw(gl, shader.shaderProgramInfo, plane);
    };
    Game.prototype.draw = function (gl, programInfo, buffers) {
        gl.clearColor(0.0, 0.0, 0.0, 1.0); // Clear to black, fully opaque
        gl.clearDepth(1.0); // Clear everything
        gl.enable(gl.DEPTH_TEST); // Enable depth testing
        gl.depthFunc(gl.LEQUAL); // Near things obscure far things
        // Clear the canvas before we start drawing on it.
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        // Create a perspective matrix, a special matrix that is
        // used to simulate the distortion of perspective in a camera.
        // Our field of view is 45 degrees, with a width/height
        // ratio that matches the display size of the canvas
        // and we only want to see objects between 0.1 units
        // and 100 units away from the camera.
        var fieldOfView = 45 * Math.PI / 180; // in radians
        var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
        var zNear = 0.1;
        var zFar = 100.0;
        var projectionMatrix = gl_matrix_1.mat4.create();
        // note: glmatrix.js always has the first argument
        // as the destination to receive the result.
        gl_matrix_1.mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);
        // Set the drawing position to the "identity" point, which is
        // the center of the scene.
        var modelViewMatrix = gl_matrix_1.mat4.create();
        // Now move the drawing position a bit to where we want to
        // start drawing the square.
        gl_matrix_1.mat4.translate(modelViewMatrix, // destination matrix
        modelViewMatrix, // matrix to translate
        [-0.0, 0.0, -6.0]); // amount to translate
        // Tell WebGL how to pull out the positions from the position
        // buffer into the vertexPosition attribute.
        {
            var numComponents = 2; // pull out 2 values per iteration
            var type = gl.FLOAT; // the data in the buffer is 32bit floats
            var normalize = false; // don't normalize
            var stride = 0; // how many bytes to get from one set of values to the next
            // 0 = use type and numComponents above
            var offset = 0; // how many bytes inside the buffer to start from
            gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
            gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, numComponents, type, normalize, stride, offset);
            gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
        }
        // Tell WebGL to use our program when drawing
        gl.useProgram(programInfo.program);
        // Set the shader uniforms
        gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
        gl.uniformMatrix4fv(programInfo.uniformLocations.modelViewMatrix, false, modelViewMatrix);
        {
            var offset = 0;
            var vertexCount = 4;
            gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
        }
    };
    return Game;
}());
exports.Game = Game;
//# sourceMappingURL=Game.js.map