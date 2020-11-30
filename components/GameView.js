import React from 'react';
import { StyleSheet, View, Image, Animated, TouchableWithoutFeedback, Text, UIManager, AppState, TouchableOpacity, Modal, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
var i=0, squareIndex, ballIndex, points = 0, yCordinate = 0, angle = 0, maxPoints = 0, isGameOver = false;

// const colorArray = ['red', 'yellow', 'green', 'purple'];
const colorArray = ['#F03858', '#EEC213', '#11BE8B', '#693CB8']

export default class GameView extends React.Component {
      _isMounted = false;

      constructor(props){
            super(props);
            this.moveAnimation = new Animated.ValueXY({ x: 0, y: yCordinate });
            this.state={
                  i:0,
                  squareColor: '#F03858',
                  ballColor: '#EAF0F1',
                  gamePoints: 0,
                  yValue: 0,
                  appState: AppState.currentState,
                  difficiltyTime: 1100,
                  fontIcon1: 'star',
                  fontIcon2: 'star-o',
                  fontIcon3: 'star-o',
                  fontIcon4: 'star-o',
                  fontIcon5: 'star-o',
                  highScore: 0,
                  Alert_Visibility: false, 
            }
      }

      static navigationOptions = {
            header: null
      }

      componentWillMount = () => {
            this.animatedValue = new Animated.Value(0);
            this.getScore()
      }
      componentDidMount = () => {
            this._isMounted = true;
            isGameOver = false;
            AppState.addEventListener('change', this._handleAppStateChange);
            if(this._isMounted)
                  this.randomBallGenarator();
      }
      componentWillUnmount = () => {
            if(!isGameOver) {
                  this.pauseGame();
            }
            AppState.removeEventListener('change', this._handleAppStateChange);
      }

      pressSquare=()=>{
            if(this._isMounted)
            {
                  angle = angle+1;
                  Animated.timing(this.animatedValue, {
                        toValue: angle,
                        duration: 150,
                        useNativeDriver: true
                  }).start()
                  i=(i+90);
                  if(i == 360) {
                        i = 0;
                  }
                  if(i == 0) squareIndex = 0;
                  else if(i == 90) squareIndex = 1;
                  else if(i == 180) squareIndex = 2;
                  else if(i == 270) squareIndex = 3; 
                  if(this._isMounted)           
                  this.setState({
                        squareColor: colorArray[squareIndex],
                        i,
                  })
            }  
      }

      changeBallPosition = (yCordinate) => {
            if(this._isMounted) {
                  Animated.timing(this.moveAnimation, {
                        duration: this.state.difficiltyTime,
                        toValue: {x: 0, y: yCordinate},
                  }).start();            
            }        
      };

      randomBallGenarator=()=>{
                  interval = setInterval(() => {
                        this.changeBallPosition(yCordinate);
                        if(yCordinate == 0 ){                                                            
                              yCordinate = (this.state.yValue);
                              this.hitBall();
                              this.setState({
                                    ballColor: '#EAF0F1'
                              });
                        }
                        else if(yCordinate == (this.state.yValue)){                                
                              yCordinate = 0;
                              ballIndex = Math.floor(Math.random() * 4)
                              this.setState({
                                    ballColor: colorArray[ballIndex]
                              });
                        }
                  }, this.state.difficiltyTime);
      };    

      hitBall = () => {
            //Match same color of ball and square and add to points
            if(this._isMounted) {
                  if( this.state.squareColor == this.state.ballColor ){
                        points++;
                        maxPoints = maxPoints > points ? maxPoints : points
                        this.setState({
                              gamePoints: points,
                              highScore: maxPoints,
                        })
                        this.setScore();
                  }
                  else {
                        if(points > 0){
                              points--;
                              if (points === 0) {
                                    this.gameOver();
                                    this.Show_Custom_Alert(true);
                              }
                        }
                        else {
                              points = 0;
                        }
                        this.setState({
                              gamePoints: points,
                        })
                  }
                  if(this.state.gamePoints > 0 && this.state.gamePoints < 20){
                        this.setState({
                              difficiltyTime: 1000,
                              fontIcon2: 'star-o',
                              fontIcon3: 'star-o',
                              fontIcon4: 'star-o',
                              fontIcon5: 'star-o',
                        })
                  }
                  if(this.state.gamePoints >= 20 && this.state.gamePoints < 50){
                        this.setState({
                              difficiltyTime: 1000,
                              fontIcon2: 'star',
                              fontIcon3: 'star-o',
                              fontIcon4: 'star-o',
                              fontIcon5: 'star-o',
                        })
                  }
                  else if (this.state.gamePoints >= 50 && this.state.gamePoints < 80) {
                        this.setState({
                              difficiltyTime: 900,
                              fontIcon2: 'star',
                              fontIcon3: 'star',
                              fontIcon4: 'star-o',
                              fontIcon5: 'star-o',
                        })
                  }
                  else if (this.state.gamePoints >= 80 && this.state.gamePoints < 120) {
                        this.setState({
                              difficiltyTime: 800,
                              fontIcon2: 'star',
                              fontIcon3: 'star',
                              fontIcon4: 'star',
                              fontIcon5: 'star-o',
                        })
                  }
                  else if (this.state.gamePoints >= 120) {
                        this.setState({
                              difficiltyTime: 700,
                              fontIcon2: 'star',
                              fontIcon3: 'star',
                              fontIcon4: 'star',
                              fontIcon5: 'star',
                        })
                  }
            }
      }

      setScore = async () => {
            try{
                  await AsyncStorage.setItem('highScoreKey', `${this.state.highScore}`);
            }
            catch(error){
                  
            }
      }

      getScore = async() => {
            try {
                  maxPoints = await AsyncStorage.getItem('highScoreKey');
                  if (maxPoints !== null) {
                    this.setState({highScore: maxPoints})
                  }
                } catch (error) {
                  // Error retrieving data
                }
      } 

      gameOver = () => {
            clearInterval(interval);
            i = 0, yCordinate = 0, angle = 0, points = 0;            
            if(this._isMounted) {
                  Animated.timing(this.animatedValue, {
                        toValue: angle,
                        duration: 0,
                        useNativeDriver: true
                  }).start()
                  this.setState({ 
                        i:0,
                        squareColor: '#F03858',
                        ballColor: '#EAF0F1',
                        gamePoints: 0,
                        difficiltyTime: 1100,
                        fontIcon1: 'star',
                        fontIcon2: 'star-o',
                        fontIcon3: 'star-o',
                        fontIcon4: 'star-o',
                  });                  
            }
            this.forceUpdate();
      }

      Show_Custom_Alert = (visible) => {
            if(this._isMounted)
                  this.setState({Alert_Visibility: visible});
      }

      goBackHome = () => {
            isGameOver = true;
            this._isMounted = false;
            this.Show_Custom_Alert(!this.state.Alert_Visibility)
            this.props.navigation.goBack();
      }

      pauseGame = () => {
            clearInterval(interval);
            i = 0, yCordinate = 0, angle = 0, points == 0 ? 0 : points++;            
            if(this._isMounted) {
                  Animated.timing(this.animatedValue, {
                        toValue: angle,
                        duration: 0,
                        gamePoints: points,
                        useNativeDriver: true
                  }).start()
                  this.setState({ 
                        i:0,
                        squareColor: '#F03858',
                        ballColor: '#EAF0F1',
                  });                  
            }
            this.setScore()
            this.forceUpdate();
            this._isMounted = false;
            // this.props.navigation.replace('HomeScreen');
      }

      onLayout = (e) => {
            if(this._isMounted)
            this.setState({
              yValue: (e.nativeEvent.layout.y + 5) ,
            });
      }
      _handleAppStateChange = (nextAppState) => {
             if ( this.state.appState.match(/inactive|background/) && nextAppState === 'active' ) {
                         this.pauseGame();
             }
             if(this._isMounted)
                  this.setState({appState: nextAppState});
          };

      render() {
            const interpolateRotation = this.animatedValue.interpolate({
                  inputRange: [0, 1, 2, 3, 4 ],
                  outputRange: ['0deg', '90deg', '180deg','270deg', '360deg'],
                })
            const animatedStyle = {
                  transform: [
                    { rotate: interpolateRotation }
                  ]
            }
      return (
            <View style={styles.container}>
                  <StatusBar backgroundColor = {'#EAF0F1'} barStyle = {'dark-content'} />
                  <Modal
                  visible={this.state.Alert_Visibility}
                  transparent={true}
                  animationType={"fade"}
                  onRequestClose={ () => { this.Show_Custom_Alert(!this.state.Alert_Visibility)} } >
                        <View style={{ flex:1, alignItems: 'center', justifyContent: 'center',  }}>
                        <View style={styles.Alert_Main_View}>
                              <Text style={styles.Alert_Title}>GAME OVER</Text>
                              <View style={styles.optionButtons}>
                                    <TouchableOpacity 
                                          style={styles.playAgainButton}
                                          onPress={() => { 
                                                this.Show_Custom_Alert(!this.state.Alert_Visibility);
                                                if(this._isMounted)
                                                      this.randomBallGenarator();
                                                } 
                                          } 
                                          activeOpacity={0.7} 
                                    >
                                                <Text style={styles.playAgainButtonText}> Play again </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                          style={styles.homeButton} 
                                          onPress={this.goBackHome}
                                          activeOpacity={0.7} 
                                    >
                                                <Text style={styles.homeButtonText}> Home </Text>
                                    </TouchableOpacity>
                              </View>
                        </View>
                        </View>
                  </Modal>
                  <View style = {[styles.scoreArea, {top: 0} ]}>
                        <View style = {styles.starRow}>
                              <FontAwesome name = {this.state.fontIcon1} color = {'#E5B143'} size={30}/>
                              <FontAwesome name = {this.state.fontIcon2} color = {'#E5B143'} size={30}/>
                              <FontAwesome name = {this.state.fontIcon3} color = {'#E5B143'} size={30}/>
                              <FontAwesome name = {this.state.fontIcon4} color = {'#E5B143'} size={30}/>
                              <FontAwesome name = {this.state.fontIcon5} color = {'#E5B143'} size={30}/>
                        </View>
                        <Text style = {styles.scoreText}>Score: {this.state.gamePoints}</Text>
                  </View>
                  <View style = {styles.ballArea} >
                        <Animated.View 
                              style = {[styles.ball, {backgroundColor: this.state.ballColor}, this.moveAnimation.getLayout()]}
                        ></Animated.View>
                  </View>
                  <TouchableWithoutFeedback onPress={this.pressSquare}>
                        <View style={styles.square}>
                              <Animated.Image
                              style={[styles.squareImage, animatedStyle ]}
                              source={require('../assets/mySquare.png')} 
                              />
                              <View style = {styles.dot} onLayout={this.onLayout}></View>
                        </View>
                  </TouchableWithoutFeedback>
            </View>
      );
      }
}

const styles = StyleSheet.create({
      container: {
            flex: 1,
            backgroundColor: '#EAF0F1',
            alignItems: 'center',
      },
      scoreArea:{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
            width: '100%',
            backgroundColor: '#EAF0F1',
            paddingHorizontal: 8
      },
      scoreText:{
            fontSize: 23,
            fontWeight: 'bold',
            color: '#3C40C6',
            paddingHorizontal: 10,
            alignSelf: 'center'
      },
      ballArea:{
            flex: 5,
            backgroundColor: '#EAF0F1',
            width: '100%',
            alignItems: 'center',
      },
      ball: {
            height: 30,
            width: 30,
            borderRadius: 15,
      },
      square:{
            flex: 5,
            alignItems: 'center',
            backgroundColor: '#EAF0F1',
            height: '100%',
            width: '100%',
      },
      squareImage:{
            height: 200,
            width: 200,
      },
      dot: {
            width: 5,
            height: 5,
            backgroundColor: '#EAF0F1',
            alignSelf: 'flex-end',
            bottom: 0,
            position: 'absolute'
      },
      starRow:{
            flexDirection: 'row',
      },
      pauseContainer:{
            backgroundColor: '#3C40C6',
            height: 35,
            width: 35,
            borderRadius: 8,
            alignItems: 'center',
            justifyContent: 'center',
      },

      Alert_Main_View:{
            paddingVertical: 10,
            alignItems: 'center',
            backgroundColor: '#c3c4ed',
            width: '80%',
            borderWidth: 2,
            borderColor: '#3C40C6',
            borderRadius:20,
      },
      Alert_Title:{
            fontSize: 26, 
            color:'#3C40C6',
            fontFamily: 'sans-serif',
            fontWeight: 'bold'
      },
      optionButtons:{
            marginTop: 10
      },
      playAgainButton: {
              borderWidth: 2,
              borderRadius: 10,
              borderColor: '#3C40C6',
              paddingVertical: 10,
              paddingHorizontal: 20,
              marginVertical: 5,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#3C40C6',
      },
      homeButton: {
              borderWidth: 2,
              borderRadius: 10,
              paddingVertical: 5,
              paddingHorizontal: 10,
              marginVertical: 5,
              justifyContent: 'center',
              alignItems: 'center',
              borderColor: '#3C40C6',
      },
      playAgainButtonText:{
              color:'#fff',
              textAlign:'center',
              fontFamily: 'sans-serif',
              fontSize: 25,
              marginTop: -5
      },
      homeButtonText:{
              color:'#3C40C6',
              textAlign:'center',
              fontFamily: 'sans-serif',
              fontSize: 20,
              marginTop: -5
      }
});