import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, View, Button } from 'react-native';
import { DisplayListingCard } from './DisplayListingCard';
import Spinner from "./Spinner";

function displayListing(props) {
  if(props.listingItem.owner === props.address) {
    return(
      <View> 
        <DisplayListingCard listing={props.listingItem} />
        <Button />
      </View>
    );
  }
  else {
    return(
      <DisplayListingCard listing={props.listingItem} />
    );
  }
}

class Listing extends React.Component {

    render() {
        return(
          <div className="jumbotron">
          <h2>Selected Listing</h2>
          {this.props.listingItem ? 
            displayListing(this.props) :
            <Spinner />
          }
        </div>
        );
    }
}

function findListingItem(listings, listingId){
  console.log(listings);
  return listings.find(listing => listing.id === listingId)
  // searched for closed listings first
  // (listingItem===undefined) closedListings.find(listing => listing.id === listingId)
}

function mapStateToProps(state) {
  const openListingsArray = state.ethers.listings;

  return {
    address: state.ethers.address,
    contract: state.ethers.contract,
    openListings: openListingsArray,
    listingItem: state.ethers.listingId&&state.ethers.listings ?
      findListingItem(openListingsArray.listing, state.ethers.listingId) :
      undefined
  };
}


export default connect(mapStateToProps)(Listing);