const { JSDOM } = require('jsdom');
const fuelQuoteForm = require('../public/pages/fuel quote form page/fuel quote form/fuelquoteform');

describe('Fuel Quote Form Test', () => {
    test('should submit the form to the server', async () => {
        // Set up the DOM
        const dom = new JSDOM(`
            <html>
                <body>
                    <form id="fuelQuoteForm">
                        <input id="gallonsRequested" value="100">
                        <input id="deliveryAddress" value="123 Main St">
                        <input id="deliveryDate" value="2024-04-15">
                        <input id="suggestedPrice" value="2.50">
                        <input id="totalAmountDue" value="250">
                    </form>
                </body>
            </html>
        `);
        global.document = dom.window.document;

        // Mock fetch response
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ success: true }),
            })
        );

        // Mock sessionStorage
        global.sessionStorage = {
            getItem: jest.fn().mockReturnValue(JSON.stringify({ username: 'testUser' })),
        };

        // Call fuelquoteform function
        await fuelQuoteForm();

        // Simulate DOMContentLoaded event
        dom.window.document.dispatchEvent(new dom.window.Event('DOMContentLoaded'));

        // Simulate form submission
        dom.window.document.getElementById('fuelQuoteForm').dispatchEvent(new dom.window.Event('submit'));

        // Assert that fetch was called correctly
        expect(fetch).toHaveBeenCalledWith('/fuelquotehistory', {
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
