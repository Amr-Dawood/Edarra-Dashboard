import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import mongoose from 'mongoose';
import router from "../router";

const app = express();

app.use(cors({
    credentials: true,
}));


app.use(compression());
app.use(bodyParser.json());
app.use(cookieParser());

const server = http.createServer(app);

server.listen(8080, () => {
    console.log('server running on  http://localhost:8080');
});



const MONGO_URL = 'mongodb+srv://adawood:6MytNTKbQLVdNnYL@cluster0.a0zqkph.mongodb.net/?retryWrites=true&w=majority'


mongoose.Promise = Promise;
mongoose.connect(MONGO_URL);
mongoose.connection.on('error', (error: Error) => console.log(error));


app.use('/', router())