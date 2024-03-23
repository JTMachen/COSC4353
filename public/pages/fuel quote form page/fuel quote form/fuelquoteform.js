<<<<<<< HEAD
$(document).ready(function() {
    // Function to fetch fuel quote history using AJAX
    function fetchFuelQuoteForm() {
        $.ajax({
            url: '/fuelquoteform', 
            type: 'GET',
            success: function(data) {
                data.forEach(function(quote) {
                    var row = '<tr><td>' + quote.date + '</td><td>' + quote.gallonsRequested + '</td><td>' + quote.suggestedPrice + '</td><td>' + quote.totalAmountDue + '</td></tr>';
                    $('#fuelQuoteTableBody').append(row);
                });
            },
            error: function(xhr, status, error) {
                console.error('Error fetching fuel quote history:', error);
            }
        });  
=======
document.addEventListener('DOMContentLoaded', function() {
    // Fill delivery address with user info
    function getUserInfoFromSession() {
        const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
        return loggedInUser;
>>>>>>> 55b06bc23e976ac41b2fec064ec3210618de1853
    }

    function populateFormWithUserInfo(user) {
        document.getElementById('deliveryAddress').value = user.address1; 
    }

    const userInfo = getUserInfoFromSession();
    if (userInfo) {
        populateFormWithUserInfo(userInfo);
    }

    // Form submission
    document.getElementById('fuelQuoteForm').addEventListener('submit', function(event) {
        event.preventDefault();

        // Gather form data
        const formData = {
            username: userInfo.username,
            gallonsRequested: parseFloat(document.getElementById('gallonsRequested').value),
            deliveryAddress: document.getElementById('deliveryAddress').value,
            deliveryDate: document.getElementById('deliveryDate').value,
            suggestedPricePerGallon: parseFloat(document.getElementById('suggestedPrice').value),
            totalAmountDue: parseFloat(document.getElementById('totalAmountDue').value)
        };

        // Append form data to fuelquotehistory.json here 
    });

});
