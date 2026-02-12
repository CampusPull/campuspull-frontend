import { io } from "socket.io-client";
import {API_BASE_URL} from "./utils/api";

const SOCKET_URL = API_BASE_URL.replace("/api", "");

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  timeout: 10000,
  transports: ["websocket"],
  withCredentials: true, // Add this to match the backend
});