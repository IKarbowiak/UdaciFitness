import React, {Component} from 'react'
import {View, Text, StyleSheet} from 'react-native'
import {connect} from 'react-redux'

import MetricCard from './MetricCard'
import { white } from '../utils/colors'

class EntryDetail extends Component {

  setTitle = (entryId) => {
    if (!entryId) return;

    const year = entryId.slice(0, 4)
    const month = entryId.slice(5, 7)
    const day = entryId.slice(8)

    this.props.navigation.setOptions({
        title: `${month}/${day}/${year}`
    });
  }
  render() {
    const {entryId, metrics, formattedDate} = this.props
    this.setTitle(entryId);
    return (
      <View style={styles.container}>
        <MetricCard metrics={metrics} date={formattedDate}/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: white,
    padding: 15
  }
})

function mapStateToProps(state, {route}) {
  const {entryId, formattedDate} = route.params
  return {
    entryId,
    formattedDate,
    metrics: state[entryId],
  }
}

export default connect(mapStateToProps)(EntryDetail)
