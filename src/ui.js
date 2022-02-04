const fillWeatherInfoUI = (data) => {
    document.querySelector('.weather-description').textContent = data.weather_desc;
    document.querySelector('.timezone').textContent = data.timezone;
    document.querySelector('.date').textContent = data.date;
    document.querySelector('.temp').textContent = data.temp + ' deg C';
    let img = document.createElement('img');
    img.src = data.src = data.icon;
    document.querySelector('.icon').appendChild(img);
}

export {
    fillWeatherInfoUI
}