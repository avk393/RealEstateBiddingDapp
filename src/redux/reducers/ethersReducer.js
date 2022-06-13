import * as types from "../actions/actionTypes";

export default function ethersReducer(state = {trash: '5'}, action) {
  switch (action.type) {
    case types.WALLET_LOADED:
      return { address: action.address };
    case types.CONTRACT_LOADED:
      return { ...state, contract: action.contract };
    case types.IMAGE_LOADED:
      return { ...state, image: action.image };
    case types.LISTING_ID_LOADED:
      return { ...state, listingId: action.listingId };
    case types.LISTINGS_LOADED:
      if(state.listings != undefined){
        return { 
          ...state, 
          listings: {
            ...state.listings, 
            listing: [...state.listings.listing, action.listing]
          }
        };
      }
      else {
        return { 
          ...state, 
          listings: {
            listing: [ action.listing ]
          }
        };
      }
    default:
      return state;
  }
}
