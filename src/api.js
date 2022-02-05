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

export {
    getLatLon, getOneCallWeatherData, processCurrentWeatherData
}