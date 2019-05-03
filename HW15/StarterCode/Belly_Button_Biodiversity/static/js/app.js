function buildMetadata(sample) {
    
    d3.json(`/metadata/${sample}`).then((data) => {
      var panel = d3.select("#sample-metadata");
      panel.html("");
      Object.entries(data).forEach(([key, value]) => {
      panel.append('h6').text(`${key}: ${value}`);
      });
    });

}

function buildCharts(sample) {

  d3.json(`/samples/${sample}`).then((data) => {
    var otu_ids = data.otu_ids;
    var sample_values = data.sample_values;
    var otu_labels = data.otu_labels;

    var trace1 = {
      x: otu_ids,
      y: sample_values,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids
      }
    };

    var data1 = [trace1];
    
    Plotly.plot("bubble", data1);

    var trace2 = {
      values: sample_values.slice(0,10),
      labels: otu_ids.slice(0,10),
      hovertext: otu_labels.slice(0,10),
      hoverinfo: 'hovertext',
      type: "pie"
    };
    
    var data2 = [trace2];
    
    Plotly.plot("pie", data2);
  });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);

}

// Initialize the dashboard
init();
