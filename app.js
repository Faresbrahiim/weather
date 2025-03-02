let userCoords = { lat: null, lon: null };
const apiKey = "de5b1b4de23c5840ff6d55e6063e7800";
window.onload = async function () {
    await getUserLocation();
    getWeather();
};
document.getElementById("city-input").addEventListener("keydown", async function (event) {
    if (event.key === "Enter") {
        const city = event.target.value.trim();
        if (city) {
            await getWeatherByCity(city);
        }
    }
});
async function getUserLocation() {
    return new Promise((resolve, reject) => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    userCoords.lat = position.coords.latitude;
                    userCoords.lon = position.coords.longitude;
                    resolve(userCoords);
                },
                (error) => reject(`Geolocation error: ${error.message}`)
            );
        } else {
            reject("Geolocation is not supported by this browser.");
        }
    });
}
async function getWeather() {
    if (!userCoords.lat || !userCoords.lon) {
        await getUserLocation();
    }
    const api = `https://api.openweathermap.org/data/2.5/forecast?lat=${userCoords.lat}&lon=${userCoords.lon}&appid=${apiKey}&units=metric`;
    fetchWeather(api);
}


async function getWeatherByCity(city) {
    const api = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
    fetchWeather(api);
}


async function fetchWeather(api) {
    try {
        const response = await fetch(api);
        if (!response.ok) { 
            throw new Error(`cityyy ya ciity `);
        }
        const data = await response.json();
        console.log(data);
        console.log(data.cod)
        const today = data.list[0];
        document.getElementById("city-name").innerHTML = data.city.name;
        document.getElementById("temp").innerHTML = Math.round(today.main.temp) + "°C";
        document.getElementById("description").innerHTML = today.weather[0].description;
        document.getElementById("humidity").innerHTML = today.main.humidity + "%";
        
        
        const formattedDate = new Date(today.dt * 1000).toLocaleDateString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        });
        document.getElementById("date").innerHTML = formattedDate;
        document.getElementById('notFound').innerHTML = ''
        
        const dailyData = {};
        data.list.forEach((entry) => {
            const dailyDate = new Date(entry.dt * 1000).toLocaleDateString("en-US", { weekday: "long" });

            if (!dailyData[dailyDate]) {
                dailyData[dailyDate] = {
                    temp: Math.round(entry.main.temp) + "°C",
                    description: entry.weather[0].description,
                };
            }
        });

        const week = document.getElementsByClassName("week")[0];
        week.innerHTML = "";
        Object.entries(dailyData).forEach(([date, data]) => {
            const card = document.createElement("div");
            card.classList.add("forecast-card");
            card.innerHTML = `<p><strong>${date}</strong></p><p>${data.temp}</p><p>${data.description}</p>`;
            week.appendChild(card);
        });

    } catch (error) {
        console.log(error);
        document.getElementById("notFound").innerHTML = " City not found. Please enter a valid city.";
    }
}
