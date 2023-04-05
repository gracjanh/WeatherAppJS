const containerEl = document.querySelector(".container");
const inputEl = document.querySelector(".input");
const btnEl = document.querySelector(".btn");
const weatherDataEl = document.querySelector(".weather-data");
const errorEl = document.querySelector(".error");

const displayContainerUI = function (addClassName, color, shadow, removeClassName) {
    containerEl.classList.add(addClassName);
    containerEl.classList.remove(removeClassName);
    containerEl.style.backgroundColor = color;
    containerEl.style.boxShadow = shadow;
};

const displayWeatherUI = function (addClassName, removeClassName) {
    weatherDataEl.classList.add(addClassName);
    weatherDataEl.classList.remove(removeClassName);
};

const displayErrorUI = function (addClassName, removeClassName) {
    errorEl.classList.add(addClassName);
    errorEl.classList.remove(removeClassName);
};

const displayUI = function (data) {
    errorEl.innerHTML = "";
    displayContainerUI(
        "container-visible",
        "#cadefc",
        "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
        "_"
    );
    displayWeatherUI("weather-data-visible", "_");
    displayErrorUI("_", "error-visible");

    const {
        name,
        main: { humidity, temp },
        weather: [{ icon }],
        timezone,
        dt,
        sys: { sunrise, sunset },
    } = data;

    const time = moment.utc().utcOffset(timezone / 3600);
    const sunriseTime = moment.unix(sunrise).utcOffset(timezone / 3600);
    const sunsetTime = moment.unix(sunset).utcOffset(timezone / 3600);

    const html = `
    <div class="header">
        <div class="name">${name}</div>
        <div class="time">
            <div>${time.format("HH:mm")}</div>
            <div>${time.format("MMM D")}</div>
        </div>
    </div>

    <div class="data icon">
        <div><img src="https://openweathermap.org/img/wn/${icon}@2x.png"></div>
        <div>${Math.round(temp)}°C</div>
    </div>

    <div class="data-container">
        <div class="data">
            <div>Humidity:</div>
            <div>${humidity}%</div>
        </div>

        <div class="data">
            <div>Sunrise:</div>
            <div>${sunriseTime.format("HH:mm")}</div>
        </div>

        <div class="data">
            <div>Sunset:</div>
            <div>${sunsetTime.format("HH:mm")}</div>
        </div>  
    </div> 
    `;

    weatherDataEl.innerHTML = html;
    inputEl.value = "";
};

const displayError = function (error) {
    weatherDataEl.innerHTML = "";
    errorEl.innerHTML = `<div class="error-msg">${error.message || error}</div>`;
    displayContainerUI("_", "transparent", "none", "container-visible");
    displayWeatherUI("_", "weather-data-visible");
    displayErrorUI("error-visible", "_");
};

const fetchData = function (e) {
    e.preventDefault();

    if (inputEl.value === "") {
        displayError("Enter data!");
        return;
    }

    // OpenWeatherMap API key
    const key = "YOUR API KEY";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputEl.value}&appid=${key}&units=metric`;

    fetch(url)
        .then((response) => {
            if (!response.ok) {
                throw new Error("No results found!");
            }
            return response.json();
        })
        .then((data) => displayUI(data))
        .catch((error) => displayError(error));
};

btnEl.addEventListener("click", (e) => fetchData(e));
