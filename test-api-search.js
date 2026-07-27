fetch("https://backend-by-vievk-ytmusicapi.onrender.com/api/v1/search?q=marathi+song&filter=songs")
  .then(res => res.json())
  .then(data => console.log(JSON.stringify(data).substring(0, 100)))
  .catch(console.error);
