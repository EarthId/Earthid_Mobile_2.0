import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { AsyncStorage } from "react-native";
import { persistStore, persistReducer } from "redux-persist";
import {
  userReducer,
  accountReducer,
  contractReducer,
  approveOTPReducer,
  documentListReducer,
  schemaReducer,
  getHistoryReducer,
  createSignatureReducer,
} from "./reducer/user.reducer";
import {
  EditProfileReducer,
  SavedCredVerify,
  SavedProfilePictures,
  SavedQrData,
  SavedSecurityDatas,
  toggleReducer,
} from "./reducer/saveDataReducer";

const persistConfig = {
  key: "root",
  keyPrefix: "",
  storage: AsyncStorage,
  whitelist: [
    "contract",
    "user",
    "Documents",
    "saveData",
    "account",
    "savedPic",
    "security",
    "isToggleOn",
    "editProfile"
  ],
};
const rootReducer = combineReducers({
  user: userReducer,
  account: accountReducer,
  contract: contractReducer,
  ApproveOtp: approveOTPReducer,
  Documents: documentListReducer,
  saveData: SavedQrData,
  schema: schemaReducer,
  getHistoryReducer: getHistoryReducer,
  savedPic: SavedProfilePictures,
  security: SavedSecurityDatas,
  createSignature: createSignatureReducer,
  saveCred:SavedCredVerify,
  isToggleOn:toggleReducer,
  editProfile:EditProfileReducer
});

const appreducer = (state: any, action: any) => {
  if (action.type === "DELETE") {
    return rootReducer(undefined, action);
  }
  return rootReducer(state, action);
};
const persistedReducer = persistReducer(persistConfig, appreducer);
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }),
});
export const persistor = persistStore(store);
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
