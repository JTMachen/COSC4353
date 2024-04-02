const { fetchInitialRegistration } = require('../public/InitialRegistration');

// mock fetch API
global.fetch = jest.fn().mockImplementation(() =>
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true }),
    })
);

describe('fetchInitialRegistration', () => {
    it('should handle registration success', async () => {
        const username = 'testuser';
        const password = 'testpassword';

        const result = await fetchInitialRegistration(username, password);

        expect(result.success).toBe(true);
    });

    it('should throw an error if registration request fails', async () => {
        global.fetch.mockImplementationOnce(() => Promise.reject(new Error('Failed to fetch')));

        await expect(fetchInitialRegistration('testuser', 'testpassword')).rejects.toThrow('Registration request failed');
    });
});
