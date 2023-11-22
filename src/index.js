import location from "./location.json" assert { type: "json" };

let SIGNAL_OBJ = {
  location: null,
  time: {
    year: null,
    month: null,
    day: null,
    hour: null,
    minute: null,
    second: null,
  },
};

function findNearestCity(userLat, userLng, cities) {
  let nearestCity = null;
  let minDistance = Number.POSITIVE_INFINITY;

  for (const city of cities) {
    const cityLat = city.lat;
    const cityLng = city.lng;

    const R = 6371;
    const dLat = (cityLat - userLat) * (Math.PI / 180);
    const dLng = (cityLng - userLng) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(userLat * (Math.PI / 180)) *
        Math.cos(cityLat * (Math.PI / 180)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    if (distance < minDistance) {
      minDistance = distance;
      nearestCity = city;
    }
  }

  return nearestCity;
}

function getLocation() {
  return new Promise((resolve, reject) => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          const nearestCity = findNearestCity(latitude, longitude, location);

          if (nearestCity) {
            const currentDate = new Date();
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth() + 1;
            const day = currentDate.getDate();
            const hour = currentDate.getHours();
            const minute = currentDate.getMinutes();
            const second = currentDate.getSeconds();

            SIGNAL_OBJ = {
              location: nearestCity,
              time: {
                year,
                month,
                day,
                hour,
                minute,
                second,
              },
            };
            resolve(SIGNAL_OBJ);
          } else {
            reject("Location could not be obtained.");
          }
        },
        (error) => {
          reject("Location could not be obtained: " + error.message);
        }
      );
    } else {
      reject("Geolocation API is not supported.");
    }
  });
}

(async () => {
  try {
    await getLocation();

    fetch(`your-endpoint`, {
      method: "POST",
      headers: {
        method: "POST",
        mode: `your-cors-mode`,
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
          "Content-Type": `your-content/type`,
          Authorization: `your-token`,
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
      },
      body: JSON.stringify(SIGNAL_OBJ),
    })
      .then((response) => response.json())
      .then((data) => {})
      .catch((error) =>
        console.error("lokasyon bilgisi gönderilemedi:", error)
      );
  } catch (error) {
    console.error(error);
  }
})();
