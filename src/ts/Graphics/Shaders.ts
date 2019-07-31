import { Shader } from "./Shader";
const vsSource = `
        attribute vec4 a_position;
        attribute vec2 a_textureCoord;

        uniform mat4 M;
        uniform mat4 V;
        uniform mat4 P;
        
        varying mediump vec2 v_textureCoord;

        void main() {
          gl_Position = P * V * M * a_position;
          v_textureCoord = a_textureCoord;
        }
      `;

const fsSource = `
        precision mediump float;
        
        varying mediump vec2 v_textureCoord;

        uniform vec4 u_color;
        uniform sampler2D u_sampler;

        void main() {
          gl_FragColor = texture2D(u_sampler, v_textureCoord) * u_color;
        }
      `;
export const SHADER_TEXTURE_COLOR = new Shader(
  "SHADER_COLOR_TEXTURE",
  vsSource,
  fsSource
);
