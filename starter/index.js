const fs = require('fs');

const name = 'Magdalena';
console.log('name: ', name);

// READ FROM SPECIFIC FILE
const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
console.log(textIn);
const text = `This is information about avocado: ${textIn}. Today: ${Date.now()}`;
// CREATE AND WRITE IN SPECIFIC FILE
const textOut = fs.writeFileSync('./txt/output.txt', text);
console.log(text);