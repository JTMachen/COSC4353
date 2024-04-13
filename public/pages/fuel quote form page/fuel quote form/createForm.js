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

populateTable()
    .then(userData => {
        const form = document.querySelector("form");
        const array = ['Gallons Requested', 'Delivery Address 1', 'Delivery Address 2', 'Delivery Date', 'Suggested Price Per Gallon ($)','Total Amount Due ($)'];
        const variableArray = ['gallonsRequested', 'deliveryAddress1', 'deliveryAddress2','deliveryDate','suggestedPrice','totalAmountDue'];
        for (let i = 0; i < 6; ++i) {
            const p = document.createElement("p");
            const label = document.createElement("label");
            label.textContent = array[i] + ": ";
            p.appendChild(label);
            form.appendChild(p);
            let input = document.createElement("input");
            input.id = variableArray[i];
            if (i == 0) {
                input.type = "number";
            }
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
            else {
                input.setAttribute("type", "date");
            }
            form.appendChild(input);
        }
        const p = document.createElement("p");
        const quoteButton = document.createElement("input");
        quoteButton.setAttribute("type", "button");
        quoteButton.value = "Get Quote";
        quoteButton.onclick = function () {
            getQuote(userData);
        };
        p.appendChild(quoteButton);
        const submitButton = document.createElement("input");
        submitButton.setAttribute("type", "submit");
        p.appendChild(submitButton);
        form.appendChild(p);
    })
    .catch(error => {
        console.error("Error: ", error);
    });

module.exports = populateTable;
