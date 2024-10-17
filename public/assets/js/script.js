document.addEventListener('DOMContentLoaded', () => {
    const bookCatalog = document.getElementById('book-catalog');
    const paginationContainer = document.getElementById('pagination');
    const searchInput = document.getElementById('search-input');
    const itemsPerPageDropdown = document.getElementById('items-per-page');
    let currentPage = 1;
    let itemsPerPage = parseInt(itemsPerPageDropdown.value);

    function fetchBooks(page = 1) {
        const searchQuery = searchInput.value || '';
        
        fetch(`/books?page=${page}&limit=${itemsPerPage}&search=${searchQuery}`)
            .then(response => response.json())
            .then(data => {
                renderBooks(data.books);
                renderPagination(data.totalPages, page);
            })
            .catch(error => {
                console.error('Error fetching books:', error);
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

    function renderBooks(books) {
        bookCatalog.innerHTML = '';
        books.forEach(book => {
            const bookElement = document.createElement('div');
            bookElement.classList.add('book');
            bookElement.innerHTML = `
            <a href="book.html?book_id=${book.book_id}" class="book-link">
                    <div class="book-cover">
                    <img src="assets/img/cover-not-available.png" alt="${book.title}">
                    </div>
                    <div class="book-details">
                        <h3>${capitalizeText(book.title)}</h3>
                        <p>${capitalizeText(reformatAuthorName(book.author))}</p>
                    </div>
                </a>
            `;
            bookCatalog.appendChild(bookElement);
        });
    }

    function renderPagination(totalPages, page) {
        paginationContainer.innerHTML = '';

        if (totalPages <= 1) return;

        const leftArrow = document.createElement('button');
        leftArrow.innerHTML = '<i class="fas fa-angle-left"></i>';
        leftArrow.disabled = page === 1;
        leftArrow.addEventListener('click', () => {
            fetchBooks(page - 1);
        });
        paginationContainer.appendChild(leftArrow);

        const firstPageButton = document.createElement('button');
        firstPageButton.innerText = 1;
        if (page === 1) {
            firstPageButton.classList.add('active');
        }
        firstPageButton.addEventListener('click', () => {
            fetchBooks(1);
        });
        paginationContainer.appendChild(firstPageButton);

        if (page > 4) {
            const dots = document.createElement('span');
            dots.innerHTML = '<i class="fa-solid fa-ellipsis"></i>';
            paginationContainer.appendChild(dots);
        }

        for (let i = Math.max(1, page - 2); i <= Math.min(totalPages, page + 2); i++) {
            if (i === 1 || i === totalPages) continue;
            const pageButton = document.createElement('button');
            pageButton.innerText = i;
            if (i === page) {
                pageButton.classList.add('active');
            }
            pageButton.addEventListener('click', () => {
                fetchBooks(i);
            });
            paginationContainer.appendChild(pageButton);
        }

        if (page < totalPages - 3) {
            const dots = document.createElement('span');
            dots.innerHTML = '<i class="fa-solid fa-ellipsis"></i>';
            paginationContainer.appendChild(dots);
            
        }

        const lastPageButton = document.createElement('button');
        lastPageButton.innerText = totalPages;
        if (page === totalPages) {
            lastPageButton.classList.add('active');
        }
        lastPageButton.addEventListener('click', () => {
            fetchBooks(totalPages);
        });
        paginationContainer.appendChild(lastPageButton);

        const rightArrow = document.createElement('button');
        rightArrow.innerHTML = '<i class="fas fa-angle-right"></i>';
        rightArrow.disabled = page === totalPages;
        rightArrow.addEventListener('click', () => {
            fetchBooks(page + 1);
        });
        paginationContainer.appendChild(rightArrow);
    }

    fetchBooks(currentPage);

    searchInput.addEventListener('input', () => {
        fetchBooks(1);
    });

    itemsPerPageDropdown.addEventListener('change', () => {
        itemsPerPage = parseInt(itemsPerPageDropdown.value);
        fetchBooks(1);
    });
});
