import io from "socket.io-client";

export const socket = io(import.meta.env.VITE_API_URL, {
    autoConnect: true,
    transports: ["websocket"],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 20000,
})