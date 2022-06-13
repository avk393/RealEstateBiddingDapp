import React from "react";
import { connect } from "react-redux";
import { DisplayListings } from "../common/DisplayListingCard";
import Spinner from "./Spinner";

class ListingsPage extends React.Component {
  
  render() {
    return (
      <div className="jumbotron">
        <h2>Listings</h2>
        {this.props.openListings ? 
          <DisplayListings listings={this.props.openListings.listing} dispatch={this.props.dispatch}/> :
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
    openListings: state.ethers.listings
  };
}


export default connect(mapStateToProps)(ListingsPage);
