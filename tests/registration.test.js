// Import the prepareData function
const prepareData = require('../public/pages/profile page/registration/registration');

global.sessionStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn()
};
global.alert = jest.fn();

describe('prepareData function', () => {
  beforeEach(() => {
    // Mock sessionStorage getItem method
    global.sessionStorage.getItem.mockReturnValueOnce(JSON.stringify({ username: 'testUser' }));
  });

  test('should validate form data and send POST request', async () => {
    // Set up the DOM environment
    document.body.innerHTML =`
      <input type="text" id="name" name="name" placeholder="Full Name" maxlength="50" minLength="1" required/>
      <input id="address1" name="address1" placeholder="Address 1 (required)" maxlength="100" minLength="1" required/>
      <input id="address2" name="address2" placeholder="Address 2 (optional)" maxlength="100"/>
      <input id="city" name="city" placeholder="City" maxlength="100" minLength="1" required/>
      <select id="state"></select>
      <input id="zip_code" name="zip_code" placeholder="Zip Code" minlength="5" max="9" required/>
      <input type="submit" value="Submit" onclick="prepareData()"/>
      `;

    // Mock fetch response
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ success: true }),
      })
    );

    // Check for null Zip Code
    document.getElementById("zip_code").value = "";
    const result1 = await prepareData();
    expect(result1).toEqual(false);
    
    // Check for incorrect name format
    document.getElementById("name").value = "John123";
    const result2 = await prepareData();
    expect(result2).toEqual(false);

    // Check for correct data submission
    document.getElementById("name").value = "John Doe";
    document.getElementById("zip_code").value = "12345";
    const result3 = await prepareData();
    // Expect nothing returned
    expect(result3).toEqual();

    // Check that sessionStorage.getItem was called with 'registeredUser'
    expect(global.sessionStorage.getItem).toHaveBeenCalledWith('registeredUser');
  });
});
