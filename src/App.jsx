import { useEffect, useState } from "react";
import "./App.css";
import styles from "./forecast.module.css";
import { API } from "./services/api";
import { getFiveDayForecast } from "./utils";

function App() {
  const [data, setData] = useState(null);
  const [location, setLocation] = useState({});
  const [isloading, setIsloading] = useState(false);
  const [city, setCity] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);

  // inputni qiymatini olish
  function handleChange(e) {
    setCity(e.target.value);
  }

  // locatsiya bo'yicha ob-havo malumotini berish
  const fetchLocationWeather = async () => {
    setIsloading(true);
    try {
      const response = await API.fetchByLocation(location?.lat, location?.lon);
      const modefadeData = getFiveDayForecast(response);
      console.log("forecast", getFiveDayForecast(response));
      setData(modefadeData);
      setSelectedDay(modefadeData[0]);
    } catch (error) {
      console.log("error", error);
    }
    setIsloading(false);
  };

  // shaxar nomi bo'yicha ob-havo malumotini berish
  const fetchCityWeather = async (event) => {
    event.preventDefault();
    setIsloading(true);
    try {
      const city = event.target?.[0].value;
      const response = await API.fetchByCityName(city);
      const modefadeData = getFiveDayForecast(response);
      setData(modefadeData);
      setSelectedDay(modefadeData[0]);
      event.target[0].value = "";
    } catch (error) {
      console.log("error", error);
    }
    setIsloading(false);
  };

  // geolocatsiyani olish
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setLocation({
        lat: position.coords.latitude,
        lon: position.coords.longitude,
      });
    });
  }, []);

  // fetchLocationWeather(), funcsiyasini chaqirish
  useEffect(() => {
    if (location?.lat && location?.lon) {
      fetchLocationWeather();
    }
  }, [location?.lat, location?.lon]);

  // API dan ma'lumot kelmay qolganda ekranga loading yozuvini chiqarish
  if (isloading || !data?.length) {
    return <h1>Loading...</h1>;
  }

  const dataIcon = data?.[0].icon;
  const name = data?.[0].cityName;
  const feelLike = data?.[0].feelLike;
  const status = data?.[0].status;
  const humdity = data?.[0].humidity;
  const currentTemp = data?.[0].currentTemp;

  return (
    <div className="app-container">
      <div className={styles.container}>
        <header className={styles.header}>
          <form className={styles.app_form} onSubmit={fetchCityWeather}>
            <input
              type="text"
              onChange={handleChange}
              placeholder="Shahar nomini kiriting"
            />
            <button type="submit">Search</button>
          </form>
          <div className={styles.cityName}>
            <h1>
              <img className={styles.data_icon} src={dataIcon} alt="icon" />
              {name}
            </h1>
            <p className={styles.temp}>{currentTemp}°C</p>
            <p> Holat: {status} </p>
            <p> Tuyuladi: {feelLike} °C</p>
            <p> Namlik: {humdity}%</p>
          </div>
        </header>
        <section className={styles.section}>
          <div className={styles.section_items}>
            {data?.map((day) => {
              const days = day?.date?.split(" ")?.[0];
              return (
                <div key={day.date}>
                  <button
                    className={styles.data}
                    onClick={() => setSelectedDay(day)}
                  >
                    {days}
                  </button>
                </div>
              );
            })}
          </div>
          <div className={styles.section_item}>
            {selectedDay?.hourly.map((hour) => (
              <div key={hour.time} className={styles.hourly}>
                <img src={hour.icon} alt="icon" />
                <p>
                  {hour.minTemp}/{hour.maxTemp}°C
                </p>
                <p>{hour.status}</p>
                <p>{hour.time}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;
