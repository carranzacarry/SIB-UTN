document.addEventListener('DOMContentLoaded', () => {
    const bookCatalog = document.getElementById('book-catalog');
    const paginationContainer = document.getElementById('pagination');
    const searchInput = document.getElementById('search-input');
    const itemsPerPageDropdown = document.getElementById('items-per-page'); // Dropdown for items per page
    let currentPage = 1;
    let itemsPerPage = parseInt(itemsPerPageDropdown.value); // Get initial items per page

    // Fetch books based on the current page, search term, and items per page
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

    // Render books on the page
    function renderBooks(books) {
        bookCatalog.innerHTML = ''; // Clear previous books
        books.forEach(book => {
            const bookElement = document.createElement('div');
            bookElement.classList.add('book');
            bookElement.innerHTML = `
                <div class="book-cover">
                    <img src="assets/img/cover-not-available.png" alt="${book.title}">
                </div>
                <div class="book-details">
                    <h3>${book.title}</h3>
                    <p>${book.author}</p>
                </div>
            `;
            bookCatalog.appendChild(bookElement);
        });
    }

    // Render pagination controls with dots and last page button
    function renderPagination(totalPages, page) {
        paginationContainer.innerHTML = ''; // Clear previous pagination

        // Left arrow with FontAwesome
        const leftArrow = document.createElement('button');
        leftArrow.innerHTML = '<i class="fas fa-angle-left"></i>';
        leftArrow.disabled = page === 1;
        leftArrow.addEventListener('click', () => {
            fetchBooks(page - 1);
        });
        paginationContainer.appendChild(leftArrow);

        // First page button
        const firstPageButton = document.createElement('button');
        firstPageButton.innerText = 1;
        if (page === 1) { // Add active class if on the first page
            firstPageButton.classList.add('active');
        }
        firstPageButton.addEventListener('click', () => {
            fetchBooks(1);
        });
        paginationContainer.appendChild(firstPageButton);

        if (page > 4) {
            // Add three dots after the first page if there are hidden pages
            const dots = document.createElement('span');
            dots.innerText = '...';
            paginationContainer.appendChild(dots);
        }

        // Add page numbers around the current page (2 before, 2 after)
        for (let i = Math.max(1, page - 2); i <= Math.min(totalPages, page + 2); i++) {
            if (i === 1 || i === totalPages) continue; // Skip the first and last pages as they are handled separately
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

        // Last page button with three dots before it (if applicable)
        if (page < totalPages - 3) {
            const dots = document.createElement('span');
            dots.innerText = '...';
            paginationContainer.appendChild(dots);
            
        }

        const lastPageButton = document.createElement('button');
        lastPageButton.innerText = totalPages;
        if (page === totalPages) { // Add active class if on the last page
            lastPageButton.classList.add('active');
        }
        lastPageButton.addEventListener('click', () => {
            fetchBooks(totalPages);
        });
        paginationContainer.appendChild(lastPageButton);

        // Right arrow with FontAwesome
        const rightArrow = document.createElement('button');
        rightArrow.innerHTML = '<i class="fas fa-angle-right"></i>';
        rightArrow.disabled = page === totalPages;
        rightArrow.addEventListener('click', () => {
            fetchBooks(page + 1);
        });
        paginationContainer.appendChild(rightArrow);
    }

    // Fetch books initially when page loads
    fetchBooks(currentPage);

    // Fetch books again when the user types in the search box
    searchInput.addEventListener('input', () => {
        fetchBooks(1); // Reset to page 1 when performing a new search
    });

    // Update the number of items per page when the dropdown value changes
    itemsPerPageDropdown.addEventListener('change', () => {
        itemsPerPage = parseInt(itemsPerPageDropdown.value);
        fetchBooks(1); // Fetch books for page 1 with the new items per page
    });
});
