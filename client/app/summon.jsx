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

const ResultsWindow = (props) => {
    const resultNodes = props.items.map(function(item) {
        return (
            <div key={character._id} className="card w-10 character">
                <img src={character.image} alt="character picture" className="characterImage" />
                <h3 className="card-title characterName"> Name: {character.name} </h3>
                <h3 className="card-text characterRarity"> Rarity: {character.rarity} </h3>
                <h3 className="card-text characterWeapon">Weapon Type: {character.weaponType} </h3>
            </div>
        );
    });

    return (
        <div className="resultsList">
            {resultsNodes}
        </div>
    );
};

const createResultsWindow = (results) => {
    ReactDOM.render(
        <ResultsWindow results/>,
        document.querySelector("#content")
    );
};

const singleSummon = (e) => { handleSummon(e, 1); };
const tenfoldSummon = (e) => { handleSummon(e, 10); };

// Tells the server that the user is summoning, and gives them the number of summons to perform.
const handleSummon = (e, summonCount) => {
    e.preventDefault();
    sendAjax('GET', $("#bannerForm").attr("action"), summonCount, redirect);
    return false;
};

const BannerWindow = (props) =>{
    return (
        <div className="card border border-primary bannerCard">
             <form id="bannerForm" 
                name="bannerForm"
                onSubmit={singleSummon}
                action="/pullItem"
                method="GET"
                >
                <label htmlFor="Banner Name">Amber Banner</label>
                <input type="hidden" name="_csrf" value={props.csrf}/>
                <input className="btn btn-primary" type="submit" value="Pull" />
            </form>
        </div>
    );
};

const createBannerWindow = (csrf)=>{
    ReactDOM.render(
        <BannerWindow csrf={csrf} />,
        document.querySelector("#content")
    );
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

    sendAjax('POST', $("#passChangeForm").attr("action"), $("#passChangeForm").serialize(), redirect);
    return false;
};

const PassChangeWindow = (props) => {
    return (
        <form id="passChangeForm"
              name="passChangeForm"
              onSubmit={handlePassChange}
              action="/passChange"
              method="POST"
              className="mainForm"
              >
              <label htmlFor="oldPass">Old password: </label>
              <input id="oldPass" type="text" name="oldPass" placeholder="old password"/>
              <label htmlFor="pass">New Password: </label>
              <input id="pass" type="password" name="pass" placeholder="new password"/>
              <label htmlFor="pass2">Retype New Password: </label>
              <input id="pass2" type="password" name="pass2" placeholder="retype new password"/>
              <input type="hidden" name="_csrf" value={props.csrf}/>
              <input className="formSubmit" type="submit" value="Change Password" />
        </form>
    );
};

const createPassChangeWindow = (csrf) => {
    ReactDOM.render(
        <PassChangeWindow csrf={csrf} />,
        docuemnt.querySelector("#content")
    );
};

const setup = (result) => {
    const changePassButton = document.querySelector("#changePassButton");

    changePassButton.addEventListener("click", (e) =>{
        e.preventDefault();
        createPassChangeWindow(result.csrf);
        return false;
    });

    if (result.justSummoned === true) {
        reateResultsWindow(result);
    }
    else {
        createBannerWindow(result.csrf);
    }
    

    
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result);
    });
};

$(document).ready(function() {
    getToken();
});