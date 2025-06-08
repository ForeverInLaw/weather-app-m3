interface GeolocationPosition {
  coords: {
    latitude: number;
    longitude: number;
    accuracy: number;
    altitude: number | null;
    altitudeAccuracy: number | null;
    heading: number | null;
    speed: number | null;
  };
  timestamp: number;
}

// interface GeolocationError { // This custom interface is not needed if we use the global GeolocationPositionError
//   code: number;
//   message: string;
// }

export const getCurrentPosition = (timeoutMs: number = 10000): Promise<{ lat: number; lon: number }> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser."));
      return;
    }

    const timer = setTimeout(() => {
      reject(new Error("Geolocation request timed out."));
    }, timeoutMs);

    navigator.geolocation.getCurrentPosition(
      (position: GeolocationPosition) => {
        clearTimeout(timer);
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      (error: GeolocationPositionError) => { // Changed type to GeolocationPositionError
        clearTimeout(timer);
        switch (error.code) {
          case GeolocationPositionError.PERMISSION_DENIED:
            reject(new Error("User denied the request for Geolocation."));
            break;
          case GeolocationPositionError.POSITION_UNAVAILABLE:
            reject(new Error("Location information is unavailable."));
            break;
          case GeolocationPositionError.TIMEOUT: // This case might be redundant if our own timer fires first
            reject(new Error("The request to get user location timed out (browser)."));
            break;
          default:
            reject(new Error(`An unknown error occurred while getting location (Code: ${error.code}).`));
            break;
        }
      },
      { enableHighAccuracy: false, timeout: timeoutMs - 1000, maximumAge: 0 } // Added options
    );
  });
};
