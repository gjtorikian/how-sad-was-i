const ChartjsNode = require('chartjs-node');

var fs = require('fs');

var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const config = {
    type: 'line',
    data: {
        labels: MONTHS,
        datasets: [{
            label: "2016",
            fill: false,
            backgroundColor: "rgb(54, 162, 235)",
            borderColor: "rgb(54, 162, 235)",
            data: [],
        }, {
            label: "2017",
            fill: false,
            backgroundColor: "rgb(255, 99, 132)",
            borderColor: "rgb(255, 99, 13)",
            data: [],
        }]
    },
    options: {
        responsive: true,
        title:{
            display:true,
            text:''
        },
        legend: {
            labels: {
                fontColor: "black"
            }
        },
        scales: {
            xAxes: [{
                display: true,
                ticks: {
                  fontColor: "black"
                }
            }],
            yAxes: [{
                display: true,
            }]
        },
        plugins: { }
    }
};

const WIDTH = 800;
const HEIGHT = 300;

var beforeDraw = function (chart, easing) {
  var helpers = ChartjsNode.helpers;
  var ctx = chart.chart.ctx;
  var chartArea = chart.chartArea;

  ctx.save();
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.restore();
};

const PERSONALITIES = ["Openness", "Conscientiousness", "Extraversion", "Agreeableness", "Neuroticism"]

var twenty_sixteen_points = [[], [], [], [], []];
var twenty_seventeen_points = [[], [], [], [], []];
for (var i = 1; i < 13; i++) {
  var twenty_sixteen_contents = fs.readFileSync("data/2016_" + i + ".json", "utf8");
  var twenty_sixteen_data = JSON.parse(twenty_sixteen_contents);
  var twenty_seventeen_contents = fs.readFileSync("data/2017_" + i + ".json", "utf8");
  var twenty_seventeen_data = JSON.parse(twenty_seventeen_contents);

  for (var j = 0; j < PERSONALITIES.length; j++) {
    twenty_sixteen_points[j].push(Math.round(twenty_sixteen_data.personality[j].percentile.toFixed(2) * 100));
    twenty_seventeen_points[j].push(Math.round(twenty_seventeen_data.personality[j].percentile.toFixed(2) * 100));
  }
}

var promiseArray = [];
PERSONALITIES.forEach(function(personality, i) {
  var chartConfig = JSON.parse(JSON.stringify(config));;
  chartConfig.data.datasets[0].data = twenty_sixteen_points[i];
  chartConfig.data.datasets[1].data = twenty_seventeen_points[i];
  chartConfig.options.title.text = personality;
  chartConfig.options.plugins.beforeDraw = beforeDraw;

  var chartNode = new ChartjsNode(WIDTH, HEIGHT);
  chartNode.drawChart(chartConfig)
  .then(() => {
    chartNode.writeImageToFile('image/png', './images/' + personality + '.png');
  });
});
