const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    const data = await response.json();
console.log(response, data)
    if (data.status === 'OK' && data.results.length > 0) {
      return data.results[0].formatted_address;
    }

    throw new Error('No results found for this location');
  } catch (error) {
    console.error('Geocoding error:', error);
    return 'Location not found';
  }
}
