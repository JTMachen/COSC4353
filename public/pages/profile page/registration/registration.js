function prepareData() {
    // Validate the data on the backend
    let fullName = document.getElementById("name").value;
    if (fullName.length > 50 || fullName.length == 0) {
        alert("Invalid Name field. Please try again.");
        return false;
    }
    let address1 = document.getElementById("address1").value;
    if (address1.length > 100 || address1.length == 0) {
        alert("Invalid Address 1 field. Please try again.");
        return false;
    }
    let address2 = document.getElementById("address2").value;
    if (address2.length > 100) {
        alert("Invalid Address 2 field. Please try again.");
        return false;
    }
    let city = document.getElementById("city").value;
    if (city.length > 100 || city.length == 0) {
        alert("Invalid City field. Please try again.");
        return false;
    }
    let state = document.getElementById("state").value;
    let zipCode = document.getElementById("zip_code").value;
    if (!/^\d*$/.test(parseInt(zipCode)) || zipCode.length < 5 || zipCode.length > 9) {
        alert("Please enter a valid Zip Code");
        return false;
    }
    
    // Data to be sent to the server if all validation passes
    const currentUser = JSON.parse(sessionStorage.getItem('registeredUser'));
    const username = currentUser.username;
    var userData = {
        "username": username,
        "Full Name": fullName,
        "Address 1": address1,
        "Address 2": address2,
        "City": city,
        "State": state,
        "Zip Code": zipCode
    };
    fetch('/registration', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.location.href = '/pages/profile page/home page/home.html';
        }
        else {
            console.error('Registration failed: ', data.message);
        }
    })
    .catch(error => {
        console.error("Error: ", error);
    });
}