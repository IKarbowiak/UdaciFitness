import * as React from 'react'
import { 
  View,
  Text,
  StyleSheet,
} from 'react-native'
import {createStore} from 'redux'
import {Provider} from 'react-redux'

import AddEntry from './components/AddEntry'
import reducer from './reducers'


export default class App extends React.Component {
  render () {
    return (
      <Provider store={createStore(reducer)}>
        <View style={styles.container}>
          <AddEntry />
        </View>
      </Provider>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: '#fff',
    alignItems: 'stretch',
    justifyContent: 'center',
  },
});
