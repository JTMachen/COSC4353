$(document).ready(function() {
    // Fetch data from JSON database using AJAX
    $.ajax({
        url: '/fuelquotehistory', // Replace this with  endpoint that returns fuel quote history when we create actual database in Assignment 4
        type: 'GET',
        success: function(data) {
            // Iterate through the fetched data and append rows to the table
            data.forEach(function(quote) {
                $('#fuelQuoteTable tbody').append(
                    `<tr>
                        <td>${quote.gallonsRequested}</td>
                        <td>${quote.deliveryAddress}</td>
                        <td>${quote.deliveryDate}</td>
                        <td>${quote.suggestedPricePerGallon}</td>
                        <td>${quote.totalAmountDue}</td>
                    </tr>`
                );
            });
        },
        error: function(xhr, status, error) {
            // Handle error 
            console.error(error);
        }
    });
});
