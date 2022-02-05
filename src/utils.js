const convertUnits = (data) => {
    if (data.temp.includes('C')){
        let F = Math.round((parseFloat(data.temp.split(' ')[0]) * 9/5 + 32) * 10) / 10;
        let feelsLikeF = Math.round((parseFloat(data.feels_like.split(' ')[0]) * 9/5 + 32) * 10) / 10;
        let speed = Math.round(parseFloat(data.wind_speed.split(' ')[0] / 1.609) * 10) / 10;
        data.temp = F + ' deg F';
        data.feels_like = feelsLikeF + ' deg F';
        data.wind_speed = speed + ' mph';
    } else {
        let C = Math.round(((parseFloat(data.temp.split(' ')[0]) - 32) / 1.8) * 10) / 10;
        let feelsLikeC = Math.round(((parseFloat(data.feels_like.split(' ')[0]) - 32) / 1.8) * 10) / 10;
        let speed = Math.round(parseFloat(data.wind_speed.split(' ')[0] * 1.609) * 10) / 10;
        data.temp = C + ' deg C';
        data.feels_like = feelsLikeC + ' deg C';
        data.wind_speed = speed + ' km/h';
    }
    return data;
};

export {
    convertUnits
}