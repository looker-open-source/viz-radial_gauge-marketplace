import {vizUpdateAsync} from './functions/viz_update_async';
import {plotConfig} from './constants/plot_config';

export function vizCreate(viz, element) {
  viz.container = element;
  viz.container.className = 'gauge-vis';
}

// eslint-disable-next-line no-undef
looker.plugins.visualizations.add({
  id: 'gauge',
  label: 'Gauge Visualization',
  primary: true,
  options: plotConfig,
  // Set up the initial state of the visualization
  create: function (element) {
    vizCreate(this, element);
  },
  // Render in response to the data or settings changing
  updateAsync: function (data, element, config, queryResponse, details, done) {
    vizUpdateAsync(this, data, element, config, queryResponse, details, done);
  },
});
