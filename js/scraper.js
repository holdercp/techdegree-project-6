const Xray = require('x-ray');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const dateHelper = require('./date-helpers');

const x = Xray({
  filters: {
    trimTitle(value) {
      return typeof value === 'string' ? value.substring(value.indexOf(' ') + 1) : value;
    },
  },
});

x('http://shirts4mike.com/shirts.php', '.products li', [
  {
    url: 'a@href',
    title: x('a@href', '.shirt-details h1 | trimTitle'),
    price: x('a@href', '.shirt-details .price'),
    imageUrl: x('a@href', '.shirt-picture img@src'),
  },
])((err, shirtsArr) => {
  if (err) {
    console.log(err);
    return;
  }
  const csvWriter = createCsvWriter({
    path: '../data/file.csv',
    header: [
      { id: 'title', title: 'Title' },
      { id: 'price', title: 'Price' },
      { id: 'imageUrl', title: 'ImageURL' },
      { id: 'url', title: 'URL' },
      { id: 'time', title: 'Time' },
    ],
  });

  const records = shirtsArr;

  csvWriter
    .writeRecords(records) // returns a promise
    .then(() => {
      console.log('...Done');
    });
});
