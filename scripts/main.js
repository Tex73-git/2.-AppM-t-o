import tabJourEnOrdre from "./Utilitaire/gestionTemps.js";
// console.log("Depuis main.js: " + tabJourEnOrdre);

const CLEFAPI = "33e059a9f206ed7589aa50871472c99f" ;
let resultatAPI;
const temps = document.querySelector('.temps');
const temperature = document.querySelector('.temperature');
const localisation = document.querySelector('.localisation');
const heure = document.querySelectorAll('.heure-nom-prevision');
const tempPourH = document.querySelectorAll('.heure-prevision-valeur');
const joursDiv = document.querySelectorAll('.jour-prevision-nom');
const tempJoursDiv = document.querySelectorAll('.jour-prevision-temp');
const imgIcone = document.querySelector('.logo-meteo');
const chargementContainer = document.querySelector('.overlay-icone-chargement');

if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {

        // console.log(position);
        let long = position.coords.longitude;
        let lat = position.coords.latitude;
        AppelAPI(long, lat);
    }, () => {
        alert("Vous devez autoriser la géolocalisation pour utiliser cette application, veuillez l'activer !");  
    })
}

function AppelAPI(long, lat) {
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=minutely&units=metric&lang=fr&{part}&appid=${CLEFAPI}`)
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        // console.log(data);
        resultatAPI = data;

        temps.innerText = resultatAPI.current.weather[0].description;
        temperature.innerText = `${Math.trunc(resultatAPI.current.temp)}°`
        localisation.innerText = resultatAPI.timezone; 
        
        // Les heures par tranche de trois, avec température.
        let heureActuelle = new Date().getHours();
        for(let i = 0; i < heure.length; i++) {
            let heureIncr = heureActuelle + i * 3;
            if(heureIncr > 24) {
                heure[i].innerText = `${heureIncr - 24} h`;
            } else if(heureIncr === 24) {
                heure[i].innerText = "00 h";
            } else {
                heure[i].innerText = `${heureIncr} h`;
            }
        }
        // Température par tranche de trois.
        for(let j = 0; j < tempPourH.length; j++) {
            tempPourH[j].innerText = `${Math.trunc(resultatAPI.hourly[j * 3].temp)}°`;
        }

        // Trois premières lettres des jours
        for(let k = 0; k < tabJourEnOrdre.length; k++) {
            joursDiv[k].innerText = tabJourEnOrdre[k].slice(0,3);
        }

        // Température moyenne par jour
        for(let m = 0; m < 7; m++) {
            tempJoursDiv[m].innerText = `${Math.trunc(resultatAPI.daily[m +1].temp.day)}°`;
        }

        // Icone dynamique
        if(heureActuelle >= 6 && heureActuelle < 21) {
            imgIcone.src = `ressources/jour/${resultatAPI.current.weather[0].icon}.svg`;
        } else {
            imgIcone.src = `ressources/nuit/${resultatAPI.current.weather[0].icon}.svg`;
        }

        chargementContainer.classList.add('disparition');
    })
}