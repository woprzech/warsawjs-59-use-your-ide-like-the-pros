import * as nock from 'nock';

describe('api connector', () => {


    beforeEach(() => {
        process.env.testApiPath = 'https://localhost:8888/';

        jest.resetModules();
    });

    afterEach(() => {
    });

    test('retrieves customer successfully', async () => {
        nock('https://localhost:8888')
            .get('/customers?phone=%2B48500500500')
        .reply(200, {id: 'id'});

        const customer = await getCustomer('+48500500500');

        expect(customer).toEqual({id: 'id'});

    });

    test('tries to retrieve not existing customer', async () => {
        nock('https://localhost:8888')
            .get('/customers?phone=%2B48500500500')
            .reply(404, {});

        const customer = await getCustomer('+48500500500');

        expect(customer).not.toBeDefined();

    });

    test('tries to retrieve customer but receives an error', async () => {
        expect.assertions(1);
        nock('https://localhost:8888');
            .get('/customers?phone=%2B48500500500')
            .reply(500);

        await expect(getCustomer('+48500500500')).rejects.toBeDefined();

    });

    test('retrieves customer reservations successfully', async () => {
        nock('https://localhost:8888')
            .get('/customers/customer-id/reservations')
            .reply(200, [{id: 'reservationId'}]);

        const reservations = await clientReservations('customer-id');

        expect(reservations).toEqual([{id: 'reservationId'}]);

    });

    test('tries to retrieve reservations of not existing customer', async () => {
        nock('https://localhost:8888')
            .get('/customers/customer-id/reservations')
            .reply(404, {});

        const reservations = await clientReservations('customer-id');

        expect(reservations).toEqual([]);

    });

    test('tries to retrieve customer reservations but receives an error', async () => {
        expect.assertions(1);
        nock('https://localhost:8888')
            .get('/customers/customer-id/reservations')
            .reply(500);

        await expect(clientReservations('customer-id')).rejects.toBeDefined();

    });

    test('retrieves customer active vouchers', async () => {
        const customerId = 'customer-id';

        expect.assertions(1);
        nock('https://localhost:8888')
            .get(`/customers/${customerId}/vouchers`)
            .reply(200, [{
                name: 'Karnet na strzyżenie i farbowanie',
                entries: {
                    left: 1
                }
            }]);

        const result = await clientActiveVouchers(customerId);

        expect(result).toEqual(
            [{
                name: 'Karnet na strzyżenie i farbowanie',
                entries: {
                    left: 1
                }
            }]
        );
    });
});

function clientReservations(customerId: string) {

}

function getCustomer(s: string) {

}

function clientActiveVouchers(customerId: string) {

}

