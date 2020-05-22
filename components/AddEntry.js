import React, {Component} from 'react'
import {View, Text, TouchableOpacity, Platform, StyleSheet} from 'react-native'
import {Ionicons} from '@expo/vector-icons'
import {connect} from 'react-redux'
import {CommonActions} from '@react-navigation/native'

import {getMetricMetaInfo, timeToString, getDailyReminderValue} from '../utils/helpers'
import UdaciSlider from './UdaciSlider'
import UdaciSteppers from './UdaciSteppers'
import DateHeader from './DateHeader'
import TextButton from './TextButton'
import {submitEntry, removeEntry} from '../utils/api'
import {addEntry} from '../actions'
import {white, purple} from '../utils/colors'


function SubmitBtn ({onPress}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={Platform.OS === 'ios' ? styles.iosSubmitBtn : styles.androidSubmitBtn}
    >
      <Text style={styles.submitBtnText}>SUBMIT</Text>
    </TouchableOpacity>
  )
}

class AddEntry extends Component {
  state = {
    run: 0,
    bike: 0,
    swim: 0,
    eat: 0,
    sleep: 0,
  }

  increment = (metric) => {
    const {max, step} = getMetricMetaInfo(metric)

    this.setState((currState) => {
      const count = currState[metric] + step

      return {
        ...currState,
        [metric]: count > max ? max : count
      }
    })
  }

  decrement = (metric) => {
    this.setState((currState) => {
      const count = currState[metric] - getMetricMetaInfo(metric).step

      return {
        ...currState,
        [metric]: count < 0 ? 0 : count
      }
    })
  }

  slide = (metric, value) => {
    this.setState(() => ({
      [metric]: value
    }))
  }

  submit = () => {
    const key = timeToString()
    const entry = this.state

    // Update redux
    this.props.dispatch(addEntry({
      [key]: entry
    }))
  
    this.setState(() => ({
      run: 0,
      bike: 0,
      swim: 0,
      eat: 0,
      sleep: 0,
    }))

    // Navigate to home
    this.toHome()

    // Save info to database
    submitEntry({key, entry})

    // Add user notification

  }

  reset = () => {
    const key = timeToString()
    // Update redux
    this.props.dispatch(addEntry({
      [key]: getDailyReminderValue()
    }))
    // Navigate to home
    this.toHome()

    // Save info to database
    removeEntry(key)
  }

  toHome = () => {
    this.props.navigation.dispatch(
        CommonActions.goBack({
            key: 'AddEntry',
        }))
  }

  render() {
    const metaInfo = getMetricMetaInfo()
    if (this.props.alreadyLogged) {
      return (
        <View style={styles.center}>
          <Ionicons
            name={Platform.OS === 'ios' ? 'ios-happy' : "md-happy"}
            size={100}
          />
          <Text>You are already logged your information for today</Text>
          <TextButton style={{padding: 10}} onPress={this.reset}>
            Reset
          </TextButton>
        </View>
      )
    }

    console.log(metaInfo)

    return (
      <View style={styles.container}>
        <DateHeader date={(new Date()).toLocaleDateString()} />
        {Object.keys(metaInfo).map((key) => {
          const {getIcon, type, ...rest} = metaInfo[key]
          const value = this.state[key]
          return (
            <View key={key} style={styles.row}>
              {getIcon()}
              {type === 'slider'
                ? <UdaciSlider
                    value={value}
                    onChange={(value) => this.slide(key, value)}
                    {...rest}
                  />
                : <UdaciSteppers
                    value={value}
                    onIncrement={() => this.increment(key)}
                    onDecrement={() => this.decrement(key)}
                    {...rest}
                  />}
            </View>
          )
        })}
        <SubmitBtn onPress={this.submit}/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 50, //  I changed itE
    backgroundColor: white,
  },
  row: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  iosSubmitBtn: {
    backgroundColor: purple,
    padding: 10,
    borderRadius: 7,
    height: 45,
    marginLeft: 40,
    marginRight: 40,
  },
  androidSubmitBtn: {
    backgroundColor: purple,
    padding: 10,
    paddingLeft: 30,
    paddingRight: 30,
    height: 45,
    borderRadius: 2,
    alignSelf: 'flex-end',
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitBtnText: {
    color: white,
    fontSize: 22,
    textAlign: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 30,
    marginRight: 30,
  }
})

function mapToStateProps(state) {
  const key = timeToString()
  return {
    alreadyLogged: state[key] && typeof state[key].today === 'undefined'
  }
}

export default connect(mapToStateProps)(AddEntry)
