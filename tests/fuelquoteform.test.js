// fuelquoteform.test.js
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const fetchMock = require('jest-fetch-mock');

// 设置全局变量以模拟浏览器环境
global.fetch = fetchMock;
global.document = new JSDOM('<!doctype html><html><body></body></html>').window.document;
global.window = document.defaultView;
global.sessionStorage = window.sessionStorage;

// 模拟localStorage
global.sessionStorage.setItem('loggedInUser', JSON.stringify({username: 'testUser'}));

// 加载你的JS文件
const fuelQuoteFormScript = fs.readFileSync(path.resolve(__dirname, 'fuelquoteform.js'), {encoding: 'utf-8'});
eval(fuelQuoteFormScript);

describe('Fuel Quote Form', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  it('should fetch fuel quote history on DOMContentLoaded', (done) => {
    document.body.innerHTML = `<table id="fuelQuoteTableBody"></table>`;

    fetch.mockResponseOnce(JSON.stringify([{date: '2023-04-01', gallonsRequested: 100, suggestedPrice: 2.0, totalAmountDue: 200}]));

    window.dispatchEvent(new Event('DOMContentLoaded'));

    process.nextTick(() => {
      expect(document.getElementById('fuelQuoteTableBody').innerHTML).toContain('2023-04-01');
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith('/fuelquoteform', { method: 'GET' });
      done();
    });
  });

  it('should submit fuel quote form correctly', (done) => {
    document.body.innerHTML = `
      <form id="fuelQuoteForm"></form>
      <input id="gallonsRequested" value="150" />
      <input id="deliveryAddress" value="123 Test St" />
      <input id="deliveryDate" value="2023-05-01" />
      <input id="suggestedPrice" value="2.5" />
      <input id="totalAmountDue" value="375" />
    `;

    fetch.mockResponseOnce(JSON.stringify({ message: 'Success' }));

    const form = document.getElementById('fuelQuoteForm');
    form.dispatchEvent(new Event('submit', {preventDefault: () => {}}));

    process.nextTick(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith('/updatefuelquotehistory', expect.objectContaining({
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          username: 'testUser',
          gallonsRequested: 150,
          deliveryAddress: '123 Test St',
          deliveryDate: '2023-05-01',
          suggestedPricePerGallon: 2.5,
          totalAmountDue: 375
        }),
      }));
      done();
    });
  });

  // 可以添加更多的测试用例
});
