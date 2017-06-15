// example of asynchronous calls with multiple series: 
// http://jsfiddle.net/gh/get/jquery/3.1.1/highslide-software/highcharts.com/tree/master/samples/stock/demo/compare/

var waterColor = '#40a4df';
var darkWaterColor = '#1b81c3';
var allChart; // global chart variable
// Get data from server in JSON format (query time series when sensor was outside).
function getData(){
         var seriesId = 1;
         console.log('/temperature_query.json');
         $.getJSON('/temperature_query.json', function(data){
            var id = data.temps[0][0].id;
            var series = {
               id: seriesId,
               name: id,
               data: []
               };
            var i = 0;
            // Iterate JSON data series and add to plot
           while (data.temps[0][i])
            {
               var nextId = data.temps[0][i].id;
               if (nextId != id) {
                  allChart.addSeries(series);
                  id = nextId;
                  seriesId++;
                  series = {
                     id: seriesId,
                     name: id,
                     data: []
                  };
               }
               series.data.push([data.temps[0][i].unix_time, data.temps[0][i].farenheit]);
               i++;
            }
            allChart.addSeries(series);
         });
}

function getSyncData(){
        var mySeries = [];
        var seriesId = 1;
        console.log('/temperature_query.json');

        $.ajax({
          url: '/temperature_query.json',
          dataType: 'json',
          async: false,
          success: function(data) {
            var id = data.temps[0][0].id;
            var HumidSeries = {
               id: 0,
               name: 'Humidity',
               type: 'area',
               color: waterColor,
               zIndex: -99,
               tooltip: {
                   valueDecimals: 2
               },
               fillColor: {
                   linearGradient: {
                       x1: 0,
                       y1: 0,
                       x2: 0,
                       y2: 1
                   },
                   stops: [
                       [0, waterColor],
                       // [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                       [1, '#ffffff']
                   ]
               },
               yAxis: 1,
               data: []
               };
            var TempSeries = {
               id: seriesId,
               color: Highcharts.getOptions().colors[seriesId],
               name: id,
               data: []
               };
            var i = 0;
            // Iterate JSON data series and add to plot
           while (data.temps[0][i])
            {
               var nextId = data.temps[0][i].id;
               if (nextId != id) {
                  mySeries.push(TempSeries);
                  id = nextId;
                  seriesId++;
                  TempSeries = {
                     id: seriesId,
                     name: id,
                     data: []
                  };
               }
               TempSeries.data.push([data.temps[0][i].unix_time, data.temps[0][i].farenheit]);
               HumidSeries.data.push([data.temps[0][i].unix_time, data.temps[0][i].humidity]);
               i++;
            }
            mySeries.push(TempSeries);
            mySeries.push(HumidSeries);
          }
        });
        return mySeries;
}

   // Configure the plot
   $(document).ready(function() {
var allSeries = getSyncData();

// // Add flags for important milestones. This requires Highstock.
// if (Highcharts.seriesTypes.flags) {
//     allSeries.push({
//         type: 'flags',
//         name: 'Heater',
//         color: '#333333',
//         shape: 'squarepin',
//         y: -80,
//         data: [
//             { x: Date.UTC(2017, 3, 3), text: 'Added my own heater', title: 'Heater added', shape: 'squarepin' }
//         ],
//         showInLegend: false
//     });
// }

     Date.prototype.stdTimezoneOffset = function() {
         var jan = new Date(this.getFullYear(), 0, 1);
         var jul = new Date(this.getFullYear(), 6, 1);
         return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
     }

     Date.prototype.dst = function() {
         return this.getTimezoneOffset() < this.stdTimezoneOffset();
     }
     
var today = new Date();
var offset = 0;
if (today.dst()) { offset = -1*60; }

Highcharts.setOptions({
    global: {
        timezoneOffset: offset
    }
});

allChart = new Highcharts.stockChart({
   chart: {
         renderTo: 'all_display_box',
         // events: {load: getData()},
         zoomType: 'x',
         spacingRight: 50
         },
  // title: { text: 'Plot of temperatures'},
  // subtitle: {
  //         // zoom is not working at this point :(
  //         text: 'Click and drag in the plot area to zoom in',
  //         align: 'right',
  //        },
   rangeSelector: {
            selected: 1,
            buttons: [
            {
	            type: 'day',
	            count: 1,
	            text: '1 day'
            }, {
	            type: 'week',
	            count: 1,
	            text: '1 week'
            }, {
	            type: 'month',
	            count: 1,
	            text: '1 month'
            }, {
	            type: 'year',
	            count: 1,
	            text: '1 year'
            }, {
	            type: 'all',
	            text: 'All'
            }],
            buttonTheme: { // styles for the buttons
                stroke: 'none',
                width: 55,
                'stroke-width': 0,
                r: 8,
            },
       },
        tooltip: {
            formatter: function () {
                var s = '<b>' + Highcharts.dateFormat('%d %b %y, %H:%M:%S', this.x) + '</b>';

                $.each(this.points, function () {
                    // s += '<br/><span style="color:' + this.series.color + '">' + this.series.name + '</span>: ';

                    if (this.series.name === 'Humidity') {
                      s += '<br/><span style="color:' + darkWaterColor + '">Humidity: ' + this.y + '%</span>';
                    } else {
                      s += '<br/><span style="color:black">Temp: ' + this.y + '\u00B0F</span>';
                    }
                });

                return s;
            }
        },
        xAxis: {
            labels: {
                enabled: true
            }
        },
    yAxis: [{ // Primary yAxis
            labels: {
                x: 25,
                formatter: function () {
                    return this.value + '\u00B0F';
                }
            },
            title: {
                x: 20,
                text: 'Temperature',
                style: { "font-weight": "bold" }
            },
            gridLineColor: 'darkgrey',
            min: 60,
            max: 90,
            gridZIndex: 4,
            startOnTick: false,
            endOnTick: false,
            opposite: true
    }, { // Secondary yAxis
            labels: {
                formatter: function () {
                    return '<span style="color:' + darkWaterColor  + '">' + this.value + '%</span>';
                }
            },
            title: {
                text: 'Relative Humidity',
                style: { "font-weight": "bold" }
            },
            gridLineColor: 'white',
            max: 70,
            min: 15,
            startOnTick: false,
            endOnTick: false,
            opposite: false
    }],


   series: allSeries,
   })
});
