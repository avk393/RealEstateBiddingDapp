import React from 'react';
import { View, ScrollView, StyleSheet, Image } from 'react-native';
import finalPropsSelectorFactory from 'react-redux/es/connect/selectorFactory';


export function Card(props) {
  return(
    <View style={styles.card} onClick={() => console.log(props.id)}>
      <View style={styles.cardContent}>
        { props.children }
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card:{
    borderRadius: 6,
    elevation: 3,
    backgroundColor: '#fff',
    shadowOffset: { width: 1, height: 1 },
    shadowColor: '#333',
    shadowOpacity: 0.3,
    shadowRadius: 2,
    marginHorizontal: 4,
    marginVertical: 6,
    borderColor: '#000000'
  },
  cardContent: {
    width: 250,
    height: 250,
    marginHorizontal: 18,
    marginVertical: 10,
    borderColor: '#000000'
  }
});

export default Card;