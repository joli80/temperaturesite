$(document).ready(function () {
    getFeed(firstLoad);
    getHistory();
    setInterval(getTemperature, 300000);
    //setInterval(getHistory, 900000);
});

function firstLoad(feed) {
    updateTemperature(feed);
}

function getFeed(callback) {
    $.getJSON("http://www.pachube.com/api/feeds/3128.json?callback=?&key=5b25f51c296ad522311b63d48f3ac89b0583e4e833d5488a2ad6822158061eb0&timezone=Stockholm",
	function (data) {
	    callback(data);
	});
}

var img;
var imguri;
function getHistory(resolution) {

    if (resolution == undefined)
        resolution = 2;

    var tempuri = 'http://www.pachube.com/feeds/3128/datastreams/0/history.png?w=500&h=300&g=true&b=true&r=' + resolution;

    if (tempuri == imguri)
        return;

    if (img == null) {
        img = new Image();
    } else {
        $(img).remove();
        $('#loader').addClass('loading');
    }

    $(img)
	.load(function () {
	    $(this).hide();
	    $('#loader')
		.removeClass('loading')
		.append(this);
	    $(this).fadeIn();
	})
	.error(function () {
	    // notify the user that the image could not be loaded
	})
	.attr('src', tempuri);

    imguri = tempuri;

}

function updateTemperature(feed) {
    var temperature = Number(feed.datastreams[0].values[0].value);
    $("#current_temp").text(temperature.toFixed(1).replace(".", ",") + " " + feed.datastreams[0].unit.symbol);
    var date = parseDateString(feed.updated);
    $("#current_time").text("uppdaterad " + checkTime(date.getHours()) + ":" + checkTime(date.getMinutes()));
}

function parseDateString(dateString) {
    return new Date( dateString.substring(0,4), dateString.substring(5,7), dateString.substring(8,10), dateString.substring(11,13), dateString.substring(14,16), dateString.substring(17,19) );	
    //return new Date(Date.parse(dateString));	
    //return new Date(Date.UTC(dateString.substring(0, 4), dateString.substring(5, 7), dateString.substring(8, 10), dateString.substring(11, 13), dateString.substring(14, 16), dateString.substring(17, 19)));
}

function getTemperature() {
    getFeed(updateTemperature);
}

function checkTime(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

function getMap() {
    getFeed(updateMap);
}

function updateMap(feed) {
    var map = new GMap2(document.getElementById("map_canvas"));
    var point = new GLatLng(feed.location.lat, feed.location.lon);
    map.addMapType(G_PHYSICAL_MAP);
    map.setCenter(point, 10, G_PHYSICAL_MAP);
    map.addOverlay(new GMarker(point));
}

