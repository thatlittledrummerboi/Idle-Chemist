import Decimal from "./modules/break_infinity.js";
import { compatibilityCheck, fatalErrorDiagnosticTable } from "./modules/compatibilityCheck.js";
import * as data from "./modules/data.js";
import * as notationengine from "./modules/notationengine.js";

// Setup for Object "game"
var game = {
    version: "0.3-BETA",
    currentPage: 0,
    craftingBondPreview: {text: ""},
    selectedProductionItem: null,
    currentTimestamp: 0,
    elementBuyPercentage: 20,
    checkedForSave: false,
}

// Setup for Object "player"
function Player() {
    this.c = 299_792_458;
    this.baseEnergyMultiplier = 0.0000000000000000115;
    this.baseElementDivider = 32000000000000000;
    this.energy = new Decimal(1000);
    this.elements = data.baseElements;
    this.stats = {
        bondsCrafted: {},
        productionUnlocked: 1,
    };
    this.production = [{bond: '', cooldown: 0}, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null,];
    this.settings = {
        framerate: 24,
        ignoreTimestampFromSave: false,
    };
    this.timestampSinceLastTick = 0;
    this.version = "";
    this.lastAutosaves = {'30sec': 0, '5min': 0, '20min': 0, '1hr': 0}; // 30 sec, 5 min, 20 min, 1 hr
}

var player = new Player();

// Function to calculate cost of an element
function calculateElementCost(elementKey) {
    const atomicWeight = data.elements[elementKey]?.atomic_weight;
    if (!atomicWeight) {
        console.error(`Atomic weight for ${elementKey} not found.`);
        return null;
    }
    let d = new Decimal((atomicWeight / player.c ** 2) * player.baseElementDivider);
    return new Decimal(d);
}

// Function to attempt to buy an element
function attemptElementPurchase(elementKey) {
    // Checks if element is unlocked
    if (!player.elements[elementKey].unlocked) {
        for (let requirement in data.requirements[elementKey]) {
            // Checks if player has enough resources to unlock
            if (requirement in player.elements) { if (player.elements[requirement].count.lt(data.requirements[elementKey][requirement])) return false; }
            else if (requirement in player.stats.bondsCrafted) { if (player.stats.bondsCrafted[requirement].count.lt(data.requirements[elementKey][requirement])) return false; }
            else if (player[requirement].lt(data.requirements[elementKey][requirement])) return false;
        } 
        // Subtract resources from player
        for (let requirement in data.requirements[elementKey]) {
            if (requirement in player.elements) player.elements[requirement].count = player.elements[requirement].count.minus(data.requirements[elementKey][requirement]);
            else if (requirement in player.stats.bondsCrafted);
            else player[requirement] = player[requirement].minus(data.requirements[elementKey][requirement]);
        }
        player.elements[elementKey].unlocked = true;
        return;
    }
    // Add elements bnased on player's money
    player.elements[elementKey].count = player.elements[elementKey].count.plus(player.energy.mul(game.elementBuyPercentage).div(calculateElementCost(elementKey)));
    player.energy = player.energy.minus(player.energy.mul(game.elementBuyPercentage));
}

// function to chefck if player can afford to unlock an element
function checkAffordUnlock(elementKey) {
    for (let requirement in data.requirements[elementKey]) {
        if (requirement in player.elements) { if (player.elements[requirement].count.lt(data.requirements[elementKey][requirement])) return (false); }
        else if (requirement in player.stats.bondsCrafted) { if (player.stats.bondsCrafted[requirement].lt(data.requirements[elementKey][requirement])) return false; }
        else if (player[requirement].lt(data.requirements[elementKey][requirement])) return false;
    } 
    return true;
}

