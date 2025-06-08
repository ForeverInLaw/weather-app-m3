import axios from 'axios';

const API_KEY = process.env.NEXT_PUBLIC_WEATHERAPI_KEY;
const FORECAST_API_URL = 'https://api.weatherapi.com/v1/forecast.json';

interface WeatherParams {
  lat: number;
  lon: number;
}

// --- Interfaces for WeatherAPI.com Response ---
interface WeatherApiLocation {
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  tz_id: string;
  localtime_epoch: number;
  localtime: string;
}

interface WeatherApiCondition {
  text: string;
  icon: string; // URL path, e.g., //cdn.weatherapi.com/weather/64x64/day/113.png
  code: number;
}

interface WeatherApiAirQuality {
  co: number;
  no2: number;
  o3: number;
  so2: number;
  pm2_5: number;
  pm10: number;
  'us-epa-index': number; // AQI US EPA standard
  'gb-defra-index': number; // AQI UK DEFRA standard
}

interface WeatherApiCurrent {
  last_updated_epoch: number;
  last_updated: string;
  temp_c: number;
  temp_f: number;
  is_day: number;
  condition: WeatherApiCondition;
  wind_mph: number;
  wind_kph: number;
  wind_degree: number;
  wind_dir: string;
  pressure_mb: number;
  pressure_in: number;
  precip_mm: number;
  precip_in: number;
  humidity: number;
  cloud: number;
  feelslike_c: number;
  feelslike_f: number;
  vis_km: number;
  vis_miles: number;
  uv: number;
  gust_mph: number;
  gust_kph: number;
  air_quality?: WeatherApiAirQuality; // Optional, depends on API request
}

interface WeatherApiAstro {
  sunrise: string; // e.g., "06:00 AM"
  sunset: string;  // e.g., "07:30 PM"
  moonrise: string;
  moonset: string;
  moon_phase: string;
  moon_illumination: string;
  is_moon_up?: number;
  is_sun_up?: number;
}

interface WeatherApiDay {
  maxtemp_c: number;
  maxtemp_f: number;
  mintemp_c: number;
  mintemp_f: number;
  avgtemp_c: number;
  avgtemp_f: number;
  maxwind_mph: number;
  maxwind_kph: number;
  totalprecip_mm: number;
  totalprecip_in: number;
  totalsnow_cm: number;
  avgvis_km: number;
  avgvis_miles: number;
  avghumidity: number;
  daily_will_it_rain: number;
  daily_chance_of_rain: number; // Percentage 0-100
  daily_will_it_snow: number;
  daily_chance_of_snow: number; // Percentage 0-100
  condition: WeatherApiCondition;
  uv: number;
}

interface WeatherApiHour {
  time_epoch: number;
  time: string; // e.g., "2024-06-08 00:00"
  temp_c: number;
  temp_f: number;
  is_day: number;
  condition: WeatherApiCondition;
  wind_mph: number;
  wind_kph: number;
  wind_degree: number;
  wind_dir: string;
  pressure_mb: number;
  pressure_in: number;
  precip_mm: number;
  precip_in: number;
  humidity: number;
  cloud: number;
  feelslike_c: number;
  feelslike_f: number;
  windchill_c: number;
  windchill_f: number;
  heatindex_c: number;
  heatindex_f: number;
  dewpoint_c: number;
  dewpoint_f: number;
  will_it_rain: number;
  chance_of_rain: number; // Percentage 0-100
  will_it_snow: number;
  chance_of_snow: number; // Percentage 0-100
  vis_km: number;
  vis_miles: number;
  gust_mph: number;
  gust_kph: number;
  uv: number;
}

interface WeatherApiForecastDay {
  date: string; // e.g., "2024-06-08"
  date_epoch: number;
  day: WeatherApiDay;
  astro: WeatherApiAstro;
  hour: WeatherApiHour[];
}

interface WeatherApiForecast {
  forecastday: WeatherApiForecastDay[];
}

interface WeatherApiResponse {
  location: WeatherApiLocation;
  current: WeatherApiCurrent;
  forecast: WeatherApiForecast;
}


// --- Unified Interfaces for our application (to be populated from WeatherAPI.com data) ---

export interface CurrentWeather {
  temp: number; // temp_c
  feels_like: number; // feelslike_c
  humidity: number; // humidity
  pressure: number; // pressure_mb
  wind_speed: number; // kph
  wind_deg: number;
  sunrise: string; // "HH:MM AM/PM"
  sunset: string;  // "HH:MM AM/PM"
  weather: {
    main: string; 
    description: string; 
    icon: string; // URL
  }[];
  uv: number;
  name: string; // City name
  localtime: string; 
  is_day: number; // Added: 1 for day, 0 for night
}

