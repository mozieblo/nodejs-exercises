const fs = require('fs');

const name = 'Magdalena';
console.log('name: ', name);

// -- SYNCHRONOUS --
// READ FROM SPECIFIC FILE
const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
console.log('textIn SYNC: ', textIn);
const text = `This is information about avocado: ${textIn}. Today: ${Date.now()}`;
// CREATE AND WRITE IN SPECIFIC FILE
const textOut = fs.writeFileSync('./txt/output.txt', text);
console.log('text SYNC: ', text);

// -- ASYNCHRONOUS --
// READ FROM FILE
fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
    if (err) return console.log('err ASYNC: ', err);
    console.log('data1 ASYNC: ', data1);
    fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
        console.log('data2 ASYNC: ', data2);
        fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
            console.log('data3 ASYNC: ', data3);
            // WRITE IN SPECIFIC FILE
            fs.writeFile('./txt/final.txt', `------- ${data2} \n${data3} -------`, 'utf-8', err => {
                console.log('Added to FINAL file!!');
                fs.readFile('./txt/final.txt', 'utf-8', (err, data4) => {
                    console.log('data4 final ASYNC: ', data4);
                })
            })
        })
    })
});
console.log('Should display first! Check this out!');