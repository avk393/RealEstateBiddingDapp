import React from "react";
import { connect } from "react-redux";
import { DisplayListings } from "../common/DisplayListingCard";
import Spinner from "./Spinner";

class ListingsPage extends React.Component {
  
  render() {
    return (
      <div className="jumbotron">
        <h2>Listings</h2>
        {this.props.listings ? 
          <DisplayListings listings={this.props.listings.listing} /> :
          <Spinner />
        }
      </div>
    );
  }
}



function mapStateToProps(state) {
  return {
    address: state.ethers.address,
    contract: state.ethers.contract,
    listings: state.ethers.listings
  };
}


export default connect(mapStateToProps)(ListingsPage);
