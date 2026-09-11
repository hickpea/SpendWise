import mongoose from "mongoose";


function dbConnect(){
    mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log('Database connected successfully');
    })
    .catch((error) => {
        console.error('Database connection failed:', error.message);
    });
}
export {dbConnect}