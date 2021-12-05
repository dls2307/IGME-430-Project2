const handleSubscribe = (e) => {
    e.preventDefault();
    sendAjax('POST', $("#settingsForm").attr("action"), $("#settingsForm").serialize(), redirect);
    return false;
};

const handleDeleteInventory = (e)=>{
    e.preventDefault();
    sendAjax('DELETE',$("#deleteInventoryForm").attr("action"),$("#deleteInventoryForm").serialize(),handleError);
    return false;
}

const handleDeleteAccount = (e)=>{
    e.preventDefault();
    sendAjax('DELETE',$("#deleteAccountForm").attr("action"),$("#deleteAccountForm").serialize(),redirect);
    return false;
}

const SettingsWindow = (props) => {
    let btnText = "";
    if (props.isSubscribed === true) btnText = "Unsubscribe";
    else btnText = "Subscribe";

    return (
    <div className="card border border-primary bannerCard">
        <form id="settingsForm" 
            name="settingsForm"
            onSubmit={handleSubscribe}
            action="/subscribe"
            method="POST"
            >
            <label htmlFor="Banner Name">Account Settings</label>
            <br />
            <p>Subscribe to increase your chances for rarer and more powerful characters!</p>
            <input type="hidden" name="_csrf" value={props.csrf}/>
            <input className="btn btn-primary" type="submit" value={btnText} />
        </form>
        <form id="deleteInventoryForm" 
            name="deleteInventoryForm"
            onSubmit={handleDeleteInventory}
            action="/deleteInventory"
            method="DELETE"
            >
            <label htmlFor="Banner Name">Account Settings</label>
            <br />
            <p>Delete your inventory.</p>
            <input type="hidden" name="_csrf" value={props.csrf}/>
            <input className="btn btn-primary" type="submit" value={btnText} />
        </form>
        <form id="deleteAccountForm" 
            name="deleteAccountForm"
            onSubmit={handleDeleteAccount}
            action="/deleteAccount"
            method="DELETE"
            >
            <label htmlFor="Banner Name">Account Settings</label>
            <br />
            <p>Delete your account.</p>
            <input type="hidden" name="_csrf" value={props.csrf}/>
            <input className="btn btn-primary" type="submit" value={btnText} />
        </form>
    </div>
    );
    
};

const createSettingsWindow = (result) => {
    sendAjax('GET', '/getSub', null, (accountInfo) => {
        ReactDOM.render(
            <SettingsWindow isSubscribed={accountInfo.subscribed} csrf={result.csrfToken}/>,
            document.querySelector('#accountSettings')
        );
    });
};

const setup = (result) => {
    const changePassButton = document.querySelector("#changePassButton");

    changePassButton.addEventListener("click", (e) =>{
        e.preventDefault();
        createPassChangeWindow(result.csrfToken);
        return false;
    });

    createSettingsWindow(result);
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result);
    });
};

$(document).ready(function() {
    getToken();
});