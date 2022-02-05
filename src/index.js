import { getLatLon, getOneCallWeatherData, processCurrentWeatherData } from "./api";
import { fillErrorMessage, fillWeatherInfoUI, initializeWeatherForecast, fillWeatherForecast } from "./ui";
import { convertUnits } from "./utils";

async function getData(city) {
    const latLon = await getLatLon(city);
    const data = await getOneCallWeatherData(latLon.lat, latLon.lon);
    return await processCurrentWeatherData(data, city);
}

async function main() {
    let city = 'new york'; //initial city
    let data = await getData(city);
    console.log(data);
    fillWeatherInfoUI(data);
    initializeWeatherForecast(data);
    const convert = document.querySelector('.convert');
    convert.addEventListener('click', () => {
        data = convertUnits(data);
        fillWeatherInfoUI(data);
        fillWeatherForecast(data);
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
                data = convertUnits(data);
            }
            fillWeatherInfoUI(data);
            fillWeatherForecast(data);
        } catch (error) {
            fillErrorMessage();
            console.log("YOYO" + error);
        }
    });
}


main();


