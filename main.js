/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/api.js":
/*!********************!*\
  !*** ./src/api.js ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getLatLon": () => (/* binding */ getLatLon),
/* harmony export */   "getOneCallWeatherData": () => (/* binding */ getOneCallWeatherData),
/* harmony export */   "processCurrentWeatherData": () => (/* binding */ processCurrentWeatherData)
/* harmony export */ });
const apiKey = '8c95e9d81a8d8bf5438aad6c84f8a239';


const getLatLon = async (city) => {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`);
        const data = await response.json();
        return data.coord;
    } catch (error) {
        console.log(error);
        //Maybe add something to UI here when error
    }
};

const getWeatherIconURL = async (icon) => {
    try {
        const response = await fetch(`http://openweathermap.org/img/wn/${icon}@2x.png`);
        return response.url;
    } catch (error) {
        console.log(error);
    }
};

const extractForeCastData = async (data) => {
    let dailyHigh = [];
    let dailyLow = [];
    let dailyIcon = [];
    for (let day of data.daily) {
        dailyHigh.push((Math.round((day.temp.max - 273)*10)/10) + ' C');
        dailyLow.push((Math.round((day.temp.min - 273)*10)/10) + ' C');
        dailyIcon.push(await getWeatherIconURL(day.weather[0].icon));
    }
    dailyHigh.shift();
    dailyLow.shift();
    dailyIcon.shift();
    return {
        'highs': dailyHigh,
        'lows': dailyLow,
        'icons': dailyIcon
    }
};

const processCurrentWeatherData = async (data, city) => {
    let options = {
        timeZone: data.timezone,
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
      },
    formatter = new Intl.DateTimeFormat([], options);
    let time = formatter.format(new Date());
    function titleCase(str) {
        var splitStr = str.toLowerCase().split(' ');
        for (var i = 0; i < splitStr.length; i++) {
            splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
        }
        return splitStr.join(' '); 
     }
    let foreCastData = await extractForeCastData(data);
    return {
        'temp': Math.round((data.current.temp - 273)*10)/10 + ' C',
        'feels_like': Math.round((data.current.feels_like - 273)*10)/10 + ' C',
        'humidity': data.current.humidity + '%',
        'wind_speed': data.current.wind_speed + ' km/h', 
        'uvi': data.current.uvi,
        'weather_main': data.current.weather[0].main,
        'weather_desc': titleCase(data.current.weather[0].description),
        'icon': await getWeatherIconURL(data.current.weather[0].icon),
        'city': titleCase(city),
        'date': time,
        'daily_highs': foreCastData.highs,
        'daily_lows': foreCastData.lows,
        'daily_icons': foreCastData.icons,
    };
};

