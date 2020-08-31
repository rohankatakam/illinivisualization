var width = 1080,
    height = 720;



// Domain for legend
var number_domain = [0, 5, 25, 75, 200, 500, 1000, 2000];
var number_color = d3.scaleThreshold()
    .domain(number_domain)
    // Custom range I developed from UIUC orange color with standard deviation ~5% darker/lighter
    .range(['#f5b2a3', '#f08b75', '#ec6546', '#e84a27', '#d03816', '#a22b11', '#731f0c']);


// Map data to contain zips-us-topo.json data
var numberData = {
    2019 : d3.map(),
    2018 : d3.map(),
    2017 : d3.map(),
    2016 : d3.map(),
    2015 : d3.map(),
    2014 : d3.map(),
    2013 : d3.map(),
    2009 : d3.map(),
    2008 : d3.map()
};

// Array of dictionary data to contain 
// CONSIDER UPDATING TO REFERENCE ALL dataset occurences FROM numberData instead
var dataset = {
    2019 : [],
    2018 : [],
    2017 : [],
    2016 : [],
    2015 : [],
    2014 : [],
    2013 : [],
    2009 : [],
    2008 : []
};



// Legend svg
var legend_svg = d3.select("svg.legend");

var legend = d3.legendColor()
    .labelFormat(d3.format(".2f"))
    .labels(d3.legendHelpers.thresholdLabels)
    .useClass(true)
    .scale(number_color)


// Map SVG
var svg = d3.select("svg.usmap")
    .attr("width", width)
    .attr("height", height);



// Tooltip (FINISH EDITING STYLING)
var tooltip = d3.select('.tooltip')
    .attr('style', 'position: absolute; opacity: 0');

var projection = d3.geo.albers()
    .scale(1500)
    .translate([width / 2, height / 2]);

var geoPath = d3.geo.path()
    .projection(projection);


// Queue for loading json and csv
queue()
    .defer(d3.json, "zips-us-topo.json")
    // Load 2019 data by default
    .defer(d3.csv, "/zipdata/2019.csv", function(d) {
        if(isNaN(d.number)){
            numberData[2019].set(+d.zipcode, 0);
        } else {
            numberData[2019].set(+d.zipcode, +d.number);
            dataset[2019].push({
                zipcode: +d.zipcode,
                number: +d.number
            })
        }
    })
    .defer(d3.csv, "/zipdata/2018.csv", function(d) {
        if(isNaN(d.number)){
            numberData[2018].set(+d.zipcode, 0);
        } else {
            numberData[2018].set(+d.zipcode, +d.number);
            dataset[2018].push({
                zipcode: +d.zipcode,
                number: +d.number
            })
        }
    })
    .defer(d3.csv, "/zipdata/2017.csv", function(d) {
        if(isNaN(d.number)){
            numberData[2017].set(+d.zipcode, 0);
        } else {
            numberData[2017].set(+d.zipcode, +d.number);
            dataset[2017].push({
                zipcode: +d.zipcode,
                number: +d.number
            })
        }
    })
    .defer(d3.csv, "/zipdata/2016.csv", function(d) {
        if(isNaN(d.number)){
            numberData[2016].set(+d.zipcode, 0);
        } else {
            numberData[2016].set(+d.zipcode, +d.number);
            dataset[2016].push({
                zipcode: +d.zipcode,
                number: +d.number
            })
        }
    })
    .defer(d3.csv, "/zipdata/2015.csv", function(d) {
        if(isNaN(d.number)){
            numberData[2015].set(+d.zipcode, 0);
        } else {
            numberData[2015].set(+d.zipcode, +d.number);
            dataset[2015].push({
                zipcode: +d.zipcode,
                number: +d.number
            })
        }
    })
    .defer(d3.csv, "/zipdata/2014.csv", function(d) {
        if(isNaN(d.number)){
            numberData[2014].set(+d.zipcode, 0);
        } else {
            numberData[2014].set(+d.zipcode, +d.number);
            dataset[2014].push({
                zipcode: +d.zipcode,
                number: +d.number
            })
        }
    })
    .defer(d3.csv, "/zipdata/2013.csv", function(d) {
        if(isNaN(d.number)){
            numberData[2013].set(+d.zipcode, 0);
        } else {
            numberData[2013].set(+d.zipcode, +d.number);
            dataset[2013].push({
                zipcode: +d.zipcode,
                number: +d.number
            })
        }
    })
    .defer(d3.csv, "/zipdata/2009.csv", function(d) {
        if(isNaN(d.number)){
            numberData[2009].set(+d.zipcode, 0);
        } else {
            numberData[2009].set(+d.zipcode, +d.number);
            dataset[2009].push({
                zipcode: +d.zipcode,
                number: +d.number
            })
        }
    })
    .defer(d3.csv, "/zipdata/2008.csv", function(d) {
        if(isNaN(d.number)){
            numberData[2008].set(+d.zipcode, 0);
        } else {
            numberData[2008].set(+d.zipcode, +d.number);
            dataset[2008].push({
                zipcode: +d.zipcode,
                number: +d.number
            })
        }
    })
    .await(ready);


