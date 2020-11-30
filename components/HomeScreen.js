import * as React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default class HomeScreen extends React.Component {

      constructor(props) {
            super(props);
            this.state = {
                  highScore: '0',
                  level: 1
            }
      }

      static navigationOptions = {
            header: null
      }

      componentWillMount = () => {
            this.props.navigation.addListener('willFocus', () => {
                  this.getScore();
            })
      }

      getScore = async () => {
            try {
                  const highScore = await AsyncStorage.getItem('highScoreKey');
                  if (highScore !== null) {
                        this.setState({
                              highScore,
                              level: (highScore < 20) ?
                                    1 : (highScore >= 20 && highScore < 50) ?
                                          2 : (highScore >= 50 && highScore < 80) ?
                                                3 : (highScore >= 80 && highScore < 120) ?
                                                      4 : (highScore >= 120) ?
                                                            5 : 0
                        })
                  }
            } catch (error) {
                  // Error retrieving data
            }
      }

      render() {
            return (
                  <View style={styles.container}>
                        <StatusBar backgroundColor={'#EAF0F1'} barStyle={'dark-content'} />
                        <View style={{ flex: 6 }}>
                              <Text style={styles.headerText}>Square Rush</Text>
                              <View style={styles.scoreContainer}>
                                    <Text style={styles.bestScoreText}>BEST SCORE</Text>
                                    <Text style={styles.scoreText}>{this.state.highScore}</Text>
                                    <Text style={styles.bestScoreText}>LEVEL: {this.state.level}</Text>
                              </View>
                        </View>
                        <View style={{ flex: 4 }}>
                              <TouchableOpacity
                                    onPress={() => { this.props.navigation.navigate('GameView') }}
                                    style={styles.playButton}>
                                    <View style={styles.playIcon}>
                                          <FontAwesome name={'play-circle'} color={'#c3c4ed'} size={90}></FontAwesome>
                                    </View>
                              </TouchableOpacity>
                        </View>
                  </View>
            );
      }
}

const styles = StyleSheet.create({
      container: {
            flex: 1,
            backgroundColor: '#EAF0F1',
            padding: 8,
      },
      headerText: {
            color: '#3C40C6',
            fontSize: 50,
            alignSelf: 'center',
            marginTop: 30,
            paddingHorizontal: 20,
            paddingVertical: 10,
            fontFamily: 'KaushanScript-Regular',
      },
      playButton: {
            alignSelf: 'center',
      },
      scoreContainer: {
            alignSelf: 'center',
            paddingHorizontal: 15,
            marginTop: 10,
            alignItems: 'center'
      },
      scoreText: {
            color: '#E8290B',
            alignSelf: 'center',
            fontSize: 30,
            fontWeight: 'bold',
            paddingHorizontal: 10,
      },
      bestScoreText: {
            fontSize: 15,
            color: '#E8290B',
      },
      playIcon: {
            backgroundColor: '#3C40C6',
            height: 90,
            width: 90,
            borderRadius: 45,
            alignItems: 'center',
            justifyContent: 'center'
      }
});