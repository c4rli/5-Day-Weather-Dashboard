function getSearches() {
    if (localStorage.getItem("searchArray") == '' || localStorage.getItem("searchArray") === null) {
        searchArray = [];
    } else {
        searchArray = JSON.parse(localStorage.getItem("searchArray"));
    }
    
    return searchArray;
}

function addSearch(search){
    var searchArray = getSearches()
    if (searchArray.length >= 10 ){
        searchArray.pop();
    }
    searchArray.unshift(search);
    console.log(searchArray);
    localStorage.setItem("searchArray", JSON.stringify(searchArray));
}

function showHistory(){
    var searchArray = getSearches()
    $("#history").empty();
    
    if(searchArray.length > 0){
    searchArray.forEach(function (search, index){
        var searchButton = $("<button>")
        .addClass("btn btn-outline-secondary mb-2 search")
        .text(search)
        .attr("data-index", index);
        $("#history").append(searchButton);
        })

        $("#historyContainer").show();
    }
    else {
        $("#historyContainer").hide();
    }
}

function clearHistory(){
    localStorage.removeItem("searchArray");
    showHistory();
}

function create5DayCard(dataSet, index) {
    var cardBody = $("<div>").addClass("card-body");
    console.log(moment(dataSet.dateTime, "X").format("DD MM YYYY"));
    var dataDate = $("<h5>").text(moment(dataSet.dateTime, "X").format("ddd Do MMM"));
    var dataTemp = $("<p>").html(`<b>Temperature:</b><br>${dataSet.temperature}°c`);
    var dataWind = $("<p>").html(`<b>Wind Speed:</b><br> ${dataSet.windSpeed}mph`);
    var dataHumidity = $("<p>").html(`<b>Humidity:</b><br> ${dataSet.humidity}%`);
    var dataIcon = $("<img>").attr("src", dataSet.iconURL);

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
        var dataSet = {
            dateTime: object.list[objectElement].dt,
            temperature: object.list[objectElement].main.temp,
            windSpeed: object.list[objectElement].wind.speed,
            humidity: object.list[objectElement].main.humidity,
            iconURL: (`http://openweathermap.org/img/wn/${object.list[objectElement].weather[0].icon}.png`)
        };
        forecastArray.push(dataSet);
        objectElement += 8;
    }

    forecastArray.forEach(function (dataSet, index) {
        create5DayCard(dataSet, index);
    });
}

function generateTodaysForecast(object) {
    console.log(object)
    var dataSet = {
        location: {
            city: object.name,
            countryCode: object.sys.country
        },
        dateTime: object.dt,
        temperature: object.main.temp,
        windSpeed: object.wind.speed,
        humidity: object.main.humidity,
        iconURL: object.weather[0].icon
    }

    $("#todayCard").empty();
    $("#cityName").text(`${(dataSet.location.city)}, ${(dataSet.location.countryCode)}`); 
    
    var cardTitle = $("<h2>").text(`${moment(dataSet.dateTime, "X").format("dddd Do MMMM YYYY")}`);
    var dataTemp = $("<p>").html(`<b>Temperature:</b> ${dataSet.temperature}°c`);
    var dataWind = $("<p>").html(`<b>Windspeed:</b> ${dataSet.windSpeed}mph`);
    var dataHumidity = $("<p>").html(`<b>Humidity:</b> ${dataSet.humidity}%`);

    $("#todayCard").append(cardTitle, dataTemp, dataWind, dataHumidity)
        .css("background-image",`url("http://openweathermap.org/img/wn/${dataSet.iconURL}@4x.png")`);
    
}

$(document).on("click",".search", function (event) {
    event.preventDefault();
    var eventEl = $(event.target);
    
    if(eventEl.attr("id") == "search-button"){
         var search = $("#search-input").val();
         var newSearch = true;
    }
    else {
        var searchArray = getSearches();
        var search = searchArray[eventEl.attr("data-index")];
        var newSearch = false;
    }
    var apiKey = "a32c896a5efe5c837799909bac3a9141";
    var queryURL1 = (`https://api.openweathermap.org/geo/1.0/direct?limit=5&q=${search}&appid=${apiKey}`);
    
    $.ajax({
        url: queryURL1,
        method: "GET",
        
    }).then(function (geoResponse) {
        var queryToday = (`https://api.openweathermap.org/data/2.5/weather?lat=${geoResponse[0].lat}&lon=${geoResponse[0].lon}&appid=${apiKey}&units=metric`);
        $.ajax({
            url: queryToday,
            method: "GET"
        }).then(function (response) {
            generateTodaysForecast(response);
            if (newSearch){
            addSearch(response.name);
            showHistory();
            }
        });

        var query5Day = (`https://api.openweathermap.org/data/2.5/forecast?lat=${geoResponse[0].lat}&lon=${geoResponse[0].lon}&appid=${apiKey}&units=metric`);
        $.ajax({
            url: query5Day,
            method: "GET"
        }).then(function (response) {
            generate5DayForecast(response); 
            $("#searchResult").removeClass("hide");
        });

    }).fail(function(){
        alert(search + " Not found");
    });
});

showHistory();


