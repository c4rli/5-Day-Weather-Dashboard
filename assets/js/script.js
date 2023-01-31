function create5DayCard(dataArray, index) {
    var cardBody = $("<div>").addClass("card-body");
    var dataDate = $("<h5>").text(dataArray[0]);
    var dataTemp = $("<p>").text(`Temperature: ${dataArray[1]}`);
    var dataWind = $("<p>").text(`Wind Speed: ${dataArray[2]}`);
    var dataHumidity = $("<p>").text(`Humidity: ${dataArray[3]}`);
    var dataIcon = $("<img>").attr("src", dataArray[4]);

    cardBody.append(dataDate,dataIcon, dataTemp, dataWind, dataHumidity);
    var card = $("<div>").addClass("card");
    var col = $("<div>").addClass("col");
    card.append(cardBody);
    col.append(card);
    $("#5dayCards").append(col);

}


function generate5DayForecast(object) {
    var forecastArray = [];
    var objectElement = 4;

    for (var i = 0; i < 5; i++) {
        var dataSet = [];
        dataSet.push(object.list[objectElement].dt_txt);
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

$("#search-button").on("click", function (event) {
    event.preventDefault();
    var search = $("#search-input").val();
    var apiKey = "a32c896a5efe5c837799909bac3a9141";
    var queryURL1 = (`https://api.openweathermap.org/geo/1.0/direct?limit=5&q=${search}&appid=${apiKey}`);

    $.ajax({
        url: queryURL1,
        method: "GET"

    }).then(function (geoResponse) {

        var queryURL2 = (`https://api.openweathermap.org/data/2.5/forecast?lat=${geoResponse[0].lat}&lon=${geoResponse[0].lon}&appid=${apiKey}`);
        $.ajax({
            url: queryURL2,
            method: "GET"
        }).then(function (response) {
                generate5DayForecast(response);
            });

    });
});