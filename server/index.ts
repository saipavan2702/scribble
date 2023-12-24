import express from "express";
import cors from "cors";
import { Server } from "socket.io";

const app = express();
app.use(express.json());
app.use(cors());

const server = app.listen(8080, () => console.log("connected"));

const io: Server = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

type Point = { x: number; y: number };

type DrawLine = {
  prevPoint: Point | null;
  currPoint: Point;
  color: string;
};

io.on("connection", (socket) => {
  socket.on("client-ready", () => {
    socket.broadcast.emit("get-canvas-state");
  });

  socket.on("draw-line", ({ prevPoint, currPoint, color }: DrawLine) => {
    socket.broadcast.emit("draw-line", { prevPoint, currPoint, color });
  });

  socket.on("canvas-state", (state) => {
    console.log("received canvas state");
    socket.broadcast.emit("canvas-state-from-server", state);
  });

  socket.on("clear", () => io.emit("clear"));
});
