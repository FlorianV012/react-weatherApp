import { useState, useEffect } from "react";
import { City } from "../interfaces"
import WeatherDisplay from "./WeatherDisplay";

const GEOCODING_API_KEY = import.meta.env.VITE_GEOCODING_API_KEY;

export default function FormCity() {
  const [city, setCity] = useState<string>("");
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [fetchData, setFetchData] = useState<boolean>(false);

  useEffect(() => {
    if (fetchData) {
      const fetchCities = async () => {
        if (city.trim() === "") return;
        fetch(
          `https://api.opencagedata.com/geocode/v1/json?q=${city}&key=${GEOCODING_API_KEY}`
        )
          .then((response) => {
            if (!response.ok) {
              throw new Error(
                `"Failed to fetch location : ${response.status}, ${response.statusText}`
              );
            }
            return response.json();
          })
          .then((data) => {
            if (data.results && data.results.length > 0) {
              const citiesData: City[] = data.results.map((cityData: any) => ({
                name: cityData.formatted,
                coordinates: {
                  latitude: cityData.geometry.lat,
                  longitude: cityData.geometry.lng,
                },
              }));
              setCities(citiesData);
            } else {
              console.error("No location found for the given query");
            }
          })
          .catch((error) => {
            console.error("Error fetching locations:", error);
          });
      };

      fetchCities();
      setFetchData(false);
    }
  }, [fetchData, city]);

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFetchData(true);
    setSelectedCity(null);
  };

  const handleCitySelection = (selected: City) => {
    setSelectedCity(selected);
  };

  return (
    <>
      <form onSubmit={handleFormSubmit}>
        <label>
          Enter City Name:
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </label>
        <button type="submit">Find Cities</button>
      </form>
      {cities.length > 0 && !selectedCity && (
        <div>
          <h2>Choose a city:</h2>
          <ul>
            {cities.map((c) => (
              <li key={c.name} onClick={() => handleCitySelection(c)}>
                {c.name}
              </li>
            ))}
          </ul>
        </div>
      )}
      {selectedCity && (
        <div>
          <h2>{selectedCity.name}:</h2>
          <WeatherDisplay selectedCity={selectedCity} />
        </div>
      )}
    </>
  );
}
