"use strict";

// Banner creations

/*const BannerWindow = (props) => {
    return (
        <form id="bannerForm"
            name="bannerForm"
            action="/summon"
            method="POST"
            className="mainForm"
            >
            <h3>{props.bannerTitle}</h3>
            <p>{props.bannerDescription}</p>
            <input id="singleSum" type="button" onClick={singleSummon}>Summon Once</input>
            <input id="tenfoldSum" type="button" onClick={tenfoldSummon}>Summon Ten Times</input>
        </form>
    );
};*/
var createResultsWindow = function createResultsWindow(results) {
  ReactDOM.render( /*#__PURE__*/React.createElement(ResultsWindow, null), document.querySelector("#content"));
};

var singleSummon = function singleSummon(e) {
  handleSummon(e, 1);
};

var tenfoldSummon = function tenfoldSummon(e) {
  handleSummon(e, 10);
}; // Tells the server that the user is summoning, and gives them the number of summons to perform.


var handleSummon = function handleSummon(e, summonCount) {
  sendAjax('GET', $("#bannerForm").attr("action"), summonCount, redirect);
  return false;
};

var BannerWindow = function BannerWindow(props) {
  console.log(props);
  return /*#__PURE__*/React.createElement("div", {
    className: "card border border-primary bannerCard"
  }, /*#__PURE__*/React.createElement("form", {
    id: "bannerForm",
    name: "bannerForm",
    onSubmit: singleSummon,
    action: "/pullItem",
    method: "GET"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "Banner Name"
  }, "Amber Banner"), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "btn btn-primary",
    type: "submit",
    value: "Pull"
  })));
};

var createBannerWindow = function createBannerWindow(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(BannerWindow, {
    csrf: csrf
  }), document.querySelector("#content"));
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

  sendAjax('POST', $("#passChangeForm").attr("action"), $("#passChangeForm").serialize(), redirect);
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

var createPassChangeWindow = function createPassChangeWindow(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(PassChangeWindow, {
    csrf: csrf
  }), docuemnt.querySelector("#content"));
};

var setup = function setup(result) {
  var changePassButton = document.querySelector("#changePassButton");
  changePassButton.addEventListener("click", function (e) {
    e.preventDefault();
    createPassChangeWindow(result.csrf);
    return false;
  });

  if (result.justSummoned === true) {//reateResultsWindow(result);
  } else {
    createBannerWindow(result.csrf);
  }
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
};
