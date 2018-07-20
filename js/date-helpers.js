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

module.exports = {
  formatDate,
  formatTime,
  formatDateTime,
};
