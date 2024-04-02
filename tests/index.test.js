const fs = require('fs');
const { fetchLogin } = require('../public/index');
const { JSDOM } = require('jsdom');

const { document } = (new JSDOM('')).window;
global.document = document;

const usersData = fs.readFileSync('users.json');
const users = JSON.parse(usersData);

// mock fetch API
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
});
