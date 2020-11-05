
const init = () => {
  // SVG wrapper dimensions are determined by the current width
  // and height of the scatter div.
  var svgWidth = document.getElementById("scatter").clientWidth;
  var svgHeight = 500;

  var margin = {
    top: 50,
    right: 50,
    bottom: 50,
    left: 50,
  };

  var height = svgHeight - margin.top - margin.bottom;
  var width = svgWidth - margin.left - margin.right;

  // Create an SVG wrapper, append an SVG group that will hold our chart,
  // and shift the latter by left and top margins.
  var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight + 50);

  // Append an SVG group
  var chartGroup = svg

    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Initial Params
  var chosenXAxis = "poverty";
  var chosenYAxis = "healthcare";

  return { svg, margin, height, width, chartGroup, chosenXAxis, chosenYAxis };
};

// function used for updating x-scale var upon click on axis label
function xScale(data, chosenXAxis) {
  // create scales
  var xLinearScale = d3
    .scaleLinear()
    .domain([
      d3.min(data, (d) => d[chosenXAxis]) * 0.8,
      d3.max(data, (d) => d[chosenXAxis]) * 1.2,
    ])
    .range([0, width]);

  return xLinearScale;
}

// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition().duration(1000).call(bottomAxis);

  return xAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis) {
  circlesGroup
    .transition()
    .duration(1000)
    .attr("cx", (d) => newXScale(d[chosenXAxis]));

  return circlesGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup) {
  var label;

  switch (chosenXAxis) {
    case "poverty":
      label = "Poverty:";
      break;
    case "age":
      label = "Age:";
      break;
  }

  // var toolTip = d3.tip()
  //   .attr("class", "tooltip")
  //   .offset([80, -60])
  //   .html(function(d) {
  //     return (`${d.state}<br>
  //             ${label} ${d[chosenXAxis]}%<br>
  //              `);
  //   });

  // circlesGroup.call(toolTip);

  // circlesGroup.on("mouseover", function(data) {
  //   toolTip.show(data);
  // })
  //   // onmouseout event
  //   .on("mouseout", function(data, index) {
  //     toolTip.hide(data);
  //   });

  return circlesGroup;
}

var { svg, margin, height, width, chartGroup, chosenXAxis, chosenYAxis } = init()

// Retrieve data from the CSV file and execute everything below
d3.csv("./assets/data/data.csv",d3.autoType).then(function(data, err) {
  if (err) throw err;

  console.log(data);

  var xLinearScale = xScale(data, chosenXAxis);

  // Create y scale function
  var yLinearScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.healthcare)])
    .range([height, 0]);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup
    .append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  chartGroup.append("g").call(leftAxis);

  // append initial circles
  var circlesGroup = chartGroup
    .append("g")
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", (d) => xLinearScale(d[chosenXAxis]))
    .attr("cy", (d) => yLinearScale(d.healthcare))
    .attr("r", 10)
    .classed("bubbles", true);

  var textGroup = chartGroup
    .append("g")
    .selectAll("text")
    .data(data)
    .enter()
    .append("text")
    .text((d) => d.abbr)
    .attr("class", "bubbleText")
    .attr("x", (d) => xLinearScale(d[chosenXAxis]))
    .attr("y", (d) => yLinearScale(d.healthcare) + 5)
    .classed("bubbleText", true);

  // Trying to add toolTip
  var tooltip = d3.select("body");

  circlesGroup.on("mouseover");

  // Create group for two x-axis labels
  var censusXGroup = chartGroup
    .append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var poverty = censusXGroup
    .append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .attr("text-anchor", "middle")
    .classed("active", true)
    .text("In Poverty (%)");

  // var age = censusXGroup
  //   .append("text")
  //   .attr("x", 0)
  //   .attr("y", 40)
  //   .attr("value", "age") // value to grab for event listener
  //   .attr("text-anchor", "middle")
  //   .classed("inactive", true)
  //   .text("Age (Median)");

  // append y axis
  chartGroup
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - height / 2)
    .attr("dy", "1em")
    .classed("axis-text", true)
    .classed("active", true)
    .text("Lacks Healthcare (%)");

  // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);
}).catch(function(error) {
  console.log(error);
});
