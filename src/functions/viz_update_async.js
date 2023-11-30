import {processData} from './process_data';
import {processPivot} from './process_pivot';
import {handleVizErrors} from './viz_error_handler';
import {React} from 'react';
import {ReactDOM} from 'react-dom';
import {RadialGauge} from '../radial_gauge';

const DEFAULT_MAX_RANGE = null;

export function vizUpdateAsync(
  radialGaugeViz,
  data,
  element,
  config,
  queryResponse,
  details,
  done
) {
  var margin = {top: 20, right: 20, bottom: 20, left: 20},
    width = element.clientWidth,
    height = element.clientHeight;

  // Handle any erros with viz data and config
  handleVizErrors(radialGaugeViz, data, queryResponse, config);

  // Catch case where config is undefined on db-next
  for (let option in radialGaugeViz.options) {
    if (config[option] === undefined) {
      config[option] = radialGaugeViz.options[option].default;
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
      chunk = processData(data[i], queryResponse, config, radialGaugeViz);
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
      chunk = processPivot(data, queryResponse, config, radialGaugeViz, d.key);
      if (i <= limit - 1) {
        chunk_multiples.push(chunk);
      }
    });
  } else {
    chunk = processData(data, queryResponse, config, radialGaugeViz);
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

  if (config.viz_trellis_by === 'none') {
    radialGaugeViz.radialProps = {
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
      value_rendered: chunk.value_rendered,
      target: chunk.target > config.range_max ? config.range_max : chunk.target,
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
    radialGaugeViz.chart = ReactDOM.render(
      <RadialGauge {...radialGaugeViz.radialProps} />,
      radialGaugeViz.container
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
      radialGaugeViz.radialProps = {
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
      radialGaugeViz.chart = ReactDOM.render(
        <RadialGauge {...radialGaugeViz.radialProps} />,
        radialGaugeViz.container
      );
    });
  }

  // We are done rendering! Let Looker know.
  done();
}
