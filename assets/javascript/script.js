$(document).ready(function () {
    $(".error").hide();
    $(".forecast").hide();
    $(".main").hide();
    var city; 
    var cityHistory = JSON.parse(localStorage.getItem("City History"));
    if (cityHistory === null) {
        cityHistory = [];
    };
    historyList();
    clickHistory();
    $("button").click(function () {
        city = $("#search").val();
        if ($.inArray(city, cityHistory) === -1 && city !== "") {
            cityHistory.push(city); 
        };
        if (cityHistory.length > 8) {
            cityHistory.shift(); 
        };
        $(".history").empty();
        historyList();
        displayWeather();
        clickHistory();
        localStorage.setItem("City History", JSON.stringify(cityHistory));
    })
    function displayWeather() {
        $(".forecast").hide();
        $(".main").show();
        var apiKey = "8c20fecf1dc12b4c826b47b8de6dbee6";
        var currentWeatherURL = "https://api.openweathermap.org/data/2.5/weather?units=imperial&q=" + city + "&appid=" + apiKey;
        $.ajax({ 
            url: currentWeatherURL,
            method: "GET"
        }).then(function (current) {
            $(".error").hide();
            $(".results").show();
            var name = current.name;
            var conditions = current.weather[0].main;
            var woz = current.weather[0].icon;
            var temperature = current.main.temp;
            var humidity = current.main.humidity;
            var windSpeed = current.wind.speed;
            $(".city").addClass("h3 px-2 pt-3").text(name);
            $(".date").addClass("h3 pt-3").text("(" + moment().format('L') + ")"); 
            $(".icon").attr("src", "https://openweathermap.org/img/wn/" + woz + "@2x.png").attr("title", conditions).attr("alt", conditions);
            $(".temperature").addClass("h5 p-2").text("Temperature: " + temperature + " °F");
            $(".humidity").addClass("h5 p-2").text("Humidity: " + humidity + "%");
            $(".wind-speed").addClass("h5 p-2").text("Wind Speed: " + windSpeed + " MPH");
            var longitude = current.coord.lon;
            var latitude = current.coord.lat;
            var uvURL = "https://api.openweathermap.org/data/2.5/uvi/forecast?appid=" + apiKey + "&lat=" + latitude + "&lon=" + longitude;
            $.ajax({ 
                url: uvURL, 
                method: "GET"
            }).then(function (UV) {
                var uvIndex = UV[0].value;
                $(".uv-index").addClass("h5 p-2").html("UV Index: " + "<span class=\"bg-danger text-light rounded p-1\">" + uvIndex + "</span>");
            });
        }).fail(function () {
            $(".results").hide();
            $(".forecast").hide();
            $(".error").text("Cannot find results for \"" + city + ".\" Please use a different city.").show();
        });
        var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?units=imperial&q=" + city + "&appid=" + apiKey;
        $.ajax({ 
            url: forecastURL,
            method: "GET"
        }).then(function (forecast) {
            var cardLength = 5;           
            $(".card-deck").empty();
            $(".forecast").show();
            for (var i = 0; i < cardLength; i++) {
                var cardCreation = $("<div>").addClass("card text-white bg-primary mb-2").attr("id", "card" + i);
                var cardBody = $("<div>").addClass("card-body");
                cardBody.append($("<h5>").addClass("card-title").text(moment().add(i + 1, 'days').format('l')));
                cardBody.append($("<img>").addClass("card-icon").attr("src", "https://openweathermap.org/img/wn/" + forecast.list[i].weather[0].icon + "@2x.png").attr("title", forecast.list[i].weather[0].main).attr("alt", forecast.list[i].weather[0].main));
                cardBody.append($("<p>").addClass("card-temperature").addClass("my-1").text("Temp: " + forecast.list[i].main.temp + " °F"));
                cardBody.append($("<p>").addClass("card-humidity").text("Humidity: " + forecast.list[i].main.humidity + "%"));
                cardCreation.append(cardBody);
                $(".card-deck").append(cardCreation);
            };
        });
    };
    function historyList() { 
        $.each(cityHistory, function (i, value) {
            $(".history").prepend($("<li>").addClass("list-group-item text-secondary").text(value));
        });
    };
    function clickHistory() { 
        $(".list-group-item").click(function () {
            $(".list-group-item").addClass("text-secondary").removeClass("text-primary");
            $(this).removeClass("text-secondary").addClass("text-primary");
            city = $(this).text();
            displayWeather();
        });
    };
});