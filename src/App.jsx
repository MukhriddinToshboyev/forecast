import { useEffect, useState } from "react";
import "./App.css";
import styles from "./forecast.module.css";
import { API } from "./services/api";

function App() {
  const [data, setData] = useState(null);
  const [location, setLocation] = useState({});
  const [isloading, setIsloading] = useState(false);
  const [city, setCity] = useState(null);
  const [newList, setNewList] = useState({});
  const [newDate, setNewDate] = useState([]);

  // inputni qiymatini olish
  function handleChange(e) {
    setCity(e.target.value);
  }

  console.log(data);

  // if()

  // locatsiya bo'yicha ob-havo malumotini berish
  const fetchLocationWeather = async () => {
    try {
      const response = await API.fetchByLocation(location?.lat, location?.lon);
      console.log(response);
      setData(response);
      setNewList(response?.list);
    } catch (error) {
      console.log("error", error);
    }
  };

  // shaxar nomi bo'yicha ob-havo malumotini berish
  const fetchCityWeather = async (event) => {
    event.preventDefault();
    try {
      const city = event.target?.[0].value;
      const response = await API.fetchByCityName(city);

      setData(response);
      // setNewList(response?.list);
    } catch (error) {
      console.log("error", error);
    }
  };

  // list ichidagi malumotlarni 5 kunlik ma'lumotlarga ajratish
  useEffect(() => {
    const newDate = [];
    for (let i = 0; i < newList?.length; i++) {
      const item = newList[i];
      const date = item?.dt_txt.split(" ")[0];
      if (!newDate[date]) {
        newDate[date] = [];
      }
      newDate[date].push(item);
    }
    setNewDate(newDate);
  }, []);

  console.log(newDate);

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
    // setIsloading(true);
  }, [location?.lat, location?.lon]);

  // API dan ma'lumot kelmay qolganda ekranga loading yozuvini chiqarish
  if (isloading || !data?.city) {
    return <h1>Loading...</h1>;
  }

  // const name = data?.city?.name;
  // const sunrise = new Date(data?.city?.sunrise * 1000).toLocaleTimeString();
  // const sunset = new Date(data?.city?.sunset * 1000).toLocaleTimeString();

  // const sana = data?.list?.[1].dt_txt;
  // console.log("sana", date);

  const date =
    new Date(newList?.[0].dt * 1000).toLocaleDateString().substring(0, 2) - 1;

  const sana = newList?.[0].dt_txt.substring(8, 10);

  console.log("date", date);
  console.log("sana", sana);

  // console.log(new Date().toLocaleDateString());

  // const feelsLike = Math.round(data?.list?.[1].main?.feels_like);
  // const temp = Math.round(data?.list?.[1].main?.temp);
  // const weather = data?.list?.[1].weather?.[0]?.main;
  // const humidity = data?.list?.[1].main?.humidity;
  // const visibility = (data?.list?.[1].visibility / 1000).toFixed(2);
  // const weatherIconUrl = `http://openweathermap.org/img/w/ ${data?.list?.[1].weather?.[0]?.icon}.png`;

  return (
    <div className="app-container">
      <form className={styles.app_form} onSubmit={fetchCityWeather}>
        <input
          type="text"
          onChange={handleChange}
          placeholder="Shahar nomini kiriting"
        />
        <button type="submit">Search</button>
      </form>
      <section className={styles.section}>
        <div className={styles.section_items}>
          {Object.keys(newDate).map((date) => (
            <div key={date}>
              <h2>{date}</h2>
              {newDate[date].map((item, index) => {
                <div key={index}>
                  <p>{item?.main.temp}</p>
                </div>;
              })}
            </div>
          ))}
        </div>

        {/* <div className={styles.container}>
          <div>
          </div>

          <p className={styles.text}> Quyosh chiqishi: {sunrise} </p>
          <p className={styles.text}> Quyosh botishi: {sunset} </p>
        </div>
        <div className={styles.containerr}>
          <p className={styles.text}> {sana} </p>
          <p className={styles.text}> Harorat: {temp}°C</p>
          <p className={styles.text}> Tuyuladi: {feelsLike} °C</p>
          <p className={styles.text}> Holat: {weather} </p>
          <p className={styles.text}> Ko'ruvchanlik: {visibility} km</p>
          <p className={styles.text}> Namlik: {humidity}% </p>
        </div> */}
      </section>
    </div>
  );
}

export default App;
