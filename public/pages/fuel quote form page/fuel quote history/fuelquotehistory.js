// Function to fetch fuel quote history from the server
function fetchFuelQuoteHistory() {
    return fetch('/profiles')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Retrieve the logged-in user from session storage
            const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));

            // Find the user's profile in the data
            const userProfile = data.find(profile => profile.username === loggedInUser.username);

            // Return the history data of the user
            return userProfile ? userProfile.history : [];
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            // Return an empty array in case of error
            return [];
        });
}

// Function to populate the table with fuel quote history
function populateTable(data) {
    const tableBody = document.querySelector('#fuelQuoteTable tbody');
    tableBody.innerHTML = ''; // Clear previous data

    data.forEach(quote => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${quote.gallonsRequested}</td>
            <td>${quote.deliveryAddress}</td>
            <td>${quote.deliveryDate}</td>
            <td>${quote.suggestedPricePerGallon}</td>
            <td>$${quote.totalAmountDue}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Call the function and populate the table
fetchFuelQuoteHistory()
    .then(historyData => {
        console.log(historyData);
        populateTable(historyData);
    })
    .catch(error => {
        console.error('Error:', error);
    });
