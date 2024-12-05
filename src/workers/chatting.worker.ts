let count = 0;

setInterval(() => {
  count++;

  self.postMessage(count);
}, 1_000);
