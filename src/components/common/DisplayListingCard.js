import React from "react";
import { StyleSheet, View } from 'react-native';
import Card from './Card';

export const DisplayListings = ({ listings, dispatch }) => (
    <View>
    {
        listings.map((listing) => {
            return(
                <Card key={listing.id} id={listing.id} dispatch={dispatch}>
                    <p>{listing.address}</p>
                    <img src={`https://gateway.pinata.cloud/ipfs/${listing.pictures[0]}`}></img>
                </Card>
            )
        })
    }
    </View>
);

export const DisplayListingCard = ({ listing }) => (
    <View>
        <p>{listing.address}</p>
        <p>{listing.price}</p>
        <p>{listing.year}</p>
        <p>{listing.sqft}</p>
        {
            listing.pictures.map((pic) => {
                return(
                    <View key={pic} style={styles.card} >
                        <View style={styles.cardContent}>
                            { <img src={`https://gateway.pinata.cloud/ipfs/${pic}`}></img> }
                        </View>
                    </View>
                );
            })
        }
    </View>
);

export const styles = StyleSheet.create({
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
      height: 275
    },
    cardContent: {
      width: 250,
      height: 200,
      marginHorizontal: 18,
      marginVertical: 10,
      borderColor: '#000000',
      //cursor: "pointer"
    }
  });