function create5DayCard(dataArray, index) {
    var cardBody = $("<div>").addClass("card-body");
    console.log(moment(dataArray[0], "X").format("DD MM YYYY"));
    var dataDate = $("<h5>").text(moment(dataArray[0], "X").format("ddd Do MMM YYYY"));
    var dataTemp = $("<p>").html(`<b>Temperature:</b><br>${dataArray[1]}°c`);
    var dataWind = $("<p>").html(`<b>Wind Speed:</b><br> ${dataArray[2]}mph`);
    var dataHumidity = $("<p>").html(`<b>Humidity:</b><br> ${dataArray[3]}%`);
    var dataIcon = $("<img>").attr("src", dataArray[4]);

    cardBody.append(dataDate, dataIcon, dataTemp, dataWind, dataHumidity);
    var card = $("<div>").addClass("card");
    var col = $("<div>").addClass("col");
    card.append(cardBody);
    col.append(card);
    $("#5dayCards").append(col);
}

function generate5DayForecast(object) {
    var forecastArray = [];
    var objectElement = 4;
    $("#5dayCards").empty();

    for (var i = 0; i < 5; i++) {
        var dataSet = [];
        dataSet.push(object.list[objectElement].dt);
        dataSet.push(object.list[objectElement].main.temp);
        dataSet.push(object.list[objectElement].wind.speed);
        dataSet.push(object.list[objectElement].main.humidity);
        dataSet.push(`http://openweathermap.org/img/wn/${object.list[objectElement].weather[0].icon}.png`);
        forecastArray.push(dataSet);
        objectElement += 8;
    }

    forecastArray.forEach(function (dataArray, index) {
        create5DayCard(dataArray, index);
    });
}

function generateTodaysForecast(object) {
    var todayTemp = object.main.temp;
    var todayWind = object.wind.speed;
    var todayHumidity = object.main.humidity;
    $("#todayCard").empty();
    $("#cityName").text(`${(object.name)}, ${(object.sys.country)}`); 
    
    var cardTitle = $("<h2>").text(`${moment(object.dt, "X").format("dddd Do MMMM YYYY")}`);
    var dataTemp = $("<p>").html(`<b>Temperature:</b> ${todayTemp}°c`);
    var dataWind = $("<p>").html(`<b>Windspeed:</b> ${todayWind}mph`);
    var dataHumidity = $("<p>").html(`<b>Humidity:</b> ${todayHumidity}%`);

    $("#todayCard").append(cardTitle, dataTemp, dataWind, dataHumidity);
}

$("#search-button").on("click", function (event) {
    event.preventDefault();
    $(".searchContent").removeClass("hide");

    var search = $("#search-input").val();
    var apiKey = "a32c896a5efe5c837799909bac3a9141";
    var queryURL1 = (`https://api.openweathermap.org/geo/1.0/direct?limit=5&q=${search}&appid=${apiKey}`);

    $.ajax({
        url: queryURL1,
        method: "GET"

    }).then(function (geoResponse) {

        var queryToday = (`https://api.openweathermap.org/data/2.5/weather?lat=${geoResponse[0].lat}&lon=${geoResponse[0].lon}&appid=${apiKey}&units=metric`);
        $.ajax({
            url: queryToday,
            method: "GET"
        }).then(function (response) {
            generateTodaysForecast(response);
        });

        var query5Day = (`https://api.openweathermap.org/data/2.5/forecast?lat=${geoResponse[0].lat}&lon=${geoResponse[0].lon}&appid=${apiKey}&units=metric`);
        $.ajax({
            url: query5Day,
            method: "GET"
        }).then(function (response) {
            generate5DayForecast(response);
        });
                           
        

    });
});