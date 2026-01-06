import express from 'express';
import router from './router';

const app = express();

app.use(express.json());
app.get('/ping', (req, res) => {
    res.send('pong');
});
app.use('/', router);
export default app;
