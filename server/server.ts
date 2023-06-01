import express from 'express';
import mysql from 'mysql';

const app = express();
const PORT = 3000;

app.use(express.static('public'));

const connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '135794ee497531E',
	database: 'katek'
});

connection.connect();

app.get('/:action', (req, res) => {
	let dateQuery = '';
	let query = '';
	const keysToAvoid = ['firstDate', 'secondDate', 'dateOption'];


	const sqlQueryParams = Object.entries(req.query).map(([key, value]) => {
		if (!keysToAvoid.includes(key))
			return `${key}='${value}'`;
	}).filter(param => param !== undefined);

	if (req.query.firstDate && req.query.secondDate)
		dateQuery += `${req.query.dateOption}
        BETWEEN STR_TO_DATE('${req.query.firstDate}', '%Y-%m-%d %H:%i.%s.%f')
        AND STR_TO_DATE('${req.query.secondDate}', '%Y-%m-%d %H:%i.%s.%f')`;

	if (sqlQueryParams.length === 0 && dateQuery !== '') {
		console.log('case: sqlQueryParams.length === 0 && dateQuery !== ""');
		query = ` WHERE ${dateQuery}`;
	}
	else if (sqlQueryParams.length !== 0 && dateQuery === '') {
		console.log('case: sqlQueryParams.length !== 0 && dateQuery === ""');
		query = ` WHERE ${sqlQueryParams.join(' AND ')}`;
	}
	else if (sqlQueryParams.length !== 0 && dateQuery !== '') {
		console.log('case: sqlQueryParams.length !== 0 && dateQuery !== ""');
		query = ` WHERE ${dateQuery} AND ${sqlQueryParams.join(' AND ')}`;
	}

	if (req.params.action === 'load-fetch') {
		const sql = 'SELECT * FROM `katek`.`test-500k-limes` LIMIT 1000';

		console.log(sql);

		connection.query(sql, (error, results) => {
			if (error)
				console.log(error);

			res.send(results);
		});
	} else if (req.params.action === 'db-fetch') {
		const sql = `SELECT * FROM \`katek\`.\`test-500k-limes\`${query} LIMIT 1000`;

		console.log(sql);

		connection.query(sql, (error, results) => {
			if (error)
				console.log(error);

			res.send(results);
		});
	} else if (req.params.action === 'get-countpass') {
		const sql = `SELECT \`CountPass\` from \`katek\`.\`test-500k-limes\`${query}`;

		console.log(sql);

		connection.query(sql, (error, results) => {
			if (error)
				console.log(error);

			res.send(results);
		});
	}
});

app.get('/');

app.listen(PORT, () => console.log(`Server started localhost:${PORT}`));
