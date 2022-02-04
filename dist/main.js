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
    const response = await fetch(`http://openweathermap.org/img/wn/${icon}@2x.png`)
    return response.url;
};

const processCurrentWeatherData = async (data) => {
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
    function titleCase(string){
        return string[0].toUpperCase() + string.slice(1).toLowerCase();
    }
    return {
        'temp': Math.round((data.current.temp - 273)*10)/10,
        'feels_like': Math.round((data.current.feels_like - 273)*10)/10,
        'humidity': data.current.humidity,
        'wind_speed': data.current.wind_speed,
        'uvi': data.current.uvi,
        'weather_main': data.current.weather[0].main,
        'weather_desc': titleCase(data.current.weather[0].description),
        'icon': await getWeatherIconURL(data.current.weather[0].icon),
        'timezone': data.timezone,
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
/* harmony export */   "fillWeatherInfoUI": () => (/* binding */ fillWeatherInfoUI)
/* harmony export */ });
const fillWeatherInfoUI = (data) => {
    document.querySelector('.weather-description').textContent = data.weather_desc;
    document.querySelector('.timezone').textContent = data.timezone;
    document.querySelector('.date').textContent = data.date;
    document.querySelector('.temp').textContent = data.temp + ' deg C';
    let img = document.createElement('img');
    img.src = data.src = data.icon;
    document.querySelector('.icon').appendChild(img);
}



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



async function startingData() {
    const initialCity = 'new york';
    const initialLatLon = await (0,_api__WEBPACK_IMPORTED_MODULE_0__.getLatLon)(initialCity);
    const initialData = await (0,_api__WEBPACK_IMPORTED_MODULE_0__.getOneCallWeatherData)(initialLatLon.lat, initialLatLon.lon);
    const initialDataClean = await (0,_api__WEBPACK_IMPORTED_MODULE_0__.processCurrentWeatherData)(initialData);
    (0,_ui__WEBPACK_IMPORTED_MODULE_1__.fillWeatherInfoUI)(initialDataClean);
}

async function main() {
    startingData();
    const search = document.querySelector('.search');
    search.addEventListener('click', async function() {
        console.log("blah");
    });
}


