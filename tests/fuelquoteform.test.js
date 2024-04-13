// Import the functions to be tested
const { populateTable, getQuote, submitForm } = require('../public/pages/fuel quote form page/fuel quote form/createForm');

// Mock the fetch function for testing purposes
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([{ username: 'testUser', history: [] }]), // Mock user data
  })
);

describe('populateTable function', () => {
  test('should fetch user data and populate the form', async () => {
    document.body.innerHTML = '<form id="form"></form>'; // Mock HTML structure
    
    // Call the function and wait for it to complete
    await populateTable();
    
    // Assert that the form is populated with the correct inputs
    expect(document.getElementById('gallonsRequested')).toBeTruthy();
    expect(document.getElementById('deliveryAddress1')).toBeTruthy();
    expect(document.getElementById('deliveryAddress2')).toBeTruthy();
    expect(document.getElementById('deliveryDate')).toBeTruthy();
    expect(document.getElementById('suggestedPrice')).toBeTruthy();
    expect(document.getElementById('totalAmountDue')).toBeTruthy();
  });
});

describe('getQuote function', () => {
  test('should calculate and update the price fields', () => {
    document.body.innerHTML = `
      <input id="gallonsRequested" value="100">
      <input id="suggestedPrice" value="">
      <input id="totalAmountDue" value="">
    `;
    
    // Call the function
    getQuote([{ username: 'testUser', history: [] }]);
    
    // Assert that the price fields are updated correctly
    expect(document.getElementById('suggestedPrice').value).toBe('152');
    expect(document.getElementById('totalAmountDue').value).toBe('15200');
  });
});

describe('submitForm function', () => {
  test('should submit the form to the server', async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true, message: 'Form submitted successfully' }),
      })
    );
    
    // Mock form data
    document.body.innerHTML = `
      <form id="form">
        <input id="gallonsRequested" value="100">
        <input id="deliveryDate" value="2024-04-15">
      </form>
    `;
    
    // Call the function and wait for it to complete
    await submitForm();
    
    // Assert that the form submission was successful
    expect(fetch).toHaveBeenCalledWith('/fuelquoteform', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        gallonsRequested: 100,
        deliveryDate: '2024-04-15',
      }),
    });
  });
});
