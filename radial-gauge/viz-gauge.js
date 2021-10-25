import RadialGauge from "./RadialGauge";
import React from "react";
import ReactDOM from "react-dom";
import SSF from "ssf";

const DEFAULT_MAX_RANGE = null

function processPivot(data, queryResponse, config, viz, pivotKey) {
  data = data.length === undefined ? [data] : data;
  let dims, meas;
  dims = queryResponse["fields"]["dimension_like"];
  meas = queryResponse["fields"]["measure_like"];

  if (dims.length > 0) {
    var dimID = dims[0]["name"];
    var dimData = data[0][dimID][pivotKey];
  }
  // if (config.value_label_type === "dim" || config.value_label_type === "dboth") {
  // 	if (dims.length === 0) {
  // 		viz.addError({title: 'Invalid Input.', message: 'Add a dimension or modify label type.'});
  // 	}
  // }
  // if (config.target_label_type === "dim" || config.target_label_type === "dboth") {
  // 	if (dims.length === 0) {
  // 		viz.addError({title: 'Invalid Input.', message: 'Add a dimension or modify label type.'});
  // 	}
  // }
  var mesID = meas[0]["name"];
  var mesData = data[0][mesID][pivotKey];
  var mesLabel =
    meas[0]["label_short"] === undefined
      ? meas[0]["label"]
      : meas[0]["label_short"];
  var mesRendered =
    mesData.rendered === undefined ? mesData.value : mesData.rendered;

  if (config.target_source === "second") {
    if (meas.length < 2) {
      viz.addError({
        title: "Invalid Input.",
        message: "Add a second measure or modify target label source.",
      });
    }
    var tarID = meas[1]["name"];
    var tarData = data[0][tarID][pivotKey];
    var tarValue = tarData.value;
    var tarLabel =
      meas[1]["label_short"] === undefined
        ? meas[1]["label"]
        : meas[1]["label_short"];
    var tarBase =
      tarData.rendered === undefined ? tarData.value : tarData.rendered;
    var tarRendered =
      config.target_value_format === undefined ||
      config.target_value_format === ""
        ? tarBase
        : SSF.format(config.target_value_format, tarValue);
    if (dims.length > 0) {
      var tarDim =
        config.target_label_override === undefined ||
        config.target_label_override === ""
          ? pivotKey
          : config.target_label_override;
    }
  } else if (config.target_source === "first") {
    if (config.viz_trellis_by === "row") {
      viz.addError({
        title: "Invalid Input.",
        message:
          "This option cannot be applied to a trellis. Please modify target label source.",
      });
    } else if (data.length < 2) {
      viz.addError({
        title: "Invalid Input.",
        message: "No value to target. Add a second row or modify label type.",
      });
    }
    var tarData = data[1][mesID][pivotKey];
    var tarValue = tarData.value;
    var tarBase =
      tarData.rendered === undefined || tarData.rendered === ""
        ? tarValue
        : tarData.rendered;
    var tarLabel = mesLabel;
    var tarRendered =
      config.target_value_format === undefined ||
      config.target_value_format === ""
        ? tarBase
        : SSF.format(config.target_value_format, tarValue);
    if (dims.length > 0) {
      var tarDim =
        config.target_label_override === undefined ||
        config.target_label_override === ""
          ? pivotKey
          : config.target_label_override;
    }
  } else if (config.target_source === "override") {
    if (
      config.target_value_override === undefined ||
      config.target_value_override === ""
    ) {
      viz.addError({
        title: "Invalid Input.",
        message:
          "No target override. Add an override value or modify target label source.",
      });
    }
    var tarValue = parseFloat(config.target_value_override);
    var tarBase = tarValue;
    var tarLabel = config.target_label_override;
    var tarRendered =
      config.target_value_format === undefined ||
      config.target_value_format === ""
        ? tarBase
        : SSF.format(config.target_value_format, tarValue);
    if (dims.length > 0) {
      var tarDim =
        config.target_label_override === undefined ||
        config.target_label_override === ""
          ? pivotKey
          : config.target_label_override;
    }
  }

  let chunk = {
    value: mesData.value,
    value_links: mesData.links,
    value_label:
      config.value_label_override === undefined ||
      config.value_label_override === ""
        ? mesLabel
        : config.value_label_override,
    value_rendered:
      config.value_formatting === undefined || config.value_formatting === ""
        ? mesRendered
        : SSF.format(config.value_formatting, mesData.value),
    value_dimension:
      config.value_label_override === undefined ||
      config.value_label_override === ""
        ? pivotKey
        : config.value_label_override,
    target: tarValue,
    target_rendered: tarRendered,
    target_label:
      config.target_label_override === undefined ||
      config.target_label_override === ""
        ? tarLabel
        : config.target_label_override,
    target_dimension: tarDim,
  };
  return chunk;
}

