document.addEventListener('DOMContentLoaded', () => {
    const bookCatalog = document.getElementById('book-catalog');  // Correct reference
    const paginationContainer = document.getElementById('pagination');
    let currentPage = 1;

    // Fetch books based on the current page
    function fetchBooks(page = 1) {
        fetch(`/books?page=${page}`)
            .then(response => response.json())
            .then(data => {
                renderBooks(data.books);
                renderPagination(data.totalPages, page);
            })
            .catch(error => {
                console.error('Error fetching books:', error);
            });
    }

    // Render books on the page
    function renderBooks(books) {
        bookCatalog.innerHTML = ''; // Clear previous books
        books.forEach(book => {
            const bookElement = document.createElement('div');
            bookElement.classList.add('book-item');
            bookElement.innerHTML = `
                <div class="book-cover">
                    <img src="${book.cover}" alt="${book.title}">
                </div>
                <div class="book-details">
                    <h3>${book.title}</h3>
                    <p>${book.author}</p>
                </div>
            `;
            bookCatalog.appendChild(bookElement);
        });
    }

    // Render pagination controls
    function renderPagination(totalPages, page) {
        paginationContainer.innerHTML = ''; // Clear previous pagination

        const leftArrow = document.createElement('button');
        leftArrow.innerHTML = '<i class="fa-solid fa-angle-left"></i>';
        leftArrow.classList.add('page-arrow');
        leftArrow.disabled = page === 1;
        leftArrow.addEventListener('click', () => {
            fetchBooks(page - 1);
        });
        paginationContainer.appendChild(leftArrow);

        // Add page numbers around the current page
        for (let i = Math.max(1, page - 2); i <= Math.min(totalPages, page + 2); i++) {
            const pageButton = document.createElement('button');
            pageButton.classList.add('page-button');
            pageButton.innerText = i;
            if (i === page) {
                pageButton.classList.add('active');
            }
            pageButton.addEventListener('click', () => {
                fetchBooks(i);
            });
            paginationContainer.appendChild(pageButton);
        }

        const rightArrow = document.createElement('button');
        rightArrow.innerHTML = '<i class="fa-solid fa-angle-right"></i>';
        rightArrow.classList.add('page-arrow');
        rightArrow.disabled = page === totalPages;
        rightArrow.addEventListener('click', () => {
            fetchBooks(page + 1);
        });
        paginationContainer.appendChild(rightArrow);
    }

    // Initialize fetching of books on page load
    fetchBooks(currentPage);
});
