describe('fuelquoteformtest', () => {
    beforeEach(() => {
        global.sessionStorage = {
            getItem: jest.fn().mockReturnValue(JSON.stringify({ username: 'testUser' })),
            setItem: jest.fn(),
            clear: jest.fn(),
            removeItem: jest.fn()
        };


        global.fetch = jest.fn((url) => {
            const validUrls = {
                'http://example.com/fuelquotehistory': {
                    ok: true,
                    json: () => Promise.resolve({ message: 'Success' }),
                },
                'http://example.com/updatefuelquotehistory': {
                    ok: true,
                    json: () => Promise.resolve({ message: 'Success' }),
                }
            };
            return Promise.resolve(validUrls[url] || { ok: false });
        });

        document.body.innerHTML = `
            <form id="fuelQuoteForm">
                <input id="gallonsRequested" type="number">
                <input id="deliveryAddress" type="text">
                <input id="deliveryDate" type="date">
                <input id="suggestedPrice" type="number">
                <input id="totalAmountDue" type="number">
            </form>
            <tbody id="fuelQuoteTableBody"></tbody>
        `;

        jest.resetModules();
        require('../public/pages/fuel quote form page/fuel quote form/fuelquoteform.js');
    });

    it('successful submit fuelquoteform', async () => {
        document.getElementById('gallonsRequested').value = '100';
        document.getElementById('deliveryAddress').value = '123 Main St';
        document.getElementById('deliveryDate').value = '2024-04-15';
        document.getElementById('suggestedPrice').value = '2.50';
        document.getElementById('totalAmountDue').value = '250';

        const form = document.getElementById('fuelQuoteForm');
        const mockSubmitEvent = new Event('submit', { bubbles: true, cancelable: true });
        form.dispatchEvent(mockSubmitEvent);

        await new Promise(resolve => setTimeout(resolve, 100));

        expect(fetch).toHaveBeenCalledWith('http://example.com/updatefuelquotehistory', {
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
