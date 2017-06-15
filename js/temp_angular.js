// jsfiddle: http://jsfiddle.net/g8gzh96n/
//
// Two y-axis and formatting the series dataLable:
// http://jsfiddle.net/highcharts/EjRLw/

var nowChart; // global chart variable
var DSToffset = 0; // offset for DST

// Get data from server in JSON format (query time series when sensor was outside).
function getAngularData(){
         var myTemp2;
         console.log('/temperature_angular_query.json');
         $.getJSON('/temperature_angular_query.json', function(data){
            myTemp2 = data.temps[0][0].farenheit;
         });
         nowChart.series[0].setData([myTemp2]);
   };

   // Configure the plot
$(document).ready(function() {
     var myTemp;
     var myTime;
     var myHumidity;
     console.log('/temperature_angular_query.json');
     
$.ajax({
  url: '/temperature_angular_query.json',
  dataType: 'json',
  async: false,
  success: function(data) {
    myTemp = data.temps[0][0].farenheit;
    myHumidity = data.temps[0][0].humidity;
    myTime = new Date(data.temps[0][0].unix_time);
  }
});

     nowChart = new Highcharts.Chart({
        chart: {
            renderTo: 'angular_display_box',
            type: 'gauge',
            plotBackgroundColor: null,
            plotBackgroundImage: null,
            plotBorderWidth: 0,
            plotShadow: false,
            // events: {load: getAngularData()},
        },
        credits: {
            enabled: false
        },
        title: {
            text: 'Climate in Room 118 (Gerty Drive)<br>'+myTemp+'\u00B0F  '+myHumidity+'% humidity',
            style: {"fontSize": "26px", "font-weight": "bold", "font-variant": "small-caps"},
        },
        subtitle: {
            text: 'Last updated: '+myTime
        },
        pane: {
            startAngle: -150,
            endAngle: 150,
            size: "85%",
        },
        plotOptions: {
            gauge: {
                dial: {
                    borderWidth: 1,
                    baseWidth: 3,
                    topWidth: 2,
                }
            }
        },
        yAxis: [{
            min: 40,
            max: 100,

            minorTickInterval: 'auto',
            minorTickLength: 5,
            lineColor: '#444',
            minorTickColor: '#444',

            tickLength: 5,
            tickColor: '#444',
            lineWidth: 2,
            endOnTick: false,
            offset: -10,
            labels: {
                rotation: 'auto',
                style: {"fontSize": "14px", "font-weight": "bold"},
                distance: -20,
            },
            title: {
                text: '\u00B0F',
                style: {"fontSize": "22px", "font-weight": "bold"},
                y: 5,
            },
            plotBands: [{
                color: {
                    radialGradient: { cx: 1, cy: 0, r: 1 },
                    stops: [
                        [0, 'rgb(255, 255, 255)'],
                        [0.9, 'rgb(230, 230, 255)'],
                        [1, 'rgb(175, 175, 255)']
                    ]
                },
                from: 40,
                to: 70
            },
            {
                color: {
                    radialGradient: { cx: .5, cy: 1, r: 1 },
                    stops: [
                        [0, 'rgb(255, 0, 0)'],
                        [0.9, 'rgb(255, 230, 230)'],
                        [1, 'rgb(255, 255, 255)']
                    ]
                },
                from: 70,
                to: 100
            }
            ],
        },{
            min: 4.44,
            max: 37.7778,

            minorTickInterval: 'auto',
            minorTickLength: 5,

            tickLength: 5,
            lineWidth: 2,
            
            minorTickPosition: 'outside',
            lineColor: '#777',
            minorTickColor: '#777',
            tickPosition: 'outside',

            tickColor: '#777',
            endOnTick: false,
            offset: 0,
            labels: {
                distance: 12,
                rotation: 'auto',
                style: {"fontSize": "14px", "font-weight": "bold"}
            },
            title: {
                text: '\u00B0C',
                style: {"fontSize": "22px", "font-weight": "bold"},
                y: -70,
            },

        }],

        series: [{
            name: 'Temperature',
            data: [myTemp],
            tooltip: {
                valueSuffix: ' \u00B0F'
            },
            dataLabels: {
                formatter: function () {
                    var f = this.y,
                        c = Math.round((f-32.0) * (5.0/9.0),1);
                    return '<b>'+ f + '\u00B0 F</b><br/>' +
                        '<b>' + c + '\u00B0 C</b>';
                },
            }
        }]

}, function (chart) { // on complete

    chart.renderer.label('<table border=0 width=50px> <tr><th colspan=2>NOTES</th></tr> <tr><td>14-Apr-2017</td><td>swapped out d18b20 for AM2302 sensor (includes humidity now)</td></tr> <tr><td>27-Mar-2017</td><td>Moved back to my office</td></tr> <tr><td>10-Mar-2017</td><td>Temporarily located in a different office</td></tr> <tr><td>03-Mar-2017</td><td>Personal space heater added</td></tr> </table>', 10, 100, 'rect', 0,0, true)
        .attr({
            fill: "#FFFFFF"
        })
        .css({
            color: '#4572A7',
            fontSize: '9px'
        })
        .add();

});
   // console.log('nowChart:'+nowChart);
   });
