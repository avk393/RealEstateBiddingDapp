import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Route, Routes } from "react-router-dom";
import HomePage from "./home/HomePage";
import AboutPage from "./about/AboutPage";
import HeaderForm from "./common/Header";
import PageNotFound from "./PageNotFound";
import ListingsPage from "./common/ListingsPage";
import Listing from './common/Listing';
import Header from './Header';
import { connect } from 'react-redux';
import { loadBlockchain, handleCardClick } from './interactions';
import { Dimensions } from 'react-native';
const windowWidth = Dimensions.get('window').width;

// [TODO] Script a bid and close bid
// [TODO] Filter bids by my/open listings and open/closed bids
// [TODO] Place/Close bid logic
// [TODO] Create listing page that can post to ipfs
// [TODO] Sort through lisitngs to show "My Listings" on home page
// [TODO] Create subscribe to events for dynamic rendering

class App extends React.Component {
  componentDidMount() {
    if(typeof window.ethereum !== 'undefined'){
      this.loadBlockchainData(this.props.dispatch)
    } 
    else {
      window.alert('Please install MetaMask');
      window.location.assign("https://metamask.io/");
    }
  }

  async loadBlockchainData(dispatch) {
    await loadBlockchain(dispatch);
  }

  render() {
    return (
      <View style={{width: windowWidth}}>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/listings" element={<ListingsPage />} />
          <Route path="/listing" element={<Listing />} />
          <Route component={PageNotFound} />
        </Routes>
        <StatusBar style="auto" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default connect()(App);