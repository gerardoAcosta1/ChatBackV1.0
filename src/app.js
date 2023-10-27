import express from 'express';
import cors from 'cors';
import {initializeDatabase} from './utils/database.js';
import apiV1Routes from './routes/apiv1.routes.js';
import createConnections from './sockets/connectSocket.js';

initializeDatabase();

const app = express();

app.use(cors());
app.use(express.json());

const server = createConnections(app);
apiV1Routes(app)
app.get('/', async (req, res) => {
   res.json({message: 'hola mundo'})
})

server.listen(8000, () => {
    console.log('listening on port 8000')
});
