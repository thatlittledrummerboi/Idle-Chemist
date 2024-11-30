function timeNotation(ms) {
    const dateObj = new Date(ms);
    const hours = dateObj.getUTCHours();
    const minutes = dateObj.getUTCMinutes();
    const seconds = dateObj.getSeconds();
    const milliseconds = ms.toString().slice(-3);
    const timeString = hours.toString().padStart(2, '0') + ':' +  minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0') + "." + milliseconds;

    return timeString;
}

function biNotation(vala, decpointa, notationa) {
    let notation = notationa ?? 0;
    let val = new Decimal(vala);
    let exp = new Decimal(floorLog10(val));
    let decpoint = new Decimal(decpointa) ?? 3;
    let valstring = val.toFixed(decpoint);


    if (val.lt(1000)) {
        return(val.equals(0) ? "0" : valstring);
    }

    if (notation == 0) {
        if (exp.lt(33)) return(StandardNotation(valstring, exp));
        else return(SciNotation(valstring, exp));
    }
    else if (notation == 1) return(StandardNotation(valstring, exp));
    else if (notation == 2) return(SciNotation(valstring, exp));
    
}

function floorLog10(val) {
    let base = new Decimal(val);
    let baseLog10 = new Decimal(base.log10());
    return(baseLog10.floor());
}


function StandardNotation(valstring, exp) {
    let suffixes = ["", "K", "M", "B", "T", "Qa", "Qt", "Sx", "Sp", "Oc", "No", "Dc"];
    let q = exp < 18 ? 0 : 1;

    switch(exp % 3) {
        case 0: return(valstring[0] + "." + valstring[1+q] + valstring[2+q] + valstring[3+q] + suffixes[Math.floor(exp/3)]);
        case 1: return(valstring[0] + valstring[1+q] + "." + valstring[2+q] + valstring[3+q] + valstring[4+q] + suffixes[Math.floor(exp/3)]);
        case 2: return(valstring[0] + valstring[1+q] + valstring[2+q] + "." + valstring[3+q] + valstring[4+q] + valstring[5+q] + suffixes[Math.floor(exp/3)]);
    }
}

function SciNotation(valstring, exp) { return(valstring[0] + "." + valstring.substring(2, 4) + "e" + biNotation(exp, 0)); }

export { biNotation, timeNotation}; 