
$(document).ready(function() {
    $.ajax({
        type: "GET",
        url: "passportindexDB03-19.txt",
        dataType: "text",
        success: function(data) {processData(data);}
     });
});

function processData(allText) {
    
    var allTextLines = allText.split(/\r\n|\n/);
    var headers = allTextLines[0].split(',');
    var lines = [];
    for (var i=1; i<allTextLines.length; i++) {
        var data = allTextLines[i].split(',');
        if (data.length == headers.length) {

            var tarr = [];
            for (var j=0; j<headers.length; j++) {
                tarr.push(data[j]);
            }
            lines.push(tarr);
        }
    }
    
    var Passport="IL"
    function isPassport(value) {
        return (value[2] == Passport);   
    }
    
    var filtered = lines.filter(isPassport);
    drawMap(filtered);

}



function drawMap(rawData) {
    var data1=[];
        var data2=[];
        var data3=[];
        var data4=[];

    console.log(rawData);
        
    rawData.forEach(country => {
        
        switch (country[4]) {
            
            case "-1":                
                data1.push({"title": country[1],"id": country[3]})
                break;
            
            case "1":
                data2.push({"title": country[1],"id": country[3]})
                break;
            
            case "2":
                data3.push({"title": country[1],"id": country[3]})
                break;
            case "3":
                data4.push({"title": country[1],"id": country[3]})
                break;
            
            default:
            console.log("Counry");
                break;
        }


    });


console.log(data1);


    
// Themes begin
am4core.useTheme(am4themes_animated);
// Themes end

// Create map instance
var chart = am4core.create("chartdiv", am4maps.MapChart);

// Set map definition
chart.geodata = am4geodata_worldHigh;

// Set projection
chart.projection = new am4maps.projections.Mercator();

// Export
chart.exporting.menu = new am4core.ExportMenu();

// Zoom control
chart.zoomControl = new am4maps.ZoomControl();

var homeButton = new am4core.Button();
homeButton.events.on("hit", function(){
  chart.goHome();
});

homeButton.icon = new am4core.Sprite();
homeButton.padding(7, 5, 7, 5);
homeButton.width = 30;
homeButton.icon.path = "M16,8 L14,8 L14,16 L10,16 L10,10 L6,10 L6,16 L2,16 L2,8 L0,8 L8,0 L16,8 Z M16,8";
homeButton.marginBottom = 10;
homeButton.parent = chart.zoomControl;
homeButton.insertBefore(chart.zoomControl.plusButton);

// Center on the groups by default
chart.homeZoomLevel = 1.25;
chart.homeGeoPoint = { longitude: 0, latitude: 30 };

var groupData = [
  {
    "name": "Visa on arrival",
    "color": chart.colors.getIndex(1),
    "data": data2
  },
  {
    "name": "eTA is required",
    "color" : chart.colors.getIndex(3),
    "data": data3
  },
  {
    "name": "Visa-free travel",
    "color": am4core.color("green"),
    "data": data4
  },
  {
    "name": "Passport country",
    "color": am4core.color("black"),
    "data": data1
  }
];

// This array will be populated with country IDs to exclude from the world series
var excludedCountries = ["AQ"];

// Create a series for each group, and populate the above array
groupData.forEach(function(group) {
  var series = chart.series.push(new am4maps.MapPolygonSeries());
  series.name = group.name;
  series.useGeodata = true;
  var includedCountries = [];
  group.data.forEach(function(country){
    includedCountries.push(country.id);
    excludedCountries.push(country.id);
  });
  series.include = includedCountries;

  series.fill = am4core.color(group.color);
  
  // By creating a hover state and setting setStateOnChildren to true, when we
  // hover over the series itself, it will trigger the hover SpriteState of all
  // its countries (provided those countries have a hover SpriteState, too!).
  series.setStateOnChildren = true;
  var seriesHoverState = series.states.create("hover");  
  
  // Country shape properties & behaviors
  var mapPolygonTemplate = series.mapPolygons.template;
  // Instead of our custom title, we could also use {name} which comes from geodata  
  mapPolygonTemplate.fill = am4core.color(group.color);
  mapPolygonTemplate.fillOpacity = 0.8;
  mapPolygonTemplate.nonScalingStroke = true;
  
  // States  
  var hoverState = mapPolygonTemplate.states.create("hover");
  hoverState.properties.fill = am4core.color("#CC0000");
  
  // Tooltip
  mapPolygonTemplate.tooltipText = "{title}"; // enables tooltip
  // series.tooltip.getFillFromObject = false; // prevents default colorization, which would make all tooltips red on hover
  // series.tooltip.background.fill = am4core.color(group.color);
  
  // MapPolygonSeries will mutate the data assigned to it, 
  // we make and provide a copy of the original data array to leave it untouched.
  // (This method of copying works only for simple objects, e.g. it will not work
  //  as predictably for deep copying custom Classes.)
  series.data = JSON.parse(JSON.stringify(group.data));
});

// The rest of the world.
var worldSeries = chart.series.push(new am4maps.MapPolygonSeries());
var worldSeriesName = "world";
worldSeries.name = worldSeriesName;
worldSeries.useGeodata = true;
worldSeries.exclude = excludedCountries;
worldSeries.fillOpacity = 0.8;
worldSeries.hiddenInLegend = true;
worldSeries.mapPolygons.template.nonScalingStroke = true;

// This auto-generates a legend according to each series' name and fill
chart.legend = new am4maps.Legend();

// Legend styles
chart.legend.paddingLeft = 27;
chart.legend.paddingRight = 27;
chart.legend.marginBottom = 15;
chart.legend.width = am4core.percent(90);
chart.legend.valign = "bottom";
chart.legend.contentAlign = "left";

// Legend items
chart.legend.itemContainers.template.interactionsEnabled = false;

}
