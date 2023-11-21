$(document).ready(function () {
  // Event listener for the form submission
  $("#search-form").submit(function (event) {
    event.preventDefault();

    // Get the city name from the input field
    var cityName = $("#search-input").val().trim();

    // Call your weather API function with the cityName parameter
    getWeatherData(cityName);

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
        console.log(getWeatherData);
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
  
  // Function to get the URL of the weather icon based on weather condition
  function getWeatherIconUrl(iconCode) {
    // Adjust the URL format based on OpenWeatherMap's icon URLs
    return `https://openweathermap.org/img/w/${iconCode}.png`;
  }

  // some basic styling for the forecast box
  $("#today").css({
    border: "10px solid #ccc",
    padding: "10px",
    border: "5px",
    boxShadow: "0 0 10px rgba(0,0,0,1)",
  });

  // Function to update the search history
  function updateSearchHistory(cityName) {
    // Create a list item element with the city name
    var listItem = $("<a>")
      .addClass("list-group-item list-group-item-action")
      .text(cityName);

    // Add a click event listener to the list item for re-searching
    listItem.click(function () {
      getWeatherData(cityName);
    });

    // Add the list item to the 'history' list
    $("#history").prepend(listItem);
  }
});
