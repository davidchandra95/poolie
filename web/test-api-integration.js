// Simple Node.js script to test API integration
// This tests that the frontend can successfully call the backend API

const BASE_URL = 'http://localhost:8080/v1';

async function testSearchRides() {
  console.log('Testing /v1/rides/search endpoint...');

  const params = new URLSearchParams({
    origin: 'Jakarta',
    destination: 'Bandung',
    date: '2025-12-15',
    passengers: '2',
    type: 'all'
  });

  try {
    const response = await fetch(`${BASE_URL}/rides/search?${params.toString()}`);
    const data = await response.json();

    console.log('✓ Search rides endpoint successful');
    console.log(`  Total count: ${data.total_count}`);
    console.log(`  Carpool count: ${data.carpool_count}`);
    console.log(`  Bus count: ${data.bus_count}`);
    console.log(`  Rides returned: ${data.rides.length}`);

    if (data.rides.length > 0) {
      const firstRide = data.rides[0];
      console.log(`  First ride: ${firstRide.origin.city} → ${firstRide.destination.city}`);
      console.log(`  Price: ${firstRide.price.amount} ${firstRide.price.currency}`);
    }

    return data.rides.length > 0 ? data.rides[0].ride_id : null;
  } catch (error) {
    console.error('✗ Search rides endpoint failed:', error.message);
    throw error;
  }
}

async function testGetRideDetails(rideId) {
  console.log('\nTesting /v1/rides/:rideId endpoint...');

  try {
    const response = await fetch(`${BASE_URL}/rides/${rideId}`);
    const data = await response.json();

    console.log('✓ Get ride details endpoint successful');
    console.log(`  Ride ID: ${data.ride_id}`);
    console.log(`  Type: ${data.type}`);
    console.log(`  Driver: ${data.driver.name}`);
    console.log(`  Available seats: ${data.available_seats}`);
    console.log(`  Has vehicle info: ${!!data.vehicle}`);
    console.log(`  Has booking policies: ${!!data.booking_policies}`);

    return data.driver.user_id;
  } catch (error) {
    console.error('✗ Get ride details endpoint failed:', error.message);
    throw error;
  }
}

async function testGetUserProfile(userId) {
  console.log('\nTesting /v1/users/:userId/profile endpoint...');

  try {
    const response = await fetch(`${BASE_URL}/users/${userId}/profile`);
    const data = await response.json();

    console.log('✓ Get user profile endpoint successful');
    console.log(`  User ID: ${data.user_id}`);
    console.log(`  Name: ${data.name}`);
    console.log(`  Rating: ${data.rating} (${data.rating_count} reviews)`);
    console.log(`  Verified: ${data.verification.is_verified}`);
    console.log(`  Membership: ${data.membership_type}`);

    return true;
  } catch (error) {
    console.error('✗ Get user profile endpoint failed:', error.message);
    throw error;
  }
}

async function runTests() {
  console.log('='.repeat(60));
  console.log('Frontend-Backend Integration Tests');
  console.log('='.repeat(60));
  console.log();

  try {
    const rideId = await testSearchRides();

    if (!rideId) {
      console.log('\n⚠ No rides found in search results. Cannot test other endpoints.');
      console.log('Please ensure the database has been seeded with sample data.');
      return;
    }

    const userId = await testGetRideDetails(rideId);
    await testGetUserProfile(userId);

    console.log();
    console.log('='.repeat(60));
    console.log('✓ All integration tests passed!');
    console.log('='.repeat(60));
    console.log();
    console.log('Frontend is successfully integrated with the backend API.');
    console.log('You can now test the application in your browser at:');
    console.log('http://localhost:3000');

  } catch (error) {
    console.log();
    console.log('='.repeat(60));
    console.log('✗ Integration tests failed');
    console.log('='.repeat(60));
    console.error('Error:', error.message);
    process.exit(1);
  }
}

runTests();
