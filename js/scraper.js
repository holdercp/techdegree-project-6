const Xray = require('x-ray');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const utility = require('./utilities');

// Flattens shirt obj and adds a datetime string prop
const massageShirtData = (shirtObj) => {
  const flatShirt = utility.flattenObj(shirtObj);
  flatShirt.time = utility.formatDateTime(new Date());
  return flatShirt;
};

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
    shirtDetails: x('a@href', {
      title: '.shirt-details h1 | trimTitle',
      price: '.shirt-details .price',
      imageUrl: '.shirt-picture img@src',
    }),
  },
])((err, res) => {
  if (err) {
    console.log(err);
    return;
  }

  // Flatten shirt objs and add timestamp prop to each shirt in arr
  const shirtData = res.map(massageShirtData);

  const csvWriter = createCsvWriter({
    path: `../data/${utility.formatDate(new Date())}.csv`,
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
