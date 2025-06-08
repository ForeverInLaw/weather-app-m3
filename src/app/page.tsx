'use client';

import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, CircularProgress, Alert, Fade, IconButton, Button } from '@mui/material'; // Added Button
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import LocationOnIcon from '@mui/icons-material/LocationOn'; // For a "grant location" button
import { useAppTheme } from '@/context/ThemeContext';
import { getCurrentPosition } from '@/services/geolocationService';
import { getWeatherData, WeatherData } from '@/services/weatherService';
import CurrentWeather from '@/components/CurrentWeather';
import DetailedInfo from '@/components/DetailedInfo';
import HourlyForecast from '@/components/HourlyForecast';
import DailyForecast from '@/components/DailyForecast';
import AdditionalInfo from '@/components/AdditionalInfo';

interface Location {
  lat: number;
  lon: number;
}

export default function HomePage() {
  const [location, setLocation] = useState<Location | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { mode, toggleThemeMode } = useAppTheme();

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    setWeatherData(null); // Clear previous data on new fetch attempt

    try {
      console.log("Attempting getCurrentPosition...");
      const position = await getCurrentPosition();
      console.log("getCurrentPosition success:", position);
      setLocation(position);

      console.log(`Fetching weather for: ${position.lat}, ${position.lon}`);
      const weather = await getWeatherData({ lat: position.lat, lon: position.lon });
      setWeatherData(weather);
      setError(null); // Clear any previous errors if successful
    } catch (err: any) {
      console.error("Error during data fetch:", err.message);
      setError(err.message || "Could not fetch weather data. Please ensure location services are enabled and try again.");
      setWeatherData(null); // Ensure no stale data is shown
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(); // Initial fetch on component mount
  }, []); 

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>Loading weather data...</Typography>
      </Container>
    );
  }

  // If there's an error (geolocation or weather API)
  if (error && !weatherData) { // Show error/prompt only if no weather data is successfully displayed
    return (
      <Container sx={{ mt: 4, textAlign: 'center' }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Please ensure location services are enabled in your browser and for this site.
        </Typography>
        <Button 
          variant="contained" 
          onClick={fetchData} 
          startIcon={<LocationOnIcon />}
        >
          Retry / Grant Location
        </Button>
      </Container>
    );
  }
  
  // If no data and no error (should be rare, but a fallback)
  if (!weatherData || !location) {
    return (
      <Container sx={{ mt: 4, textAlign: 'center' }}>
        <Alert severity="warning">Weather data is currently unavailable. Please try again.</Alert>
        <Button 
          variant="outlined" 
          onClick={fetchData} 
          sx={{ mt: 2 }}
        >
          Retry
        </Button>
      </Container>
    );
  }

  // If data is successfully loaded:
  const cityName = weatherData.locationName;
  const airQuality = weatherData.airQuality;

  return (
    <Container sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h3" component="h1" sx={{ textAlign: 'center', flexGrow: 1, fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem'} } }>
          {cityName ? `Weather in ${cityName}` : 'Weather in Your Location'}
        </Typography>
        <IconButton sx={{ ml: 1 }} onClick={toggleThemeMode} color="inherit" aria-label="toggle theme mode">
          {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </Box>
      
      <Fade in={!!weatherData} timeout={800}> 
        <div> 
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
