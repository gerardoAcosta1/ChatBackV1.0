import express from 'express';
import cors from 'cors';
import {initializeDatabase} from './utils/database.js';
import apiV1Routes from './routes/apiv1.routes.js';

initializeDatabase();

const app = express();

app.use(cors());
app.use(express.json());

apiV1Routes(app)
app.get('/', async (req, res) => {
   res.json({message: 'hola mundo'})
})

app.listen(8000, () => {
    console.log('listening on port 8000')
});
