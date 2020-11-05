

var { svg, margin, height, width, chartGroup, chosenXAxis, chosenYAxis } = init()

// Retrieve data from the CSV file and execute everything below
d3.csv("./assets/data/data.csv",d3.autoType).then(function(data, err) {
  if (err) throw err;

  console.log(data)

  var xLinearScale = xScale(data, chosenXAxis);

  // Create y scale function
  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.healthcare)])
    .range([height, 0]);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  chartGroup.append("g")
    .call(leftAxis);

  // append initial circles
  var circlesGroup = chartGroup.append('g')
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
      .attr("cx", d => xLinearScale(d[chosenXAxis]))
      .attr("cy", d => yLinearScale(d.healthcare))
      .attr("r", 10)
      .classed("bubbles",true)
  
  var textGroup = chartGroup.append('g')
    .selectAll("text")
    .data(data)
    .enter()
    .append("text")
      .text(d => d.abbr)
      .attr("class","bubbleText")
      .attr("x",d => xLinearScale(d[chosenXAxis]))
      .attr("y",d => yLinearScale(d.healthcare)+5)
      .classed("bubbleText",true)
    
  // Trying to add toolTip
  var tooltip = d3.select('body')

  circlesGroup.on("mouseover",)



  // Create group for two x-axis labels
  var censusXGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var poverty = censusXGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("In Poverty (%)");

  var age = censusXGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .text("Age (Median)");

  // append y axis
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .classed("axis-text", true)
    .text("Lacks Healthcare (%)");  

  // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

}).catch(function(error) {
  console.log(error);
});
