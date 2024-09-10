let today = new Date();
let sunDial = document.getElementById("shadowPoly");

let currentTime = today.getTime();

let secondsElapsed = currentTime / 1000;

let minutesElapsed = secondsElapsed / 60;

let hoursElapsed = minutesElapsed / 60;

let daysElapsed = hoursElapsed / 24;

let yearsElapsed = daysElapsed / 365;

let timeDiv = document.getElementById("timeDiv");

let year = today.getFullYear();

let month = today.getMonth();

let skyDiv = document.getElementById("skyBox");

function updateTime() {
  //////// GET CURRENT DATE AND TIME ////////

  let today = new Date();

  //////// ACCESS SPECIFIC COMPONENTS ////////

  //// DATE ////

  // GET CURRENT MONTH
  let thisMonth = today.getMonth();

  // HOW DO WE SHOW THE NAME OF THE MONTH?
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // GET CURRENT DATE (DAY)
  let thisDate = today.getDate();

  // GET CURRENT DAY OF WEEK
  let thisWeekday = today.getDay();

  // HOW DO WE SHOW THE NAME OF THE DAY?
  let weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  // GET CURRENT YEAR
  let thisYear = today.getFullYear();

  // ADD TO INNER HTML
  let dateElement = document.getElementById("timeDiv");

  dateElement.innerHTML = months[thisMonth] + " " + thisDate + ", " + thisYear;

  // points="150,30 150,190 5,190"

  //// TIME ////

  // GET CURRENT HOUR
  let thisHour = today.getHours();

  // GET CURRENT MINUTE
  let thisMinute = today.getMinutes();

  // GET CURRENT SECOND
  let thisSecond = today.getSeconds();

  let secondsPast = thisHour * 3600 + thisMinute * 60 + thisSecond;

  let maxSeconds = 23 * 3600 + 59 * 60 + 59;

  if (thisSecond < 10) {
    thisSecond = "0" + thisSecond;
  }

  // ADD TO INNER HTML
  let timeElement = document.getElementById("timeDiv");

  timeElement.innerHTML = thisHour + ":" + thisMinute + ":" + thisSecond;
}

setInterval(updateTime, 1000);

function map(value, low1, high1, low2, high2) {
  return low2 + ((high2 - low2) * (value - low1)) / (high1 - low1);
}

let locationDiv = document.getElementById("location");

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    locationDiv.innerHTML = "Geolocation is not supported by this browser.";
  }
}

