const cityInput = document.getElementById('input-city');
const select = document.getElementById('select-country');

cityInput.value = 'Santa fe';
addDataCurrent();
addData();
cityInput.value = '';


async function fetchWeather(api) {
    const KEY = window.API_KEY; 

    try {
        const res = await fetch(`${api}${cityInput.value},${select.value}&appid=${KEY}`);
        if (!res.ok) {
            throw new Error('Error al obtener los datos del clima');
        }
        let data = await res.json();
        return data;

    } catch (error) {
        console.log(error);
    }
}


async function addDataCurrent() {
    let data = await fetchWeather('https://api.openweathermap.org/data/2.5/weather?q=');

    const nameCity = document.getElementById('name-city');
    nameCity.textContent = data.name;

    const dateCity = document.getElementById('date-city');
    let now = new Date();
    const month = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
    dateCity.textContent = `${month[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()} | ${data.sys.country}`;

    const tempCity = document.getElementById('temp-city');
    tempCity.textContent = `${Math.round(data.main.temp - 273.15)}°`

    const imgCity = document.getElementById('img-city');
    imgData(data.weather[0].main, imgCity);

    const sunrise = document.getElementById('sunrise');
    const sunriseDate = new Date(data.sys.sunrise * 1000);
    sunrise.textContent = `${sunriseDate.getHours()}:${sunriseDate.getMinutes()} am`;

    const sunset = document.getElementById('sunset');
    const sunsetDate = new Date(data.sys.sunset * 1000);
    sunset.textContent = `${sunsetDate.getHours()}:${sunsetDate.getMinutes()} pm`;

    document.getElementById('humidity').textContent = `${data.main.humidity}%`;

    const windSpeed = document.getElementById('wind')
    windSpeed.textContent = `${Math.floor(data.wind.speed * 3.6)}km/h`;
}


async function addData() {
    let data = await fetchWeather('https://api.openweathermap.org/data/2.5/forecast?q=');

    const maxTemp = document.querySelectorAll('.max-temp');
    maxTemp[0].textContent = `+${Math.round(data.list[6].main.temp_max - 273.15)}°`
    maxTemp[1].textContent = `+${Math.round(data.list[14].main.temp_max - 273.15)}°`
    maxTemp[2].textContent = `+${Math.round(data.list[21].main.temp_max - 273.15)}°`

    const day = document.querySelectorAll(".day");
    const days = ["Dom","Lun","Mar","Mie","Jue","Vie","Sab"];
    const today = new Date().getDay();

    day[0].textContent = days[(today + 1) % 7];
    day[1].textContent = days[(today + 2) % 7];
    day[2].textContent = days[(today + 3) % 7];

    const iconDay = document.querySelectorAll('#icon-day');
    imgData(data.list[6].weather[0].main, iconDay[0]);
    imgData(data.list[14].weather[0].main, iconDay[1]);
    imgData(data.list[21].weather[0].main, iconDay[2]);
}


function imgData(data, item){
    const icons = {
        Clouds: "img/nubes.png",
        Rain: "img/lluvia.png",
        Clear: "img/sol.png",
        Thunderstorm: "img/rayos.png",
        Drizzle: "img/lluvia.png",
        Snow: "img/snowy.png",
        Atmosphere: "img/nubes.png"
    };

    item.setAttribute('src', icons[data] || icons['Clouds']);
}


async function showWeather(){
    await addData();
    await addDataCurrent();
    cityInput.value = '';
}


cityInput.addEventListener('keypress', (e) =>{
    if(e.key === 'Enter'){
        showWeather();
    }
});
