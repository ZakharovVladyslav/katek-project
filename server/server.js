import express from 'express';
import mysql from 'mysql';

const app = express();

app.use(express.static('public'));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '135794ee497531E',
    database: 'katek'
})

connection.connect();

app.get('/:action', (req, res) => {
    console.log(req.params);

    if (req.params.action === 'db-fetch') {
        connection.query(`SELECT * FROM \`katek\`.\`10k_lines\``, (error, results, fields) => {
            if (error)
                throw error;

            res.send(results);
        })
    }

    else if (req.params.action === 'fetch-query') {

    }
})

app.get('/')

app.listen(3000, () => console.log('Server started localhost:3000'));
