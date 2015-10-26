//name space context
var app = {};
app.utils = {};


app.utils.urlencode = function(str) {
   return escape(str).
      replace(/\+/g, '%2B').
      replace(/%20/g, '+').
      replace(/\*/g, '%2A').
      replace(/\//g, '%2F').
      replace(/@/g, '%40').
      replace(/#/g, '%23');
}

var weather = new Weather("weather.callback");


weather.callback = function(data) {
   this.setData(data);
   this.render();
};


weather.render = function() {

   var i, target, el, refLI, curDate='', dayData = [];

   target = document.getElementById("weather");
   refLI = document.getElementById("insertRef");

   target.innerHTML = "";

   curDate = this.data.list[0].dt_txt.slice(0,10);

   for(i = 0; i<=this.data.list.length-1; i++) {

      if(curDate === this.data.list[i].dt_txt.slice(0,10)) {
         dayData.push(this.data.list[i]);
      }
      else {
         addDay.call(this);
         dayData.push(this.data.list[i]);
      }

   }
   addDay.call(this);


   function addDay() {
      el = document.createElement("li");
      el.className = "li-container";
      el.innerHTML = this.template(dayData);
      target.insertBefore(el, null); // target.children[0] || null);

      dayData = [];
      curDate = (this.data.list[i]) ? this.data.list[i].dt_txt.slice(0,10) : '';

   }


};


weather.template = function(dayData) {

   var template = [];
   var week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

   var temperature, speed;

   if(this.units === 'metric') {
      temperature = '&#8451;';
      speed = 'Kph';
   }
   else if(this.units === 'imperial') {
      temperature = '&#8457;';
      speed = 'Mph';
   }

   template.push(
      '<div class="day">',
      '<div class="date">',
      getDate(dayData[0]),
      getDaySummary(dayData),
      '</div>',
      '<div class="date-data">',
      getTimes(dayData),
      '</div>',
      '</div>'
   );

   return template.join("");


   function getDaySummary(day) {

      var max = 0, min = 9999;

      for (var i=0; i<=day.length-1; i++ ) {
         min = Math.min(min, day[i].main.temp_min)
         max = Math.max(max, day[i].main.temp_max)
      }

      return '<em class="min">Min: ' + min.toString() + temperature + '</em>' +
         '<em>&ndash;</em>'+
         '<em class="max">Max: ' + max.toString() + temperature+'</em>'

   }



   function getDate(obj) {
      var dayOfWeek = new Date(obj.dt_txt).getDay();

      return '<p class="day-name">' + week[dayOfWeek] + '</p>';

   }


   function getTimes(times) {

      var rtnVal = [];

      for (var i=0; i<=times.length-1; i++) {
         rtnVal.push(
            '<div class="data-time">' +
               '<p class="time">'+times[i].dt_txt.slice(11,16) + '</p>',
               '<p class="temp">'+getTemp(times[i]) + '</p>',
               '<p class="weather">'+getWeather(times[i]) + '</p>',
               '<p class="clouds">'+getClouds(times[i]) + '</p>',
               '<p class="wind">'+getWind(times[i]) + '</p>',
               '<p class="rain">'+getRain(times[i]) + '</p>',
            '</div>'
         );
      }

      return rtnVal.join('');
   }

   function getTemp(obj) {
      return '<em class="min">' + obj.main.temp_min.toString() + temperature + '</em>' +
            '<em class="current">' + obj.main.temp.toString() + temperature + '</em>' +
         '<em class="max">' + obj.main.temp_max.toString() + temperature + '</em>'
   }


   function getWeather(obj) {
      return '<em class="desc">' + obj.weather[0].description + '</em>';
   }

   function getClouds(obj) {
      var value = '';
      if(obj.clouds.all) {
         value =  '<em class="clouds">Clouds: ' + obj.clouds.all.toString() + '%</em>'
      }
      return value;
   }

   function getWind(obj) {
      return value =  '<em class="wind">Wind: ' + obj.wind.speed.toString() + speed + '</em>'
   }

   function getRain(obj) {
      var value='';
      if(obj.rain && obj.rain['3h']) {
         value = '<em class="rain">3h Rain: ' + obj.rain['3h'] + '</em>'
      }
      return value;
   }



};


function setupEventListeners() {
   var radios = document.getElementsByName('units');

   for (var i = 0, length = radios.length; i < length; i++) {
      radios[i].onclick = doQuery
   }

}



function doQuery() {
   var units;
   var radios = document.getElementsByName('units');

   for (var i = 0, length = radios.length; i < length; i++) {
      if (radios[i].checked) {
         units = radios[i].value;
         break;
      }
   }

   weather.go({
      units: units,
      city:'London',
      country:'uk'
   });

}

setupEventListeners();
doQuery();



