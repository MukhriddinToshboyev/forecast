export const getImageUrl = (icon) =>
  `http://openweathermap.org/img/wn/${icon}@2x.png`;

export const getFiveDayForecast = (data) => {
  const processedDays = {};
  const dailyForecast = [];
  data?.list?.forEach((el) => {
    // console.log("EL", el);
    const [date, time] = el.dt_txt.split(" ");
    if (!(date in processedDays) && dailyForecast.length <= 4) {
      processedDays[date] = dailyForecast.length;
      dailyForecast.push({
        cityName: data?.city?.name,
        icon: getImageUrl(el?.weather?.[0]?.icon),
        currentTemp: parseInt(el?.main?.temp, 10),
        maxTemp: parseInt(el?.main?.temp_max, 10),
        minTemp: parseInt(el?.main?.temp_min, 10),
        feelLike: parseInt(el?.main?.feels_like, 10),
        humidity: parseInt(el?.main?.humidity, 10),
        pressure: parseInt(el?.main?.pressure, 10),
        windSpeed: parseInt(el?.wind?.speed, 10),
        date: el?.dt_txt,
        status: el?.weather?.[0]?.main,
        description: el?.weather?.[0]?.description,
        hourly: [
          {
            minTemp: parseInt(el?.main?.temp_max, 10),
            time: time,
            status: el?.weather?.[0]?.main,
            icon: getImageUrl(el?.weather?.[0]?.icon),
            maxTemp: parseInt(el?.main?.temp_min, 10),
          },
        ],
      });
    } else if (date in processedDays) {
      dailyForecast[processedDays[date]].hourly.push({
        minTemp: parseInt(el?.main?.temp_min, 10),
        time: time,
        maxTemp: parseInt(el?.main?.temp_max, 10),
        status: el?.weather?.[0]?.main,
        icon: getImageUrl(el?.weather?.[0]?.icon),
      });
    }
  });
  // console.log({dailyForecast, processedDays})
  return dailyForecast;
};
