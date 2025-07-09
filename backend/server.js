import dotenv from "dotenv";
dotenv.config();
import app from "./src/app.js";
import { Server } from "socket.io";
import http from "http";


const httpServer = http.createServer(app);

const io = new Server(httpServer, {
    cors: { 
        origin: '*',
        methods: ['GET', 'POST']
    }
})

app.set('io', io);

io.on("connection", (socket) => {
    console.log("A user connected: ", socket.id);

    socket.on("disconnect", () => {
        console.log("Client disconnected: ", socket.id);
    })
})


const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})