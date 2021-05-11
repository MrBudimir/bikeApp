import { showMessage } from "react-native-flash-message";

class Message {
  wrongLoginData = () => {
    showMessage({
      message: "Login Failed",
      type: "danger",
      icon: "danger",
      description: "Wrong E-mail or Password!",
    });
  };

  showSuccessMessage = () => {
    showMessage({
      message: "Successful",
      type: "success",
      icon: "success",
      description: "You rented a bike successfully!",
      duration: 2000,
    });
  };

  showFailMessage = (err) => {
    showMessage({
      message: "Fail",
      type: "danger",
      icon: "danger",
      description: "Oops, something went wrong!",
      duration: 2000,
    });
    console.log(err);
  };

  successfullySaved() {
    showMessage({
      message: "Successful",
      type: "success",
      icon: "success",
      description: "You saved your account successfully!",
      duration: 2000,
    });
  }

  successMessage(message, description) {
    showMessage({
      message: message,
      type: "success",
      icon: "success",
      description: description,
      duration: 2000,
    });
  }

  failMessage(message, description) {
    showMessage({
      message: message,
      type: "danger",
      icon: "danger",
      description: description,
      duration: 3500,
    });
  }

  failSignupMessage(message, description) {
    showMessage({
      message: message,
      type: "danger",
      icon: "danger",
      description: description,
      autoHide: false,
      position: "bottom",
    });
  }
}

export default Message;
