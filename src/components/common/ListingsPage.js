import React from "react";
import { connect } from "react-redux";
import { DisplayListings } from "../common/DisplayListingCard";
import Spinner from "./Spinner";

class ListingsPage extends React.Component {
  
  render() {
    return (
      <div className="jumbotron">
        <h2>Your Listings</h2>
        {this.props.listings&&this.props.address ? 
          <DisplayListings listings={this.props.listings} dispatch={this.props.dispatch}/> :
          <Spinner />
        }
      </div>
    );
  }
}


function mapStateToProps(state) {
  return {
    address: state.ethers.address,
    listings: state.ethers.listings ?
      state.ethers.listings.listing.filter((listing) => listing.owner===state.ethers.address) :
      undefined
  };
}


export default connect(mapStateToProps)(ListingsPage);
