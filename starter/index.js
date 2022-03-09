import fs from 'fs';
import http from 'http';
import { URL } from 'url';
import slugify from 'slugify';
import replaceTemp from './modules/replaceTemp.cjs';

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
      fs.writeFile('./txt/final.txt', `------- ${data2} \n${data3} -------`, 'utf-8', (err) => {
        console.log('Added to FINAL file!!');
        fs.readFile('./txt/final.txt', 'utf-8', (err, data4) => {
          console.log('data4 final ASYNC: ', data4);
        });
      });
    });
  });
});
console.log('Should display first! Check this out!');

// ---- Read file sync ----
const overviewTemp = fs.readFileSync('./templates/template-overview.html', 'utf-8');
const productTemp = fs.readFileSync('./templates/template-product.html', 'utf-8');
const cardTemp = fs.readFileSync('./templates/template-card.html', 'utf-8');

const data = fs.readFileSync('./dev-data/data.json', 'utf-8');
const productData = JSON.parse(data);

const slugs = productData.map((el) =>
  slugify(el.productName, {
    lower: true,
  })
);
console.log('slugs ========>', slugs);

// ====== SERVER ======

// CREATE SERVER
const server = http.createServer((req, res) => {
  // show this response every time request is send to server (browser endpoint)

  // Routing server side -> spread url to parts
  const { searchParams, pathname } = new URL(req.url, 'http://127.0.0.1');

  // overview page
  if (pathname === '/' || pathname === '/overview') {
    const cardHtml = productData.map((el) => replaceTemp(cardTemp, el)).join('');
    const output = overviewTemp.replace(/{%PRODUCT_CARDS%}/g, cardHtml);
    res.end(output);
  }
  // product api
  else if (pathname === '/api') {
    res.writeHead(200, {
      'Content-type': 'application/json',
    });
    res.end(data);
  }
  // product page
  else if (pathname === '/product') {
    const id = searchParams.get('id');
    const productHtml = replaceTemp(productTemp, productData[id]);
    res.end(productHtml);
  }
  // not found page
  else {
    res.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-custom-header': 'learn-node-js',
    });
    res.end('<h1>404</h1><h6>PAGE NOT FOUND!</h6>');
  }
});

server.listen(8000, '127.0.0.1', () => {
  // listen to server
  console.log('------- server started -----');
});
