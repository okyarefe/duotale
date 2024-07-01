// List of common abbreviations
const abbreviations = [
  "Dr",
  "Mr",
  "Mrs",
  "Ms",
  "Jr",
  "Sr",
  "Prof",
  "St",
  "Rev",
  "B.A",
  "M.A",
  "B.S",
  "M.S",
  "Ph.D",
  "M.D",
  "a.m",
  "p.m",
  "Ave",
  "Blvd",
  "Rd",
  "St",
  "etc",
  "e.g",
  "i.e",
  "vs",
  "Ltd",
  "Inc",
  "Co",
];

// Function to create the regex pattern
const createSentenceSplitRegex = () => {
  const abbreviationsPattern = `\\b(?:${abbreviations.join("|")})\\.`;
  return new RegExp(`(?<!${abbreviationsPattern})(?<=\\.|\\?|!)\\s`, "g");
};

// Function to split text into sentences
const splitTextIntoSentences = (text) => {
  const regex = createSentenceSplitRegex();
  return text.split(regex);
};

export { splitTextIntoSentences };
