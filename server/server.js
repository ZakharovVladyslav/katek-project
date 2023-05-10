import express from 'express';
import mysql from 'mysql';

const app = express();

app.use(express.static('public'));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'lcashe',
    password: '135794ee497531E@',
    database: 'katek'
});

connection.connect((err) => {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }

    console.log('connected as id ' + connection.threadId);
});

app.get('/:action', (req, res) => {
    if (req.params.action === 'load-fetch') {
        res.send({ name: 'hi' })
    }
});

connection.end();

app.listen(3000, () => console.log('Server started localhost:3000'));
