//CHANGE TEAM NAMES
function changeTeam() {
  const teamName = document.getElementById("team-field").value;
  document.getElementById("team-select").innerHTML = teamName;
}

//Donut Chart
var Dial = function (container) {
  this.container = container;
  this.size = this.container.dataset.size;
  this.strokeWidth = this.size / 8;
  this.radius = this.size / 2 - this.strokeWidth / 2;
  this.value = this.container.dataset.value;
  this.direction = this.container.dataset.arrow;
  this.create();
};

Dial.prototype.create = function () {
  this.createSvg();
  this.createDefs();
  this.createSlice();
  this.createOverlay();
  this.createText();
  this.container.appendChild(this.svg);
};

Dial.prototype.createSvg = function () {
  var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", this.size + "px");
  svg.setAttribute("height", this.size + "px");
  this.svg = svg;
};

Dial.prototype.createDefs = function () {
  var defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
  var linearGradient = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "linearGradient"
  );

  linearGradient.setAttribute("id", "gradient");
  var stop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
  stop1.setAttribute("stop-color", "#1D5470");
  stop1.setAttribute("offset", "0%");
  linearGradient.appendChild(stop1);
  var stop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
  stop2.setAttribute("stop-color", "#49ADB2");
  stop2.setAttribute("offset", "100%");
  linearGradient.appendChild(stop2);
  var linearGradientBackground = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "linearGradient"
  );
  linearGradientBackground.setAttribute("id", "gradient-background");
  var stop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
  stop1.setAttribute("stop-color", "rgba(0, 0, 0, 0.2)");
  stop1.setAttribute("offset", "0%");
  linearGradientBackground.appendChild(stop1);
  var stop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
  stop2.setAttribute("stop-color", "rgba(0, 0, 0, 0.05)");
  stop2.setAttribute("offset", "100%");
  linearGradientBackground.appendChild(stop2);

  defs.appendChild(linearGradient);
  defs.appendChild(linearGradientBackground);
  this.svg.appendChild(defs);
  this.defs = defs;
};

Dial.prototype.createSlice = function () {
  var slice = document.createElementNS("http://www.w3.org/2000/svg", "path");
  slice.setAttribute("fill", "none");
  slice.setAttribute("stroke", "url(#gradient)");
  slice.setAttribute("stroke-width", this.strokeWidth);
  slice.setAttribute(
    "transform",
    "translate(" + this.strokeWidth / 2 + "," + this.strokeWidth / 2 + ")"
  );
  slice.setAttribute("class", "animate-draw");
  this.svg.appendChild(slice);
  this.slice = slice;
};

Dial.prototype.createOverlay = function () {
  var r = this.size - this.size / 2 - this.strokeWidth / 2;

  var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  circle.setAttribute("cx", this.size / 2);
  circle.setAttribute("cy", this.size / 2);
  circle.setAttribute("r", r);
  circle.setAttribute("fill", "none");
  this.svg.appendChild(circle);
  this.overlay = circle;
};

Dial.prototype.createText = function () {
  var fontSize = this.size / 3.5;
  var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
  text.setAttribute("x", this.size / 2 + fontSize / 7.5);
  text.setAttribute("y", this.size / 2 + fontSize / 4);
  text.setAttribute("font-family", "Century Gothic, Lato");
  text.setAttribute("font-size", fontSize);
  text.setAttribute("fill", "#606c76");
  text.setAttribute("text-anchor", "middle");
  var tspanSize = fontSize / 3;
  text.innerHTML =
    0 +
    '<tspan font-size="' +
    tspanSize +
    '" dy="' +
    -tspanSize * 1.2 +
    '">%</tspan>';
  this.svg.appendChild(text);
  this.text = text;
};

Dial.prototype.createArrow = function () {
  var arrowSize = this.size / 10;
  var arrowYOffset, m;
  if (this.direction === "up") {
    arrowYOffset = arrowSize / 2;
    m = -1;
  } else if (this.direction === "down") {
    arrowYOffset = 0;
    m = 1;
  }
  var arrowPosX = this.size / 2 - arrowSize / 2;
  var arrowPosY = this.size - this.size / 3 + arrowYOffset;
  var arrowDOffset = m * (arrowSize / 1.5);
  var arrow = document.createElementNS("http://www.w3.org/2000/svg", "path");
  arrow.setAttribute(
    "d",
    "M 0 0 " + arrowSize + " 0 " + arrowSize / 2 + " " + arrowDOffset + " 0 0 Z"
  );
  arrow.setAttribute("fill", "#97F8F0");
  arrow.setAttribute("opacity", "0.6");
  arrow.setAttribute(
    "transform",
    "translate(" + arrowPosX + "," + arrowPosY + ")"
  );
  this.svg.appendChild(arrow);
  this.arrow = arrow;
};

