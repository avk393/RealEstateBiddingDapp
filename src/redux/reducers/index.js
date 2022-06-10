import { combineReducers } from "redux";
import ethers from "./ethersReducer";

const rootReducer = combineReducers({
  ethers
});

export default rootReducer;
