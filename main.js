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
    let dailyDays = [];
    const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    let index = 1;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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TDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLG9EQUFZO0FBQ25DO0FBQ0EsWUFBWSxzREFBaUI7QUFDN0IsWUFBWSx3REFBbUI7QUFDL0IsVUFBVTtBQUNWLFlBQVkscURBQWdCO0FBQzVCO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7OztBQUdBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vd2VhdGhlcl9hcHAvLi9zcmMvYXBpLmpzIiwid2VicGFjazovL3dlYXRoZXJfYXBwLy4vc3JjL3VpLmpzIiwid2VicGFjazovL3dlYXRoZXJfYXBwLy4vc3JjL3V0aWxzLmpzIiwid2VicGFjazovL3dlYXRoZXJfYXBwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3dlYXRoZXJfYXBwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly93ZWF0aGVyX2FwcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3dlYXRoZXJfYXBwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vd2VhdGhlcl9hcHAvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgYXBpS2V5ID0gJzhjOTVlOWQ4MWE4ZDhiZjU0MzhhYWQ2Yzg0ZjhhMjM5JztcblxuXG5jb25zdCBnZXRMYXRMb24gPSBhc3luYyAoY2l0eSkgPT4ge1xuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYGh0dHBzOi8vYXBpLm9wZW53ZWF0aGVybWFwLm9yZy9kYXRhLzIuNS93ZWF0aGVyP3E9JHtjaXR5fSZhcHBpZD0ke2FwaUtleX1gKTtcbiAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICAgICAgcmV0dXJuIGRhdGEuY29vcmQ7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgICAvL01heWJlIGFkZCBzb21ldGhpbmcgdG8gVUkgaGVyZSB3aGVuIGVycm9yXG4gICAgfVxufTtcblxuY29uc3QgZ2V0V2VhdGhlckljb25VUkwgPSBhc3luYyAoaWNvbikgPT4ge1xuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYGh0dHA6Ly9vcGVud2VhdGhlcm1hcC5vcmcvaW1nL3duLyR7aWNvbn1AMngucG5nYCk7XG4gICAgICAgIHJldHVybiByZXNwb25zZS51cmw7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgIH1cbn07XG5cbmNvbnN0IGV4dHJhY3RGb3JlQ2FzdERhdGEgPSBhc3luYyAoZGF0YSkgPT4ge1xuICAgIGxldCBkYWlseUhpZ2ggPSBbXTtcbiAgICBsZXQgZGFpbHlMb3cgPSBbXTtcbiAgICBsZXQgZGFpbHlJY29uID0gW107XG4gICAgbGV0IGRhaWx5RGF5cyA9IFtdO1xuICAgIGNvbnN0IHdlZWtkYXkgPSBbXCJTdW5kYXlcIixcIk1vbmRheVwiLFwiVHVlc2RheVwiLFwiV2VkbmVzZGF5XCIsXCJUaHVyc2RheVwiLFwiRnJpZGF5XCIsXCJTYXR1cmRheVwiXTtcbiAgICBsZXQgaW5kZXggPSAxO1xuICAgIGZvciAobGV0IGRheSBvZiBkYXRhLmRhaWx5KSB7XG4gICAgICAgIGRhaWx5SGlnaC5wdXNoKChNYXRoLnJvdW5kKChkYXkudGVtcC5tYXggLSAyNzMpKjEwKS8xMCkgKyAnIEMnKTtcbiAgICAgICAgZGFpbHlMb3cucHVzaCgoTWF0aC5yb3VuZCgoZGF5LnRlbXAubWluIC0gMjczKSoxMCkvMTApICsgJyBDJyk7XG4gICAgICAgIGRhaWx5SWNvbi5wdXNoKGF3YWl0IGdldFdlYXRoZXJJY29uVVJMKGRheS53ZWF0aGVyWzBdLmljb24pKTtcbiAgICAgICAgbGV0IGRhdGUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICBkYXRlLnNldERhdGUoZGF0ZS5nZXREYXRlKCkgKyBpbmRleCk7XG4gICAgICAgIGRhaWx5RGF5cy5wdXNoKHdlZWtkYXlbZGF0ZS5nZXREYXkoKV0pO1xuICAgICAgICBpbmRleCsrO1xuICAgIH1cbiAgICBkYWlseUhpZ2guc2hpZnQoKTtcbiAgICBkYWlseUxvdy5zaGlmdCgpO1xuICAgIGRhaWx5SWNvbi5zaGlmdCgpO1xuICAgIGRhaWx5RGF5cy5zaGlmdCgpO1xuICAgIHJldHVybiB7XG4gICAgICAgICdoaWdocyc6IGRhaWx5SGlnaCxcbiAgICAgICAgJ2xvd3MnOiBkYWlseUxvdyxcbiAgICAgICAgJ2ljb25zJzogZGFpbHlJY29uLFxuICAgICAgICAnd2Vla2RheXMnOiBkYWlseURheXMsXG4gICAgfVxufTtcblxuY29uc3QgcHJvY2Vzc0N1cnJlbnRXZWF0aGVyRGF0YSA9IGFzeW5jIChkYXRhLCBjaXR5KSA9PiB7XG4gICAgbGV0IG9wdGlvbnMgPSB7XG4gICAgICAgIHRpbWVab25lOiBkYXRhLnRpbWV6b25lLFxuICAgICAgICB5ZWFyOiAnbnVtZXJpYycsXG4gICAgICAgIG1vbnRoOiAnbnVtZXJpYycsXG4gICAgICAgIGRheTogJ251bWVyaWMnLFxuICAgICAgICBob3VyOiAnbnVtZXJpYycsXG4gICAgICAgIG1pbnV0ZTogJ251bWVyaWMnLFxuICAgICAgICBzZWNvbmQ6ICdudW1lcmljJyxcbiAgICAgIH0sXG4gICAgZm9ybWF0dGVyID0gbmV3IEludGwuRGF0ZVRpbWVGb3JtYXQoW10sIG9wdGlvbnMpO1xuICAgIGxldCB0aW1lID0gZm9ybWF0dGVyLmZvcm1hdChuZXcgRGF0ZSgpKTtcbiAgICBmdW5jdGlvbiB0aXRsZUNhc2Uoc3RyKSB7XG4gICAgICAgIHZhciBzcGxpdFN0ciA9IHN0ci50b0xvd2VyQ2FzZSgpLnNwbGl0KCcgJyk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc3BsaXRTdHIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHNwbGl0U3RyW2ldID0gc3BsaXRTdHJbaV0uY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBzcGxpdFN0cltpXS5zdWJzdHJpbmcoMSk7ICAgICBcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3BsaXRTdHIuam9pbignICcpOyBcbiAgICAgfVxuICAgIGxldCBmb3JlQ2FzdERhdGEgPSBhd2FpdCBleHRyYWN0Rm9yZUNhc3REYXRhKGRhdGEpO1xuICAgIHJldHVybiB7XG4gICAgICAgICd0ZW1wJzogTWF0aC5yb3VuZCgoZGF0YS5jdXJyZW50LnRlbXAgLSAyNzMpKjEwKS8xMCArICcgQycsXG4gICAgICAgICdmZWVsc19saWtlJzogTWF0aC5yb3VuZCgoZGF0YS5jdXJyZW50LmZlZWxzX2xpa2UgLSAyNzMpKjEwKS8xMCArICcgQycsXG4gICAgICAgICdodW1pZGl0eSc6IGRhdGEuY3VycmVudC5odW1pZGl0eSArICclJyxcbiAgICAgICAgJ3dpbmRfc3BlZWQnOiBkYXRhLmN1cnJlbnQud2luZF9zcGVlZCArICcga20vaCcsIFxuICAgICAgICAndXZpJzogZGF0YS5jdXJyZW50LnV2aSxcbiAgICAgICAgJ3dlYXRoZXJfbWFpbic6IGRhdGEuY3VycmVudC53ZWF0aGVyWzBdLm1haW4sXG4gICAgICAgICd3ZWF0aGVyX2Rlc2MnOiB0aXRsZUNhc2UoZGF0YS5jdXJyZW50LndlYXRoZXJbMF0uZGVzY3JpcHRpb24pLFxuICAgICAgICAnaWNvbic6IGF3YWl0IGdldFdlYXRoZXJJY29uVVJMKGRhdGEuY3VycmVudC53ZWF0aGVyWzBdLmljb24pLFxuICAgICAgICAnY2l0eSc6IHRpdGxlQ2FzZShjaXR5KSxcbiAgICAgICAgJ2RhdGUnOiB0aW1lLFxuICAgICAgICAnZGFpbHlfaGlnaHMnOiBmb3JlQ2FzdERhdGEuaGlnaHMsXG4gICAgICAgICdkYWlseV9sb3dzJzogZm9yZUNhc3REYXRhLmxvd3MsXG4gICAgICAgICdkYWlseV9pY29ucyc6IGZvcmVDYXN0RGF0YS5pY29ucyxcbiAgICAgICAgJ2RhaWx5X2RheXMnOiBmb3JlQ2FzdERhdGEud2Vla2RheXNcbiAgICB9O1xufTtcblxuY29uc3QgZ2V0T25lQ2FsbFdlYXRoZXJEYXRhID0gYXN5bmMgKGxhdCwgbG9uKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgaHR0cHM6Ly9hcGkub3BlbndlYXRoZXJtYXAub3JnL2RhdGEvMi41L29uZWNhbGw/bGF0PSR7bGF0fSZsb249JHtsb259JmV4Y2x1ZGU9e3BhcnR9JmFwcGlkPSR7YXBpS2V5fWApO1xuICAgICAgICByZXR1cm4gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICB9XG59XG5cbmV4cG9ydCB7XG4gICAgZ2V0TGF0TG9uLCBnZXRPbmVDYWxsV2VhdGhlckRhdGEsIHByb2Nlc3NDdXJyZW50V2VhdGhlckRhdGFcbn0iLCJjb25zdCBmaWxsV2VhdGhlckluZm9VSSA9IChkYXRhKSA9PiB7XG4gICAgLy9maWVsZHMgb24gbGVmdFxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy53ZWF0aGVyLWRlc2NyaXB0aW9uJykudGV4dENvbnRlbnQgPSBkYXRhLndlYXRoZXJfZGVzYztcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY2l0eScpLnRleHRDb250ZW50ID0gZGF0YS5jaXR5O1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5kYXRlJykudGV4dENvbnRlbnQgPSBkYXRhLmRhdGU7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnRlbXAnKS50ZXh0Q29udGVudCA9IGRhdGEudGVtcDtcbiAgICBsZXQgaW1nID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmljb24taW1nJyk7XG4gICAgaW1nLnNyYyA9IGRhdGEuc3JjID0gZGF0YS5pY29uO1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5lcnJvci1tZXNzYWdlJykuY2xhc3NMaXN0LmFkZCgnaGlkZGVuJyk7XG4gICAgLy9GaWVsZHMgb24gcmlnaHRcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZmVlbHMtbGlrZScpLnRleHRDb250ZW50ID0gZGF0YS5mZWVsc19saWtlO1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5odW1pZGl0eScpLnRleHRDb250ZW50ID0gZGF0YS5odW1pZGl0eTtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcud2luZC1zcGVlZCcpLnRleHRDb250ZW50ID0gZGF0YS53aW5kX3NwZWVkO1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy51dmknKS50ZXh0Q29udGVudCA9IGRhdGEudXZpO1xufTtcblxuY29uc3QgaW5pdGlhbGl6ZVdlYXRoZXJGb3JlY2FzdCA9IChkYXRhKSA9PiB7XG4gICAgY29uc3QgZm9yZWNhc3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZm9yZWNhc3QnKTtcbiAgICBmb3IgKGxldCBpPTA7IGk8ZGF0YS5kYWlseV9oaWdocy5sZW5ndGg7IGkrKykge1xuICAgICAgICBsZXQgZGF5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGRheS5jbGFzc0xpc3QuYWRkKCdmb3JlY2FzdC1pdGVtJyk7XG4gICAgICAgIGRheS5jbGFzc0xpc3QuYWRkKGBmb3J3YXJkLSR7aSsxfWApO1xuICAgICAgICBsZXQgd2Vla2RheSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICB3ZWVrZGF5LmNsYXNzTGlzdC5hZGQoJ2ZvcmVjYXN0LXdlZWtkYXknKTtcbiAgICAgICAgd2Vla2RheS50ZXh0Q29udGVudCA9IGRhdGEuZGFpbHlfZGF5c1tpXTtcbiAgICAgICAgbGV0IGhpZ2ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgaGlnaC5jbGFzc0xpc3QuYWRkKCdmb3JlY2FzdC1oaWdoJyk7XG4gICAgICAgIGhpZ2gudGV4dENvbnRlbnQgPSBkYXRhLmRhaWx5X2hpZ2hzW2ldO1xuICAgICAgICBsZXQgbG93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGxvdy5jbGFzc0xpc3QuYWRkKCdmb3JlY2FzdC1sb3cnKTtcbiAgICAgICAgbG93LnRleHRDb250ZW50ID0gZGF0YS5kYWlseV9sb3dzW2ldO1xuICAgICAgICBsZXQgaWNvbkRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBpY29uRGl2LmNsYXNzTGlzdC5hZGQoJ2ZvcmVjYXN0LWljb24tY29udGFpbmVyJyk7XG4gICAgICAgIGxldCBpbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcbiAgICAgICAgaW1nLmNsYXNzTGlzdC5hZGQoJ2ZvcmVjYXN0LWljb24nKTtcbiAgICAgICAgaW1nLnNyYyA9IGRhdGEuZGFpbHlfaWNvbnNbaV07XG4gICAgICAgIGljb25EaXYuYXBwZW5kQ2hpbGQoaW1nKTtcbiAgICAgICAgZGF5LmFwcGVuZENoaWxkKHdlZWtkYXkpO1xuICAgICAgICBkYXkuYXBwZW5kQ2hpbGQoaGlnaCk7XG4gICAgICAgIGRheS5hcHBlbmRDaGlsZChsb3cpO1xuICAgICAgICBkYXkuYXBwZW5kQ2hpbGQoaWNvbkRpdik7XG4gICAgICAgIGZvcmVjYXN0LmFwcGVuZENoaWxkKGRheSk7XG4gICAgfVxufTtcblxuY29uc3QgZmlsbFdlYXRoZXJGb3JlY2FzdCA9IChkYXRhKSA9PiB7XG4gICAgY29uc3QgZm9yZUNhc3RJdGVtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5mb3JlY2FzdC1pdGVtJyk7XG4gICAgbGV0IGluZGV4ID0gMDtcbiAgICBmb3IgKGxldCBpdGVtIG9mIGZvcmVDYXN0SXRlbXMpIHtcbiAgICAgICAgaXRlbS5jaGlsZHJlblswXS50ZXh0Q29udGVudCA9IGRhdGEuZGFpbHlfZGF5c1tpbmRleF07IC8vd2Vla2RheVxuICAgICAgICBpdGVtLmNoaWxkcmVuWzFdLnRleHRDb250ZW50ID0gZGF0YS5kYWlseV9oaWdoc1tpbmRleF07IC8vZGFpbHkgaGlnaFxuICAgICAgICBpdGVtLmNoaWxkcmVuWzJdLnRleHRDb250ZW50ID0gZGF0YS5kYWlseV9sb3dzW2luZGV4XTsgLy9kYWlseSBsb3dcbiAgICAgICAgaXRlbS5jaGlsZHJlblszXS5jaGlsZHJlblswXS5zcmMgPSBkYXRhLmRhaWx5X2ljb25zW2luZGV4XTsgLy9kYWlseSBpY29uXG4gICAgICAgIGluZGV4Kys7XG4gICAgfVxufTtcblxuY29uc3QgZmlsbEVycm9yTWVzc2FnZSA9ICgpID0+IHtcbiAgICBjb25zdCBlcnJvckVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZXJyb3ItbWVzc2FnZScpO1xuICAgIGVycm9yRWxlbWVudC5jbGFzc0xpc3QudG9nZ2xlKCdoaWRkZW4nKTtcbn1cblxuXG5cbmV4cG9ydCB7XG4gICAgZmlsbFdlYXRoZXJJbmZvVUksIGZpbGxFcnJvck1lc3NhZ2UsIGluaXRpYWxpemVXZWF0aGVyRm9yZWNhc3QsIGZpbGxXZWF0aGVyRm9yZWNhc3Rcbn0iLCJjb25zdCBjb252ZXJ0Rm9yZWNhc3RUb0YgPSAoZGF0YSkgPT4ge1xuICAgIGxldCBuZXdIaWdocyA9IFtdO1xuICAgIGxldCBuZXdMb3dzID0gW107XG4gICAgZm9yIChsZXQgaT0wOyBpPGRhdGEuZGFpbHlfaGlnaHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgbGV0IGhpZ2ggPSBNYXRoLnJvdW5kKChwYXJzZUZsb2F0KGRhdGEuZGFpbHlfaGlnaHNbaV0uc3BsaXQoJyAnKVswXSkgKiA5LzUgKyAzMikgKiAxMCkgLyAxMDtcbiAgICAgICAgbGV0IGxvdyA9IE1hdGgucm91bmQoKHBhcnNlRmxvYXQoZGF0YS5kYWlseV9sb3dzW2ldLnNwbGl0KCcgJylbMF0pICogOS81ICsgMzIpICogMTApIC8gMTA7XG4gICAgICAgIG5ld0hpZ2hzLnB1c2goaGlnaCArICcgRicpO1xuICAgICAgICBuZXdMb3dzLnB1c2gobG93ICsgJyBGJyk7XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICAgIG5ld0hpZ2hzLFxuICAgICAgICBuZXdMb3dzXG4gICAgfVxufTtcblxuY29uc3QgY29udmVydEZvcmVjYXN0VG9DID0gKGRhdGEpID0+IHtcbiAgICBsZXQgbmV3SGlnaHMgPSBbXTtcbiAgICBsZXQgbmV3TG93cyA9IFtdO1xuICAgIGZvciAobGV0IGk9MDsgaTxkYXRhLmRhaWx5X2hpZ2hzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGxldCBoaWdoID0gTWF0aC5yb3VuZCgoKHBhcnNlRmxvYXQoZGF0YS5kYWlseV9oaWdoc1tpXS5zcGxpdCgnICcpWzBdKSAtIDMyKSAvIDEuOCkgKiAxMCkgLyAxMDtcbiAgICAgICAgbGV0IGxvdyA9IE1hdGgucm91bmQoKChwYXJzZUZsb2F0KGRhdGEuZGFpbHlfbG93c1tpXS5zcGxpdCgnICcpWzBdKSAtIDMyKSAvIDEuOCkgKiAxMCkgLyAxMDtcbiAgICAgICAgbmV3SGlnaHMucHVzaChoaWdoICsgJyBDJyk7XG4gICAgICAgIG5ld0xvd3MucHVzaChsb3cgKyAnIEMnKTtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgICAgbmV3SGlnaHMsXG4gICAgICAgIG5ld0xvd3NcbiAgICB9XG59O1xuXG5jb25zdCBjb252ZXJ0VW5pdHMgPSAoZGF0YSkgPT4ge1xuICAgIGlmIChkYXRhLnRlbXAuaW5jbHVkZXMoJ0MnKSl7XG4gICAgICAgIGxldCBGID0gTWF0aC5yb3VuZCgocGFyc2VGbG9hdChkYXRhLnRlbXAuc3BsaXQoJyAnKVswXSkgKiA5LzUgKyAzMikgKiAxMCkgLyAxMDtcbiAgICAgICAgbGV0IGZlZWxzTGlrZUYgPSBNYXRoLnJvdW5kKChwYXJzZUZsb2F0KGRhdGEuZmVlbHNfbGlrZS5zcGxpdCgnICcpWzBdKSAqIDkvNSArIDMyKSAqIDEwKSAvIDEwO1xuICAgICAgICBsZXQgc3BlZWQgPSBNYXRoLnJvdW5kKHBhcnNlRmxvYXQoZGF0YS53aW5kX3NwZWVkLnNwbGl0KCcgJylbMF0gLyAxLjYwOSkgKiAxMCkgLyAxMDtcbiAgICAgICAgZGF0YS50ZW1wID0gRiArICcgRic7XG4gICAgICAgIGRhdGEuZmVlbHNfbGlrZSA9IGZlZWxzTGlrZUYgKyAnIEYnO1xuICAgICAgICBkYXRhLndpbmRfc3BlZWQgPSBzcGVlZCArICcgbXBoJztcbiAgICAgICAgZGF0YS5kYWlseV9oaWdocyA9IGNvbnZlcnRGb3JlY2FzdFRvRihkYXRhKS5uZXdIaWdocztcbiAgICAgICAgZGF0YS5kYWlseV9sb3dzID0gY29udmVydEZvcmVjYXN0VG9GKGRhdGEpLm5ld0xvd3M7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgbGV0IEMgPSBNYXRoLnJvdW5kKCgocGFyc2VGbG9hdChkYXRhLnRlbXAuc3BsaXQoJyAnKVswXSkgLSAzMikgLyAxLjgpICogMTApIC8gMTA7XG4gICAgICAgIGxldCBmZWVsc0xpa2VDID0gTWF0aC5yb3VuZCgoKHBhcnNlRmxvYXQoZGF0YS5mZWVsc19saWtlLnNwbGl0KCcgJylbMF0pIC0gMzIpIC8gMS44KSAqIDEwKSAvIDEwO1xuICAgICAgICBsZXQgc3BlZWQgPSBNYXRoLnJvdW5kKHBhcnNlRmxvYXQoZGF0YS53aW5kX3NwZWVkLnNwbGl0KCcgJylbMF0gKiAxLjYwOSkgKiAxMCkgLyAxMDtcbiAgICAgICAgZGF0YS50ZW1wID0gQyArICcgQyc7XG4gICAgICAgIGRhdGEuZmVlbHNfbGlrZSA9IGZlZWxzTGlrZUMgKyAnIEMnO1xuICAgICAgICBkYXRhLndpbmRfc3BlZWQgPSBzcGVlZCArICcga20vaCc7XG4gICAgICAgIGRhdGEuZGFpbHlfaGlnaHMgPSBjb252ZXJ0Rm9yZWNhc3RUb0MoZGF0YSkubmV3SGlnaHM7XG4gICAgICAgIGRhdGEuZGFpbHlfbG93cyA9IGNvbnZlcnRGb3JlY2FzdFRvQyhkYXRhKS5uZXdMb3dzO1xuICAgIH1cbiAgICByZXR1cm4gZGF0YTtcbn07XG5cbmV4cG9ydCB7XG4gICAgY29udmVydFVuaXRzXG59IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgeyBnZXRMYXRMb24sIGdldE9uZUNhbGxXZWF0aGVyRGF0YSwgcHJvY2Vzc0N1cnJlbnRXZWF0aGVyRGF0YSB9IGZyb20gXCIuL2FwaVwiO1xuaW1wb3J0IHsgZmlsbEVycm9yTWVzc2FnZSwgZmlsbFdlYXRoZXJJbmZvVUksIGluaXRpYWxpemVXZWF0aGVyRm9yZWNhc3QsIGZpbGxXZWF0aGVyRm9yZWNhc3QgfSBmcm9tIFwiLi91aVwiO1xuaW1wb3J0IHsgY29udmVydFVuaXRzIH0gZnJvbSBcIi4vdXRpbHNcIjtcblxuYXN5bmMgZnVuY3Rpb24gZ2V0RGF0YShjaXR5KSB7XG4gICAgY29uc3QgbGF0TG9uID0gYXdhaXQgZ2V0TGF0TG9uKGNpdHkpO1xuICAgIGNvbnN0IGRhdGEgPSBhd2FpdCBnZXRPbmVDYWxsV2VhdGhlckRhdGEobGF0TG9uLmxhdCwgbGF0TG9uLmxvbik7XG4gICAgcmV0dXJuIGF3YWl0IHByb2Nlc3NDdXJyZW50V2VhdGhlckRhdGEoZGF0YSwgY2l0eSk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIG1haW4oKSB7XG4gICAgbGV0IGNpdHkgPSAnbmV3IHlvcmsnOyAvL2luaXRpYWwgY2l0eVxuICAgIGxldCBkYXRhID0gYXdhaXQgZ2V0RGF0YShjaXR5KTtcbiAgICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICBmaWxsV2VhdGhlckluZm9VSShkYXRhKTtcbiAgICBpbml0aWFsaXplV2VhdGhlckZvcmVjYXN0KGRhdGEpO1xuICAgIGNvbnN0IGNvbnZlcnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY29udmVydCcpO1xuICAgIGNvbnZlcnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgIGRhdGEgPSBjb252ZXJ0VW5pdHMoZGF0YSk7XG4gICAgICAgIGZpbGxXZWF0aGVySW5mb1VJKGRhdGEpO1xuICAgICAgICBmaWxsV2VhdGhlckZvcmVjYXN0KGRhdGEpO1xuICAgIH0pO1xuICAgIGNvbnN0IHNlYXJjaCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zZWFyY2gnKTtcbiAgICBjb25zdCBzZWFyY2hJbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zZWFyY2gtYm94LWlucHV0Jyk7XG4gICAgc2VhcmNoLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYXN5bmMgZnVuY3Rpb24oKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsZXQgaXNGYXJlbiA9IGZhbHNlO1xuICAgICAgICAgICAgaWYgKGRhdGEudGVtcC5pbmNsdWRlcygnRicpKXtcbiAgICAgICAgICAgICAgICBpc0ZhcmVuID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNpdHkgPSBzZWFyY2hJbnB1dC52YWx1ZTtcbiAgICAgICAgICAgIGRhdGEgPSBhd2FpdCBnZXREYXRhKGNpdHkpO1xuICAgICAgICAgICAgaWYgKGlzRmFyZW4pIHtcbiAgICAgICAgICAgICAgICBkYXRhID0gY29udmVydFVuaXRzKGRhdGEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZmlsbFdlYXRoZXJJbmZvVUkoZGF0YSk7XG4gICAgICAgICAgICBmaWxsV2VhdGhlckZvcmVjYXN0KGRhdGEpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgZmlsbEVycm9yTWVzc2FnZSgpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJZT1lPXCIgKyBlcnJvcik7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuXG5tYWluKCk7XG5cblxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9