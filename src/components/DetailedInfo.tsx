'use client';

import React from 'react';
import { Paper, Typography, Box } from '@mui/material'; // Removed Grid
import { CurrentWeather as CurrentWeatherData } from '@/services/weatherService';
import OpacityIcon from '@mui/icons-material/Opacity'; // Humidity
import AirIcon from '@mui/icons-material/Air'; // Wind
import CompareArrowsIcon from '@mui/icons-material/CompareArrows'; // Pressure (using as a generic gauge icon)
import GrainIcon from '@mui/icons-material/Grain'; // Precipitation (using as a generic drops icon)

interface DetailItemProps {
  icon: React.ReactElement;
  label: string;
  value: string | number;
  unit?: string;
}

const DetailItem: React.FC<DetailItemProps> = ({ icon, label, value, unit }) => (
  <Paper elevation={2} sx={{ p: 2, textAlign: 'center', borderRadius: 3, height: '100%' }}>
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 1, color: 'primary.main' }}>
      {React.cloneElement(icon, { sx: { fontSize: 30, mr: 1 } } as any)}
      <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
        {label}
      </Typography>
    </Box>
    <Typography variant="h5" component="p">
      {value}
      {unit && <Typography component="span" variant="caption" sx={{ ml: 0.5 }}>{unit}</Typography>}
    </Typography>
  </Paper>
);

interface DetailedInfoProps {
  data: CurrentWeatherData;
}

const DetailedInfo: React.FC<DetailedInfoProps> = ({ data }) => {
  if (!data) return null;

  // Precipitation data might be in `data.rain?.['1h']` or `data.snow?.['1h']` from OpenWeatherMap
  // For OneCall API, current weather might not have direct precipitation probability,
  // it's usually in hourly/daily. We'll use a placeholder or adapt if the structure differs.
  // The `pop` (probability of precipitation) is available in hourly and daily forecasts.
  // For current, we might show current rain volume if available (e.g. data.rain['1h'])

  const precipitationValue = data.weather[0]?.main.toLowerCase().includes('rain') 
    ? 'Raining' 
    : (data.weather[0]?.main.toLowerCase().includes('snow') ? 'Snowing' : 'Clear');


  return (
    <Box sx={{ my: 3 }}>
      <Typography variant="h5" component="h3" gutterBottom sx={{ mb: 2 }}>
        Details
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2, // Spacing between items
        }}
      >
        <Box sx={{ flexBasis: { xs: 'calc(50% - 8px)', sm: 'calc(25% - 12px)' }, flexGrow: 1 }}>
          <DetailItem
            icon={<OpacityIcon />}
            label="Humidity"
            value={data.humidity}
            unit="%"
          />
        </Box>
        <Box sx={{ flexBasis: { xs: 'calc(50% - 8px)', sm: 'calc(25% - 12px)' }, flexGrow: 1 }}>
          <DetailItem
            icon={<AirIcon />}
            label="Wind"
            value={data.wind_speed.toFixed(1)}
            unit="m/s" // or km/h, convert if necessary
          />
        </Box>
        <Box sx={{ flexBasis: { xs: 'calc(50% - 8px)', sm: 'calc(25% - 12px)' }, flexGrow: 1 }}>
          <DetailItem
            icon={<CompareArrowsIcon />}
            label="Pressure"
            value={data.pressure}
            unit="hPa"
          />
        </Box>
        <Box sx={{ flexBasis: { xs: 'calc(50% - 8px)', sm: 'calc(25% - 12px)' }, flexGrow: 1 }}>
          <DetailItem
            icon={<GrainIcon />}
            label="Precipitation"
            value={precipitationValue} // This is a placeholder, adapt based on available data
            // unit="mm" // if showing amount
          />
        </Box>
      </Box>
    </Box>
  );
};

export default DetailedInfo;
