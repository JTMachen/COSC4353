document.addEventListener('DOMContentLoaded', function() {
    // Retrieve user information from session storage
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
    const registeredUser = JSON.parse(sessionStorage.getItem('registeredUser'));

    // If the user is logged in, populate the form with their information
    if (loggedInUser) {
        document.getElementById('username').value = loggedInUser.username;
        // You may populate other fields if needed
    }

    // If the user is registered but not logged in, you may use their registration data
    if (registeredUser && !loggedInUser) {
        document.getElementById('username').value = registeredUser.username;
        // You may populate other fields if needed
    }

    const fuelQuoteForm = document.querySelector('form');

    fuelQuoteForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const gallonsRequested = document.getElementById('gallonsRequested').value;
        const deliveryAddress = document.getElementById('deliveryAddress').value;
        const deliveryDate = document.getElementById('deliveryDate').value;
        const suggestedPrice = document.getElementById('suggestedPrice').value;
        const totalAmountDue = document.getElementById('totalAmountDue').value;

        const formData = {
            gallonsRequested: gallonsRequested,
            deliveryAddress: deliveryAddress,
            deliveryDate: deliveryDate,
            suggestedPrice: suggestedPrice,
            totalAmountDue: totalAmountDue,
            // You may include user information in the form data if needed
        };

        fetch('/fuelquoteform', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('Fuel quote submitted successfully');
                // Redirect or display success message as needed
            } else {
                console.error('Fuel quote submission failed:', data.message);
                // Handle error response
            }
        })
        .catch(error => {
            console.error('Error:', error);
            // Handle network or other errors
        });
    });
});
