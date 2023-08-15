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
                const editLink = isOwner ? `<button class="edit-button">Edit</button>` : '';

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
                    <div class="cardv-info" id="card-info-${cardId}">
                        <ul>
                        
                            <li><strong>Business Name:</strong> <span>${data.name}</span><input type="text"  class="form-controlt" id="edit-name-${cardId}" value="${data.name}" style="display: none;"></li>
                            <li><strong>Location:</strong> <span>${data.location}</span><input class="form-controlt" type="text" id="edit-location-${cardId}" value="${data.location}" style="display: none;"><img class="location" src="../logo/icons8-location-48.png"></li>
                            <li><strong>Price:</strong> <span>${data.price}</span><input class="form-controlt" type="text" id="edit-price-${cardId}" value="${data.price}" style="display: none;"><img class="dollar" src="../logo/free-icon-dollar-symbol-2150150.png"></li>
                            <li><strong>Size:</strong> <span>${data.size}</span><input class="form-controlt"  type="text" id="edit-size-${cardId}" value="${data.size}" style="display: none;"><img class="size" src="../logo/icons8-size-24.png"></li>
                            <li><strong>Telephone Number:</strong> <span>${data.tel_number}</span><input class="form-controlt" type="text" id="edit-tel-${cardId}" value="${data.tel_number}" style="display: none;"><img class="ico1" src="../logo/telephone-call.png"></li>
                        </ul>
                        ${editLink}
                        ${isOwner ? `
                        <div class='buttons'>
                            <button class="save-button" data-card-id="${cardId}" style="display: none;">Save</button>
                            <button class="cancel-button" style="display: none;">Cancel</button>
                        </div>
                    ` : ''}
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

                // Add event listener to the "Edit" button
                const editButton = cardDetails.querySelector('.edit-button');
                if (editButton) {
                    editButton.addEventListener('click', function () {
                        // Show editable fields, "Save" and "Cancel" buttons
                        const cardInfo = document.getElementById(`card-info-${cardId}`);
                        cardInfo.querySelectorAll('span').forEach(span => {
                            span.style.display = 'none';
                        });
                        cardInfo.querySelectorAll('input').forEach(input => {
                            input.style.display = 'inline';
                        });
                        const saveButton = cardInfo.querySelector('.save-button');
                        if (saveButton) {
                            saveButton.style.display = 'inline';
                        }
                        const cancelButton = cardInfo.querySelector('.cancel-button');
                        if (cancelButton) {
                            cancelButton.style.display = 'inline'; // Display the "Cancel" button
                        }
                        editButton.style.display = 'none';
                    });
                }
                
                // Add event listener to the "Cancel" button
                const cancelButton = cardDetails.querySelector('.cancel-button');
                if (cancelButton) {
                    cancelButton.addEventListener('click', function () {
                        // Hide editable fields and "Save" and "Cancel" buttons, and show "Edit" button
                        const cardInfo = document.getElementById(`card-info-${cardId}`);
                        cardInfo.querySelectorAll('input').forEach(input => {
                            input.style.display = 'none';
                        });
                        cardInfo.querySelectorAll('span').forEach(span => {
                            span.style.display = 'inline';
                        });
                        const saveButton = cardInfo.querySelector('.save-button');
                        if (saveButton) {
                            saveButton.style.display = 'none';
                        }
                        cancelButton.style.display = 'none';
                        editButton.style.display = 'inline'; // Show the "Edit" button again
                    });
                }

                
                // Add event listener to the "Save" button
                const saveButton = cardDetails.querySelector('.save-button');
                if (saveButton) {
                    saveButton.addEventListener('click', function () {
                        // Get edited values from input fields
                        const editedName = document.getElementById(`edit-name-${cardId}`).value;
                        const editedLocation = document.getElementById(`edit-location-${cardId}`).value;
                        const editedPrice = document.getElementById(`edit-price-${cardId}`).value;
                        const editedSize = document.getElementById(`edit-size-${cardId}`).value;
                        const editedTel = document.getElementById(`edit-tel-${cardId}`).value;

                        // Update card details with edited values
                        data.name = editedName;
                        data.location = editedLocation;
                        data.price = editedPrice;
                        data.size = editedSize;
                        data.tel_number = editedTel;
                        
                        // Send updated data to the server
                        $.ajax({
                            type: 'PUT', // Use 'PUT' or 'PATCH' as appropriate for your API
                            url: `${serverURL}/api/business/${cardId}`, // Use the cardId from the URL
                            data: JSON.stringify(data), // Convert data to JSON format
                            contentType: 'application/json', // Specify content type
                            success: function(response) {
                                // Handle success (e.g., display a success message)
                                $('#successMessage').fadeIn();

                                // Hide the success message after a delay (e.g., 3000ms = 3 seconds)
                                setTimeout(function() {
                                    $('#successMessage').fadeOut();
                                }, 3000);

                                // Update the displayed details
                                fetchCardDetails(cardId);

                                // Update user's tel_number
                                updateUserTelNumber(data.user_id, editedTel, cardId);
                            },
                            error: function(error) {
                                // Handle error (e.g., display an error message)
                                console.error('Error updating business:', error);
                            }
                        });
                    });
                }
            },
            error: function (error) {
                console.log(error);
            }
        });
    }

    // Function to update user's tel_number
    function updateUserTelNumber(userId, newTelNumber, cardId) {
        $.ajax({
            type: 'PUT',
            url: `${serverURL}/api/me/${userId}`,
            data: JSON.stringify({ tel_number: newTelNumber }),
            contentType: 'application/json',
            success: function(response) {
                console.log('User tel_number updated successfully:', response);

                // Update the displayed telephone number in the card details
                const telSpan = document.getElementById(`edit-tel-${cardId}`);
                const telInput = document.getElementById(`edit-tel-${cardId}`);
                const telValue = document.getElementById(`edit-tel-${cardId}`).value;

                telSpan.style.display = 'inline';
                telInput.style.display = 'none';
                telSpan.innerText = telValue;
            },
            error: function(error) {
                console.error('Error updating user tel_number:', error);
            }
        });
    }
return {
    fetchCardDetails: fetchCardDetails
};
})();