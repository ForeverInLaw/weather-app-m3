'use client';

import React, { useRef } from 'react';
import { Box, Typography, Paper, Avatar, IconButton } from '@mui/material';
import { HourlyForecast as HourlyForecastData } from '@/services/weatherService';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CloudIcon from '@mui/icons-material/Cloud';
import DehazeIcon from '@mui/icons-material/Dehaze';
import FilterDramaIcon from '@mui/icons-material/FilterDrama';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import ThunderstormIcon from '@mui/icons-material/Thunderstorm';
import NightsStayIcon from '@mui/icons-material/NightsStay';
import GrainIcon from '@mui/icons-material/Grain';

interface HourlyForecastProps {
  data: HourlyForecastData[];
}

const getWeatherMuiIcon = (conditionText: string, isDay: boolean = true, iconUrl?: string): React.ReactElement => {
  const text = conditionText.toLowerCase();
  let MuiIconComponent = isDay ? WbSunnyIcon : NightsStayIcon;
  const iconSize = 30;

  if (iconUrl) {
    const parts = iconUrl.split('/');
    const iconName = parts[parts.length -1];
    const codeStr = iconName.split('.')[0];
    const code = parseInt(codeStr, 10);

    switch (code) {
      case 1000: MuiIconComponent = isDay ? WbSunnyIcon : NightsStayIcon; break;
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
      default:
        if (text.includes("sunny") || text.includes("clear")) MuiIconComponent = isDay ? WbSunnyIcon : NightsStayIcon;
        else if (text.includes("partly cloudy")) MuiIconComponent = FilterDramaIcon;
        else if (text.includes("cloudy") || text.includes("overcast")) MuiIconComponent = CloudIcon;
        else if (text.includes("rain") || text.includes("drizzle")) MuiIconComponent = GrainIcon;
        else if (text.includes("snow") || text.includes("sleet")) MuiIconComponent = AcUnitIcon;
        else if (text.includes("thunder")) MuiIconComponent = ThunderstormIcon;
        else if (text.includes("fog") || text.includes("mist")) MuiIconComponent = DehazeIcon;
        break;
    }
  } else {
      if (text.includes("sunny") || text.includes("clear")) MuiIconComponent = isDay ? WbSunnyIcon : NightsStayIcon;
      else if (text.includes("partly cloudy")) MuiIconComponent = FilterDramaIcon;
      else if (text.includes("cloudy") || text.includes("overcast")) MuiIconComponent = CloudIcon;
      else if (text.includes("rain") || text.includes("drizzle")) MuiIconComponent = GrainIcon;
      else if (text.includes("snow") || text.includes("sleet")) MuiIconComponent = AcUnitIcon;
      else if (text.includes("thunder")) MuiIconComponent = ThunderstormIcon;
      else if (text.includes("fog") || text.includes("mist")) MuiIconComponent = DehazeIcon;
  }
  return <MuiIconComponent sx={{ fontSize: iconSize }} />;
};

const HourlyForecast: React.FC<HourlyForecastProps> = ({ data }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  if (!data || data.length === 0) return null;
  const displayData = data.slice(0, 24);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <Box sx={{ my: 3, position: 'relative' }}> {/* Removed parent px */}
      <Typography variant="h5" component="h3" gutterBottom sx={{ mb: 2, textAlign: 'center' }}>
        Hourly Forecast
      </Typography>
      <IconButton
        onClick={() => scroll('left')}
        size="small"
        sx={(theme) => ({ 
          position: 'absolute', 
          left: theme.spacing(0.5), 
          top: 'calc(50% + 8px)', 
          transform: 'translateY(-50%)', 
          zIndex: 2, 
          backgroundColor: theme.palette.mode === 'light' ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.3)', 
          color: theme.palette.text.secondary, // Ensure icon color contrasts
          '&:hover': { 
            backgroundColor: theme.palette.mode === 'light' ? 'rgba(255,255,255,1)' : 'rgba(0,0,0,0.5)',
          },
          boxShadow: 2,
        })}
        aria-label="scroll left"
      >
        <ArrowBackIosNewIcon fontSize="small" />
      </IconButton>
      <Box
        ref={scrollContainerRef}
        sx={(theme) => ({
          display: 'flex',
          overflowX: 'auto',
          pb: 1, 
          gap: 2, 
          // Add padding inside the scrollable area to make space for the absolute buttons
          // Button size (small IconButton is ~30-34px) + spacing(1) for button offset
          // So, padding of ~40-48px should be enough. theme.spacing(5) = 40px, theme.spacing(6) = 48px
          px: theme.spacing(6), 
          '&::-webkit-scrollbar': { height: '8px' },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: theme.palette.mode === 'light' ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.2)',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-track': { backgroundColor: 'transparent' },
          scrollbarWidth: 'thin',
          scrollbarColor: `${theme.palette.mode === 'light' ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.2)'} transparent`,
        })}
      >
        {displayData.map((hourItem) => {
          const time = new Date(hourItem.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
          const weatherCondition = hourItem.weather && hourItem.weather.length > 0 ? hourItem.weather[0] : null;
          const isDayForHour = hourItem.is_day === 1;

          return (
            <Paper
              key={hourItem.dt}
              elevation={2}
              sx={{
                p: 2,
                minWidth: 120,
                textAlign: 'center',
                borderRadius: 3,
                flexShrink: 0,
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 'medium' }}>{time}</Typography>
              <Avatar sx={{ bgcolor: 'transparent', width: 50, height: 50, margin: '8px auto', color: 'primary.main' }}>
                {weatherCondition ? getWeatherMuiIcon(weatherCondition.description, isDayForHour, weatherCondition.icon) : <WbSunnyIcon sx={{ fontSize: 30 }} />}
              </Avatar>
              <Typography variant="h6" component="p">{Math.round(hourItem.temp)}°C</Typography>
              {hourItem.pop > 0 && (
                 <Typography variant="caption" color="text.secondary">
                   {(hourItem.pop * 100).toFixed(0)}% rain
                 </Typography>
              )}
            </Paper>
          );
        })}
      </Box>
      <IconButton
        onClick={() => scroll('right')}
        size="small"
        sx={(theme) => ({ 
          position: 'absolute', 
          right: theme.spacing(0.5), 
          top: 'calc(50% + 8px)', 
          transform: 'translateY(-50%)', 
          zIndex: 2, 
          backgroundColor: theme.palette.mode === 'light' ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.3)',
          color: theme.palette.text.secondary, // Ensure icon color contrasts
          '&:hover': { 
            backgroundColor: theme.palette.mode === 'light' ? 'rgba(255,255,255,1)' : 'rgba(0,0,0,0.5)',
          },
          boxShadow: 2,
        })}
        aria-label="scroll right"
      >
        <ArrowForwardIosIcon fontSize="small" />
      </IconButton>
    </Box>
  );
};

export default HourlyForecast;
