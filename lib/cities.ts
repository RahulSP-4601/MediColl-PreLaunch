/**
 * Comprehensive list of Indian cities for scraping
 * Covers major cities across all states
 */

export const INDIAN_CITIES = [
  // Tier 1 Cities (Metro)
  'Mumbai',
  'Delhi',
  'Bangalore',
  'Hyderabad',
  'Chennai',
  'Kolkata',
  'Pune',
  'Ahmedabad',

  // Tier 2 Cities
  'Surat',
  'Jaipur',
  'Lucknow',
  'Kanpur',
  'Nagpur',
  'Indore',
  'Thane',
  'Bhopal',
  'Visakhapatnam',
  'Vadodara',
  'Patna',
  'Ludhiana',
  'Agra',
  'Nashik',
  'Faridabad',
  'Meerut',
  'Rajkot',
  'Varanasi',
  'Srinagar',
  'Aurangabad',
  'Dhanbad',
  'Amritsar',
  'Navi Mumbai',
  'Allahabad',
  'Ranchi',
  'Howrah',
  'Coimbatore',
  'Jabalpur',
  'Gwalior',
  'Vijayawada',
  'Jodhpur',
  'Madurai',
  'Raipur',
  'Kota',

  // State Capitals & Important Cities
  'Chandigarh',
  'Thiruvananthapuram',
  'Guwahati',
  'Bhubaneswar',
  'Dehradun',
  'Shimla',
  'Imphal',
  'Aizawl',
  'Kohima',
  'Shillong',
  'Agartala',
  'Gangtok',
  'Itanagar',
  'Dispur',
  'Panaji',
  'Jaipur',
  'Lucknow',
  'Bhopal',
  'Raipur',
  'Ranchi',
  'Patna',

  // Major Tier 3 Cities
  'Mysore',
  'Gurgaon',
  'Noida',
  'Jalandhar',
  'Mangalore',
  'Tiruchirappalli',
  'Kochi',
  'Kozhikode',
  'Thrissur',
  'Salem',
  'Tiruppur',
  'Vellore',
  'Guntur',
  'Warangal',
  'Nellore',
  'Tirupati',
  'Jammu',
  'Udaipur',
  'Ajmer',
  'Bikaner',
  'Siliguri',
  'Durgapur',
  'Asansol',
  'Belgaum',
  'Hubli',
  'Gulbarga',
  'Ujjain',
  'Guwahati',
  'Cuttack',
  'Rourkela',
];

/**
 * Get a subset of cities for testing
 */
export function getTestCities(): string[] {
  return ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai'];
}

/**
 * Get cities by tier
 */
export function getCitiesByTier(tier: 1 | 2 | 3 | 'all' = 'all'): string[] {
  const tier1 = INDIAN_CITIES.slice(0, 8);
  const tier2 = INDIAN_CITIES.slice(8, 45);
  const tier3 = INDIAN_CITIES.slice(45);

  switch (tier) {
    case 1:
      return tier1;
    case 2:
      return tier2;
    case 3:
      return tier3;
    default:
      return INDIAN_CITIES;
  }
}

/**
 * Get random cities for distributed scraping
 */
export function getRandomCities(count: number): string[] {
  const shuffled = [...INDIAN_CITIES].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
