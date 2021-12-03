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
    if (props.results.length === 0) {
        return (
            <div className="resultsList">
                <h3 className="emptyResults">No Results Yet</h3>
            </div>
        );
    }

    const resultNodes = props.results.map(function(item) {
        return (
            <div key={item._id} className="card w-10 character">
                <img src={item.image} alt="character picture" className="characterImage" />
                <h3 className="card-title characterName"> Name: {item.name} </h3>
                <h3 className="card-text characterRarity"> Rarity: {item.rarity} </h3>
                <h3 className="card-text characterWeapon">Weapon Type: {item.weaponType} </h3>
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
    sendAjax('GET', '/getResults', null, (results) => {
        ReactDOM.render(
            <ResultsWindow results={results}/>,
            document.querySelector("#content")
        );
    });
    
};

// Tells the server that the user is summoning, and gives them the number of summons to perform.
const handleSummon = (e) => {
    sendAjax('GET', $("#bannerForm").attr("action"), redirect);
    return false;
};

const BannerWindow = (props) =>{

    return (
        <div>
            <div className="card border border-primary bannerCard">
                <form id="bannerForm" 
                    name="bannerForm"
                    onSubmit={handleSummon}
                    action="/pullCharacterBanner"
                    method="GET"
                    >
                    <label htmlFor="Banner Name">Character Banner</label>
                    <img src="https://uploadstatic-sea.mihoyo.com/contentweb/20210510/2021051011383243523.png" alt="eulaPortrait" />
                    <img src="https://uploadstatic-sea.mihoyo.com/contentweb/20200325/2020032510564718459.png" alt="noellePortrait" />
                    <img src="https://uploadstatic-sea.mihoyo.com/contentweb/20200402/2020040211242065763.png" alt="fischlPortrait" />
                    <img src="https://uploadstatic-sea.mihoyo.com/contentweb/20211021/2021102111163585990.png" alt="thomaPortrait" />
                    <input type="hidden" name="_csrf" value={props.csrf}/>
                    <input className="btn btn-primary" type="submit" value="Pull" />
                </form>
            </div>
            <div>
                <form id="bannerForm" 
                    name="bannerForm"
                    onSubmit={handleSummon}
                    action="/pullWeaponBanner"
                    method="GET"
                    >
                    <label htmlFor="Banner Name">Weapon Banner</label>
                    <img src="https://static.wikia.nocookie.net/gensin-impact/images/4/4f/Weapon_Wolf%27s_Gravestone.png" alt="wolfGravestone" />
                    <img src="https://static.wikia.nocookie.net/gensin-impact/images/1/17/Weapon_Staff_of_Homa.png" alt="staffOfHoma" />
                    <input type="hidden" name="_csrf" value={props.csrf}/>
                    <input className="btn btn-primary" type="submit" value="Pull" />
                </form>
            </div>
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
    console.log(props);
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

    createResultsWindow(result);
    createBannerWindow(result);
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result);
    });
};

$(document).ready(function() {
    getToken();
});