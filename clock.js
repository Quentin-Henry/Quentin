let isOverride = false; // Flag for toggling time override
let sliderValue = 0; // Slider value in seconds since midnight
let sunriseTime, sunsetTime, solarNoonTime; // Variables to store sunrise, sunset, and solar noon times

function toggleOverride() {
  isOverride = !isOverride; // Toggle the override flag
  const slider = document.getElementById("timeSlider");
  slider.style.display = isOverride ? "block" : "none"; // Show slider when overriding

  if (isOverride) {
    // Set the slider to the current time in seconds
    const now = new Date();
    slider.value =
      now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
    updateSliderValue(slider.value); // Update the polygon position immediately
  } else {
    updateTime(); // Update to the current time when not overriding
  }
}

function updateSliderValue(value) {
  sliderValue = parseInt(value, 10); // Update the slider value
}
// Get the current date and time
function updateTime() {
  let totalSeconds;

  if (isOverride) {
    totalSeconds = sliderValue;
  } else {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    totalSeconds = hours * 3600 + minutes * 60 + seconds;
  }

  // Convert sunrise, sunset, and solar noon times to seconds
  const sunriseInSeconds = sunriseTime ? convertTimeToSeconds(sunriseTime) : 0;
  const sunsetInSeconds = sunsetTime
    ? convertTimeToSeconds(sunsetTime)
    : 24 * 3600;
  const solarNoonInSeconds = solarNoonTime
    ? convertTimeToSeconds(solarNoonTime)
    : 12 * 3600; // Default to noon if not available

  // Check if the time is within the daytime range (sunrise to sunset)
  const isDaytime =
    totalSeconds >= sunriseInSeconds && totalSeconds <= sunsetInSeconds;

  updateBackgroundColor(
    totalSeconds,
    sunriseInSeconds,
    solarNoonInSeconds,
    sunsetInSeconds
  );

  // Normalize the time if daytime
  const normalizedTime = isDaytime
    ? (totalSeconds - sunriseInSeconds) / (sunsetInSeconds - sunriseInSeconds)
    : 0; // 0 if not daytime
  // Define the ranges for x and y
  const minY = 175; // Minimum y value at solar noon
  const maxY = 420; // Maximum y value at sunrise and sunset
  const minX = -150; // Minimum x value at sunrise
  const maxX = 400; // Maximum x value at sunset
  const noonX = 150; // x value at solar noon

  if (isDaytime) {
    let x, y;

    if (normalizedTime < 0.5) {
      // Before solar noon: sunrise to solar noon
      const angle = normalizedTime * Math.PI; // From 0 to π/2
      y = maxY - (maxY - minY) * Math.sin(angle); // Transition from maxY to minY
      x = minX + (noonX - minX) * (normalizedTime / 0.5); // Transition x from minX to noonX
    } else {
      // After solar noon: solar noon to sunset
      const angle = (normalizedTime - 0.5) * Math.PI; // From 0 to π/2
      y = minY + (maxY - minY) * (1 - Math.cos(angle)); // Adjusted to have slower increase at first
      x = noonX + (maxX - noonX) * Math.sin(angle); // Adjusted to have faster increase at first
    }

    // Update the coordinates of the 3rd point of the polygon
    const hand = document.getElementById("shadowPoly");
    hand.setAttribute(
      "points",
      `150,100 150,350 ${x.toFixed(2)},${y.toFixed(2)}`
    );

    // Set the other two points based on the time of day
    const xPoint1 = normalizedTime < 0.5 ? 150 : 154; // x for point 1
    const xPoint2 = normalizedTime < 0.5 ? 150 : 154; // x for point 2

    // Update the coordinates of the two fixed points
    hand.setAttribute(
      "points",
      `${xPoint1},100 ${xPoint1},350 ${x.toFixed(2)},${y.toFixed(2)}`
    );

    // Calculate opacity based on time
    const opacity = 1 - Math.abs(normalizedTime - 0.5) * 2; // Full visibility at solar noon
    hand.style.opacity = opacity;

    // Calculate blur effect based on time
    const blurAmount =
      normalizedTime < 0.5
        ? Math.min(10, 10 * (1 - normalizedTime * 2)) // Increasing blur until solar noon
        : Math.min(10, 10 * (1 - (1 - normalizedTime) * 2)); // Decreasing blur after solar noon
    hand.style.filter = `blur(${blurAmount}px)`; // Apply blur

    // Make the polygon visible
    hand.style.display = "block";
  } else {
    // Hide the polygon when not daytime
    document.getElementById("shadowPoly").style.display = "none";
  }

  // Update the displayed time
  updateDisplayedTime(totalSeconds);
}

