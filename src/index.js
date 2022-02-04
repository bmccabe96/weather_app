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


