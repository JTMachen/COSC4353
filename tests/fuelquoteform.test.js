const axios = require('axios');

describe('Fuel Quote Form and History Integration Test', () => {
  const serverURL = 'http://localhost:5500'; // Ensure this matches your running server

  test('It should submit a new fuel quote form and retrieve it in the fuel quote history', async () => {
    const newQuote = {
      username: "john_doe", // Assuming your endpoint requires a username
      gallonsRequested: 150,
      deliveryAddress: "123 Main St, Anytown, USA",
      deliveryDate: "2024-04-15", // Ensure the date format matches your backend expectation
      suggestedPricePerGallon: 2.50, // Assuming these fields are provided by the form
      totalAmountDue: 375.00
    };

    // Submit new quote
    try {
      const postResponse = await axios.post(`${serverURL}/fuelquoteform`, newQuote);
      expect(postResponse.status).toBe(200);
      expect(postResponse.data.success).toBe(true);
    } catch (error) {
      // If posting the new quote fails, fail the test
      console.error('Error submitting new fuel quote:', error.message);
      expect(true).toBe(false);
    }

    // Retrieve updated history and verify the new quote is present
    try {
      const getResponse = await axios.get(`${serverURL}/fuelquotehistory`);
      expect(getResponse.status).toBe(200);
      expect(getResponse.data).toBeInstanceOf(Array);

      // Assuming the latest quote comes last in the array
      const latestQuote = getResponse.data[getResponse.data.length - 1];
      expect(latestQuote.gallonsRequested).toEqual(newQuote.gallonsRequested);
      expect(latestQuote.deliveryDate).toEqual(newQuote.deliveryDate);
      // Add more assertions as necessary to validate the correctness of the latest quote
    } catch (error) {
      // If retrieving the updated history fails, fail the test
      console.error('Error retrieving updated fuel quote history:', error.message);
      expect(true).toBe(false);
    }
  });

  // Add more integration tests as needed
});
