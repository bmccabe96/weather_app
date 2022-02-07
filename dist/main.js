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
        const response = await fetch(`https://openweathermap.org/img/wn/${icon}@2x.png`);
        return response.url;
    } catch (error) {
        console.log(error);
    }
};

const extractForeCastData = async (data) => {
    let dailyHigh = [];
    let dailyLow = [];
    let dailyIcon = [];
    let dailyDays = [];
    const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    let index = 0;
    for (let day of data.daily) {
        dailyHigh.push((Math.round((day.temp.max - 273)*10)/10) + ' C');
        dailyLow.push((Math.round((day.temp.min - 273)*10)/10) + ' C');
        dailyIcon.push(await getWeatherIconURL(day.weather[0].icon));
        let date = new Date();
        date.setDate(date.getDate() + index);
        dailyDays.push(weekday[date.getDay()]);
        index++;
    }
    dailyHigh.shift();
    dailyLow.shift();
    dailyIcon.shift();
    dailyDays.shift();
    return {
        'highs': dailyHigh,
        'lows': dailyLow,
        'icons': dailyIcon,
        'weekdays': dailyDays,
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
        'daily_days': foreCastData.weekdays
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
        let weekday = document.createElement('div');
        weekday.classList.add('forecast-weekday');
        weekday.textContent = data.daily_days[i];
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
        day.appendChild(weekday);
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
        item.children[0].textContent = data.daily_days[index]; //weekday
        item.children[1].textContent = data.daily_highs[index]; //daily high
        item.children[2].textContent = data.daily_lows[index]; //daily low
        item.children[3].children[0].src = data.daily_icons[index]; //daily icon
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
    console.log(data);
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
            (0,_ui__WEBPACK_IMPORTED_MODULE_1__.fillWeatherForecast)(data);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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TDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLG9EQUFZO0FBQ25DO0FBQ0EsWUFBWSxzREFBaUI7QUFDN0IsWUFBWSx3REFBbUI7QUFDL0IsVUFBVTtBQUNWLFlBQVkscURBQWdCO0FBQzVCO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7OztBQUdBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vd2VhdGhlcl9hcHAvLi9zcmMvYXBpLmpzIiwid2VicGFjazovL3dlYXRoZXJfYXBwLy4vc3JjL3VpLmpzIiwid2VicGFjazovL3dlYXRoZXJfYXBwLy4vc3JjL3V0aWxzLmpzIiwid2VicGFjazovL3dlYXRoZXJfYXBwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3dlYXRoZXJfYXBwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly93ZWF0aGVyX2FwcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3dlYXRoZXJfYXBwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vd2VhdGhlcl9hcHAvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgYXBpS2V5ID0gJzhjOTVlOWQ4MWE4ZDhiZjU0MzhhYWQ2Yzg0ZjhhMjM5JztcblxuXG5jb25zdCBnZXRMYXRMb24gPSBhc3luYyAoY2l0eSkgPT4ge1xuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYGh0dHBzOi8vYXBpLm9wZW53ZWF0aGVybWFwLm9yZy9kYXRhLzIuNS93ZWF0aGVyP3E9JHtjaXR5fSZhcHBpZD0ke2FwaUtleX1gKTtcbiAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICAgICAgcmV0dXJuIGRhdGEuY29vcmQ7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgICAvL01heWJlIGFkZCBzb21ldGhpbmcgdG8gVUkgaGVyZSB3aGVuIGVycm9yXG4gICAgfVxufTtcblxuY29uc3QgZ2V0V2VhdGhlckljb25VUkwgPSBhc3luYyAoaWNvbikgPT4ge1xuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYGh0dHBzOi8vb3BlbndlYXRoZXJtYXAub3JnL2ltZy93bi8ke2ljb259QDJ4LnBuZ2ApO1xuICAgICAgICByZXR1cm4gcmVzcG9uc2UudXJsO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICB9XG59O1xuXG5jb25zdCBleHRyYWN0Rm9yZUNhc3REYXRhID0gYXN5bmMgKGRhdGEpID0+IHtcbiAgICBsZXQgZGFpbHlIaWdoID0gW107XG4gICAgbGV0IGRhaWx5TG93ID0gW107XG4gICAgbGV0IGRhaWx5SWNvbiA9IFtdO1xuICAgIGxldCBkYWlseURheXMgPSBbXTtcbiAgICBjb25zdCB3ZWVrZGF5ID0gW1wiU3VuZGF5XCIsXCJNb25kYXlcIixcIlR1ZXNkYXlcIixcIldlZG5lc2RheVwiLFwiVGh1cnNkYXlcIixcIkZyaWRheVwiLFwiU2F0dXJkYXlcIl07XG4gICAgbGV0IGluZGV4ID0gMDtcbiAgICBmb3IgKGxldCBkYXkgb2YgZGF0YS5kYWlseSkge1xuICAgICAgICBkYWlseUhpZ2gucHVzaCgoTWF0aC5yb3VuZCgoZGF5LnRlbXAubWF4IC0gMjczKSoxMCkvMTApICsgJyBDJyk7XG4gICAgICAgIGRhaWx5TG93LnB1c2goKE1hdGgucm91bmQoKGRheS50ZW1wLm1pbiAtIDI3MykqMTApLzEwKSArICcgQycpO1xuICAgICAgICBkYWlseUljb24ucHVzaChhd2FpdCBnZXRXZWF0aGVySWNvblVSTChkYXkud2VhdGhlclswXS5pY29uKSk7XG4gICAgICAgIGxldCBkYXRlID0gbmV3IERhdGUoKTtcbiAgICAgICAgZGF0ZS5zZXREYXRlKGRhdGUuZ2V0RGF0ZSgpICsgaW5kZXgpO1xuICAgICAgICBkYWlseURheXMucHVzaCh3ZWVrZGF5W2RhdGUuZ2V0RGF5KCldKTtcbiAgICAgICAgaW5kZXgrKztcbiAgICB9XG4gICAgZGFpbHlIaWdoLnNoaWZ0KCk7XG4gICAgZGFpbHlMb3cuc2hpZnQoKTtcbiAgICBkYWlseUljb24uc2hpZnQoKTtcbiAgICBkYWlseURheXMuc2hpZnQoKTtcbiAgICByZXR1cm4ge1xuICAgICAgICAnaGlnaHMnOiBkYWlseUhpZ2gsXG4gICAgICAgICdsb3dzJzogZGFpbHlMb3csXG4gICAgICAgICdpY29ucyc6IGRhaWx5SWNvbixcbiAgICAgICAgJ3dlZWtkYXlzJzogZGFpbHlEYXlzLFxuICAgIH1cbn07XG5cbmNvbnN0IHByb2Nlc3NDdXJyZW50V2VhdGhlckRhdGEgPSBhc3luYyAoZGF0YSwgY2l0eSkgPT4ge1xuICAgIGxldCBvcHRpb25zID0ge1xuICAgICAgICB0aW1lWm9uZTogZGF0YS50aW1lem9uZSxcbiAgICAgICAgeWVhcjogJ251bWVyaWMnLFxuICAgICAgICBtb250aDogJ251bWVyaWMnLFxuICAgICAgICBkYXk6ICdudW1lcmljJyxcbiAgICAgICAgaG91cjogJ251bWVyaWMnLFxuICAgICAgICBtaW51dGU6ICdudW1lcmljJyxcbiAgICAgICAgc2Vjb25kOiAnbnVtZXJpYycsXG4gICAgICB9LFxuICAgIGZvcm1hdHRlciA9IG5ldyBJbnRsLkRhdGVUaW1lRm9ybWF0KFtdLCBvcHRpb25zKTtcbiAgICBsZXQgdGltZSA9IGZvcm1hdHRlci5mb3JtYXQobmV3IERhdGUoKSk7XG4gICAgZnVuY3Rpb24gdGl0bGVDYXNlKHN0cikge1xuICAgICAgICB2YXIgc3BsaXRTdHIgPSBzdHIudG9Mb3dlckNhc2UoKS5zcGxpdCgnICcpO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNwbGl0U3RyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBzcGxpdFN0cltpXSA9IHNwbGl0U3RyW2ldLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgc3BsaXRTdHJbaV0uc3Vic3RyaW5nKDEpOyAgICAgXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHNwbGl0U3RyLmpvaW4oJyAnKTsgXG4gICAgIH1cbiAgICBsZXQgZm9yZUNhc3REYXRhID0gYXdhaXQgZXh0cmFjdEZvcmVDYXN0RGF0YShkYXRhKTtcbiAgICByZXR1cm4ge1xuICAgICAgICAndGVtcCc6IE1hdGgucm91bmQoKGRhdGEuY3VycmVudC50ZW1wIC0gMjczKSoxMCkvMTAgKyAnIEMnLFxuICAgICAgICAnZmVlbHNfbGlrZSc6IE1hdGgucm91bmQoKGRhdGEuY3VycmVudC5mZWVsc19saWtlIC0gMjczKSoxMCkvMTAgKyAnIEMnLFxuICAgICAgICAnaHVtaWRpdHknOiBkYXRhLmN1cnJlbnQuaHVtaWRpdHkgKyAnJScsXG4gICAgICAgICd3aW5kX3NwZWVkJzogZGF0YS5jdXJyZW50LndpbmRfc3BlZWQgKyAnIGttL2gnLCBcbiAgICAgICAgJ3V2aSc6IGRhdGEuY3VycmVudC51dmksXG4gICAgICAgICd3ZWF0aGVyX21haW4nOiBkYXRhLmN1cnJlbnQud2VhdGhlclswXS5tYWluLFxuICAgICAgICAnd2VhdGhlcl9kZXNjJzogdGl0bGVDYXNlKGRhdGEuY3VycmVudC53ZWF0aGVyWzBdLmRlc2NyaXB0aW9uKSxcbiAgICAgICAgJ2ljb24nOiBhd2FpdCBnZXRXZWF0aGVySWNvblVSTChkYXRhLmN1cnJlbnQud2VhdGhlclswXS5pY29uKSxcbiAgICAgICAgJ2NpdHknOiB0aXRsZUNhc2UoY2l0eSksXG4gICAgICAgICdkYXRlJzogdGltZSxcbiAgICAgICAgJ2RhaWx5X2hpZ2hzJzogZm9yZUNhc3REYXRhLmhpZ2hzLFxuICAgICAgICAnZGFpbHlfbG93cyc6IGZvcmVDYXN0RGF0YS5sb3dzLFxuICAgICAgICAnZGFpbHlfaWNvbnMnOiBmb3JlQ2FzdERhdGEuaWNvbnMsXG4gICAgICAgICdkYWlseV9kYXlzJzogZm9yZUNhc3REYXRhLndlZWtkYXlzXG4gICAgfTtcbn07XG5cbmNvbnN0IGdldE9uZUNhbGxXZWF0aGVyRGF0YSA9IGFzeW5jIChsYXQsIGxvbikgPT4ge1xuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYGh0dHBzOi8vYXBpLm9wZW53ZWF0aGVybWFwLm9yZy9kYXRhLzIuNS9vbmVjYWxsP2xhdD0ke2xhdH0mbG9uPSR7bG9ufSZleGNsdWRlPXtwYXJ0fSZhcHBpZD0ke2FwaUtleX1gKTtcbiAgICAgICAgcmV0dXJuIGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgfVxufVxuXG5leHBvcnQge1xuICAgIGdldExhdExvbiwgZ2V0T25lQ2FsbFdlYXRoZXJEYXRhLCBwcm9jZXNzQ3VycmVudFdlYXRoZXJEYXRhXG59IiwiY29uc3QgZmlsbFdlYXRoZXJJbmZvVUkgPSAoZGF0YSkgPT4ge1xuICAgIC8vZmllbGRzIG9uIGxlZnRcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcud2VhdGhlci1kZXNjcmlwdGlvbicpLnRleHRDb250ZW50ID0gZGF0YS53ZWF0aGVyX2Rlc2M7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNpdHknKS50ZXh0Q29udGVudCA9IGRhdGEuY2l0eTtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZGF0ZScpLnRleHRDb250ZW50ID0gZGF0YS5kYXRlO1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50ZW1wJykudGV4dENvbnRlbnQgPSBkYXRhLnRlbXA7XG4gICAgbGV0IGltZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5pY29uLWltZycpO1xuICAgIGltZy5zcmMgPSBkYXRhLnNyYyA9IGRhdGEuaWNvbjtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZXJyb3ItbWVzc2FnZScpLmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpO1xuICAgIC8vRmllbGRzIG9uIHJpZ2h0XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmZlZWxzLWxpa2UnKS50ZXh0Q29udGVudCA9IGRhdGEuZmVlbHNfbGlrZTtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaHVtaWRpdHknKS50ZXh0Q29udGVudCA9IGRhdGEuaHVtaWRpdHk7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLndpbmQtc3BlZWQnKS50ZXh0Q29udGVudCA9IGRhdGEud2luZF9zcGVlZDtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudXZpJykudGV4dENvbnRlbnQgPSBkYXRhLnV2aTtcbn07XG5cbmNvbnN0IGluaXRpYWxpemVXZWF0aGVyRm9yZWNhc3QgPSAoZGF0YSkgPT4ge1xuICAgIGNvbnN0IGZvcmVjYXN0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmZvcmVjYXN0Jyk7XG4gICAgZm9yIChsZXQgaT0wOyBpPGRhdGEuZGFpbHlfaGlnaHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgbGV0IGRheSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBkYXkuY2xhc3NMaXN0LmFkZCgnZm9yZWNhc3QtaXRlbScpO1xuICAgICAgICBkYXkuY2xhc3NMaXN0LmFkZChgZm9yd2FyZC0ke2krMX1gKTtcbiAgICAgICAgbGV0IHdlZWtkYXkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgd2Vla2RheS5jbGFzc0xpc3QuYWRkKCdmb3JlY2FzdC13ZWVrZGF5Jyk7XG4gICAgICAgIHdlZWtkYXkudGV4dENvbnRlbnQgPSBkYXRhLmRhaWx5X2RheXNbaV07XG4gICAgICAgIGxldCBoaWdoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGhpZ2guY2xhc3NMaXN0LmFkZCgnZm9yZWNhc3QtaGlnaCcpO1xuICAgICAgICBoaWdoLnRleHRDb250ZW50ID0gZGF0YS5kYWlseV9oaWdoc1tpXTtcbiAgICAgICAgbGV0IGxvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBsb3cuY2xhc3NMaXN0LmFkZCgnZm9yZWNhc3QtbG93Jyk7XG4gICAgICAgIGxvdy50ZXh0Q29udGVudCA9IGRhdGEuZGFpbHlfbG93c1tpXTtcbiAgICAgICAgbGV0IGljb25EaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgaWNvbkRpdi5jbGFzc0xpc3QuYWRkKCdmb3JlY2FzdC1pY29uLWNvbnRhaW5lcicpO1xuICAgICAgICBsZXQgaW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG4gICAgICAgIGltZy5jbGFzc0xpc3QuYWRkKCdmb3JlY2FzdC1pY29uJyk7XG4gICAgICAgIGltZy5zcmMgPSBkYXRhLmRhaWx5X2ljb25zW2ldO1xuICAgICAgICBpY29uRGl2LmFwcGVuZENoaWxkKGltZyk7XG4gICAgICAgIGRheS5hcHBlbmRDaGlsZCh3ZWVrZGF5KTtcbiAgICAgICAgZGF5LmFwcGVuZENoaWxkKGhpZ2gpO1xuICAgICAgICBkYXkuYXBwZW5kQ2hpbGQobG93KTtcbiAgICAgICAgZGF5LmFwcGVuZENoaWxkKGljb25EaXYpO1xuICAgICAgICBmb3JlY2FzdC5hcHBlbmRDaGlsZChkYXkpO1xuICAgIH1cbn07XG5cbmNvbnN0IGZpbGxXZWF0aGVyRm9yZWNhc3QgPSAoZGF0YSkgPT4ge1xuICAgIGNvbnN0IGZvcmVDYXN0SXRlbXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuZm9yZWNhc3QtaXRlbScpO1xuICAgIGxldCBpbmRleCA9IDA7XG4gICAgZm9yIChsZXQgaXRlbSBvZiBmb3JlQ2FzdEl0ZW1zKSB7XG4gICAgICAgIGl0ZW0uY2hpbGRyZW5bMF0udGV4dENvbnRlbnQgPSBkYXRhLmRhaWx5X2RheXNbaW5kZXhdOyAvL3dlZWtkYXlcbiAgICAgICAgaXRlbS5jaGlsZHJlblsxXS50ZXh0Q29udGVudCA9IGRhdGEuZGFpbHlfaGlnaHNbaW5kZXhdOyAvL2RhaWx5IGhpZ2hcbiAgICAgICAgaXRlbS5jaGlsZHJlblsyXS50ZXh0Q29udGVudCA9IGRhdGEuZGFpbHlfbG93c1tpbmRleF07IC8vZGFpbHkgbG93XG4gICAgICAgIGl0ZW0uY2hpbGRyZW5bM10uY2hpbGRyZW5bMF0uc3JjID0gZGF0YS5kYWlseV9pY29uc1tpbmRleF07IC8vZGFpbHkgaWNvblxuICAgICAgICBpbmRleCsrO1xuICAgIH1cbn07XG5cbmNvbnN0IGZpbGxFcnJvck1lc3NhZ2UgPSAoKSA9PiB7XG4gICAgY29uc3QgZXJyb3JFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmVycm9yLW1lc3NhZ2UnKTtcbiAgICBlcnJvckVsZW1lbnQuY2xhc3NMaXN0LnRvZ2dsZSgnaGlkZGVuJyk7XG59XG5cblxuXG5leHBvcnQge1xuICAgIGZpbGxXZWF0aGVySW5mb1VJLCBmaWxsRXJyb3JNZXNzYWdlLCBpbml0aWFsaXplV2VhdGhlckZvcmVjYXN0LCBmaWxsV2VhdGhlckZvcmVjYXN0XG59IiwiY29uc3QgY29udmVydEZvcmVjYXN0VG9GID0gKGRhdGEpID0+IHtcbiAgICBsZXQgbmV3SGlnaHMgPSBbXTtcbiAgICBsZXQgbmV3TG93cyA9IFtdO1xuICAgIGZvciAobGV0IGk9MDsgaTxkYXRhLmRhaWx5X2hpZ2hzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGxldCBoaWdoID0gTWF0aC5yb3VuZCgocGFyc2VGbG9hdChkYXRhLmRhaWx5X2hpZ2hzW2ldLnNwbGl0KCcgJylbMF0pICogOS81ICsgMzIpICogMTApIC8gMTA7XG4gICAgICAgIGxldCBsb3cgPSBNYXRoLnJvdW5kKChwYXJzZUZsb2F0KGRhdGEuZGFpbHlfbG93c1tpXS5zcGxpdCgnICcpWzBdKSAqIDkvNSArIDMyKSAqIDEwKSAvIDEwO1xuICAgICAgICBuZXdIaWdocy5wdXNoKGhpZ2ggKyAnIEYnKTtcbiAgICAgICAgbmV3TG93cy5wdXNoKGxvdyArICcgRicpO1xuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgICBuZXdIaWdocyxcbiAgICAgICAgbmV3TG93c1xuICAgIH1cbn07XG5cbmNvbnN0IGNvbnZlcnRGb3JlY2FzdFRvQyA9IChkYXRhKSA9PiB7XG4gICAgbGV0IG5ld0hpZ2hzID0gW107XG4gICAgbGV0IG5ld0xvd3MgPSBbXTtcbiAgICBmb3IgKGxldCBpPTA7IGk8ZGF0YS5kYWlseV9oaWdocy5sZW5ndGg7IGkrKykge1xuICAgICAgICBsZXQgaGlnaCA9IE1hdGgucm91bmQoKChwYXJzZUZsb2F0KGRhdGEuZGFpbHlfaGlnaHNbaV0uc3BsaXQoJyAnKVswXSkgLSAzMikgLyAxLjgpICogMTApIC8gMTA7XG4gICAgICAgIGxldCBsb3cgPSBNYXRoLnJvdW5kKCgocGFyc2VGbG9hdChkYXRhLmRhaWx5X2xvd3NbaV0uc3BsaXQoJyAnKVswXSkgLSAzMikgLyAxLjgpICogMTApIC8gMTA7XG4gICAgICAgIG5ld0hpZ2hzLnB1c2goaGlnaCArICcgQycpO1xuICAgICAgICBuZXdMb3dzLnB1c2gobG93ICsgJyBDJyk7XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICAgIG5ld0hpZ2hzLFxuICAgICAgICBuZXdMb3dzXG4gICAgfVxufTtcblxuY29uc3QgY29udmVydFVuaXRzID0gKGRhdGEpID0+IHtcbiAgICBpZiAoZGF0YS50ZW1wLmluY2x1ZGVzKCdDJykpe1xuICAgICAgICBsZXQgRiA9IE1hdGgucm91bmQoKHBhcnNlRmxvYXQoZGF0YS50ZW1wLnNwbGl0KCcgJylbMF0pICogOS81ICsgMzIpICogMTApIC8gMTA7XG4gICAgICAgIGxldCBmZWVsc0xpa2VGID0gTWF0aC5yb3VuZCgocGFyc2VGbG9hdChkYXRhLmZlZWxzX2xpa2Uuc3BsaXQoJyAnKVswXSkgKiA5LzUgKyAzMikgKiAxMCkgLyAxMDtcbiAgICAgICAgbGV0IHNwZWVkID0gTWF0aC5yb3VuZChwYXJzZUZsb2F0KGRhdGEud2luZF9zcGVlZC5zcGxpdCgnICcpWzBdIC8gMS42MDkpICogMTApIC8gMTA7XG4gICAgICAgIGRhdGEudGVtcCA9IEYgKyAnIEYnO1xuICAgICAgICBkYXRhLmZlZWxzX2xpa2UgPSBmZWVsc0xpa2VGICsgJyBGJztcbiAgICAgICAgZGF0YS53aW5kX3NwZWVkID0gc3BlZWQgKyAnIG1waCc7XG4gICAgICAgIGRhdGEuZGFpbHlfaGlnaHMgPSBjb252ZXJ0Rm9yZWNhc3RUb0YoZGF0YSkubmV3SGlnaHM7XG4gICAgICAgIGRhdGEuZGFpbHlfbG93cyA9IGNvbnZlcnRGb3JlY2FzdFRvRihkYXRhKS5uZXdMb3dzO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCBDID0gTWF0aC5yb3VuZCgoKHBhcnNlRmxvYXQoZGF0YS50ZW1wLnNwbGl0KCcgJylbMF0pIC0gMzIpIC8gMS44KSAqIDEwKSAvIDEwO1xuICAgICAgICBsZXQgZmVlbHNMaWtlQyA9IE1hdGgucm91bmQoKChwYXJzZUZsb2F0KGRhdGEuZmVlbHNfbGlrZS5zcGxpdCgnICcpWzBdKSAtIDMyKSAvIDEuOCkgKiAxMCkgLyAxMDtcbiAgICAgICAgbGV0IHNwZWVkID0gTWF0aC5yb3VuZChwYXJzZUZsb2F0KGRhdGEud2luZF9zcGVlZC5zcGxpdCgnICcpWzBdICogMS42MDkpICogMTApIC8gMTA7XG4gICAgICAgIGRhdGEudGVtcCA9IEMgKyAnIEMnO1xuICAgICAgICBkYXRhLmZlZWxzX2xpa2UgPSBmZWVsc0xpa2VDICsgJyBDJztcbiAgICAgICAgZGF0YS53aW5kX3NwZWVkID0gc3BlZWQgKyAnIGttL2gnO1xuICAgICAgICBkYXRhLmRhaWx5X2hpZ2hzID0gY29udmVydEZvcmVjYXN0VG9DKGRhdGEpLm5ld0hpZ2hzO1xuICAgICAgICBkYXRhLmRhaWx5X2xvd3MgPSBjb252ZXJ0Rm9yZWNhc3RUb0MoZGF0YSkubmV3TG93cztcbiAgICB9XG4gICAgcmV0dXJuIGRhdGE7XG59O1xuXG5leHBvcnQge1xuICAgIGNvbnZlcnRVbml0c1xufSIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHsgZ2V0TGF0TG9uLCBnZXRPbmVDYWxsV2VhdGhlckRhdGEsIHByb2Nlc3NDdXJyZW50V2VhdGhlckRhdGEgfSBmcm9tIFwiLi9hcGlcIjtcbmltcG9ydCB7IGZpbGxFcnJvck1lc3NhZ2UsIGZpbGxXZWF0aGVySW5mb1VJLCBpbml0aWFsaXplV2VhdGhlckZvcmVjYXN0LCBmaWxsV2VhdGhlckZvcmVjYXN0IH0gZnJvbSBcIi4vdWlcIjtcbmltcG9ydCB7IGNvbnZlcnRVbml0cyB9IGZyb20gXCIuL3V0aWxzXCI7XG5cbmFzeW5jIGZ1bmN0aW9uIGdldERhdGEoY2l0eSkge1xuICAgIGNvbnN0IGxhdExvbiA9IGF3YWl0IGdldExhdExvbihjaXR5KTtcbiAgICBjb25zdCBkYXRhID0gYXdhaXQgZ2V0T25lQ2FsbFdlYXRoZXJEYXRhKGxhdExvbi5sYXQsIGxhdExvbi5sb24pO1xuICAgIHJldHVybiBhd2FpdCBwcm9jZXNzQ3VycmVudFdlYXRoZXJEYXRhKGRhdGEsIGNpdHkpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBtYWluKCkge1xuICAgIGxldCBjaXR5ID0gJ25ldyB5b3JrJzsgLy9pbml0aWFsIGNpdHlcbiAgICBsZXQgZGF0YSA9IGF3YWl0IGdldERhdGEoY2l0eSk7XG4gICAgY29uc29sZS5sb2coZGF0YSk7XG4gICAgZmlsbFdlYXRoZXJJbmZvVUkoZGF0YSk7XG4gICAgaW5pdGlhbGl6ZVdlYXRoZXJGb3JlY2FzdChkYXRhKTtcbiAgICBjb25zdCBjb252ZXJ0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNvbnZlcnQnKTtcbiAgICBjb252ZXJ0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICBkYXRhID0gY29udmVydFVuaXRzKGRhdGEpO1xuICAgICAgICBmaWxsV2VhdGhlckluZm9VSShkYXRhKTtcbiAgICAgICAgZmlsbFdlYXRoZXJGb3JlY2FzdChkYXRhKTtcbiAgICB9KTtcbiAgICBjb25zdCBzZWFyY2ggPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2VhcmNoJyk7XG4gICAgY29uc3Qgc2VhcmNoSW5wdXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2VhcmNoLWJveC1pbnB1dCcpO1xuICAgIHNlYXJjaC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFzeW5jIGZ1bmN0aW9uKCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbGV0IGlzRmFyZW4gPSBmYWxzZTtcbiAgICAgICAgICAgIGlmIChkYXRhLnRlbXAuaW5jbHVkZXMoJ0YnKSl7XG4gICAgICAgICAgICAgICAgaXNGYXJlbiA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjaXR5ID0gc2VhcmNoSW5wdXQudmFsdWU7XG4gICAgICAgICAgICBkYXRhID0gYXdhaXQgZ2V0RGF0YShjaXR5KTtcbiAgICAgICAgICAgIGlmIChpc0ZhcmVuKSB7XG4gICAgICAgICAgICAgICAgZGF0YSA9IGNvbnZlcnRVbml0cyhkYXRhKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZpbGxXZWF0aGVySW5mb1VJKGRhdGEpO1xuICAgICAgICAgICAgZmlsbFdlYXRoZXJGb3JlY2FzdChkYXRhKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGZpbGxFcnJvck1lc3NhZ2UoKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiWU9ZT1wiICsgZXJyb3IpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cblxubWFpbigpO1xuXG5cbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==