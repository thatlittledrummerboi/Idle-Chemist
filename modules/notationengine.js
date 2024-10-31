function timeNotation(ms) {
    let time = ms.toString();
    if (ms < 1000) {
        return(`${time[0] + time[1] + time[2]}ms`);
    }

    if (ms < 10_000) {
        return(`${time[0]}.${time[1]}s`);
    }

    if (ms < 100_000) {
        return(`${time[0] + time[1]}.${time[2]}`);
    }
}

function biNotation(vala, decpointa, notationa) {
    let notation = notationa ?? 0;
    let val = new Decimal(vala);
    let exp = new Decimal(floorLog10(val));
    let decpoint = new Decimal(decpointa);
    let valstring = val.toFixed(decpoint);


    if (val.lt(1000)) {
        if (val.equals(0)) {
            return("0");
        }
        return(valstring);
    }

    if (notation == 0) {
        if (exp.lt(33)) { //1 decillion
            return(StandardNotation(valstring, exp));
        } else {
            return(SciNotation(valstring, exp));
        }
    } else if (notation == 1) {
        return(StandardNotation(valstring, exp));
    } else if (notation == 2) {
        return(SciNotation(valstring, exp));
    }
}

function notation(val, decpoint, notation) {
    let exp = Math.floor(Math.log10(val));
    let valstring = val.toString();
    if (notation = null) { notation = 0; }
    if (decpoint = null) { decpoint = 2; }

    if (val < 1000) {
        return(valstring.toFixed(decpoint));
    }
    
    if (notation == 0) {
        if (val < 1_000_000_000_000_000_000_000_000_000_000_000) { //1 decillion
            return(StandardNotation(valstring, exp));
        }
        return(SciNotation(valstring, exp));
    } else if (notation == 1) {
        return(StandardNotation(valstring, exp));
    } else if (notation == 2) {
        return(SciNotation(valstring, exp));
    }
}

function floorLog10(val) {
    let base = new Decimal(val);
    let baseLog10 = new Decimal(base.log10());
    return(baseLog10.floor());
}


function StandardNotation(valstring, exp) {
    let suffixes = ["", "K", "M", "B", "T", "Qa", "Qt", "Sx", "Sp", "Oc", "No", "Dc"];

    let q;
    if (exp < 18) { q = 0; } else { q = 1;}


    switch(exp % 3) {
        case 0:
            return(valstring[0] + "." + valstring[1+q] + valstring[2+q] + valstring[3+q] + suffixes[Math.floor(exp/3)]);
        case 1:
            return(valstring[0] + valstring[1+q] + "." + valstring[2+q] + valstring[3+q] + valstring[4+q] + suffixes[Math.floor(exp/3)]);
        case 2:
            return(valstring[0] + valstring[1+q] + valstring[2+q] + "." + valstring[3+q] + valstring[4+q] + valstring[5+q] + suffixes[Math.floor(exp/3)]);
    }
}

function SciNotation(valstring, exp) { return(valstring[0] + "." + valstring[2] + valstring[3] + valstring[4] + "e" + exp.toString()); }

export {notation, biNotation, floorLog10, timeNotation}; 