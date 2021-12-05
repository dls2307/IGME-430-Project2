"use strict";

var ResultsWindow = function ResultsWindow(props) {
  if (props.results.results.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "resultsList"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "emptyResults"
    }, "No Results Yet"));
  }

  var resultsNodes = props.results.results.map(function (item) {
    return /*#__PURE__*/React.createElement("div", {
      key: item._id,
      className: "card w-10 character"
    }, /*#__PURE__*/React.createElement("img", {
      src: item.image,
      alt: "character picture",
      className: "characterImage"
    }), /*#__PURE__*/React.createElement("h3", {
      className: "card-title characterName"
    }, " Name: ", item.name, " "), /*#__PURE__*/React.createElement("h3", {
      className: "card-text characterRarity"
    }, " Rarity: ", item.rarity, " "), /*#__PURE__*/React.createElement("h3", {
      className: "card-text characterWeapon"
    }, "Weapon Type: ", item.weaponType, " "));
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "resultsList"
  }, resultsNodes);
};

var createResultsWindow = function createResultsWindow(input) {
  sendAjax('GET', '/getResults', null, function (results) {
    ReactDOM.render( /*#__PURE__*/React.createElement(ResultsWindow, {
      results: results
    }), document.querySelector("#bannerResults"));
  });
}; // Tells the server that the user is summoning, and gives them the number of summons to perform.


var handleCharacterSummon = function handleCharacterSummon(e) {
  e.preventDefault();
  sendAjax('GET', $("#characterBannerForm").attr("action"), $("#characterBannerForm").serialize(), redirect);
  return false;
};

var handleWeaponSummon = function handleWeaponSummon(e) {
  e.preventDefault();
  sendAjax('GET', $("#weaponBannerForm").attr("action"), $("#weaponBannerForm").serialize(), redirect);
  return false;
};

var BannerWindow = function BannerWindow(props) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "card border border-primary bannerCard"
  }, /*#__PURE__*/React.createElement("form", {
    id: "characterBannerForm",
    name: "bannerForm",
    onSubmit: handleCharacterSummon,
    action: "/pullCharacter",
    method: "GET"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "Banner Name"
  }, "Character Banner"), /*#__PURE__*/React.createElement("img", {
    src: "https://uploadstatic-sea.mihoyo.com/contentweb/20210510/2021051011383243523.png",
    alt: "eulaPortrait"
  }), /*#__PURE__*/React.createElement("img", {
    src: "https://uploadstatic-sea.mihoyo.com/contentweb/20200325/2020032510564718459.png",
    alt: "noellePortrait"
  }), /*#__PURE__*/React.createElement("img", {
    src: "https://uploadstatic-sea.mihoyo.com/contentweb/20200402/2020040211242065763.png",
    alt: "fischlPortrait"
  }), /*#__PURE__*/React.createElement("img", {
    src: "https://uploadstatic-sea.mihoyo.com/contentweb/20211021/2021102111163585990.png",
    alt: "thomaPortrait"
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "btn btn-primary",
    type: "submit",
    value: "Pull"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "card border border-primary bannerCard"
  }, /*#__PURE__*/React.createElement("form", {
    id: "weaponBannerForm",
    name: "bannerForm",
    onSubmit: handleWeaponSummon,
    action: "/pullWeapon",
    method: "GET"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "Banner Name"
  }, "Weapon Banner"), /*#__PURE__*/React.createElement("img", {
    src: "https://static.wikia.nocookie.net/gensin-impact/images/4/4f/Weapon_Wolf%27s_Gravestone.png",
    alt: "wolfGravestone"
  }), /*#__PURE__*/React.createElement("img", {
    src: "https://static.wikia.nocookie.net/gensin-impact/images/1/17/Weapon_Staff_of_Homa.png",
    alt: "staffOfHoma"
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "btn btn-primary",
    type: "submit",
    value: "Pull"
  }))));
};

var createBannerWindow = function createBannerWindow(result) {
  ReactDOM.render( /*#__PURE__*/React.createElement(BannerWindow, {
    bannerInfo: result.bannerInfo,
    csrf: result.csrfToken
  }), document.querySelector("#banner"));
};

var setup = function setup(result) {
  var changePassButton = document.querySelector("#changePassButton");
  console.log(result);
  changePassButton.addEventListener("click", function (e) {
    e.preventDefault();
    createPassChangeWindow(result.csrfToken);
    return false;
  });
  createBannerWindow(result);
  createResultsWindow(result);
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
  if (typeof message === "string") {
    $("#errorHandling").text(message);
  }
};

var handleJSON = function handleJSON(jsonObject) {
  if (jsonObject.message) {
    $("#errorHandling").text(jsonObject.message);
  }
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

  sendAjax('POST', $("#passChangeForm").attr("action"), $("#passChangeForm").serialize(), handleJSON, handleError);
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
