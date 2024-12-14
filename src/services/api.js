const API_KEY = import.meta.env.VITE_API_KEY;

export const API = {
  fetchByCityName: async (city) => {
    const response = await fetch(
      `https:api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY} `
    );
    const data = await response.json();

    return data;
  },
  fetchByLocation: async (lat, lon) => {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    );
    const data = await response.json();
    return data;
  },
};