export interface HourlyForecast {
  dt: number; // epoch
  temp: number;
  weather: {
    icon: string; // URL
    description: string;
  }[];
  pop: number; // Probability of precipitation (0-1)
  is_day: number; // Added: 1 for day, 0 for night
}

export interface DailyForecast {
  dt: number; // epoch
  sunrise: string; // "HH:MM AM/PM"
  sunset: string;  // "HH:MM AM/PM"
  moon_phase: string;
  temp: {
    min: number;
    max: number;
  };
  weather: {
    main: string;
    description: string;
    icon: string; // URL
  }[];
  pop: number; // Probability of precipitation (0-1)
  uv: number;
}

export interface AirQualityData {
  aqi: number; // US EPA Index
  co?: number;
  no2?: number;
  o3?: number;
  so2?: number;
  pm2_5?: number;
  pm10?: number;
}

export interface WeatherData {
  current: CurrentWeather;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  airQuality?: AirQualityData | null;
  locationName: string;
}


export const getWeatherData = async ({ lat, lon }: WeatherParams): Promise<WeatherData> => {
  if (!API_KEY) {
    throw new Error("WeatherAPI.com API key is not configured.");
  }
  try {
    const response = await axios.get<WeatherApiResponse>(FORECAST_API_URL, {
      params: {
        key: API_KEY,
        q: `${lat},${lon}`,
        days: 7, 
        aqi: 'yes',
        alerts: 'no',
      },
    });

    const data = response.data;
    const todayForecast = data.forecast.forecastday[0];

    const transformedCurrent: CurrentWeather = {
      temp: data.current.temp_c,
      feels_like: data.current.feelslike_c,
      humidity: data.current.humidity,
      pressure: data.current.pressure_mb,
      wind_speed: data.current.wind_kph,
      wind_deg: data.current.wind_degree,
      sunrise: todayForecast.astro.sunrise,
      sunset: todayForecast.astro.sunset,
      weather: [{
        main: data.current.condition.text,
        description: data.current.condition.text,
        icon: data.current.condition.icon,
      }],
      uv: data.current.uv,
      name: data.location.name,
      localtime: data.location.localtime,
      is_day: data.current.is_day, // Added is_day
    };

    let transformedHourly: HourlyForecast[] = [];
    data.forecast.forecastday.slice(0, 2).forEach(day => { // Hours from today and tomorrow
        day.hour.forEach(hour => {
            transformedHourly.push({
                dt: hour.time_epoch,
                temp: hour.temp_c,
                weather: [{ icon: hour.condition.icon, description: hour.condition.text }],
                pop: hour.chance_of_rain / 100,
                is_day: hour.is_day, // Added is_day
            });
        });
    });
    // Filter for hours starting from current time, up to 24 hours
    transformedHourly = transformedHourly.filter(h => h.dt >= data.current.last_updated_epoch).slice(0, 24);


    const transformedDaily: DailyForecast[] = data.forecast.forecastday.map(day => ({
      dt: day.date_epoch,
      sunrise: day.astro.sunrise,
      sunset: day.astro.sunset,
      moon_phase: day.astro.moon_phase,
      temp: {
        min: day.day.mintemp_c,
        max: day.day.maxtemp_c,
      },
      weather: [{
        main: day.day.condition.text,
        description: day.day.condition.text,
        icon: day.day.condition.icon,
      }],
      pop: day.day.daily_chance_of_rain / 100,
      uv: day.day.uv,
    }));
    
    let transformedAirQuality: AirQualityData | null = null;
    if (data.current.air_quality) {
      transformedAirQuality = {
        aqi: data.current.air_quality['us-epa-index'],
        co: data.current.air_quality.co,
        no2: data.current.air_quality.no2,
        o3: data.current.air_quality.o3,
        so2: data.current.air_quality.so2,
        pm2_5: data.current.air_quality.pm2_5,
        pm10: data.current.air_quality.pm10,
      };
    }

    return {
      current: transformedCurrent,
      hourly: transformedHourly,
      daily: transformedDaily,
      airQuality: transformedAirQuality,
      locationName: data.location.name,
    };

  } catch (error) {
    console.error("Error fetching weather data from WeatherAPI.com:", error);
    if (axios.isAxiosError(error) && error.response) {
        const apiErrorMsg = error.response.data?.error?.message || error.message;
        throw new Error(`Failed to fetch weather data from WeatherAPI.com: ${error.response.status} - ${apiErrorMsg}`);
    }
    throw new Error("Failed to fetch weather data from WeatherAPI.com.");
  }
};