function produceEnergy(slotIndex) {
    const productionSlot = player.production[slotIndex];
    const bond = productionSlot.bond;

    if (!bond) return; // Skip empty slots

    const bondData = data.bonds[bond];
    if (!bondData) return; // Invalid bond

    // Check if the player has enough elements for the bond
    for (const [element, count] of Object.entries(bondData.elements)) {
        if (!player.elements[element].unlocked || player.elements[element].count.lt(count)) return;
    }

    // Calculate total mass and energy yield
    let totalMass = 0;
    for (const [element, count] of Object.entries(bondData.elements)) {
        totalMass += data.elements[element].atomic_weight * count;
    }
    const energyYield = new Decimal(totalMass).times(player.c ** 2);
    const totalEnergy = energyYield.times(player.baseEnergyMultiplier);

    // Assign cooldown duration based on energy yield
    productionSlot.cooldown = totalEnergy.toNumber() * 500;

    // Deduct elements used for the bond
    for (const [element, count] of Object.entries(bondData.elements)) {
        player.elements[element].count = player.elements[element].count.minus(count);
    }

    // Add energy to the player's total
    player.energy = player.energy.plus(totalEnergy);
    player.stats.bondsCrafted[bond] = player.stats.bondsCrafted[bond].plus(1);
}

function getCooldownDuration(bond) {
    const bondData = data.bonds[bond];

    if (!bondData) return;

    for (const [element, count] of Object.entries(bondData.elements)) if (!player.elements[element].unlocked || player.elements[element].count.lt(count)) return;

    let totalMass = 0;
    for (const [element, count] of Object.entries(bondData.elements)) totalMass += data.elements[element].atomic_weight * count;

    const energyYield = new Decimal(totalMass).times(player.c ** 2);
    const totalEnergy = energyYield.times(player.baseEnergyMultiplier);

    const cooldownDuration = totalEnergy.toNumber() * 500;
    return(cooldownDuration);
}

