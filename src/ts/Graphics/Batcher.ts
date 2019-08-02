import { mat4 } from "gl-matrix";
import { VertexBuffer } from "./VertexBuffer";
import { IndexBuffer } from "./IndexBuffer";
import { Texture2D } from "./Texture2D";
import { VertexPositionColorUV } from "./Vertex";
import { SpriteMaterial } from "./SpriteComponent";
import { Vector2 } from "./Vector2";
import { Color } from "./Color";
import { gl } from "./gl";
import { Rectangle } from "./Rectangle";

export class Batcher {
  public transform: mat4 = mat4.create();

  private vertexBuffer: VertexBuffer;
  private indexBuffer: IndexBuffer;
  private items: BatchItem[];
  private itemCount: number = 0;

  private spriteMaterial: SpriteMaterial;

  private drawing: boolean = false;

  static readonly MAX_SPRITES = 2048;
  static readonly MAX_VERTICES = Batcher.MAX_SPRITES * 4;
  static readonly MAX_INDICES = Batcher.MAX_SPRITES * 6;

  static readonly indexData: Uint16Array = Batcher.makeIndices();

  public constructor() {
    this.vertexBuffer = new VertexBuffer(VertexPositionColorUV.layout);
    this.indexBuffer = new IndexBuffer(Batcher.indexData);
    this.items = new Array<BatchItem>(Batcher.MAX_SPRITES);
    this.spriteMaterial = new SpriteMaterial();
  }

  public begin(transform: mat4): void {
    if (this.drawing) {
      throw "Cannot call begin without first calling end!";
    }
    this.drawing = true;
    this.transform = transform;
  }

  public end() {
    if (!this.drawing) {
      throw "Cannot call end without first calling begin!";
    }
    this.drawing = false;
    this.flush();
  }

  public draw(
    texture: Texture2D,
    position: Rectangle,
    color: Color = Color.WHITE,
    origin: Vector2 = new Vector2(0, 0),
    crop: Rectangle = new Rectangle(0, 0, 1, 1),
    depth: number = 0
  ): void {
    if (this.itemCount >= Batcher.MAX_SPRITES) {
      this.flush();
    }

    this.items[this.itemCount] = new BatchItem(
      texture,
      color,
      depth,
      position.topLeft.sub(origin),
      crop.botLeft,
      position.botLeft.sub(origin),
      crop.topLeft,
      position.topRight.sub(origin),
      crop.botRight,
      position.botRight.sub(origin),
      crop.topRight
    );

    this.itemCount++;
  }

  private setupBuffers() {
    const buffer = new ArrayBuffer(
      this.itemCount * this.vertexBuffer.layout.stride * 4
    );
    for (let i = 0; i < this.itemCount; i++) {
      this.items[i].pack(buffer, i * 96);
    }
    this.vertexBuffer.setData(buffer);
    this.vertexBuffer.bind();
    this.vertexBuffer.applyAttribs();
    this.indexBuffer.bind();
  }

  public flush() {
    if (this.itemCount == 0) {
      return;
    }

    // Before we pack the data into the buffer, sort the sprite by texture id so we
    // can group them into larger batches

    this.items.sort((a, b) => {
      return a.texture.compareTo(b.texture);
    });

    this.setupBuffers();
    this.spriteMaterial.MVP = this.transform;
    this.spriteMaterial.shader.use();

    let texture: Texture2D = this.items[0].texture;
    let offset: number = 0;

    // Group sprites with the same texture and draw them with a single indexed call
    for (let i = 1; i < this.itemCount; i++) {
      if (this.items[i].texture != texture) {
        this.drawSprite(texture, offset, i - offset);
        texture = this.items[i].texture;
        offset = i;
      }
    }

    this.drawSprite(texture, offset, this.itemCount - offset);

    this.itemCount = 0;
    this.items = [];
  }