const getOneCallWeatherData = async (lat, lon) => {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude={part}&appid=${apiKey}`);
        return await response.json();
    } catch (error) {
        console.log(error);
    }
}



/***/ }),

/***/ "./src/ui.js":
/*!*******************!*\
  !*** ./src/ui.js ***!
  \*******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "fillWeatherInfoUI": () => (/* binding */ fillWeatherInfoUI),
/* harmony export */   "fillErrorMessage": () => (/* binding */ fillErrorMessage),
/* harmony export */   "initializeWeatherForecast": () => (/* binding */ initializeWeatherForecast),
/* harmony export */   "fillWeatherForecast": () => (/* binding */ fillWeatherForecast)
/* harmony export */ });
const fillWeatherInfoUI = (data) => {
    //fields on left
    document.querySelector('.weather-description').textContent = data.weather_desc;
    document.querySelector('.city').textContent = data.city;
    document.querySelector('.date').textContent = data.date;
    document.querySelector('.temp').textContent = data.temp;
    let img = document.querySelector('.icon-img');
    img.src = data.src = data.icon;
    document.querySelector('.error-message').classList.add('hidden');
    //Fields on right
    document.querySelector('.feels-like').textContent = data.feels_like;
    document.querySelector('.humidity').textContent = data.humidity;
    document.querySelector('.wind-speed').textContent = data.wind_speed;
    document.querySelector('.uvi').textContent = data.uvi;
};

const initializeWeatherForecast = (data) => {
    const forecast = document.querySelector('.forecast');
    for (let i=0; i<data.daily_highs.length; i++) {
        let day = document.createElement('div');
        day.classList.add('forecast-item');
        day.classList.add(`forward-${i+1}`);
        let high = document.createElement('div');
        high.classList.add('forecast-high');
        high.textContent = data.daily_highs[i];
        let low = document.createElement('div');
        low.classList.add('forecast-low');
        low.textContent = data.daily_lows[i];
        let iconDiv = document.createElement('div');
        iconDiv.classList.add('forecast-icon-container');
        let img = document.createElement('img');
        img.classList.add('forecast-icon');
        img.src = data.daily_icons[i];
        iconDiv.appendChild(img);
        day.appendChild(high);
        day.appendChild(low);
        day.appendChild(iconDiv);
        forecast.appendChild(day);
    }
};

const fillWeatherForecast = (data) => {
    const foreCastItems = document.querySelectorAll('.forecast-item');
    let index = 0;
    for (let item of foreCastItems) {
        item.children[0].textContent = data.daily_highs[index]; //daily high
        item.children[1].textContent = data.daily_lows[index]; //daily low
        item.children[2].children[0].src = data.daily_icons[index]; //daily icon
        index++;
    }
};

const fillErrorMessage = () => {
    const errorElement = document.querySelector('.error-message');
    errorElement.classList.toggle('hidden');
}





/***/ }),

/***/ "./src/utils.js":
/*!**********************!*\
  !*** ./src/utils.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "convertUnits": () => (/* binding */ convertUnits)
/* harmony export */ });
const convertForecastToF = (data) => {
    let newHighs = [];
    let newLows = [];
    for (let i=0; i<data.daily_highs.length; i++) {
        let high = Math.round((parseFloat(data.daily_highs[i].split(' ')[0]) * 9/5 + 32) * 10) / 10;
        let low = Math.round((parseFloat(data.daily_lows[i].split(' ')[0]) * 9/5 + 32) * 10) / 10;
        newHighs.push(high + ' F');
        newLows.push(low + ' F');
    }
    return {
        newHighs,
        newLows
    }
};

const convertForecastToC = (data) => {
    let newHighs = [];
    let newLows = [];
    for (let i=0; i<data.daily_highs.length; i++) {
        let high = Math.round(((parseFloat(data.daily_highs[i].split(' ')[0]) - 32) / 1.8) * 10) / 10;
        let low = Math.round(((parseFloat(data.daily_lows[i].split(' ')[0]) - 32) / 1.8) * 10) / 10;
        newHighs.push(high + ' C');
        newLows.push(low + ' C');
    }
    return {
        newHighs,
        newLows
    }
};

const convertUnits = (data) => {
    if (data.temp.includes('C')){
        let F = Math.round((parseFloat(data.temp.split(' ')[0]) * 9/5 + 32) * 10) / 10;
        let feelsLikeF = Math.round((parseFloat(data.feels_like.split(' ')[0]) * 9/5 + 32) * 10) / 10;
        let speed = Math.round(parseFloat(data.wind_speed.split(' ')[0] / 1.609) * 10) / 10;
        data.temp = F + ' F';
        data.feels_like = feelsLikeF + ' F';
        data.wind_speed = speed + ' mph';
        data.daily_highs = convertForecastToF(data).newHighs;
        data.daily_lows = convertForecastToF(data).newLows;
    } else {
        let C = Math.round(((parseFloat(data.temp.split(' ')[0]) - 32) / 1.8) * 10) / 10;
        let feelsLikeC = Math.round(((parseFloat(data.feels_like.split(' ')[0]) - 32) / 1.8) * 10) / 10;
        let speed = Math.round(parseFloat(data.wind_speed.split(' ')[0] * 1.609) * 10) / 10;
        data.temp = C + ' C';
        data.feels_like = feelsLikeC + ' C';
        data.wind_speed = speed + ' km/h';
        data.daily_highs = convertForecastToC(data).newHighs;
        data.daily_lows = convertForecastToC(data).newLows;
    }
    return data;
};



/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _api__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./api */ "./src/api.js");
/* harmony import */ var _ui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ui */ "./src/ui.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils */ "./src/utils.js");




async function getData(city) {
    const latLon = await (0,_api__WEBPACK_IMPORTED_MODULE_0__.getLatLon)(city);
    const data = await (0,_api__WEBPACK_IMPORTED_MODULE_0__.getOneCallWeatherData)(latLon.lat, latLon.lon);
    return await (0,_api__WEBPACK_IMPORTED_MODULE_0__.processCurrentWeatherData)(data, city);
}

async function main() {
    let city = 'new york'; //initial city
    let data = await getData(city);
    (0,_ui__WEBPACK_IMPORTED_MODULE_1__.fillWeatherInfoUI)(data);
    (0,_ui__WEBPACK_IMPORTED_MODULE_1__.initializeWeatherForecast)(data);
    const convert = document.querySelector('.convert');
    convert.addEventListener('click', () => {
        data = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.convertUnits)(data);
        (0,_ui__WEBPACK_IMPORTED_MODULE_1__.fillWeatherInfoUI)(data);
        (0,_ui__WEBPACK_IMPORTED_MODULE_1__.fillWeatherForecast)(data);
    });
    const search = document.querySelector('.search');
    const searchInput = document.querySelector('.search-box-input');
    search.addEventListener('click', async function() {
        try {
            let isFaren = false;
            if (data.temp.includes('F')){
                isFaren = true;
            }
            city = searchInput.value;
            data = await getData(city);
            if (isFaren) {
                data = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.convertUnits)(data);
            }
            (0,_ui__WEBPACK_IMPORTED_MODULE_1__.fillWeatherInfoUI)(data);
        } catch (error) {
            (0,_ui__WEBPACK_IMPORTED_MODULE_1__.fillErrorMessage)();
            console.log("YOYO" + error);
        }
    });
}


main();



})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFpQjtBQUM3QixVQUFVO0FBQ1YsWUFBWSxxREFBZ0I7QUFDNUI7QUFDQTtBQUNBLEtBQUs7QUFDTDs7O0FBR0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly93ZWF0aGVyX2FwcC8uL3NyYy9hcGkuanMiLCJ3ZWJwYWNrOi8vd2VhdGhlcl9hcHAvLi9zcmMvdWkuanMiLCJ3ZWJwYWNrOi8vd2VhdGhlcl9hcHAvLi9zcmMvdXRpbHMuanMiLCJ3ZWJwYWNrOi8vd2VhdGhlcl9hcHAvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vd2VhdGhlcl9hcHAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3dlYXRoZXJfYXBwL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vd2VhdGhlcl9hcHAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly93ZWF0aGVyX2FwcC8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBhcGlLZXkgPSAnOGM5NWU5ZDgxYThkOGJmNTQzOGFhZDZjODRmOGEyMzknO1xuXG5cbmNvbnN0IGdldExhdExvbiA9IGFzeW5jIChjaXR5KSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgaHR0cHM6Ly9hcGkub3BlbndlYXRoZXJtYXAub3JnL2RhdGEvMi41L3dlYXRoZXI/cT0ke2NpdHl9JmFwcGlkPSR7YXBpS2V5fWApO1xuICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgICAgICByZXR1cm4gZGF0YS5jb29yZDtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICAgIC8vTWF5YmUgYWRkIHNvbWV0aGluZyB0byBVSSBoZXJlIHdoZW4gZXJyb3JcbiAgICB9XG59O1xuXG5jb25zdCBnZXRXZWF0aGVySWNvblVSTCA9IGFzeW5jIChpY29uKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgaHR0cDovL29wZW53ZWF0aGVybWFwLm9yZy9pbWcvd24vJHtpY29ufUAyeC5wbmdgKTtcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnVybDtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgfVxufTtcblxuY29uc3QgZXh0cmFjdEZvcmVDYXN0RGF0YSA9IGFzeW5jIChkYXRhKSA9PiB7XG4gICAgbGV0IGRhaWx5SGlnaCA9IFtdO1xuICAgIGxldCBkYWlseUxvdyA9IFtdO1xuICAgIGxldCBkYWlseUljb24gPSBbXTtcbiAgICBmb3IgKGxldCBkYXkgb2YgZGF0YS5kYWlseSkge1xuICAgICAgICBkYWlseUhpZ2gucHVzaCgoTWF0aC5yb3VuZCgoZGF5LnRlbXAubWF4IC0gMjczKSoxMCkvMTApICsgJyBDJyk7XG4gICAgICAgIGRhaWx5TG93LnB1c2goKE1hdGgucm91bmQoKGRheS50ZW1wLm1pbiAtIDI3MykqMTApLzEwKSArICcgQycpO1xuICAgICAgICBkYWlseUljb24ucHVzaChhd2FpdCBnZXRXZWF0aGVySWNvblVSTChkYXkud2VhdGhlclswXS5pY29uKSk7XG4gICAgfVxuICAgIGRhaWx5SGlnaC5zaGlmdCgpO1xuICAgIGRhaWx5TG93LnNoaWZ0KCk7XG4gICAgZGFpbHlJY29uLnNoaWZ0KCk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgJ2hpZ2hzJzogZGFpbHlIaWdoLFxuICAgICAgICAnbG93cyc6IGRhaWx5TG93LFxuICAgICAgICAnaWNvbnMnOiBkYWlseUljb25cbiAgICB9XG59O1xuXG5jb25zdCBwcm9jZXNzQ3VycmVudFdlYXRoZXJEYXRhID0gYXN5bmMgKGRhdGEsIGNpdHkpID0+IHtcbiAgICBsZXQgb3B0aW9ucyA9IHtcbiAgICAgICAgdGltZVpvbmU6IGRhdGEudGltZXpvbmUsXG4gICAgICAgIHllYXI6ICdudW1lcmljJyxcbiAgICAgICAgbW9udGg6ICdudW1lcmljJyxcbiAgICAgICAgZGF5OiAnbnVtZXJpYycsXG4gICAgICAgIGhvdXI6ICdudW1lcmljJyxcbiAgICAgICAgbWludXRlOiAnbnVtZXJpYycsXG4gICAgICAgIHNlY29uZDogJ251bWVyaWMnLFxuICAgICAgfSxcbiAgICBmb3JtYXR0ZXIgPSBuZXcgSW50bC5EYXRlVGltZUZvcm1hdChbXSwgb3B0aW9ucyk7XG4gICAgbGV0IHRpbWUgPSBmb3JtYXR0ZXIuZm9ybWF0KG5ldyBEYXRlKCkpO1xuICAgIGZ1bmN0aW9uIHRpdGxlQ2FzZShzdHIpIHtcbiAgICAgICAgdmFyIHNwbGl0U3RyID0gc3RyLnRvTG93ZXJDYXNlKCkuc3BsaXQoJyAnKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzcGxpdFN0ci5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgc3BsaXRTdHJbaV0gPSBzcGxpdFN0cltpXS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHNwbGl0U3RyW2ldLnN1YnN0cmluZygxKTsgICAgIFxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzcGxpdFN0ci5qb2luKCcgJyk7IFxuICAgICB9XG4gICAgbGV0IGZvcmVDYXN0RGF0YSA9IGF3YWl0IGV4dHJhY3RGb3JlQ2FzdERhdGEoZGF0YSk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgJ3RlbXAnOiBNYXRoLnJvdW5kKChkYXRhLmN1cnJlbnQudGVtcCAtIDI3MykqMTApLzEwICsgJyBDJyxcbiAgICAgICAgJ2ZlZWxzX2xpa2UnOiBNYXRoLnJvdW5kKChkYXRhLmN1cnJlbnQuZmVlbHNfbGlrZSAtIDI3MykqMTApLzEwICsgJyBDJyxcbiAgICAgICAgJ2h1bWlkaXR5JzogZGF0YS5jdXJyZW50Lmh1bWlkaXR5ICsgJyUnLFxuICAgICAgICAnd2luZF9zcGVlZCc6IGRhdGEuY3VycmVudC53aW5kX3NwZWVkICsgJyBrbS9oJywgXG4gICAgICAgICd1dmknOiBkYXRhLmN1cnJlbnQudXZpLFxuICAgICAgICAnd2VhdGhlcl9tYWluJzogZGF0YS5jdXJyZW50LndlYXRoZXJbMF0ubWFpbixcbiAgICAgICAgJ3dlYXRoZXJfZGVzYyc6IHRpdGxlQ2FzZShkYXRhLmN1cnJlbnQud2VhdGhlclswXS5kZXNjcmlwdGlvbiksXG4gICAgICAgICdpY29uJzogYXdhaXQgZ2V0V2VhdGhlckljb25VUkwoZGF0YS5jdXJyZW50LndlYXRoZXJbMF0uaWNvbiksXG4gICAgICAgICdjaXR5JzogdGl0bGVDYXNlKGNpdHkpLFxuICAgICAgICAnZGF0ZSc6IHRpbWUsXG4gICAgICAgICdkYWlseV9oaWdocyc6IGZvcmVDYXN0RGF0YS5oaWdocyxcbiAgICAgICAgJ2RhaWx5X2xvd3MnOiBmb3JlQ2FzdERhdGEubG93cyxcbiAgICAgICAgJ2RhaWx5X2ljb25zJzogZm9yZUNhc3REYXRhLmljb25zLFxuICAgIH07XG59O1xuXG5jb25zdCBnZXRPbmVDYWxsV2VhdGhlckRhdGEgPSBhc3luYyAobGF0LCBsb24pID0+IHtcbiAgICB0cnkge1xuICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGBodHRwczovL2FwaS5vcGVud2VhdGhlcm1hcC5vcmcvZGF0YS8yLjUvb25lY2FsbD9sYXQ9JHtsYXR9Jmxvbj0ke2xvbn0mZXhjbHVkZT17cGFydH0mYXBwaWQ9JHthcGlLZXl9YCk7XG4gICAgICAgIHJldHVybiBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgIH1cbn1cblxuZXhwb3J0IHtcbiAgICBnZXRMYXRMb24sIGdldE9uZUNhbGxXZWF0aGVyRGF0YSwgcHJvY2Vzc0N1cnJlbnRXZWF0aGVyRGF0YVxufSIsImNvbnN0IGZpbGxXZWF0aGVySW5mb1VJID0gKGRhdGEpID0+IHtcbiAgICAvL2ZpZWxkcyBvbiBsZWZ0XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLndlYXRoZXItZGVzY3JpcHRpb24nKS50ZXh0Q29udGVudCA9IGRhdGEud2VhdGhlcl9kZXNjO1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jaXR5JykudGV4dENvbnRlbnQgPSBkYXRhLmNpdHk7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmRhdGUnKS50ZXh0Q29udGVudCA9IGRhdGEuZGF0ZTtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudGVtcCcpLnRleHRDb250ZW50ID0gZGF0YS50ZW1wO1xuICAgIGxldCBpbWcgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaWNvbi1pbWcnKTtcbiAgICBpbWcuc3JjID0gZGF0YS5zcmMgPSBkYXRhLmljb247XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmVycm9yLW1lc3NhZ2UnKS5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKTtcbiAgICAvL0ZpZWxkcyBvbiByaWdodFxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5mZWVscy1saWtlJykudGV4dENvbnRlbnQgPSBkYXRhLmZlZWxzX2xpa2U7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmh1bWlkaXR5JykudGV4dENvbnRlbnQgPSBkYXRhLmh1bWlkaXR5O1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy53aW5kLXNwZWVkJykudGV4dENvbnRlbnQgPSBkYXRhLndpbmRfc3BlZWQ7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnV2aScpLnRleHRDb250ZW50ID0gZGF0YS51dmk7XG59O1xuXG5jb25zdCBpbml0aWFsaXplV2VhdGhlckZvcmVjYXN0ID0gKGRhdGEpID0+IHtcbiAgICBjb25zdCBmb3JlY2FzdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5mb3JlY2FzdCcpO1xuICAgIGZvciAobGV0IGk9MDsgaTxkYXRhLmRhaWx5X2hpZ2hzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGxldCBkYXkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgZGF5LmNsYXNzTGlzdC5hZGQoJ2ZvcmVjYXN0LWl0ZW0nKTtcbiAgICAgICAgZGF5LmNsYXNzTGlzdC5hZGQoYGZvcndhcmQtJHtpKzF9YCk7XG4gICAgICAgIGxldCBoaWdoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGhpZ2guY2xhc3NMaXN0LmFkZCgnZm9yZWNhc3QtaGlnaCcpO1xuICAgICAgICBoaWdoLnRleHRDb250ZW50ID0gZGF0YS5kYWlseV9oaWdoc1tpXTtcbiAgICAgICAgbGV0IGxvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBsb3cuY2xhc3NMaXN0LmFkZCgnZm9yZWNhc3QtbG93Jyk7XG4gICAgICAgIGxvdy50ZXh0Q29udGVudCA9IGRhdGEuZGFpbHlfbG93c1tpXTtcbiAgICAgICAgbGV0IGljb25EaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgaWNvbkRpdi5jbGFzc0xpc3QuYWRkKCdmb3JlY2FzdC1pY29uLWNvbnRhaW5lcicpO1xuICAgICAgICBsZXQgaW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG4gICAgICAgIGltZy5jbGFzc0xpc3QuYWRkKCdmb3JlY2FzdC1pY29uJyk7XG4gICAgICAgIGltZy5zcmMgPSBkYXRhLmRhaWx5X2ljb25zW2ldO1xuICAgICAgICBpY29uRGl2LmFwcGVuZENoaWxkKGltZyk7XG4gICAgICAgIGRheS5hcHBlbmRDaGlsZChoaWdoKTtcbiAgICAgICAgZGF5LmFwcGVuZENoaWxkKGxvdyk7XG4gICAgICAgIGRheS5hcHBlbmRDaGlsZChpY29uRGl2KTtcbiAgICAgICAgZm9yZWNhc3QuYXBwZW5kQ2hpbGQoZGF5KTtcbiAgICB9XG59O1xuXG5jb25zdCBmaWxsV2VhdGhlckZvcmVjYXN0ID0gKGRhdGEpID0+IHtcbiAgICBjb25zdCBmb3JlQ2FzdEl0ZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmZvcmVjYXN0LWl0ZW0nKTtcbiAgICBsZXQgaW5kZXggPSAwO1xuICAgIGZvciAobGV0IGl0ZW0gb2YgZm9yZUNhc3RJdGVtcykge1xuICAgICAgICBpdGVtLmNoaWxkcmVuWzBdLnRleHRDb250ZW50ID0gZGF0YS5kYWlseV9oaWdoc1tpbmRleF07IC8vZGFpbHkgaGlnaFxuICAgICAgICBpdGVtLmNoaWxkcmVuWzFdLnRleHRDb250ZW50ID0gZGF0YS5kYWlseV9sb3dzW2luZGV4XTsgLy9kYWlseSBsb3dcbiAgICAgICAgaXRlbS5jaGlsZHJlblsyXS5jaGlsZHJlblswXS5zcmMgPSBkYXRhLmRhaWx5X2ljb25zW2luZGV4XTsgLy9kYWlseSBpY29uXG4gICAgICAgIGluZGV4Kys7XG4gICAgfVxufTtcblxuY29uc3QgZmlsbEVycm9yTWVzc2FnZSA9ICgpID0+IHtcbiAgICBjb25zdCBlcnJvckVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZXJyb3ItbWVzc2FnZScpO1xuICAgIGVycm9yRWxlbWVudC5jbGFzc0xpc3QudG9nZ2xlKCdoaWRkZW4nKTtcbn1cblxuXG5cbmV4cG9ydCB7XG4gICAgZmlsbFdlYXRoZXJJbmZvVUksIGZpbGxFcnJvck1lc3NhZ2UsIGluaXRpYWxpemVXZWF0aGVyRm9yZWNhc3QsIGZpbGxXZWF0aGVyRm9yZWNhc3Rcbn0iLCJjb25zdCBjb252ZXJ0Rm9yZWNhc3RUb0YgPSAoZGF0YSkgPT4ge1xuICAgIGxldCBuZXdIaWdocyA9IFtdO1xuICAgIGxldCBuZXdMb3dzID0gW107XG4gICAgZm9yIChsZXQgaT0wOyBpPGRhdGEuZGFpbHlfaGlnaHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgbGV0IGhpZ2ggPSBNYXRoLnJvdW5kKChwYXJzZUZsb2F0KGRhdGEuZGFpbHlfaGlnaHNbaV0uc3BsaXQoJyAnKVswXSkgKiA5LzUgKyAzMikgKiAxMCkgLyAxMDtcbiAgICAgICAgbGV0IGxvdyA9IE1hdGgucm91bmQoKHBhcnNlRmxvYXQoZGF0YS5kYWlseV9sb3dzW2ldLnNwbGl0KCcgJylbMF0pICogOS81ICsgMzIpICogMTApIC8gMTA7XG4gICAgICAgIG5ld0hpZ2hzLnB1c2goaGlnaCArICcgRicpO1xuICAgICAgICBuZXdMb3dzLnB1c2gobG93ICsgJyBGJyk7XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICAgIG5ld0hpZ2hzLFxuICAgICAgICBuZXdMb3dzXG4gICAgfVxufTtcblxuY29uc3QgY29udmVydEZvcmVjYXN0VG9DID0gKGRhdGEpID0+IHtcbiAgICBsZXQgbmV3SGlnaHMgPSBbXTtcbiAgICBsZXQgbmV3TG93cyA9IFtdO1xuICAgIGZvciAobGV0IGk9MDsgaTxkYXRhLmRhaWx5X2hpZ2hzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGxldCBoaWdoID0gTWF0aC5yb3VuZCgoKHBhcnNlRmxvYXQoZGF0YS5kYWlseV9oaWdoc1tpXS5zcGxpdCgnICcpWzBdKSAtIDMyKSAvIDEuOCkgKiAxMCkgLyAxMDtcbiAgICAgICAgbGV0IGxvdyA9IE1hdGgucm91bmQoKChwYXJzZUZsb2F0KGRhdGEuZGFpbHlfbG93c1tpXS5zcGxpdCgnICcpWzBdKSAtIDMyKSAvIDEuOCkgKiAxMCkgLyAxMDtcbiAgICAgICAgbmV3SGlnaHMucHVzaChoaWdoICsgJyBDJyk7XG4gICAgICAgIG5ld0xvd3MucHVzaChsb3cgKyAnIEMnKTtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgICAgbmV3SGlnaHMsXG4gICAgICAgIG5ld0xvd3NcbiAgICB9XG59O1xuXG5jb25zdCBjb252ZXJ0VW5pdHMgPSAoZGF0YSkgPT4ge1xuICAgIGlmIChkYXRhLnRlbXAuaW5jbHVkZXMoJ0MnKSl7XG4gICAgICAgIGxldCBGID0gTWF0aC5yb3VuZCgocGFyc2VGbG9hdChkYXRhLnRlbXAuc3BsaXQoJyAnKVswXSkgKiA5LzUgKyAzMikgKiAxMCkgLyAxMDtcbiAgICAgICAgbGV0IGZlZWxzTGlrZUYgPSBNYXRoLnJvdW5kKChwYXJzZUZsb2F0KGRhdGEuZmVlbHNfbGlrZS5zcGxpdCgnICcpWzBdKSAqIDkvNSArIDMyKSAqIDEwKSAvIDEwO1xuICAgICAgICBsZXQgc3BlZWQgPSBNYXRoLnJvdW5kKHBhcnNlRmxvYXQoZGF0YS53aW5kX3NwZWVkLnNwbGl0KCcgJylbMF0gLyAxLjYwOSkgKiAxMCkgLyAxMDtcbiAgICAgICAgZGF0YS50ZW1wID0gRiArICcgRic7XG4gICAgICAgIGRhdGEuZmVlbHNfbGlrZSA9IGZlZWxzTGlrZUYgKyAnIEYnO1xuICAgICAgICBkYXRhLndpbmRfc3BlZWQgPSBzcGVlZCArICcgbXBoJztcbiAgICAgICAgZGF0YS5kYWlseV9oaWdocyA9IGNvbnZlcnRGb3JlY2FzdFRvRihkYXRhKS5uZXdIaWdocztcbiAgICAgICAgZGF0YS5kYWlseV9sb3dzID0gY29udmVydEZvcmVjYXN0VG9GKGRhdGEpLm5ld0xvd3M7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgbGV0IEMgPSBNYXRoLnJvdW5kKCgocGFyc2VGbG9hdChkYXRhLnRlbXAuc3BsaXQoJyAnKVswXSkgLSAzMikgLyAxLjgpICogMTApIC8gMTA7XG4gICAgICAgIGxldCBmZWVsc0xpa2VDID0gTWF0aC5yb3VuZCgoKHBhcnNlRmxvYXQoZGF0YS5mZWVsc19saWtlLnNwbGl0KCcgJylbMF0pIC0gMzIpIC8gMS44KSAqIDEwKSAvIDEwO1xuICAgICAgICBsZXQgc3BlZWQgPSBNYXRoLnJvdW5kKHBhcnNlRmxvYXQoZGF0YS53aW5kX3NwZWVkLnNwbGl0KCcgJylbMF0gKiAxLjYwOSkgKiAxMCkgLyAxMDtcbiAgICAgICAgZGF0YS50ZW1wID0gQyArICcgQyc7XG4gICAgICAgIGRhdGEuZmVlbHNfbGlrZSA9IGZlZWxzTGlrZUMgKyAnIEMnO1xuICAgICAgICBkYXRhLndpbmRfc3BlZWQgPSBzcGVlZCArICcga20vaCc7XG4gICAgICAgIGRhdGEuZGFpbHlfaGlnaHMgPSBjb252ZXJ0Rm9yZWNhc3RUb0MoZGF0YSkubmV3SGlnaHM7XG4gICAgICAgIGRhdGEuZGFpbHlfbG93cyA9IGNvbnZlcnRGb3JlY2FzdFRvQyhkYXRhKS5uZXdMb3dzO1xuICAgIH1cbiAgICByZXR1cm4gZGF0YTtcbn07XG5cbmV4cG9ydCB7XG4gICAgY29udmVydFVuaXRzXG59IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgeyBnZXRMYXRMb24sIGdldE9uZUNhbGxXZWF0aGVyRGF0YSwgcHJvY2Vzc0N1cnJlbnRXZWF0aGVyRGF0YSB9IGZyb20gXCIuL2FwaVwiO1xuaW1wb3J0IHsgZmlsbEVycm9yTWVzc2FnZSwgZmlsbFdlYXRoZXJJbmZvVUksIGluaXRpYWxpemVXZWF0aGVyRm9yZWNhc3QsIGZpbGxXZWF0aGVyRm9yZWNhc3QgfSBmcm9tIFwiLi91aVwiO1xuaW1wb3J0IHsgY29udmVydFVuaXRzIH0gZnJvbSBcIi4vdXRpbHNcIjtcblxuYXN5bmMgZnVuY3Rpb24gZ2V0RGF0YShjaXR5KSB7XG4gICAgY29uc3QgbGF0TG9uID0gYXdhaXQgZ2V0TGF0TG9uKGNpdHkpO1xuICAgIGNvbnN0IGRhdGEgPSBhd2FpdCBnZXRPbmVDYWxsV2VhdGhlckRhdGEobGF0TG9uLmxhdCwgbGF0TG9uLmxvbik7XG4gICAgcmV0dXJuIGF3YWl0IHByb2Nlc3NDdXJyZW50V2VhdGhlckRhdGEoZGF0YSwgY2l0eSk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIG1haW4oKSB7XG4gICAgbGV0IGNpdHkgPSAnbmV3IHlvcmsnOyAvL2luaXRpYWwgY2l0eVxuICAgIGxldCBkYXRhID0gYXdhaXQgZ2V0RGF0YShjaXR5KTtcbiAgICBmaWxsV2VhdGhlckluZm9VSShkYXRhKTtcbiAgICBpbml0aWFsaXplV2VhdGhlckZvcmVjYXN0KGRhdGEpO1xuICAgIGNvbnN0IGNvbnZlcnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY29udmVydCcpO1xuICAgIGNvbnZlcnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgIGRhdGEgPSBjb252ZXJ0VW5pdHMoZGF0YSk7XG4gICAgICAgIGZpbGxXZWF0aGVySW5mb1VJKGRhdGEpO1xuICAgICAgICBmaWxsV2VhdGhlckZvcmVjYXN0KGRhdGEpO1xuICAgIH0pO1xuICAgIGNvbnN0IHNlYXJjaCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zZWFyY2gnKTtcbiAgICBjb25zdCBzZWFyY2hJbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zZWFyY2gtYm94LWlucHV0Jyk7XG4gICAgc2VhcmNoLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYXN5bmMgZnVuY3Rpb24oKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsZXQgaXNGYXJlbiA9IGZhbHNlO1xuICAgICAgICAgICAgaWYgKGRhdGEudGVtcC5pbmNsdWRlcygnRicpKXtcbiAgICAgICAgICAgICAgICBpc0ZhcmVuID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNpdHkgPSBzZWFyY2hJbnB1dC52YWx1ZTtcbiAgICAgICAgICAgIGRhdGEgPSBhd2FpdCBnZXREYXRhKGNpdHkpO1xuICAgICAgICAgICAgaWYgKGlzRmFyZW4pIHtcbiAgICAgICAgICAgICAgICBkYXRhID0gY29udmVydFVuaXRzKGRhdGEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZmlsbFdlYXRoZXJJbmZvVUkoZGF0YSk7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBmaWxsRXJyb3JNZXNzYWdlKCk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIllPWU9cIiArIGVycm9yKTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG5cbm1haW4oKTtcblxuXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=