const fs = require('fs');
const http = require('http');

const name = 'Magdalena';
console.log('name: ', name);

// ====== FILES ======

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

// ---- Read file sync ----
const overviewTemp = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const productTemp = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');
const cardTemp = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const productData = JSON.parse(data);

const replaceTemp = (temp, product) => {
  let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%ID%}/g, product.id);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%NTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);

  if (!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
  return output;
};

// ====== SERVER ======

// CREATE SERVER
const server = http.createServer((req, res) => {
    // show this response every time request is send to server (browser endpoint)

    // Routing server side
    const pathName = req.url;
    // overview page
    if (pathName === '/' || pathName === '/overview') {
        const cardHtml = productData.map(el => replaceTemp(cardTemp, el));
        const output = overviewTemp.replace(/{%PRODUCT_CARDS%}/g, cardHtml);
        res.end(output);
    } 
    // product api
    else if (pathName === '/api') {
        res.writeHead(200, {
            'Content-type': 'application/json'
        });
        res.end(data);   
    } 
    // product page 
    else if (pathName === '/product') {
        res.end('Hello from the server!');
    } 
    // not found page 
    else {
        res.writeHead(404, {
            'Content-type': 'text/html',
            'my-own-custom-header': 'learn-node-js'
        });
        res.end('<h1>404</h1><h6>PAGE NOT FOUND!</h6>');
    }
});

server.listen(8000, '127.0.0.1', () => {
    // listen to server
    console.log('------- server started -----');
});