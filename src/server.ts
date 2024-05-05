import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();    
const app = express();

const PORT = process.env.port;
const DB = process.env.MONGO_URI;
//midlwear
app.use(express.json());
app.use(express.urlencoded({extended: false}));

//routes
app.use('/doctors', require('./routes/Doctors-routes'));
app.use('/patients', require('./routes/patient-routes'));
app.use('/nurses', require('./routes/nurses-routes'));
app.use('/', require('./routes/common-routes'));

//connect to database
mongoose.connect(DB!).then(() => { 
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((err) => console.log(err));



