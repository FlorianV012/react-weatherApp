import { useState, useEffect } from "react";
import { City } from "../interfaces";
import WeatherDisplay from "./WeatherDisplay";

const GEOCODING_API_KEY = import.meta.env.VITE_GEOCODING_API_KEY;

export default function FormCity() {
  const [city, setCity] = useState<string>("");
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [fetchData, setFetchData] = useState<boolean>(false);
  const [numberOfDays, setNumberOfDays] = useState<number>(7);

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

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedDays = parseInt(event.target.value);
    setNumberOfDays(selectedDays);
  };

  const handleCitySelection = (selected: City) => {
    setSelectedCity(selected);
  };

  return (
    <>
      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          value={city}
          placeholder="enter a location"
          onChange={(e) => setCity(e.target.value)}
        />
        <select name="day-nb" id="day-nb" onChange={handleSelectChange}>
          <option value="1">1 day</option>
          <option value="2">2 days</option>
          <option value="3">3 days</option>
          <option value="4">4 days</option>
          <option value="5">5 days</option>
          <option value="6">6 days</option>
          <option value="7" selected>
            7 days
          </option>
        </select>
        <button type="submit">Find location</button>
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
          <h2>{selectedCity.name}</h2>
          <WeatherDisplay
            selectedCity={selectedCity}
            numberOfDays={numberOfDays}
          />
        </div>
      )}
    </>
  );
}
