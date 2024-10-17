function updatePagination(currentPage, totalPages, startPage, endPage) {
    const pageNumbersDiv = document.getElementById('pageNumbers');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    // Clear existing page numbers
    pageNumbersDiv.innerHTML = '';

    // Show the previous button only if the current page is greater than 1
    prevBtn.disabled = currentPage === 1;

    // Add pagination numbers
    for (let page = startPage; page <= endPage; page++) {
        const pageButton = document.createElement('button');
        pageButton.className = 'page-button';
        pageButton.innerText = page;
        
        // Highlight the current page
        if (page === currentPage) {
            pageButton.classList.add('active');
        }

        // Add event listener for clicking on the page numbers
        pageButton.addEventListener('click', () => {
            loadPage(page);
        });

        pageNumbersDiv.appendChild(pageButton);
    }

    // Show the next button only if the current page is less than the total number of pages
    nextBtn.disabled = currentPage === totalPages;

    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            loadPage(currentPage - 1);
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentPage < totalPages) {
            loadPage(currentPage + 1);
        }
    });
}

function loadPage(page) {
    fetch(`/books?page=${page}`)
        .then(response => response.json())
        .then(data => {
            // Render the books on the page (you need to implement the renderBooks function)
            renderBooks(data.books);
            
            // Update the pagination UI
            updatePagination(data.currentPage, data.totalPages, data.startPage, data.endPage);
        })
        .catch(error => console.error('Error fetching page:', error));
}

// Load the first page by default when the page loads
document.addEventListener('DOMContentLoaded', () => {
    loadPage(1);
});
