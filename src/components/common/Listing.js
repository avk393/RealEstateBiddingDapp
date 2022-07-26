import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, View, Button, TextInput } from 'react-native';
import { DisplayListingCard } from './DisplayListingCard';
import { handleBidChange } from '../interactions';
import Spinner from "./Spinner";


function displayListing(props) {

  // [TODO] Grab highest bid and insert where appropriate
  if(props.listingItem.owner === props.address) {
    // format for owner of selected listing that is still active
    if(props.listingInactive === -1){
      return(
        <View> 
          <DisplayListingCard listing={props.listingItem} />
          <Button title="Close Bidding" />
        </View>
      );
    }
    // format for owner of selected listing that is inactive
    else {
      return(
        <View>
          <DisplayListingCard listing={props.listingItem} />
        </View>
      );
    }
  }
  else {
    // format for user where listing is still active
    if(props.listingInactive === -1){
      return(
        <View>
          <DisplayListingCard listing={props.listingItem} />
          <label>
            Bid Amount (in ETH):
            <TextInput 
              style={styles.input} 
              placeHolder="Place a bid here" 
              onChangeText={(text)=>handleBidChange(props.dispatch, text)}
            />        
          </label>
          <Button />
        </View>
      );
    }
    // format for user where listing is inactive
    else{
      return(
        // [TODO] Check if account is bid winner
        <View>
          <p>Bidding closed!</p>
          <DisplayListingCard listing={props.listingItem} />
        </View>
      );
    }
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
  return listings.find(listing => listing.id === listingId)
}

function mapStateToProps(state) {

  return {
    address: state.ethers.address,
    contract: state.ethers.contract,
    closedListing: state.ethers.closedListings,
    listingItem: state.ethers.listingId&&state.ethers.listings ?
      findListingItem(state.ethers.listings.listing, state.ethers.listingId) :
      undefined,
    listingInactive: state.ethers.closedListings&&state.ethers.listingId ?
      state.ethers.closedListings.closedListing.findIndex(listing => listing.id===state.ethers.listingId) : 
      -1
  };
}

const styles = StyleSheet.create({
  input:{
    width: 800,
    borderColor: "#000000"
  }
});


export default connect(mapStateToProps)(Listing);