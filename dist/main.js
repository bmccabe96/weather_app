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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7OztBQUFBOzs7QUFHQTtBQUNBO0FBQ0EsMEZBQTBGLEtBQUssU0FBUyxPQUFPO0FBQy9HO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxxRUFBcUUsS0FBSztBQUMxRTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsNEZBQTRGLElBQUksT0FBTyxJQUFJLFVBQVUsS0FBSyxTQUFTLE9BQU87QUFDMUk7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBOzs7O0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOzs7QUFHQSIsInNvdXJjZXMiOlsid2VicGFjazovL3dlYXRoZXJfYXBwLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGFwaUtleSA9ICc4Yzk1ZTlkODFhOGQ4YmY1NDM4YWFkNmM4NGY4YTIzOSc7XG5cblxuY29uc3QgZ2V0TGF0TG9uID0gYXN5bmMgKGNpdHkpID0+IHtcbiAgICB0cnkge1xuICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGBodHRwczovL2FwaS5vcGVud2VhdGhlcm1hcC5vcmcvZGF0YS8yLjUvd2VhdGhlcj9xPSR7Y2l0eX0mYXBwaWQ9JHthcGlLZXl9YCk7XG4gICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgICAgIHJldHVybiBkYXRhLmNvb3JkO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgICAgLy9NYXliZSBhZGQgc29tZXRoaW5nIHRvIFVJIGhlcmUgd2hlbiBlcnJvclxuICAgIH1cbn07XG5cbmNvbnN0IGdldFdlYXRoZXJJY29uVVJMID0gYXN5bmMgKGljb24pID0+IHtcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGBodHRwOi8vb3BlbndlYXRoZXJtYXAub3JnL2ltZy93bi8ke2ljb259QDJ4LnBuZ2ApXG4gICAgcmV0dXJuIHJlc3BvbnNlLnVybDtcbn07XG5cbmNvbnN0IHByb2Nlc3NDdXJyZW50V2VhdGhlckRhdGEgPSBhc3luYyAoZGF0YSkgPT4ge1xuICAgIGxldCBvcHRpb25zID0ge1xuICAgICAgICB0aW1lWm9uZTogZGF0YS50aW1lem9uZSxcbiAgICAgICAgeWVhcjogJ251bWVyaWMnLFxuICAgICAgICBtb250aDogJ251bWVyaWMnLFxuICAgICAgICBkYXk6ICdudW1lcmljJyxcbiAgICAgICAgaG91cjogJ251bWVyaWMnLFxuICAgICAgICBtaW51dGU6ICdudW1lcmljJyxcbiAgICAgICAgc2Vjb25kOiAnbnVtZXJpYycsXG4gICAgICB9LFxuICAgIGZvcm1hdHRlciA9IG5ldyBJbnRsLkRhdGVUaW1lRm9ybWF0KFtdLCBvcHRpb25zKTtcbiAgICBsZXQgdGltZSA9IGZvcm1hdHRlci5mb3JtYXQobmV3IERhdGUoKSk7XG4gICAgXG4gICAgcmV0dXJuIHtcbiAgICAgICAgJ3RlbXAnOiBNYXRoLnJvdW5kKChkYXRhLmN1cnJlbnQudGVtcCAtIDI3MykqMTApLzEwLFxuICAgICAgICAnZmVlbHNfbGlrZSc6IE1hdGgucm91bmQoKGRhdGEuY3VycmVudC5mZWVsc19saWtlIC0gMjczKSoxMCkvMTAsXG4gICAgICAgICdodW1pZGl0eSc6IGRhdGEuY3VycmVudC5odW1pZGl0eSxcbiAgICAgICAgJ3dpbmRfc3BlZWQnOiBkYXRhLmN1cnJlbnQud2luZF9zcGVlZCxcbiAgICAgICAgJ3V2aSc6IGRhdGEuY3VycmVudC51dmksXG4gICAgICAgICd3ZWF0aGVyX21haW4nOiBkYXRhLmN1cnJlbnQud2VhdGhlclswXS5tYWluLFxuICAgICAgICAnd2VhdGhlcl9kZXNjJzogZGF0YS5jdXJyZW50LndlYXRoZXJbMF0uZGVzY3JpcHRpb24sXG4gICAgICAgICdpY29uJzogYXdhaXQgZ2V0V2VhdGhlckljb25VUkwoZGF0YS5jdXJyZW50LndlYXRoZXJbMF0uaWNvbiksXG4gICAgICAgICd0aW1lem9uZSc6IGRhdGEudGltZXpvbmUsXG4gICAgICAgICdkYXRlJzogdGltZSxcbiAgICB9O1xufTtcblxuY29uc3QgZ2V0T25lQ2FsbFdlYXRoZXJEYXRhID0gYXN5bmMgKGxhdCwgbG9uKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgaHR0cHM6Ly9hcGkub3BlbndlYXRoZXJtYXAub3JnL2RhdGEvMi41L29uZWNhbGw/bGF0PSR7bGF0fSZsb249JHtsb259JmV4Y2x1ZGU9e3BhcnR9JmFwcGlkPSR7YXBpS2V5fWApO1xuICAgICAgICByZXR1cm4gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICB9XG59XG5cblxuXG5jb25zdCBmaWxsV2VhdGhlckluZm9VSSA9IChkYXRhKSA9PiB7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLndlYXRoZXItZGVzY3JpcHRpb24nKS50ZXh0Q29udGVudCA9IGRhdGEud2VhdGhlcl9kZXNjO1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50aW1lem9uZScpLnRleHRDb250ZW50ID0gZGF0YS50aW1lem9uZTtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZGF0ZScpLnRleHRDb250ZW50ID0gZGF0YS5kYXRlO1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50ZW1wJykudGV4dENvbnRlbnQgPSBkYXRhLnRlbXAgKyAnIGRlZyBDJztcbiAgICBsZXQgaW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG4gICAgaW1nLnNyYyA9IGRhdGEuc3JjID0gZGF0YS5pY29uO1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5pY29uJykuYXBwZW5kQ2hpbGQoaW1nKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gbWFpbigpIHtcbiAgICBjb25zdCB0ZXN0QnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcigncDEnKTtcbiAgICB0ZXN0QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYXN5bmMgZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnN0IGluaXRpYWxDaXR5ID0gJ25ldyB5b3JrJztcbiAgICAgICAgY29uc3QgaW5pdGlhbExhdExvbiA9IGF3YWl0IGdldExhdExvbihpbml0aWFsQ2l0eSk7XG4gICAgICAgIGNvbnN0IGluaXRpYWxEYXRhID0gYXdhaXQgZ2V0T25lQ2FsbFdlYXRoZXJEYXRhKGluaXRpYWxMYXRMb24ubGF0LCBpbml0aWFsTGF0TG9uLmxvbik7XG4gICAgICAgIGNvbnNvbGUubG9nKGluaXRpYWxEYXRhKTtcbiAgICAgICAgY29uc3QgaW5pdGlhbERhdGFDbGVhbiA9IGF3YWl0IHByb2Nlc3NDdXJyZW50V2VhdGhlckRhdGEoaW5pdGlhbERhdGEpO1xuICAgICAgICBjb25zb2xlLmxvZyhpbml0aWFsRGF0YUNsZWFuKTtcbiAgICAgICAgZmlsbFdlYXRoZXJJbmZvVUkoaW5pdGlhbERhdGFDbGVhbik7XG4gICAgfSk7XG59XG5cblxubWFpbigpO1xuXG5cbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==