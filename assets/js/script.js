// this is an event listener for when the search button is pressed
document.addEventListener("DOMContentLoaded", function () {
  // Event listener for the form submission
  document
    .getElementById("search-form")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      // Get the city name from the input field
      var cityName = document
        .getElementById("search-input")
        .ariaValueMax.trim();

      // clear the input field
      document.getElementById("search-input").value = "";

      //Update the search history
      updateSearchHistory(cityName);
    });
});

function getWeatherData(cityName){
  
}