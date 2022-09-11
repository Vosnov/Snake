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
      <canvas width={800} height={800} ref={canvasRef}></canvas>
    </div>
  )
}

