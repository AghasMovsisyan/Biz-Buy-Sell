let limitPerPage; // The default value will be provided by the API
let currentPage; // The default value will be provided by the API

const hostname = window.location.hostname;
const port = "9000"; // Change this to the appropriate port if needed
const serverURL = `http://${hostname}:${port}`;

function fetchData(page, limitPerPage) {
  $.ajax({
    url: `${serverURL}/api/business`,
    type: "GET",
    data: {
      page: page,
      limit: limitPerPage
    },
    success: function(data) {
      currentPage = data.page; // Update currentPage with the value from the API response
      updatePagination(data.items_per_page); // Update the pagination links
      updateCardDisplay(data.data); // Update the card display
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
  const html = data
    .map(user => {
      return `
      <div class="card" onclick="window.location='#/view/${user.id}';" style="cursor: pointer;">
        <div class="card-image"><img class="img" src=${user.image_dir}></div>
        <div class="card-info">
          <h3>${user.name}</h3>   
          <p>${user.location}<img class="location" src="../logo/icons8-location-48.png"></p>
          <p>${user.price}<img class="dollar" src="../logo/free-icon-dollar-symbol-2150150.png"></p>
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
