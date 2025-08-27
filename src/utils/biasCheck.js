export default function biasCheck(text) {
  const bannedWords = ['racist', 'sexist', 'offensive']; 
  const found = bannedWords.filter(word => text.toLowerCase().includes(word));
  return found.length === 0;
}

// module.exports = biasCheck;


