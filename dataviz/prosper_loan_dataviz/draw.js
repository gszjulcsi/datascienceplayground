function aggregate_by_month(raw_data) {
    return d3.nest()
             .key(function(d) { return d.ListingCreationDate.substring(0, 7); })
             .rollup(function(v) {
                    o = {};
                    o["Number of loans"] = v.length;
                    o["Total amount of loans (in $)"] = d3.sum(v, function(d) { return d.LoanOriginalAmount; });
                    o["Average amount of loans (in $)"] = d3.mean(v, function(d) { return d.LoanOriginalAmount; });
                    return o;
             })
             .sortKeys(d3.ascending)
             .entries(raw_data);
};

function get_data_for_chart(data, attribute_to_plot) {
    return _.chain(data)
            .map(function(row, index){
                 console.log(attribute_to_plot);
                 x = {};
                 x['month'] = new Date(row.key);
                 x[attribute_to_plot] = row['values'][attribute_to_plot];
                 return x;
            })
            .flatten()
            .value();
};



function draw(raw_data) {
        "use strict";
        var margin = 75,
            width = 1400 - margin,
            height = 600 - margin;
        d3.select("body")
          .append("h2")
          .text("Prosper loan");
        var data = aggregate_by_month(raw_data);

        var metrics = ["Number of loans", "Total amount of loans (in $)", "Average amount of loans (in $)"];

        var buttons = d3.select("body")
          .append("div")
          .attr("class","btn-group btn-group-justified")
          .selectAll("div")
          .data(metrics)
          .enter()
          .append("div")
          .attr("class","btn btn-default")
          .text(function(d) {
               return d;
          });

//        var split_by_fields = ['EmploymentStatus', "ProsperRating (numeric)","ProsperRating (Alpha)","ProsperScore","ListingCategory (numeric)"]
//        var split_by_buttons = d3.select("body")
//                                       .append("div")
//                                       .attr("class","btn-group btn-group-justified")
//                                       .selectAll("div")
//                                       .data(metrics)
//                                       .enter()
//                                       .append("div")
//                                       .attr("class","btn btn-default")
//                                       .text(function(d) {
//                                            return d;
//                                       });

        var svg = d3.select("body")
               .append("svg")
               .attr("width", width + margin)
               .attr("height", height + margin),
        g = svg.append('g').attr("transform", "translate(" + margin + "," + margin + ")");


        function update_chart(data, attribute_to_plot) {
            var chartData = get_data_for_chart(data, attribute_to_plot);

            svg.selectAll('*').remove();
            var myChart = new dimple.chart(svg, chartData);
            var x = myChart.addTimeAxis("x", "month");
            myChart.addMeasureAxis("y", attribute_to_plot);
            myChart.addSeries(null, dimple.plot.line);
            myChart.addSeries(null, dimple.plot.scatter);
            myChart.draw();
        }

        // TODO enhance buttons
        // http://dimplejs.org/advanced_examples_viewer.html?id=advanced_storyboard_control
        buttons.on("click", function(d) {
                    d3.select(".btn-group")
                      .selectAll(".btn")
                      .transition()
                      .duration(500)
                      .attr("class","btn btn-default");

                    d3.select(this)
                      .transition()
                      .duration(500)
                      .attr("class","btn btn-default active");

                    update_chart(data, d);
        });


      };