function updateBackgroundColor(
  totalSeconds,
  sunriseInSeconds,
  solarNoonInSeconds,
  sunsetInSeconds
) {
  const colorDiv = document.getElementById("colorTransition");

  // Convert additional times to seconds
  const firstLightInSeconds = firstLightTime
    ? convertTimeToSeconds(firstLightTime)
    : 0;
  const lastLightInSeconds = lastLightTime
    ? convertTimeToSeconds(lastLightTime)
    : 24 * 3600;
  const dawnInSeconds = dawnTime ? convertTimeToSeconds(dawnTime) : 0;
  const duskInSeconds = duskTime ? convertTimeToSeconds(duskTime) : 24 * 3600;
  const goldenHourInSeconds = goldenHourTime
    ? convertTimeToSeconds(goldenHourTime)
    : 24 * 3600;

  // Before first light and after last light
  if (totalSeconds < firstLightInSeconds || totalSeconds > lastLightInSeconds) {
    colorDiv.style.backgroundColor = "#000533"; // Black
  }
  // Between first light and dawn
  else if (
    totalSeconds >= firstLightInSeconds &&
    totalSeconds < dawnInSeconds
  ) {
    const transitionProgress =
      (totalSeconds - firstLightInSeconds) /
      (dawnInSeconds - firstLightInSeconds);
    colorDiv.style.backgroundColor = `rgba(16, 30, 156, ${transitionProgress})`; // Transition to purple
  }
  // Between dawn and sunrise
  else if (totalSeconds >= dawnInSeconds && totalSeconds < sunriseInSeconds) {
    const transitionProgress =
      (totalSeconds - dawnInSeconds) / (sunriseInSeconds - dawnInSeconds);
    colorDiv.style.backgroundColor = `rgba(255, 215, 145, ${transitionProgress})`; // Transition to orange
  }
  // Between sunrise and one hour after sunrise
  else if (
    totalSeconds >= sunriseInSeconds &&
    totalSeconds < sunriseInSeconds + 3600
  ) {
    const transitionProgress = (totalSeconds - sunriseInSeconds) / 3600;
    colorDiv.style.backgroundColor = `rgba(255, 255, 255, ${transitionProgress})`; // Transition to white
  }
  // Between one hour after sunrise and golden hour
  else if (
    totalSeconds >= sunriseInSeconds + 3600 &&
    totalSeconds < goldenHourInSeconds
  ) {
    colorDiv.style.backgroundColor = "white"; // Stay white
  }
  // Between golden hour and sunset
  else if (
    totalSeconds >= goldenHourInSeconds &&
    totalSeconds < sunsetInSeconds
  ) {
    const transitionProgress =
      (totalSeconds - goldenHourInSeconds) /
      (sunsetInSeconds - goldenHourInSeconds);
    colorDiv.style.backgroundColor = `rgba(255, 232, 79, ${transitionProgress})`; // Transition to yellow
  }
  // Between sunset and dusk
  else if (totalSeconds >= sunsetInSeconds && totalSeconds < duskInSeconds) {
    const transitionProgress =
      (totalSeconds - sunsetInSeconds) / (duskInSeconds - sunsetInSeconds);
    colorDiv.style.backgroundColor = `rgba(255, 215, 145, ${
      1 - transitionProgress
    })`; // Transition back to orange
  }
  // Between dusk and last light
  else if (totalSeconds >= duskInSeconds && totalSeconds < lastLightInSeconds) {
    const transitionProgress =
      (totalSeconds - duskInSeconds) / (lastLightInSeconds - duskInSeconds);
    colorDiv.style.backgroundColor = `rgba(16, 30, 156, ${
      1 - transitionProgress
    })`; // Transition back to purple
  }
  // After last light
  else {
    colorDiv.style.backgroundColor = "#000533"; // Black
  }
}

