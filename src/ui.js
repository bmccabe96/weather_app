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



export {
    fillWeatherInfoUI, fillErrorMessage, initializeWeatherForecast, fillWeatherForecast
}