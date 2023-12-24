import { useEffect, useRef, useState } from "react";

export const useDraw = (
  onDraw: ({ ctx, currPoint, prevPoint }: Draw) => void
) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prevPoint = useRef<null | Point>(null);

  const [mouseDown, setMouseDown] = useState(false);
  const onMouseDown = () => setMouseDown(true);

  const clear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!mouseDown) return;

      const currPoint = findPoint(e);
      const ctx = canvasRef.current?.getContext("2d");

      if (!ctx || !currPoint) return;

      onDraw({ ctx, currPoint, prevPoint: prevPoint.current });
      prevPoint.current = currPoint;
    };

    const findPoint = (e: MouseEvent) => {
      const cvs = canvasRef.current;
      if (!cvs) return;

      const rect = cvs.getBoundingClientRect();

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      return { x, y };
    };

    const mouseUpHandler = () => {
      setMouseDown(false);
      prevPoint.current = null;
    };

    canvasRef.current?.addEventListener("mousemove", handler);
    window.addEventListener("mouseup", mouseUpHandler);

    return () => {
      canvasRef.current?.removeEventListener("mousemove", handler);
      window.removeEventListener("mouseup", mouseUpHandler);
    };
  }, [onDraw]);

  return { canvasRef, onMouseDown, clear };
};
