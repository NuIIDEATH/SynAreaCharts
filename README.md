# DC Synthesis Area Charts

[![GitHub stars](https://img.shields.io/github/stars/NuIIDEATH/SynAreaCharts.svg?style=social&label=Stars)](https://github.com/NuIIDEATH/SynAreaCharts)
[![GitHub forks](https://img.shields.io/github/forks/NuIIDEATH/SynAreaCharts.svg?style=social&label=Forks)](https://github.com/NuIIDEATH/SynAreaCharts)

DC Synthesis Area Charts is an open-source React application designed to provide an intuitive visualization interface for displaying area data from comprehensive reports.
This application reads the Synopsys Design Compiler area report and utilizes the visualization library to create interactive charts. [Give it a try!](https://nuiideath.github.io/SynAreaCharts/)
![Synthesis Area Charts](https://github.com/NuIIDEATH/SynAreaCharts/blob/main/imgs/SynAreaCharts.png?raw=true)

## Features

- **Interactive Charts**: Create dynamic and interactive charts with Plotly.js.
- **Multiple Chart Types**: Supports various chart types such as treemap, icicle, and sunburst.
- **Customizable Color Schemes**: Choose from a range of color schemes and control the display of the color bar.
- **Data Depth Control**: Adjust the depth of data displayed in the chart to suit your needs.
- **File Parsing**: Parse files in specific formats and extract data for chart display.

## Usage

1. **Install Dependencies**:

   ```bash
   npm install
   ```

2. **Run the Application**:

```bash
 npm start
```

3. **Upload File**:
   Use the application interface to upload comprehensive report files, which will then be parsed and displayed in the chart.

or just use the Released Version of the html, which is under the docs folder, copy the files to your local environment and open the html using any browser you like.

## Acknowledgements

- **Plotly.js**: For providing the powerful and flexible charting library that powers the visualizations.
- **Material-UI Core**: For delivering a robust set of UI components that enhance the user interface of the application.
