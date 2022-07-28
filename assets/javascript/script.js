$(document).ready(function () {
    $(".main").hide();

    var cityHistory = JSON.parse(localStorage.getItem("City History"));
    var city;

    if (cityHistory === null) {
        cityHistory = [];
    }
    console.log(cityHistory);
    historyList()
    $("button").click(function () {

        city = $("#search").val();
        console.log("The city being searched is " + city)

        if ($.inArray(city, cityHistory) === -1 && city === "") {

            cityHistory.push(city);
        }

        if (cityHistory.length > 8) {
            cityHistory.shift(); // removes the first element from an array 
        }
        console.log(cityHistory);

        $(".history").empty()
        historyList();
        displayWeather();

        localStorage.setItem("City History", JSON.stringify(cityHistory));

    })

    $(".list-group-item").click(function () {
        $(".list-group-item").addClass("text-secondary").removeClass("text-primary");
        $(this).removeClass("text-secondary").addClass("text-primary");
        city = $(this).text();
        console.log(city);
        displayWeather();

    })

    function displayWeather() {
        $(".main").show();

        var apiKey = "8c20fecf1dc12b4c826b47b8de6dbee6"

        var currentWeatherURL = "https://api.openweathermap.org/data/2.5/weather?units=imperial&q=" + city + "&appid=" + apiKey;

        $.ajax({
            url: currentWeatherURL,
            method: "GET"
        }).then(function (current) {
            console.log("Current weather URL is: " + currentWeatherURL);
            console.log(current);

            var name = current.name;
            var conditions = current.weather[0].main
            var icon = current.weather[0].icon;
            var temperature = current.main.temp;
            var humidity = current.main.humidity;
            var windSpeed = current.wind.speed;

            $(".city").addClass("h3 px-2 pt-3").text(name);
            $(".date").addClass("h3 pt-3").text("(" + moment().format('L') + ")");
            $(".icon").addClass("img-fluid").attr("src", "http://openweathermap.org/img/wn/" + icon + "@2x.png").attr("title", conditions).attr("alt", conditions);
            $(".temperature").addClass("h5 p-2").text("Temperature: " + temperature + " °F");
            $(".humidity").addClass("h5 p-2").text("Humidity: " + humidity + "%");
            $(".wind-speed").addClass("h5 p-2").text("Wind Speed: " + windSpeed + " MPH");

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

                var uvIndex = UV[0].value;

                $(".uv-index").addClass("h5 p-2").html("UV Index: " + "<span class=\"bg-danger text-light rounded p-1\">" + uvIndex + "</span>");

            })

        })

        var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + apiKey;

        $.ajax({

            url: forecastURL,
            method: "GET"
        }).then(function (forecast) {
            console.log("Current forecast URL is: " + forecastURL);
            console.log(forecast);

            // <div class="card text-white bg-primary mb-3" style="max-width: 18rem;">
            //     <div class="card-body">
            //         <h5 class="card-title">Primary card title</h5>
            //         <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
            //     </div>
            // </div>

        })
    }


    function historyList() {

        $.each(cityHistory, function (i, value) {

            $(".history").prepend($("<li>").addClass("list-group-item text-secondary").text(value));

        })
    }
})