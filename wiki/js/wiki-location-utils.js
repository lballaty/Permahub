/*
 * File: src/wiki/js/wiki-location-utils.js
 * Description: Shared helpers for accessing the user's "My Location"
 *              settings and basic distance calculations for wiki pages.
 */

/**
 * Get cached "My Location" from localStorage
 * Returns { label, lat, lng } or null if not set/invalid.
 */
export function getMyLocationFromCache() {
  try {
    const raw = localStorage.getItem('myLocation');
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (
      !parsed ||
      typeof parsed !== 'object'
    ) {
      return null;
    }

    const lat = typeof parsed.lat === 'number' ? parsed.lat : null;
    const lng = typeof parsed.lng === 'number' ? parsed.lng : null;

    if (lat == null || lng == null) {
      return {
        label: parsed.label || '',
        lat: null,
        lng: null
      };
    }

    return {
      label: parsed.label || '',
      lat,
      lng
    };
  } catch (error) {
    console.warn('⚠️ Unable to parse myLocation from localStorage:', error);
    return null;
  }
}

/**
 * Calculate distance between two coordinates in kilometers using
 * the Haversine formula. Returns null if any coordinate is missing.
 */
export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  if (
    lat1 == null || lon1 == null ||
    lat2 == null || lon2 == null
  ) {
    return null;
  }

  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

