"use client";
import { FC, useState, useEffect } from "react";
import { useDraw } from "@/hooks/useDraw";
import { ChromePicker } from "react-color";
import { getLine } from "@/utils/getLine";
import { io } from "socket.io-client";

const socket = io("http://localhost:8080");

interface Props {}

type DrawLineProps = {
  prevPoint: Point | null;
  currPoint: Point;
  color: string;
};

const Page: FC<Props> = ({}) => {
  const [color, setColor] = useState<string>("#000");
  const { canvasRef, onMouseDown, clear } = useDraw(createLine);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");

    socket.emit("client-ready");

    socket.on("get-canvas-state", () => {
      if (!canvasRef.current?.toDataURL()) return;
      console.log("sending canvas state");
      socket.emit("canvas-state", canvasRef.current.toDataURL());
    });

    socket.on("canvas-state-from-server", (state: string) => {
      console.log("I received the state");
      const img = new Image();
      img.src = state;
      img.onload = () => {
        ctx?.drawImage(img, 0, 0);
      };
    });

    socket.on("draw-line", ({ prevPoint, currPoint, color }: DrawLineProps) => {
      if (!ctx) return console.log("no ctx here");
      getLine({ prevPoint, currPoint, ctx, color });
    });

    socket.on("clear", clear);

    return () => {
      socket.off("draw-line");
      socket.off("get-canvas-state");
      socket.off("canvas-state-from-server");
      socket.off("clear");
    };
  }, [canvasRef]);

  function createLine({ prevPoint, currPoint, ctx }: Draw) {
    socket.emit("draw-line", { prevPoint, currPoint, color });
    getLine({ prevPoint, currPoint, ctx, color });
  }

  return (
    <main className="w-screen h-screen flex justify-center items-center bg-white">
      <div className="flex flex-col gap-10 pr-10">
        <ChromePicker color={color} onChange={(e) => setColor(e.hex)} />
        <button
          type="button"
          className="p-2 rounded-md border border-black"
          onClick={() => socket.emit("clear")}
        >
          Clear canvas
        </button>
      </div>
      <canvas
        ref={canvasRef}
        width={500}
        height={500}
        onMouseDown={onMouseDown}
        className="border border-black rounded-md"
      />
    </main>
  );
};
export default Page;
