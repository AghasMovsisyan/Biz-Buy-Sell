
var cardDisplayModule = (function () {
    // Get the current hostname and port to build the server URL
    const hostname = window.location.hostname;
    const port = "9000"; // Change this to the appropriate port if needed
    const serverURL = `http://${hostname}:${port}`;

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
                const html = `
                <div class="par">
                    <h1>${data.property_type} For Sale</h1>
                </div>
                <div class="cardv">
                    <div class="card-image">
                        <img class="imgv" src="${data.image_dir}">
                         ${isOwner ? '<button class="edit-button">Edit</button>' : ''}
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
                </div>
                <div class="cardv-descript">
                    <h2 class="decsribe-paragraph">Business Description</h2>
                    <div class="cardv-description">
                        <p>A hotel is a commercial establishment that provides lodging, meals, and other services to guests, travelers, and tourists. Hotels can range from small family-run businesses to large international chains. Most hotels list a variety of services, such as room service, laundry, and concierge. Some hotels also offer meeting and conference facilities, fitness centers, and spas.</p>
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
