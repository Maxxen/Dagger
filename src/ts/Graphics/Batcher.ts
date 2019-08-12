import { VertexBuffer } from "./VertexBuffer";
import { IndexBuffer } from "./IndexBuffer";
import { VertexPositionColorUV } from "./Vertex";
import { gl } from "./gl";
import { Sprite } from "./Sprite";
import { Material } from "./Material";

export class Batcher {
  private dataBuffer: ArrayBuffer;
  private vertexBuffer: VertexBuffer;
  private indexBuffer: IndexBuffer;
  private items: Sprite[];
  private itemCount: number = 0;

  private drawing: boolean = false;

  static readonly MAX_SPRITES = 2048;
  static readonly MAX_VERTICES = Batcher.MAX_SPRITES * 4;
  static readonly MAX_INDICES = Batcher.MAX_SPRITES * 6;

  static readonly indexData: Uint16Array = Batcher.makeIndices();

  public constructor() {
    this.vertexBuffer = new VertexBuffer(VertexPositionColorUV.layout);
    this.indexBuffer = new IndexBuffer(Batcher.indexData);
    this.items = new Array<Sprite>(Batcher.MAX_SPRITES);
    this.dataBuffer = new ArrayBuffer(
      Batcher.MAX_SPRITES * 4 * this.vertexBuffer.layout.stride
    );
  }

  public begin(): void {
    if (this.drawing) {
      throw "Cannot call begin without first calling end!";
    }

    this.drawing = true;
  }

  public end() {
    if (!this.drawing) {
      throw "Cannot call end without first calling begin!";
    }
    this.drawing = false;
    this.flush();
  }

  public batch(sprite: Sprite): void {
    if (this.itemCount >= Batcher.MAX_SPRITES) {
      this.flush();
    }
    this.items[this.itemCount] = sprite;
    this.itemCount++;
  }

  private setupBuffers() {
    for (let i = 0; i < this.itemCount; i++) {
      this.items[i].pack(this.dataBuffer, i * 96);
    }
    this.vertexBuffer.setData(this.dataBuffer);
    this.vertexBuffer.bind();
    this.vertexBuffer.applyAttribs();
    this.indexBuffer.bind();
  }

  public flush() {
    if (this.itemCount == 0) {
      return;
    }

    this.setupBuffers();

    let material: Material = this.items[0].material;
    let offset: number = 0;

    // Group sprites with the same material and draw them with a single indexed call
    for (let i = 1; i < this.itemCount; i++) {
      if (this.items[i].material != material) {
        this.drawSprites(material, offset, i - offset);
        material = this.items[i].material;
        offset = i;
      }
    }

    this.drawSprites(material, offset, this.itemCount - offset);
    this.itemCount = 0;
  }

  private drawSprites(material: Material, first: number, count: number) {
    // Ugly ugly ugly
    material.shader.use();
    material.bind();
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
