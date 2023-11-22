import {vizUpdateAsync} from './functions/viz_update_async';
import {plotConfig} from './constants/plot_config';

export function vizCreate(element) {
  this.container = element;
  this.container.className = 'gauge-vis';
}

// eslint-disable-next-line no-undef
looker.plugins.visualizations.add({
  id: 'gauge',
  label: 'Gauge Visualization',
  primary: true,
  options: plotConfig,
  // Set up the initial state of the visualization
  create: function vizCreate(element) {
    this.container = element;
    this.container.className = 'gauge-vis';
  },
  // Render in response to the data or settings changing
  updateAsync: function (data, element, config, queryResponse, details, done) {
    vizUpdateAsync(data, element, config, queryResponse, details, done);
  },
});
