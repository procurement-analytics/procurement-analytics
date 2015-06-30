# Procurement dashboards
 
## Tech
The tech stack for the procurements dashboards consists of react and reflux. The charts are built with d3 and integrated with the react structure.

## Structure

### Dimension vs comparison
The web application is structured with dimensions (one, two, three) and comparisons (foo, bar, baz). The dimensions relate to what aspect of procurement performance is being analyzed. The comparisons allow to the users to slice the data and see how each slice performs for that dimension. By default the presented data consists of a general overview (dimension) of the full dataset, i.e. no comparison.

The dimensions are what we can consider pages and each one of them is managed by a react component located in `scripts/components/dimensions/*.js`. The appropriate component is loaded in `scripts/components/analysis.js` according the the active route.

All the data that doesn't change from comparison to comparison (of a given dimension) is set directly in the dimension component (`render()` method), while the remaining data (mostly chart data) is loaded from a json file.

The data is loaded every time the analysis component gets updated (`componentDidMount()` and `componentWillReceiveProps()` methods) using a reflux action. The `app_store` responds to this action by loading a file named according to the pattern `[dimension]--[comparison].json`.
The `analysis` component is listening for changes in the store's data and when there's new data sends it to the dimension component.

Simply put, to add a new dimension one would:
- Create a component for it.
- Load the component in the switch statement in `analysis.js`.
- Add a file with data following the naming pattern `[dimension]--[comparison].json`.
- Set up the navigation (explained below).


### Natural language navigation
To build the navigation we use a natural language form. It consists of a sentence where some words display options when the user interacts with them. When an option is selected the sentence adapts itself to make sense with that option by changing articles, pronouns, etc. The beauty of this approach is that it allows the user to understand pretty well what's happening even when the options themselves are not very straightforward. By using a full sentence instead of a simple menu we are providing context about what's on screen making it a more engaging experience.

The navigation is being included in the `scripts/components/analysis.js`, however to keep things more manageable all the options are being set up in `scripts/utils/analysis_nl_form.js`. Instructions on how to set up all the options can be found in the initial comment in `scripts/components/nl_form.js`.
When an option is selected the `onNlSelect()` method of `analysis.js` gets called and the url is changed which causes a page update.


### Charts
The application features 5 types of charts:
- Histogram chart
- Area chart
- Box plot chart
- Scatterplot chart
- Timeline chart

All the charts have the same life-cycle.
- **_init()**: The chart elements and functions are created.
- **update()**: The chart elements are drawn according to the provided data. Interactivity is set up.
- **destroy()**: Any extra elements and listeners are removed.

The charts are tied with the react components so they're created when the component initializes (`componentDidMount()`). Whenever there's a data update the chart's `setData()` method is called (in `componentDidUpdate()`) which triggers a chart update.
The charts are made to be responsive therefore when the component is created, a resize listener is set up. In the event of a resize the chart's `update()` method is called with causes a chart redraw.

When a comparison is selected the histogram, area, and scatterplot charts assume the appearance of small multiples. This is achieved by building several charts ensuring that the domain remains the same across all of them. An html class is added to their wrapper indicating how many charts it contains (ex `chart-group-3`), then they are positioned side-by-side with css.
The other charts (box plot and timeline) simply adapt to hold more data.


### Data preprocessing
- How
- Why preprocess?
 
 
### Design considerations
- if any