Dial.prototype.animateStart = function () {
  var v = 0;
  var self = this;
  var intervalOne = setInterval(function () {
    var p = +(v / self.value).toFixed(2);
    var a = p < 0.95 ? 2 - 2 * p : 0.05;
    v += a;
    // Stop
    if (v >= +self.value) {
      v = self.value;
      clearInterval(intervalOne);
    }
    self.setValue(v);
  }, 10);
};

Dial.prototype.animateReset = function () {
  this.setValue(0);
};

Dial.prototype.polarToCartesian = function (
  centerX,
  centerY,
  radius,
  angleInDegrees
) {
  var angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
};

Dial.prototype.describeArc = function (x, y, radius, startAngle, endAngle) {
  var start = this.polarToCartesian(x, y, radius, endAngle);
  var end = this.polarToCartesian(x, y, radius, startAngle);
  var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  var d = [
    "M",
    start.x,
    start.y,
    "A",
    radius,
    radius,
    0,
    largeArcFlag,
    0,
    end.x,
    end.y,
  ].join(" ");
  return d;
};

Dial.prototype.setValue = function (value) {
  var c = (value / 100) * 360;

  if (c === 360) c = 359.99;

  var xy = this.size / 2 - this.strokeWidth / 2;
  var d = this.describeArc(xy, xy, xy, 180, 180 + c);
  this.slice.setAttribute("d", d);

  var tspanSize = this.size / 3.5 / 3;

  this.text.innerHTML =
    Math.floor(value) +
    '<tspan font-size="' +
    tspanSize +
    '" dy="' +
    -tspanSize * 1.2 +
    '">%</tspan>';
};

//
// Usage
//

var containers = document.getElementsByClassName("chart");
var dial = new Dial(containers[0]);
var dial2 = new Dial(containers[1]);
dial.animateStart();
dial2.animateStart();

//
// LINE CHART
//
var ctx = document.getElementById("myChart").getContext("2d");
var myChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: [
      "Jan 1",
      "Jan 8",
      "Jan 15",
      "Jan 22",
      "Jan 29",
      "Feb 5",
      "Feb 12",
      "Feb 19",
    ],
    datasets: [
      {
        label: "All teams:",
        labelColor: "#49adb2",
        data: [90, 100, 90, 80, 70, 80, 90, 90],
        borderColor: "#1d5470",
        borderWidth: 2,
        fill: false,
        backgroundColor: "transparent",
        pointBorderColor: "#49adb2",
        pointBackgroundColor: "#49adb2",
        pointRadius: 5,
        pointHoverRadius: 7,
        pointHitRadius: 30,
        pointBorderWidth: 1,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: true,
    legend: {
      display: false,
      labels: {
        fontFamily: "'Open Sans', sans-serif",
      },
    },
    scales: {
      yAxes: [
        {
          ticks: {
            fontFamily: "'Open Sans', sans-serif",
            fontSize: 14,
            fontWeight: 500,
            fontColor: "#606c76",
            beginAtZero: true,
            stepSize: 20,
            min: 0,
            max: this.max,
            callback: function (value) {
              return ((value / this.max) * 100).toFixed(0) + "%";
            },
          },
        },
      ],
      xAxes: [
        {
          ticks: {
            fontFamily: "'Open Sans', sans-serif",
            fontSize: 14,
            fontWeight: 500,
            fontColor: "#606c76",
          },
        },
      ],
    },
  },
});

//
// GAUGE CHART
//
const gaugeElement = document.querySelector(".gauge");

function setGaugeValue(gauge, value) {
  if (value < 0 || value > 5) {
    return;
  }

  gauge.querySelector(".gauge__fill").style.transform = `rotate(${
    value / 2
  }turn)`;
  gauge.querySelector(".gauge__cover").textContent = `${Math.round(value * 5)}`;
}

// Feed actual % fill here
setGaugeValue(gaugeElement, 0.6);
