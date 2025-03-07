export const initialState = {
  userToken: 0,
  userDailyFreeTranslations: 0,
  paidTokens: 0,
  englishSentences: [],
  finnishSentences: [],
  isLoading: false,
};

export const chatReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };

    case "SET_TOKENS":
      return { ...state, userToken: action.payload };

    case "SET_SENTENCES":
      return {
        ...state,
        englishSentences: action.payload.englishSentences,
        finnishSentences: action.payload.finnishSentences,
      };

    case "LOAD_STORIES_FROM_STORAGE":
      return {
        ...state,
        englishSentences: action.payload.englishSentences,
        finnishSentences: action.payload.finnishSentences,
      };

    default:
      return state;
  }
};
