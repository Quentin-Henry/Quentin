// Global variables for loading and error states
let isLoading = true;
let loadingInterval;
let locationLoadingInterval;
let errorAnimationInterval;
let errorAnimationDirection = 1;
let errorAnimationProgress = 0;

// Add these to your global variables
let isTimeLapse = false;
let timeLapseSpeed = 8640; // Speed multiplier (24 hours = 10 seconds)
let timeLapseStartTime = 0;
let timeLapseInterval;
let isPaused = false;

function toggleTimeLapse() {
  if (!isTimeLapse) {
    // Start time-lapse
    startTimeLapse();
  } else {
    // Stop time-lapse
    stopTimeLapse();
  }
}

function togglePause() {
  isPaused = !isPaused;
  const pauseButton = document.getElementById("pauseButton");
  pauseButton.textContent = isPaused ? "Resume" : "Pause";
}

function startTimeLapse() {
  isTimeLapse = true;
  timeLapseStartTime = Date.now();
  isOverride = true; // Enable override mode

  // Clear existing intervals
  clearInterval(window.normalUpdateInterval);

  // Start new time-lapse interval
  timeLapseInterval = setInterval(() => {
    if (!isPaused) {
      const elapsedReal = Date.now() - timeLapseStartTime;
      const elapsedSimulated = elapsedReal * timeLapseSpeed;

      // Calculate simulated time of day in seconds
      const startOfDay = 0;
      const secondsInDay = 86400;
      const simulatedSeconds =
        (startOfDay + Math.floor(elapsedSimulated / 1000)) % secondsInDay;

      // Update slider and time
      const slider = document.getElementById("timeSlider");
      slider.value = simulatedSeconds;
      updateSliderValue(simulatedSeconds);
      updateTime();
    }
  }, 16); // 60fps update rate

  // Update UI
  document.getElementById("timeLapseButton").textContent = "Stop Time-lapse";
  document.getElementById("pauseButton").style.display = "inline-block";
  document.getElementById("speedControl").style.display = "inline-block";
}

function stopTimeLapse() {
  isTimeLapse = false;
  isPaused = false;
  clearInterval(timeLapseInterval);

  // Restore normal updates
  window.normalUpdateInterval = setInterval(() => {
    if (!isLoading && !errorAnimationInterval) {
      updateTime();
    }
  }, 1000);

  // Reset override
  isOverride = false;

  // Update UI
  document.getElementById("timeLapseButton").textContent = "Start Time-lapse";
  document.getElementById("pauseButton").style.display = "none";
  document.getElementById("speedControl").style.display = "none";
  document.getElementById("pauseButton").textContent = "Pause";
}

function updateTimeLapseSpeed(value) {
  // Convert days/10seconds to actual multiplier
  timeLapseSpeed = (86400 / 10) * value;
  document.getElementById("speedValue").textContent = value;
}

// Global variables for time tracking
let isOverride = false;
let sliderValue = 0;
let sunriseTime, sunsetTime, solarNoonTime;
let firstLightTime, lastLightTime, dawnTime, duskTime, goldenHourTime;

// Loading animation for location text
function updateLocationLoadingText() {
  if (!isLoading) {
    clearInterval(locationLoadingInterval);
    return;
  }

  const locationElement = document.getElementById("location");
  if (!locationElement) return;

  const currentText = locationElement.innerText;
  switch (currentText) {
    case "Calculating Solar Arcs":
      locationElement.innerText = "Calculating Solar Arcs.";
      break;
    case "Calculating Solar Arcs.":
      locationElement.innerText = "Calculating Solar Arcs..";
      break;
    case "Calculating Solar Arcs..":
      locationElement.innerText = "Calculating Solar Arcs...";
      break;
    case "Calculating Solar Arcs...":
      locationElement.innerText = "Calculating Solar Arcs";
      break;
    default:
      locationElement.innerText = "Calculating Solar Arcs";
  }
}

// Loading and error animation for the SVG
function updateLoadingAnimation() {
  const time = Date.now() / 1000;
  const brightness = Math.sin(time * 2) * 0.1 + 0.9;
  const colorValue = Math.round(brightness * 255);

  const myRect = document.getElementById("myRect");
  const myEllipse = document.getElementById("myEllipse");
  const color = `rgb(${colorValue}, ${colorValue}, ${colorValue})`;

  if (myRect && myEllipse) {
    myRect.style.fill = color;
    myEllipse.style.fill = color;
  }
}

