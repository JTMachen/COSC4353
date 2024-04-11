// fuelquoteform.test.js
describe('fuel quote form test', () => {
    beforeEach(() => {
        // 先模拟 sessionStorage
    global.sessionStorage = {
        getItem: jest.fn().mockReturnValue(JSON.stringify({ username: 'testUser' })),
        setItem: jest.fn(),
        clear: jest.fn(),
        removeItem: jest.fn()
    };
        // 显式地将 fetch 模拟为 Jest mock 函数
    global.fetch = jest.fn().mockImplementation(() =>
        Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ message: 'Success' }),
        })
    );
        // 清除mocks
        fetch.mockClear();
        sessionStorage.getItem.mockClear();
        
        // 模拟sessionStorage
        global.sessionStorage = {
            getItem: jest.fn().mockReturnValue(JSON.stringify({ username: 'testUser' })),
        };

        // 模拟fetch
        global.fetch = jest.fn().mockImplementation(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ message: 'Success' }),
            })
        );

        // 设置DOM
        document.body.innerHTML = `
            <form id="fuelQuoteForm">
                <input id="gallonsRequested">
                <input id="deliveryAddress">
                <input id="deliveryDate">
                <input id="suggestedPrice">
                <input id="totalAmountDue">
            </form>
            <tbody id="fuelQuoteTableBody"></tbody>
        `;

        // 动态引入脚本
        jest.resetModules();
        require('../public/pages/fuel quote form page/fuel quote form/fuelquoteform.js'); // 更新为实际路径
    });

    it('successful submitted data from fuel quote form', async () => {
        // 设置输入值
        document.getElementById('gallonsRequested').value = '100';
        document.getElementById('deliveryAddress').value = '123 Main St';
        document.getElementById('deliveryDate').value = '2024-04-15';
        document.getElementById('suggestedPrice').value = '2.50';
        document.getElementById('totalAmountDue').value = '250';

        // 模拟表单提交
        const form = document.getElementById('fuelQuoteForm');
    
        // 修正：直接创建一个 'submit' 事件
        const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
        
        // 添加监听器来阻止默认行为
        form.addEventListener('submit', function(event) {
            event.preventDefault();
        });

        // 触发事件
        form.dispatchEvent(submitEvent);

        

        // 等待异步操作完成
        await new Promise(process.nextTick);

        // 断言fetch被正确调用
        expect(fetch).toHaveBeenCalledWith('/updatefuelquotehistory', {
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