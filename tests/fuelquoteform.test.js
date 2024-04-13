// fuelquoteform.test.js
describe('Fuel Quote Form Test', () => {
    beforeEach(() => {
        // First, mock sessionStorage
        global.sessionStorage = {
            getItem: jest.fn().mockReturnValue(JSON.stringify({ username: 'testUser' })),
            setItem: jest.fn(),
            clear: jest.fn(),
            removeItem: jest.fn()
        };
        // Explicitly mock fetch as a Jest mock function
        global.fetch = jest.fn().mockImplementation(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ message: 'Success' }),
            })
        );
        // Clear mocks
        fetch.mockClear();
        sessionStorage.getItem.mockClear();
        
        // Mock sessionStorage again
        global.sessionStorage = {
            getItem: jest.fn().mockReturnValue(JSON.stringify({ username: 'testUser' })),
        };

        // Mock fetch again
        global.fetch = jest.fn().mockImplementation(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ message: 'Success' }),
            })
        );

        // Set up the DOM
        document.body.innerHTML = `
            <form id="fuelQuoteForm">
                <input id="gallonsRequested">
                <input id="deliveryAddress">
                <input id="deliveryDate">
                <input id="suggestedPrice">
                <input id="totalAmountDue">
            </form>
            <tbody id="fuelQuoteTableBody"></tbody>
        `;

        // Dynamically import the script
        jest.resetModules();
        require('../public/pages/fuel quote form page/fuel quote form/fuelquoteform.js'); // Update to the actual path
    });

    it('successfully submits data from the fuel quote form', async () => {
        // Set input values
        document.getElementById('gallonsRequested').value = '100';
        document.getElementById('deliveryAddress').value = '123 Main St';
        document.getElementById('deliveryDate').value = '2024-04-15';
        document.getElementById('suggestedPrice').value = '2.50';
        document.getElementById('totalAmountDue').value = '250';

        // Simulate form submission
        const form = document.getElementById('fuelQuoteForm');
    
        // Correction: directly create a 'submit' event
        const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
        
        // Add listener to prevent default behavior
        form.addEventListener('submit', function(event) {
            event.preventDefault();
        });

        // Trigger the event
        form.dispatchEvent(submitEvent);

        // Wait for asynchronous operations to complete
        await new Promise(process.nextTick);

        // Assert that fetch was called correctly
        expect(fetch).toHaveBeenCalledWith('/updatefuelquotehistory', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: 'testUser',
                gallonsRequested: 100,
                deliveryAddress: '123 Main St',
                deliveryDate: '2024-04-15',
                suggestedPricePerGallon: 2.50,
                totalAmountDue: 250,
            }),
        });
    });
});
