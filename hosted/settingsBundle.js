"use strict";

var handleSubscribe = function handleSubscribe(e) {};

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

var handleError = function handleError(message) {
  $("#errorHandling").text(message);
};

var redirect = function redirect(response) {
  window.location = response.redirect;
};

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

  sendAjax('POST', $("#passChangeForm").attr("action"), $("#passChangeForm").serialize());
  return false;
};

var PassChangeWindow = function PassChangeWindow(props) {
  return /*#__PURE__*/React.createElement("form", {
    id: "passChangeForm",
    name: "passChangeForm",
    onSubmit: handlePassChange,
    action: "/passChange",
    method: "POST",
    className: "mainForm"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "oldPass"
  }, "Old password: "), /*#__PURE__*/React.createElement("input", {
    id: "oldPass",
    type: "password",
    name: "oldPass",
    placeholder: "old password"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "pass"
  }, "New Password: "), /*#__PURE__*/React.createElement("input", {
    id: "pass",
    type: "password",
    name: "pass",
    placeholder: "new password"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "pass2"
  }, "Retype New Password: "), /*#__PURE__*/React.createElement("input", {
    id: "pass2",
    type: "password",
    name: "pass2",
    placeholder: "retype new password"
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "formSubmit",
    type: "submit",
    value: "Change Password"
  }));
};

var createPassChangeWindow = function createPassChangeWindow(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(PassChangeWindow, {
    csrf: csrf
  }), document.querySelector("#content"));
};
