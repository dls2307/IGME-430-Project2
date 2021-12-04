"use strict";

var CharacterList = function CharacterList(props) {
  if (props.characters.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "characterList"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "emtpyCharacters"
    }, "No Characters yet"));
  }

  var characterNodes = props.characters.map(function (character) {
    return /*#__PURE__*/React.createElement("div", {
      key: character._id,
      className: "card w-10 character"
    }, /*#__PURE__*/React.createElement("img", {
      src: character.image,
      alt: "character picture",
      className: "characterImage"
    }), /*#__PURE__*/React.createElement("h3", {
      className: "card-title characterName"
    }, " Name: ", character.name, " "), /*#__PURE__*/React.createElement("h3", {
      className: "card-text characterRarity"
    }, " Rarity: ", character.rarity, " "), /*#__PURE__*/React.createElement("h3", {
      className: "card-text characterElement"
    }, "Element: ", character.element, " "), /*#__PURE__*/React.createElement("h3", {
      className: "card-text characterWeapon"
    }, "Weapon Type: ", character.weaponType, " "), /*#__PURE__*/React.createElement("h3", {
      className: "card-text characterQuantity"
    }, "Quantity: ", character.quantity));
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "characterList"
  }, characterNodes);
};

var WeaponList = function WeaponList(props) {
  console.log(props);

  if (props.weapons.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "weaponList"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "emtpyWeapon"
    }, "No Weapons yet"));
  }

  var weaponsNodes = props.weapons.map(function (weapon) {
    return /*#__PURE__*/React.createElement("div", {
      key: weapon._id,
      className: "card w-10 weapon"
    }, /*#__PURE__*/React.createElement("img", {
      src: "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Ambor.png",
      alt: "weapon picture",
      className: "weaponImage"
    }), /*#__PURE__*/React.createElement("h3", {
      className: "card-title weaponName"
    }, " Name: ", weapon.name, " "), /*#__PURE__*/React.createElement("h3", {
      className: "card-text weaponRarity"
    }, " Rarity: ", weapon.rarity, " "), /*#__PURE__*/React.createElement("h3", {
      className: "card-text weaponType"
    }, "Weapon Type: ", weapon.weaponType, " "), /*#__PURE__*/React.createElement("h3", {
      className: "card-text weaponQuantity"
    }, "Quantity: ", weapon.quantity));
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "weaponList"
  }, weaponsNodes);
};

var loadInventoryFromServer = function loadInventoryFromServer() {
  sendAjax('GET', '/getItems', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(CharacterList, {
      characters: data.items
    }), document.querySelector("#characters"));
    /*()
    ReactDOM.render(
        <WeaponList weapons={data.items} />, document.querySelector("#weapons")
    );
    */
  });
};

var setup = function setup(csrf) {
  loadInventoryFromServer();
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
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
