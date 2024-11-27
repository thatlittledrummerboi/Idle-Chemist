function timeNotation(ms) {
    let result = "";
    let t = {d:null,h:null,m:null,s:null}

    t.d = Math.floor(ms / 86_400_000);
    ms -= t.d*86_400_000
    t.h = Math.floor(ms / 3_600_000);
    ms -= t.h*3_600_000;
    t.m = Math.floor(ms / 60_000);
    ms -= t.m*60_000;
    t.s = Math.floor(ms / 1_000);
    ms -= t.s*1_000

    let zms = ms==0?"000":ms<10?"00"+ms:ms<100?"0"+ms:ms;  // if ms==0 return 000; if ms<10 return 00x; if ms<100 return 0xx; otherwise return xxx
    for (let item in t) result = `${result}${result==""?"":":"}${t[item]==0?"00":t[item]<10?"0"+t[item]:t[item]}`
    return(result + "." + zms);
}

console.log(timeNotation(84_426_000))

function biNotation(vala, decpointa, notationa) {
    let notation = notationa ?? 0;
    let val = new Decimal(vala);
    let exp = new Decimal(floorLog10(val));
    let decpoint = new Decimal(decpointa) ?? 3;
    let valstring = val.toFixed(decpoint);


    if (val.lt(1000)) {
        if (val.equals(0)) return("0");
        return(valstring);
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
        case 0: return(`${valstring[0]}.${valstring.substring(1+q, 3+q) + suffixes[Math.floor(exp/3)]}`);
        case 1: return(`${valstring[0] + valstring[1+q]}.${valstring.substring(2+q, 4+q) + suffixes[Math.floor(exp/3)]}`);
        case 2: return(`${valstring[0] + valstring.substring(1+q, 2+q)}.${valstring.substring(3+q, 5+q) + suffixes[Math.floor(exp/3)]}`);
    }
}

function SciNotation(valstring, exp) { return(valstring[0] + "." + valstring.substring(2, 4) + "e" + biNotation(exp, 0)); }

export { biNotation, floorLog10, timeNotation}; 