function pad(n) {
  return n < 10 ? `0${n}` : n;
}

// Takes Date object and returns a Unix formatted date string
function formatDate(date) {
  const yr = date.getFullYear();
  const mo = date.getMonth() + 1;
  const day = date.getDate();

  return `${yr}-${pad(mo)}-${pad(day)}`;
}

// Takes a Date object and returns a Unix formatted timestamp string
function formatTime(date) {
  const hrs = date.getHours();
  const mins = date.getMinutes();
  const secs = date.getSeconds();

  return `${pad(hrs)}:${pad(mins)}:${secs}`;
}

// Takes a Date object and returns a full Unix date/time string
function formatDateTime(date) {
  return `${formatDate(date)} ${formatTime(date)}`;
}

// Flattens nested objects to a single level of depth
// Adapted from https://stackoverflow.com/questions/33036487/one-liner-to-flatten-nested-object
function flattenObj(object) {
  /*
  Recursively creates an array of single key: value pairs
  {
    key1: value,
    key2: {
      nestedKey: value
    }
  }
  Becomes [{key1: value}, {nestedKey: value}]
  */
  const flatten = function flatten(obj) {
    return [].concat(
      ...Object.keys(obj).map(
        key => (typeof obj[key] === 'object' ? flatten(obj[key]) : { [key]: obj[key] }),
      ),
    );
  };
  // Creates a new object from the the single key: value pairs array
  return Object.assign({}, ...flatten(object));
}

module.exports = {
  formatDate,
  formatTime,
  formatDateTime,
  flattenObj,
};