function updateValues() {
    const times = {'30sec': 30_000, '5min': 300_000, '20min': 1_200_000, '1hr': 3_600_000};
    for (let delay in player.lastAutosaves) {
        if (Date.now() - player.lastAutosaves[delay] >= times[delay]) {
            player.lastAutosaves[delay] = Date.now();
            save(0, delay)
        }
    }

    if (!game.checkedForSave) {
        game.checkedForSave = true;
        let x = window.localStorage.getItem("default");
        if (x != undefined) load(JSON.parse(x));
    }

    game.currentTimestamp = Date.now();
    player.timestampSinceLastTick = game.currentTimestamp;
    const intervalTime = 1000/player.settings.framerate;

    // Process production slots
    for (let i = 0; i < player.production.length; i++) {
        const productionSlot = player.production[i];
        if (productionSlot == null) continue;
        if (productionSlot.bond) {
            if (productionSlot.cooldown > 0) {
                productionSlot.cooldown -= intervalTime;
            } else {
                produceEnergy(i);
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
    document.getElementById('energyDisplayVarCorner').innerHTML = `${notationengine.biNotation(player.energy, 3)} Energy`;

    showPage(game.currentPage);
    // Production Page (game.currentPage === 0)
    if (game.currentPage === 0) {
        for (let i = 0; i < player.production.length; i++) {
            const productionSlot = player.production[i];
        
            document.getElementById(`productionItemPreview${i + 1}Text`).innerHTML = player.production[i] == null
                ? ""
                : player.production[i].bond == "" ? `${i+1}. Empty` : `${i + 1}. ${player.production[i].bond}: ${notationengine.timeNotation(Math.round(productionSlot.cooldown))}`;
        }

        for (const elementKey in player.elements) {
            document.getElementById(`inventoryItemPreview${elementKey}`).innerHTML = player.elements[elementKey].unlocked == true ? `${data.elements[elementKey].name}: ${notationengine.biNotation(player.elements[elementKey].count)}` : ``;
        }
    }

    if (game.currentPage == 1) {
        for (const elementKey in player.elements) document.getElementById(`element${elementKey}`).style.filter = player.elements[elementKey].unlocked ? "grayscale(0%)" : "grayscale(100%)";

        for (let i = 0; i<player.production.length; i++) {
            if (player.production[i] == null) document.getElementById(`production${i+1}`).style.display = "none";
            else if (player.production[i].bond == "") {
                document.getElementById(`production${i+1}Image`).src = "./img/button/production_empty.svg";
                document.getElementById(`production${i+1}Progress`).removeAttribute('value');
                document.getElementById(`production${i+1}Text`).innerHTML = "";
            }
            else {
                let cooldownProgress = player.production[i].cooldown / getCooldownDuration(player.production[i].bond);
                document.getElementById(`production${i+1}Image`).src = "./img/button/production_filled.svg";
                document.getElementById(`production${i+1}Progress`).value = isFinite(cooldownProgress) ? cooldownProgress : "";
                document.getElementById(`production${i+1}Text`).innerHTML = player.production[i].bond;
            }

        }   
    }


    if (game.currentPage == 2) {

        game.elementBuyPercentage = (document.getElementById('elementBuyPercentageSlider').value) / 100;
        document.getElementById('elementBuyPercentagePreview').innerHTML = (game.elementBuyPercentage * 100).toFixed(0);

        for (let elementKey in player.elements) {
            if (player.elements[elementKey].unlocked) {
                document.getElementById(`elementInventoryItemCount${elementKey}`).style.display = "block";

                document.getElementById(`elementInventoryItemImage${elementKey}`).style.filter = "grayscale(0%)";
                document.getElementById(`elementPurchase${elementKey}`).style = "border-color: rgba(0, 255, 0, 1); background-color: rgba(0, 255, 50, 0.2)";
                document.getElementById(`elementInventoryItemCount${elementKey}`).innerHTML = "Count: " + notationengine.biNotation(player.elements[elementKey].count, 2);
                document.getElementById(`elementPurchase${elementKey}`).innerHTML = `buy ${notationengine.biNotation((player.energy.mul(game.elementBuyPercentage)).div(calculateElementCost(elementKey)), 2)} ${data.elements[elementKey].name}`;
            } else {
                document.getElementById(`elementInventoryItemImage${elementKey}`).style.filter = "grayscale(100%)";
                document.getElementById(`elementInventoryItemCount${elementKey}`).style.display = "none";
                document.getElementById(`elementPurchase${elementKey}`).style = checkAffordUnlock(elementKey) ? "border-color: rgba(0, 255, 0, 1); background-color: rgba(0, 255, 50, 0.2)" : "border-color: rgba(255, 0, 0, 1); background-color: rgba(255, 50, 50, 0.4)";
                document.getElementById(`elementPurchase${elementKey}`).innerHTML = "Unlock";
            }
        }
    }

    if (game.currentPage == 4) {
        document.getElementById('unlockProductionSlotButton').style.borderColor = player.energy.gte(getUpgradeCost('productionSlot')) ? "var(--green-accent)" : "var(--red-accent)";
        document.getElementById('productionUnlockedCount').innerHTML = `${player.stats.productionUnlocked}/${player.production.length}`;
    }

    if (game.currentPage == 5) {
        document.getElementById('versionSpan').innerHTML = game.version;
    }
}

function getUpgradeCost(id) {
    switch (id) {
        case "productionSlot":
            return new Decimal(10).pow(player.stats.productionUnlocked)
    }
}

function productionItemClickEvent(id) {
    if (game.selectedProductionItem !== id) {
        game.selectedProductionItem = id;

        for (let i = 0; i < player.production.length; i++) {
            document.getElementById(`production${i + 1}Image`).style.filter = game.selectedProductionItem === i ? "grayscale(50%)" : "grayscale(0%)";
        }
        return;
    }

    game.selectedProductionItem = null;
    for (let i = 0; i < player.production.length; i++) {
        document.getElementById(`production${i + 1}Image`).style.filter = "grayscale(0%)";
    }
}

function craftingBondRegister() {
    if (game.selectedProductionItem == null) return;
    if (!(game.craftingBondPreview.text in data.bonds)) return;

    player.production[game.selectedProductionItem] = { bond: game.craftingBondPreview.text, cooldown: 0 };
    game.selectedProductionItem = null;
    for (let i = 0; i < player.production.length; i++) {
        document.getElementById(`production${i + 1}Image`).style.filter = "grayscale(0%)";
    }
    for (const elementKey in player.elements) {
        game.craftingBondPreview[elementKey] = 0;
    }
}
function frame() {
    updateValues();
    drawValues();
}

function showPage(num) {
    const pages = ["homePage", "craftingPage", "inventoryPage", "settingsPage", "upgradesPage", "aboutPage"];
    for(let i = 0; i<pages.length; i++) document.getElementById(pages[i]).style = "display: none;";
    document.getElementById(pages[num]).style = "display: block";
}

function save(destination, ss) {
    player.version = game.version;
    const payload = JSON.stringify(player);

    if (destination == 0) {
        window.localStorage.setItem(ss, payload);
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

    for (let item in player.stats.bondsCrafted) player.stats.bondsCrafted[item] = new Decimal(payload.stats.bondsCrafted[item]) ?? new Decimal(0);
    player.stats.productionUnlocked = payload.stats.productionUnlocked;

    for (let i = 0; i<player.production.length; i++) player.production[i] = payload.production[i];

    for (let setting in player.settings) player.settings[setting] = payload.settings[setting];

    player.timestampSinceLastTick = payload.timestampSinceLastTick;
    
    for (let delay in player.lastAutosaves) player.lastAutosaves[delay] = payload.lastAutosaves[delay];

    // simulate ticks if player.settings.ignoreTimestampFromSave == true
    if (!player.settings.ignoreTimestampFromSave) {
        const missedTicks = (Date.now() - player.timestampSinceLastTick) / player.settings.framerate;
        for (let i = 0; i < missedTicks; i++) updateValues();
    }

}

function hover(item, h) {
    if (h == "hover") {
        switch (item) {
            case 0:
                document.getElementById('unlockProductionSlotButton').style.backgroundColor = player.energy.gte(getUpgradeCost('productionSlot')) ? "var(--green-accent)" : "";
        }
    }
    else if (h == "unhover") {
        switch (item) {
            case 0:
                document.getElementById('unlockProductionSlotButton').style.backgroundColor = "var(--default-background-color)";
        }
    }
}

function attemptUpgradePurchase(id) {
    switch (id) {
        case "productionSlot":
            if (player.energy.gte(getUpgradeCost(id))) {
                player.energy = player.energy.minus(getUpgradeCost(id));
                player.stats.productionUnlocked++;
                player.production[player.stats.productionUnlocked-1] = {bond: '', cooldown: 0};
            }
    }
}

function reset() {player = undefined; player = new Player; for (let item in data.bonds) player.stats.bondsCrafted[item] = new Decimal(0);}

const wait = (delay = 0) => new Promise(resolve => setTimeout(resolve, delay));

window.onload = () => {
    if (compatibilityCheck() != "pass") {
        const cchk = compatibilityCheck();
        document.body.style = "background-color: #101010;";
        document.getElementById('game').style.display = "none";
        document.getElementById('loading').style.display = "none";
        document.getElementById('errors_fatal').style.display = "block";

        document.getElementById('errorMessage').innerHTML = `Error code ${cchk}: ${fatalErrorDiagnosticTable[cchk]}`;
        return;
    }

    // MENU BUTTONS
    document.getElementById('overviewPageButton').addEventListener("click", () => game.currentPage = 0);
    document.getElementById('craftingPageButton').addEventListener("click", () => game.currentPage = 1);
    document.getElementById('inventoryPageButton').addEventListener("click", () => game.currentPage = 2);
    document.getElementById('settingsPageButton').addEventListener("click", () => game.currentPage = 3);
    document.getElementById('upgradesPageButton').addEventListener("click", () => game.currentPage = 4);
    document.getElementById('aboutPageButton').addEventListener("click", () => game.currentPage = 5);

    // OVERVIEW
    let z = "";
    for (let i = 0; i<player.production.length; i++) z = z + `<p id="productionItemPreview${i+1}Text">null</p>`;
    document.getElementById('productionItemPreviews').innerHTML = z;

    let w = "";
    for (const elementKey in player.elements) w = w + `<p id="inventoryItemPreview${elementKey}">null</p>`
    document.getElementById('inventoryItemPreviews').innerHTML = w;

    // CRAFTING
    document.getElementById('craftingBondPreviewClearButton').addEventListener("click", () => {for (const elementKey in player.elements) game.craftingBondPreview[elementKey] = 0;})
    document.getElementById('craftingBondRegisterButton').addEventListener("click", () => craftingBondRegister())
    for (const elementKey in player.elements) document.getElementById(`element${elementKey}`).addEventListener("click", () => {if (player.elements[elementKey].unlocked == true) game.craftingBondPreview[elementKey] = (elementKey in game.craftingBondPreview) ? game.craftingBondPreview[elementKey] + 1 : 1 });

    let y = "";
    for (let i = 0; i<player.production.length; i++) y = y + `
        <div id="production${i+1}">
            <div id="production${i+1}Button">
                <img src="./img/button/production_empty.svg" id="production${i+1}Image">
                <p id="production${i+1}Text">null</p>
            </div>
            <progress id="production${i+1}Progress"></progress>
        </div>
    `;
    document.getElementById('productionList').innerHTML = y;

    for (let i = 0; i<player.production.length; i++) document.getElementById(`production${i+1}Button`).addEventListener("click", () => productionItemClickEvent(i));

    // INVENTORY
    let x = "";
    for (let elementKey in player.elements) x = x + `
        <div class="elementInventoryItem" id="elementInventoryItem${elementKey}">
            <img src="./img/PeriodicTableElements/${elementKey}.svg" id="elementInventoryItemImage${elementKey}">
            <p id="elementInventoryItemCount${elementKey}">Count: [0]</p>
            <button id=elementPurchase${elementKey}>[buy]</button>
            <br><br>
        </div>
    `;
    document.getElementById('elementInventory').innerHTML = x;

    for (let elementKey in player.elements) document.getElementById(`elementPurchase${elementKey}`).addEventListener("click", () => attemptElementPurchase(elementKey));

    // SETTINGS
    document.getElementById('exportToFile').addEventListener("click", () => save(1));
    document.getElementById('importSaveFromTextButton').addEventListener("click", () => {load(JSON.parse(document.getElementById('importSaveFromTextInput').value)); document.getElementById('importSaveFromTextInput').value = ""});

    // UPGRADES
    document.getElementById('unlockProductionSlotButton').addEventListener("mouseover", () => hover(0, "hover"));
    document.getElementById('unlockProductionSlotButton').addEventListener("mouseout", () => hover(0, "unhover"));
    document.getElementById('unlockProductionSlotButton').addEventListener("click", () => attemptUpgradePurchase("productionSlot"));

    // ABOUT


    // SETUP VARIABLES
    for (let item in data.bonds) player.stats.bondsCrafted[item] = new Decimal(0);

    // OTHER
    window.addEventListener("beforeunload", () => save(0, "default"));

    showPage(0);
    showPage(1);
    showPage(2);
    showPage(3);

    showPage(game.currentPage)

    wait(1000).then(() => {
        document.getElementById('game').style = "display:block";
        document.getElementById('loading').style = "display:none";
        player.production[0] = {bond: '', cooldown: 0}

        const gameLoop = setInterval(frame, 1000/player.settings.framerate);

    })
};