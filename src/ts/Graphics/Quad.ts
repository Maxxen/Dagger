import { GeometryBuilder } from "./GeometryBuilder";
import { VertexPositionUV } from "./Vertex";
import { Vector3 } from "./Vector3";
import { Vector2 } from "./Vector2";

export const QUAD = new GeometryBuilder<VertexPositionUV>()
  .addQuad(
    new VertexPositionUV(new Vector3(0, 1, 0), new Vector2(0, 0)),
    new VertexPositionUV(new Vector3(1, 1, 0), new Vector2(1, 0)),
    new VertexPositionUV(new Vector3(0, 0, 0), new Vector2(0, 1)),
    new VertexPositionUV(new Vector3(1, 0, 0), new Vector2(1, 1))
  )
  .finalize();