  drawSprite(texture: Texture2D, first: number, count: number) {
    this.spriteMaterial.texture = texture;
    this.spriteMaterial.use();
    gl.drawElements(gl.TRIANGLES, count * 6, gl.UNSIGNED_SHORT, first * 12);
  }

  private static makeIndices(): Uint16Array {
    const indices = new Uint16Array(Batcher.MAX_INDICES);
    for (let i = 0, j = 0; i < Batcher.MAX_INDICES; i += 6, j += 4) {
      indices[i + 0] = j + 0;
      indices[i + 1] = j + 1;
      indices[i + 2] = j + 2;
      indices[i + 3] = j + 2;
      indices[i + 4] = j + 1;
      indices[i + 5] = j + 3;
    }
    return indices;
  }
}

class BatchItem {
  /* 
  Optimization ideas
    1. Store the floats in a float32array, should take up less memory than arrays of numbers
    2. Move vertex format to PostionUVColor instead of PositionColorUV so we can set the entire
      all vertex data in one .set operations. (or keep it unrolled, idk) and then add the
      color bytes afterwards
  */

  public texture: Texture2D;
  public color: Color;
  public pos: [
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number
  ];
  public constructor(
    texture: Texture2D,
    color: Color,
    depth: number,
    pos0: Vector2,
    uv0: Vector2,
    pos1: Vector2,
    uv1: Vector2,
    pos2: Vector2,
    uv2: Vector2,
    pos3: Vector2,
    uv3: Vector2
  ) {
    this.color = color;
    this.texture = texture;
    this.pos = [
      pos0.x,
      pos0.y,
      depth,
      uv0.x,
      uv0.y,
      pos1.x,
      pos1.y,
      depth,
      uv1.x,
      uv1.y,
      pos2.x,
      pos2.y,
      depth,
      uv2.x,
      uv2.y,
      pos3.x,
      pos3.y,
      depth,
      uv3.x,
      uv3.y
    ];
  }

  pack(buffer: ArrayBuffer, offset: number) {
    const bytes = new Uint8Array(buffer, offset);
    const floats = new Float32Array(buffer, offset);

    // We unroll the packing to optimize
    // It is faster than .set() for small data sets

    // Bytes 0 to 12
    floats[0] = this.pos[0];
    floats[1] = this.pos[1];
    floats[2] = this.pos[2];

    // bytes 12 to 16
    bytes[12] = this.color.r;
    bytes[13] = this.color.g;
    bytes[14] = this.color.b;
    bytes[15] = this.color.a;

    // bytes 16 to 24
    floats[4] = this.pos[3];
    floats[5] = this.pos[4];

    // bytes 24 to 36
    floats[6] = this.pos[5];
    floats[7] = this.pos[6];
    floats[8] = this.pos[7];

    // bytes 36 to 40
    bytes[36] = this.color.r;
    bytes[37] = this.color.g;
    bytes[38] = this.color.b;
    bytes[39] = this.color.a;

    // bytes 40 to 48
    floats[10] = this.pos[8];
    floats[11] = this.pos[9];

    // bytes 48 to 60
    floats[12] = this.pos[10];
    floats[13] = this.pos[11];
    floats[14] = this.pos[12];

    // bytes 60 to 64
    bytes[60] = this.color.r;
    bytes[61] = this.color.g;
    bytes[62] = this.color.b;
    bytes[63] = this.color.a;

    // bytes 64 to 72
    floats[16] = this.pos[13];
    floats[17] = this.pos[14];

    // bytes 72 to 84
    floats[18] = this.pos[15];
    floats[19] = this.pos[16];
    floats[20] = this.pos[17];

    //bytes 84 to 88
    bytes[84] = this.color.r;
    bytes[85] = this.color.g;
    bytes[86] = this.color.b;
    bytes[87] = this.color.a;

    //bytes 88 to 96
    floats[22] = this.pos[18];
    floats[23] = this.pos[19];
  }
}
