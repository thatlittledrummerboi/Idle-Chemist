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
    elementBuyPercentage: 20,
}

var player = {
    c: 299_792_458,
    baseEnergyMultiplier: 0.0000000000000000115,
    baseElementDivider: 32000000000000000,
    energy: new Decimal(100),
    elements: data.baseElements,
    stats: {
        bondsCrafted: {},
    },
    production: ["", "", "", "", "", null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null,],
    settings: {
        framerate: 24,
    },
}

function calculateElementCost(elementKey) {
    const atomicWeight = data.dat[elementKey]?.atomic_weight;
    if (!atomicWeight) {
        console.error(`Atomic weight for ${elementKey} not found.`);
        return null;
    }
    let d = new Decimal((atomicWeight / player.c ** 2) * player.baseElementDivider);
    return new Decimal(d);
}

function attemptElementPurchase(element) {
    if (!player.elements[element].unlocked) {
        for (let requirement in data.requirements[element]) {
            if (requirement in player.elements) {
                if (player.elements[requirement].count.lt((data.requirements[element][requirement]))) return (false);
            }
            else if (player[requirement].lt(data.requirements[element][requirement])) return (false);
        } 
        for (let requirement in data.requirements[element]) {
            if (requirement in player.elements) player.elements[requirement].count = player.elements[requirement].count.minus(data.requirements[element][requirement]);
            else player[requirement] = player[requirement].minus(data.requirements[element][requirement]);
        }
        player.elements[element].unlocked = true;
        return;
    }
    player.elements[element].count = player.elements[element].count.plus(player.energy.mul(game.elementBuyPercentage).div(calculateElementCost(element)));
    player.energy = player.energy.minus(player.energy.mul(game.elementBuyPercentage));
}

function checkAffordUnlock(elementKey) {
    for (let requirement in data.requirements[elementKey]) {
        if (requirement in player.elements) {
            if (player.elements[requirement].count.lt((data.requirements[elementKey][requirement]))) return (false);
        }
        else if (player[requirement].lt(data.requirements[elementKey][requirement])) return (false);
    } 
    return true;
}

function produceEnergy(bond) {
    const bondData = data.bonds[bond];

    if (!bondData) return;

    for (const [element, count] of Object.entries(bondData.elements)) if (!player.elements[element].unlocked || player.elements[element].count.lt(count)) return;

    let totalMass = 0;
    for (const [element, count] of Object.entries(bondData.elements)) totalMass += data.dat[element].atomic_weight * count;

    const energyYield = new Decimal(totalMass).times(player.c ** 2);
    const totalEnergy = energyYield.times(player.baseEnergyMultiplier);

    if(!(bond in game.activeCooldowns)) game.activeCooldowns[bond] = 0;
    const cooldownDuration = totalEnergy.toNumber() * 500;
    game.activeCooldowns[bond] = cooldownDuration;

    for (const [element, count] of Object.entries(bondData.elements)) player.elements[element].count = player.elements[element].count.minus(count);

    player.energy = player.energy.plus(totalEnergy);
    player.stats.bondsCrafted[bond] = (bond in player.stats.bondsCrafted) ? player.stats.bondsCrafted[bond] + 1 : 1;
}

function getCooldownDuration(bond) {
    const bondData = data.bonds[bond];

    if (!bondData) return;

    for (const [element, count] of Object.entries(bondData.elements)) if (!player.elements[element].unlocked || player.elements[element].count.lt(count)) return;

    let totalMass = 0;
    for (const [element, count] of Object.entries(bondData.elements)) totalMass += data.dat[element].atomic_weight * count;

    const energyYield = new Decimal(totalMass).times(player.c ** 2);
    const totalEnergy = energyYield.times(player.baseEnergyMultiplier);

    if(!(bond in game.activeCooldowns)) game.activeCooldowns[bond] = 0;
    const cooldownDuration = totalEnergy.toNumber() * 500;
    return(cooldownDuration);
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
            if (player.production[i] == null) document.getElementById(`production${i+1}`).style.display = "none";
            else if (player.production[i] == "") {
                document.getElementById(`productionButton${i+1}`).src = "./img/button/production_empty.svg";
                document.getElementById(`production${i+1}Progress`).removeAttribute('value');
            }
            else {
                document.getElementById(`productionButton${i+1}`).src = `./img/button/production/${player.production[i]}.svg`; 
                document.getElementById(`production${i+1}Progress`).value = isFinite(game.activeCooldowns[player.production[i]] / getCooldownDuration(player.production[i])) ? game.activeCooldowns[player.production[i]] / getCooldownDuration(player.production[i]) : null;
            }

        }   
    }

    if (game.currentPage == 2) {

        game.elementBuyPercentage = (document.getElementById('elementBuyPercentage').value) / 100;
        document.getElementById('elementBuyPercentagePreview').innerHTML = (game.elementBuyPercentage * 100).toFixed(0);

        for (let elementKey in player.elements) {
            if (player.elements[elementKey].unlocked) {
                document.getElementById(`elementInventoryItemCount${elementKey}`).style.display = "block";

                document.getElementById(`elementInventoryItemImage${elementKey}`).style.filter = "grayscale(0%)";
                document.getElementById(`elementPurchase${elementKey}`).style = "border-color: rgba(0, 255, 0, 1); background-color: rgba(0, 255, 50, 0.2)";
                document.getElementById(`elementInventoryItemCount${elementKey}`).innerHTML = "Count: " + notationengine.biNotation(player.elements[elementKey].count, 2);
                document.getElementById(`elementPurchase${elementKey}`).innerHTML = `buy ${notationengine.biNotation((player.energy.mul(game.elementBuyPercentage)).div(calculateElementCost(elementKey)), 2)} ${data.dat[elementKey].name}`;
            } else {
                let canAfford = checkAffordUnlock(elementKey);
                
                document.getElementById(`elementInventoryItemImage${elementKey}`).style.filter = "grayscale(100%)";
                document.getElementById(`elementInventoryItemCount${elementKey}`).style.display = "none";
                document.getElementById(`elementPurchase${elementKey}`).style = canAfford ? "border-color: rgba(0, 255, 0, 1); background-color: rgba(0, 255, 50, 0.2)" : "border-color: rgba(255, 0, 0, 1); background-color: rgba(255, 50, 50, 0.4)";
                document.getElementById(`elementPurchase${elementKey}`).innerHTML = "Unlock";
            }
        }
    }
}


