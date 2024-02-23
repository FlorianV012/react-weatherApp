export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface City {
  name: string;
  coordinates: Coordinates;
}

export interface WeatherData {
  max_temp: number;
  min_temp: number;
  valid_date: string;
  pop: number;
  weather: {
    description: string;
    code: number;
    icon: string;
  };
}

export interface WeatherResponse {
  city_name: string;
  country_code: string;
  data: WeatherData[];
  lat: number;
  lon: number;
  state_code: string;
  timezone: string;
}
