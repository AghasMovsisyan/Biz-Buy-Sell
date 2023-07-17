var cardDisplayModule = (function () {
    /**
     * @param  {string} cardId
     */
    function fetchCardDetails(cardId) {
        $.ajax({
            url: `http://127.0.0.1:9000/api/business/${cardId}`,
            method: 'GET',
            success: function (data) {
                const cardDetails = document.getElementById("card-details");
    
                // Create HTML content for card details
                const html = `
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
                        <li><strong>Location:</strong> <span>${data.location}</span></li>
                        <li><strong>Price:</strong> <span>${data.price} <img class="dollar" src=../logo/free-icon-dollar-symbol-2150150.png </span></li>
                        <li><strong>Size:</strong> <span>${data.size}</span></li>
                        <li><strong>Telephone Number:</strong> <span>${data.tel_number} <img class="ico1" src="../logo/telephone-call.png"></span></li> 
                    </ul>
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
