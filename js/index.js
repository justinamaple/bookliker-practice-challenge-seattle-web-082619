const booksURL = 'http://localhost:3000/books';
const booksList = document.querySelector('#list');
const showPanel = document.querySelector('#show-panel');
const my_user = {
  id: 1, 
  username: 'pouros'
};
let lastBook;


document.addEventListener("DOMContentLoaded", function() {
  fetch(booksURL)
  .then(resp => resp.json())
  .then(books => {
    for(book of books) {
      displayBook(book);
    }
  });
})

function displayBook(book) {
  const li = document.createElement('li');

  li.innerText = book.title;
  li.addEventListener("click", showBook);
  li.setAttribute('id', book.id);

  booksList.append(li);
}

function showBook() {
  fetch(`${booksURL}/${this.id}`)
  .then(resp => resp.json())
  .then(book => {
    createBookDisplay(book);
  });
}

function createBookDisplay(book) {
  const h3 = document.createElement('h3');
  const img = document.createElement('img');
  const p = document.createElement('p');
  const ul = document.createElement('ul');
  const btn = document.createElement('button');

  h3.innerText = book.title;
  img.src = book.img_url;
  p.innerText = book.description;
  btn.innerText = 'Like';
  btn.addEventListener('click', likeBook);

  createUsers(ul, book.users)

  showPanel.innerHTML = '';
  showPanel.append(h3, img, p, ul, btn);

  lastBook = book;
}

function createUsers(ul, users) {
  for(user of users) {
    ul.append(createUser(user));
  }
}

function createUser(user) {
  const li = document.createElement('li');
  li.innerText = user.username;
  return li;
}

function likeBook() {
  let users = lastBook.users
  
  if(users.filter(user => user.id === 1).length > 0) {
    users = users.filter(user => user.id !== 1);
  } else {
    users.push(my_user);
  }

  let config = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({
      'users': users
    })
  }

  fetch(`${booksURL}/${lastBook.id}`, config)
  .then(resp => resp.json())
  .then(book => {
    const ul = document.querySelector('#show-panel ul')
    ul.innerHTML = '';
    createBookDisplay(book);
  });
}