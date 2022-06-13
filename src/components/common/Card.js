import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Link } from "react-router-dom";
import finalPropsSelectorFactory from 'react-redux/es/connect/selectorFactory';
import { handleCardClick  } from '../interactions';

export function Card(props) {
  
  return(
    <Link to="/listing">
      <View style={styles.card} onClick={() => handleCardClick(props.id, props.dispatch)}>
        <View style={styles.cardContent}>
            { props.children }
        </View>
      </View>
    </Link>
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
    borderColor: '#000000',
    width: 300,
    height: 300
  },
  cardContent: {
    width: 250,
    height: 250,
    marginHorizontal: 18,
    marginVertical: 10,
    borderColor: '#000000',
    cursor: "pointer"
  }
});

export default Card;