import Decimal from "./modules/break_infinity.js";
import * as data from "./modules/data.js";
import * as notationengine from "./modules/notationengine.js";

const ts = new Date()

var game = {
    activeCooldowns : {
    },
    version: "v0.1-BETA",
    currentPage: 1,
    craftingBondPreview: {
        text: "",
    },
    selectedProductionItem: null,
    currentTimestamp: 0,
}

var player = {
    c: 299_792_458,
    baseEnergyMultiplier: 0.0000000000000000115,
    energy: new Decimal(0),
    elements: data.baseElements,
    stats: {
        bondsCrafted: {},
    },
    production: ["", "", null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null,],
    settings: {
        framerate: 24,
    },
}

function produceEnergy(bond) {
    const bondData = data.bonds[bond];

    if (!bondData) return;

    for (const [element, count] of Object.entries(bondData.elements)) if (!player.elements[element].unlocked || player.elements[element].count < count) return;

    let totalMass = 0;
    for (const [element, count] of Object.entries(bondData.elements)) totalMass += data.dat[element].atomic_weight * count;

    const energyYield = new Decimal(totalMass).times(player.c ** 2);
    const totalEnergy = energyYield.times(player.baseEnergyMultiplier);

    if(!(bond in game.activeCooldowns)) game.activeCooldowns[bond] = 0;
    const cooldownDuration = totalEnergy.toNumber() * 500;
    game.activeCooldowns[bond] = cooldownDuration;

    for (const [element, count] of Object.entries(bondData.elements)) player.elements[element].count -= count;

    player.energy = player.energy.plus(totalEnergy);
    player.stats.bondsCrafted[bond] = (bond in player.stats.bondsCrafted) ? player.stats.bondsCrafted[bond] + 1 : 1;
}

function updateValues() {
    game.currentTimestamp = ts.getTime();
    const intervalTime = 1000/player.settings.framerate;

    for (let i = 0; i<player.production.length; i++) {
        if (!(player.production[i] == "")) {
            if( game.activeCooldowns[player.production[i]] > 0) {
                game.activeCooldowns[player.production[i]] -= intervalTime;
            } else {
                produceEnergy(player.production[i]);
            }
        }
    }

    if (game.currentPage == 1) {
        game.craftingBondPreview.text = "";
        let show = "";

        for (const elementKey in player.elements) {
            if (game.craftingBondPreview[elementKey] == 1) {
                game.craftingBondPreview.text = game.craftingBondPreview.text + elementKey;
                show = show + elementKey;
            } else if (game.craftingBondPreview[elementKey] > 1) {
                game.craftingBondPreview.text = game.craftingBondPreview.text + elementKey + game.craftingBondPreview[elementKey];
                show = show + elementKey + game.craftingBondPreview[elementKey].toString().sub();
            }
        }
        
        document.getElementById('craftingBondPreviewText').innerHTML = show;
        document.getElementById('craftingBondRegisterButton').src = (game.craftingBondPreview.text in data.bonds) ? "./img/button/arrow_square_green.svg" : "./img/button/arrow_square_red.svg";
        document.getElementById('craftingBondPreviewName').innerHTML = (game.craftingBondPreview.text in data.bonds) ? data.bonds[game.craftingBondPreview.text].name : "";
    }

}

function drawValues() {
    document.getElementById('energyDisplayVarCorner').innerHTML = notationengine.biNotation(player.energy, 3) + " Energy";

    showPage(game.currentPage);

    if (game.currentPage == 1) {
        for (const elementKey in player.elements) document.getElementById(`element${elementKey}`).style.filter = player.elements[elementKey].unlocked ? "grayscale(0%)" : "grayscale(100%)";

        for (let i = 0; i<player.production.length; i++) {
            if (player.production[i] == null) document.getElementById(`production${i+1}`).src = "";
            else if (player.production[i] == "") document.getElementById(`production${i+1}`).src = "./img/button/production_empty.svg";
            else document.getElementById(`production${i+1}`).src = `./img/button/production/${player.production[i]}.svg`;
        }   
    }
}

function productionItemClickEvent(id) {
    if (game.selectedProductionItem != id) {
        game.selectedProductionItem = id;
    
        for (let i = 0; i<player.production.length; i++) {
            document.getElementById(`production${i+1}`).style.filter = game.selectedProductionItem == i ? "grayscale(50%)" : "grayscale(0%)";
        }
        return;
    }

    game.selectedProductionItem = null;
    for (let i = 0; i<player.production.length; i++) {
        document.getElementById(`production${i+1}`).style.filter = "grayscale(0%)";
    }
}

function craftingBondRegister() {
    if (game.selectedProductionItem == null) return;

    player.production[game.selectedProductionItem] = game.craftingBondPreview.text;
    game.selectedProductionItem = null;
    for (let i = 0; i<player.production.length; i++) {
        document.getElementById(`production${i+1}`).style.filter = "grayscale(0%)";
    }
    for (const elementKey in player.elements) game.craftingBondPreview[elementKey] = 0;
}

function frame() {
    updateValues();
    drawValues();
}

function showPage(num) {
    let pages = ["homePage", "craftingPage"];
    for(let i = 0; i<pages.length; i++) document.getElementById(pages[i]).style = "display: none;";
    document.getElementById(pages[num]).style = "display: block";
}

function save(destination) {
    const payload = JSON.stringify(player);

    if (destination == 0) {
        //cookie
    } else if (destination == 1) {
        const a = document.createElement('a');
        a.download = "save_" + game.currentTimestamp + ".json";
        a.href = `data:application/payload,${window.encodeURIComponent(payload)}`;
        a.click();
        a.remove();
    }
}

function load(payload) {
    player.energy = new Decimal(payload.energy) ?? new Decimal(0);
    player.c = payload.c ?? 299_792_458;
    player.baseEnergyMultiplier = payload.baseEnergyMultiplier ?? 0.0000000000000000115;
    for (let elementKey in player.elements) {
        player.elements[elementKey] = payload.elements[elementKey] ?? data.baseElements;
    }

    player.stats.bondsCrafted = payload.stats.bondsCrafted ?? {};

    player.production = payload.production ?? ["", "", null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null,];

    for (let setting in player.settings) {
        player.settings[setting] = payload.settings[setting];
    }
}

window.onload = () => {
    document.getElementById('overviewPageButton').addEventListener("click", (event) => game.currentPage = 0);
    document.getElementById('craftingPageButton').addEventListener("click", (event) => game.currentPage = 1);
    document.getElementById('saveButton').addEventListener("click", () => save(1))
    document.getElementById('loadButton').addEventListener("click", () => load(JSON.parse(prompt())))


    for (let i = 0; i<player.production.length; i++) document.getElementById(`production${i+1}`).addEventListener("click", () => productionItemClickEvent(i))

    document.getElementById('craftingBondPreviewClearButton').addEventListener("click", () => {for (const elementKey in player.elements) game.craftingBondPreview[elementKey] = 0;})
    document.getElementById('craftingBondRegisterButton').addEventListener("click", () => craftingBondRegister())
    for (const elementKey in player.elements) {
        document.getElementById(`element${elementKey}`).addEventListener("click", () => {if (player.elements[elementKey].unlocked == true) game.craftingBondPreview[elementKey] = (elementKey in game.craftingBondPreview) ? game.craftingBondPreview[elementKey] + 1 : 1 });
    }

    setInterval(frame, 1000/player.settings.framerate);
};