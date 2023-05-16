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

    let sqlQueryParams = null;
    sqlQueryParams = Object.entries(req.query).map(([key, value]) => {
        if (key !== 'limiter')
            return `${key}='${value}'`;
    }).filter(param => param !== undefined);

    let query = '';
    sqlQueryParams.length === 0 ? query = '' : query = ` WHERE ${sqlQueryParams.join(' AND ')}`;

    const limiter = req.query.limiter ? ` LIMIT ${req.query.limiter}` : ' LIMIT 500';

    if (req.params.action === 'db-fetch') {
        const sql = `SELECT * FROM \`katek\`.\`test-500k-limes\`${query}${limiter}`;

        connection.query(sql, (error, results, fields) => {
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
