import { mat4 } from "gl-matrix";
import { Texture2D } from "./Texture2D";
import { gl } from "./gl";
import { Material } from "./Material";
import { Shader } from "./Shader";

const vsSource = `
        attribute vec4 a_position;
        attribute vec4 a_color;
        attribute vec2 a_textureCoord;

        uniform mat4 MVP;
        
        varying vec4 v_color;
        varying mediump vec2 v_textureCoord;

        void main() {
          gl_Position = MVP * a_position;
          v_textureCoord = a_textureCoord;
          v_color = a_color;
        }
      `;

const fsSource = `
        precision mediump float;
        
        varying vec4 v_color;
        varying mediump vec2 v_textureCoord;

        uniform sampler2D u_sampler;

        void main() {
          gl_FragColor = texture2D(u_sampler, v_textureCoord) * v_color;
        }
      `;

const SHADER_SPRITE = new Shader("Sprite Shader", vsSource, fsSource);

export class SpriteMaterial extends Material {
  constructor() {
    super(SHADER_SPRITE, "SPRITE_MATERIAL");
  }

  MVP: mat4 = mat4.create();
  texture: Texture2D = Texture2D.TEXTURE_DEFAULT;

  bind() {
    this.shader.setMat4("MVP", this.MVP);
    this.shader.setTexture(gl.TEXTURE0, "u_sampler", this.texture, 0);
  }
}
