import express, { Request, Response } from 'express';
import mysql from 'mysql';
import cors from 'cors';
import chalk from 'chalk';

const app = express();
const PORT = 3000;

app.use(cors());

const connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '123456789',
	database: 'katek'
});

connection.connect((err) => {
	if (err)
		console.log(err);

	console.log(`Connected as 'id':${connection.threadId}`);
});

app.get('/:action', (req: Request, res: Response) => {
	console.log(chalk.red('_____________________________________________________________________________________________'))
	console.log(chalk.green(req.originalUrl));

	const limiter = req.query.limiter;

	let dateQuery = '';
	let query = '';
	const keysToAvoid = ['firstDate', 'secondDate', 'dateOption', 'fullTableHeaders', 'limiter'];

	const sqlQueryParams = Object.entries(req.query).map(([key, value]) => {
		if (!keysToAvoid.includes(key))
			return `${key}='${value}'`;
	}).filter(param => param !== undefined);

	if (req.query.firstDate && req.query.secondDate) {
		dateQuery += `${req.query.dateOption} BETWEEN STR_TO_DATE('${req.query.firstDate}', '%Y-%m-%d %H:%i.%s.%f') AND STR_TO_DATE('${req.query.secondDate}', '%Y-%m-%d %H:%i.%s.%f')`;
	}

	if (sqlQueryParams.length === 0 && dateQuery !== '') {
		console.log(chalk.red('\ncase: sqlQueryParams.length === 0 && dateQuery !== ""'));
		query = ` WHERE ${dateQuery}`;
	}
	else if (sqlQueryParams.length !== 0 && dateQuery === '') {
		console.log(chalk.red('\ncase: sqlQueryParams.length !== 0 && dateQuery === ""'));
		query = ` WHERE ${sqlQueryParams.join(' AND ')}`;
	}
	else if (sqlQueryParams.length !== 0 && dateQuery !== '') {
		console.log(chalk.red('\ncase: sqlQueryParams.length !== 0 && dateQuery !== ""'));
		query = ` WHERE ${dateQuery} AND ${sqlQueryParams.join(' AND ')}`;
	}

	if (req.params.action === 'load-fetch') {
		const sql = `SELECT * FROM \`katek\`.\`test-500k-limes\` LIMIT 1000`;

		console.log(chalk.cyan(sql));

		connection.query(sql, (error, results) => {
			if (error)
				console.log(error);

			res.send(results);
		});
	} else if (req.params.action === 'db-fetch') {

		console.log(req.query);

		const sql = `SELECT * FROM \`katek\`.\`test-500k-limes\`${query} LIMIT ${limiter}`;

		console.log(chalk.cyan(sql));

		connection.query(sql, (error, results) => {
			if (error)
				console.log(error);

			res.send(results);
		});
	} else if (req.params.action === 'get-countpass') {
		const sql = `SELECT \`CountPass\` FROM \`katek\`.\`test-500k-limes\`${query}`;

		console.log(chalk.cyan(sql));

		connection.query(sql, (error, results) => {
			if (error)
				console.log(error);

			res.send(results);
		});
	} else if (req.params.action === 'full-table-pagination') {
		const headers: string[] = req.query.fullTableHeaders as string[];

		const sql = `SELECT ${headers} FROM \`katek\`.\`test-500k-limes\` LIMIT ${limiter}`;

		console.log(chalk.cyan(sql));

		connection.query(sql, (error, results) => {
			if (error)
				console.log(error);

			res.send(results);
		});
	}
});

app.listen(PORT, () => console.log(`Server started localhost:${PORT}`));
