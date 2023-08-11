var updateDisplayModule = (function () {
    // Get the current hostname and port to build the server URL
    const serverURL = ``;

    /**
     * @param  {string} cardId
     */
    function fetchUpdateDetails(cardId, isEditing) {
        $.ajax({
            url: `${serverURL}/api/business/${cardId}`,
            method: 'GET',
            success: function (data) {
                  // Populate form fields with business data if editing
                  if (isEditing) {
                    $('#updateImageDir').val(data.image_dir);
                    $('#updateLocation').val(data.location);
                    $('#updatePropertyType').val(data.property_type);
                    $('#updatePrice').val(data.price);
                    $('#updateYearBuilt').val(data.year_built);
                    $('#updateSize').val(data.size);
                    $('#updateName').val(data.name);
                    $('#updateBusinessDescription').val(data.description);
                }
            },
            error: function (error) {
                console.log(error);
            }
        });
    }

    return {
        fetchUpdateDetails: fetchUpdateDetails
    };
})();
