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
     
    return {
        'temp': Math.round((data.current.temp - 273)*10)/10 + ' deg C',
        'feels_like': Math.round((data.current.feels_like - 273)*10)/10 + ' deg C',
        'humidity': data.current.humidity,
        'wind_speed': data.current.wind_speed + ' km/h', 
        'uvi': data.current.uvi,
        'weather_main': data.current.weather[0].main,
        'weather_desc': titleCase(data.current.weather[0].description),
        'icon': await getWeatherIconURL(data.current.weather[0].icon),
        'city': titleCase(city),
        'date': time,
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
/* harmony export */   "fillErrorMessage": () => (/* binding */ fillErrorMessage)
/* harmony export */ });
const fillWeatherInfoUI = (data) => {
    document.querySelector('.weather-description').textContent = data.weather_desc;
    document.querySelector('.city').textContent = data.city;
    document.querySelector('.date').textContent = data.date;
    document.querySelector('.temp').textContent = data.temp;
    let img = document.querySelector('.icon-img');
    img.src = data.src = data.icon;
    document.querySelector('.error-message').classList.add('hidden');
}

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
const convertUnits = (data) => {
    if (data.temp.includes('C')){
        let F = Math.round((parseFloat(data.temp.split(' ')[0]) * 9/5 + 32) * 10) / 10;
        let feelsLikeF = Math.round((parseFloat(data.feels_like.split(' ')[0]) * 9/5 + 32) * 10) / 10;
        let speed = Math.round(parseFloat(data.wind_speed.split(' ')[0] / 1.609) * 10) / 10;
        data.temp = F + ' deg F';
        data.feels_like = feelsLikeF + ' deg F';
        data.wind_speed = speed + ' mph';
    } else {
        let C = Math.round(((parseFloat(data.temp.split(' ')[0]) - 32) / 1.8) * 10) / 10;
        let feelsLikeC = Math.round(((parseFloat(data.feels_like.split(' ')[0]) - 32) / 1.8) * 10) / 10;
        let speed = Math.round(parseFloat(data.wind_speed.split(' ')[0] * 1.609) * 10) / 10;
        data.temp = C + ' deg C';
        data.feels_like = feelsLikeC + ' deg C';
        data.wind_speed = speed + ' km/h';
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
    const convert = document.querySelector('.convert');
    convert.addEventListener('click', () => {
        data = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.convertUnits)(data);
        (0,_ui__WEBPACK_IMPORTED_MODULE_1__.fillWeatherInfoUI)(data);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7OztBQUdBO0FBQ0E7QUFDQSwwRkFBMEYsS0FBSyxTQUFTLE9BQU87QUFDL0c7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EseUVBQXlFLEtBQUs7QUFDOUU7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixxQkFBcUI7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSw0RkFBNEYsSUFBSSxPQUFPLElBQUksVUFBVSxLQUFLLFNBQVMsT0FBTztBQUMxSTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDaEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7O1VDakJBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7OztBQ05vRjtBQUN6QjtBQUNwQjs7QUFFdkM7QUFDQSx5QkFBeUIsK0NBQVM7QUFDbEMsdUJBQXVCLDJEQUFxQjtBQUM1QyxpQkFBaUIsK0RBQXlCO0FBQzFDOztBQUVBO0FBQ0EsMkJBQTJCO0FBQzNCO0FBQ0EsSUFBSSxzREFBaUI7QUFDckI7QUFDQTtBQUNBLGVBQWUsb0RBQVk7QUFDM0IsUUFBUSxzREFBaUI7QUFDekIsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsb0RBQVk7QUFDbkM7QUFDQSxZQUFZLHNEQUFpQjtBQUM3QixVQUFVO0FBQ1YsWUFBWSxxREFBZ0I7QUFDNUI7QUFDQTtBQUNBLEtBQUs7QUFDTDs7O0FBR0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly93ZWF0aGVyX2FwcC8uL3NyYy9hcGkuanMiLCJ3ZWJwYWNrOi8vd2VhdGhlcl9hcHAvLi9zcmMvdWkuanMiLCJ3ZWJwYWNrOi8vd2VhdGhlcl9hcHAvLi9zcmMvdXRpbHMuanMiLCJ3ZWJwYWNrOi8vd2VhdGhlcl9hcHAvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vd2VhdGhlcl9hcHAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3dlYXRoZXJfYXBwL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vd2VhdGhlcl9hcHAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly93ZWF0aGVyX2FwcC8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBhcGlLZXkgPSAnOGM5NWU5ZDgxYThkOGJmNTQzOGFhZDZjODRmOGEyMzknO1xuXG5cbmNvbnN0IGdldExhdExvbiA9IGFzeW5jIChjaXR5KSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgaHR0cHM6Ly9hcGkub3BlbndlYXRoZXJtYXAub3JnL2RhdGEvMi41L3dlYXRoZXI/cT0ke2NpdHl9JmFwcGlkPSR7YXBpS2V5fWApO1xuICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgICAgICByZXR1cm4gZGF0YS5jb29yZDtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICAgIC8vTWF5YmUgYWRkIHNvbWV0aGluZyB0byBVSSBoZXJlIHdoZW4gZXJyb3JcbiAgICB9XG59O1xuXG5jb25zdCBnZXRXZWF0aGVySWNvblVSTCA9IGFzeW5jIChpY29uKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgaHR0cDovL29wZW53ZWF0aGVybWFwLm9yZy9pbWcvd24vJHtpY29ufUAyeC5wbmdgKTtcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnVybDtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgfVxufTtcblxuY29uc3QgcHJvY2Vzc0N1cnJlbnRXZWF0aGVyRGF0YSA9IGFzeW5jIChkYXRhLCBjaXR5KSA9PiB7XG4gICAgbGV0IG9wdGlvbnMgPSB7XG4gICAgICAgIHRpbWVab25lOiBkYXRhLnRpbWV6b25lLFxuICAgICAgICB5ZWFyOiAnbnVtZXJpYycsXG4gICAgICAgIG1vbnRoOiAnbnVtZXJpYycsXG4gICAgICAgIGRheTogJ251bWVyaWMnLFxuICAgICAgICBob3VyOiAnbnVtZXJpYycsXG4gICAgICAgIG1pbnV0ZTogJ251bWVyaWMnLFxuICAgICAgICBzZWNvbmQ6ICdudW1lcmljJyxcbiAgICAgIH0sXG4gICAgZm9ybWF0dGVyID0gbmV3IEludGwuRGF0ZVRpbWVGb3JtYXQoW10sIG9wdGlvbnMpO1xuICAgIGxldCB0aW1lID0gZm9ybWF0dGVyLmZvcm1hdChuZXcgRGF0ZSgpKTtcbiAgICBmdW5jdGlvbiB0aXRsZUNhc2Uoc3RyKSB7XG4gICAgICAgIHZhciBzcGxpdFN0ciA9IHN0ci50b0xvd2VyQ2FzZSgpLnNwbGl0KCcgJyk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc3BsaXRTdHIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHNwbGl0U3RyW2ldID0gc3BsaXRTdHJbaV0uY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBzcGxpdFN0cltpXS5zdWJzdHJpbmcoMSk7ICAgICBcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3BsaXRTdHIuam9pbignICcpOyBcbiAgICAgfVxuICAgICBcbiAgICByZXR1cm4ge1xuICAgICAgICAndGVtcCc6IE1hdGgucm91bmQoKGRhdGEuY3VycmVudC50ZW1wIC0gMjczKSoxMCkvMTAgKyAnIGRlZyBDJyxcbiAgICAgICAgJ2ZlZWxzX2xpa2UnOiBNYXRoLnJvdW5kKChkYXRhLmN1cnJlbnQuZmVlbHNfbGlrZSAtIDI3MykqMTApLzEwICsgJyBkZWcgQycsXG4gICAgICAgICdodW1pZGl0eSc6IGRhdGEuY3VycmVudC5odW1pZGl0eSxcbiAgICAgICAgJ3dpbmRfc3BlZWQnOiBkYXRhLmN1cnJlbnQud2luZF9zcGVlZCArICcga20vaCcsIFxuICAgICAgICAndXZpJzogZGF0YS5jdXJyZW50LnV2aSxcbiAgICAgICAgJ3dlYXRoZXJfbWFpbic6IGRhdGEuY3VycmVudC53ZWF0aGVyWzBdLm1haW4sXG4gICAgICAgICd3ZWF0aGVyX2Rlc2MnOiB0aXRsZUNhc2UoZGF0YS5jdXJyZW50LndlYXRoZXJbMF0uZGVzY3JpcHRpb24pLFxuICAgICAgICAnaWNvbic6IGF3YWl0IGdldFdlYXRoZXJJY29uVVJMKGRhdGEuY3VycmVudC53ZWF0aGVyWzBdLmljb24pLFxuICAgICAgICAnY2l0eSc6IHRpdGxlQ2FzZShjaXR5KSxcbiAgICAgICAgJ2RhdGUnOiB0aW1lLFxuICAgIH07XG59O1xuXG5jb25zdCBnZXRPbmVDYWxsV2VhdGhlckRhdGEgPSBhc3luYyAobGF0LCBsb24pID0+IHtcbiAgICB0cnkge1xuICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGBodHRwczovL2FwaS5vcGVud2VhdGhlcm1hcC5vcmcvZGF0YS8yLjUvb25lY2FsbD9sYXQ9JHtsYXR9Jmxvbj0ke2xvbn0mZXhjbHVkZT17cGFydH0mYXBwaWQ9JHthcGlLZXl9YCk7XG4gICAgICAgIHJldHVybiBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgIH1cbn1cblxuZXhwb3J0IHtcbiAgICBnZXRMYXRMb24sIGdldE9uZUNhbGxXZWF0aGVyRGF0YSwgcHJvY2Vzc0N1cnJlbnRXZWF0aGVyRGF0YVxufSIsImNvbnN0IGZpbGxXZWF0aGVySW5mb1VJID0gKGRhdGEpID0+IHtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcud2VhdGhlci1kZXNjcmlwdGlvbicpLnRleHRDb250ZW50ID0gZGF0YS53ZWF0aGVyX2Rlc2M7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNpdHknKS50ZXh0Q29udGVudCA9IGRhdGEuY2l0eTtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZGF0ZScpLnRleHRDb250ZW50ID0gZGF0YS5kYXRlO1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50ZW1wJykudGV4dENvbnRlbnQgPSBkYXRhLnRlbXA7XG4gICAgbGV0IGltZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5pY29uLWltZycpO1xuICAgIGltZy5zcmMgPSBkYXRhLnNyYyA9IGRhdGEuaWNvbjtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZXJyb3ItbWVzc2FnZScpLmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpO1xufVxuXG5jb25zdCBmaWxsRXJyb3JNZXNzYWdlID0gKCkgPT4ge1xuICAgIGNvbnN0IGVycm9yRWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5lcnJvci1tZXNzYWdlJyk7XG4gICAgZXJyb3JFbGVtZW50LmNsYXNzTGlzdC50b2dnbGUoJ2hpZGRlbicpO1xufVxuZXhwb3J0IHtcbiAgICBmaWxsV2VhdGhlckluZm9VSSwgZmlsbEVycm9yTWVzc2FnZVxufSIsImNvbnN0IGNvbnZlcnRVbml0cyA9IChkYXRhKSA9PiB7XG4gICAgaWYgKGRhdGEudGVtcC5pbmNsdWRlcygnQycpKXtcbiAgICAgICAgbGV0IEYgPSBNYXRoLnJvdW5kKChwYXJzZUZsb2F0KGRhdGEudGVtcC5zcGxpdCgnICcpWzBdKSAqIDkvNSArIDMyKSAqIDEwKSAvIDEwO1xuICAgICAgICBsZXQgZmVlbHNMaWtlRiA9IE1hdGgucm91bmQoKHBhcnNlRmxvYXQoZGF0YS5mZWVsc19saWtlLnNwbGl0KCcgJylbMF0pICogOS81ICsgMzIpICogMTApIC8gMTA7XG4gICAgICAgIGxldCBzcGVlZCA9IE1hdGgucm91bmQocGFyc2VGbG9hdChkYXRhLndpbmRfc3BlZWQuc3BsaXQoJyAnKVswXSAvIDEuNjA5KSAqIDEwKSAvIDEwO1xuICAgICAgICBkYXRhLnRlbXAgPSBGICsgJyBkZWcgRic7XG4gICAgICAgIGRhdGEuZmVlbHNfbGlrZSA9IGZlZWxzTGlrZUYgKyAnIGRlZyBGJztcbiAgICAgICAgZGF0YS53aW5kX3NwZWVkID0gc3BlZWQgKyAnIG1waCc7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgbGV0IEMgPSBNYXRoLnJvdW5kKCgocGFyc2VGbG9hdChkYXRhLnRlbXAuc3BsaXQoJyAnKVswXSkgLSAzMikgLyAxLjgpICogMTApIC8gMTA7XG4gICAgICAgIGxldCBmZWVsc0xpa2VDID0gTWF0aC5yb3VuZCgoKHBhcnNlRmxvYXQoZGF0YS5mZWVsc19saWtlLnNwbGl0KCcgJylbMF0pIC0gMzIpIC8gMS44KSAqIDEwKSAvIDEwO1xuICAgICAgICBsZXQgc3BlZWQgPSBNYXRoLnJvdW5kKHBhcnNlRmxvYXQoZGF0YS53aW5kX3NwZWVkLnNwbGl0KCcgJylbMF0gKiAxLjYwOSkgKiAxMCkgLyAxMDtcbiAgICAgICAgZGF0YS50ZW1wID0gQyArICcgZGVnIEMnO1xuICAgICAgICBkYXRhLmZlZWxzX2xpa2UgPSBmZWVsc0xpa2VDICsgJyBkZWcgQyc7XG4gICAgICAgIGRhdGEud2luZF9zcGVlZCA9IHNwZWVkICsgJyBrbS9oJztcbiAgICB9XG4gICAgcmV0dXJuIGRhdGE7XG59O1xuXG5leHBvcnQge1xuICAgIGNvbnZlcnRVbml0c1xufSIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHsgZ2V0TGF0TG9uLCBnZXRPbmVDYWxsV2VhdGhlckRhdGEsIHByb2Nlc3NDdXJyZW50V2VhdGhlckRhdGEgfSBmcm9tIFwiLi9hcGlcIjtcbmltcG9ydCB7IGZpbGxFcnJvck1lc3NhZ2UsIGZpbGxXZWF0aGVySW5mb1VJIH0gZnJvbSBcIi4vdWlcIjtcbmltcG9ydCB7IGNvbnZlcnRVbml0cyB9IGZyb20gXCIuL3V0aWxzXCI7XG5cbmFzeW5jIGZ1bmN0aW9uIGdldERhdGEoY2l0eSkge1xuICAgIGNvbnN0IGxhdExvbiA9IGF3YWl0IGdldExhdExvbihjaXR5KTtcbiAgICBjb25zdCBkYXRhID0gYXdhaXQgZ2V0T25lQ2FsbFdlYXRoZXJEYXRhKGxhdExvbi5sYXQsIGxhdExvbi5sb24pO1xuICAgIHJldHVybiBhd2FpdCBwcm9jZXNzQ3VycmVudFdlYXRoZXJEYXRhKGRhdGEsIGNpdHkpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBtYWluKCkge1xuICAgIGxldCBjaXR5ID0gJ25ldyB5b3JrJzsgLy9pbml0aWFsIGNpdHlcbiAgICBsZXQgZGF0YSA9IGF3YWl0IGdldERhdGEoY2l0eSk7XG4gICAgZmlsbFdlYXRoZXJJbmZvVUkoZGF0YSk7XG4gICAgY29uc3QgY29udmVydCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jb252ZXJ0Jyk7XG4gICAgY29udmVydC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgZGF0YSA9IGNvbnZlcnRVbml0cyhkYXRhKTtcbiAgICAgICAgZmlsbFdlYXRoZXJJbmZvVUkoZGF0YSk7XG4gICAgfSk7XG4gICAgY29uc3Qgc2VhcmNoID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNlYXJjaCcpO1xuICAgIGNvbnN0IHNlYXJjaElucHV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNlYXJjaC1ib3gtaW5wdXQnKTtcbiAgICBzZWFyY2guYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyBmdW5jdGlvbigpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGxldCBpc0ZhcmVuID0gZmFsc2U7XG4gICAgICAgICAgICBpZiAoZGF0YS50ZW1wLmluY2x1ZGVzKCdGJykpe1xuICAgICAgICAgICAgICAgIGlzRmFyZW4gPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2l0eSA9IHNlYXJjaElucHV0LnZhbHVlO1xuICAgICAgICAgICAgZGF0YSA9IGF3YWl0IGdldERhdGEoY2l0eSk7XG4gICAgICAgICAgICBpZiAoaXNGYXJlbikge1xuICAgICAgICAgICAgICAgIGRhdGEgPSBjb252ZXJ0VW5pdHMoZGF0YSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmaWxsV2VhdGhlckluZm9VSShkYXRhKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGZpbGxFcnJvck1lc3NhZ2UoKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiWU9ZT1wiICsgZXJyb3IpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cblxubWFpbigpO1xuXG5cbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==