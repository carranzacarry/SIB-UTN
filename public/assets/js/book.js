const params = new URLSearchParams(window.location.search);
const bookId = params.get('book_id');

function fetchBookDetails(bookId) {
    fetch(`/book-info/${bookId}`)
        .then(response => response.json())
        .then(book => {
            displayBookDetails(book);
        })
        .catch(error => {
            console.error('Error fetching book details:', error);
        });
}

function capitalizeText(text) {
    return text.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
}

function reformatAuthorName(author) {
    if (author.includes(',')) {
        const [lastName, firstName] = author.split(',').map(name => name.trim());
        return `${firstName} ${lastName}`
    }
    return author;
}

function getOrdinalNumber(edition) {
    if(edition === 0){
        edition = 1;
    };

    const suffixes = {
        1: 'ra',
        2: 'da',
        3: 'ra',
        4: 'ta',
        5: 'ta',
        6: 'ta',
        7: 'ma',
        8: 'va',
        9: 'na',
        0: 'ma'
    };

    const lastDigit = edition % 10;

    ordinalNumber = edition + suffixes[lastDigit];

    return ordinalNumber;
}

function displayBookDetails(book) {
    const bookDetailsDiv = document.getElementById('book-details');
    bookDetailsDiv.innerHTML = `
        <div class="book-detail-cover">
            <!-- <img src="assets/img/cover-not-available.png" alt="${book.title}"> -->
        </div>
        <div class="book-detail-cover-blank">
            <div class="container">
                <div class="book-cover-blank-text">
                    <span class="cover-blank-title">${capitalizeText(book.title)}</span>
                    <span class="cover-blank-author">${capitalizeText(reformatAuthorName(book.author))}</span>
                </div>
            </div>
        </div>
        <div class="book-detail-info">
            <h2>${capitalizeText(book.title)}</h2>
            <h3>
                <span class="book-tags">Por:</span>
                <span class="book-info">${capitalizeText(reformatAuthorName(book.author))}</span>
            </h3>
            <br>
            <ul>
                <li>
                    <span class="book-tags">ISBN:</span>
                    <span class="book-info">${book.isbn}</span>
                </li>
                <li>
                    <span class="book-tags">Edición:</span>
                    <span class="book-info">${getOrdinalNumber(book.edition)} Edición</span>
                </li>
                <li>
                    <span class="book-tags">Año:</span>
                    <span class="book-info">${book.year}</span>
                </li>
                <li>
                    <span class="book-tags">Disponibles:</span>
                    <span class="book-info">${book.available_copies} / ${book.total_copies}</span>
                </li>
            </ul>
        </div>
    `;
}

fetchBookDetails(bookId);
