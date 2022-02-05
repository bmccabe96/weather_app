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
export {
    fillWeatherInfoUI, fillErrorMessage
}