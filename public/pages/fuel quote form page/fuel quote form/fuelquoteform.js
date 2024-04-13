function fuelQuoteForm() {
    document.addEventListener('DOMContentLoaded', function () {
       

        // Event listener for submitting the fuel quote form
        document.getElementById('fuelQuoteForm').addEventListener('submit', function (event) {
            event.preventDefault();
            const userInfo = JSON.parse(sessionStorage.getItem('loggedInUser'));

            const formData = {
                username: userInfo.username,
                gallonsRequested: parseFloat(document.getElementById('gallonsRequested').value),
                deliveryAddress: document.getElementById('deliveryAddress').value,
                deliveryDate: document.getElementById('deliveryDate').value,
                suggestedPricePerGallon: parseFloat(document.getElementById('suggestedPrice').value),
                totalAmountDue: parseFloat(document.getElementById('totalAmountDue').value)
            };

            fetch('/fuelquoteform', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Network response was not ok.');
            })
            .then(responseJson => {
                console.log('Fuel quote form submitted successfully', responseJson);
                })
            .catch(error => {
                console.error('Error submitting fuel quote form:', error);
            });
        });
    });
}

module.exports = fuelQuoteForm;
