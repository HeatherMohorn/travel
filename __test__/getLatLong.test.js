
import {getLatLong} from '../client/index.js'


test('If you enter Toronto it shouls return the country of Canada', async () => {
    const data = await getLatLong('Toronto');
    expect(data['countryName']).toEqual('Canada');
});
