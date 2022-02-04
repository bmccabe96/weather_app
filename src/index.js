import { getLatLon, getOneCallWeatherData, processCurrentWeatherData } from "./api";
import { fillWeatherInfoUI } from "./ui";



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


