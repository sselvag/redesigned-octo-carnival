$(document).ready(function () {

    var cityHistory = JSON.parse(localStorage.getItem("City History"));

    if (cityHistory === null) {

        cityHistory = [];

    }

    console.log(cityHistory);

    historyList()

    $("button").click(function () {

        var apiKey = "8c20fecf1dc12b4c826b47b8de6dbee6"

        var city = $("#search").val();
        console.log("The city being searched is " + city)


        cityHistory.push(city);
        console.log(cityHistory);

        $(".history").empty()
        historyList();

        var currentWeatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey;

        $.ajax({
            url: currentWeatherURL,
            method: "GET"
        }).then(function (current) {
            console.log("Current weather URL is: " + currentWeatherURL);
            console.log(current);

            var longitude = current.coord.lon;
            var latitude = current.coord.lat;

            console.log("Longitude is " + longitude + ", Latitude is " + latitude);

            var uvURL = "https://api.openweathermap.org/data/2.5/uvi/forecast?appid=" + apiKey + "&lat=" + latitude + "&lon=" + longitude;
            $.ajax({

                url: uvURL,
                method: "GET"
            }).then(function (UV) {
                console.log("Current UV URL is: " + uvURL);
                console.log(UV);
            })

        })

        var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + apiKey;

        $.ajax({

            url: forecastURL,
            method: "GET"
        }).then(function (forecast) {
            console.log("Current forecast URL is: " + forecastURL);
            console.log(forecast);
        })

        localStorage.setItem("City History", JSON.stringify(cityHistory));

    })

    function historyList() {

        $.each(cityHistory, function (i, value) {

            $(".history").prepend($("<div>").text(value));

        })
    }
})