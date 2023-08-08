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

                console.log(data.authenticated_user_id);
                console.log(data.user_id);
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
                        <p>This tool rearranges the order of lines in the given textual data. It uses the Knuth method to do it, aka the Fisher and Yates order permutation algorithm. The behavior of the algorithm changes based on how many lines are shuffled at the same time. By default, it takes every single line in turn (1, 2, 3, …, n), generates a random number from 1 to n for it, which is the new position, and moves the line to this new place. It can also take several lines at once and move them together without splitting them apart. For example, if you enter the number 2 in the group size option, it will glue the 1st and 2nd lines together and move them together to </p>
                    </div>
                </div>  
                `;

                // Set the HTML content in the card-details element
                console.log(isOwner);
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
