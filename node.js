const time1 = document.getElementById('time');
const date1 = document.getElementById('date');

const currentweatheritems = document.getElementById('current-weather-items');

const timezone = document.getElementById('time-zone');

const country = document.getElementById('country');
const weatherforecast = document.getElementById('weather-forecast');
const currenttemp = document.getElementById('current-temp');
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['Jan', 'Feb', 'March', "April", 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
const API_KEY = '437cb282906282e569eec25b5fdb7e37';

// for time

setInterval(() => {
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const minute = time.getMinutes();
    const hoursin12hr = hour >= 13 ? hour % 12 : hour;
    const ampm = hour >= 12 ? 'PM' : 'AM';

    time1.innerHTML = (hoursin12hr < 10 ? '0' + hoursin12hr : hoursin12hr) + ':' + (minute < 10 ? '0' + minute : minute) + ' ' + `<span id="am-pm">${ampm}</span>`

    date1.innerHTML = days[day] + ', ' + date + ' ' + months[month]

}, 1000);


getweatherdata()

function getweatherdata() {
    navigator.geolocation.getCurrentPosition((success) => {
        //console.log(success)
        // console.log(success);
        let {
            latitude,
            longitude
        } = success.coords;


        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`).then(res => res.json()).then(data => {

            //console.log(data);
            showweatherdata(data);
        })
    })

}

function showweatherdata(data) {
    timezone.innerHTML = data.timezone;
    country.innerHTML = data.lat + 'N ' + data.lon + 'E';
    let {
        humidity,
        pressure,
        sunrise,
        sunset,
        wind_speed
    } = data.current;

    const {name}=data;
    document.body.style.backgroundImage =
      "url('https://source.unsplash.com/1600x900/?" + data.current.weather[0].description + "')";

    currentweatheritems.innerHTML =
   `<div class="weather-item">
        <div>Humidity</div>
        <div>${humidity}%</div>
    </div>

    <div class="weather-item">
        <div>Pressure</div>
        <div>${pressure}</div>
    </div>

    <div class="weather-item">
        <div>Wind Speed</div>
        <div>${wind_speed}</div>
    </div>

    <div class="weather-item">
        <div>Sunrise</div>
        <div>${window.moment(sunrise*1000).format('HH:MM a')}</div>
    </div>
    <div class="weather-item">
        <div>Sunset</div>
        <div>${window.moment(sunset*1000).format('HH:MM a')}</div>
    </div>`;


    let otherdayforcast = ''

    // loop

    data.daily.forEach((day, idx) => {
        if (idx === 0) {
            currenttemp.innerHTML = `
            <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@4x.png" alt="weather-icon" class="w-icon">
            <div class="other">
                <div class="day">${window.moment(day.dt*1000).format('dddd')}</div>
            <div class="temp">Night - ${day.temp.night}&#176; C</div>
            <div class="temp">Day - ${day.temp.day}&#176; C</div>
            </div>`

        }
        else {
            otherdayforcast += `
            <div class="weather-forecast-item">
            <div class="day">${window.moment(day.dt*1000).format('ddd')}</div>
            <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
            <div class="temp">Night -${day.temp.night}&#176;C</div>
            <div class="temp">Day - ${day.temp.day}&#176;C</div>
            
        </div>`
        }
    })

    weatherforecast.innerHTML = otherdayforcast;
}