// Get user's location using Geolocation API
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showError);
  } else {
    document.getElementById("location").innerText =
      "Geolocation is not supported by this browser.";
  }
}

function showPosition(position) {
  const lat = position.coords.latitude;
  const long = position.coords.longitude;
  document.getElementById(
    "location"
  ).innerText = `Latitude: ${lat}, Longitude: ${long}`;

  // Fetch sunrise, sunset, and solar noon times
  fetchSunriseSunset(lat, long);
}

function showError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      document.getElementById("location").innerText =
        "User denied the request for Geolocation.";
      break;
    case error.POSITION_UNAVAILABLE:
      document.getElementById("location").innerText =
        "Location information is unavailable.";
      break;
    case error.TIMEOUT:
      document.getElementById("location").innerText =
        "The request to get user location timed out.";
      break;
    case error.UNKNOWN_ERROR:
      document.getElementById("location").innerText =
        "An unknown error occurred.";
      break;
  }
}

let firstLightTime, lastLightTime, dawnTime, duskTime, goldenHourTime; // Variables for additional time points

function fetchSunriseSunset(latitude, longitude) {
  const url = `https://api.sunrisesunset.io/json?lat=${latitude}&lng=${longitude}&formatted=0`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      if (data.results) {
        sunriseTime = data.results.sunrise;
        sunsetTime = data.results.sunset;
        solarNoonTime = data.results.solar_noon; // Get solar noon time
        firstLightTime = data.results.first_light; // First light time
        lastLightTime = data.results.last_light; // Last light time
        dawnTime = data.results.dawn; // Dawn time
        duskTime = data.results.dusk; // Dusk time
        goldenHourTime = data.results.golden_hour; // Golden hour time

        console.log(
          `Sunrise: ${sunriseTime}, Sunset: ${sunsetTime}, Solar Noon: ${solarNoonTime}, First Light: ${firstLightTime}, Last Light: ${lastLightTime}, Dawn: ${dawnTime}, Dusk: ${duskTime}, Golden Hour: ${goldenHourTime}`
        );
      } else {
        console.error("No results in API response.");
      }
    })
    .catch((error) => {
      console.error("Error fetching sunrise/sunset data:", error);
    });
}

function convertTimeToSeconds(timeString) {
  const [time, period] = timeString.split(" "); // Split into time and AM/PM
  const [hours, minutes, seconds] = time.split(":").map(Number); // Extract hours, minutes, seconds

  // Convert hours from 12-hour format to 24-hour format
  let convertedHours = hours;
  if (period === "PM" && hours !== 12) {
    convertedHours += 12; // Convert PM hours
  } else if (period === "AM" && hours === 12) {
    convertedHours = 0; // Convert 12 AM to 0 hours
  }

  // Calculate total seconds
  const totalSeconds = convertedHours * 3600 + minutes * 60 + seconds;
  return totalSeconds;
}

function updateDisplayedTime(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600) % 24; // Get hours in 24-hour format
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const period = hours >= 12 ? "PM" : "AM";

  const formattedHours = hours % 12 === 0 ? 12 : hours % 12; // Convert to 12-hour format
  const formattedMinutes = minutes < 10 ? "0" + minutes : minutes; // Add leading zero if needed

  const timeString = `${formattedHours}:${formattedMinutes} ${period}`;
  document.getElementById("timeDisplay").innerText = timeString; // Update the time display
}

// Update time every second
setInterval(() => {
  updateTime();
}, 1000);

// Get location on page load
window.onload = () => {
  getLocation();
  updateTime(); // Initial call to set position
};