main();



})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7OztBQUdBO0FBQ0E7QUFDQSwwRkFBMEYsS0FBSyxTQUFTLE9BQU87QUFDL0c7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHFFQUFxRSxLQUFLO0FBQzFFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsNEZBQTRGLElBQUksT0FBTyxJQUFJLFVBQVUsS0FBSyxTQUFTLE9BQU87QUFDMUk7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7O0FDdkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7VUNSQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7OztBQ05vRjtBQUMzQzs7QUFFekM7QUFDQTtBQUNBLGdDQUFnQywrQ0FBUztBQUN6Qyw4QkFBOEIsMkRBQXFCO0FBQ25ELG1DQUFtQywrREFBeUI7QUFDNUQsSUFBSSxzREFBaUI7QUFDckI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7O0FBR0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly93ZWF0aGVyX2FwcC8uL3NyYy9hcGkuanMiLCJ3ZWJwYWNrOi8vd2VhdGhlcl9hcHAvLi9zcmMvdWkuanMiLCJ3ZWJwYWNrOi8vd2VhdGhlcl9hcHAvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vd2VhdGhlcl9hcHAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3dlYXRoZXJfYXBwL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vd2VhdGhlcl9hcHAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly93ZWF0aGVyX2FwcC8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBhcGlLZXkgPSAnOGM5NWU5ZDgxYThkOGJmNTQzOGFhZDZjODRmOGEyMzknO1xuXG5cbmNvbnN0IGdldExhdExvbiA9IGFzeW5jIChjaXR5KSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgaHR0cHM6Ly9hcGkub3BlbndlYXRoZXJtYXAub3JnL2RhdGEvMi41L3dlYXRoZXI/cT0ke2NpdHl9JmFwcGlkPSR7YXBpS2V5fWApO1xuICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgICAgICByZXR1cm4gZGF0YS5jb29yZDtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICAgIC8vTWF5YmUgYWRkIHNvbWV0aGluZyB0byBVSSBoZXJlIHdoZW4gZXJyb3JcbiAgICB9XG59O1xuXG5jb25zdCBnZXRXZWF0aGVySWNvblVSTCA9IGFzeW5jIChpY29uKSA9PiB7XG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgaHR0cDovL29wZW53ZWF0aGVybWFwLm9yZy9pbWcvd24vJHtpY29ufUAyeC5wbmdgKVxuICAgIHJldHVybiByZXNwb25zZS51cmw7XG59O1xuXG5jb25zdCBwcm9jZXNzQ3VycmVudFdlYXRoZXJEYXRhID0gYXN5bmMgKGRhdGEpID0+IHtcbiAgICBsZXQgb3B0aW9ucyA9IHtcbiAgICAgICAgdGltZVpvbmU6IGRhdGEudGltZXpvbmUsXG4gICAgICAgIHllYXI6ICdudW1lcmljJyxcbiAgICAgICAgbW9udGg6ICdudW1lcmljJyxcbiAgICAgICAgZGF5OiAnbnVtZXJpYycsXG4gICAgICAgIGhvdXI6ICdudW1lcmljJyxcbiAgICAgICAgbWludXRlOiAnbnVtZXJpYycsXG4gICAgICAgIHNlY29uZDogJ251bWVyaWMnLFxuICAgICAgfSxcbiAgICBmb3JtYXR0ZXIgPSBuZXcgSW50bC5EYXRlVGltZUZvcm1hdChbXSwgb3B0aW9ucyk7XG4gICAgbGV0IHRpbWUgPSBmb3JtYXR0ZXIuZm9ybWF0KG5ldyBEYXRlKCkpO1xuICAgIGZ1bmN0aW9uIHRpdGxlQ2FzZShzdHJpbmcpe1xuICAgICAgICByZXR1cm4gc3RyaW5nWzBdLnRvVXBwZXJDYXNlKCkgKyBzdHJpbmcuc2xpY2UoMSkudG9Mb3dlckNhc2UoKTtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgICAgJ3RlbXAnOiBNYXRoLnJvdW5kKChkYXRhLmN1cnJlbnQudGVtcCAtIDI3MykqMTApLzEwLFxuICAgICAgICAnZmVlbHNfbGlrZSc6IE1hdGgucm91bmQoKGRhdGEuY3VycmVudC5mZWVsc19saWtlIC0gMjczKSoxMCkvMTAsXG4gICAgICAgICdodW1pZGl0eSc6IGRhdGEuY3VycmVudC5odW1pZGl0eSxcbiAgICAgICAgJ3dpbmRfc3BlZWQnOiBkYXRhLmN1cnJlbnQud2luZF9zcGVlZCxcbiAgICAgICAgJ3V2aSc6IGRhdGEuY3VycmVudC51dmksXG4gICAgICAgICd3ZWF0aGVyX21haW4nOiBkYXRhLmN1cnJlbnQud2VhdGhlclswXS5tYWluLFxuICAgICAgICAnd2VhdGhlcl9kZXNjJzogdGl0bGVDYXNlKGRhdGEuY3VycmVudC53ZWF0aGVyWzBdLmRlc2NyaXB0aW9uKSxcbiAgICAgICAgJ2ljb24nOiBhd2FpdCBnZXRXZWF0aGVySWNvblVSTChkYXRhLmN1cnJlbnQud2VhdGhlclswXS5pY29uKSxcbiAgICAgICAgJ3RpbWV6b25lJzogZGF0YS50aW1lem9uZSxcbiAgICAgICAgJ2RhdGUnOiB0aW1lLFxuICAgIH07XG59O1xuXG5jb25zdCBnZXRPbmVDYWxsV2VhdGhlckRhdGEgPSBhc3luYyAobGF0LCBsb24pID0+IHtcbiAgICB0cnkge1xuICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGBodHRwczovL2FwaS5vcGVud2VhdGhlcm1hcC5vcmcvZGF0YS8yLjUvb25lY2FsbD9sYXQ9JHtsYXR9Jmxvbj0ke2xvbn0mZXhjbHVkZT17cGFydH0mYXBwaWQ9JHthcGlLZXl9YCk7XG4gICAgICAgIHJldHVybiBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgIH1cbn1cblxuZXhwb3J0IHtcbiAgICBnZXRMYXRMb24sIGdldE9uZUNhbGxXZWF0aGVyRGF0YSwgcHJvY2Vzc0N1cnJlbnRXZWF0aGVyRGF0YVxufSIsImNvbnN0IGZpbGxXZWF0aGVySW5mb1VJID0gKGRhdGEpID0+IHtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcud2VhdGhlci1kZXNjcmlwdGlvbicpLnRleHRDb250ZW50ID0gZGF0YS53ZWF0aGVyX2Rlc2M7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnRpbWV6b25lJykudGV4dENvbnRlbnQgPSBkYXRhLnRpbWV6b25lO1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5kYXRlJykudGV4dENvbnRlbnQgPSBkYXRhLmRhdGU7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnRlbXAnKS50ZXh0Q29udGVudCA9IGRhdGEudGVtcCArICcgZGVnIEMnO1xuICAgIGxldCBpbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcbiAgICBpbWcuc3JjID0gZGF0YS5zcmMgPSBkYXRhLmljb247XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmljb24nKS5hcHBlbmRDaGlsZChpbWcpO1xufVxuXG5leHBvcnQge1xuICAgIGZpbGxXZWF0aGVySW5mb1VJXG59IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgeyBnZXRMYXRMb24sIGdldE9uZUNhbGxXZWF0aGVyRGF0YSwgcHJvY2Vzc0N1cnJlbnRXZWF0aGVyRGF0YSB9IGZyb20gXCIuL2FwaVwiO1xuaW1wb3J0IHsgZmlsbFdlYXRoZXJJbmZvVUkgfSBmcm9tIFwiLi91aVwiO1xuXG5hc3luYyBmdW5jdGlvbiBzdGFydGluZ0RhdGEoKSB7XG4gICAgY29uc3QgaW5pdGlhbENpdHkgPSAnbmV3IHlvcmsnO1xuICAgIGNvbnN0IGluaXRpYWxMYXRMb24gPSBhd2FpdCBnZXRMYXRMb24oaW5pdGlhbENpdHkpO1xuICAgIGNvbnN0IGluaXRpYWxEYXRhID0gYXdhaXQgZ2V0T25lQ2FsbFdlYXRoZXJEYXRhKGluaXRpYWxMYXRMb24ubGF0LCBpbml0aWFsTGF0TG9uLmxvbik7XG4gICAgY29uc3QgaW5pdGlhbERhdGFDbGVhbiA9IGF3YWl0IHByb2Nlc3NDdXJyZW50V2VhdGhlckRhdGEoaW5pdGlhbERhdGEpO1xuICAgIGZpbGxXZWF0aGVySW5mb1VJKGluaXRpYWxEYXRhQ2xlYW4pO1xufVxuXG5hc3luYyBmdW5jdGlvbiBtYWluKCkge1xuICAgIHN0YXJ0aW5nRGF0YSgpO1xuICAgIGNvbnN0IHNlYXJjaCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zZWFyY2gnKTtcbiAgICBzZWFyY2guYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyBmdW5jdGlvbigpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJibGFoXCIpO1xuICAgIH0pO1xufVxuXG5cbm1haW4oKTtcblxuXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=