import dotenv from "dotenv";
dotenv.config();
import app from "./src/app.js";
import http from "http";
import setupSocket from "./src/socket/index.js";

const httpServer = http.createServer(app);

const io = setupSocket(httpServer);


app.set('io', io);


const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})