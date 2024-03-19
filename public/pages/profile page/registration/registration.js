function prepareData() {
    // Validate the data on the backend
    let fullName = document.getElementById("name").innerHTML;
    if (fullName.length > 50) {
        alert("Invalid Name field. Please try again.");
        return;
    }
    let address1 = document.getElementById("address1").innerHTML;
    if (address1.length > 100) {
        alert("Invalid Address 1 field. Please try again.");
        return;
    }
    let address2 = document.getElementById("address2").innerHTML;
    if (address2.length > 100) {
        alert("Invalid Address 2 field. Please try again.");
        return;
    }
    let city = document.getElementById("city").innerHTML;
    if (city.length > 100) {
        alert("Invalid City field. Please try again.");
        return;
    }
    let state = document.getElementById("state").innerHTML;
    let zipCode = document.getElementById("zip_code").innerHTML;
    if (zipCode.match(/^[0-9]+$/)) {
        alert("Please enter a valid Zip Code");
        return;
    }
    // Data to be sent to the server if all validation passes
    var data = {
        "Full Name": fullName,
        "Address 1": address1,
        "Address 2": address2,
        "City": city,
        "State": state,
        "Zip Code": zipCode
    };
    const dataJSON = JSON.stringify(data);
}