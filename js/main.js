//name space context
var app = {};
app.utils = {};

app.Weather = function (callback) {


   //twitter private module
   var weather =  {

      data: undefined,

      search: {
         url: "http://api.openweathermap.org/data/2.5/forecast?mode=json&appid=bd82977b86bf27fb59a04b61b657fb6f&callback="+callback
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

   var i, target, el, refLI;

   target = document.getElementById("output");
   refLI = document.getElementById("insertRef");

   i = this.data.list.length-1;
   for(; i>0; i--) {

      el = document.createElement("li");
      el.className = "tweet";
      el.innerHTML= this.template(this.data.list[i]);

      //insert or append
      target.insertBefore(el, target.children[0] || null);


   }

};


weather.template = function(obj) {

   var template = [];

   template.push(
      "<div>",
      obj.dt_txt,
      "</div>"
   );

   return template.join("");

};

weather.go({
   city:'London',
   country:'uk'
});







