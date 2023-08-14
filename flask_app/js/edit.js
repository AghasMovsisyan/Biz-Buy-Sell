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
            description: $('#createBusinessDescription').val()
        };
        
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
            description: $('#updateBusinessDescription').val()
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
                $('#successMessage').fadeIn();

                // Hide the success message after a delay (e.g., 3000ms = 3 seconds)
                setTimeout(function() {
                    $('#successMessage').fadeOut();
                }, 3000);
            },
            error: function(error) {
                // Handle error (e.g., display an error message)
                console.error('Error updating business:', error);
            }
        });
    });
});

