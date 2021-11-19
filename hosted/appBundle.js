// Banner creations
const BannerWindow = props => {
  return /*#__PURE__*/React.createElement("form", {
    id: "bannerForm",
    name: "bannerForm",
    action: "/summon",
    method: "POST",
    className: "mainForm"
  }, /*#__PURE__*/React.createElement("input", {
    id: "singleSum",
    type: "button",
    onClick: handleSummon
  }, "Summon Once"), /*#__PURE__*/React.createElement("input", {
    id: "tenfoldSum",
    type: "button",
    onClick: tenfoldSummon
  }, "Summon Ten Times"));
};

const singleSummon = e => {
  handleSummon(e, 1);
};

const tenfoldSummon = e => {
  handleSummon(e, 10);
};

const handleSummon = (e, summonCount) => {}; // Password changing


const handlePassChange = e => {
  e.preventDefault();

  if ($("#oldPass").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
    handleError("All fields are required");
    return false;
  }

  if ($("#pass").val() !== $("#pass2").val()) {
    handleError("Passwords do not match");
    return false;
  }

  sendAjax('POST', $("#passChangeForm").attr("action"), $("#passChangeForm").serialize(), redirect);
  return false;
};

const PassChangeWindow = props => {
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
    type: "text",
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

const createPassChangeWindow = csrf => {
  ReactDOM.render( /*#__PURE__*/React.createElement(PassChangeWindow, {
    csrf: csrf
  }), docuemnt.querySelector("#content"));
};

const setup = csrf => {
  const changePassButton = document.querySelector("#changePassButton");
  changePassButton.addEventListener("click", e => {
    e.preventDefault();
    createPassChangeWindow(csrf);
    return false;
  });
  createLoginWindow(csrf); //default view
};

const getToken = () => {
  sendAjax('GET', '/getToken', null, result => {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});
const handleError = message => {
  $("#errorHandling").text(message);
};

const redirect = response => {
  $("#domoMessage").animate({
    width: 'hide'
  }, 350);
  window.location = response.redirect;
};

const sendAjax = (type, action, data, success) => {
  $.ajax({
    cashe: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function (xhr, status, error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};
