const apiURL = 'https://api.github.com/users/';

const form = document.querySelector('.search__content__form');
const searchInput = document.querySelector('.search__content__form--input');
const submitBtn = document.querySelector('.search__content__form--btn');
const mainDiv = document.querySelector('.search__content__main');



// USING AXIOS - connected in HTML CDN script
// getting the user from github
async function getUSer(username) {
    // one method to do it
    // const res = await axios(apiURL + username)
    // console.log(res.data);

    // second method
    try {
        const { data } = await axios(apiURL + username)
        // console.log(data);
        createUserCard(data)
        getRepos(username)
    } catch (err) {
        // console.log(err)
        if (err.response.status == 404) {
            createErrorCard('No profile with this username')
        }
    }
}
// Getting repos from github
async function getRepos(username) {
    try {
        const { data } = await axios(apiURL + username + '/repos?sort=created')
        console.log('repos', data);
        addReposToCard(data)
    } catch (err) {
        console.log(err)
        createErrorForFetchingRepos('Problem fetching repos')
    }
}

// Error message
function createErrorCard(msg) {
    const errorHTML = `
    <div class="search__content__main__card">
       <div class="search__content__main__card--info">
        <h2>${msg} </h2>
       </div>
    </div> 
    `
    mainDiv.innerHTML = errorHTML
}

// Error message for repos
function createErrorForFetchingRepos(msgRepo) {
    const errorHTMLRepos = `
    <div class="search__content__main__card--info__repos">
    <h2>${msgRepo} </h2>
    </div>
    `
}

// SENDING THE FORM VALUE TO getUser() function
form.addEventListener('submit', (e) => {
    // stop form from trying to send a file by default
    e.preventDefault();

    const userName = searchInput.value;

    if (userName) {
        getUSer(userName)

        searchInput.value = '';
    }
})
// FORM BUTTON = SENDING THE FORM VALUE TO getUser() function
submitBtn.addEventListener('submit', (e) => {
    e.preventDefault();
    const userName = searchInput.value;

    if (userName) {
        getUSer(userName);

        searchInput.value = '';
    }
})

// CREATING USER CARD
function createUserCard(data) {
    // destructuring data from api
    let { avatar_url, name, login, html_url, location, bio, followers, following, public_repos } = data;

    // console.log(name)

    const cardHTML = ` 
    <div class="search__content__main__card">
    <div class="search__content__main__card--avatar">
        <img src="${avatar_url}" alt="">
    </div>
    <div class="search__content__main__card--info">
        <h2>${name}</h2>
        <h3><a href="${html_url}">${login}</a></h3>
        <h4>${location}</h4>
        <p>${bio}</p>

        <ul>
            <li>${followers} <strong> Followers</strong></li>
            <li>${following} <strong> Following</strong></li>
            <li>${public_repos} <strong> Repos</strong></li>
        </ul>
        <div class="search__content__main__card--info__repos">
  
        </div>
    </div>
</div>
`

    mainDiv.innerHTML = cardHTML;
}

function addReposToCard(repos) {
    const reposEl = document.querySelector('.search__content__main__card--info__repos');

    repos.forEach(repo => {
        const repoLink = document.createElement('a');
        repoLink.classList.add('search__content__main__card--info__repo');
        // href linking to repository link on github
        repoLink.href = repo.html_url;
        repoLink.target = '_blank';
        repoLink.innerText = repo.name;

        reposEl.appendChild(repoLink);

        // const repoLink = document.createElement('a');
        // repoLink.innerHTML = `
        // <a href="${repo.html_url}" class="search__content__main__card--info__repo">${repo.name}</a>
        // `
        // repoLink.target = '_blank';
        // reposEl.appendChild(repoLink);
    })

}