// Import the necessary functions from fuelquoteform.js
const { populateTable, getQuote, submitForm, populate, checkFormEmpty } = require('../public/pages/fuel quote form page/fuel quote form/fuelquoteform');

describe('Testing populateTable', () => {
    beforeEach(() => {
        // Mock the fetch function to return a resolved promise with mocked data
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve([
                    [
                        {
                            username: 'testuser',
                            address1: '123 Test St',
                            address2: 'Apt 101',
                            state: 'TX',
                            history: []
                        }
                    ]
                ])
            })
        );

        // Mock sessionStorage getItem to return a JSON string
        global.sessionStorage = {
            getItem: jest.fn(() => JSON.stringify({ loggedInUser: { username: 'testuser' } }))
        };

        // Set up filled in values to test
        document.body.innerHTML = `
            <input type="number" id="gallonsRequested" required><br><br>
            <input type="text" id="address1" readonly><br><br>
            <input type="text" id="address2" readonly><br><br>
            <input type="text" id="state" readonly><br><br>
            <input type="date" id="deliveryDate" required><br><br>
            <input type="number" id="suggestedPrice" readonly placeholder="Price per gallon"><br><br>
            <input type="number" id="totalAmountDue" readonly placeholder="Total amount"><br><br>
            <input type="button" id="getQuote" value="Get Quote">
            <input type="submit" id="submit" value="Submit">
        `;
    });

    test('Should populate form fields and attach event handlers', async () => {
        let userData = {
            username: 'testUser',
            address1: '123 Test St',
            city: 'Test City',
            state: 'TX',
            zipcode: '12345',
            history: []
        }

        await populateTable();
        await populate(userData);

        // Set the values of gallonsRequested and deliveryDate
        document.getElementById('gallonsRequested').value = 500;
        document.getElementById('deliveryDate').value = '2024-04-15';

        // Simulate button clicks and check if event handlers are attached
        const getQuoteButton = document.getElementById('getQuote');
        const submitButton = document.getElementById('submit');

        expect(getQuoteButton).toBeTruthy();
        expect(submitButton).toBeTruthy();

        // Check if event handlers are attached
        const getQuoteClickHandler = getQuoteButton.onclick;
        const submitClickHandler = submitButton.onclick;

        expect(typeof getQuoteClickHandler).toBe('function');
        expect(typeof submitClickHandler).toBe('function');

        // Simulate button clicks and check if they trigger the expected event handlers
        getQuote(userData);
        let suggestedPriceInput = document.getElementById('suggestedPrice');
        let totalAmountDueInput = document.getElementById('totalAmountDue');

        expect(suggestedPriceInput.value).toBe("1.725");
        expect(totalAmountDueInput.value).toBe("862.50");

        // Change the user's state, history, and gallons requested to account for if-else cases
        userData = {
            username: 'testUser',
            address1: '123 Test St',
            city: 'Test City',
            state: 'AL',
            zipcode: '12345',
            history: [
                {
                    "gallonsRequested": "3",
                    "deliveryDate": "2024-04-30",
                    "totalAmountDue": "5.175000000000001"
                  }
            ]
        }
        document.getElementById('gallonsRequested').value = 5000;
        getQuote(userData);
        suggestedPriceInput = document.getElementById('suggestedPrice');
        totalAmountDueInput = document.getElementById('totalAmountDue');

        expect(suggestedPriceInput.value).toBe("1.725");
        expect(totalAmountDueInput.value).toBe("8625.00");
        
        submitForm(userData);
    });

    test('Should disable buttons if form fields are empty', () => {
        expect(checkFormEmpty()).toBe(true);
        
        // Simulate input in the form fields
        document.getElementById('gallonsRequested').value = 500;
        document.getElementById('deliveryDate').value = '2024-04-15';

        // Check if buttons are enabled after input
        expect(checkFormEmpty()).toBe(false);
    });

    test('Should handle error when fetching data', async () => {
        // Mock fetch to return an error response
        global.fetch.mockImplementationOnce(() => Promise.reject(new Error('Network error')));

        // Call populateTable, which should catch the error and return an empty array
        const result = await populateTable();
        expect(result).toEqual([]);
    });
});
