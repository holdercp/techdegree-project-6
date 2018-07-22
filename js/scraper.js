const Xray = require('x-ray');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fs = require('fs');
const path = require('path');
const utility = require('./utilities');

// Allows the .csv file to be written at [projectRoot]/data
// regardless of where the script is called from
const rootPath = path.join(__dirname, '..');
const dataPath = path.join(rootPath, 'data');

// Flattens shirt obj and adds a datetime string prop
const massageShirtData = (shirtObj) => {
  const flatShirt = utility.flattenObj(shirtObj);
  flatShirt.time = utility.formatDateTime(new Date());
  return flatShirt;
};

// Logs a friendly message to the console and writes to a log file
const handleError = (e) => {
  const date = new Date();
  const log = `[${date.toString()}] ${e}\n`;
  fs.appendFile(`${rootPath}/scraper-error.log`, log, () => {
    const msg = e.code && e.code === 'ENOTFOUND'
      ? "we can't connect to shirts4mike.com"
      : 'something went wrong';
    console.error(`Whoops! Looks like ${msg}. Check scraper-error.log for more details.`);
  });
};

// If the dir already exists, clear it, otherwise create it
const writeDir = (dirPath) => {
  if (fs.existsSync(dirPath)) {
    const prevFiles = fs.readdirSync(dirPath);
    prevFiles.forEach(file => fs.unlinkSync(`${dirPath}/${file}`));
  } else {
    fs.mkdirSync(dirPath);
  }
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
    handleError(err);
    return;
  }

  const shirtData = res.map(massageShirtData);

  writeDir(dataPath);

  const csvWriter = createCsvWriter({
    path: `${dataPath}/${utility.formatDate(new Date())}.csv`,
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

      /* eslint no-underscore-dangle: ["error", { "allow": ["_path"] }] */
      const filePath = fs.realpathSync(csvWriter._path);
      console.log(`The scraped data is in ${filePath}`);
    });
});
