var cardDisplayModule = (function () {
    // Get the current hostname and port to build the server URL
    const serverURL = "";

    /**
     * @param  {string} cardId
     */
    function fetchCardDetails(cardId) {
        $.ajax({
            url: `${serverURL}/api/business/${cardId}`,
            method: 'GET',
            success: function (data) {
                const cardDetails = document.getElementById("card-details");

                // Check if the authenticated user is the owner
                const isOwner = data.authenticated_user_id === data.user_id;

                // Create HTML content for card details with Edit button if user is owner
                const editLink = isOwner ? `<a href="#/edit/${cardId}" class="edit-button">Edit</a>` : '';

                const html = `
                <div class="scrollable-section">
                <div class="par">
                    <h1>${data.property_type} For Sale</h1>
                </div>
                <div class="cardv">
                    <div class="card-image">
                        <img class="imgv" src="${data.image_dir}">
                    </div>
                </div>
                <div class="cardv-info">  
                    <ul>
                        <li><strong>Business Name:</strong> <span>${data.name}</span></li>
                        <li><strong>Location:</strong> <span>${data.location}<img class="location" src="../logo/icons8-location-48.png"></span></li>
                        <li><strong>Price:</strong> <span>${data.price} <img class="dollar" src="../logo/free-icon-dollar-symbol-2150150.png"></span></li>
                        <li><strong>Size:</strong> <span>${data.size}<img class="size" src="../logo/icons8-size-24.png "</span></li>
                        <li><strong>Telephone Number:</strong> <span>${data.tel_number} <img class="ico1" src="../logo/telephone-call.png"></span></li> 
                        </ul>
                        ${editLink}
                </div>
                <div class="cardv-descript">
                    <h2 class="decsribe-paragraph">Business Description</h2>
                    <div class="cardv-description">
                        <p>${data.description}</p> 
                    </div>
                </div>
            </div>            
                `;

                // Set the HTML content in the card-details element
                cardDetails.innerHTML = html;
            },
            error: function (error) {
                console.log(error);
            }
        });
    }

    return {
        fetchCardDetails: fetchCardDetails
    };
})();
