// Init Variables
let cityQuery = "Blaine, MN";
let finalResults;
let currentLat;
let currentLon;
const calendarBox = $("#calendarBox");
const resultsBox = $("#resultsBox");
const cityName = $("#cityName");
const searchContainer = $("#searchContainer");
const mainContent = $("#mainContent");

// Function Declaration
function getLatLon(q) {
  fetch(
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
      q +
      ",US&appid=9ff246accb301f3b2b751de4322c6baf"
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      if (data.length > 0) {
        currentLat = data[0].lat;
        currentLon = data[0].lon;
        console.log(currentLat + "," + currentLon);
        getForecast(currentLat, currentLon);
      }
    })
    .catch((error) => console.error("Error:", error));
}

function getForecast(qLat, qLon) {
  fetch(
    "http://api.openweathermap.org/data/2.5/forecast?lat=" +
      qLat +
      "&lon=" +
      qLon +
      "&appid=9ff246accb301f3b2b751de4322c6baf"
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      getData(data);
    })
    .catch((error) => console.error("Error:", error));
}

function getData(qData) {
    const resultsObject = [];
    const dayLength = 8;
  
    for (let day = 0; day < qData.list.length / dayLength; day++) {
      let tempSum = 0,
        windSum = 0,
        humdSum = 0;
  
      for (let i = 0; i < dayLength; i++) {
        const index = day * dayLength + i;
        tempSum += qData.list[index].main.temp;
        windSum += qData.list[index].wind.speed;
        humdSum += qData.list[index].main.feels_like;
      }
      let now = dayjs().add(day+1, "day")
      resultsObject.push({
        date: now.format('MM/DD/YYYY'),
        icon: getIcon(qData.list[day].weather[0].icon),
        temp: Math.round(((((tempSum / dayLength) - 273.15) * 1.8) + 32)* 10) / 10 + "°",
        wind: Math.round(windSum / dayLength) + " MPH",
        humd: Math.round(((((humdSum / dayLength) - 273.15) * 1.8) + 32)* 10) / 10 + "°",
      });
    }
    finalResults = resultsObject;
    updatePage(finalResults);
  }

  function getIcon(qCode) {
    const iconArr = [
        '🌨️',
        '⛈️',
        '🌧️',
        '☁️',
        '🌤',
        '☀️'
    ];
    let currentIcon;

    if (qCode.startsWith('01')) {
        currentIcon = iconArr[5];
    } else if (qCode.startsWith('02')) {
        currentIcon = iconArr[4];
    } else if (qCode.startsWith('03')|| qCode.startsWith('04')) {
        currentIcon = iconArr[3]
    } else if (qCode.startsWith('09') || qCode.startsWith('10')) {
        currentIcon = iconArr[2]
    } else if (qCode.startsWith('11')) {
        currentIcon = iconArr[1]
    } else if (qCode.startsWith('13')) {
        currentIcon = iconArr[0]
    } else {
        currentIcon = iconArr[4];
    };

    return currentIcon;
  }

  function updatePage(dataArr) {
    for (let i = 0; i < dataArr.length; i++) {
        $(`<div class="card" style="width: 10rem">
            <div class="card-body">
                <h4 class="card-title">
                    ` + dataArr[i].date + `
                </h4>
                <p class="text-center" style="font-size: 1.5rem">
                    ` + dataArr[i].icon + `
                </p>
                <p>Temp: 
                ` + dataArr[i].temp + `F
                <br>
                Wind:
                ` + dataArr[i].wind + `
                <br>
                Humidity:
                ` + dataArr[i].humd + `
                </p>
            </div>
            </div>
        `).appendTo(calendarBox);
    }
    $(`<h2>
    ` + cityQuery + ` (` + dayjs().format('MM/DD/YYYY') + `)` + dataArr[0].icon + `   
    </h2>
    <p> 
    Temp: ` + dataArr[0].temp + `
    <br>
    Wind: ` + dataArr[0].wind + `
    <br>
    Humidity: ` + dataArr[0].humd + `
    </p>
    `).appendTo(resultsBox);
  };

$(document).ready(function () {

  getLatLon(cityQuery);

});