function startErrorAnimation() {
  clearInterval(window.normalUpdateInterval);

  if (!errorAnimationInterval) {
    errorAnimationInterval = setInterval(updateErrorAnimation, 50);

    const shadowRect = document.getElementById("shadowRect");
    const hand = document.getElementById("shadowPoly");
    if (shadowRect && hand) {
      shadowRect.style.display = "block";
      hand.style.display = "block";
    }
  }
}

function updateErrorAnimation() {
  errorAnimationProgress += 0.01 * errorAnimationDirection;

  if (errorAnimationProgress >= 1) {
    errorAnimationProgress = 1;
    errorAnimationDirection = -1;
  } else if (errorAnimationProgress <= 0) {
    errorAnimationProgress = 0;
    errorAnimationDirection = 1;
  }

  const minY = 310;
  const maxY = 550;
  const minX = 100;
  const maxX = 1200;
  const noonX = 653.89;

  let x, y;
  const normalizedTime = errorAnimationProgress;

  if (normalizedTime < 0.5) {
    const angle = normalizedTime * Math.PI;
    y = maxY - (maxY - minY) * Math.sin(angle);
    x = minX + (noonX - minX) * (normalizedTime / 0.5);
  } else {
    const angle = (normalizedTime - 0.5) * Math.PI;
    y = minY + (maxY - minY) * (1 - Math.cos(angle));
    x = noonX + (maxX - noonX) * Math.sin(angle);
  }

  const hand = document.getElementById("shadowPoly");
  const xPoint1 = normalizedTime < 0.5 ? 675 : 712;

  if (hand) {
    hand.setAttribute(
      "points",
      `${xPoint1},87.33 ${xPoint1},539.38 ${x.toFixed(2)},${y.toFixed(2)}`
    );

    const opacity = 1 - Math.abs(normalizedTime - 0.5) * 2;
    hand.style.opacity = opacity;

    const blurAmount =
      normalizedTime < 0.5
        ? Math.min(10, 10 * (1 - normalizedTime * 2))
        : Math.min(10, 10 * (1 - (1 - normalizedTime) * 2));
    hand.style.filter = `blur(${blurAmount}px)`;
  }

  const shadowRect = document.getElementById("shadowRect");
  if (shadowRect) {
    const shadowOpacity = 0.1 * (1 - Math.abs(normalizedTime - 0.5) * 2);
    shadowRect.style.opacity = 0.1 - shadowOpacity;
  }
}

function toggleOverride() {
  isOverride = !isOverride;
  const slider = document.getElementById("timeSlider");
  slider.style.display = isOverride ? "block" : "none";

  if (isOverride) {
    const now = new Date();
    slider.value =
      now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
    updateSliderValue(slider.value);
  } else {
    updateTime();
  }
}

function updateSliderValue(value) {
  sliderValue = parseInt(value, 10);
}

function updateTime() {
  // Skip normal update if error animation is running
  if (errorAnimationInterval) return;

  let totalSeconds;

  if (isOverride) {
    totalSeconds = sliderValue;
  } else {
    const now = new Date();
    totalSeconds =
      now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
  }

  const sunriseInSeconds = sunriseTime ? convertTimeToSeconds(sunriseTime) : 0;
  const sunsetInSeconds = sunsetTime
    ? convertTimeToSeconds(sunsetTime)
    : 24 * 3600;
  const solarNoonInSeconds = solarNoonTime
    ? convertTimeToSeconds(solarNoonTime)
    : 12 * 3600;

  const isDaytime =
    totalSeconds >= sunriseInSeconds && totalSeconds <= sunsetInSeconds;

  updateBackgroundColor(
    totalSeconds,
    sunriseInSeconds,
    solarNoonInSeconds,
    sunsetInSeconds
  );

  const normalizedTime = isDaytime
    ? (totalSeconds - sunriseInSeconds) / (sunsetInSeconds - sunriseInSeconds)
    : 0;

  const minY = 310;
  const maxY = 550;
  const minX = 100;
  const maxX = 1200;
  const noonX = 653.89;

  if (isDaytime) {
    let x, y;

    if (normalizedTime < 0.5) {
      const angle = normalizedTime * Math.PI;
      y = maxY - (maxY - minY) * Math.sin(angle);
      x = minX + (noonX - minX) * (normalizedTime / 0.5);
    } else {
      const angle = (normalizedTime - 0.5) * Math.PI;
      y = minY + (maxY - minY) * (1 - Math.cos(angle));
      x = noonX + (maxX - noonX) * Math.sin(angle);
    }

    const shadowRect = document.getElementById("shadowRect");
    const hand = document.getElementById("shadowPoly");

    const xPoint1 = normalizedTime < 0.5 ? 675 : 712;

    hand.setAttribute(
      "points",
      `${xPoint1},87.33 ${xPoint1},539.38 ${x.toFixed(2)},${y.toFixed(2)}`
    );

    const opacity = 1 - Math.abs(normalizedTime - 0.5) * 2;
    hand.style.opacity = opacity;

    const shadowOpacity = 0.1 * (1 - Math.abs(normalizedTime - 0.5) * 2);
    shadowRect.style.opacity = 0.1 - shadowOpacity;

    const blurAmount =
      normalizedTime < 0.5
        ? Math.min(10, 10 * (1 - normalizedTime * 2))
        : Math.min(10, 10 * (1 - (1 - normalizedTime) * 2));
    hand.style.filter = `blur(${blurAmount}px)`;

    hand.style.display = "block";
    shadowRect.style.display = "block";
  } else {
    document.getElementById("shadowPoly").style.display = "none";
    document.getElementById("shadowRect").style.display = "none";
  }

  updateDisplayedTime(totalSeconds);
}

