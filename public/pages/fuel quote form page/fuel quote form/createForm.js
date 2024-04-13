function populateTable() {
    return fetch('/profiles')
        .then(response => {
            if (!response.ok) {
                throw new Error('Unable to access user data');
            }
            return response.json();
        })
        .then(data => {
            const currentUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
            const userData = data.filter(function(user) {
                return user.username === currentUser.username;
            });
            return userData;
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            return [];
        })
}

function getQuote(userData) {
    // This is the "Pricing Module" that takes in user input and fills the corresponding fields as required
    let statePrice = .02;
    let historyPrice = 0.0;
    let gallonDiscount = .03;
    let gallons = document.getElementById("gallonsRequested").value;
    if (userData[0].history.length > 0) {
        historyPrice = .01;
    }
    if (userData[0].state != "TX") {
        statePrice = .04;
    }
    if (gallons > 1000) {
        gallonDiscount = 0.02;
    }
    const priceModule = (1.50 * (statePrice - historyPrice + 0.1 + gallonDiscount));
    document.getElementById("suggestedPrice").value = priceModule + 1.50;
    document.getElementById("totalAmountDue").value = (priceModule + 1.50) * gallons;
}

function submitForm(userData) {
    // Append the new quote to the end of "history"
    userData.history.push(
        {
            gallonsRequested: document.getElementById("gallonsRequested").value,
            deliveryDate: document.getElementById("deliveryDate").value,
            totalAmountDue: document.getElementById("totalAmountDue").value
        }
    )
    sessionStorage.setItem('userData', JSON.stringify(userData));
    // Submits the form to the server
    fetch('/updateHistory', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.location.href = '../../home page/home.html';
        }
        else {
            console.error('History update failed: ', data.message);
        }
    })
    .catch(error => {
        console.error("Error: ", error);
    });
}

populateTable()
    .then(userData => {
        // Select the form
        const form = document.querySelector("form");

        // Initialize arrays to populate the form fields
        const array = ['Gallons Requested', 'Delivery Address 1', 'Delivery Address 2', 'Delivery Date', 'Suggested Price Per Gallon ($)','Total Amount Due ($)'];
        const variableArray = ['gallonsRequested', 'deliveryAddress1', 'deliveryAddress2','deliveryDate','suggestedPrice','totalAmountDue'];
        
        // Loop through the array to fill the fields with the correct labels and the correct input types
        for (let i = 0; i < 6; ++i) {
            const p = document.createElement("p");
            const label = document.createElement("label");
            label.textContent = array[i] + ": ";
            p.appendChild(label);
            form.appendChild(p);
            let input = document.createElement("input");
            input.id = variableArray[i];
            // This is the gallons field
            if (i == 0) {
                input.type = "number";
                input.required = true;
            }
            // These are all the fields that the user isn't allowed to change, these are either populated by the profiles.json file
            // or will be updated by the "Get Quote" button
            else if (i == 1 || i == 2 || i == 4 || i == 5) {
                input.type = "text";
                input.readOnly = true;
                if (i == 1) {
                    input.value = userData[0].address1;
                }
                else if (i == 2) {
                    input.value = userData[0].address2;
                }
                else {
                    input.value = "";
                }
            }
            // This is the Delivery Date field
            else {
                input.setAttribute("type", "date");
                input.required = true;
            }
            form.appendChild(input);
        }

        // Create the "Get Quote" and "Submit" buttons
        // TODO: Make it to where the user can't click on "Get Quote" without filling in "Gallons Requested" and "Delivery Date" fields
        const p = document.createElement("p");
        const quoteButton = document.createElement("input");
        quoteButton.setAttribute("type", "button");
        quoteButton.value = "Get Quote";
        // This calls the "getQuote" function above, which fills the "Suggested Price" and "Total Amount Due" fields with coresponding values
        quoteButton.onclick = function () {
            getQuote(userData);
        };
        p.appendChild(quoteButton);
        const submitButton = document.createElement("input");
        submitButton.setAttribute("type", "submit");
        // This calls the "submitForm" function above, which still needs to be filled out
        submitButton.onclick = function () {
            submitForm(userData[0]);
        };
        p.appendChild(submitButton);
        form.appendChild(p);
    })
    .catch(error => {
        console.error("Error: ", error);
    });

    module.exports = { populateTable, getQuote, submitForm };
