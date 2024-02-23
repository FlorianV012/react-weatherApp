import { useState, useEffect } from "react";
import { City, WeatherData, WeatherResponse } from "../interfaces";
import loader from "../assets/loader.svg";
import formatDate from "../utils/formatDate";

const WEATHERBIT_API_KEY = import.meta.env.VITE_WEATHERBIT_API_KEY;

interface WeatherDisplayProps {
  selectedCity: City;
  numberOfDays: number;
}

export default function WeatherDisplay({
  selectedCity,
  numberOfDays,
}: WeatherDisplayProps) {
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
        })
        .catch((error) => {
          console.error("Error fetching weather:", error);
        });
    }
  }, [selectedCity]);

  return (
    <>
      <div
        className={`loader-container ${
          weatherData.length < 1 && selectedCity && "active"
        }`}
      >
        <img src={loader} alt="loading icon" />
      </div>
      <div className="weather-container">
        {weatherData
          .slice(0, numberOfDays)
          .map((weather: WeatherData, index: number) => (
            <div className="weather-card" key={index}>
              <div className="day">{formatDate(weather.valid_date)}</div>
              <div className="temp">
                {weather.max_temp}°C / {weather.min_temp}°C
              </div>
              <img
                src={`/icons/${weather.weather.icon}.svg`}
                className="info-icon"
                alt={weather.weather.description}
                title={weather.weather.description}
              />
            </div>
          ))}
      </div>
    </>
  );
}
