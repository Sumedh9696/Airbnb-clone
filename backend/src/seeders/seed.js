const dotenv = require('dotenv');
const { sequelize, User, Listing, Booking, Review } = require('../models');

dotenv.config();

const seedData = async () => {
  try {
    console.log('[Seeder] Connecting to database...');
    await sequelize.authenticate();
    
    // Force sync drops all tables and recreates them
    console.log('[Seeder] Resetting tables...');
    await sequelize.sync({ force: true });

    console.log('[Seeder] Creating users...');
    
    // Hosts
    const host1 = await User.create({
      name: 'Sarah Jenkins',
      email: 'sarah.host@example.com',
      password: 'password123',
      role: 'host',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
      bio: 'Superhost with 6 years of experience welcoming guests around the Mediterranean.'
    });

    const host2 = await User.create({
      name: 'Kenji Takahashi',
      email: 'kenji.host@example.com',
      password: 'password123',
      role: 'host',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      bio: 'Architect and lover of traditional Japanese craftsmanship and alpine retreats.'
    });

    // Guests
    const guest1 = await User.create({
      name: 'Alex Rivera',
      email: 'alex.guest@example.com',
      password: 'password123',
      role: 'guest',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
      bio: 'Travel photographer and digital nomad exploring unique spaces worldwide.'
    });

    const guest2 = await User.create({
      name: 'Elena Rostova',
      email: 'elena.guest@example.com',
      password: 'password123',
      role: 'guest',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
      bio: 'Designer on the hunt for beautiful light and cozy work-from-anywhere homes.'
    });

    console.log('[Seeder] Creating listings...');
    const listings = await Listing.bulkCreate([
      {
        title: 'Minimalist Cliffside Villa with Panoramic Aegean View',
        description: 'Perched high above the caldera in Oia, this cave-style villa combines iconic whitewashed Cycladic architecture with ultra-modern luxury. Enjoy the private heated infinity plunge pool overlooking sunset seas.',
        category: 'Beachfront',
        propertyType: 'Villa',
        roomType: 'Entire place',
        address: 'Nikolaou Nomikou 42',
        city: 'Oia, Santorini',
        country: 'Greece',
        latitude: 36.4618,
        longitude: 25.3753,
        pricePerNight: 480,
        cleaningFee: 85,
        maxGuests: 4,
        bedrooms: 2,
        beds: 2,
        bathrooms: 2,
        amenities: ['Wifi', 'Pool', 'Air conditioning', 'Kitchen', 'Hot tub', 'Ocean view', 'Free parking'],
        images: [
          'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
        ],
        hostId: host1.id
      },
      {
        title: 'Glass Forest Cabin in Swiss Alpine Pines',
        description: 'Immerse yourself in breathtaking nature nestled among larch and pine trees in Grindelwald. Featuring floor-to-ceiling glass walls, a cedar wood-burning sauna, and immediate ski-in/ski-out access.',
        category: 'Cabins',
        propertyType: 'Cabin',
        roomType: 'Entire place',
        address: 'Dorfstrasse 115',
        city: 'Grindelwald',
        country: 'Switzerland',
        latitude: 46.6242,
        longitude: 8.0414,
        pricePerNight: 340,
        cleaningFee: 60,
        maxGuests: 3,
        bedrooms: 1,
        beds: 2,
        bathrooms: 1,
        amenities: ['Wifi', 'Indoor fireplace', 'Sauna', 'Mountain view', 'Dedicated workspace', 'Kitchen', 'Ski-in/Ski-out'],
        images: [
          'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80'
        ],
        hostId: host2.id
      },
      {
        title: 'Modern Bamboo Eco-Sanctuary Over Jungle River',
        description: 'An architectural masterpiece sculpted entirely out of locally harvested giant bamboo. Features private plunge pool, open-air living pavilions, and sweeping views across the sacred Ayung River valley.',
        category: 'Trending',
        propertyType: 'Villa',
        roomType: 'Entire place',
        address: 'Jl. Raya Sayan',
        city: 'Ubud, Bali',
        country: 'Indonesia',
        latitude: -8.5069,
        longitude: 115.2625,
        pricePerNight: 290,
        cleaningFee: 40,
        maxGuests: 4,
        bedrooms: 2,
        beds: 2,
        bathrooms: 2,
        amenities: ['Wifi', 'Private pool', 'Breakfast included', 'Outdoor shower', 'Kitchen', 'Air conditioning'],
        images: [
          'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80'
        ],
        hostId: host1.id
      },
      {
        title: 'SoHo Artist Loft with Skylights & Exposed Brick',
        description: 'Classic 14-foot ceiling loft in prime cast-iron SoHo. Handcrafted mid-century furniture, vintage vinyl collection, chef kitchen, and bathed in southern light all afternoon.',
        category: 'Iconic cities',
        propertyType: 'Apartment',
        roomType: 'Entire place',
        address: 'Prince Street & Mercer',
        city: 'New York, NY',
        country: 'United States',
        latitude: 40.7247,
        longitude: -73.9987,
        pricePerNight: 395,
        cleaningFee: 75,
        maxGuests: 2,
        bedrooms: 1,
        beds: 1,
        bathrooms: 1.5,
        amenities: ['Wifi', 'Elevator', 'Dedicated workspace', 'Chef kitchen', 'Washer/Dryer', 'Smart TV'],
        images: [
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80'
        ],
        hostId: host1.id
      },
      {
        title: 'Historic Machiya Townhouse near Gion Bamboo Garden',
        description: '110-year-old traditional Kyoto townhouse lovingly renovated with modern comforts. Featuring tatami mat master rooms, private tsuboniwa courtyard garden, and hinoki cypress soaking tub.',
        category: 'Iconic cities',
        propertyType: 'House',
        roomType: 'Entire place',
        address: 'Miyagawacho 3-chome',
        city: 'Kyoto',
        country: 'Japan',
        latitude: 34.9984,
        longitude: 135.7725,
        pricePerNight: 275,
        cleaningFee: 45,
        maxGuests: 4,
        bedrooms: 2,
        beds: 3,
        bathrooms: 1,
        amenities: ['Wifi', 'Japanese garden view', 'Hinoki cypress tub', 'Air conditioning', 'Tea ceremony set'],
        images: [
          'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1528164344705-475426879c0d?auto=format&fit=crop&w=1200&q=80'
        ],
        hostId: host2.id
      },
      {
        title: 'Secluded Lake Como Waterfront Residence',
        description: 'Direct lakefront access with private stone boat dock and sun terrace. Floor to ceiling windows capture sunlight dancing across Bellagio and the surrounding alpine peaks.',
        category: 'Lake',
        propertyType: 'Villa',
        roomType: 'Entire place',
        address: 'Via Regina 18',
        city: 'Lake Como',
        country: 'Italy',
        latitude: 45.9898,
        longitude: 9.2618,
        pricePerNight: 550,
        cleaningFee: 90,
        maxGuests: 6,
        bedrooms: 3,
        beds: 3,
        bathrooms: 3,
        amenities: ['Wifi', 'Private dock', 'Waterfront', 'Free parking', 'Air conditioning', 'Fireplace'],
        images: [
          'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80'
        ],
        hostId: host1.id
      }
    ]);

    console.log('[Seeder] Creating reviews...');
    await Review.bulkCreate([
      {
        listingId: listings[0].id,
        userId: guest1.id,
        rating: 5,
        cleanliness: 5,
        accuracy: 5,
        communication: 5,
        location: 5,
        checkIn: 5,
        value: 5,
        comment: 'Absolute paradise. Watching the sunset directly from the private plunge pool was an experience we will remember for life. Sarah was an attentive and wonderful host.'
      },
      {
        listingId: listings[0].id,
        userId: guest2.id,
        rating: 5,
        cleanliness: 5,
        accuracy: 5,
        communication: 5,
        location: 5,
        checkIn: 5,
        value: 4,
        comment: 'Every detail in this villa is pristine. Immaculate view, crystal clear directions, and the morning breakfast service was delicious.'
      },
      {
        listingId: listings[1].id,
        userId: guest1.id,
        rating: 5,
        cleanliness: 5,
        accuracy: 5,
        communication: 5,
        location: 5,
        checkIn: 5,
        value: 5,
        comment: 'The glass sauna in the snow alone was worth the flight. Truly magical place. We will be coming back every winter!'
      },
      {
        listingId: listings[2].id,
        userId: guest2.id,
        rating: 4.8,
        cleanliness: 5,
        accuracy: 5,
        communication: 5,
        location: 5,
        checkIn: 5,
        value: 5,
        comment: 'Staying in this bamboo architectural marvel felt like living inside art. The soothing sound of the river made falling asleep a dream.'
      }
    ]);

    console.log('[Seeder] Creating initial bookings...');
    await Booking.create({
      listingId: listings[0].id,
      userId: guest1.id,
      startDate: '2026-12-01',
      endDate: '2026-12-05',
      totalNights: 4,
      nightlyPrice: 480,
      cleaningFee: 85,
      serviceFee: 230.4,
      totalPrice: 2235.4,
      guestCount: 2,
      status: 'confirmed'
    });

    console.log('[Seeder] Database successfully seeded! 🎉');
    console.log('-------------------------------------------');
    console.log('Demo Credentials:');
    console.log('Host Account:  sarah.host@example.com / password123');
    console.log('Host Account:  kenji.host@example.com / password123');
    console.log('Guest Account: alex.guest@example.com / password123');
    console.log('Guest Account: elena.guest@example.com / password123');
    console.log('-------------------------------------------');

    process.exit(0);
  } catch (error) {
    console.error('[Seeder] Failed to seed data:', error);
    process.exit(1);
  }
};

seedData();
