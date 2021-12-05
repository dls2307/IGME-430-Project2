"use strict";

var handleSubscribe = function handleSubscribe(e) {
  e.preventDefault();
  sendAjax('POST', $("#settingsForm").attr("action"), $("#settingsForm").serialize(), redirect);
  return false;
};

var handleDeleteInventory = function handleDeleteInventory(e) {
  e.preventDefault();
  sendAjax('DELETE', $("#deleteInventoryForm").attr("action"), $("#deleteInventoryForm").serialize(), handleJSON);
  return false;
};

var handleDeleteAccount = function handleDeleteAccount(e) {
  e.preventDefault();
  sendAjax('DELETE', $("#deleteAccountForm").attr("action"), $("#deleteAccountForm").serialize(), redirect);
  return false;
};

var SettingsWindow = function SettingsWindow(props) {
  var btnText = "";
  if (props.isSubscribed === true) btnText = "Unsubscribe";else btnText = "Subscribe";
  return /*#__PURE__*/React.createElement("div", {
    className: "card border border-primary bannerCard"
  }, /*#__PURE__*/React.createElement("form", {
    id: "settingsForm",
    name: "settingsForm",
    onSubmit: handleSubscribe,
    action: "/subscribe",
    method: "POST"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "Banner Name"
  }, "Account Settings"), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("p", null, "Subscribe to increase your chances for rarer and more powerful characters!"), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "btn btn-primary",
    type: "submit",
    value: btnText
  })), /*#__PURE__*/React.createElement("form", {
    id: "deleteInventoryForm",
    name: "deleteInventoryForm",
    onSubmit: handleDeleteInventory,
    action: "/deleteInventory",
    method: "DELETE"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "Banner Name"
  }, "Delete Inventory"), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("p", null, "Delete your inventory."), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "btn btn-primary",
    type: "submit",
    value: "Delete Inventory"
  })), /*#__PURE__*/React.createElement("form", {
    id: "deleteAccountForm",
    name: "deleteAccountForm",
    onSubmit: handleDeleteAccount,
    action: "/deleteAccount",
    method: "DELETE"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "Banner Name"
  }, "Delete Account"), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("p", null, "Delete your account."), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "btn btn-primary",
    type: "submit",
    value: "Delete Account"
  })));
};

var createSettingsWindow = function createSettingsWindow(result) {
  sendAjax('GET', '/getSub', null, function (accountInfo) {
    ReactDOM.render( /*#__PURE__*/React.createElement(SettingsWindow, {
      isSubscribed: accountInfo.subscribed,
      csrf: result.csrfToken
    }), document.querySelector('#accountSettings'));
  });
};

var setup = function setup(result) {
  var changePassButton = document.querySelector("#changePassButton");
  changePassButton.addEventListener("click", function (e) {
    e.preventDefault();
    createPassChangeWindow(result.csrfToken);
    return false;
  });
  createSettingsWindow(result);
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result);
  });
};

$(document).ready(function () {
  getToken();
});
"use strict";

//Handle Error messages
var handleError = function handleError(message) {
  if (typeof message === "string") {
    $("#errorHandling").text(message);
  }
}; //Handle JSON messages


var handleJSON = function handleJSON(jsonObject) {
  if (jsonObject.message) {
    $("#errorHandling").text(jsonObject.message);
  }
}; //Handle redirects


var redirect = function redirect(response) {
  window.location = response.redirect;
}; //Server calls


var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cashe: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
}; // Password changing


var handlePassChange = function handlePassChange(e) {
  e.preventDefault();

  if ($("#oldPass").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
    handleError("All fields are required");
    return false;
  }

  if ($("#pass").val() !== $("#pass2").val()) {
    handleError("Passwords do not match");
    return false;
  }

  sendAjax('POST', $("#passChangeForm").attr("action"), $("#passChangeForm").serialize(), handleJSON, handleError);
  return false;
}; //Pass Change Window Info


var PassChangeWindow = function PassChangeWindow(props) {
  return /*#__PURE__*/React.createElement("form", {
    id: "passChangeForm",
    name: "passChangeForm",
    onSubmit: handlePassChange,
    action: "/passChange",
    method: "POST",
    className: "mainForm form-group"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "oldPass"
  }, "Old password: "), /*#__PURE__*/React.createElement("input", {
    id: "oldPass",
    type: "password",
    className: "form-control",
    name: "oldPass",
    placeholder: "old password"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "pass"
  }, "New Password: "), /*#__PURE__*/React.createElement("input", {
    id: "pass",
    type: "password",
    className: "form-control",
    name: "pass",
    placeholder: "new password"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "pass2"
  }, "Retype New Password: "), /*#__PURE__*/React.createElement("input", {
    id: "pass2",
    type: "password",
    className: "form-control",
    name: "pass2",
    placeholder: "retype new password"
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    id: "passSubmit",
    className: "btn btn-primary",
    type: "submit",
    value: "Change Password"
  }));
}; //Render Pass Change window


var createPassChangeWindow = function createPassChangeWindow(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(PassChangeWindow, {
    csrf: csrf
  }), document.querySelector("#content"));
};
