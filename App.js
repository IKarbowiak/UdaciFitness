import * as React from 'react'
import { 
  View,
  Text,
  StyleSheet,
} from 'react-native'
import AddEntry from './components/AddEntry'


export default class App extends React.Component {
  render () {
    return (
      <View style={styles.container}>
        <AddEntry />
      </View>
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
