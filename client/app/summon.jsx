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
    const fiveStarFocusNodes = props.bannerInfo.fiveStarFocus.map(function(fiveStar) {
        return (
            <div>
                <h4 className="">5 Star Focus: {fiveStar} </h4>
            </div>
        );
    });

    const fourStarFocusNodes = props.bannerInfo.fourStarFocus.map(function(fourStar) {
        return (
            <div>
                <h5>4 Star Focus: {fourStar}</h5>
            </div>
        );
    });

    return (
        <div className="card border border-primary bannerCard">
             <form id="bannerForm" 
                name="bannerForm"
                onSubmit={singleSummon}
                action="/pullItem"
                method="GET"
                >
                <div className="focuses">
                    <div className="fiveFocus">
                        { fiveStarFocusNodes }
                    </div>
                    <div className="fourFocus">
                        { fourStarFocusNodes }
                    </div>
                </div>
                <label htmlFor="Banner Name">Amber Banner</label>
                <input type="hidden" name="_csrf" value={props.csrf}/>
                <input className="btn btn-primary" type="submit" value="Pull" />
            </form>
        </div>
    );
};

const createBannerWindow = (result)=>{
    ReactDOM.render(
        <BannerWindow bannerInfo={result.bannerInfo} csrf={result.csrf} />,
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

    sendAjax('POST', $("#passChangeForm").attr("action"), $("#passChangeForm").serialize());
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
              <input id="oldPass" type="password" name="oldPass" placeholder="old password"/>
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
        document.querySelector("#content")
    );
};

const setup = (result) => {
    const changePassButton = document.querySelector("#changePassButton");
    console.log(result);

    changePassButton.addEventListener("click", (e) =>{
        e.preventDefault();
        createPassChangeWindow(result.csrfToken);
        return false;
    });

    if (result.justSummoned === true) {
        createResultsWindow(result);
    }
    else if (result.bannerInfo !== null) {
        createBannerWindow(result);
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