'use client';

import React from 'react';
import { Paper, Typography, Box } from '@mui/material'; // Removed Grid
// Use the direct exported names from the updated weatherService.ts
import { CurrentWeather, AirQualityData, DailyForecast } from '@/services/weatherService'; 
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined'; // Sunrise/Sunset
import BrightnessHighIcon from '@mui/icons-material/BrightnessHigh'; // UV Index
import AirIcon from '@mui/icons-material/Air'; // Air Quality
import NightsStayIcon from '@mui/icons-material/NightsStay'; // Moon phase

interface InfoItemProps {
  icon: React.ReactElement;
  label: string;
  value: string | number;
  unit?: string;
  color?: string; // For AQI/UVI color coding
}

const InfoItem: React.FC<InfoItemProps> = ({ icon, label, value, unit, color }) => (
  <Paper 
    elevation={1} // M3 often uses less prominent shadows, relying on surface color
    sx={{ 
      p: 2, 
      textAlign: 'center', 
      borderRadius: (theme) => theme.shape.borderRadius,
      height: '100%', 
      backgroundColor: theme => theme.palette.background.paper, // Use theme's paper background color
      color: theme => theme.palette.text.primary, // Default text color
      border: theme => `1px solid ${theme.palette.divider}`, // Subtle border for all items
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', mb: 0.5, 
               color: 'text.primary' // Use the main text color for icons and labels
    }}>
      {React.cloneElement(icon, { sx: { fontSize: 32, mb: 0.5 }, color: 'inherit' } as any)} {/* Added color: 'inherit' */}
      <Typography variant="body2" sx={{ fontWeight: 'medium', lineHeight: 1.2,
                                       color: 'inherit' // Inherit from parent Box (text.primary)
      }}>
        {label}
      </Typography>
    </Box>
    <Typography variant="h6" component="p" sx={{ lineHeight: 1.3 }}> {/* M3 might use h6 or title.medium */}
      {value}
      {unit && <Typography component="span" variant="body2" sx={{ ml: 0.5 }}>{unit}</Typography>}
    </Typography>
  </Paper>
);

// Helper function to get AQI category and color (color part no longer used for icon/label directly)
const getAqiCategory = (aqi: number): { category: string; /* color: string */ } => {
  if (aqi === 1) return { category: 'Good' /* , color: 'success' */ };
  if (aqi === 2) return { category: 'Fair' /* , color: 'info' */ };
  if (aqi === 3) return { category: 'Moderate' /* , color: 'warning' */ };
  if (aqi === 4) return { category: 'Poor' /* , color: 'error' */ };
  if (aqi === 5) return { category: 'Very Poor' /* , color: 'error' */ };
  return { category: 'Unknown' /* , color: 'grey' */ };
};

// Helper function to get UVI category and color (color part no longer used for icon/label directly)
const getUviCategory = (uvi: number): { category: string; /* color: string */ } => {
  if (uvi <= 2) return { category: `Low (${uvi.toFixed(1)})` /* , color: 'success' */ };
  if (uvi <= 5) return { category: `Moderate (${uvi.toFixed(1)})` /* , color: 'info' */ };
  if (uvi <= 7) return { category: `High (${uvi.toFixed(1)})` /* , color: 'warning' */ };
  if (uvi <= 10) return { category: `Very High (${uvi.toFixed(1)})` /* , color: 'error' */ };
  return { category: `Extreme (${uvi.toFixed(1)})` /* , color: 'error' */ };
};

// Helper function to get Moon Phase
const getMoonPhaseName = (phase: number): string => {
    if (phase === 0 || phase === 1) return "New Moon";
    if (phase > 0 && phase < 0.25) return "Waxing Crescent";
    if (phase === 0.25) return "First Quarter";
    if (phase > 0.25 && phase < 0.5) return "Waxing Gibbous";
    if (phase === 0.5) return "Full Moon";
    if (phase > 0.5 && phase < 0.75) return "Waning Gibbous";
    if (phase === 0.75) return "Last Quarter";
    if (phase > 0.75 && phase < 1) return "Waning Crescent";
    return "Unknown";
};


interface AdditionalInfoProps {
  currentWeather: CurrentWeather; // Use the direct imported CurrentWeather type
  dailyForecast: DailyForecast[]; // Use the direct imported DailyForecast type
  airQuality?: AirQualityData | null; // Use the direct imported AirQualityData type
}

const AdditionalInfo: React.FC<AdditionalInfoProps> = ({ currentWeather, dailyForecast, airQuality }) => {
  // sunrise and sunset are now strings like "06:00 AM" from WeatherAPI.com
  const sunriseTime = currentWeather.sunrise; 
  const sunsetTime = currentWeather.sunset;
  
  const uviData = getUviCategory(currentWeather.uv); 
  const aqiValue = airQuality?.aqi; 
  const aqiData = typeof aqiValue === 'number' ? getAqiCategory(aqiValue) : { category: 'N/A' };
  
  // Moon phase is typically in daily forecast data
  const todayMoonPhaseValue = dailyForecast?.[0]?.moon_phase;
  const moonPhaseName = typeof todayMoonPhaseValue === 'number' ? getMoonPhaseName(todayMoonPhaseValue) : 'N/A';


  return (
    <Box sx={{ my: 3 }}>
      <Typography variant="h5" component="h3" gutterBottom sx={{ mb: 2 }}>
        Additional Information
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2, // Spacing between items
        }}
      >
        <Box sx={{ flexBasis: { xs: 'calc(50% - 8px)', sm: 'calc(33.33% - 11px)', md: 'calc(20% - 13px)' }, flexGrow: 1 }}>
          <InfoItem
            icon={<WbSunnyOutlinedIcon />}
            label="Sunrise"
            value={sunriseTime}
          />
        </Box>
        <Box sx={{ flexBasis: { xs: 'calc(50% - 8px)', sm: 'calc(33.33% - 11px)', md: 'calc(20% - 13px)' }, flexGrow: 1 }}>
          <InfoItem
            icon={<WbSunnyOutlinedIcon sx={{ transform: 'scaleY(-1)' }} />} // Flip for sunset
            label="Sunset"
            value={sunsetTime}
          />
        </Box>
        <Box sx={{ flexBasis: { xs: 'calc(50% - 8px)', sm: 'calc(33.33% - 11px)', md: 'calc(20% - 13px)' }, flexGrow: 1 }}>
          <InfoItem
            icon={<BrightnessHighIcon />}
            label="UV Index"
            value={uviData.category}
            // color prop no longer used for background, icon/label color is now consistently primary
            // color={uviData.color} 
          />
        </Box>
        <Box sx={{ flexBasis: { xs: 'calc(50% - 8px)', sm: 'calc(33.33% - 11px)', md: 'calc(20% - 13px)' }, flexGrow: 1 }}>
          <InfoItem
            icon={<AirIcon />}
            label="Air Quality"
            value={aqiData.category}
            // color={aqiData.color}
          />
        </Box>
        <Box sx={{ flexBasis: { xs: 'calc(100% - 8px)', sm: 'calc(33.33% - 11px)', md: 'calc(20% - 13px)' }, flexGrow: 1 }}>
          <InfoItem
            icon={<NightsStayIcon />}
            label="Moon Phase"
            value={moonPhaseName}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default AdditionalInfo;
