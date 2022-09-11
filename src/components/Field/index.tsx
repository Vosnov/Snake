import React, { FC, useEffect, useRef, useState } from "react";
import { Field as FieldClass} from "../../utils";

export const Field: FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hasField, setHasField] = useState(false)

  useEffect(() => {
    if (canvasRef.current !== null && !hasField) {
      console.log('hello', canvasRef.current, hasField)
      new FieldClass(canvasRef.current)
      setHasField(true)
    }
  }, [canvasRef, hasField])

  return (
    <div>
      <canvas width={400} height={400} ref={canvasRef}></canvas>
    </div>
  )
}

