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

app.use(express.static(path.join(__dirname, 'public')));

// Fetch books with pagination and search by title, author, or ISBN
app.get('/books', (req, res) => {
    const currentPage = parseInt(req.query.page) || 1;
    const search = req.query.search || '';
    const itemsPerPage = parseInt(req.query.limit) || 18; 
    const offset = (currentPage - 1) * itemsPerPage;

    const sql = `
        SELECT book_id, title, author 
        FROM book_inventory 
        WHERE (title LIKE ? OR author LIKE ? OR (isbn LIKE ? AND isbn REGEXP '^[0-9]+$')) 
        LIMIT ? OFFSET ?
    `;
    const params = [`%${search}%`, `%${search}%`, `%${search}%`, itemsPerPage, offset];

    connection.query(sql, params, (error, results) => {
        if (error) throw error;

        connection.query(`
            SELECT COUNT(*) AS total 
            FROM book_inventory 
            WHERE (title LIKE ? OR author LIKE ? OR (isbn LIKE ? AND isbn REGEXP '^[0-9]+$'))`, 
            [`%${search}%`, `%${search}%`, `%${search}%`], 
            (error, countResult) => {
                if (error) throw error;

                const totalItems = countResult[0].total;
                const totalPages = Math.ceil(totalItems / itemsPerPage);

                res.json({
                    books: results,
                    currentPage,
                    totalPages
                });
            });
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});