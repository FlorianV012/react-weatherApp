import { useState, useEffect } from "react";
import { City, WeatherData, WeatherResponse } from "../interfaces";

const WEATHERBIT_API_KEY = import.meta.env.VITE_WEATHERBIT_API_KEY;

interface WeatherDisplayProps {
  selectedCity: City;
}

export default function WeatherDisplay({ selectedCity }: WeatherDisplayProps) {
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);

  useEffect(() => {
    if (selectedCity) {
      fetch(
        `https://api.weatherbit.io/v2.0/forecast/daily?lat=${selectedCity.coordinates.latitude}&lon=${selectedCity.coordinates.longitude}&units=M&lang=en&key=${WEATHERBIT_API_KEY}`
      )
        .then((response) => {
          if (!response.ok)
            throw new Error(
              `Error : ${response.status}, ${response.statusText}`
            );

          return response.json();
        })
        .then((data: WeatherResponse) => {
          console.log("data:", data.data);

          const filteredData = data.data.map((item: any) => ({
            max_temp: item.max_temp,
            min_temp: item.min_temp,
            valid_date: item.valid_date,
            pop: item.pop,
            weather: {
              description: item.weather.description,
              code: item.weather.code,
              icon: item.weather.icon,
            },
          }));
          setWeatherData(filteredData);
          console.log("filteredData:", filteredData);
        })
        .catch((error) => {
          console.error("Error fetching weather:", error);
        });
    }
  }, [selectedCity]);

  return (
    <ul>
      {weatherData.map((weather: WeatherData, index: number) => (
        <li key={index}>
          Date: {weather.valid_date}, Max Temp: {weather.max_temp}°C, Min Temp:{" "}
          {weather.min_temp}°C, Pop: {weather.pop}, Description:{" "}
          {weather.weather.description}
        </li>
      ))}
    </ul>
  );
}