function updateBackgroundColor(
  totalSeconds,
  sunriseInSeconds,
  solarNoonInSeconds,
  sunsetInSeconds
) {
  if (errorAnimationInterval) return;

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

  function interpolateColor(color1, color2, factor) {
    const result = color1.slice();
    for (let i = 0; i < 3; i++) {
      result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]));
    }
    return `rgb(${result[0]}, ${result[1]}, ${result[2]})`;
  }

  function hexToRgb(hex) {
    const bigint = parseInt(hex.slice(1), 16);
    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
  }

  function rgbToHex(rgb) {
    return `#${((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2])
      .toString(16)
      .slice(1)}`;
  }

  const black = hexToRgb("#000533");
  const purple = hexToRgb("#101e9c");
  const orange = hexToRgb("#ffd791");
  const white = hexToRgb("#ffffff");
  const yellow = hexToRgb("#ffe84f");

  const myRect = document.getElementById("myRect");
  const myEllipse = document.getElementById("myEllipse");

  if (totalSeconds < firstLightInSeconds || totalSeconds > lastLightInSeconds) {
    // Night time - pure black
    myRect.style.fill = rgbToHex(black);
    myEllipse.style.fill = rgbToHex(black);
  } else if (
    totalSeconds >= firstLightInSeconds &&
    totalSeconds < dawnInSeconds
  ) {
    // First light to dawn - black to purple
    const transitionProgress =
      (totalSeconds - firstLightInSeconds) /
      (dawnInSeconds - firstLightInSeconds);
    const currentColor = interpolateColor(black, purple, transitionProgress);
    myRect.style.fill = currentColor;
    myEllipse.style.fill = currentColor;
  } else if (totalSeconds >= dawnInSeconds && totalSeconds < sunriseInSeconds) {
    // Dawn to sunrise - purple to orange
    const transitionProgress =
      (totalSeconds - dawnInSeconds) / (sunriseInSeconds - dawnInSeconds);
    const currentColor = interpolateColor(purple, orange, transitionProgress);
    myRect.style.fill = currentColor;
    myEllipse.style.fill = currentColor;
  } else if (
    totalSeconds >= sunriseInSeconds &&
    totalSeconds < sunriseInSeconds + 3600
  ) {
    // Sunrise transition - orange to white
    const transitionProgress = (totalSeconds - sunriseInSeconds) / 3600;
    const currentColor = interpolateColor(orange, white, transitionProgress);
    myRect.style.fill = currentColor;
    myEllipse.style.fill = currentColor;
  } else if (
    totalSeconds >= sunriseInSeconds + 3600 &&
    totalSeconds < goldenHourInSeconds
  ) {
    // Full daylight
    myRect.style.fill = rgbToHex(white);
    myEllipse.style.fill = rgbToHex(white);
  } else if (
    totalSeconds >= goldenHourInSeconds &&
    totalSeconds < sunsetInSeconds
  ) {
    // Golden hour to sunset - white to yellow
    const transitionProgress =
      (totalSeconds - goldenHourInSeconds) /
      (sunsetInSeconds - goldenHourInSeconds);
    const currentColor = interpolateColor(white, yellow, transitionProgress);
    myRect.style.fill = currentColor;
    myEllipse.style.fill = currentColor;
  } else if (totalSeconds >= sunsetInSeconds && totalSeconds < duskInSeconds) {
    // Sunset to dusk - yellow to orange
    const transitionProgress =
      (totalSeconds - sunsetInSeconds) / (duskInSeconds - sunsetInSeconds);
    const currentColor = interpolateColor(yellow, orange, transitionProgress);
    myRect.style.fill = currentColor;
    myEllipse.style.fill = currentColor;
  } else if (
    totalSeconds >= duskInSeconds &&
    totalSeconds < lastLightInSeconds
  ) {
    // Dusk to last light - orange to purple to black
    const transitionProgress =
      (totalSeconds - duskInSeconds) / (lastLightInSeconds - duskInSeconds);
    const currentColor = interpolateColor(orange, black, transitionProgress);
    myRect.style.fill = currentColor;
    myEllipse.style.fill = currentColor;
  } else {
    // Night time
    myRect.style.fill = rgbToHex(black);
    myEllipse.style.fill = rgbToHex(black);
  }
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showError);
  } else {
    handleLoadingError("Location not supported");
  }
}

