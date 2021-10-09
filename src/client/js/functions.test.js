import { countdown } from './functions.js'


test('If you input today then the countdown should be 0', async () => {
    let today = new Date();
    const days = Math.abs(countdown(today));
    expect(days).toEqual(0);
});
