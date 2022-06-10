import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { View } from 'react-native';
import PropTypes from "prop-types";
import Spinner from "../common/Spinner";
import { DisplayListings } from "../common/DisplayListingCard";
import Cards from "../common/Card";


class HomePage extends React.Component {
  
  render () {
    return (
      <div className="jumbotron">
        <h1>Real Estate Bidding Dapp</h1>
          <h2>Your Listings</h2>
            {this.props.listings&&this.props.address ? 
              <DisplayListings listings={this.props.listings.listing} /> :
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