function ILZip(zipcode){
    const thiszip = parseInt(zipcode, 10); 

    if (thiszip >= 60000 && thiszip <= 62999) {
        return true;
    } else {
        return false;
    }
}


function updateTables(numberToDisplay, year, zipInfo){
    // Clear Tables
    var start = performance.now();

    document.getElementById("instate").innerHTML = "";
    document.getElementById("outofstate").innerHTML = "";
    
    // While loop creates in-state and out-of-state lists on page
    var sorted_data = dataset[year].slice().sort((a, b) => d3.descending(a.number, b.number));

    var i = 0;
    var instate_count = 0;
    var outofstate_count = 0;


    while(instate_count < numberToDisplay || outofstate_count < numberToDisplay){
        if(zipInfo[sorted_data[i].zipcode.toString()] != undefined) {
            if(ILZip(sorted_data[i].zipcode)){
                if(instate_count < numberToDisplay){
                    var zipcode = sorted_data[i].zipcode.toString();
                    var number = sorted_data[i].number;
                    var name = zipInfo[zipcode].name;
                    var state = zipInfo[zipcode].state;

                    addInStateItem(instate_count + 1, name, state, zipcode, number);

                    instate_count++;
                }
                
            } else {
                var zipcode = sorted_data[i].zipcode.toString();
                var number = sorted_data[i].number;
                var name = zipInfo[zipcode].name;
                var state = zipInfo[zipcode].state;

                addOutOfStateItem(outofstate_count + 1, name, state, zipcode, number);

                outofstate_count++;
            }
        }

        i++;
    }

    var end = performance.now();

    console.log("updateTables(): " + (end - start).toString() + "ms");
}





function updateMap(data, year){
    var start = performance.now();

    var appending = svg.append("g").selectAll("path").data(data);
    var line = d3.svg.line();

    
    appending.enter()
        .append("path")
        .attr("d", geoPath)
        //.call(zoom)
        .on("mouseover", function(d) {
            if(numberData[year].get(d.properties.zip) != undefined){
                tooltip.style("left", d3.event.pageX + "px");
                tooltip.style("top", d3.event.pageY+ "px");
                tooltip.style("opacity", 1);
                setTooltip(d.properties.name, d.properties.state, d.properties.zip, numberData[year].get(d.properties.zip));
            }
        })
        .on("mouseout", function(d) { 
            tooltip.style("opacity", 0);
        })
        .attr("fill", function(d){
            var value = numberData[year].get(d.properties.zip);
            return (value != undefined ? number_color(value) : "#13294B");
        });

        
        
    

    appending.transition()
        .duration(0)
        .attr("width",function (d) {return d.y; });
    
    appending.exit().remove();

    var end = performance.now();

    console.log("updateMap(): " + (end - start).toString() + "ms");
}

function trends(zipinfo){
    var start = performance.now();
    var trends = [];
    
    for(var i = 0; i < dataset[2009].length; i++){
        var zipcode = dataset[2009][i].zipcode;
        if(numberData[2019].has(zipcode)){
            if(zipinfo[zipcode.toString()] != undefined){
                trends.push({
                    zipcode: zipcode,
                    change: Math.round((parseFloat(numberData[2019].get(zipcode) - numberData[2009].get(zipcode))/parseFloat(numberData[2009].get(zipcode))) * 10) / 10
                });
            }
        }
    }

    var end = performance.now();
    console.log("trends(): " + (end - start).toString() + "ms");
    
    return trends.sort(function(x, y){
        return d3.descending(x.change, y.change);
    })
}

