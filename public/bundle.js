/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/ts/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/ts/Game.ts":
/*!************************!*\
  !*** ./src/ts/Game.ts ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Shader_1 = __webpack_require__(/*! ./Graphics/Shader */ "./src/ts/Graphics/Shader.ts");
var VAO_1 = __webpack_require__(/*! ./Graphics/VAO */ "./src/ts/Graphics/VAO.ts");
var VBO_1 = __webpack_require__(/*! ./Graphics/VBO */ "./src/ts/Graphics/VBO.ts");
var VBOLayout_1 = __webpack_require__(/*! ./Graphics/VBOLayout */ "./src/ts/Graphics/VBOLayout.ts");
function initGL() {
    var canvas = document.querySelector("#glCanvas");
    // Initialize the GL context
    var ctx = canvas.getContext("webgl");
    // Only continue if WebGL is available and working
    if (ctx === null) {
        alert("Unable to initialize WebGL. Your browser or machine may not support it.");
        return;
    }
    var ext = ctx.getExtension("OES_vertex_array_object");
    if (ext === null) {
        alert("OES Vertex array object extension not supported!");
        return;
    }
    exports.gl = ctx;
    exports.glext = ext;
}
exports.initGL = initGL;
var Game = /** @class */ (function () {
    function Game() {
    }
    Game.prototype.start = function () {
        initGL();
        var vsSource = "\n        attribute vec4 a_position;\n        attribute vec4 a_color;\n\n        varying vec4 v_color;\n\n        void main() {\n          gl_Position = a_position;\n          v_color = a_color;\n        }\n      ";
        var fsSource = "\n        precision mediump float;\n\n        varying vec4 v_color;\n\n        void main() {\n          gl_FragColor = v_color;\n        }\n      ";
        // Compile shaders
        var vert = Shader_1.compileShader(vsSource, exports.gl.VERTEX_SHADER);
        var frag = Shader_1.compileShader(fsSource, exports.gl.FRAGMENT_SHADER);
        // Create program
        var program = Shader_1.createShaderProgram(vert, frag);
        // Create VAO
        var data = new Float32Array([
            -1.0, -1.0, 0.0, 1, 0, 0, 1,
            1.0, -1.0, 0.0, 0, 1, 0, 1,
            0.0, 1.0, 0.0, 0, 0, 1, 1
        ]);
        var vao = new VAO_1.VAO();
        var vbo = new VBO_1.VBO(data);
        var layout = new VBOLayout_1.VBOLayout();
        layout.addAttribute(exports.gl.FLOAT, 3);
        layout.addAttribute(exports.gl.FLOAT, 4);
        vao.addBuffer(vbo, layout);
        // MVP Matrix
        // Enable depth testing
        exports.gl.enable(exports.gl.DEPTH_TEST);
        exports.gl.depthFunc(exports.gl.LESS);
        // Clear screen
        exports.gl.clearColor(0, 0, 0.4, 1);
        exports.gl.clear(exports.gl.COLOR_BUFFER_BIT | exports.gl.DEPTH_BUFFER_BIT);
        exports.gl.useProgram(program);
        vao.bind();
        exports.gl.drawArrays(exports.gl.TRIANGLES, 0, 3);
    };
    return Game;
}());
exports.Game = Game;


/***/ }),

/***/ "./src/ts/Graphics/Shader.ts":
/*!***********************************!*\
  !*** ./src/ts/Graphics/Shader.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Game_1 = __webpack_require__(/*! ../Game */ "./src/ts/Game.ts");
function compileShader(source, type) {
    var shaderID = Game_1.gl.createShader(type);
    Game_1.gl.shaderSource(shaderID, source);
    console.log("Compiling shader " + source);
    Game_1.gl.compileShader(shaderID);
    if (!Game_1.gl.getShaderParameter(shaderID, Game_1.gl.COMPILE_STATUS)) {
        alert("Error compiling shader " + Game_1.gl.getShaderInfoLog(shaderID));
        Game_1.gl.deleteShader(shaderID);
        return null;
    }
    return shaderID;
}
exports.compileShader = compileShader;
function createShaderProgram(vert, frag) {
    var programID = Game_1.gl.createProgram();
    Game_1.gl.attachShader(programID, vert);
    Game_1.gl.attachShader(programID, frag);
    Game_1.gl.linkProgram(programID);
    if (!Game_1.gl.getProgramParameter(programID, Game_1.gl.LINK_STATUS)) {
        alert("Error linking program " + Game_1.gl.getProgramInfoLog(programID));
        Game_1.gl.deleteProgram(programID);
        return null;
    }
    Game_1.gl.detachShader(programID, vert);
    Game_1.gl.detachShader(programID, frag);
    Game_1.gl.deleteShader(vert);
    Game_1.gl.deleteShader(frag);
    return programID;
}
exports.createShaderProgram = createShaderProgram;


