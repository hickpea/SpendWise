//!imports
import 'dotenv/config';
import {dbConnect} from './config/database.js'
import express from 'express';
import {router} from './routes/routes.js'
// "?" for blue, "*" for green, "!" for red,:" TODO" for yellow
const app=express()
const PORT = process.env.PORT || 3000;
//?db connection
dbConnect()
//*middleware


app.use(express.json())
app.use(express.static('public'))
app.set('view engine', 'ejs')
app.use('/', router)
app.use('/api', router)
//TODO:server
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}!`);
});

