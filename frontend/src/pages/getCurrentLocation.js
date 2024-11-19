function getAddress() {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          function (position) {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
  
            // Use the reverse geocoding API to get the detailed location
            const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;
  
            fetch(url)
              .then((response) => response.json())
              .then((data) => {
                const address = data.address;
                let ans = ""
                if (address) {
                  const city = address.city || address.town || address.village || "";
                  if(city)  ans+=city+","
                  const state = address.state || "";
                  if(state) ans+=state+","
                  const country = address.country || "";
                  if(country)   ans+=country
  
                //   const ans = `${city}, ${state}, ${country}`;
                  resolve(ans); // Resolve the promise with the location data
                } else {
                  console.log("Address data is not available.");
                  resolve(""); // Resolve with empty string if no address data
                }
              })
              .catch((error) => {
                console.error("Error with geocoding:", error);
                reject(error); // Reject the promise in case of an error
              });
          },
          function (error) {
            console.error("Error getting location:", error);
            reject(error); // Reject the promise if geolocation fails
          }
        );
      } else {
        console.log("Geolocation is not supported by this browser.");
        reject("Geolocation not supported");
      }
    });
  }

export default getAddress