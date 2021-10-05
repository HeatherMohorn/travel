import { getLatLong } from '../client/index.js'


test('If you input Toronto then we should get Canada as the country property', async () => {
    const data = await getLatLong('Toronto');
    expect(data['countryName']).toEqual('Canada');
});