function setupTrendsTable(trends, number, zipInfo){
    var start = performance.now();
    var i = 0;
    while(i < number){
        var zipcode = trends[i].zipcode;
        var change = trends[i].change;
        var city = zipInfo[zipcode.toString()].name;
        var state = zipInfo[zipcode.toString()].state;
        addTrendsItem(i+1, city, state, zipcode, change);

        i++;
    }

    console.log(trends.reverse());


    var end = performance.now();
    console.log("setupTrendsTable(): " + (end - start).toString() + "ms");
}



// Ready function to be executed when json and csv are loaded
function ready(error, zipcodes) {
    //createLegend();
    dragElement(document.getElementById("legend"));

    // Create topoJson variable from zips-us-topo.json
    var data = topojson.feature(zipcodes, zipcodes.objects.zip_codes_for_the_usa).features;

    // main() initial load on page
    d3.json("zipinfo.json", function(zipInfo) {
        //console.log(trends(zipInfo));
        // While loop creates in-state and out-of-state lists on page
        setupTrendsTable(trends(zipInfo), 100, zipInfo);
        updateMap(data, 2019);
        updateTables(50, 2019, zipInfo);
        document.getElementById('instate-header').innerHTML = ("In-state (2019)");
        document.getElementById('outofstate-header').innerHTML = ("Out-of-state (2019)");
    });

    // Choose Year Flow
    var selectYear = document.getElementById("selectYear");
    selectYear.onchange = function(){
        console.log(selectYear.value);
        d3.json("zipinfo.json", function(zipInfo) {
            // While loop creates in-state and out-of-state lists on page
            document.getElementById('instate-header').innerHTML = ("In-state (" + selectYear.value.toString() + ")");
            document.getElementById('outofstate-header').innerHTML = ("Out-of-state (" + selectYear.value.toString() + ")");
            updateTables(50, selectYear.value, zipInfo);
            updateMap(data, selectYear.value);
        });
    };
        
}


function addTrendsItem(rank, city, state, zipcode, percent){
    var trends = document.getElementById("trends");
    var html = "<li class='list-group-item d-flex justify-content-between align-items-center'> \
    <span class='badge badge-info badge-pill'>"+ rank +"</span> \
    <span><span class='badge badge-dark'>"+ city +"</span> \
    <span class='badge badge-dark'>"+ state +"</span> \
    <span class='badge badge-secondary'>"+ zipcode +"</span></span> \
    <span class='badge badge-success badge-pill'>+"+ percent +"%</span> \
    </li>";
    trends.innerHTML += html;
}

function addInStateItem(rank, city, state, zipcode, number){
    var instate = document.getElementById("instate");
    var html = "<li class='list-group-item d-flex justify-content-between align-items-center'> \
    <span class='badge badge-info badge-pill'>"+ rank +"</span> \
    <span><span class='badge badge-dark'>"+ city +"</span> \
    <span class='badge badge-dark'>"+ state +"</span> \
    <span class='badge badge-secondary'>"+ zipcode +"</span></span> \
    <span class='badge badge-primary badge-pill'>"+ number +"</span> \
    </li>";
    instate.innerHTML += html;
}

function addOutOfStateItem(rank, city, state, zipcode, number){
    var outofstate = document.getElementById("outofstate");
    var html = "<li class='list-group-item d-flex justify-content-between align-items-center'> \
    <span class='badge badge-info badge-pill'>"+ rank +"</span> \
    <span><span class='badge badge-dark'>"+ city +"</span> \
    <span class='badge badge-dark'>"+ state +"</span> \
    <span class='badge badge-secondary'>"+ zipcode +"</span></span> \
    <span class='badge badge-primary badge-pill'>"+ number +"</span> \
    </li>";
    outofstate.innerHTML += html;
}

function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(elmnt.id + "header")) {
      // if present, the header is where you move the DIV from:
      document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
    } else {
      // otherwise, move the DIV from anywhere inside the DIV:
      elmnt.onmousedown = dragMouseDown;
    }
  
    function dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
    }
  
    function elementDrag(e) {
    //document.getElementById("grab").innerHTML = "✊🏼";
      e = e || window.event;
      e.preventDefault();
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      // set the element's new position:
      elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
      elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }
  
    function closeDragElement() {
      // stop moving when mouse button is released:
      //document.getElementById("grab").innerHTML = "🖐🏼";
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }



function setTooltip(name, state, zip, number){
    var city = document.getElementById("city");
    var zipcode = document.getElementById("zipcode");
    
    city.innerHTML = name;
    document.getElementById("state").innerHTML = state;
    zipcode.innerHTML = zip;
    document.getElementById("number").innerHTML = number;
}