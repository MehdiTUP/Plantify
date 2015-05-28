var React = require('react-native');
var RNChart = require('react-native-chart');

var {
    StyleSheet, View, Component, Text
} = React;

var styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white',
  },
  chart: {
    position: 'absolute', top: 16, left: 4, bottom: 4,right: 16
  }
});

var SUNSHINE_URL = 'http://plantify.herokuapp.com/api/plants/fetch/lightnesses';
var PARAMS = '';
var SUNSHINE_REQUEST_URL = SUNSHINE_URL + PARAMS;

class SunshineChart extends Component {

  constructor(props) {
    super(props);
    this.state = {
      lightnesses: props.lightnesses,
      indexes: props.indexes,
      loaded: props.loaded,
    };
  }

  componentDidMount() {
    this.fetchSunshine();
  }

  fetchSunshine() {
    fetch(SUNSHINE_REQUEST_URL)
      .then((response) => response.json())
      .then((responseData) => {
        var lightnesses = responseData;
        this.setState({
          lightnesses: lightnesses.map( tmp => {
            return tmp.value.lightness;
          }),
          indexes: responseData.map( function (value, index) {
            return String(index);
          }),
          loaded: true
        });
      })
      .done();
  }

  renderLoadingView() {
    return (
      <View style={styles.container}>
        <Text>
          Loading data...
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
        data: this.state.lightnesses
      }
    ];

    return (
      <View style={styles.container}>
        <RNChart  style={styles.chart}
                  chartData={chartData}
                  xLabels={this.state.indexes}
                  verticalGridStep={10}
                  labelTextColor={'black'}>
        </RNChart>
      </View>
    );
  }
}

SunshineChart.propTypes = {
                          lightnesses: React.PropTypes.array,
                          indexes: React.PropTypes.array,
                          loaded:       React.PropTypes.bool
                        };
SunshineChart.defaultProps =  {
                              lightnesses: [0],
                              indexes: [0],
                              loaded: false
                            };

class Sunshine extends Component {
  render() {
    return (
      <SunshineChart/>
    );
  }
}

module.exports = Sunshine;
