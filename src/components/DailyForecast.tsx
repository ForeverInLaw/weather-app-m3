'use client';

import React from 'react';
import { Box, Typography, Paper, Avatar, List, ListItem, ListItemAvatar, ListItemText, Divider } from '@mui/material';
import { DailyForecast as DailyForecastData } from '@/services/weatherService';

// MUI Icons - Import all that might be needed for mapping
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import CloudIcon from '@mui/icons-material/Cloud';
import GrainIcon from '@mui/icons-material/Grain';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import ThunderstormIcon from '@mui/icons-material/Thunderstorm';
import DehazeIcon from '@mui/icons-material/Dehaze';
import FilterDramaIcon from '@mui/icons-material/FilterDrama';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
// NightsStayIcon might not be relevant for daily summary, typically day icons are used

interface DailyForecastProps {
  data: DailyForecastData[];
}

// Helper to map WeatherAPI.com condition text/code to MUI Icon (simplified for daily)
const getWeatherMuiIcon = (conditionText: string, iconUrl?: string): React.ReactElement => {
  const text = conditionText.toLowerCase();
  let MuiIconComponent = WbSunnyIcon; // Default to day icon for daily summary
  const iconSize = 24; // Smaller icon for list items

  if (iconUrl) {
    const parts = iconUrl.split('/');
    const iconName = parts[parts.length -1];
    const codeStr = iconName.split('.')[0];
    const code = parseInt(codeStr, 10);

    switch (code) {
      case 1000: MuiIconComponent = WbSunnyIcon; break;
      case 1003: MuiIconComponent = FilterDramaIcon; break;
      case 1006: MuiIconComponent = CloudIcon; break;
      case 1009: MuiIconComponent = FilterDramaIcon; break;
      case 1030: MuiIconComponent = DehazeIcon; break;
      case 1063: case 1150: case 1153: case 1180: case 1183: MuiIconComponent = WaterDropIcon; break;
      case 1066: case 1210: case 1213: MuiIconComponent = AcUnitIcon; break;
      case 1087: MuiIconComponent = ThunderstormIcon; break;
      case 1114: case 1117: MuiIconComponent = AcUnitIcon; break;
      case 1135: case 1147: MuiIconComponent = DehazeIcon; break;
      case 1186: case 1189: case 1192: case 1195: MuiIconComponent = GrainIcon; break;
      case 1216: case 1219: case 1222: case 1225: MuiIconComponent = AcUnitIcon; break;
      case 1240: case 1243: case 1246: MuiIconComponent = GrainIcon; break;
      case 1273: case 1276: MuiIconComponent = ThunderstormIcon; break;
      default: // Fallback to text based
        if (text.includes("sunny") || text.includes("clear")) MuiIconComponent = WbSunnyIcon;
        else if (text.includes("partly cloudy")) MuiIconComponent = FilterDramaIcon;
        else if (text.includes("cloudy") || text.includes("overcast")) MuiIconComponent = CloudIcon;
        else if (text.includes("rain") || text.includes("drizzle")) MuiIconComponent = GrainIcon;
        else if (text.includes("snow") || text.includes("sleet")) MuiIconComponent = AcUnitIcon;
        else if (text.includes("thunder")) MuiIconComponent = ThunderstormIcon;
        else if (text.includes("fog") || text.includes("mist")) MuiIconComponent = DehazeIcon;
        break;
    }
  } else { // Fallback if no iconUrl to derive code
      if (text.includes("sunny") || text.includes("clear")) MuiIconComponent = WbSunnyIcon;
      else if (text.includes("partly cloudy")) MuiIconComponent = FilterDramaIcon;
      else if (text.includes("cloudy") || text.includes("overcast")) MuiIconComponent = CloudIcon;
      else if (text.includes("rain") || text.includes("drizzle")) MuiIconComponent = GrainIcon;
      else if (text.includes("snow") || text.includes("sleet")) MuiIconComponent = AcUnitIcon;
      else if (text.includes("thunder")) MuiIconComponent = ThunderstormIcon;
      else if (text.includes("fog") || text.includes("mist")) MuiIconComponent = DehazeIcon;
  }
  return <MuiIconComponent sx={{ fontSize: iconSize }} />;
};


const DailyForecast: React.FC<DailyForecastProps> = ({ data }) => {
  if (!data || data.length === 0) return null;

  // API usually returns 8 days (current + next 7), we might want to skip the first if it's today's detailed forecast
  // Or display all if it's structured as "Day 0, Day 1..."
  const displayData = data.slice(0, 7); // Show up to 7 days

  return (
    <Box sx={{ my: 3 }}>
      <Typography variant="h5" component="h3" gutterBottom sx={{ mb: 2 }}>
        Daily Forecast
      </Typography>
      <Paper elevation={2} sx={{ borderRadius: 3 }}>
        <List disablePadding>
          {displayData.map((day, index) => {
            const date = new Date(day.dt * 1000);
            const dayName = date.toLocaleDateString([], { weekday: 'long' });
            const shortDate = date.toLocaleDateString([], { month: 'short', day: 'numeric' });
            const weatherCondition = day.weather && day.weather.length > 0 ? day.weather[0] : null;
            
            return (
              <React.Fragment key={day.dt}>
                <ListItem sx={{ py: 1.5 }}>
                  <ListItemAvatar sx={{ mr: 1 }}>
                    <Avatar sx={{ bgcolor: 'transparent', color: 'primary.main', width: 40, height: 40 }}>
                      {weatherCondition ? getWeatherMuiIcon(weatherCondition.description, weatherCondition.icon) : <WbSunnyIcon />}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                        {index === 0 ? 'Today' : dayName}
                      </Typography>
                    }
                    secondary={shortDate + " - " + (day.weather[0]?.description || '')}
                  />
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                      {Math.round(day.temp.max)}° / {Math.round(day.temp.min)}°
                    </Typography>
                    {day.pop > 0 && (
                      <Typography variant="caption" color="text.secondary">
                        {(day.pop * 100).toFixed(0)}% rain
                      </Typography>
                    )}
                  </Box>
                </ListItem>
                {index < displayData.length - 1 && <Divider variant="inset" component="li" />}
              </React.Fragment>
            );
          })}
        </List>
      </Paper>
    </Box>
  );
};

export default DailyForecast;
