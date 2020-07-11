const request = require("request");

const forecast = (lat, lng, callback) => {
    // remember to use the exclude bit to filter day and minute, also change to metric
    // console.log(lat)
    const url = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lng + "&units=metric&exclude=minutely,daily&appid=bbc3122c7a54f0964e767838df95d891";
    request( { url: url, json: true}, (error, response) => {
        if(error){
            callback(undefined, "server prob");
        } else if (response.body === 0) {
            callback(undefined, "no results found");
        } else {
            const res = ("in 5 hours it will be " + response.body.hourly[5].temp);
            // console.log(response.body.hourly[1]);
            // get the temp and hour of each hour result
            
                // res.forEach((hour) =>{

                // const dateOb = new Date(hour.dt * 1000);
                // const time = (dateOb.getHours())
                // const temp = res.temp;
                // cos of the if statements you dont need to use destructuring or default params
                callback(undefined, res);
            // })
        // })
}
    })
}
// forecast(33.441792, -94.037689, (error, data) => {
//     console.log(error);
//     console.log(data);
// })

module.exports = forecast;