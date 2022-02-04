/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
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
    
    return {
        'temp': Math.round((data.current.temp - 273)*10)/10,
        'feels_like': Math.round((data.current.feels_like - 273)*10)/10,
        'humidity': data.current.humidity,
        'wind_speed': data.current.wind_speed,
        'uvi': data.current.uvi,
        'weather_main': data.current.weather[0].main,
        'weather_desc': data.current.weather[0].description,
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



const fillWeatherInfoUI = (data) => {
    document.querySelector('.weather-description').textContent = data.weather_desc;
    document.querySelector('.timezone').textContent = data.timezone;
    document.querySelector('.date').textContent = data.date;
    document.querySelector('.temp').textContent = data.temp + ' deg C';
    let img = document.createElement('img');
    img.src = data.src = data.icon;
    document.querySelector('.icon').appendChild(img);
}

async function main() {
    const testButton = document.querySelector('p1');
    testButton.addEventListener('click', async function() {
        const initialCity = 'new york';
        const initialLatLon = await getLatLon(initialCity);
        const initialData = await getOneCallWeatherData(initialLatLon.lat, initialLatLon.lon);
        console.log(initialData);
        const initialDataClean = await processCurrentWeatherData(initialData);
        console.log(initialDataClean);
        fillWeatherInfoUI(initialDataClean);
    });
}

main();



/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7OztBQUFBOzs7QUFHQTtBQUNBO0FBQ0EsMEZBQTBGLEtBQUssU0FBUyxPQUFPO0FBQy9HO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxxRUFBcUUsS0FBSztBQUMxRTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsNEZBQTRGLElBQUksT0FBTyxJQUFJLFVBQVUsS0FBSyxTQUFTLE9BQU87QUFDMUk7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBOzs7O0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vd2VhdGhlcl9hcHAvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgYXBpS2V5ID0gJzhjOTVlOWQ4MWE4ZDhiZjU0MzhhYWQ2Yzg0ZjhhMjM5JztcblxuXG5jb25zdCBnZXRMYXRMb24gPSBhc3luYyAoY2l0eSkgPT4ge1xuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYGh0dHBzOi8vYXBpLm9wZW53ZWF0aGVybWFwLm9yZy9kYXRhLzIuNS93ZWF0aGVyP3E9JHtjaXR5fSZhcHBpZD0ke2FwaUtleX1gKTtcbiAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICAgICAgcmV0dXJuIGRhdGEuY29vcmQ7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgICAvL01heWJlIGFkZCBzb21ldGhpbmcgdG8gVUkgaGVyZSB3aGVuIGVycm9yXG4gICAgfVxufTtcblxuY29uc3QgZ2V0V2VhdGhlckljb25VUkwgPSBhc3luYyAoaWNvbikgPT4ge1xuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYGh0dHA6Ly9vcGVud2VhdGhlcm1hcC5vcmcvaW1nL3duLyR7aWNvbn1AMngucG5nYClcbiAgICByZXR1cm4gcmVzcG9uc2UudXJsO1xufTtcblxuY29uc3QgcHJvY2Vzc0N1cnJlbnRXZWF0aGVyRGF0YSA9IGFzeW5jIChkYXRhKSA9PiB7XG4gICAgbGV0IG9wdGlvbnMgPSB7XG4gICAgICAgIHRpbWVab25lOiBkYXRhLnRpbWV6b25lLFxuICAgICAgICB5ZWFyOiAnbnVtZXJpYycsXG4gICAgICAgIG1vbnRoOiAnbnVtZXJpYycsXG4gICAgICAgIGRheTogJ251bWVyaWMnLFxuICAgICAgICBob3VyOiAnbnVtZXJpYycsXG4gICAgICAgIG1pbnV0ZTogJ251bWVyaWMnLFxuICAgICAgICBzZWNvbmQ6ICdudW1lcmljJyxcbiAgICAgIH0sXG4gICAgZm9ybWF0dGVyID0gbmV3IEludGwuRGF0ZVRpbWVGb3JtYXQoW10sIG9wdGlvbnMpO1xuICAgIGxldCB0aW1lID0gZm9ybWF0dGVyLmZvcm1hdChuZXcgRGF0ZSgpKTtcbiAgICBcbiAgICByZXR1cm4ge1xuICAgICAgICAndGVtcCc6IE1hdGgucm91bmQoKGRhdGEuY3VycmVudC50ZW1wIC0gMjczKSoxMCkvMTAsXG4gICAgICAgICdmZWVsc19saWtlJzogTWF0aC5yb3VuZCgoZGF0YS5jdXJyZW50LmZlZWxzX2xpa2UgLSAyNzMpKjEwKS8xMCxcbiAgICAgICAgJ2h1bWlkaXR5JzogZGF0YS5jdXJyZW50Lmh1bWlkaXR5LFxuICAgICAgICAnd2luZF9zcGVlZCc6IGRhdGEuY3VycmVudC53aW5kX3NwZWVkLFxuICAgICAgICAndXZpJzogZGF0YS5jdXJyZW50LnV2aSxcbiAgICAgICAgJ3dlYXRoZXJfbWFpbic6IGRhdGEuY3VycmVudC53ZWF0aGVyWzBdLm1haW4sXG4gICAgICAgICd3ZWF0aGVyX2Rlc2MnOiBkYXRhLmN1cnJlbnQud2VhdGhlclswXS5kZXNjcmlwdGlvbixcbiAgICAgICAgJ2ljb24nOiBhd2FpdCBnZXRXZWF0aGVySWNvblVSTChkYXRhLmN1cnJlbnQud2VhdGhlclswXS5pY29uKSxcbiAgICAgICAgJ3RpbWV6b25lJzogZGF0YS50aW1lem9uZSxcbiAgICAgICAgJ2RhdGUnOiB0aW1lLFxuICAgIH07XG59O1xuXG5jb25zdCBnZXRPbmVDYWxsV2VhdGhlckRhdGEgPSBhc3luYyAobGF0LCBsb24pID0+IHtcbiAgICB0cnkge1xuICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGBodHRwczovL2FwaS5vcGVud2VhdGhlcm1hcC5vcmcvZGF0YS8yLjUvb25lY2FsbD9sYXQ9JHtsYXR9Jmxvbj0ke2xvbn0mZXhjbHVkZT17cGFydH0mYXBwaWQ9JHthcGlLZXl9YCk7XG4gICAgICAgIHJldHVybiBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgIH1cbn1cblxuXG5cbmNvbnN0IGZpbGxXZWF0aGVySW5mb1VJID0gKGRhdGEpID0+IHtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcud2VhdGhlci1kZXNjcmlwdGlvbicpLnRleHRDb250ZW50ID0gZGF0YS53ZWF0aGVyX2Rlc2M7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnRpbWV6b25lJykudGV4dENvbnRlbnQgPSBkYXRhLnRpbWV6b25lO1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5kYXRlJykudGV4dENvbnRlbnQgPSBkYXRhLmRhdGU7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnRlbXAnKS50ZXh0Q29udGVudCA9IGRhdGEudGVtcCArICcgZGVnIEMnO1xuICAgIGxldCBpbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcbiAgICBpbWcuc3JjID0gZGF0YS5zcmMgPSBkYXRhLmljb247XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmljb24nKS5hcHBlbmRDaGlsZChpbWcpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBtYWluKCkge1xuICAgIGNvbnN0IHRlc3RCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdwMScpO1xuICAgIHRlc3RCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyBmdW5jdGlvbigpIHtcbiAgICAgICAgY29uc3QgaW5pdGlhbENpdHkgPSAnbmV3IHlvcmsnO1xuICAgICAgICBjb25zdCBpbml0aWFsTGF0TG9uID0gYXdhaXQgZ2V0TGF0TG9uKGluaXRpYWxDaXR5KTtcbiAgICAgICAgY29uc3QgaW5pdGlhbERhdGEgPSBhd2FpdCBnZXRPbmVDYWxsV2VhdGhlckRhdGEoaW5pdGlhbExhdExvbi5sYXQsIGluaXRpYWxMYXRMb24ubG9uKTtcbiAgICAgICAgY29uc29sZS5sb2coaW5pdGlhbERhdGEpO1xuICAgICAgICBjb25zdCBpbml0aWFsRGF0YUNsZWFuID0gYXdhaXQgcHJvY2Vzc0N1cnJlbnRXZWF0aGVyRGF0YShpbml0aWFsRGF0YSk7XG4gICAgICAgIGNvbnNvbGUubG9nKGluaXRpYWxEYXRhQ2xlYW4pO1xuICAgICAgICBmaWxsV2VhdGhlckluZm9VSShpbml0aWFsRGF0YUNsZWFuKTtcbiAgICB9KTtcbn1cblxubWFpbigpO1xuXG5cbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==