/***/ }),

/***/ "./src/ts/Graphics/VAO.ts":
/*!********************************!*\
  !*** ./src/ts/Graphics/VAO.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Game_1 = __webpack_require__(/*! ../Game */ "./src/ts/Game.ts");
var VAO = /** @class */ (function () {
    function VAO() {
        this.id = Game_1.glext.createVertexArrayOES();
    }
    VAO.prototype.bind = function () {
        Game_1.glext.bindVertexArrayOES(this.id);
    };
    VAO.prototype.unbind = function () {
        Game_1.glext.bindVertexArrayOES(null);
    };
    VAO.prototype.addBuffer = function (vertexBuffer, layout) {
        this.bind();
        vertexBuffer.bind();
        var offset = 0;
        for (var i = 0; i < layout.elements.length; i++) {
            var elem = layout.elements[i];
            Game_1.gl.enableVertexAttribArray(i);
            // This is really confusing, gl.vertexAttribPointer takes (index, SIZE, ...)
            // size in this case is NOT the size of the elements, but instead the number of components
            Game_1.gl.vertexAttribPointer(i, elem.count, elem.type, elem.normalized, layout.stride, offset);
            offset += elem.count * elem.size;
        }
    };
    return VAO;
}());
exports.VAO = VAO;


/***/ }),

/***/ "./src/ts/Graphics/VBO.ts":
/*!********************************!*\
  !*** ./src/ts/Graphics/VBO.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Game_1 = __webpack_require__(/*! ../Game */ "./src/ts/Game.ts");
var VBO = /** @class */ (function () {
    function VBO(data) {
        this.id = Game_1.gl.createBuffer();
        this.data = data;
        Game_1.gl.bindBuffer(Game_1.gl.ARRAY_BUFFER, this.id);
        Game_1.gl.bufferData(Game_1.gl.ARRAY_BUFFER, data, Game_1.gl.STATIC_DRAW);
        Game_1.gl.bindBuffer(Game_1.gl.ARRAY_BUFFER, null);
    }
    VBO.prototype.bind = function () {
        Game_1.gl.bindBuffer(Game_1.gl.ARRAY_BUFFER, this.id);
    };
    VBO.prototype.unbind = function () {
        Game_1.gl.bindBuffer(Game_1.gl.ARRAY_BUFFER, null);
    };
    return VBO;
}());
exports.VBO = VBO;


/***/ }),

/***/ "./src/ts/Graphics/VBOLayout.ts":
/*!**************************************!*\
  !*** ./src/ts/Graphics/VBOLayout.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Game_1 = __webpack_require__(/*! ../Game */ "./src/ts/Game.ts");
var VBOLayout = /** @class */ (function () {
    function VBOLayout() {
        this._elements = [];
        this.stride = 0;
    }
    Object.defineProperty(VBOLayout.prototype, "elements", {
        get: function () {
            return this._elements;
        },
        enumerable: true,
        configurable: true
    });
    VBOLayout.prototype.addAttribute = function (type, count) {
        switch (type) {
            case Game_1.gl.FLOAT: {
                this._elements.push({ type: type, count: count, size: 4, normalized: false });
                this.stride += 4 * count;
                break;
            }
            case Game_1.gl.UNSIGNED_INT: {
                this._elements.push({ type: type, count: count, size: 4, normalized: false });
                this.stride += 4 * count;
                break;
            }
            case Game_1.gl.BYTE: {
                this._elements.push({ type: type, count: count, size: 1, normalized: true });
                this.stride += 1 * count;
                break;
            }
            default: {
                alert("Unsupported GL element type! " + type);
                break;
            }
        }
    };
    return VBOLayout;
}());
exports.VBOLayout = VBOLayout;


/***/ }),

/***/ "./src/ts/index.ts":
/*!*************************!*\
  !*** ./src/ts/index.ts ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Game_1 = __webpack_require__(/*! ./Game */ "./src/ts/Game.ts");
console.log("Hello world!");
var game = new Game_1.Game();
game.start();


/***/ })

/******/ });
//# sourceMappingURL=bundle.js.map