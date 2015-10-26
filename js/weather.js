var Weather  = (function() {

   var Weather = function (callback, units) {


      //private module
      var weather = {

         data: undefined,

         search: {
            url: "http://api.openweathermap.org/data/2.5/forecast?mode=json&appid=bd82977b86bf27fb59a04b61b657fb6f&callback=" + callback
         },

         setData: function (data) {
            this.data = data;
         },

         go: function (config) {

            var scriptBlock, search, docHeader, i, query, scope, args;

            if (config && config.city && config.country) {

               query = [];

               this.units = app.utils.urlencode(config.units || 'metric')


               query = app.utils.urlencode(config.city) + ',' +
               app.utils.urlencode(config.country);

               scriptBlock = document.createElement('script');
               scriptBlock.language = 'javascript';
               scriptBlock.type = 'text/javascript';
               search = this.search;

               scriptBlock.src = search.url +
               '&q=' + query +
               '&units=' + app.utils.urlencode(this.units) +
               '&rand=' + Math.floor(Math.random() * 10000000);

               docHeader = document.getElementsByTagName('head')[0];
               docHeader.appendChild(scriptBlock);

               scope = this;

               if (parseInt(this.search.timeOut, 10) > 0) {
                  setTimeout(function () {
                     scope.go.apply(scope, args);
                  }, parseInt(this.search.timeOut, 10));

               }

            }
            else {
               throw new Error("config : {city:, country: } required");

            }

         }

      };

      return weather;
   }

   return Weather

})()
