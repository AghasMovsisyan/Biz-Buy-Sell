$(document).ready(function() {
    $('#createBusinessForm').submit(function(event) {
        event.preventDefault(); // Prevent the form from submitting normally
        
        // Collect form data
        var formData = {
            user_id: null, // This will be updated in the /api/me endpoint
            image_dir: $('#imageDir').val(),
            location: $('#location').val(),
            property_type: $('#propertyType').val(),
            price: $('#price').val(),
            year_built: $('#yearBuilt').val(),
            size: $('#size').val(),
            name: $('#name').val(),
            business_description: $('#businessDescription').val()
        };
        
        // Get user_id from /api/me if available
        $.ajax({
            type: 'GET',
            url: `${serverURL}/api/me`,
            success: function(response) {
                // Use the user_id from the response
                formData.user_id = response.user_id;
                
                // Send data to the server to create business
                $.ajax({
                    type: 'POST',
                    url: `${serverURL}/api/business`,
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
            },
            error: function(error) {
                // Handle error getting user_id
                console.error('Error getting user_id:', error);

                // Send data to the server to create business without user_id
                $.ajax({
                    type: 'POST',
                    url: `${serverURL}/api/business`,
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
});
