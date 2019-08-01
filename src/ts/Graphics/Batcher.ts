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

export class Quad {
  public constructor(
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
  public projection: mat4 = mat4.create();
  public view: mat4 = mat4.create();

  private vertexBuffer: VertexBuffer;
  private indexBuffer: IndexBuffer;
  private textures: Texture2D[];
  private quads: Quad[];

  private spriteMaterial: SpriteMaterial;

  private drawing: boolean = false;

  private spritesCount: number = 0;

  static readonly MAX_SPRITES = 2048;
  static readonly MAX_VERTICES = Batcher.MAX_SPRITES * 4;
  static readonly MAX_INDICES = Batcher.MAX_SPRITES * 6;

  static readonly indexData: Uint16Array = Batcher.makeIndices();

  public constructor() {
    this.vertexBuffer = new VertexBuffer(VertexPositionColorUV.layout);
    this.indexBuffer = new IndexBuffer(Batcher.indexData);

    this.quads = new Array<Quad>(Batcher.MAX_SPRITES);
    this.textures = new Array<Texture2D>(Batcher.MAX_SPRITES);

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
    if (this.spritesCount >= Batcher.MAX_SPRITES) {
      this.flush();
    }
    this.quads[this.spritesCount] = new Quad(
      new VertexPositionColorUV(
        new Vector3(position.x, position.y, depth),
        Color.PURPLE,
        new Vector2(0, 1)
      ),
      new VertexPositionColorUV(
        new Vector3(position.x + 1, position.y, depth),
        Color.RED,
        new Vector2(1, 1)
      ),
      new VertexPositionColorUV(
        new Vector3(position.x + 1, position.y + 1, depth),
        Color.GREEN,
        new Vector2(1, 0)
      ),
      new VertexPositionColorUV(
        new Vector3(position.x, position.y + 1, depth),
        color,
        new Vector2(0, 0)
      )
    );

    this.textures[this.spritesCount] = texture;
    this.spritesCount++;
  }

  private setupBuffer() {
    const buffer = new ArrayBuffer(
      this.spritesCount * this.vertexBuffer.layout.stride * 4
    );
    for (let i = 0; i < this.spritesCount; i++) {
      this.quads[i].pack(buffer, i * 96);
    }
    this.vertexBuffer.setData(buffer);
    this.vertexBuffer.bind();
    let offset = 0;
    for (var i = 0; i < this.vertexBuffer.layout.elements.length; i++) {
      const elem = this.vertexBuffer.layout.elements[i];

      gl.enableVertexAttribArray(i);
      // This is really confusing, gl.vertexAttribPointer takes (index, SIZE, ...)
      // size in this case is NOT the size of the elements, but instead the number of components
      gl.vertexAttribPointer(
        i,
        elem.count,
        elem.type,
        elem.normalized,
        this.vertexBuffer.layout.stride,
        offset
      );
      offset += elem.count * elem.size;
    }
  }

  public flush() {
    if (this.spritesCount == 0) {
      return;
    }

    this.setupBuffer();

    this.spriteMaterial.MVP = this.transform;
    this.spriteMaterial.texture = this.textures[0];
    this.spriteMaterial.shader.use();
    this.spriteMaterial.use();

    this.indexBuffer.bind();
    gl.drawElements(gl.TRIANGLES, this.spritesCount * 6, gl.UNSIGNED_SHORT, 0);

    this.spritesCount = 0;
  }

  private static makeIndices(): Uint16Array {
    const indices = new Uint16Array(Batcher.MAX_INDICES);
    for (let i = 0, j = 0; i < Batcher.MAX_INDICES; i += 6, j += 4) {
      indices[i + 0] = j + 0;
      indices[i + 1] = j + 1;
      indices[i + 2] = j + 2;
      indices[i + 3] = j + 0;
      indices[i + 4] = j + 2;
      indices[i + 5] = j + 3;
    }
    return indices;
  }
}
