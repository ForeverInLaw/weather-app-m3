'use client';

import React from 'react';
import { Box, Typography, Card, CardContent, Avatar } from '@mui/material';
import { CurrentWeather as CurrentWeatherData } from '@/services/weatherService'; 

// MUI Icons - Import all that might be needed for mapping
import WbSunnyIcon from '@mui/icons-material/WbSunny'; // Sunny/Clear
import CloudIcon from '@mui/icons-material/Cloud'; // Cloudy
import GrainIcon from '@mui/icons-material/Grain'; // Rain
import AcUnitIcon from '@mui/icons-material/AcUnit'; // Snow
import ThunderstormIcon from '@mui/icons-material/Thunderstorm'; // Thunder
import DehazeIcon from '@mui/icons-material/Dehaze'; // Fog/Mist replacement
import NightsStayIcon from '@mui/icons-material/NightsStay'; // Clear night
import FilterDramaIcon from '@mui/icons-material/FilterDrama'; // Partly cloudy, Overcast
import WaterDropIcon from '@mui/icons-material/WaterDrop'; // Drizzle/Light rain

interface CurrentWeatherProps {
  data: CurrentWeatherData;
  cityName?: string;
}

// Helper to map WeatherAPI.com condition text/code to MUI Icon
// WeatherAPI condition codes: https://www.weatherapi.com/docs/weather_conditions.json
const getWeatherMuiIcon = (conditionText: string, isDay: boolean = true, iconUrl?: string): React.ReactElement => {
  const text = conditionText.toLowerCase();
  let MuiIconComponent = isDay ? WbSunnyIcon : NightsStayIcon; // Default

  if (iconUrl) { // We can extract code from iconUrl if needed, e.g. 113.png -> code 1000
    const parts = iconUrl.split('/');
    const iconName = parts[parts.length -1]; // e.g., 113.png
    const codeStr = iconName.split('.')[0];
    const code = parseInt(codeStr, 10);

    switch (code) {
      case 1000: MuiIconComponent = isDay ? WbSunnyIcon : NightsStayIcon; break; // Sunny / Clear
      case 1003: MuiIconComponent = FilterDramaIcon; break; // Partly cloudy
      case 1006: MuiIconComponent = CloudIcon; break; // Cloudy
      case 1009: MuiIconComponent = FilterDramaIcon; break; // Overcast (use FilterDrama for more clouds)
      case 1030: MuiIconComponent = DehazeIcon; break; // Mist 
      case 1063: // Patchy rain possible
      case 1150: // Patchy light drizzle
      case 1153: // Light drizzle
      case 1180: // Patchy light rain
      case 1183: MuiIconComponent = WaterDropIcon; break; // Light Rain / Drizzle
      case 1066: // Patchy snow possible
      case 1210: // Patchy light snow
      case 1213: MuiIconComponent = AcUnitIcon; break; // Light Snow
      case 1087: MuiIconComponent = ThunderstormIcon; break; // Thundery outbreaks possible
      case 1114: // Blowing snow
      case 1117: MuiIconComponent = AcUnitIcon; break; // Blizzard (use AcUnit)
      case 1135: // Fog
      case 1147: MuiIconComponent = DehazeIcon; break; // Freezing fog
      case 1186: // Moderate rain at times
      case 1189: // Moderate rain
      case 1192: // Heavy rain at times
      case 1195: MuiIconComponent = GrainIcon; break; // Heavy Rain
      case 1216: // Patchy moderate snow
      case 1219: // Moderate snow
      case 1222: // Patchy heavy snow
      case 1225: MuiIconComponent = AcUnitIcon; break; // Heavy Snow
      case 1240: // Light rain shower
      case 1243: // Moderate or heavy rain shower
      case 1246: MuiIconComponent = GrainIcon; break; // Torrential rain shower
      case 1273: // Patchy light rain with thunder
      case 1276: MuiIconComponent = ThunderstormIcon; break; // Moderate or heavy rain with thunder
      // Add more mappings as needed
      default:
        // Fallback based on text if code not matched
        if (text.includes("sunny") || text.includes("clear")) MuiIconComponent = isDay ? WbSunnyIcon : NightsStayIcon;
        else if (text.includes("partly cloudy")) MuiIconComponent = FilterDramaIcon;
        else if (text.includes("cloudy") || text.includes("overcast")) MuiIconComponent = CloudIcon;
        else if (text.includes("rain") || text.includes("drizzle")) MuiIconComponent = GrainIcon;
        else if (text.includes("snow") || text.includes("sleet") || text.includes("ice pellets")) MuiIconComponent = AcUnitIcon;
        else if (text.includes("thunder")) MuiIconComponent = ThunderstormIcon;
        else if (text.includes("fog") || text.includes("mist")) MuiIconComponent = DehazeIcon; 
        break;
    }
  } else { // Fallback if no iconUrl to derive code
      if (text.includes("sunny") || text.includes("clear")) MuiIconComponent = isDay ? WbSunnyIcon : NightsStayIcon;
      else if (text.includes("partly cloudy")) MuiIconComponent = FilterDramaIcon;
      else if (text.includes("cloudy") || text.includes("overcast")) MuiIconComponent = CloudIcon;
      else if (text.includes("rain") || text.includes("drizzle")) MuiIconComponent = GrainIcon;
      else if (text.includes("snow") || text.includes("sleet") || text.includes("ice pellets")) MuiIconComponent = AcUnitIcon;
      else if (text.includes("thunder")) MuiIconComponent = ThunderstormIcon;
      else if (text.includes("fog") || text.includes("mist")) MuiIconComponent = DehazeIcon;
  }


  return <MuiIconComponent sx={{ fontSize: 60 }} />;
};


const CurrentWeather: React.FC<CurrentWeatherProps> = ({ data, cityName }) => {
  if (!data) return null;

  const weatherCondition = data.weather && data.weather.length > 0 ? data.weather[0] : null;
  const weatherDescription = weatherCondition ? weatherCondition.description : 'N/A';
  // WeatherAPI provides is_day in current object, but not directly in the weather array.
  // We'll assume 'is_day' from the parent 'current' object in WeatherAPI response applies.
  // This is now part of CurrentWeatherData (our unified interface) as data.is_day
  const isDay = data.is_day === 1;

  return (
    <Card sx={{ mb: 3, borderRadius: 4, boxShadow: 3, backgroundColor: theme => theme.palette.background.paper }}>
      <CardContent sx={{ textAlign: 'center' }}>
        {cityName && (
          <Typography variant="h4" component="h2" gutterBottom>
            {cityName}
          </Typography>
        )}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.light', width: 80, height: 80, mr: 2 }}>
            {weatherCondition ? getWeatherMuiIcon(weatherCondition.main, isDay, weatherCondition.icon) : <WbSunnyIcon sx={{ fontSize: 60 }} />}
          </Avatar>
          <Box>
            <Typography variant="h2" component="p" sx={{ fontWeight: 'bold' }}>
              {Math.round(data.temp)}°C
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Feels like {Math.round(data.feels_like)}°C
            </Typography>
          </Box>
        </Box>
        <Typography variant="h6" sx={{ textTransform: 'capitalize' }}>
          {weatherDescription}
        </Typography>
        {/* High/Low can be part of daily forecast, but sometimes shown with current */}
        {/* <Typography variant="body2">
          High: {data.temp_max}°C / Low: {data.temp_min}°C 
        </Typography> */}
      </CardContent>
    </Card>
  );
};

export default CurrentWeather;
