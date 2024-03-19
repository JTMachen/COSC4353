document.addEventListener('DOMContentLoaded', function() {
    function getUserInfoFromSession() {
        console.log(sessionStorage.getItem('loggedInUser'));
        const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
        const registeredUser = JSON.parse(sessionStorage.getItem('registeredUser'));
        return loggedInUser || registeredUser;
    }

    function populateFormWithUserInfo(user) {
        document.getElementById('username').value = user.username;
    }
    const userInfo = getUserInfoFromSession();
    if (userInfo) {
        populateFormWithUserInfo(userInfo);
    }

    const registrationForm = document.querySelector('form');

    registrationForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        const formData = {
            username: username,
            password: password
        };

        fetch('/initial_register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                window.location.href = '/login.html';
            } else {
                console.error('Registration failed:', data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
});
