const test = require('node:test');
const assert = require('node:assert');
const app = require('../src/app');
const { sequelize } = require('../src/models');
let server;
let baseUrl;

test.before(async () => {
  await sequelize.sync({ force: true });
  await new Promise((resolve) => {
    server = app.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://localhost:${port}/api`;
      resolve();
    });
  });
});

test.after(async () => {
  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }
  await sequelize.close();
});

test('Airbnb Clone API Test Suite', async (t) => {
  let hostToken;
  let guestToken;
  let hostId;
  let guestId;
  let listingId;
  let bookingId;

  await t.test('1. Health Check Endpoint', async () => {
    const res = await fetch(`${baseUrl}/health`);
    const json = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(json.status, 'ok');
  });

  await t.test('2. Register Host & Guest Users', async () => {
    // Register Host
    const hostRes = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Super Host Test',
        email: 'host.test@example.com',
        password: 'password123',
        role: 'host'
      })
    });
    const hostData = await hostRes.json();
    assert.strictEqual(hostRes.status, 201);
    assert.ok(hostData.data.token);
    hostToken = hostData.data.token;
    hostId = hostData.data.user.id;

    // Register Guest
    const guestRes = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Guest Traveler Test',
        email: 'guest.test@example.com',
        password: 'password123',
        role: 'guest'
      })
    });
    const guestData = await guestRes.json();
    assert.strictEqual(guestRes.status, 201);
    assert.ok(guestData.data.token);
    guestToken = guestData.data.token;
    guestId = guestData.data.user.id;
  });

  await t.test('3. Auth Verification with /api/auth/me', async () => {
    const res = await fetch(`${baseUrl}/auth/me`, {
      headers: { Authorization: `Bearer ${hostToken}` }
    });
    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(data.data.email, 'host.test@example.com');
  });

  await t.test('4. Host Creates a New Listing', async () => {
    const res = await fetch(`${baseUrl}/listings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${hostToken}`
      },
      body: JSON.stringify({
        title: 'Seaside Sunset Villa Test',
        description: 'Stunning luxury villa overlooking the ocean with private pool.',
        category: 'Beachfront',
        propertyType: 'Villa',
        roomType: 'Entire place',
        address: '100 Ocean Blvd',
        city: 'Malibu',
        country: 'United States',
        latitude: 34.0259,
        longitude: -118.7798,
        pricePerNight: 350,
        cleaningFee: 50,
        maxGuests: 4,
        amenities: ['Wifi', 'Pool', 'Air conditioning']
      })
    });
    const data = await res.json();
    assert.strictEqual(res.status, 201);
    assert.strictEqual(data.data.title, 'Seaside Sunset Villa Test');
    listingId = data.data.id;
  });

  await t.test('5. Get Listings with Search & Filtering', async () => {
    const res = await fetch(`${baseUrl}/listings?city=Malibu&category=Beachfront`);
    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(data.count, 1);
    assert.strictEqual(data.data[0].id, listingId);
  });

  await t.test('6. Guest Books Listing Successfully', async () => {
    const res = await fetch(`${baseUrl}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${guestToken}`
      },
      body: JSON.stringify({
        listingId,
        startDate: '2027-01-10',
        endDate: '2027-01-15',
        guestCount: 2
      })
    });
    const data = await res.json();
    assert.strictEqual(res.status, 201);
    assert.strictEqual(data.data.totalNights, 5);
    bookingId = data.data.id;
  });

  await t.test('7. Overlap Validation Rejects Conflicting Dates (Double-Booking Prevention)', async () => {
    // Attempt to book overlapping dates: 2027-01-12 to 2027-01-17
    const res = await fetch(`${baseUrl}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${guestToken}`
      },
      body: JSON.stringify({
        listingId,
        startDate: '2027-01-12',
        endDate: '2027-01-17',
        guestCount: 2
      })
    });
    const data = await res.json();
    assert.strictEqual(res.status, 409); // Conflict
    assert.strictEqual(data.success, false);
    assert.match(data.message, /available/i);
  });

  await t.test('8. Leave a Review for the Listing', async () => {
    const res = await fetch(`${baseUrl}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${guestToken}`
      },
      body: JSON.stringify({
        listingId,
        rating: 5,
        comment: 'Incredible stay! The sunset views were unforgettable.'
      })
    });
    const data = await res.json();
    assert.strictEqual(res.status, 201);
    assert.strictEqual(data.data.rating, 5);
  });

  await t.test('9. Host Dashboard Metrics', async () => {
    const res = await fetch(`${baseUrl}/host/dashboard`, {
      headers: { Authorization: `Bearer ${hostToken}` }
    });
    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(data.data.stats.totalListings, 1);
    assert.strictEqual(data.data.stats.totalReservations, 1);
    assert.strictEqual(data.data.stats.averageHostRating, 5);
  });
});