function productionItemClickEvent(id) {
    if (game.selectedProductionItem != id) {
        game.selectedProductionItem = id;
    
        for (let i = 0; i<player.production.length; i++) {
            document.getElementById(`productionButton${i+1}`).style.filter = game.selectedProductionItem == i ? "grayscale(50%)" : "grayscale(0%)";
        }
        return;
    }

    game.selectedProductionItem = null;
    console.log('a')
    for (let i = 0; i<player.production.length; i++) {
        document.getElementById(`productionButton${i+1}`).style.filter = "grayscale(0%)";
    }
}

function craftingBondRegister() {
    if (game.selectedProductionItem == null) return;

    player.production[game.selectedProductionItem] = game.craftingBondPreview.text;
    game.selectedProductionItem = null;
    for (let i = 0; i<player.production.length; i++) {
        document.getElementById(`productionButton${i+1}`).style.filter = "grayscale(0%)";
    }
    for (const elementKey in player.elements) game.craftingBondPreview[elementKey] = 0;
}

function frame() {
    updateValues();
    drawValues();
}

function showPage(num) {
    let pages = ["homePage", "craftingPage", "inventoryPage"];
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
    player.baseElementDivider = payload.baseElementDivider ?? 32000000000000000;
    for (let elementKey in player.elements) {
        player.elements[elementKey].count = new Decimal(payload.elements[elementKey].count) ?? data.baseElements[elementKey].count;
        player.elements[elementKey].unlocked = payload.elements[elementKey].unlocked ?? data.baseElements[elementKey].unlocked;
    }

    player.stats.bondsCrafted = payload.stats.bondsCrafted ?? {};

    player.production = payload.production ?? ["", "", null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null,];

    for (let setting in player.settings) {
        player.settings[setting] = payload.settings[setting];
    }
}

window.onload = () => {
    document.getElementById('overviewPageButton').addEventListener("click", () => game.currentPage = 0);
    document.getElementById('craftingPageButton').addEventListener("click", () => game.currentPage = 1);
    document.getElementById('inventoryPageButton').addEventListener("click", () => game.currentPage = 2);
    document.getElementById('saveButton').addEventListener("click", () => save(1));
    document.getElementById('loadButton').addEventListener("click", () => load(JSON.parse(prompt())));



    document.getElementById('craftingBondPreviewClearButton').addEventListener("click", () => {for (const elementKey in player.elements) game.craftingBondPreview[elementKey] = 0;})
    document.getElementById('craftingBondRegisterButton').addEventListener("click", () => craftingBondRegister())
    for (const elementKey in player.elements) {
        document.getElementById(`element${elementKey}`).addEventListener("click", () => {if (player.elements[elementKey].unlocked == true) game.craftingBondPreview[elementKey] = (elementKey in game.craftingBondPreview) ? game.craftingBondPreview[elementKey] + 1 : 1 });
    }

    let x = "";
    for (let elementKey in player.elements) x = x + `<div class="elementInventoryItem" id="elementInventoryItem${elementKey}"><img src="./img/PeriodicTableElements/${elementKey}.svg" alt="" id="elementInventoryItemImage${elementKey}"><p id="elementInventoryItemCount${elementKey}">Count: [0]</p><button id=elementPurchase${elementKey}>[buy]</button><br><br></div>`;
    document.getElementById('elementInventory').innerHTML = x;

    for (let elementKey in player.elements) document.getElementById(`elementPurchase${elementKey}`).addEventListener("click", () => attemptElementPurchase(elementKey));

    let y = "";
    for (let i = 0; i<player.production.length; i++) y = y + `<div id="production${i+1}"><img src="./img/button/production_empty.svg" id="productionButton${i+1}"><progress min="0" max="1" id="production${i+1}Progress"></progress></div>`;
    document.getElementById('productionList').innerHTML = y;

    for (let i = 0; i<player.production.length; i++) document.getElementById(`productionButton${i+1}`).addEventListener("click", () => productionItemClickEvent(i));

    setInterval(frame, 1000/player.settings.framerate);
};