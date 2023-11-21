$(document).ready(function () {
  // Event listener for the form submission
  $("#search-form").submit(function (event) {
    event.preventDefault();

    // Get the city name from the input field
    var cityName = $("#search-input").val().trim();

    // Call your weather API function with the cityName parameter
    getWeatherData(cityName);
    getForecastData(cityName);

    // Clear the input field
    $("#search-input").val("");

    // Update the search history
    updateSearchHistory(cityName);
  });

  // Function to fetch the weather data from the API
  function getWeatherData(cityName) {
    var apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;

    $.ajax({
      url: apiUrl,
      method: "GET",
      dataType: "json",
      success: function (data) {
        updateTodaySection(data);
        // console.log(getWeatherData);
      },
    });
  }
  function getForecastData(cityName) {
    var forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`;

    // Make an API request for forecast data
    $.ajax({
      url: forecastApiUrl,
      method: "GET",
      dataType: "json",
      success: function (forecastData) {
        updateForecastCards(forecastData.list);
      },
    });
  }
  // this hides the box in beginning before the search
  $(today).css("display", "none");
  function updateTodaySection(weatherData) {
    // Update the 'today' section with the relevant weather information
    var todaySection = $("#today");
    // Get the current date using Day.js
    var currentDate = dayjs().format("DD/MM/YYYY");
    // Construct the icon URL based on the weather condition code
    var weatherIconUrl = getWeatherIconUrl(weatherData.weather[0].icon);
    // Convert wind speed from m/s to kph
    var windSpeedKph = (weatherData.wind.speed * 3.6).toFixed(2);

    todaySection.html(`
          <h2>${weatherData.name} (${currentDate}) <img src="${weatherIconUrl}" alt="Weather Icon" class="weather-icon" /> </h2>
          <p>Temperature: ${weatherData.main.temp} °C</p>
          <p>Weather: ${weatherData.weather[0].description}</p>
          <p>Wind: ${windSpeedKph} KPH</p>
          <p>Humidity: ${weatherData.main.humidity}%</p>
        `);
    // shows the box after the results appear
    $(today).css("display", "block");
  }
  // some basic styling for the today box
  $("#today").css({
    border: "10px solid #ccc",
    padding: "10px",
    border: "5px",
    boxShadow: "0 0 10px rgba(0,0,0,1)",
    marginBottom:"5px"
  });
  function updateForecastCards(forecastDataList) {
    // Select the container where forecast cards will be appended
    const forecastHeading =$('#forecast-heading');
    const forecastContainer = $("#forecast-container");
    
    // Clear existing forecast cards content
    forecastContainer.empty();
    forecastHeading.empty();
    forecastHeading.append('<h3>5-Day Forecast:</h3>');
    // Check if forecastDataList is an array
    if (Array.isArray(forecastDataList)) {
      // Use a Set to store unique dates
      const uniqueDates = new Set();

      // Get the current date using Day.js
      const currentDate = dayjs().format("DD/MM/YYYY");
      
      // Loop through the forecast data list
      forecastDataList.forEach((forecastData) => {
        // Get the date using Day.js
        const forecastDate = dayjs(forecastData.dt_txt).format("DD/MM/YYYY");

        // Check if the date is not the current day and is not already in the Set
        if (forecastDate !== currentDate && !uniqueDates.has(forecastDate)) {
          // Add the date to the Set to mark it as encountered
          uniqueDates.add(forecastDate);

          // Construct the icon URL based on the weather condition code
          const weatherIconUrl = getWeatherIconUrl(
            forecastData.weather[0].icon
          );

          // Convert wind speed from m/s to kph
          const windSpeedKph = (forecastData.wind.speed * 3.6).toFixed(2);
          // Append a new forecast card to the container
          forecastContainer.append(`
            <div class="weather-card card m-2 p-3">
              <ul class="list-unstyled">
                <li>Date: ${forecastDate}</li>
                <li><img src="${weatherIconUrl}" alt="Weather Icon" class="weather-icon" /></li>
                <li>Temp: ${forecastData.main.temp} °C</li>
                <li>Wind: ${windSpeedKph} KPH</li>
                <li>Humidity: ${forecastData.main.humidity}%</li>
              </ul>
            </div>
          `);
        }
      });
    }
  }
  // Function to get the URL of the weather icon based on weather condition
  function getWeatherIconUrl(iconCode) {
    // Adjust the URL format based on OpenWeatherMap's icon URLs
    return `https://openweathermap.org/img/w/${iconCode}.png`;
  }

  // Function to update the search history
  function updateSearchHistory(cityName) {
    // Create a list item element with the city name
    var listItem = $("<a>")
      .addClass("list-group-item list-group-item-action")
      .text(cityName);

    // Add a click event listener to the list item for re-searching
    listItem.click(function () {
      getWeatherData(cityName);
      getForecastData(cityName);
    });

    // Add the list item to the 'history' list
    $("#history").prepend(listItem);
  }
});
