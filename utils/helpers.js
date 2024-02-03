const crypto = require('crypto');

function generateRandomString() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let randomString = '';
  
  for (let i = 0; i < 6; i++) {
    const randomIndex = crypto.randomInt(0, characters.length);
    randomString += characters.charAt(randomIndex);
  }
  
  return randomString;
}

function CaesarCipher(str, shift) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let ciphered = '';
  
    for (let i = 0; i < str.length; i++) {
      let charIndex = chars.indexOf(str[i]);
      let cipheredIndex = (charIndex + shift) % chars.length;
      ciphered += chars[cipheredIndex];
    }
  
    return {ciphered, shift};
  }
module.exports = {
    CaesarCipher,
    generateRandomString
};
