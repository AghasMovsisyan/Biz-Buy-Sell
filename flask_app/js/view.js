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
                        <h1>${data.name}    </h1>
                    </div>
                    <div class="cardv">
                        <div class="card-image">
                            <img class="imgv" src="${data.image_dir}">
                        </div>
                    </div>
                    <div class="cardv-info" id="card-info-${cardId}">
                        <ul>
                            <li><strong>Year Built:</strong> <span>${data.year_built}</span><input type="text"  class="form-controlt" id="edit-year-${cardId}" value="${data.year_built}" style="display: none;"></li>
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
               // Add event listener to the "Save" button
                const saveButton = cardDetails.querySelector('.save-button');
                if (saveButton) {
                    saveButton.addEventListener('click', function () {
                        // Get edited values from input fields
                        const editedYear = document.getElementById(`edit-year-${cardId}`).value;
                        const editedLocation = document.getElementById(`edit-location-${cardId}`).value;
                        const editedPrice = document.getElementById(`edit-price-${cardId}`).value;
                        const editedSize = document.getElementById(`edit-size-${cardId}`).value;
                        const editedTel = document.getElementById(`edit-tel-${cardId}`).value;

                        // Update card details with edited values
                        data.year_built = editedYear;
                        data.location = editedLocation;
                        data.price = editedPrice;
                        data.size = editedSize;
                        data.tel_number = editedTel;
                        
                        if(isNaN(editedSize)) {
                            alert("Size Must be Integer");
                            return;
                        }

                        if(isNaN(editedPrice)) {
                            alert("Price Must be Integer");``
                            return;
                        }

                        if(isNaN(editedTel)) {
                            alert("Tel Must be Integer");``
                            return;
                        }
                        

                        // Update card details on the server
                        $.ajax({
                            type: 'PUT',
                            url: `${serverURL}/api/business/${cardId}`,
                            data: JSON.stringify(data),
                            contentType: 'application/json',
                            success: function(response) {

                                // Update user's tel_number
                                updateUserTelNumber(data.user_id, editedTel, cardId);
                            },
                            error: function(error) {
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
                const telValue = telInput.value; // Get the updated value from the input field
    
                telSpan.innerText = telValue; // Update the span element with the new value
    
                // Hide input and show span
                telInput.style.display = 'none';
                telSpan.style.display = 'inline';
    
                // Fetch updated card details to refresh the content
                fetchCardDetails(cardId);
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