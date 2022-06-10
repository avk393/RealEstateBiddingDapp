import React from "react";
import { StyleSheet, View } from 'react-native';
import Card from './Card';

export const DisplayListings = ({ listings }) => (
    <View>
    {
        listings.map((listing) => {
            return(
                <Card key={listing.id} id={listing}>
                    <p>{listing.address}</p>
                    <img src={`https://gateway.pinata.cloud/ipfs/${listing.pictures[0]}`}></img>
                </Card>
            )
        })
    }
    </View>
);

export const DisplayListingCard = ({ listing }) => (
    <img src={`https://gateway.pinata.cloud/ipfs/${listing.pictures[0]}`}></img>
);