function showPosition(position) {
  const lat = position.coords.latitude;
  const long = position.coords.longitude;
  document.getElementById("location").innerText = `${lat},${long}`;
  fetchSunriseSunset(lat, long);
}

function handleLoadingError(message) {
  isLoading = false;
  const locationElement = document.getElementById("location");
  if (locationElement) {
    locationElement.innerText = message;
  }

  // Keep the loading pulse animation going
  if (!loadingInterval) {
    loadingInterval = setInterval(updateLoadingAnimation, 50);
  }

  // Start the error animation for the sundial
  startErrorAnimation();
}

function showError(error) {
  let errorMessage;
  switch (error.code) {
    case error.PERMISSION_DENIED:
      errorMessage = "Location access denied";
      break;
    case error.POSITION_UNAVAILABLE:
      errorMessage = "Location unavailable";
      break;
    case error.TIMEOUT:
      errorMessage = "Location request timeout";
      break;
    case error.UNKNOWN_ERROR:
      errorMessage = "Location error";
      break;
  }
  handleLoadingError(errorMessage);
}

// Modify fetchSunriseSunset to clean up error animation if successful
function fetchSunriseSunset(latitude, longitude) {
  const url = `https://api.sunrisesunset.io/json?lat=${latitude}&lng=${longitude}&formatted=0`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      if (data.results) {
        // Clear error animation if it was running
        if (errorAnimationInterval) {
          clearInterval(errorAnimationInterval);
          errorAnimationInterval = null;
        }
        if (loadingInterval) {
          clearInterval(loadingInterval);
          loadingInterval = null;
        }

        // Rest of your existing success handling code...
        sunriseTime = data.results.sunrise;
        sunsetTime = data.results.sunset;
        solarNoonTime = data.results.solar_noon;
        firstLightTime = data.results.first_light;
        lastLightTime = data.results.last_light;
        dawnTime = data.results.dawn;
        duskTime = data.results.dusk;
        goldenHourTime = data.results.golden_hour;

        isLoading = false;
        updateTime();
      } else {
        console.error("No results in API response.");
        handleLoadingError("Error loading sun data");
      }
    })
    .catch((error) => {
      console.error("Error fetching sunrise/sunset data:", error);
      handleLoadingError("Error loading sun data");
    });
}

function convertTimeToSeconds(timeString) {
  const [time, period] = timeString.split(" ");
  const [hours, minutes, seconds] = time.split(":").map(Number);

  let convertedHours = hours;
  if (period === "PM" && hours !== 12) {
    convertedHours += 12;
  } else if (period === "AM" && hours === 12) {
    convertedHours = 0;
  }

  return convertedHours * 3600 + minutes * 60 + seconds;
}

function updateDisplayedTime(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600) % 24;
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const period = hours >= 12 ? "PM" : "AM";

  const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
  const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;

  const timeString = `${formattedHours}:${formattedMinutes} ${period}`;
  document.getElementById("timeDisplay").innerText = timeString;
}

setInterval(() => {
  if (!isLoading) {
    updateTime();
  }
}, 1000);

window.onload = () => {
  loadingInterval = setInterval(updateLoadingAnimation, 50);
  locationLoadingInterval = setInterval(updateLocationLoadingText, 500);

  document.getElementById("location").innerText = "calculating Solar Arcs";

  getLocation();
  updateTime();

  // Store the normal update interval so we can clear it if needed
  window.normalUpdateInterval = setInterval(() => {
    if (!isLoading && !errorAnimationInterval) {
      updateTime();
    }
  }, 1000);
};
