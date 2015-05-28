'use strict';
/*DEPENDENCIES*/
var React                                                       = require('react-native'),
    RNChart                                                     = require('react-native-chart'),
    { StyleSheet, View, Component, Text, SegmentedControlIOS }  = React;
/*STYLES*/
var styles = StyleSheet.create( {
                                  main: {
                                    flexDirection: 'column', height: 100
                                  },
                                  chart: {
                                    position: 'absolute', top: 16, left: 4, bottom: 4,right: 16, backgroundColor: 'white'
                                  }
                                });

/*CONSTANTS*/
var TEMPERATURE_URL = 'http://kabouchi.10.162.50.40.xip.io/api/plants/fetch/temperatures?method=';
var PARAMS = ['default', 'day', 'month'];

/*COMPONENTS*/
class TemperatureChart extends Component {

  constructor(props) {
    super(props);
    this.state = {
      temperatures: props.temperatures,
      indexes: props.indexes,
      loaded: props.loaded,
      values: props.values,
      value: props.value,
      selectedIndex: props.selectedIndex
    };
  }

  componentDidMount() {
    this.fetchTemperature();
  }

  fetchTemperature() {
    var index = this.state.selectedIndex;
    var TEMPERATURE_REQUEST_URL = TEMPERATURE_URL + PARAMS[index];
    fetch(TEMPERATURE_REQUEST_URL)
      .then((response) => response.json())
      .then((responseData) => {
        var temperatures = responseData;
        this.setState({
          temperatures: temperatures.map( tmp => {
            return tmp.value;
          }),
          indexes: responseData.map( function (tmp) {
            var date = null;
            switch(PARAMS[index]) {
              case 'default':
                var tmp = new Date(tmp.timestamp);
                date = String(tmp.getHours());
                break;
              case 'day':
                var tmp = new Date(tmp.timestamp);
                date = String(tmp.getHours());
                break;
              case 'month':
                var tmp = new Date(tmp.timestamp);
                date = String(tmp.getDate());
                break;
            }
            return date;
          }),
          loaded: true
        });
      })
      .done();
  }

  renderLoadingView() {
    return (
      <View style={styles.main}>
        <Text>
          Loading temperatures...
        </Text>
      </View>
    );
  }

  render() {
    if (!this.state.loaded) {
      return this.renderLoadingView();
    }

    var chartData = [
      {
        name:'LineChart',
        fillColor:'lightgray',
        dataPointColor: '#ff0000',
        dataPointFillColor: '#ff0000',
        type: 'line',
        lineWidth:2,
        showDataPoint: false,
        data: this.state.temperatures
      }
    ];

    return (
      <View style={{flexDirection: 'column', height: 700}}>
        <View style={{flex: 9}}>
          <RNChart
            style={styles.chart}
            chartData={chartData}
            xLabels={this.state.indexes}
            verticalGridStep={10}
            labelFontSize={10}
            labelTextColor={'black'}>
          </RNChart>
        </View>
        <View style={{flex: 1}}>
          <SegmentedControlIOS
            values={this.state.values}
            selectedIndex={this.state.selectedIndex}
            onChange={this._onChange.bind(this)}
            onValueChange={this._onValueChange.bind(this)}
          />
        </View>
      </View>
    );
  }

  _onChange(event) {
    this.setState(
      { selectedIndex: event.nativeEvent.selectedSegmentIndex, loaded: false},
      () => { this.fetchTemperature(); }
    );
  }

  _onValueChange(value) {
    this.setState({ value: value, loaded: false },
      () => { this.fetchTemperature(); }
    );
  }
}

TemperatureChart.propTypes = {
  temperatures: React.PropTypes.array,
  indexes: React.PropTypes.array,
  loaded: React.PropTypes.bool,
  values: React.PropTypes.array,
  value: React.PropTypes.string,
  selectedIndex: React.PropTypes.number
};
TemperatureChart.defaultProps =  {
  temperatures: [0],
  indexes: [0],
  loaded: false,
  values: ['Hour', 'Day', 'Month'],
  value: 'Not selected',
  selectedIndex: 0
};

class Temperature extends Component {
  render() {
    return (
      <View>
        <TemperatureChart/>
      </View>
    );
  }
}

module.exports = Temperature;
