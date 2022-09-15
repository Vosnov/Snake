import React, { ChangeEventHandler, FC, useCallback, useEffect, useRef, useState } from "react";
import { Field as FieldClass} from "../../utils";

export const Field: FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [field, setField] = useState<FieldClass>()
  const [cSize, setCSize] = useState(400);
  const [fSize, setFSize] = useState(10)
  const [speed, setSpeed] = useState(60)
  const [showPath, setShowPath] = useState(false)
  const [isPlay, setIsPlay] = useState(true)

  useEffect(() => {
    if (canvasRef.current !== null) {
      const field = new FieldClass(canvasRef.current, fSize)
      setField(field)
      return () => {
        field.clear()
      }
    }
  }, [canvasRef, fSize])

  useEffect(() => {
    field?.changeSpeed(speed)
  }, [speed, field])

  useEffect(() => {
    if (field) field.showPath = showPath
  }, [showPath, field])

  const canvasSizeChange = useCallback<ChangeEventHandler<HTMLInputElement>>((e) => {
    setCSize(parseInt(e.target.value))
  }, [])

  const fieldSizeChange = useCallback<ChangeEventHandler<HTMLInputElement>>(e => {
    setFSize(parseInt(e.target.value))
  }, []) 

  const speedChange = useCallback<ChangeEventHandler<HTMLInputElement>>(e => {
    setSpeed(parseInt(e.target.value))
  }, []) 

  const showPathChange =  useCallback<ChangeEventHandler<HTMLInputElement>>(e => {
    setShowPath(e.target.checked)
  }, []) 

  const onPlay = useCallback(() => {
    setIsPlay(!isPlay)
  }, [isPlay])

  useEffect(() => {
    if (isPlay) {
      field?.setInterval(speed)
    } else {
      field?.clear()
    }
  }, [isPlay, speed, field])

  return (
    <div className="wrapper">
      <div className="inputs">
        <label htmlFor="canvasSize">Canvas Size:</label>
        <input id="canvasSize" onChange={canvasSizeChange} value={cSize} type="range" min={0} max={2000} />

        <label htmlFor="countV">Vertex Count:</label>
        <input id="countV" onChange={fieldSizeChange} value={fSize} type="range" step={2} min={4} max={60} />

        <label htmlFor="speed">Speed:</label>
        <input id="speed" onChange={speedChange} value={speed} type="range" min={4} max={120} />

        <label htmlFor="path">Show Path:</label>
        <input id="path" onChange={showPathChange} checked={showPath} type="checkbox" />

        <button onClick={onPlay}>{isPlay ? 'Stop' : 'Play'}</button>
      </div>
      <canvas width={cSize} height={cSize} ref={canvasRef}></canvas>
    </div>
  )
}

