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

export const getCurrentPosition = (timeoutMs: number = 10000): Promise<{ lat: number; lon: number }> => {
  return new Promise((resolve, reject) => {
    // let settled = false; // No longer using a boolean flag, will nullify resolve/reject
    let timer: NodeJS.Timeout | undefined = undefined;

    let doResolve: ((value: { lat: number; lon: number } | PromiseLike<{ lat: number; lon: number }>) => void) | null = resolve;
    let doReject: ((reason?: any) => void) | null = reject;

    const settleAndCleanup = () => {
      if (timer) {
        clearTimeout(timer);
        timer = undefined; // Clear timer variable as well
      }
      // Nullify the functions to prevent further calls
      doResolve = null;
      doReject = null;
    };

    if (!navigator.geolocation) {
      if (doReject) {
        doReject(new Error("Geolocation is not supported by your browser."));
      }
      settleAndCleanup();
      return;
    }

    timer = setTimeout(() => {
      if (doReject) {
        doReject(new Error("Geolocation request timed out."));
      }
      settleAndCleanup(); // Ensure cleanup even if doReject was already null
    }, timeoutMs);

    navigator.geolocation.getCurrentPosition(
      (position: GeolocationPosition) => {
        if (doResolve) {
          doResolve({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        }
        settleAndCleanup();
      },
      (error: GeolocationPositionError) => {
        let errMsg = `An unknown error occurred while getting location (Code: ${error.code}).`;
        switch (error.code) {
          case GeolocationPositionError.PERMISSION_DENIED:
            errMsg = "User denied the request for Geolocation.";
            break;
          case GeolocationPositionError.POSITION_UNAVAILABLE:
            errMsg = "Location information is unavailable.";
            break;
          case GeolocationPositionError.TIMEOUT:
            errMsg = "The request to get user location timed out (browser).";
            break;
        }
        if (doReject) {
          doReject(new Error(errMsg));
        }
        settleAndCleanup();
      },
      { enableHighAccuracy: false, timeout: timeoutMs - 1000, maximumAge: 0 }
    );
  });
};
