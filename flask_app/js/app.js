let limitPerPage = 3; // Initialize limitPerPage as a global variable
let currentPage = 1;

function fetchData(page, limitPerPage) {
  fetch(`http://127.0.0.1:9000/api/business?page=${page}&limit=${limitPerPage}`)
    .then(response => {
      if (!response.ok) {
        throw Error("Error");
      }
      return response.json();
    })
    .then(data => {
      console.log(data);
      const items = data.items;
      const html = items
        .map(user => {
          return `
            <div class="card">
              <div class="card-image"><img class="img" src=${user.image_dir}></div>
              <div class="card-info">
                <h3>${user.name}</h3>  
                <p>${user.location}</p>
                <p>${user.price}$<p>
                <a href="#/view">
                  <button type="button" class="btn btn-sm btn-outline-secondary">View</button>
                </a> 
              </div>
            </div>
          `;
        })
        .join("");

      document.querySelector('.card-content').innerHTML = html;

      const totalPages = data.totalPages;

      // Update the pagination elements
      let paginationHTML = '';
      paginationHTML += `
        <li class="page-item previous-page ${currentPage === 1 ? 'disable' : ''}">
          <a class="page-link" href="#">Prev</a>
        </li>
      `;
      for (let i = 1; i <= totalPages; i++) {
        const activeClass = i === currentPage ? 'active' : '';
        paginationHTML += `<li class="page-item ${activeClass}"><a class="page-link" href="#">${i}</a></li>`;
      }
      paginationHTML += `
        <li class="page-item next-page ${currentPage === totalPages ? 'disable' : ''}">
          <a class="page-link" href="#">Next</a>
        </li>
      `;

      document.querySelector('.pagination').innerHTML = paginationHTML;
    })
    .catch(error => {
      console.log(error);
    });
}

function showPage(whichPage) {
  fetchData(whichPage, limitPerPage);
}

document.addEventListener('click', event => {
  if (event.target.matches('.pagination li a')) {
    event.preventDefault();
    const paginationLinks = document.querySelectorAll('.pagination li');

    if (event.target.textContent === 'Prev') {
      currentPage = Math.max(currentPage - 1, 1);
    } else if (event.target.textContent === 'Next') {
      currentPage = Math.min(currentPage + 1, paginationLinks.length - 2);
    } else {
      currentPage = Number(event.target.textContent);
    }

    showPage(currentPage);

    paginationLinks.forEach(link => {
      link.classList.remove('active');
    });

    paginationLinks[currentPage].classList.add('active');
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const limitSelect = document.querySelector('#limitSelect');

  limitSelect.addEventListener('change', event => {
    limitPerPage = parseInt(event.target.value);
    currentPage = 1;
    showPage(currentPage);
  });
});

showPage(currentPage);
