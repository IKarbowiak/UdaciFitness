import React, {Component} from 'react'
import {View, Text, TouchableOpacity} from 'react-native'
import {Ionicons} from '@expo/vector-icons'

import {getMetricMetaInfo, timeToString} from '../utils/helpers'
import UdaciSlider from './UdaciSlider'
import UdaciSteppers from './UdaciSteppers'
import DateHeader from './DateHeader'
import TextButton from './TextButton'
import {submitEntry, removeEntry} from '../utils/api'


function SubmitBtn ({onPress}) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text>Submit</Text>
    </TouchableOpacity>
  )
}

export default class AddEntry extends Component {
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
    this.setState(() => ({
      run: 0,
      bike: 0,
      swim: 0,
      eat: 0,
      sleep: 0,
    }))

    // Navigate to home
    // Save info to database
    submitEntry({key, entry})

    // Add user notification

  }

  reset = () => {
    const key = timeToString()
    // Update redux
  
    // Navigate to home

    // Save info to database
    removeEntry(key)
  }

  render() {
    const metaInfo = getMetricMetaInfo()
    if (this.props.alreadyLogged) {
      return (
        <View>
          <Ionicons
            name="md-happy"
            size={100}
          />
          <Text>You are already logged your information for today</Text>
          <TextButton onPress={this.reset}>
            Reset
          </TextButton>
        </View>
      )
    }

    console.log(metaInfo)

    return (
      <View>
        <DateHeader date={(new Date()).toLocaleDateString()} />
        {/* <Text>{JSON.stringify(this.state)}</Text> */}
        {Object.keys(metaInfo).map((key) => {
          const {getIcon, type, ...rest} = metaInfo[key]
          const value = this.state[key]
          return (
            <View key={key}>
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
