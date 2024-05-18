import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import doctormodel from './models/doctor-schema';
import AvailableTimeModel from './models/availableTime-table';
import patientsModel from './models/patient-schema';

dotenv.config();    
const app = express();

const PORT = process.env.port;
const DB = process.env.MONGO_URI;
//midlwear
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//routes
app.use('/doctors', require('./routes/Doctors-routes'));
app.use('/patients', require('./routes/patient-routes'));
app.use('/nurses', require('./routes/nurses-routes'));
app.use('/', require('./routes/common-routes'));






//connect to database
mongoose.connect(DB!).then(() => {
    console.log("Connected to MongoDB")

    //delete unique index
    /*mongoose.connection.collections["patients"]
      .dropIndex("reservationsRequests.code_1")
      .then(() => {
          console.log('Dropped index');
      })
      .catch((err) => {
          console.log('Failed to drop index:', err);
      });*/
    
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((err) => console.log(err));



