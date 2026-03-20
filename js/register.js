let firstNameInput = document.querySelector("#first-name");
let lastNameInput = document.querySelector("#last-name");
let emailInput = document.querySelector("#email");
let passwordInput = document.querySelector("#password");
let confirmPasswordInput = document.querySelector("#confirm-password");
let submit = document.querySelector(".submit");
let emailLable = document.querySelector(".form label #email + span");
let passwordLable = document.querySelector(".form label #password + span");
let confirmPasswordLable = document.querySelector(
  ".form label #confirm-password + span",
);

passwordInput.style.userSelect = "none";
confirmPasswordInput.style.userSelect = "none";

let passwordReg =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+\-=\[\]{};:'",.<>\/\\|`~])[A-Za-z\d@$!%*?&#^()_+\-=\[\]{};:'",.<>\/\\|`~]{8,}$/;
let emailReg =
  /^[a-zA-Z0-9][a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]*[a-zA-Z0-9]@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

emailInput.addEventListener("keyup", () => {
  if (emailReg.test(emailInput.value)) {
    emailLable.style.color = "green";
  } else {
    emailLable.style.color = "red";
  }
});
passwordInput.addEventListener("keyup", () => {
  if (passwordReg.test(passwordInput.value)) {
    passwordLable.style.color = "green";
  } else {
    passwordLable.style.color = "red";
  }
});
confirmPasswordInput.addEventListener("keyup", () => {
  if (confirmPasswordInput.value.trim() !== "") {
    if (confirmPasswordInput.value === passwordInput.value) {
      confirmPasswordLable.style.color = "green";
    } else {
      confirmPasswordLable.style.color = "red";
    }
  }
});

submit.addEventListener("click", (e) => {
  e.preventDefault();
  if (
    passwordReg.test(passwordInput.value) &&
    confirmPasswordInput.value === passwordInput.value &&
    emailReg.test(emailInput.value) &&
    firstNameInput.value.trim() !== "" &&
    lastNameInput.value.trim() !== ""
  ) {
    Swal.fire({
      title: "congrates!",
      text: "you have registered successfully and you can login now.",
      icon: "success",
    });

    let userInformation = {
      firstName: firstNameInput.value,
      lastName: lastNameInput.value,
      email: emailInput.value,
      password: passwordInput.value,
    };

    firstNameInput.value = "";
    lastNameInput.value = "";
    emailInput.value = "";
    passwordInput.value = "";
    confirmPasswordInput.value = "";

    emailLable.style.color = "rgba(255, 255, 255, 0.5)";
    passwordLable.style.color = "rgba(255, 255, 255, 0.5)";
    confirmPasswordLable.style.color = "rgba(255, 255, 255, 0.5)";

    console.log("userInformation", userInformation);
  } else {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "please fill the form correctly and don't leave any field empty.",
    });
  }
});
