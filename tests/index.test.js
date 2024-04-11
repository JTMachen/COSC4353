const fs = require('fs');
const { fetchLogin } = require('../public/index');
const { JSDOM } = require('jsdom');

const { document } = (new JSDOM('')).window;
global.document = document;

// Mock sessionStorage
const sessionStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn()
};
global.sessionStorage = sessionStorageMock;

const usersData = fs.readFileSync('users.json');
const users = JSON.parse(usersData);

// Mock fetch API
global.fetch = jest.fn().mockImplementation((url, options) => {
    // mocking login request based on username and password passed in options
    const { username, password } = JSON.parse(options.body);
    const user = users.find(user => user.username === username && user.password === password);
    if (user) {
        return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ success: true, user: { username: user.username } }),
        });
    } else {
        return Promise.resolve({
            ok: false,
            json: () => Promise.resolve({ success: false }),
        });
    }
});

describe('Login functionality', () => {
    users.forEach(user => {
        it(`should login successfully for ${user.username}`, async () => {
            const result = await fetchLogin(user.username, user.password);
            expect(result.success).toBe(true);
        });
    });

    it('should fail to login with invalid credentials', async () => {
        const result = await fetchLogin('invalidusername', 'invalidpassword');
        expect(result.success).toBe(false);
    });

    it('should handle fetch error', async () => {
        // Mock fetch to return a rejected promise
        global.fetch.mockImplementation(() => Promise.reject(new Error('Fetch error')));

        try {
            // Call fetchLogin
            await fetchLogin('username', 'password');
        } catch (error) {
            // Expect an error to be thrown
            expect(error.message).toBe('Login request failed');
        }

        // Restore fetch mock implementation
        global.fetch.mockRestore();
    });
});
