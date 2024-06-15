import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import rateLimiter from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors';
import path from 'path';
import http from "http"; 
import socketIo from "socket.io";
import { Server } from "socket.io";


dotenv.config();    
const app = express();

const PORT = process.env.port;
const DB = process.env.MONGO_URI;

// to use
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use("/images", express.static(path.join(__dirname, "images")));


//security
//rate limiter
/*app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  })
);*/
//helmet
/*app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "trusted-cdn.com"],
    },
  })
);
//helmet.js
app.use(helmet());
//cors
const corsOptions = {
  origin: "http://your-trusted-domain.com",
};

app.use(cors(corsOptions));*/



//routes
app.use('/admins', require('./routes/admin-routes'));
app.use('/doctors', require('./routes/doctors-routes'));
app.use('/patients', require('./routes/patient-routes'));
app.use('/nurses', require('./routes/nurses-routes'));
app.use('/', require('./routes/common-routes'));



const server = http.createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("requestAccepted", (data) => {
    // Broadcast the event to all clients
    io.sockets.emit("requestAccepted", data);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});


//connect to databaseconst 
mongoose
  .connect(DB!)
  .then(async () => {
    console.log("Connected to MongoDB");
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => console.log(err));








  //delete unique index
  /*mongoose.connection.collections["nurses"]
      .dropIndex("location_1")
      .then(() => {
          console.log('Dropped index');
      })
      .catch((err) => {
          console.log('Failed to drop index:', err);
      });*/

//check indexes
      /*const indexes = await nurseModel.collection.getIndexes();
        console.log(indexes);*/