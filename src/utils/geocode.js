const request = require("request");

const geocode = (address, callback) => {
    const url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&key=AIzaSyC6xrYHhT-_CeoktqgAwGjbOCNrmVUkXno";
    // can use shorthand here cos its basically the same var name
    // you can destructer response but honestly destructuring seems pointless
    request({url, json: true}, (error, response) => {
        // this is passed to geocode, if there is an error it passes this as a parameter
        if(error) {
            callback("unable to connect to serve", undefined);
        } else if (response.body.status === "ZERO_RESULTS") {
            // console.log(response.body)
            return callback("no location found", undefined);
        } else {
            console.log(response.body.results)
            const loc = (response.body.results[0].geometry.location);
            console.log(loc)
            // since no error just leave this undefined, have to pass in 2 args
            callback(undefined, loc);
        }

    });
}

// geocode("EH1 1BE", (error, loc) => {
//     // console.log(loc)
//     if(error){
//         console.log(error);
//     } else {
//         const lat = loc.lat;
//         // console.log(lat)
//         const lng = loc.lng;
//         const url = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" +lng + "&units=metric&appid=bbc3122c7a54f0964e767838df95d891";

//         request({url: url, json: true}, (err, response) => {
//             console.log(response.body.lat);
//     })
// }
// })



module.exports = geocode
