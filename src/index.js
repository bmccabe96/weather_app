import { getLatLon, getOneCallWeatherData, processCurrentWeatherData } from "./api";
import { fillWeatherInfoUI } from "./ui";

async function startingData() {
    const initialCity = 'new york';
    const initialLatLon = await getLatLon(initialCity);
    const initialData = await getOneCallWeatherData(initialLatLon.lat, initialLatLon.lon);
    const initialDataClean = await processCurrentWeatherData(initialData);
    fillWeatherInfoUI(initialDataClean);
}

async function main() {
    startingData();
    const search = document.querySelector('.search');
    search.addEventListener('click', async function() {
        console.log("blah");
    });
}


main();


