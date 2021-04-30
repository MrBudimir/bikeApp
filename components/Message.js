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
      description: "You rent a bike successfully!",
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
}

export default Message;
