fetch('http://localhost:3000/api/queries')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);
