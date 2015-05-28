var React   = require('react-native'),
    RNChart = require('react-native-chart');

var { StyleSheet, View, Component, Text, SegmentedControlIOS } = React;

var styles = StyleSheet.create( {
                                  main: {
                                    flexDirection: 'column', height: 100
                                  },
                                  chart: {
                                    position: 'absolute', top: 16, left: 4, bottom: 4,right: 16, backgroundColor: 'white'
                                  }
                                });

var HUMIDITY_URL = 'http://kabouchi.10.162.50.40.xip.io/api/plants/fetch/humidities?method=';
var PARAMS = ['default', 'day', 'month'];

class HumidityChart extends Component {

  constructor(props) {
    super(props);
    this.state = {
      humidities: props.humidities,
      indexes: props.indexes,
      loaded: props.loaded,
      values: props.values,
      value: props.value,
      selectedIndex: props.selectedIndex
    };
  }

  componentDidMount() {
    this.fetchHumidity();
  }

  fetchHumidity() {
    var index = this.state.selectedIndex;
    var HUMIDITY_REQUEST_URL = HUMIDITY_URL + PARAMS[index];
    fetch(HUMIDITY_REQUEST_URL)
      .then((response) => response.json())
      .then((responseData) => {
        var humidities = responseData;
        this.setState({
          humidities: humidities.map( tmp => {
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
          Loading humidities...
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
        type: 'line',
        lineWidth:2,
        showDataPoint: false,
        data: this.state.humidities
      }
    ];

    return (
      <View style={{flexDirection: 'column', height: 700}}>
        <View style={{flex: 9}}>
          <RNChart  style={styles.chart}
                    chartData={chartData}
                    xLabels={this.state.indexes}
                    verticalGridStep={10}
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
      () => { this.fetchHumidity(); }
    );
  }

  _onValueChange(value) {
    this.setState({ value: value, loaded: false },
      () => { this.fetchHumidity(); }
    );
  }
}

HumidityChart.propTypes = {
  humidities: React.PropTypes.array,
  indexes: React.PropTypes.array,
  loaded: React.PropTypes.bool,
  values: React.PropTypes.array,
  value: React.PropTypes.string,
  selectedIndex: React.PropTypes.number
};
HumidityChart.defaultProps =  {
  humidities: [0],
  indexes: [0],
  loaded: false,
  values: ['Hour', 'Day', 'Month'],
  value: 'Not selected',
  selectedIndex: 0
};

class Humidity extends Component {
  render() {
    return (
      <View>
        <HumidityChart/>
      </View>
    );
  }
}

module.exports = Humidity;
