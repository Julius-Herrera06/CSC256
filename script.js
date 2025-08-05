// Array to store entered titles
let movies = [];

// Add title when Add Movie is clicked
document.getElementById('addBtn').addEventListener('click', () => {
  const input = document.getElementById('movieInput');
  const title = input.value.trim();
  if (title) {
    movies.push(title);      // save valid title
    input.value = '';        // clear field
    input.focus();           // focus back for quick entry
  }
});

// Sort and show titles in the #movieList div
document.getElementById('displayBtn').addEventListener('click', () => {
  const listDiv = document.getElementById('movieList');
  listDiv.innerHTML = '';             // clear prior output
  const sorted = movies.slice().sort(); // non-destructive sort
  sorted.forEach(title => {
    const p = document.createElement('p');
    p.textContent = title;
    listDiv.appendChild(p);
  });
});

// Reset list and clear display
document.getElementById('resetBtn').addEventListener('click', () => {
  movies = [];
  document.getElementById('movieList').innerHTML = '';
});
