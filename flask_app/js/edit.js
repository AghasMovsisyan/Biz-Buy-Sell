$(document).ready(function() {
    // Handle Create Business Form Submission
    $('#createBusinessForm').submit(function(event) {
        event.preventDefault(); // Prevent the form from submitting normally
        
        // Collect form data
        var formData = {
            image_dir: $('#createImageDir').val(),
            location: $('#createLocation').val(),
            property_type: $('#createPropertyType').val(),
            price: $('#createPrice').val(),
            year_built: $('#createYearBuilt').val(),
            size: $('#createSize').val(),
            name: $('#createName').val(),
            business_description: $('#createBusinessDescription').val()
        };
        
        // Get user_id from /api/me if available
        $.ajax({
            type: 'GET',
            url: `${serverURL}/api/me`,
            success: function(response) {
                // Use the user_id from the response
                formData.user_id = response.user_id;
            },
            error: function(error) {
                // Handle error getting user_id
                console.error('Error getting user_id:', error);
            },
            complete: function() {
                // Send data to the server to create business
                $.ajax({
                    type: 'POST',
                    url: `${serverURL}/api/business`, // Replace with your API endpoint for creating businesses
                    data: JSON.stringify([formData]), // Convert data to JSON format (in a list)
                    contentType: 'application/json', // Specify content type
                    success: function(response) {
                        // Handle success (e.g., display a success message)
                        console.log('Business created successfully:', response);
                    },
                    error: function(error) {
                        // Handle error (e.g., display an error message)
                        console.error('Error creating business:', error);
                    }
                });
            }
        });
    });
    
    // Handle Update Business Form Submission
    $('#updateBusinessForm').submit(function(event) {
        event.preventDefault(); // Prevent the form from submitting normally
        
        // Collect form data
        var formData = {
            image_dir: $('#updateImageDir').val(),
            location: $('#updateLocation').val(),
            property_type: $('#updatePropertyType').val(),
            price: $('#updatePrice').val(),
            year_built: $('#updateYearBuilt').val(),
            size: $('#updateSize').val(),
            name: $('#updateName').val(),
            business_description: $('#updateBusinessDescription').val()
        };
        
        // Get the cardId from the URL hash
        var cardId = window.location.hash.split('/')[2];
        
        // Send data to the server to update business
        $.ajax({
            type: 'PUT', // Use 'PUT' or 'PATCH' as appropriate for your API
            url: `${serverURL}/api/business/${cardId}`, // Use the cardId from the URL
            data: JSON.stringify(formData), // Convert data to JSON format
            contentType: 'application/json', // Specify content type
            success: function(response) {
                // Handle success (e.g., display a success message)
                console.log('Business updated successfully:', response);
            },
            error: function(error) {
                // Handle error (e.g., display an error message)
                console.error('Error updating business:', error);
            }
        });
    });
});

