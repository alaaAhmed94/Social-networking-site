let currentPage = 1
let lastPage = 1
// دالة لعرض  "5 بوستات" عند الوصول إلى نهاية الصفحة
function showGoodMorningMessage() {
    // التحقق مما إذا كان المستخدم قد وصل إلى نهاية الصفحة
    const endOfPage = (window.innerHeight + window.pageYOffset) >= document.body.offsetHeight
    console.log(currentPage, lastPage);
    if (endOfPage && currentPage < lastPage) {
        // currentPage = currentPage + 1
        getPost(false, currentPage += 1)
    }
}
// استماع لحدث التمرير واستدعاء الدالة عند الوصول إلى نهاية الصفحة
window.addEventListener("scroll", showGoodMorningMessage);

function getPost(relod = true, page = 1) {
    axios.get(`https://tarmeezacademy.com/api/v1/posts?limit=2&page=${page}`).then((response) => {
        // شرط لظهور البوستات علي دفعات في داله scrollY
        lastPage = response.data.meta.last_page
        const posts = response.data.data;
        console.log(posts);
        console.log(posts);
        if (relod) {
            document.querySelector(".posts").innerHTML = ""
        }

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
            document.querySelector(".posts").innerHTML += content;
        }
    })
}
getPost()

function createPostClicked() {
    let postID = document.getElementById("is_post")?.value
    let title = document.getElementById("title_addPost").value
    let body = document.getElementById("body_addPost").value
    let image = document.getElementById("img_addPost").files[0]

    let formData = new FormData()
    formData.append("title", title)
    formData.append("body", body)
    formData.append("image", image)


    let url = ""
    const token = localStorage.getItem("token")
    console.log(token);

    const headers = {
        "authorization": `Bearer ${token}`,
        "Content-Type": "multipart/form-data"
    }

    if (postID == null || postID == "") {
        url = `${baseUrl}/posts`

    } else {
        url = `${baseUrl}/posts/${postID}`
        formData.append("_method", "put")
    }

    axios.post(url, formData, {
        headers: headers
    }).then(response => {
        var myModal = document.getElementById('aaddPost');
        var modal = bootstrap.Modal.getOrCreateInstance(myModal)
        modal.hide()
        showSucceAlert("success add post", "success")
        // هنا قم بإضافة استدعاء للدالة getPost() بعد إخفاء النموذج
        getPost()
    }).catch((error) => {
        const message = error.response.data.message
        showSucceAlert(message, "danger")
    })
}

function postClicked(postId) {
    window.location.href = `postDetails.html?postId=${postId}`
    // alert(id)
}

// postClicked()


function editPostBtn(postObject) {
    let post = JSON.parse(decodeURIComponent(postObject))
    document.getElementById("is_submit").value = "Updata post"
    document.getElementById("is_post").value = post.id
    document.getElementById("title_model_post").innerText = "Edit post"
    document.getElementById("title_addPost").value = post.title
    document.getElementById("body_addPost").value = post.body
    // document.getElementById("img_addPost").src = post.image

    console.log(post);
    // return
    let postModal = new bootstrap.Modal(document.getElementById('aaddPost'), {})
    postModal.toggle()
}

function addPostBtn() {
    document.getElementById("is_submit").value = "Add post"
    document.getElementById("is_post").value = ""
    document.getElementById("title_model_post").innerText = "add post"
    document.getElementById("title_addPost").value = ""
    document.getElementById("body_addPost").value = ""
    // document.getElementById("img_addPost").src = post.image
    let postModal = new bootstrap.Modal(document.getElementById('aaddPost'), {})
    postModal.toggle()
}

let idDelete = document.getElementById('idPostDelete');

function DeletePost(postID) {
    let postModal = new bootstrap.Modal(document.getElementById('modalDeletePost'), {});
    postModal.toggle();
    idDelete.value = postID;
    console.log("idDelete: " + idDelete.value);
}

function confirmPostDelelt() {
    let token = localStorage.getItem("token");
    const headers = {
        "authorization": `Bearer ${token}`,
        "Content-Type": "multipart/form-data"
    }
    axios.delete(`${baseUrl}/posts/${idDelete.value}`, {
        headers
    })
        .then(response => {
            console.log(response);
            var myModal = document.getElementById('modalDeletePost');
            var modal = bootstrap.Modal.getOrCreateInstance(myModal)
            modal.hide()
            showSucceAlert("delete is Post Success", "success")
            setupUI()
            getPost()
        }).catch((error) => {
            const message = error.response.data.message
            console.log(error);
            console.log(message);
            showSucceAlert(message, "danger")
        })

}

function getUser(IDUser) {
    window.location.href = `profile.html?usersId=${IDUser}`
}