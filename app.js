import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import employeeRoute from './api/routes/employeeRoute.js'
import fileUpload from 'express-fileupload';


const app = express();
const PORT = 5000;

mongoose.connect('mongodb+srv://omprakash:@cluster0.6mneyf0.mongodb.net/')

mongoose.connection.on('error',err=>{
    console.log("Connection Failed");
})

mongoose.connection.on('connected',connected=>{
    console.log("Connection Successfull");
})

app.use(fileUpload({
    useTempFiles:true
}))

app.use(cors());
app.use(morgan('dev'))

//responsible for parsing the incoming request bodies
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json());

app.use('/employee',employeeRoute)

app.listen(PORT, () => {
    console.log(`Server is running on port: http://localhost:${PORT}`);
});

export default app;
