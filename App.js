import {createAppContainer, createStackNavigator} from 'react-navigation';
import HomeScreen from './components/HomeScreen';
import GameView from './components/GameView';

const myNavigator = createStackNavigator({
      HomeScreen: HomeScreen,
      GameView: GameView,
}, {
      navigationOptions: {
            gesturesEnabled: false
          }
})

const App = createAppContainer(myNavigator)

export default App;