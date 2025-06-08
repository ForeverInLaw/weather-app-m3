'use client';

import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, CircularProgress, Alert, Fade, IconButton } from '@mui/material'; // Added Fade, IconButton
import Brightness4Icon from '@mui/icons-material/Brightness4'; // Icon for dark mode
import Brightness7Icon from '@mui/icons-material/Brightness7'; // Icon for light mode
import { useAppTheme } from '@/context/ThemeContext'; // Import theme context hook
import { getCurrentPosition } from '@/services/geolocationService';
// getAirQualityData removed, AirQualityData interface might still be used if weatherData.airQuality type needs it
import { getWeatherData, WeatherData, AirQualityData } from '@/services/weatherService'; 
import CurrentWeather from '@/components/CurrentWeather'; // Import the component
import DetailedInfo from '@/components/DetailedInfo'; // Import the component
import HourlyForecast from '@/components/HourlyForecast'; // Import the component
import DailyForecast from '@/components/DailyForecast'; // Import the component
import AdditionalInfo from '@/components/AdditionalInfo'; // Import the component

// Placeholder components (we will create these next)
// import CurrentWeatherComponent from '@/components/CurrentWeather';
// import DetailedInfoComponent from '@/components/DetailedInfo';
// import HourlyForecastComponent from '@/components/HourlyForecast';
// import DailyForecastComponent from '@/components/DailyForecast';
// import AdditionalInfoComponent from '@/components/AdditionalInfo';

interface Location {
  lat: number;
  lon: number;
}

export default function HomePage() {
  const [location, setLocation] = useState<Location | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  // airQuality state will now be derived from weatherData if it exists
  // const [airQuality, setAirQuality] = useState<AirQualityData | null>(null); // No longer separate state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { mode, toggleThemeMode } = useAppTheme();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const position = await getCurrentPosition();
        setLocation(position);
        const weather = await getWeatherData({ lat: position.lat, lon: position.lon });
        setWeatherData(weather);
        // Air quality is now part of 'weather' object: weather.airQuality
        // setAirQuality(weather.airQuality || null); // No longer needed to set separate state
      } catch (err: any) {
        setError(err.message || 'An unknown error occurred.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>Loading weather data...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!weatherData || !location) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="info">No weather data available.</Alert>
      </Container>
    );
  }

  const cityName = weatherData.locationName; // Use locationName from WeatherData
  const airQuality = weatherData.airQuality; // Get airQuality from weatherData

  return (
    <Container sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h3" component="h1" sx={{ textAlign: 'center', flexGrow: 1 }}>
          {cityName ? `Weather in ${cityName}` : 'Weather in Your Location'}
        </Typography>
        <IconButton sx={{ ml: 1 }} onClick={toggleThemeMode} color="inherit" aria-label="toggle theme mode">
          {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </Box>
      
      {/* Placeholder for City Name - OpenWeatherMap usually returns city name with OneCall API, or we might need a reverse geocoding step */}
      {/* <Typography variant="h5" component="h2" gutterBottom sx={{ textAlign: 'center', mb: 2 }}>
        City: {weatherData.timezone ? weatherData.timezone.split('/')[1].replace('_', ' ') : 'Loading...'}
      </Typography> */}

      <Fade in={!loading} timeout={800}>
        <div> {/* Fade needs a single child, or use React.Fragment if it causes layout issues */}
          <CurrentWeather data={weatherData.current} cityName={cityName} />
          <DetailedInfo data={weatherData.current} />
          <HourlyForecast data={weatherData.hourly} />
          <DailyForecast data={weatherData.daily} />
          <AdditionalInfo 
            currentWeather={weatherData.current} 
            dailyForecast={weatherData.daily} 
            airQuality={airQuality} 
          />
        </div>
      </Fade>

    </Container>
  );
}
