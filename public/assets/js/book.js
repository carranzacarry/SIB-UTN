const params = new URLSearchParams(window.location.search);
const bookId = params.get('book_id');

function capitalizeText(text) {
    return text.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
}

function reformatAuthorName(author) {
    const [lastName, firstName] = author.split(',').map(name => name.trim());
    return `${firstName} ${lastName}`
}

function fetchBookDetails(bookId) {
    fetch(`/book/${bookId}`)
        .then(response => response.json())
        .then(book => {
            displayBookDetails(book);
        })
        .catch(error => {
            console.error('Error fetching book details:', error);
        });
}

function displayBookDetails(book) {
    const bookDetailsDiv = document.getElementById('book-details');
    bookDetailsDiv.innerHTML = `
        <div class="book-detail-cover">
            <img src="assets/img/cover-not-available.png" alt="${book.title}">
        </div>
        <div class="book-detail-info">
            <h2>${capitalizeText(book.title)}</h2>
            <p>Por: ${capitalizeText(reformatAuthorName(book.author))}</p>
            <br>
            <p>ISBN: ${book.isbn}</p>
            <p>Edición: ${book.edition}</p>
            <p>Año: ${book.year}</p>
            <p>Copias disponibles: ${book.available_copies}/${book.total_copies}</p>
        </div>
    `;
}

fetchBookDetails(bookId);
