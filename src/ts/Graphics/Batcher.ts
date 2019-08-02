import { mat4 } from "gl-matrix";
import { VertexBuffer } from "./VertexBuffer";
import { IndexBuffer } from "./IndexBuffer";
import { Texture2D } from "./Texture2D";
import { VertexPositionColorUV } from "./Vertex";
import { SpriteMaterial } from "./SpriteComponent";
import { Vector2 } from "./Vector2";
import { Color } from "./Color";
import { Vector3 } from "./Vector3";
import { gl } from "./gl";

class BatchItem {
  public constructor(
    public texture: Texture2D,
    public v1: VertexPositionColorUV,
    public v2: VertexPositionColorUV,
    public v3: VertexPositionColorUV,
    public v4: VertexPositionColorUV
  ) {}

  pack(buffer: ArrayBuffer, offset: number) {
    this.v1.pack(buffer, offset);
    this.v2.pack(buffer, offset + 24);
    this.v3.pack(buffer, offset + 48);
    this.v4.pack(buffer, offset + 72);
  }
}

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

  public draw(texture: Texture2D, position: Vector2, color: Color): void {
    this.batchSprite(texture, position, color);
  }

  private batchSprite(
    texture: Texture2D,
    position: Vector2,
    color: Color,
    depth: number = 0
  ) {
    if (this.itemCount >= Batcher.MAX_SPRITES) {
      this.flush();
    }

    this.items[this.itemCount] = new BatchItem(
      texture,
      new VertexPositionColorUV(
        new Vector3(position.x, position.y, depth),
        color,
        new Vector2(0, 0)
      ),
      new VertexPositionColorUV(
        new Vector3(position.x, position.y - 1, depth),
        color,
        new Vector2(0, 1)
      ),
      new VertexPositionColorUV(
        new Vector3(position.x + 1, position.y, depth),
        color,
        new Vector2(1, 0)
      ),
      new VertexPositionColorUV(
        new Vector3(position.x + 1, position.y - 1, depth),
        color,
        new Vector2(1, 1)
      )
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
