const handleSubscribe = (e) => {

};

const SettingsWindow = (props) => {
    let btnText = "";
    if (props.isSubscribed) btnText = "Unsubscribe";
    else btnText = "Subscribe";
    <div className="card border border-primary bannerCard">
        <form id="settingsForm" 
            name="settingsForm"
            onSubmit={handleSubscribe}
            action="/subscribe"
            method="POST"
            >
            <label htmlFor="Banner Name">Account Settings</label>
            <input type="hidden" name="_csrf" value={props.csrf}/>
            <input className="btn btn-primary" type="submit" value={btnText} />
        </form>
    </div>
};

const createSettingsWindow = (result) => {
    sendAjax('GET', '/getSub', null, (accountInfo) => {
        ReactDOM.render(
            <SettingsWindow isSubscribed={accountInfo.subscriptionStatus} csrf={result.csrfToken}/>,
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