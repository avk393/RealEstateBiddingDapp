import React from "react";
import { connect } from "react-redux";
import Spinner from "../common/Spinner";
import { DisplayListings } from "../common/DisplayListingCard";


class HomePage extends React.Component {
  
  render () {
    return (
      <div >
        <h1>Real Estate Bidding Dapp</h1>
          <h2>Your Listings</h2>
            {this.props.openListings&&this.props.address ? 
              <DisplayListings listings={this.props.openListings.listing} dispatch={this.props.dispatch}/> :
              <Spinner />
            }
      </div>
    )
  }
  
}

function mapStateToProps(state) {
  return {
    address: state.ethers.address,
    openListings: state.ethers.listings
  };
}


export default connect(mapStateToProps)(HomePage);