function processData(data, queryResponse, config, viz) {
  data = data.length === undefined ? [data] : data;
  let dims, meas;
  dims = queryResponse["fields"]["dimension_like"];
  meas = queryResponse["fields"]["measure_like"];

  if (dims.length > 0) {
    var dimID = dims[0]["name"];
    var dimData = data[0][dimID];
  }
  if (
    config.value_label_type === "dim" ||
    config.value_label_type === "dboth"
  ) {
    if (dims.length === 0) {
      viz.addError({
        title: "Invalid Input.",
        message: "Add a dimension or modify label type.",
      });
    }
  }
  if (
    config.target_label_type === "dim" ||
    config.target_label_type === "dboth"
  ) {
    if (dims.length === 0) {
      viz.addError({
        title: "Invalid Input.",
        message: "Add a dimension or modify label type.",
      });
    }
  }
  var mesID = meas[0]["name"];
  var mesData = data[0][mesID];
  var mesLabel =
    meas[0]["label_short"] === undefined
      ? meas[0]["label"]
      : meas[0]["label_short"];
  var mesRendered =
    mesData.rendered === undefined ? mesData.value : mesData.rendered;

  if (config.target_source === "second") {
    if (meas.length < 2) {
      viz.addError({
        title: "Invalid Input.",
        message: "Add a second measure or modify target label source.",
      });
    }
    var tarID = meas[1]["name"];
    var tarData = data[0][tarID];
    var tarValue = tarData.value;
    var tarLabel =
      meas[1]["label_short"] === undefined
        ? meas[1]["label"]
        : meas[1]["label_short"];
    var tarBase =
      tarData.rendered === undefined ? tarData.value : tarData.rendered;
    var tarRendered =
      config.target_value_format === undefined ||
      config.target_value_format === ""
        ? tarBase
        : SSF.format(config.target_value_format, tarValue);
    if (dims.length > 0) {
      var tarDim =
        config.target_label_override === undefined ||
        config.target_label_override === ""
          ? data[0][dimID].value
          : config.target_label_override;
    }
  } else if (config.target_source === "first") {
    if (config.viz_trellis_by === "row") {
      viz.addError({
        title: "Invalid Input.",
        message:
          "This option cannot be applied to a trellis. Please modify target label source.",
      });
    }
    if (data.length < 2) {
      viz.addError({
        title: "Invalid Input.",
        message: "No value to target. Add a second row or modify label type.",
      });
    }
    var tarData = data[1][mesID];
    var tarValue = tarData.value;
    var tarBase =
      tarData.rendered === undefined || tarData.rendered === ""
        ? tarValue
        : tarData.rendered;
    var tarLabel = mesLabel;
    var tarRendered =
      config.target_value_format === undefined ||
      config.target_value_format === ""
        ? tarBase
        : SSF.format(config.target_value_format, tarValue);
    if (dims.length > 0) {
      var tarDim =
        config.target_label_override === undefined ||
        config.target_label_override === ""
          ? data[1][dimID].value
          : config.target_label_override;
    }
  } else if (config.target_source === "override") {
    if (
      config.target_value_override === undefined ||
      config.target_value_override === ""
    ) {
      viz.addError({
        title: "Invalid Input.",
        message:
          "No target override. Add an override value or modify target label source.",
      });
    }
    var tarValue = parseFloat(config.target_value_override);
    var tarBase = tarValue;
    var tarLabel = config.target_label_override;
    var tarRendered =
      config.target_value_format === undefined ||
      config.target_value_format === ""
        ? tarBase
        : SSF.format(config.target_value_format, tarValue);
    if (dims.length > 0) {
      var tarDim =
        config.target_label_override === undefined ||
        config.target_label_override === ""
          ? data[0][dimID].value
          : config.target_label_override;
    }
  }

  let chunk = {
    value: mesData.value,
    value_links: mesData.links,
    value_label:
      config.value_label_override === undefined ||
      config.value_label_override === ""
        ? mesLabel
        : config.value_label_override,
    value_rendered:
      config.value_formatting === undefined || config.value_formatting === ""
        ? mesRendered
        : SSF.format(config.value_formatting, mesData.value),
    value_dimension:
      dims.length > 0
        ? config.value_label_override === undefined ||
          config.value_label_override === ""
          ? data[0][dimID].value
          : config.value_label_override
        : null,
    target: tarValue,
    target_rendered: tarRendered,
    target_label:
      config.target_label_override === undefined ||
      config.target_label_override === ""
        ? tarLabel
        : config.target_label_override,
    target_dimension: tarDim,
  };
  return chunk;
}
// const formattedValue = dataPoints[0].valueFormat === "" ? dataPoints[0].formattedValue : SSF.format(dataPoints[0].valueFormat, dataPoints[0].value)
looker.plugins.visualizations.add({
  id: "gauge",
  label: "Gauge Visualization",
  primary: true,
  options: {
    // PLOT ADVANCED
    arm_length: {
      type: "number",
      label: "Arm Length",
      default: 9,
      section: "Plot",
      display: "range",
      min: 0,
      max: 50,
      step: 0.5,
      order: 200,
      display_size: "half",
    },
    arm_weight: {
      type: "number",
      label: "Thickness",
      default: 48,
      section: "Plot",
      display: "range",
      min: 0,
      max: 100,
      order: 300,
      display_size: "half",
    },
    spinner_length: {
      type: "number",
      label: "Pointer Length",
      default: 153,
      section: "Plot",
      display: "range",
      min: 0,
      max: 200,
      order: 400,
      display_size: "half",
    },
    spinner_weight: {
      type: "number",
      label: "Thickness",
      default: 73,
      section: "Plot",
      display: "range",
      min: 0,
      max: 100,
      default: 25,
      order: 500,
      display_size: "half",
    },
    target_length: {
      type: "number",
      label: "Target Length",
      default: 10,
      section: "Target",
      display: "range",
      min: 0,
      max: 30,
      order: 600,
      display_size: "third",
    },
    target_gap: {
      type: "number",
      label: "Dash Gap",
      default: 10,
      section: "Target",
      display: "range",
      min: 0,
      max: 30,
      order: 610,
      display_size: "third",
    },
    target_weight: {
      type: "number",
      label: "Thickness",
      default: 8,
      section: "Target",
      display: "range",
      min: 0,
      max: 100,
      default: 25,
      order: 700,
      display_size: "third",
    },

    // PLOT
    range_min: {
      type: "number",
      label: "Range Min Override",
      section: "Plot",
      order: 30,
      default: 0,
      display_size: "half",
    },
    range_max: {
      type: "number",
      label: "Range Max Override",
      section: "Plot",
      order: 31,
      default: DEFAULT_MAX_RANGE,
      display_size: "half",
    },
    value_label_type: {
      type: "string",
      label: "Value Label Type",
      display: "select",
      section: "Value",
      values: [
        { "Value and Measure Label": "both" },
        { "Value and Dimension": "dboth" },
        { "Only Value": "value" },
        { "Only Label": "label" },
        { "Only Dimension": "dim" },
        { None: "none" },
      ],
      default: "both",
      order: 40,
    },
    value_label_font: {
      type: "number",
      label: "Value Label Font Size",
      section: "Value",
      default: 12,
      order: 50,
    },
    value_formatting: {
      type: "string",
      label: "Value Formatting Override",
      section: "Value",
      order: 51,
    },
    value_label_override: {
      type: "string",
      label: "Value Label Override",
      section: "Value",
      order: 60,
    },
    value_label_padding: {
      type: "number",
      label: "Value Label Padding",
      default: 45,
      section: "Value",
      display: "range",
      min: 0,
      max: 120,
      order: 70,
    },
    target_source: {
      type: "string",
      label: "Target Source",
      display: "select",
      section: "Target",
      values: [
        { "First Measure": "first" },
        { "Second Measure": "second" },
        { Override: "override" },
        { "No Target": "off" },
      ],
      default: "off",
      order: 80,
    },
    target_label_type: {
      type: "string",
      label: "Target Label Type",
      display: "select",
      section: "Target",
      values: [
        { "Value and Label": "both" },
        { "Only Value": "value" },
        { "Only Label": "label" },
        { "Value and Dimension": "dboth" },
        { "Only Dimension": "dim" },
        { "No Label": "nolabel" },
      ],
      default: "both",
      order: 90,
    },
    target_label_font: {
      type: "number",
      label: "Target Label Font Size",
      section: "Target",
      default: 3,
      order: 100,
    },
    target_label_override: {
      type: "string",
      label: "Target Label Override",
      section: "Target",
      order: 120,
    },
    target_value_override: {
      type: "string",
      label: "Target Value Override",
      section: "Target",
      order: 110,
    },
    target_value_format: {
      type: "string",
      label: "Target Value Formatting",
      section: "Target",
      order: 120,
    },
    label_font_size: {
      type: "number",
      label: "Range Label Font Size",
      section: "Plot",
      default: 3,
      order: 140,
    },
    range_formatting: {
      type: "string",
      label: "Range Label Value Formatting",
      section: "Plot",
      order: 150,
    },
    spinner_type: {
      type: "string",
      label: "Spinner Type",
      display: "select",
      section: "Plot",
      values: [
        { Needle: "needle" },
        { Spinner: "spinner" },
        { Automotive: "auto" },
        { Inner: "inner" },
      ],
      default: "needle",
      order: 151,
    },

    // STYLE
    fill_color: {
      type: "string",
      label: "Gauge Fill Color",
      section: "Style",
      display: "color",
      default: "#0092E5",
      order: 10,
    },
    background_color: {
      type: "string",
      label: "Background Color",
      default: "#CECECE",
      section: "Style",
      display: "color",
      order: 20,
    },
    spinner_color: {
      type: "string",
      label: "Pointer Color",
      default: "#282828",
      section: "Style",
      display: "color",
      order: 30,
    },
    range_color: {
      type: "string",
      label: "Range Label Color",
      default: "#282828",
      section: "Style",
      display: "color",
      order: 40,
    },
    gauge_fill_type: {
      type: "string",
      label: "Gauge Fill Type",
      display: "select",
      section: "Style",
      values: [
        { Progress: "progress" },
        { "Progress Segment": "progress-gradient" },
        { Segment: "segment" },
      ],
      default: "progress",
      order: 1,
    },
    fill_colors: {
      type: "array",
      label: "Gauge Segment Colors",
      section: "Style",
      default: ["#7FCDAE", "#ffed6f", "#EE7772"],
      display: "colors",
      order: 11,
    },
    viz_trellis_by: {
      type: "string",
      label: "Trellis By",
      display: "select",
      section: "Plot",
      values: [{ None: "none" }, { Row: "row" }, { Pivot: "pivot" }],
      default: "none",
      order: 0,
    },
    trellis_rows: {
      type: "number",
      label: "Trellis Rows",
      section: "Plot",
      display_size: "half",
      default: 2,
      order: 1,
    },
    trellis_cols: {
      type: "number",
      label: "Trellis Columns",
      section: "Plot",
      display_size: "half",
      default: 2,
      order: 2,
    },
    angle: {
      type: "number",
      label: "Radial Gauge Angle",
      default: 90,
      section: "Plot",
      display: "range",
      min: 10,
      max: 170,
      order: 10,
    },
    cutout: {
      type: "number",
      label: "Radial Gauge Cutout",
      default: 30,
      section: "Plot",
      display: "range",
      min: 0,
      max: 100,
      order: 20,
    },
    range_x: {
      type: "number",
      label: "Range Width",
      default: 1,
      section: "Plot",
      display: "range",
      min: -2,
      max: 4,
      step: 0.1,
      order: 800,
    },
    range_y: {
      type: "number",
      label: "Range Height",
      default: 1,
      section: "Plot",
      display: "range",
      min: -2,
      max: 4,
      step: 0.1,
      order: 900,
    },
    target_label_padding: {
      type: "number",
      label: "Target Label Padding",
      default: 1.06,
      section: "Target",
      display: "range",
      min: 1,
      max: 2,
      step: 0.01,
      order: 130,
    },
  },
  // Set up the initial state of the visualization
  create: function (element, config) {
    this.container = element;
    this.container.className = "gauge-vis";
    // this.chart = ReactDOM.render(
    //    	<RadialGauge />,
    //    	this.container
    // );
  },
  // Render in response to the data or settings changing
  updateAsync: function (data, element, config, queryResponse, details, done) {
    var margin = { top: 20, right: 20, bottom: 20, left: 20 },
      width = element.clientWidth,
      height = element.clientHeight;

    // Clear any errors from previous updates
    this.clearErrors();

    if (data.length < 1) {
      // Issue identified where viz would not change with table calc filters
      // need to supply the container with something new if we fail early and 
      // don't make it to the inteded render function. 
      // https://looker.atlassian.net/browse/DX-5779
      this.addError({
        title: "No Results",
      })
      done();
      return;
    }

    // Throw some errors and exit if the shape of the data isn't what this chart needs
    if (
      queryResponse.fields.dimension_like.length > 1 ||
      queryResponse.fields.measure_like.length > 2
    ) {
      this.addError({
        title: "Invalid Input.",
        message: "This chart accepts up to 1 dimension and 2 measures.",
      });
      return;
    }

    if (
      config.viz_trellis_by === "pivot" &&
      queryResponse.pivots === undefined
    ) {
      this.addError({
        title: "Invalid Input.",
        message: "Add pivots or change trellis type.",
      });
      return;
    }

    // Catch case where config is undefined on db-next
    const applyDefualtConfig = () => {
      for (let option in this.options) {
        if (config[option] === undefined) {
          config[option] = this.options[option].default;
        }
      }
    };
    // if arm_length is undefined, all other config attributes are.
    if (config.arm_length === undefined) {
      applyDefualtConfig();
    }

    // Extract value, value_label, target, target_label as a chunk
    let chunk;
    let chunk_multiples = [];
    if (config.viz_trellis_by === "row") {
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
    } else if (config.viz_trellis_by === "pivot") {
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
      var len = (num + "").length;
      var fac = Math.pow(10, len - 1);
      let default_max = Math.ceil(num / fac) * fac;
      config.range_max = default_max
    }
    var viz = this;
    if (config.viz_trellis_by === "none") {
      viz.radialProps = {
        cleanup: `gauge`,
        trellis_by: config.viz_trellis_by,
        w: width,
        h: height,
        limiting_aspect: width < height ? "vw" : "vh",
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
        target_background: "#282828",
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
        // console.log(d, i)
        let limit =
          config.viz_trellis_by === "row"
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
          limiting_aspect: width < height ? "vw" : "vh",
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
          target_background: "#282828",
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
