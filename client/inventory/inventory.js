const CharacterList = function(props) {
    console.log(props);
    if (props.characters.length === 0) {
        return (
            <div className="characterList">
                <h3 className="emtpyCharacters">No Characters yet</h3>
            </div>
        );
    }

    const characterNodes = props.characters.map(function(character) {
        return (
            <div key={character._id} className="card w-10 character">
                <img src="/assets/img/test.jpeg" alt="character picture" className="characterImage" />
                <h3 className="card-title characterName"> Name: {character.name} </h3>
                <h3 className="card-text characterRarity"> Rarity: {character.rarity} </h3>
                <h3 className="card-text characterElement">Element: {character.element} </h3>
                <h3 className="card-text characterWeapon">Weapon Type: {character.weapon} </h3>
                <h3 className="card-text characterQuantity">Quantity: {character.quantity}</h3>
            </div>
        );
    });

    return (
        <div className="characterList">
            {characterNodes}
        </div>
    );
};

const WeaponList = function(props) {
    console.log(props);
    if (props.weapons.length === 0) {
        return (
            <div className="weaponList">
                <h3 className="emtpyWeapon">No Weapons yet</h3>
            </div>
        );
    }

    const weaponsNodes = props.weapons.map(function(weapon) {
        return (
            <div key={weapon._id} className="card w-10 weapon">
                <img src="/assets/img/test.jpeg" alt="weapon picture" className="weaponImage" />
                <h3 className="card-title weaponName"> Name: {weapon.name} </h3>
                <h3 className="card-text weaponRarity"> Rarity: {weapon.rarity} </h3>
                <h3 className="card-text weaponType">Weapon Type: {weapon.type} </h3>
                <h3 className="card-text weaponQuantity">Quantity: {weapon.quantity}</h3>
            </div>
        );
    });

    return (
        <div className="weaponList">
            {weaponsNodes}
        </div>
    );
};

const loadInventoryFromServer = () => {
    sendAjax('GET', '/getItems', null, (data) => {
        ReactDOM.render(
            <CharacterList characters={data.items} />, document.querySelector("#characters")
        );
        /*()
        ReactDOM.render(
            <WeaponList weapons={data.items} />, document.querySelector("#weapons")
        );
        */
    });
};

const setup = function(csrf) {
    loadInventoryFromServer();
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});