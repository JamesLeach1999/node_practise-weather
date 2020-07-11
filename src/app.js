// EXPRESS

// common practise is to require core modules, then npm modules
const path = require("path");
const express = require("express");
const hbs = require("hbs");
const request = require("request");
const geocode = require("./utils/geocode");
const forecast = require("./utils/forecast");

// need a template engine to set up dynamic files, like with yeild content in laravel
// hbs uses handlebars behind the scenes but makes it easier to use with express

// to access html docs, cant be relative path has to be from the root of the machine
// use these to get this info

// console.log(__dirname);
// path.join returns final path. it allows you to use relative 

// console.log(path.join(__dirname, "../public/index.html"));

// express is just a function, not an object
// dosent take arguements, we configure it using various methds on the app itself
const app = express();
const port = process.env.PORT || 3000;
// SERVING STATIC FILES
// ----------------------------------------------------------------------------------
// remember it auto goes to index
// DEFINE PATHS
const pubDirPath = path.join(__dirname, "../public");
const partialsPath = path.join(__dirname, "../views/partials")

// express works through the application until it finds a route for the match

// any served up file needs to be done after the server call
// all this does is serve the directory
// static means it dosent change  
// set has loads of different methods, we use view to et up template engine, spaces and caps matter
// since you cant use relative paths on their own, you have to set this up to be able to use them
// you need to use this to be able to access views

// SETUP HANDLE BARS ENGINE AND VIEWS LOCATION
// so we pass in the name of the setting we wanna set and the value we wanna set
app.set('views', __dirname + '\views\views');
// console.log(app)
app.set("view engine", "hbs");
// this is for your footer and header
hbs.registerPartials(partialsPath);

// SETUP STATIC DIRECTORY TO SERVE
app.use(express.static(pubDirPath));

// have to use .html on the routes when in browser
// the req is moving to another page
app.get("", (req, res) => {
    // render allows us to render views using hbs and express
    // dosent render css because of shiteing mime type
    // second arguement is an object of values you want the view to access
    
    res.render("../views/views/index.hbs", {
        title: "weather app",
        name: "jim"
    });
});

app.get("/about", (req, res) => {
    // its just like the view()->with in laravel
    res.render("../views/views/about.hbs", {
        title: "about me",
        name: "jim"
    });
})

app.get("/help", (req, res) => {
    // you have to name the directory views, not templates or any thing like that
    // since it isnt working for yours it can still work this way
    res.render("../views/views/help.hbs", {
        help: "this is the help message",
        title: "Help",
        name: "jim"
    });
})

// SERVING FILES DEFINED IN THE GET
// ------------------------------------------------------------------------------------

// uses routes just like laravel
// takes in route and function, the function is what to send back
// app.get("", (req, res) => {
//     // this allows us to send somthing back to the requester, this is what displays in the browser window
//     // can send back html or json
//     res.send("<h1>Thats numberwang</h1>");
// });

// have to restart server for the changes to take effect, or just use nodemon
// app.get("/help", (req, res) => {
//     // this automatically stringifys json
//     // can also be an array
//     res.send([{
//         name: "jim",
//     }, {
//         age: 20
//     }]);
// });
// // CHALLENGE
// app.get("/about", (req, res) => {
//     res.send("<h1>about page</h1>");
// })
// can send regular text, json and html. also js and css obvs
// QUERY STRING CHALLENGE
// this is basically an api endpoint. you access the data values using dots, query weather with the ? and has error messages. pretty cool
app.get("/weather", (req, res) => { 
    if(!req.query.address){
        return res.send({
            error: "please provide address"
        })
    } 

    // fuck it just use if statements
        
    // console.log(req.query);
    const add = (req.query.address);
    // console.log(req.query)
    geocode(add, (error, loc) => {
        // const loc = (geometry.location);
        // console.log(loc.lat)
        // something went wrong so have to restart server every time
        // ok so destructering makes it easier to set default value. if not you just have to put defaults after every param

        if(!loc) {
            return res.send({
                error: "it didnt work"
            })
        }

        forecast(loc.lat, loc.lng, (error, data) => {
            // console.log(error)
            // console.log(data)
                res.send({
                    address: add,
                    forecast: data
                })
            // the data parameter here overwrites the above one, so just come up with new name
            // console.log('Error', error)
            // res.send({
            //     address: add,
            //     forecast: data
            // })
        })
    })
    // pass search term to array

})

// QUERY STRINGS
// -----------------------------------------------------------------------------------------
// the req.query is just anything after the ? in the url. this logs whatever key bvalues you put to the console
app.get("/products", (req, res) => {
    // error handling in case there is no 'search' term
    // youll get 'cannot set headers after they are sent' as it, you get it when trying to respond to a requets twice, only one request/response per
    // only shown in terminal
    if(!req.query.search) {
        // you use return to end the function
        return res.send({
            error: "must provide a search term"
        })
    }


    // using dot notation, you can access individualvalues
    console.log(req.query.search)
    res.send({
        products: []
    })
})
// this matches any page which hasnt been matched so far with the help route
// remember, need to put this last in the help section. only activates when no other /help routes have been found
// CHALLENGE, 404 ERRORS FOR HELP ROUTE AND NORMAL ROUTE
app.get("/help/*", (req, res) => {
    res.render("../views/views/not_found.hbs", {
        error: "help page not found"
    })
})

// 404 MESSAGES
// --------------------------------------------------------------------------------------------
// for the url here, its for everything not explicitly defined, usnig the wildcard * character
// it needs to come last cos if there is no match with the ones above, it just uses this one. iterates through until match is found, dosent look at any below. like array.find()
app.get("*", (req, res) => {
    // still render the samer 404 page, just change the error value passed through to the view
    res.render("../views/views/not_found.hbs", {
        error: "page not found"
    });
})

// this starts the server, can pass a callback. its an async process
// when you run this, it keeps running. as opposed to the other 2 which execute then the node process closes
// this dosent as it stays up to process requests
app.listen(port, () => {
    // this dosent display in browser
    console.log("server up" + port);
});