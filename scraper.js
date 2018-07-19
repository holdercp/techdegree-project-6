const Xray = require('x-ray');

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
  } else {
    console.log(shirtsArr);
  }
});