function showPosition(position) {
  locationDiv.innerHTML =
    "Latitude: " +
    position.coords.latitude +
    "<br>Longitude: " +
    position.coords.longitude;

  console.log("lat= " + position.coords.latitude);
  console.log("long= " + position.coords.longitude);

  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;

  const url = `https://api.sunrisesunset.io/json?lat=${latitude}&lng=${longitude}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      let updateShadow = function () {
        let sunsetTime = data.results.sunset;
        let sunsetTimeSplit = sunsetTime
          .replace(" ", "")
          .replace("PM", "")
          .replace("AM", "")
          .split(":");

        console.log("sunset time split " + sunsetTimeSplit);
        console.log(
          "sunset time split millitary time coversion " +
            (+sunsetTimeSplit[0] + 12)
        );
        let sunsetTimeHourInSeconds = +(+sunsetTimeSplit[0] + 12) * 3600;
        let sunsetTimeMinInSeconds = +sunsetTimeSplit[1] * 60;
        let sunsetTimeSecondsinSeconds = +sunsetTimeSplit[2];

        console.log(
          "sunset in seconds " +
            (sunsetTimeHourInSeconds +
              sunsetTimeMinInSeconds +
              sunsetTimeSecondsinSeconds)
        );

        let sunriseTime = data.results.sunrise;

        let sunriseTimeSplit = sunriseTime
          .replace(" ", "")
          .replace("PM", "")
          .replace("AM", "")
          .split(":");

        let sunriseTimeHourInSeconds = +sunriseTimeSplit[0] * 3600;
        let sunriseTimeMinInSeconds = +sunriseTimeSplit[1] * 60;
        let sunriseTimeSecondsinSeconds = +sunriseTimeSplit[2];

        let lightIndex = today.getHours();

        if (lightIndex > 12) {
          lightIndex = lightIndex - 12;
        }

        console.log("lightIndex " + lightIndex);

        console.log(
          "sunrise in seconds " +
            (sunriseTimeHourInSeconds +
              sunriseTimeMinInSeconds +
              sunriseTimeSecondsinSeconds)
        );

        let sunriseSeconds =
          sunriseTimeHourInSeconds +
          sunriseTimeMinInSeconds +
          sunriseTimeSecondsinSeconds;

        let sunsetSeconds =
          sunsetTimeHourInSeconds +
          sunsetTimeMinInSeconds +
          sunsetTimeSecondsinSeconds;

        console.log(sunriseSeconds);
        console.log(sunsetSeconds);

        console.log(
          "day light hours in seconds " + (sunsetSeconds - sunriseSeconds)
        );

        let DaylightHoursInSeconds = sunsetSeconds - sunriseSeconds;

        let thisHour = today.getHours();

        let thisMinute = today.getMinutes();

        let thisSecond = today.getSeconds();

        let secondsPastSinceMidnight =
          thisHour * 3600 + thisMinute * 60 + thisSecond;

        let maxSecondsInDay = 23 * 3600 + 59 * 60 + 59;
        console.log("max seconds in a day " + maxSecondsInDay);
        console.log("seconds past since midnight " + secondsPastSinceMidnight);

        let SecondsSinceSunrise = secondsPastSinceMidnight - sunriseSeconds;
        let solarNoonSeconds = sunriseSeconds + DaylightHoursInSeconds / 2;
        console.log("solar Noon in seconds " + solarNoonSeconds);
        console.log("Seconds Since Sunrise " + SecondsSinceSunrise);
        if (
          secondsPastSinceMidnight >= sunriseSeconds &&
          secondsPastSinceMidnight <= sunsetSeconds &&
          secondsPastSinceMidnight < solarNoonSeconds //before noon
        ) {
          console.log("morning");
          skyDiv.style.backgroundColor = "rgba(70, 65, 88, 0.00)";
          let pointX = map(SecondsSinceSunrise, 0, solarNoonSeconds, 255, 0);
          let pointY = map(SecondsSinceSunrise, 0, solarNoonSeconds, 0, 400);
          console.log("morning light index: " + lightIndex);
          let colorTransparentMap = map(lightIndex, 1, 12, 0.1, 1);
          console.log("time of local sunrise in seconds " + sunriseSeconds);
          console.log("time of local sunset in seconds " + sunsetSeconds);
          console.log(
            "seconds past since midnight " + secondsPastSinceMidnight
          );
          console.log();
          document
            .getElementById("shadowPoly")
            .setAttribute("points", "225,4 225,185 " + pointX + "," + pointY);
          //points="225,0 225,185 0,185"

          //you could make the and statment make sure its before noon, then do another thats after noon with the color and y hight values reversed, then make a after sunset version
          document
            .getElementById("shadowPoly")
            .setAttribute(
              "style",
              "fill:rgba(45, 44, 61," +
                colorTransparentMap +
                ");stroke:rgba(0, 0, 0, 0);stroke-width:3"
            );
        }
        if (
          secondsPastSinceMidnight >= sunriseSeconds &&
          secondsPastSinceMidnight <= sunsetSeconds &&
          secondsPastSinceMidnight > solarNoonSeconds //afternoon
        ) {
          console.log("afternoon");

          skyDiv.style.backgroundColor = "rgba(70, 65, 88, 0.00)";

          let pointX = map(
            SecondsSinceSunrise - solarNoonSeconds,
            0,
            sunsetSeconds,
            500,
            225
          );
          let pointY = map(
            SecondsSinceSunrise - solarNoonSeconds,
            0,
            sunsetSeconds,
            130,
            400
          );
          console.log("afternoon light index: " + lightIndex);
          let colorTransparentMap = map(lightIndex, 1, 12, 1, 0.1);
          console.log("time of local sunrise in seconds " + sunriseSeconds);
          console.log("time of local sunset in seconds " + sunsetSeconds);
          console.log(
            "seconds past since midnight " + secondsPastSinceMidnight
          );
          console.log();
          document
            .getElementById("shadowPoly")
            .setAttribute("points", "225,4 225,185 " + pointX + "," + pointY);
          //points="225,0 225,185 0,185"

          //you could make the and statment make sure its before noon, then do another thats after noon with the color and y hight values reversed, then make a after sunset version
          document
            .getElementById("shadowPoly")
            .setAttribute(
              "style",
              "fill:rgba(45, 44, 61," +
                colorTransparentMap +
                ");stroke:rgba(0, 0, 0, 0);stroke-width:3"
            );
        }
        if (secondsPastSinceMidnight > sunsetSeconds) {
          console.log("night");
          document
            .getElementById("shadowPoly")
            .setAttribute(
              "style",
              "fill:rgba(45, 44, 61," +
                "0.0" +
                ");stroke:rgba(0, 0, 0, 0);stroke-width:3"
            );
          document
            .getElementById("skyBox")
            .style.backgroundColor("rgba(70, 65, 88, 0.776)");
        }
      };
      updateShadow();
      setInterval(updateShadow, 10000);
    })
    .catch((error) => console.error("Error:", error));
}

getLocation();
