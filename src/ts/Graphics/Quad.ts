import { GeometryBuilder } from "./GeometryBuilder";
import { VertexPositionColorUV } from "./Vertex";
import { Vector3 } from "./Vector3";
import { Vector2 } from "./Vector2";
import { Color } from "./Color";

export const QUAD = new GeometryBuilder<VertexPositionColorUV>()
  .addQuad(
    new VertexPositionColorUV(
      new Vector3(0, 1, 0),
      Color.WHITE,
      new Vector2(0, 0)
    ),
    new VertexPositionColorUV(
      new Vector3(1, 1, 0),
      Color.WHITE,
      new Vector2(1, 0)
    ),
    new VertexPositionColorUV(
      new Vector3(0, 0, 0),
      Color.WHITE,
      new Vector2(0, 1)
    ),
    new VertexPositionColorUV(
      new Vector3(1, 0, 0),
      Color.WHITE,
      new Vector2(1, 1)
    )
  )
  .finalize();
