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
    if (props.results.results.length === 0) {
        return (
            <div className="resultsList">
                <h3 className="emptyResults">No Results Yet</h3>
            </div>
        );
    }

    const resultsNodes = props.results.results.map(function(item) {
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

const createResultsWindow = (input) => {
    sendAjax('GET', '/getResults', null, (results) => {
        ReactDOM.render(
            <ResultsWindow results={results}/>,
            document.querySelector("#bannerResults")
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
                    action="/pullCharacter"
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
            <div className="card border border-primary bannerCard">
                <form id="bannerForm" 
                    name="bannerForm"
                    onSubmit={handleSummon}
                    action="/pullWeapon"
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
        <BannerWindow bannerInfo={result.bannerInfo} csrf={result.csrfToken} />,
        document.querySelector("#banner")
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

    createBannerWindow(result);
    createResultsWindow(result);
    
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result);
    });
};

$(document).ready(function() {
    getToken();
});