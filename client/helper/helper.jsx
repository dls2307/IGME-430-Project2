const handleError = (message) => {
    $("#errorHandling").text(message);
};

const handleJSON = (jsonObject)=>{
    $("#errorHandling").text(jsonObject.message);
}

const redirect = (response) => {
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
        error: function(xhr, status, error) {
            var messageObj = JSON.parse(xhr.responseText);
            handleError(messageObj.error);
        }
    });
};

// Password changing
const handlePassChange = (e) => {
    e.preventDefault();

    if ($("#oldPass").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
        handleError("All fields are required");
        return false;
    }

    if ($("#pass").val() !== $("#pass2").val()) {
        handleError("Passwords do not match");
        return false;
    }

    sendAjax('POST', $("#passChangeForm").attr("action"), $("#passChangeForm").serialize(), handleError, redirect);
    return false;
};

const PassChangeWindow = (props) => {
    return (
        <form id="passChangeForm"
              name="passChangeForm"
              onSubmit={handlePassChange}
              action="/passChange"
              method="POST"
              className="mainForm form-group"
              >
              <label htmlFor="oldPass">Old password: </label>
              <input id="oldPass" type="password" className="form-control" name="oldPass" placeholder="old password"/>
              <label htmlFor="pass">New Password: </label>
              <input id="pass" type="password" className="form-control" name="pass" placeholder="new password"/>
              <label htmlFor="pass2">Retype New Password: </label>
              <input id="pass2" type="password" className="form-control" name="pass2" placeholder="retype new password"/>
              <input type="hidden" name="_csrf" value={props.csrf}/>
              <input id="passSubmit" className="btn btn-primary" type="submit" value="Change Password" />
        </form>
    );
};

const createPassChangeWindow = (csrf) => {
    ReactDOM.render(
        <PassChangeWindow csrf={csrf} />,
        document.querySelector("#content")
    );
};