import { io } from "socket.io-client";

const BACKEND_URL = (import.meta as any).env.VITE_BACKEND_URL as string;

export const socket = io(BACKEND_URL, {
  transports: ["websocket"],
});
