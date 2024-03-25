const populateTable = require('../public/pages/profile page/profile/profile.js');
const users = require('../users.json');

global.sessionStorage = {
    getItem: jest.fn().mockReturnValue(JSON.stringify({ username: 'john_doe '}))
};

global.fetch = jest.fn().mockImplementation(() =>
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve(users)
    })
);

describe('fetchProfile', () => {
    it('should get the profile information for the user', async () => {
        const { username } = JSON.parse(global.sessionStorage.getItem());
        const filteredData = await populateTable();
        const expectedLength = users.filter(user => user.username === username).length;
        expectedLength(filteredData).toHaveLength(expectedLength);
    });

    it ('should return nothing if error', async () => {
        global.fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: false,
                status: 404,
                json: () => Promise.resolve([]),
            })
        );

        const filteredData = await populateTable();
        expect(filteredData).toEqual([]);
    });
});