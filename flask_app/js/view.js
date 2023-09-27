var cardDisplayModule = (function () {
    /**
     * @param  {string} cardId
     */
    function fetchCardDetails(cardId) {
        $.ajax({
            url: `/api/business/${cardId}`,
            method: 'GET',
            success: function (response) {
                const data = response.data;
                // Fetch authenticated_user_id and user_id using a new AJAX request
                $.ajax({
                    url: '/api/me',
                    method: 'GET',
                    success: function (userData) {
                        const cardDetails = document.getElementById('card-details');

                        // Check if the authenticated user is the owner
                        const isOwner = userData.authenticated_user_id === data.user_id;

                        const editLink = isOwner ? `<button class="edit-button">Edit</button>` : '';

                        const html = `
                        <div class="scrollable-section">    
                            <div class="cardv-container">
                                <div class="par">
                                    <h1 class="business-name">${data.name}</h1>
                                </div>
                                <div class="cardv">
                                <div id="image-slider" class="carousel slide" data-bs-ride="carousel">
                                    <div class="carousel-inner">
                                        ${data.images.map((imageUrl, index) => `
                                            <div class="carousel-item ${index === 0 ? 'active' : ''}">
                                                <img class="slider-image" src="${imageUrl}" alt="">
                                            </div>
                                        `).join('')}
                                    </div>
                                    <button class="carousel-control-prev" type="button" data-bs-target="#image-slider" data-bs-slide="prev">
                                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                        <span class="visually-hidden">Previous</span>
                                    </button>
                                    <button class="carousel-control-next" type="button" data-bs-target="#image-slider" data-bs-slide="next">
                                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                        <span class="visually-hidden">Next</span>
                                    </button>
                                </div>
                            </div>
                                <div class="cardv-info" id="card-info-${cardId}">
                                <ul>
                                    <li>
                                        <label for="edit-year-${cardId}" style="display: inline-block;" class="smaller-label">Year Built:</label>
                                        <span id="span-year-${cardId}" style="display: inline-block; margin-right: 10px">${data.year_built}</span>
                                        <form id="edit-year-form-${cardId}" style="display: none;">
                                            <div class="form-group" style="display: inline-block;">
                                                <input type="text" class="form-control smaller-input" id="edit-year-${cardId}" value="${data.year_built}" style="width: 160px;">
                                            </div>
                                            <div id="edit-year-error-${cardId}" class="text-danger" style="display: none;">Please enter a valid integer.</div>
                                        </form>
                                    </li>
                            
                                    
                                    <li>
                                        <label for="edit-type-${cardId}" style="display: inline-block;" class="smaller-label">Property Type:</label>
                                        <span id="span-type-${cardId}" style="display: inline-block; margin-right: 10px;">${data.property_type}</span>
                                        <form id="edit-type-form-${cardId}" style="display: none;">
                                            <div class="form-group" style="display: inline-block;">
                                                <input type="text" class="form-control smaller-input" id="edit-type-${cardId}" value="${data.property_type}" style="width: 160px;">
                                            </div>
                                        </form>
                                    </li>

                                    <li>
                                        <label for="edit-location-${cardId}" class="smaller-label" style="display: inline-block;">Location:</label>
                                        <span id="span-location-${cardId}" style="display: inline-block; margin-right: 10px;">${data.location}</span>
                                        <form id="edit-location-form-${cardId}" style="display: none;">
                                            <div class="form-group" style="display: inline-block;">
                                                <input type="text" class="form-control smaller-input" id="edit-location-${cardId}" value="${data.location}" style="width: 160px;">
                                            </div>
                                        </form>
                                    </li>
                                    <li>
                                        <label for="edit-size-${cardId}" class="smaller-label" class="smaller-label">Size:</label>
                                        <span id="span-size-${cardId}" style="display: inline-block; margin-right: 10px;">${data.size}</span>
                                        <form id="edit-size-form-${cardId}" style="display: none;">
                                            <div class="form-group" style="display: inline-block;">
                                                <input type="text" class="form-control smaller-input" id="edit-size-${cardId}" value="${data.size}" style="width: 160px;">
                                            </div>
                                            <div id="edit-size-error-${cardId}" class="text-danger" style="display: none;">Please enter a valid integer.</div>
                                        </form>
                                    </li>


                                    <li>
                                        <label for="edit-price-${cardId}" style="display: inline-block;" class="smaller-label">Price:</label>
                                        <span id="span-price-${cardId}" style="display: inline-block; margin-right: 10px;">${data.price}</span>
                                        <form id="edit-price-form-${cardId}" style="display: none;">
                                            <div class="form-group" style="display: inline-block;">
                                                <input type="text" class="form-control smaller-input" id="edit-price-${cardId}" value="${data.price}" style="width: 160px;">
                                            </div>
                                            <div id="edit-price-error-${cardId}" class="text-danger" style="display: none;">Please enter a valid integer.</div>
                                        </form>
                                    </li>

                                    <li>
                                        <label for="edit-tel-${cardId}" style="display: inline-block;" class="smaller-label">Telephone Number:</label>
                                        <span id="span-tel-${cardId}" style="display: inline-block; margin-right: 10px;">${data.tel_number}</span>
                                        <form id="edit-tel-form-${cardId}" style="display: none;">
                                            <div class="form-group" style="display: inline-block;">
                                                <input type="text" class="form-control smaller-input" id="edit-tel-${cardId}" value="${data.tel_number}" style="width: 160px;">
                                            </div>
                                        </form>
                                    </li>
                                </ul>
 
                                    ${editLink}
                                    ${isOwner ? `
                                    <div class='buttons'>
                                            <button class="save-button" data-card-id="${cardId}" style="display: none;">Save</button>
                                            <button class="reset-button" data-card-id="${cardId}" style="display: none;">Reset</button>
                                            <button class="cancel-button" style="display: none;">Cancel</button>
                                    </div>
                                ` : ''}
                                </div>
                                <div class="cardv-descript">
                                    <h2 class="decsribe-paragraph business-descript">Business Description</h2>
                                    <div class="cardv-description">
                                        <div class="justify-text">${data.description}</div>    
                                    </div>
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
                                cardInfo.querySelectorAll('form').forEach(form => {
                                    form.style.display = 'inline';
                                });
                                const saveButton = cardInfo.querySelector('.save-button');
                                if (saveButton) {
                                    saveButton.style.display = 'inline';
                                }
                                const resetButton = cardInfo.querySelector('.reset-button');
                                if (resetButton) {
                                    resetButton.style.display = 'inline'; // Display the "Reset" button
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
                                // Reset input values to original data
                                resetInputValues(cardId, data);

                                // Hide editable fields and "Save" and "Cancel" buttons, and show "Edit" button
                                const cardInfo = document.getElementById(`card-info-${cardId}`);
                                cardInfo.querySelectorAll('form').forEach(form => {
                                    form.style.display = 'none';
                                });
                                cardInfo.querySelectorAll('span').forEach(span => {
                                    span.style.display = 'inline';
                                });

                                
                                const saveButton = cardInfo.querySelector('.save-button');
                                if (saveButton) {
                                    saveButton.style.display = 'none';
                                }
                                const resetButton = cardInfo.querySelector('.reset-button')
                                if (resetButton) {
                                    resetButton.style.display = 'none';
                                }
                                
                                resetButton.style.display = 'none';
                                cancelButton.style.display = 'none';
                                editButton.style.display = 'inline'; // Show the "Edit" button again
                            });
                        }
                        
                        const resetButton = cardDetails.querySelector('.reset-button');
                        if (resetButton) {
                            resetButton.addEventListener('click', function () {
                                // Reset input values to original data
                                resetInputValues(cardId, data);
                            });
                        }
                        function resetInputValues(cardId, data) {
                            document.getElementById(`edit-year-${cardId}`).value = data.year_built;
                            document.getElementById(`edit-type-${cardId}`).value = data.property_type;
                            document.getElementById(`edit-location-${cardId}`).value = data.location;
                            document.getElementById(`edit-price-${cardId}`).value = data.price;
                            document.getElementById(`edit-size-${cardId}`).value = data.size;
                            document.getElementById(`edit-tel-${cardId}`).value = data.tel_number;

                            const editYearError = document.getElementById(`edit-year-error-${cardId}`);
                            editYearError.style.display = 'none';
                            yearBuiltInput.style.borderColor = ''; // Reset border color

                            const editPriceError = document.getElementById(`edit-price-error-${cardId}`);
                            editPriceError.style.display = 'none';
                            priceInput.style.borderColor = ''; // Reset border color

                            const editSizeError = document.getElementById(`edit-size-error-${cardId}`); 
                            editSizeError.style.display = 'none';
                            sizeInput.borderColor = '';

                        }
                        
                        
                        const yearBuiltInput = document.getElementById(`edit-year-${cardId}`);
                        const priceInput = document.getElementById(`edit-price-${cardId}`);
                        const sizeInput = document.getElementById(`edit-size-${cardId}`);
                        const saveButton = cardDetails.querySelector('.save-button');
                        
                        function validateYearInput() {
                            const inputValue = yearBuiltInput.value;
                        
                            if (inputValue.trim() === '') {
                                // Input is empty
                                const editYearError = document.getElementById(`edit-year-error-${cardId}`);
                                editYearError.textContent = 'Year must not be empty'; // Set the error message
                                editYearError.style.display = 'block';
                                yearBuiltInput.style.borderColor = 'red'; // Highlight the input field
                        
                                // Disable the "Save" button
                                saveButton.disabled = true;
                            } else if (/^\d+$/.test(inputValue)) {
                                // Input is a valid integer
                                const editedYear = parseInt(inputValue);
                        
                                // Reset error state if the input is valid
                                const editYearError = document.getElementById(`edit-year-error-${cardId}`);
                                editYearError.style.display = 'none';
                                yearBuiltInput.style.borderColor = ''; // Reset border color
                        
                                // Enable the "Save" button
                                saveButton.disabled = false;
                            } else {
                                // Input is not a valid integer
                                const editYearError = document.getElementById(`edit-year-error-${cardId}`);
                                editYearError.textContent = 'Please enter a valid integer'; // Set the error message
                                editYearError.style.display = 'block';
                                yearBuiltInput.style.borderColor = 'red'; // Highlight the input field
                        
                                // Disable the "Save" button
                                saveButton.disabled = true;
                            }
                        }
                        
                        function validatePriceInput() {
                            const inputValue = priceInput.value;
                        
                            if (inputValue.trim() === '') {
                                // Input is empty
                                const editPriceError = document.getElementById(`edit-price-error-${cardId}`);
                                editPriceError.textContent = 'Price must not be empty'; // Set the error message
                                editPriceError.style.display = 'block';
                                priceInput.style.borderColor = 'red'; // Highlight the input field
                        
                                // Disable the "Save" button
                                saveButton.disabled = true;
                            } else if (/^\d+$/.test(inputValue)) {
                                // Input is a valid integer
                                const editedPrice = parseInt(inputValue);
                        
                                // Reset error state if the input is valid
                                const editPriceError = document.getElementById(`edit-price-error-${cardId}`);
                                editPriceError.style.display = 'none';
                                priceInput.style.borderColor = ''; // Reset border color
                        
                                // Enable the "Save" button
                                saveButton.disabled = false;
                            } else {
                                // Input is not a valid integer
                                const editPriceError = document.getElementById(`edit-price-error-${cardId}`);
                                editPriceError.textContent = 'Please enter a valid integer'; // Set the error message
                                editPriceError.style.display = 'block';
                                priceInput.style.borderColor = 'red'; // Highlight the input field
                        
                                // Disable the "Save" button
                                saveButton.disabled = true;
                            }
                        }
                        
                        function validateSizeInputs() {


                            const inputValue = sizeInput.value;
                        
                            if(inputValue.trim() === '') {
                                // Input is empty
                                const editSizeError = document.getElementById(`edit-size-error-${cardId}`);
                                editSizeError.textContent = 'Size must not be empty';
                                editSizeError.style.display = 'block';
                                sizeInput.style.borderColor = 'red';
                        
                                saveButton.disabled = true;
                            }else if (/^\d+$/.test(inputValue)) {
                        
                                const editedSize = parseInt(inputValue);
                                const editSizeError = document.getElementById(`edit-size-error-${cardId}`);
                                editSizeError.style.display = 'none';
                                sizeInput.borderColor = '';
                        
                                saveButton.disabled = false;
                            
                            } else {
                        
                                const editSizeError = document.getElementById(`edit-size-error-${cardId}`);
                                editSizeError.textContent = 'Please enter a valide integer';
                                editSizeError.style.display = 'block';
                                editSizeError.style.borderColor = 'red';
                                
                                saveButton.disabled = true;
                        
                            }
                        }

                        yearBuiltInput.addEventListener('input', validateYearInput);
                        priceInput.addEventListener('input', validatePriceInput);
                        sizeInput.addEventListener('input', validateSizeInputs);
                        // Initially validate both year and price inputs on page load
                        validateYearInput();
                        validatePriceInput();
                        validateSizeInputs();



                        if (saveButton) {
                            saveButton.addEventListener('click', function () {
                                // Get edited values from input fields
                                const editedYearInput = document.getElementById(`edit-year-${cardId}`);
                                const editedYear = parseInt(editedYearInput.value); // Parse input as an integer
                                const editedLocation = document.getElementById(`edit-location-${cardId}`).value;
                                const editedPrice = document.getElementById(`edit-price-${cardId}`).value;
                                const editedTel = document.getElementById(`edit-tel-${cardId}`).value;
                                const editType = document.getElementById(`edit-type-${cardId}`).value;
                                const editedSize = document.getElementById(`edit-size-${cardId}`).value;
                                // Update card details with edited values
                                
                                data.year_built = editedYear;
                                data.property_type = editType;
                                data.location = editedLocation;
                                data.price = editedPrice;
                                data.size = editedSize;
                                data.tel_number = editedTel;
                                
                                
                                    
                                // Update card details on the server
                                $.ajax({
                                    type: 'PUT',
                                    url: `/api/business/${cardId}`,
                                    data: JSON.stringify({
                                        year_built: editedYear,
                                        property_type: editType,
                                        location: editedLocation,
                                        price: editedPrice,
                                        size: editedSize,
                                    }),
                                    contentType: 'application/json',
                                    success: function(response) {
                                        // Update user's tel_number
                                        updateUserTelNumber(data.user_id, editedTel, cardId);
                                    },
                                    error: function(error) {
                                        console.error('Error updating business:', error);
                                    }
                                });
                                const sliderContainer = cardDetails.querySelector('.carousel-inner');
                                
                                function updateSliderImage() {
                                    const images = data.images;
                                let currentImageIndex = 0;
                                    if (images.length > 0) {
                                        const imageUrl = images[currentImageIndex];
                                        sliderContainer.querySelector('.slider-image').src = imageUrl;
                                    }
                                }
                                updateSliderImage();
                            });
                        }
                            },
                    error: function (error) {
                        console.error('Error fetching user data:', error);
                    }
                });

               

                // Initialize the image slider
            },
            error: function (error) {
                console.log(error);
            }
        });
    }

    function updateUserTelNumber(userId, newTelNumber, cardId) {
        $.ajax({
            type: 'PUT',
            url: `/api/me/${userId}`,
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
    
                // Fetch updated card details to refresh the cont   ent
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
