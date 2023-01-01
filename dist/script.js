const BASE_URL = 'https://user-list.alphacamp.io';
const INDEX_URL = BASE_URL + '/api/v1/users/';
// const USER_URL = BASE_URL + '/snapshot/';

const users = [];
// console.log(axios.get(INDEX_URL));
let filteredUsers = [];
const USERS_PER_PAGE = 12;
const dataPanel = document.querySelector('#data-panel');
const paginator = document.querySelector('#paginator');
const searchForm = document.querySelector('#search-form');
const searchInput = document.querySelector('#search-input');

function renderUserList(data) {
    let rawHTML = '';
    data.forEach((item) => {
        rawHTML += `<div class="card m-2 card-box text-center">
                        
                        <div class="card-title m-3 ">
                            <h5>${item.name} <br>${item.surname}</h5>
                        </div>
                        <img
                            src="${item.avatar}"
                            class="card-img-top show-user rounded-circle"
                            alt="Users"
                            data-bs-toggle="modal"
                            data-bs-target="#user-modal"
                            data-id="${item.id}"
                        />
                        <div class='m-3 d-flex justify-content-end'>
                                <button class="btn btn-outline-info btn-add-favorite" data-id="${item.id}">
                                  <i class="fa fa-heart " aria-hidden="true" >
                                  </i>
                                </button>
                        </div>
                    </div>
        `;
    });
    dataPanel.innerHTML = rawHTML;
}


function renderPaginator(amount) {
    const numberOfPage = Math.ceil(amount / USERS_PER_PAGE);
    let rawHTML = '';
    for (let page = 1; page <= numberOfPage; page++) {
        rawHTML += `
                    <li class="page-item "><a class="page-link text-white bg-dark" href="#" data-page="${page}">${page}</a></li>`;
    }
    paginator.innerHTML = rawHTML;
}
function getUsersByPage(page) {
    const data = filteredUsers.length ? filteredUsers : users;
    const startIndex = (page - 1) * USERS_PER_PAGE;
    return data.slice(startIndex, startIndex + USERS_PER_PAGE);
}

searchForm.addEventListener('submit', function onSearchFormSubmitted(e) {
    e.preventDefault();
    const keyword = searchInput.value.trim().toLowerCase();
    filteredUsers = users.filter((user) => user.name.toLowerCase().includes(keyword));
    if (filteredUsers.length === 0) {
        return alert('The user - ' + keyword + ' - is not exist.');
    }
    renderPaginator(filteredUsers.length);
    renderUserList(getUsersByPage(1));
});

function showUserModal(id) {
    const modalName = document.querySelector('.modal-name');
    const modalAvatar = document.querySelector('#user-modal-avatar');
    const modalBirthday = document.querySelector('#user-modal-birthday');
    const modalEmail = document.querySelector('#user-modal-email');
    const modalGender = document.querySelector('#user-modal-gender');
    const modalRegion = document.querySelector('#user-modal-region');
    const modalAge = document.querySelector('#user-modal-age');

    axios.get(INDEX_URL + id).then((response) => {
        const data = response.data; // 不用 results，因為 INDEX_URL + id 直接是一個物件
        console.log(data);
        modalName.innerText = data.name + ' ' + data.surname;
        modalBirthday.innerHTML = `<i class="fa fa-calendar-o fa-lg" aria-hidden="true">&emsp;</i>` + data.birthday;
        modalAvatar.innerHTML = `<img src="${data.avatar}" alt="movie-poster" class="img-fluid rounded-circle">`;
        modalEmail.innerHTML = `<i class="fa fa-envelope-o fa-lg" aria-hidden="true">&emsp;</i>` + data.email;
        modalGender.innerHTML =
            `<i class="fa fa-transgender fa-lg" aria-hidden="true">&emsp;</i>` + data.gender.toUpperCase();
        modalRegion.innerHTML =
            `<i class="fa fa-globe fa-lg" aria-hidden="true">&emsp;</i>` + data.region.toUpperCase();
    });
}
// function addToBest(id) {
//     // console.log(id);
//     function isUserIdMatched(user) {
//         return user.id === id;
//     }
//     const list = JSON.parse(localStorage.getItem('bestFriends')) || [];
//     const user = users.find(isUserIdMatched);
//     if (list.some(isUserIdMatched)) {
//         return alert('Best friend can not be TWO.');
//     }
//     list.push(user);
//     localStorage.setItem('bestFriends', JSON.stringify(list));
//     console.log(list);
// }

function addToBest(id) {
    console.log(id);
    function isUserIdMatched(user) {
        return user.id === id;
    }
    const list = JSON.parse(localStorage.getItem('bestFriends')) || [];
    const user = users.find(isUserIdMatched);
    if (list.some(isUserIdMatched)) {
        return alert('Best friend can not be TWO.');
    }
    list.push(user);
    localStorage.setItem('bestFriends', JSON.stringify(list));
    console.log(list);
}
dataPanel.addEventListener('click', function onPanelClicked(e) {
    if (e.target.matches('.show-user')) {
        showUserModal(Number(e.target.dataset.id));
        console.log(e.target.dataset);
    } else if (e.target.matches('.btn-add-favorite')) {
        addToBest(Number(e.target.dataset.id));
    }
});

paginator.addEventListener('click', function onPaginatorClicked(e) {
    if (e.target.tagName !== 'A') return;
    const page = Number(e.target.dataset.page);
    renderUserList(getUsersByPage(page));
});

axios
    .get(INDEX_URL)
    .then((response) => {
        users.push(...response.data.results);
        console.log(users);
        renderUserList(getUsersByPage(1));
        renderPaginator(users.length);
    })
    .catch((err) => console.log(err));
