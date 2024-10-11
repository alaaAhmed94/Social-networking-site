const baseUrl = "https://tarmeezacademy.com/api/v1"

setupUI()

function LoginBtnClicked() {
    const username = document.getElementById("loginUserName").value
    const password = document.getElementById("loginPassword").value
    const params = {
        username,
        password
    }

    axios.post(`${baseUrl}/login`, params)
        .then(response => {
            console.log(response);
            console.log(response.data.token)
            localStorage.setItem('token', response.data.token)
            localStorage.setItem('user', JSON.stringify(response.data.user))

            var myModal = document.getElementById('Login');
            var modal = bootstrap.Modal.getOrCreateInstance(myModal)
            modal.hide()
            showSucceAlert("login success", "success")
            setupUI()
        }).catch((error) => {
            showSucceAlert(error, "danger")
        })

}

function registerBtnClicked() {
    const name = document.getElementById("name_register").value;
    const username = document.getElementById("username_register").value
    const email = document.getElementById("email_register").value
    const password = document.getElementById("password_register").value
    const profile_image = document.getElementById("profile_image").files[0]

    let formData = new FormData()
    formData.append("name", name)
    formData.append("username", username)
    formData.append("email", email)
    formData.append("password", password)
    formData.append("image", profile_image)

    axios.post(`${baseUrl}/register`, formData)
        .then(response => {
            localStorage.setItem('token', response.data.token)
            localStorage.setItem('user', JSON.stringify(response.data.user))
            var myModal = document.getElementById('Register');
            var modal = bootstrap.Modal.getOrCreateInstance(myModal)
            modal.hide()
            showSucceAlert("register success", "success")
            setupUI()
        }).catch((error) => {
            showSucceAlert(error, "danger")
        })
}

function logout() {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    showSucceAlert("logout success", "success")
    setupUI()
}

// داله ChatGPT 3.5
let notificationCount = 0; // متغير لتتبع عدد الإشعارات وتوليد هويات فريدة
function showSucceAlert(CustomMessage, type) {
    const alertPlaceholder = document.getElementById('success-alert');
    const appendAlert = (message, type, notificationId) => {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = [
            `<div class="alert alert-${type} alert-dismissible" id="${notificationId}" role="alert">`,
            `   <div>${message}</div>`,
            '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
            '</div>'
        ].join('');

        alertPlaceholder.append(wrapper);
        setTimeout(function () {
            // إزالة الإشعار بعد فترة زمنية محددة
            const notification = document.getElementById(notificationId);
            if (notification) {
                notification.remove();
            }
        }, 3000); // 5 ثواني
    };

    const notificationId = `notification-${notificationCount}`; // توليد هوية فريدة
    appendAlert(CustomMessage, type, notificationId);
    notificationCount++; // زيادة عدد الإشعارات
}


function setupUI() {
    // start no logged
    const token = localStorage.getItem("token")
    const userLocalStorage = localStorage.getItem("user")
    const loginBtn = document.getElementById("Register-btn")
    const registerBtn = document.getElementById("Login-btn")
    // end no logged
    // start for logged
    const LogOutBtn = document.getElementById("LogOut-btn")
    // end for logged
    const addPost = document.getElementById("addPost")
    const img_profile = document.getElementById("img_profile")

    if (token == null) {

        LogOutBtn.style.display = "none"
        loginBtn.style.display = "block"
        registerBtn.style.display = "block"
        addPost.style.display = "none"
        img_profile.style.display = "none"

    } else {

        loginBtn.style.display = "none"
        registerBtn.style.display = "none"
        LogOutBtn.style.display = "block"
        addPost !== null ? addPost.style.display = "flex" : ""
        img_profile.style.display = "block"
        const user = getCurrentUser()
        document.getElementById("imgProfile").src = user.profile_image
        document.getElementById("name_user").innerHTML = user.username

    }
}

function getCurrentUser() {
    let user = null
    const StorageUser = localStorage.getItem("user")
    if (StorageUser !== null) {
        user = JSON.parse(StorageUser)
    }
    return user
}
