
// setupUI()
const urlParmas = new URLSearchParams(window.location.search)
const id = urlParmas.get("usersId")

let userLocalStorage = localStorage.getItem("user")
let user = JSON.parse(userLocalStorage)
let userId = user.id
function getDataUser() {
    let baseUrl = ``
    if (id != null) {
        baseUrl = `https://tarmeezacademy.com/api/v1/users/${id}`
    } else {
        baseUrl = `https://tarmeezacademy.com/api/v1/users/${userId}`
    }
    axios.get(baseUrl).then(response => {
        console.log(response.data.data);
        let data = response.data.data;

        document.getElementById("page-content").innerHTML = ""
        const content = `
        <div class="padding">
            <div class="row container d-flex justify-content-center" style="margin: 0 auto;">
                <div class="col-xl-10 col-md-12">
                    <div class="card user-card-full">
                        <div class="row m-l-0 m-r-0">
                            <div class="col-sm-4 bg-c-lite-green user-profile">
                                <div class="card-block text-center text-white">
                                    <div class="m-b-25">
                                        <img src=${data.profile_image} class="img-radius w-50 h-50" alt="User-Profile-Image">
                                    </div>
                                    <h6 class="f-w-600">${data.name}</h6>
                                    <p>front end</p>
                                    <i class=" mdi mdi-square-edit-outline feather icon-edit m-t-10 f-16"></i>
                                </div>
                            </div>
                            <div class="col-sm-8">
                                <div class="card-block">
                                    <h6 class="m-b-20 p-b-5 b-b-default f-w-600">Information</h6>
                                    <div class="row">
                                        <div class="col-sm-6">
                                            <p class="m-b-10 f-w-600">Email</p>
                                            <h6 class="text-muted f-w-400">${data.email}</h6>
                                        </div>
                                        <div class="col-sm-6">
                                            <p class="m-b-10 f-w-600">Name</p>
                                            <h6 class="text-muted f-w-400">${data.name}</h6>
                                        </div>
                                    </div>
                                    <h6 class="m-b-20 m-t-40 p-b-5 b-b-default f-w-600">Data</h6>
                                    <div class="row">
                                        <div class="col-sm-6">
                                            <p class="m-b-10 f-w-600">Posts</p>
                                            <h1 class="text-muted f-w-400">${data.posts_count}</h1>
                                        </div>
                                        <div class="col-sm-6">
                                            <p class="m-b-10 f-w-600">Commantis</p>
                                            <h1 class="text-muted f-w-400">${data.comments_count}</h1>
                                        </div>
                                    </div>
                                    <ul class="social-link list-unstyled m-t-40 m-b-10">
                                        <li><a href="#!" data-toggle="tooltip" data-placement="bottom" title=""
                                                data-original-title="facebook" data-abc="true"><i
                                                    class="mdi mdi-facebook feather icon-facebook facebook"
                                                    aria-hidden="true"></i></a></li>
                                        <li><a href="#!" data-toggle="tooltip" data-placement="bottom" title=""
                                                data-original-title="twitter" data-abc="true"><i
                                                    class="mdi mdi-twitter feather icon-twitter twitter"
                                                    aria-hidden="true"></i></a></li>
                                        <li><a href="#!" data-toggle="tooltip" data-placement="bottom" title=""
                                                data-original-title="instagram" data-abc="true"><i
                                                    class="mdi mdi-instagram feather icon-instagram instagram"
                                                    aria-hidden="true"></i></a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        <h1>${data.name}</h1>
        </div>
        `
        document.getElementById("page-content").innerHTML += content
    })
}

getDataUser()

function posts_user() {

    let baseUrl = ``
    if (id != null) {
        // baseUrl = `https://tarmeezacademy.com/api/v1/users/${id}`
        baseUrl = `https://tarmeezacademy.com/api/v1/users/${id}/posts`
    } else {
        baseUrl = `https://tarmeezacademy.com/api/v1/users/${userId}/posts`
    }

    axios.get(baseUrl).then((response) => {
        const posts = response.data.data;
        document.querySelector(".posts_user").innerHTML = ""

        for (post of posts) {
            let user = getCurrentUser()
            let btn = ""
            if (user != null && post.author.id == user.id) {
                btn = `
                <li><button class="dropdown-item" type="button" onclick="editPostBtn('${encodeURIComponent(JSON.stringify(post))}')">تعديل</button></li>
                <li><button class="dropdown-item" type="button" onclick="DeletePost('${post.id}')">خذف</button></li>
                `
            }
            let content = `
                <div class="cards d-flex justify-content-center ">
                <div class="card col-8">
                    <div class="card-header" style="display: flex;align-items: center;justify-content: space-between;">
                        <div role="button" onclick="getUser(${post.author.id})">
                            <img src="${post.author.profile_image}" style="width: 40px; height: 40px;border-radius: 50%;" alt="">
                            <span class="fw-bold fs-6">${post.author.name}</span>    
                            <input class="form-control form-control-sm" id="postID" value="${post.id}" type="hidden" placeholder=".form-control-sm" aria-label=".form-control-sm example">
                        </div>
                        <div class="dropdown">
                            
                        <i style="font-size: 22px;cursor: pointer;" class="bi bi-three-dots-vertical " data-bs-toggle="dropdown" aria-expanded="false"></i>
                            <ul class="dropdown-menu">
                                ${btn}
                            </ul>
                        </div>
                    </div>
                    
                    <img src="${post.image}" style="height: 400px;" class="card-img-top rounded-0"  alt="...">
                    <div class="card-body" style="cursor: pointer;" onclick='postClicked(${post.id})'>
                        <p class="card-title text-secondary">${post.created_at}</p>
                        <p class="card-text " style="font-weight: 600;">${post.body}</p>
                        <hr>
                        <div class="d-flex flex-nowrap gap-2 align-items-center">
                            <div class="">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                    class="bi bi-pen" viewBox="0 0 16 16">
                                    <path
                                        d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z" />
                                </svg>
                                (${post.comments_count}) Comments
                            </div>
                            ${post.tags.map(tag => `<button type="button" class="btn btn-secondary rounded-5 py-0">${tag}</button>`)}
                        </div>
                    </div>
                </div>
            </div>
            `
            document.querySelector(".posts_user").innerHTML += content;
        }
    })

}

posts_user()