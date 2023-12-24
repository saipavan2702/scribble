type DrawLineProps = Draw & {
  color: string;
};

export const getLine = ({
  prevPoint,
  currPoint,
  ctx,
  color,
}: DrawLineProps) => {
  const { x: currX, y: currY } = currPoint;
  const lineColor = color;
  const lineWidth = 5;

  let startPoint = prevPoint ?? currPoint;
  ctx.beginPath();
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = lineColor;
  ctx.moveTo(startPoint.x, startPoint.y);
  ctx.lineTo(currX, currY);
  ctx.stroke();

  ctx.fillStyle = lineColor;
  ctx.beginPath();
  ctx.arc(startPoint.x, startPoint.y, 2, 0, 2 * Math.PI);
  ctx.fill();
};
