'use strict';

var React       = require('react-native'),
    Temperature = require('./temperature.ios'),
    Humidity    = require('./humidity.ios'),
    Sunshine    = require('./sunshine.ios');

var {
  AppRegistry,
  TabBarIOS,
  Component,
  Text
} = React;

class PlantifyTabs extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 'temperature'
    };
  }

  render() {
    return(
      <TabBarIOS selectedTab={this.state.selectedTab}>
        <TabBarIOS.Item
          title="Index"
          selected={this.state.selectedTab === 'index'}
          onPress={() => {
              this.setState({
                  selectedTab: 'index',
              });
          }}>
          <Text>Nothing</Text>
        </TabBarIOS.Item>
        <TabBarIOS.Item
          title="Temperature"
          selected={this.state.selectedTab === 'temperature'}
          onPress={() => {
              this.setState({
                  selectedTab: 'temperature',
              });
          }}>
          <Temperature/>
        </TabBarIOS.Item>
        <TabBarIOS.Item
          title="Humidity"
          selected={this.state.selectedTab === 'humidity'}
          onPress={() => {
                this.setState({
                    selectedTab: 'humidity',
                });
          }}>
          <Humidity/>
        </TabBarIOS.Item>
        <TabBarIOS.Item
          title="Sunshine"
          selected={this.state.selectedTab === 'sunshine'}
          onPress={() => {
              this.setState({
                  selectedTab: 'sunshine',
              });
          }}>
          <Sunshine/>
        </TabBarIOS.Item>
      </TabBarIOS>
    );
  }
}

class Plantify extends Component {
  render() {
    return(<PlantifyTabs/>);
  }
}

AppRegistry.registerComponent('Plantify', () => Plantify);
