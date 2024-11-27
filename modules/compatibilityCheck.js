function compatibilityCheck() {
    if(typeof(Storage) == "undefined") return "1";

    return "pass";
}

const fatalErrorDiagnosticTable = {
    "1": "Local Storage not usable, please update to a newer browser."
}

export { compatibilityCheck, fatalErrorDiagnosticTable }