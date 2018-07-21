const Xray = require('x-ray');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fs = require('fs');
const utility = require('./utilities');

const dirPath = '../data';

// Flattens shirt obj and adds a datetime string prop
const massageShirtData = (shirtObj) => {
  const flatShirt = utility.flattenObj(shirtObj);
  flatShirt.time = utility.formatDateTime(new Date());
  return flatShirt;
};

const x = Xray({
  filters: {
    // The price is returned with the title, so we need to trim that out
    trimTitle(value) {
      return typeof value === 'string' ? value.substring(value.indexOf(' ') + 1) : value;
    },
  },
});

x('http://shirts4mike.com/shirts.php', '.products li', [
  {
    url: 'a@href',
    shirtDetails: x('a@href', {
      title: '.shirt-details h1 | trimTitle',
      price: '.shirt-details .price',
      imageUrl: '.shirt-picture img@src',
    }),
  },
])((err, res) => {
  if (err) {
    const msg = err.code === 'ENOTFOUND' ? "we can't connect to shirts4mike.com" : 'something went wrong';
    console.error(`Whoops! Looks like ${msg}. Try Again later`);
    return;
  }

  // If the data dir already exists, clear it, otherwise create it
  if (fs.existsSync(dirPath)) {
    const prevFiles = fs.readdirSync(dirPath);
    prevFiles.forEach(file => fs.unlinkSync(`${dirPath}/${file}`));
  } else {
    fs.mkdirSync(dirPath);
  }

  // Flatten shirt objs and add timestamp prop to each shirt in arr
  const shirtData = res.map(massageShirtData);

  const csvWriter = createCsvWriter({
    path: `${dirPath}/${utility.formatDate(new Date())}.csv`,
    header: [
      { id: 'title', title: 'Title' },
      { id: 'price', title: 'Price' },
      { id: 'imageUrl', title: 'ImageURL' },
      { id: 'url', title: 'URL' },
      { id: 'time', title: 'Time' },
    ],
  });

  csvWriter
    .writeRecords(shirtData) // returns a promise
    .then(() => {
      console.log('...Done');
    });
});
