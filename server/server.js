import express from 'express';
import mysql from 'mysql';

const app = express();

app.use(express.static('public'));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'lcashe',
    password: '135794ee497531E@',
    database: 'katek'
})

connection.connect();

app.get('/:fetch-action', (req, res) => {
    if (req.params['fetch-action'] === 'fetch') {
        connection.query(`SELECT * FROM \`katek\`.\`10k lines v.2\``, (error, results, fields) => {
            if (error)
                throw error;

            res.send(results);
        })
    }
})

connection.end();

app.listen(3000, () => console.log('Server started localhost:3000'));
