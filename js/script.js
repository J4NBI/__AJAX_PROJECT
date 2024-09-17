$("form").on("submit", function (event){
  // DONT SEND DATA (SUBMIT)
  event.preventDefault();

  //RESET INPUTS
  $(".text-error").text("");

  // Name validation
  let nameValidateReturn = validateName($("#name").val());

  // Email validation
  let emailValidateReturn = validateEmail($("#email").val());
  let textValidateReturn = $("#message").val() 

  // Error Message Name
  if (!nameValidateReturn){
    $("#name").addClass("invalid-input")
    $(".text-error").text("Vor und Nachname bitte!");
  }

  //INPUT BORDER TO GREEN
  if (nameValidateReturn && emailValidateReturn) {
    $("#name").removeClass("invalid-input")
    $("#name").addClass("valid-input")
    $("#email").removeClass("invalid-input")
    $("#email").addClass("valid-input")
  }

  // #####################
  // IF VALIDATION SUCCESS
  // #####################

  if (nameValidateReturn && emailValidateReturn && textValidateReturn !== "") {
    
    // GET EMAIL
    let email = $("#email").val();
    // GET MESSAGE
    let message = $("#message").val();

    // Name to right Case
    let name = $("#name").val();
    name = name.toLowerCase().split(" ");
   
    let firstName = name[0].charAt(0).toUpperCase() + name[0].slice(1);
    let lastName = name[1].charAt(0).toUpperCase() + name[1].slice(1);
1   
    // Date ID
    let dateID = new Date();
    console.log(dateID);

    //CREATE USER AND MESSAGE
    let userMessage = new NewUser(firstName, lastName, email,message, dateID);
    console.log(userMessage);


    // GET EXISTING USERS FROM SERVER
    let reqGet = new XMLHttpRequest();
    reqGet.open("GET", "https://api.jsonbin.io/v3/b/66c78f1ead19ca34f8999b88", true);
    reqGet.setRequestHeader("X-Master-Key", "$2a$10$xis0ZLOtF9ObfFc1C.eGYuWSiDE50NMUF3yBljAfjP.PQjZczgRBO");

    // CHECK SATUS
    reqGet.onreadystatechange = () => {
      if (reqGet.readyState == XMLHttpRequest.DONE) {

        //PARSE JSON FILE
        let response = JSON.parse(reqGet.responseText);

        // UPDATE USERS
        response = response.record;

        // GET OLD USERS
        let existingUsers = response.record.record.users;
        existingUsers.push(userMessage);
       
        // UPDATE NEW USERS
        response.record.record.users = existingUsers;
        
        // CONVERT TO JSON
        let updatedData = JSON.stringify(response);
    
        // PUT DATA TO SERVER
        let reqPut = new XMLHttpRequest();
        reqPut.open("PUT", "https://api.jsonbin.io/v3/b/66c78f1ead19ca34f8999b88", true);
        reqPut.setRequestHeader("X-Master-Key", "$2a$10$xis0ZLOtF9ObfFc1C.eGYuWSiDE50NMUF3yBljAfjP.PQjZczgRBO");
        reqPut.setRequestHeader("Content-Type", "application/json");
        reqPut.send(updatedData);
        
        // ON FINISH SHOW SUCCES
        reqPut.onreadystatechange = () => {
          if (reqPut.readyState == XMLHttpRequest.DONE) {
            console.log("Data updated successfully!");
            // FADE SUCCESS
            $("form").fadeOut(1000);
            setTimeout(() => {
              $("form").html(`<h2> Hallo ${userMessage.firstname}!<br> Nachricht erfolgreich gesendet!</h2>`);
            }, 1000)
            $("form").fadeIn(1000);
            $('form').click(function() {
              location.reload();
          });
          }
        };
      }
    };
    reqGet.send();

  }
    
});


// Validate Name with RegEx Function

function validateName(name) {
  let nameRegex = /^[a-zA-ZäöüÄÖÜß]+ [a-zA-ZäöüÄÖÜß]+$/;
  if (nameRegex.test(name)) {
    return true;
  } else {
    return false;
  }
};

// Validate Email with RegEx Function
function validateEmail(email) {
  let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (emailRegex.test(email)) {
    return true;
  } else {
    return false;
  }
};

// USER CONSTRUCTOR

function NewUser (firstName,lastName, email,message,date){
  this.firstname = firstName;
  this.lastname = lastName;
  this.email = email;
  this.message = message;
  this.date = date;
}

