const btn = document.querySelector("#searchRepo");
btn.addEventListener("click", fetchUsersDataByUserId);
const selectedRows = document.querySelector("#noOfRows");
selectedRows.addEventListener("change", fetchUserReposByUserId);
const loader = document.querySelector("#loader");
loader.style.display = "none";
let currentPage = 1;
let totalNoOfRepos = 0;
let noOfPages = 1;

// Move the event listener setup outside the function
const paginationComp = document.querySelector("#pagination");
paginationComp.addEventListener("click", (e) => {
  console.log(currentPage);
  if (e.target.innerText == 'Previous' && currentPage > 1) {
    currentPage -= 1;
    fetchUserReposByUserId();
  } else if (e.target.innerText == 'Next' && currentPage < noOfPages) {
    currentPage += 1;
    fetchUserReposByUserId();
  } else if (e.target.innerText != 'Next' && e.target.innerText != 'Previous') {
    currentPage = e.target.innerText;
    fetchUserReposByUserId();
  } else if (e.target.innerText == currentPage) {
    return;
  }
});

async function fetchUsersDataByUserId() {
  const username = document.querySelector("#username").value;
  if (username) {
    try {
      const response = await fetch(`https://api.github.com/users/${username}`);
      const result = await response.json();
      totalNoOfRepos = result.public_repos;
      document.querySelector(
        "#userDetail"
      ).innerHTML = `<div class="d-flex justify-content-center"><img src=${result.avatar_url} alt="image"class="rounded-circle"></div>
      <p class="d-flex justify-content-center">${result.name}</p>
      <a class="d-flex justify-content-center mb-3" href=${result.html_url} target="_blank"  >${result.html_url} </a>`;
           
      fetchUserReposByUserId();
    } catch (error) {
      console.error("Error:", error);
    }
  } else {
    alert("Please enter the username to get their details");
  }
}

async function fetchUserReposByUserId() {
  
  loader.style.display = "block"; // Show loader

  const username = document.querySelector("#username").value;
  const perPage = document.querySelector("#noOfRows").value;
  noOfPages = Math.ceil(totalNoOfRepos / perPage);

  let pages = "";
  for (let i = 1; i <= noOfPages; i++) {
    pages += `<li class="page-item" id=${i}><span class="page-link">${i}</span></li>`;
  }

  paginationComp.innerHTML = `
    <li class="page-item"><span class="page-link">Previous</span></li>
    ${pages}
    <li class="page-item"><span class="page-link">Next</span></li>
  `;

  try {
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?page=${currentPage}&per_page=${perPage}`
    );
    const result = await response.json();
    let cards = "";
    result.forEach((data) => {
      cards += `
        <div class="col-md-6 mb-2">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">${data.name}</h5>
              <p class="card-text">${data.description ? data.description : 'Description for this repo not availabale' }</p>
            </div>
          </div>
        </div>`;
    });
    document.querySelector("#userRepos").innerHTML = cards;
  } catch (error) {
    console.error("Error:", error);
  } finally {
    loader.style.display = "none"; // Hide loader
  }
}
