const convertForecastToF = (data) => {
    let newHighs = [];
    let newLows = [];
    for (let i=0; i<data.daily_highs.length; i++) {
        let high = Math.round((parseFloat(data.daily_highs[i].split(' ')[0]) * 9/5 + 32) * 10) / 10;
        let low = Math.round((parseFloat(data.daily_lows[i].split(' ')[0]) * 9/5 + 32) * 10) / 10;
        newHighs.push(high + ' F');
        newLows.push(low + ' F');
    }
    return {
        newHighs,
        newLows
    }
};

const convertForecastToC = (data) => {
    let newHighs = [];
    let newLows = [];
    for (let i=0; i<data.daily_highs.length; i++) {
        let high = Math.round(((parseFloat(data.daily_highs[i].split(' ')[0]) - 32) / 1.8) * 10) / 10;
        let low = Math.round(((parseFloat(data.daily_lows[i].split(' ')[0]) - 32) / 1.8) * 10) / 10;
        newHighs.push(high + ' C');
        newLows.push(low + ' C');
    }
    return {
        newHighs,
        newLows
    }
};

const convertUnits = (data) => {
    if (data.temp.includes('C')){
        let F = Math.round((parseFloat(data.temp.split(' ')[0]) * 9/5 + 32) * 10) / 10;
        let feelsLikeF = Math.round((parseFloat(data.feels_like.split(' ')[0]) * 9/5 + 32) * 10) / 10;
        let speed = Math.round(parseFloat(data.wind_speed.split(' ')[0] / 1.609) * 10) / 10;
        data.temp = F + ' F';
        data.feels_like = feelsLikeF + ' F';
        data.wind_speed = speed + ' mph';
        data.daily_highs = convertForecastToF(data).newHighs;
        data.daily_lows = convertForecastToF(data).newLows;
    } else {
        let C = Math.round(((parseFloat(data.temp.split(' ')[0]) - 32) / 1.8) * 10) / 10;
        let feelsLikeC = Math.round(((parseFloat(data.feels_like.split(' ')[0]) - 32) / 1.8) * 10) / 10;
        let speed = Math.round(parseFloat(data.wind_speed.split(' ')[0] * 1.609) * 10) / 10;
        data.temp = C + ' C';
        data.feels_like = feelsLikeC + ' C';
        data.wind_speed = speed + ' km/h';
        data.daily_highs = convertForecastToC(data).newHighs;
        data.daily_lows = convertForecastToC(data).newLows;
    }
    return data;
};

export {
    convertUnits
}