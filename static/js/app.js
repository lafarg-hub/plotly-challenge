function optionChanged(ID) {
    d3
    .json("https://raw.githubusercontent.com/lafarg-hub/plotly-challenge/master/data/samples.json")
    .then((samples) => {

        // grab the index of the name selected from the data
        var arr = samples.names;
        var IDindex = arr.indexOf(ID);
        console.log(IDindex);

        // grab the index of the metadata from the data
        var meta = samples.metadata[IDindex];
        console.log("meta", meta);

        // grabs metadata for selected ID, uses Object.entries to seperate obj into key:value pairs, and appends to list to be added to page
        for (let [key, value] of Object.entries(meta)) {
            d3.select("#sample-metadata")
            .append("div").text(`${key}: ${value}`);
          };

        // defines current patient based on ID selected during the change
        var patient = samples.samples[IDindex];

        // loops through data associated with patient selected and throws sample_value, otu_id, and otu_label in one new list
        var barData = []
        for (var i=0; i < patient.sample_values.length; i++) {
            var barVis = {"sample_value": patient.sample_values[i], 
            "otu_id": patient.otu_ids[i], 
            "otu_label": patient.otu_labels[i]};
            barData.push(barVis); 
        };
        console.log(barData);

        // x and y data lists to be filled in below
        var xdata = [];
        var ydata = [];
        var labels = barData.map(bdata => {
            return bdata.otu_label;
        });

        // for loop to gather patient ID information and then push to x and y axis
        for (var i=0; i < barData.length; i++) {
            selectID = barData[i];
            xdata.push(selectID.sample_value);
            ydata.push(selectID.otu_id);
        };

        // create the bar chart 
        var data = [{
            type: 'bar',
        // slice, grab the top ten and reverse the order displayed 
            x: xdata.slice(0, 10).reverse(),
            y: ydata.map(otu_id => {
                    return `OTU ${otu_id}`
                }).slice(0, 10).reverse(),
            orientation: 'h',
            hovertext: labels.slice(0, 10).reverse(),
          }];
          
        Plotly.newPlot('bar', data);
        
    });
};

// generates the bar chart based on user selected ID from drop down
d3
    .json("https://raw.githubusercontent.com/lafarg-hub/plotly-challenge/master/data/samples.json")
    
    .then((samples) => {

        console.log(samples);
        dropdownVals = samples.names;

        // Populate dropdown menu w/ options
        var dropdownMenu = d3.select("#selDataset");
        var options = dropdownMenu.selectAll("option")
            .data(dropdownVals)
            .enter()
            .append("option")
            .text(function(d) {
                return d;
            });

        optionChanged(dropdownMenu.property("value"));
});