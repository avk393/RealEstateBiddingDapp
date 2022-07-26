import React from "react";
import { connect } from "react-redux";
import Spinner from "../common/Spinner";
import { DisplayListings } from "../common/DisplayListingCard";


class HomePage extends React.Component {
  
  render () {
    return (
      <div >
        <h1>Real Estate Bidding Dapp</h1>
          <h2>Listings</h2>
            {this.props.listings ? 
              <DisplayListings listings={this.props.listings.listing} dispatch={this.props.dispatch}/> :
              <Spinner />
            }
      </div>
    )
  }
  
}

function mapStateToProps(state) {
  return {
    address: state.ethers.address,
    listings: state.ethers.listings
  };
}


export default connect(mapStateToProps)(HomePage);
