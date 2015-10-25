//name space context
var app = {};
app.utils = {};

app.Weather = function (callback) {


   //twitter private module
   var weather =  {

      data: undefined,

      search: {
         url: "http://api.openweathermap.org/data/2.5/forecast?units=metric&mode=json&appid=bd82977b86bf27fb59a04b61b657fb6f&callback="+callback
      },

      setData : function(data) {
         this.data = data;
      },

      go: function(config) {

         var scriptBlock, search, docHeader, i, query, scope, args;

         if(config && config.city && config.country)  {


            query = [];

            query = app.utils.urlencode(config.city) + ',' +
                     app.utils.urlencode(config.country);

            scriptBlock = document.createElement('script'),
               scriptBlock.language = 'javascript';
            scriptBlock.type = 'text/javascript';
            search = this.search;

            scriptBlock.src = search.url +
            '&q=' + query +
            '&rand=' + Math.floor(Math.random() * 10000000);

            docHeader = document.getElementsByTagName('head')[0];
            docHeader.appendChild(scriptBlock);


            scope = this;

            if(parseInt(this.search.timeOut, 10) > 0) {
               setTimeout(function() {
                  scope.go.apply(scope, args);
               }, parseInt(this.search.timeOut, 10));

            }


         }
         else {
            throw new Error("config : {city:, country: } required" );


         }


      }

   };


   //expose tweet search to the public
   return weather;
}



app.utils.urlencode = function(str) {
   return escape(str).
      replace(/\+/g, '%2B').
      replace(/%20/g, '+').
      replace(/\*/g, '%2A').
      replace(/\//g, '%2F').
      replace(/@/g, '%40').
      replace(/#/g, '%23');
}

Number.prototype.zpad = function(zs) {
   var numstr = this.toString();
   return parseInt(0,10).toFixed(zs - numstr.length).substr(2) + numstr;
}



app.utils.dateFormat = function(twDate) {

   var d = new Date(twDate),
      cdate = d.getDate(),
      cmonth = d.getMonth() + 1,
      cyear = d.getFullYear(),
      cmin = d.getMinutes(),
      chour = d.getHours(),
      csec  = d.getSeconds();

   return  cyear.toString() + "/" +
      cmonth.zpad(2) + "/" +
      cdate.zpad(2) + " " +
      chour.zpad(2) + ":" +
      cmin.zpad(2) + ":" +
      csec.zpad(2);

};



var weather = new app.Weather("weather.callback");


weather.callback = function(data) {
   this.setData(data);
   this.render();
};


weather.render = function() {

   var i, target, el, refLI, curDate='', dayData = [];

   target = document.getElementById("weather");
   refLI = document.getElementById("insertRef");

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

      return '<em class="min">Min: ' + min.toString() + '</em>' +
         '<em>&ndash;</em>'+
         '<em class="max">Max: ' + max.toString() + '</em>'

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
      return '<em class="min">' + obj.main.temp_min.toString() + '</em>' +
            '<em class="current">' + obj.main.temp.toString() + '</em>' +
         '<em class="max">' + obj.main.temp_max.toString() + '</em>'
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
      return value =  '<em class="wind">Wind: ' + obj.wind.speed.toString() + '%</em>'
   }

   function getRain(obj) {
      var value='';
      if(obj.rain['3h']) {
         value = '<em class="wind">3h Rain: ' + obj.rain['3h'] + '</em>'
      }
      return value;
   }



};

weather.go({
   city:'London',
   country:'uk'
});







