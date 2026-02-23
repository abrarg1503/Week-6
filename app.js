import { fetchCurrentWeather, fetchForecast } from "./api.js";
import { savePreferences, loadPreferences } from "./storage.js";

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const weatherResult = document.getElementById("weatherResult");
const forecastResult = document.getElementById("forecastResult");
const loading = document.getElementById("loading");
const errorDiv = document.getElementById("error");

async function loadWeather(city) {
    try {
        loading.classList.remove("hidden");
        errorDiv.classList.add("hidden");
        weatherResult.innerHTML = "";
        forecastResult.innerHTML = "";

        const current = await fetchCurrentWeather(city);
        const forecast = await fetchForecast(city);

        displayCurrent(current);
        displayForecast(forecast);
        savePreferences(city);
    } catch (error) {
        errorDiv.textContent = error.message;
        errorDiv.classList.remove("hidden");
    } finally {
        loading.classList.add("hidden");
    }
}

function displayCurrent(data) {
    weatherResult.innerHTML = `
        <h2>${data.name}</h2>
        <p>Temperature: ${data.main.temp} °C</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind Speed: ${data.wind.speed} m/s</p>
        <p>${data.weather[0].description}</p>
    `;
}

function displayForecast(data) {
    const daily = data.list.filter(item => item.dt_txt.includes("12:00:00"));
    daily.slice(0, 5).forEach(day => {
        const div = document.createElement("div");
        div.classList.add("forecast-item");
        div.innerHTML = `
            <p>${new Date(day.dt_txt).toDateString()}</p>
            <p>${day.main.temp} °C</p>
            <p>${day.weather[0].description}</p>
        `;
        forecastResult.appendChild(div);
    });
}

searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (city) loadWeather(city);
});

window.addEventListener("DOMContentLoaded", () => {
    const savedCity = loadPreferences();
    loadWeather(savedCity);
});
