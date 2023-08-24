let limitPerPage; // The default value will be provided by the API
let currentPage; // The default value will be provided by the API

function fetchData(page, limitPerPage) {
  $.ajax({
    url: `/api/business`,
    type: "GET",
    data: {
      page: page,
      limit: limitPerPage
    },
    success: function(data) {
      currentPage = data.page; // Update currentPage with the value from the API response
      updatePagination(data.items_per_page); // Update the pagination links
      updateCardDisplay(data.data); // Update the card display
      updateCardDisplay(data.data);
    },
    error: function(xhr, textStatus, errorThrown) {
      console.log(errorThrown);
      // Display an error message on the page
      $('.error-message').text("Error fetching data from the API.").show();
    }
  });
}

function updatePagination(items_per_page) {
  let paginationHTML = '';
  paginationHTML += `
    <li class="page-item previous-page ${currentPage === 1 ? 'disabled' : ''}">
      <a class="page-link" href="#">Prev</a>
    </li>
  `;
  for (let i = 1; i <= items_per_page; i++) {
    const activeClass = i === currentPage ? 'active' : '';
    paginationHTML += `<li class="page-item ${activeClass}"><a class="page-link" href="#">${i}</a></li>`;
  }
  paginationHTML += `
    <li class="page-item next-page ${currentPage === items_per_page ? 'disabled' : ''}">
      <a class="page-link" href="#">Next</a>
    </li>
  `;

  $('.pagination').html(paginationHTML);
}


function updateCardDisplay(data) {
  const cardWidth = 335; // Adjust this value to match your card width
  const container = $('.card-content');
  const containerWidth = container.width(); // Recalculate container width
  const cardsPerRow = Math.floor(containerWidth / cardWidth);
  const rowCount = Math.ceil(data.length / cardsPerRow);
  const cardsInLastRow = data.length % cardsPerRow;

  const html = data
    .map((business, index) => {
      const rowIndex = Math.floor(index / cardsPerRow);
      const isLastRow = rowIndex === rowCount - 1;

      let marginRight = '0';
      if (isLastRow && cardsInLastRow > 0) {
        marginRight = `180px`;
      }
      if (isLastRow && cardsPerRow === 2) {
        marginRight = `190px`
      }
      
      return `
        <div class="card"  onclick="window.location='#/business/${business.id}';" style="cursor: pointer; position: relative; right: ${marginRight}">
          <div class="card-image"><img class="img" src=${business.images[0]}></div>
          <div class="card-info">
            <h3>${business.name}</h3>   
            <p>${business.location}<img class="location" src="../logo/icons8-location-48.png"></p>
            <p>${business.price}<img class="dollar" src="../logo/free-icon-dollar-symbol-2150150.png"></p>
          </div>
        </div>
      `;
    })
    .join("");

  $('.card-content').html(html);
}

function showPage(whichPage) {
  currentPage = whichPage;
  fetchData(currentPage, limitPerPage);
} 

$(document).on('click', '.pagination li a', function(event) {
  event.preventDefault();
  const paginationLinks = $('.pagination li');

  if ($(this).text() === 'Prev') {
    currentPage = Math.max(currentPage - 1, 1);
  } else if ($(this).text() === 'Next') {
    currentPage = Math.min(currentPage + 1, paginationLinks.length - 2);
  } else {
    currentPage = Number($(this).text());
  }

  showPage(currentPage);

  paginationLinks.removeClass('active');
  paginationLinks.eq(currentPage - 1).addClass('active');
});

$(document).ready(function() {
  $('#limitSelect').change(function() {
    limitPerPage = parseInt($(this).val());
    currentPage = 1;
    fetchData(currentPage, limitPerPage); // Fetch data with the new limitPerPage

    // Remove the "active" class from all pagination links and add it to the first page
    $('.pagination li').removeClass('active');
    $('.pagination li:first-child').addClass('active');
  });

  // Call fetchData with the default values (currentPage and limitPerPage)
  fetchData(currentPage, limitPerPage);
});
