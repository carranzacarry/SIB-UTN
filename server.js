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

app.get('/book-info/:book_id', (req, res) => {
    const bookId = req.params.book_id;

    const query = 'SELECT * FROM book_inventory WHERE book_id = ?';
    connection.query(query, [bookId], (error, results) => {
        if (error) {
            res.status(500).send('Error fetching book details');
        } else {
            if (results.length > 0) {
                res.json(results[0]);
            } else {
                res.status(404).send('Book not found');
            }
        }
    });
});

// Route to get the latest books
app.get('/latest-books', (req, res) => {
    const query = 'SELECT * FROM books ORDER BY created_at DESC LIMIT 5'; // Fetch 5 latest books based on creation date
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error fetching latest books' });
        }
        res.json(results); // Return latest books as JSON
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});