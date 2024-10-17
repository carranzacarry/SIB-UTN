const express = require('express');
const mysql = require('mysql2');
const path = require('path')
const app = express();
const port = 3000;

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'biblioteca_maindb'
});

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

app.get('/books', (req, res) => {
    const search = req.query.search || '';
    const category = req.query.category || '';
    const page = parseInt(req.query.page) || 1;
    const itemsPerPage = 30;
    const offset = (page - 1) * itemsPerPage;

    let sql = 'SELECT * FROM book_inventory WHERE 1=1';
    let params = [];

    if (search) {
        sql += ' AND (title LIKE ? OR author LIKE ?)';
        params.push(`%${search}%`, `%${search}%`);
    }

    if (category) {
        sql += ' AND category = ?';
        params.push(category);
    }

    sql += ' LIMIT ? OFFSET ?';
    params.push(itemsPerPage, offset);

    connection.query(sql, params, (error, results) => {
        if (error) throw error;

        connection.query('SELECT COUNT(*) AS total FROM books', (error, countResult) => {
            if (error) throw error;

            const totalItems = countResult[0].total;
            const totalPages = Math.ceil(totalItems / itemsPerPage);

            res.json({
                books: results,
                currentPage: page,
                totalPages: totalPages
            });
        });
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
