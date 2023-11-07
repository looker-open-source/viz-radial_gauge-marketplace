import {React} from 'react';
import {ReactDOM} from 'react-dom';

import {plotConfig} from './constants/plot_config';
import {processPivot} from './functions/process_pivot';
import {RadialGauge} from './radial_gauge';
import {processData} from './functions/process_data';

const DEFAULT_MAX_RANGE = null;

looker.plugins.visualizations.add({
  id: 'gauge',
  label: 'Gauge Visualization',
  primary: true,
  options: plotConfig,
  // Set up the initial state of the visualization
  create: function (element, config) {
    this.container = element;
    this.container.className = 'gauge-vis';
  },
  // Render in response to the data or settings changing
  updateAsync: function (data, element, config, queryResponse, details, done) {
    var margin = {top: 20, right: 20, bottom: 20, left: 20},
      width = element.clientWidth,
      height = element.clientHeight;

    // Clear any errors from previous updates
    this.clearErrors();

    if (data.length < 1) {
      // Issue identified where viz would not change with table calc filters
      // need to supply the container with something new if we fail early and
      // don't make it to the inteded render function.
      // https://looker.atlassian.net/browse/DX-5779
      this.chart = ReactDOM.render(<></>, this.container);
      this.addError({
        title: 'No Results',
      });
      return;
    }

    // Throw some errors and exit if the shape of the data isn't what this chart needs
    if (
      queryResponse.fields.dimension_like.length > 1 ||
      queryResponse.fields.measure_like.length > 2
    ) {
      this.addError({
        title: 'Invalid Input.',
        message: 'This chart accepts up to 1 dimension and 2 measures.',
      });
      return;
    }

    if (
      config.viz_trellis_by === 'pivot' &&
      queryResponse.pivots === undefined
    ) {
      this.addError({
        title: 'Invalid Input.',
        message: 'Add pivots or change trellis type.',
      });
      return;
    }

    // Catch case where config is undefined on db-next
    for (let option in this.options) {
      if (config[option] === undefined) {
        config[option] = this.options[option].default;
      }
    }

    // Extract value, value_label, target, target_label as a chunk
    let chunk;
    let chunk_multiples = [];
    if (config.viz_trellis_by === 'row') {
      let limit = Math.min(
        config.trellis_cols * config.trellis_rows,
        data.length
      );
      data.forEach((d, i) => {
        chunk = processData(data[i], queryResponse, config, this);
        if (i <= limit - 1) {
          chunk_multiples.push(chunk);
        }
      });
    } else if (config.viz_trellis_by === 'pivot') {
      let limit = Math.min(
        config.trellis_cols * config.trellis_rows,
        queryResponse.pivots.length
      );
      queryResponse.pivots.forEach((d, i) => {
        chunk = processPivot(data, queryResponse, config, this, d.key);
        if (i <= limit - 1) {
          chunk_multiples.push(chunk);
        }
      });
    } else {
      chunk = processData(data, queryResponse, config, this);
    }

    if (!config.range_max || config.range_max === DEFAULT_MAX_RANGE) {
      let num = Math.max(
        Math.ceil(chunk.value),
        chunk.target ? Math.ceil(chunk.target) : 0
      );
      var len = (num + '').length;
      var fac = Math.pow(10, len - 1);
      let default_max = Math.ceil(num / fac) * fac;
      config.range_max = default_max;
    }
    var viz = this;
    if (config.viz_trellis_by === 'none') {
      viz.radialProps = {
        cleanup: `gauge`,
        trellis_by: config.viz_trellis_by,
        w: width,
        h: height,
        limiting_aspect: width < height ? 'vw' : 'vh',
        margin: margin,
        style: config.style,
        angle: config.angle,
        cutout: config.cutout,
        color: config.fill_color,
        gauge_background: config.background_color,
        range: [config.range_min, config.range_max],
        value: chunk.value > config.range_max ? config.range_max : chunk.value,
        // value: config.dev_value,
        // value_rendered: config.dev_value.toString(),
        value_rendered: chunk.value_rendered,
        target:
          chunk.target > config.range_max ? config.range_max : chunk.target,
        value_label: chunk.value_label,
        target_label: chunk.target_label,
        value_dimension: chunk.value_dimension,
        target_dimension: chunk.target_dimension,
        target_rendered: chunk.target_rendered,
        value_links: chunk.value_links,
        label_font: config.label_font_size,
        range_formatting: config.range_formatting,
        range_x: config.range_x,
        range_y: config.range_y,
        gauge_fill_type: config.gauge_fill_type,
        fill_colors: config.fill_colors,
        range_color: config.range_color,

        spinner: config.spinner_length, // SPINNER SETTINGS
        spinner_weight: config.spinner_weight,
        spinner_background: config.spinner_color,
        spinner_type: config.spinner_type,

        arm: config.arm_length, // ARM SETTINGS
        arm_weight: config.arm_weight,

        target_length: config.target_length, // TARGET SETTINGS
        target_gap: config.target_gap,
        target_weight: config.target_weight,
        target_background: '#282828',
        target_source: config.target_source,

        value_label_type: config.value_label_type, // LABEL SETTINGS
        value_label_font: config.value_label_font,
        value_label_padding: config.value_label_padding,
        target_label_type: config.target_label_type,
        target_label_font: config.target_label_font,
        target_label_padding: config.target_label_padding,
        wrap_width: 100,
      };
      // Finally update the state with our new data
      viz.chart = ReactDOM.render(
        <RadialGauge {...viz.radialProps} />,
        viz.container
      );
    } else {
      chunk_multiples.forEach(function (d, i) {
        let limit =
          config.viz_trellis_by === 'row'
            ? Math.min(config.trellis_cols * config.trellis_rows, data.length)
            : Math.min(
                config.trellis_cols * config.trellis_rows,
                queryResponse.pivots.length
              );
        viz.radialProps = {
          cleanup: `subgauge${i}`,
          trellis_by: config.viz_trellis_by,
          trellis_limit: limit,
          w: width / config.trellis_cols, // GAUGE SETTINGS
          h: height / config.trellis_rows,
          limiting_aspect: width < height ? 'vw' : 'vh',
          margin: margin,
          style: config.style,
          angle: config.angle,
          cutout: config.cutout,
          color: config.fill_color,
          gauge_background: config.background_color,
          range: [config.range_min, config.range_max],
          value: d.value > config.range_max ? config.range_max : d.value,
          value_rendered: d.value_rendered,
          target: d.target > config.range_max ? config.range_max : d.target,
          value_label: d.value_label,
          target_label: d.target_label,
          value_dimension: d.value_dimension,
          target_dimension: d.target_dimension,
          target_rendered: d.target_rendered,
          value_links: d.value_links,
          label_font: config.label_font_size,
          range_formatting: config.range_formatting,
          range_x: config.range_x,
          range_y: config.range_y,
          gauge_fill_type: config.gauge_fill_type,
          fill_colors: config.fill_colors,
          range_color: config.range_color,

          spinner: config.spinner_length, // SPINNER SETTINGS
          spinner_weight: config.spinner_weight,
          spinner_background: config.spinner_color,
          spinner_type: config.spinner_type,

          arm: config.arm_length, // ARM SETTINGS
          arm_weight: config.arm_weight,

          target_length: config.target_length, // TARGET SETTINGS
          target_gap: config.target_gap,
          target_weight: config.target_weight,
          target_background: '#282828',
          target_source: config.target_source,

          value_label_type: config.value_label_type, // LABEL SETTINGS
          value_label_font: config.value_label_font,
          value_label_padding: config.value_label_padding,
          target_label_type: config.target_label_type,
          target_label_font: config.target_label_font,
          target_label_padding: config.target_label_padding,
          wrap_width: 100,
        };
        viz.chart = ReactDOM.render(
          <RadialGauge {...viz.radialProps} />,
          viz.container
        );
      });
    }

    // We are done rendering! Let Looker know.
    done();
  },
});
