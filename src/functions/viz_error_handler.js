export function handleVizErrors(radialGaugeViz, data, queryResponse, config) {
  // Clear any errors from previous updates
  radialGaugeViz.clearErrors();

  if (data.length < 1) {
    // Issue identified where viz would not change with table calc filters
    // need to supply the container with something new if we fail early and
    // don't make it to the inteded render function.
    // https://looker.atlassian.net/browse/DX-5779
    radialGaugeViz.chart = ReactDOM.render(<></>, radialGaugeViz.container);
    radialGaugeViz.addError({
      title: 'No Results',
    });
    return;
  }

  // Throw some errors and exit if the shape of the data isn't what this chart needs
  if (
    queryResponse.fields.dimension_like.length > 1 ||
    queryResponse.fields.measure_like.length > 2
  ) {
    radialGaugeViz.addError({
      title: 'Invalid Input.',
      message: 'This chart accepts up to 1 dimension and 2 measures.',
    });
    return;
  }

  if (config.viz_trellis_by === 'pivot' && queryResponse.pivots === undefined) {
    radialGaugeViz.addError({
      title: 'Invalid Input.',
      message: 'Add pivots or change trellis type.',
    });
    return;
  }
}
