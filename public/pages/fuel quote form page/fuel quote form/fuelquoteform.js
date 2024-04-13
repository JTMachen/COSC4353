document.addEventListener('DOMContentLoaded', function () {
    // Function to fetch existing fuel quotes and display them
    function fetchFuelQuoteForm() {
        fetch('/fuelquotehistory', { method: 'GET' })
            .then(response => response.json())
            .then(data => {
                data.forEach(function (quote) {
                    const row = `<tr><td>${quote.date}</td><td>${quote.gallonsRequested}</td><td>${quote.suggestedPrice}</td><td>${quote.totalAmountDue}</td></tr>`;
                    document.getElementById('fuelQuoteTableBody').insertAdjacentHTML('beforeend', row);
                });
            })
            .catch(error => {
                console.error('Error fetching fuel quote history:', error);
            });
    }
    fetchFuelQuoteForm();

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
            // Optionally, update the UI with the new quote without reloading the page
            const newQuoteRow = `<tr><td>${formData.deliveryDate}</td><td>${formData.gallonsRequested}</td><td>${formData.suggestedPricePerGallon}</td><td>${formData.totalAmountDue}</td></tr>`;
            document.getElementById('fuelQuoteTableBody').insertAdjacentHTML('beforeend', newQuoteRow);
        })
        .catch(error => {
            console.error('Error submitting fuel quote form:', error);
        });
    });
});
