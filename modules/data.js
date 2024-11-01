const bonds = {
    "sample": {
        name: "",
        elements: {}
    },
    "H2O": {
        name: "Water",
        elements: {
            "H": 2,
            "O": 1,
        }
    },
    "CO2": {
        name: "Carbon Dioxide",
        elements: {
            "C": 1,
            "O": 2,
        }
    },
    "H2": {
        name: "Deuterium",
        elements: {
            "H": 2,
        }
    },
    "H2O2": {
        name: "Hydrogen Peroxide",
        elements: {
            "H": 2,
            "O": 2,
        }
    },
    "H3": {
        name: "Tritium",
        elements: {
            "H": 3,
        }
    }
}

const dat = {
    "H": { name: "Hydrogen", atomic_num: 1, atomic_weight: 1.008 },
    "He": { name: "Helium", atomic_num: 2, atomic_weight: 4.0026 },
    "Li": { name: "Lithium", atomic_num: 3, atomic_weight: 6.94 },
    "Be": { name: "Beryllium", atomic_num: 4, atomic_weight: 9.0122 },
    "B": { name: "Boron", atomic_num: 5, atomic_weight: 10.81 },
    "C": { name: "Carbon", atomic_num: 6, atomic_weight: 12.011 },
    "N": { name: "Nitrogen", atomic_num: 7, atomic_weight: 14.007 },
    "O": { name: "Oxygen", atomic_num: 8, atomic_weight: 15.999 },
    "F": { name: "Fluorine", atomic_num: 9, atomic_weight: 18.998 },
    "Ne": { name: "Neon", atomic_num: 10, atomic_weight: 20.180 },
    "Na": { name: "Sodium", atomic_num: 11, atomic_weight: 22.990 },
    "Mg": { name: "Magnesium", atomic_num: 12, atomic_weight: 24.305 },
    "Al": { name: "Aluminum", atomic_num: 13, atomic_weight: 26.982 },
    "Si": { name: "Silicon", atomic_num: 14, atomic_weight: 28.085 },
    "P": { name: "Phosphorus", atomic_num: 15, atomic_weight: 30.974 },
    "S": { name: "Sulfur", atomic_num: 16, atomic_weight: 32.06 },
    "Cl": { name: "Chlorine", atomic_num: 17, atomic_weight: 35.45 },
    "Ar": { name: "Argon", atomic_num: 18, atomic_weight: 39.948 },
    "K": { name: "Potassium", atomic_num: 19, atomic_weight: 39.098 },
    "Ca": { name: "Calcium", atomic_num: 20, atomic_weight: 40.078 },
    "Sc": { name: "Scandium", atomic_num: 21, atomic_weight: 44.956 },
    "Ti": { name: "Titanium", atomic_num: 22, atomic_weight: 47.867 },
    "V": { name: "Vanadium", atomic_num: 23, atomic_weight: 50.942 },
    "Cr": { name: "Chromium", atomic_num: 24, atomic_weight: 51.996 },
    "Mn": { name: "Manganese", atomic_num: 25, atomic_weight: 54.938 },
    "Fe": { name: "Iron", atomic_num: 26, atomic_weight: 55.845 },
    "Co": { name: "Cobalt", atomic_num: 27, atomic_weight: 58.933 },
    "Ni": { name: "Nickel", atomic_num: 28, atomic_weight: 58.693 },
    "Cu": { name: "Copper", atomic_num: 29, atomic_weight: 63.546 },
    "Zn": { name: "Zinc", atomic_num: 30, atomic_weight: 65.38 },
    "Ga": { name: "Gallium", atomic_num: 31, atomic_weight: 69.723 },
    "Ge": { name: "Germanium", atomic_num: 32, atomic_weight: 72.63 },
    "As": { name: "Arsenic", atomic_num: 33, atomic_weight: 74.922 },
    "Se": { name: "Selenium", atomic_num: 34, atomic_weight: 78.96 },
    "Br": { name: "Bromine", atomic_num: 35, atomic_weight: 79.904 },
    "Kr": { name: "Krypton", atomic_num: 36, atomic_weight: 83.798 },
    "Rb": { name: "Rubidium", atomic_num: 37, atomic_weight: 85.468 },
    "Sr": { name: "Strontium", atomic_num: 38, atomic_weight: 87.62 },
    "Y": { name: "Yttrium", atomic_num: 39, atomic_weight: 88.906 },
    "Zr": { name: "Zirconium", atomic_num: 40, atomic_weight: 91.224 },
    "Nb": { name: "Niobium", atomic_num: 41, atomic_weight: 92.906 },
    "Mo": { name: "Molybdenum", atomic_num: 42, atomic_weight: 95.95 },
    "Tc": { name: "Technetium", atomic_num: 43, atomic_weight: 98 },
    "Ru": { name: "Ruthenium", atomic_num: 44, atomic_weight: 101.07 },
    "Rh": { name: "Rhodium", atomic_num: 45, atomic_weight: 102.91 },
    "Pd": { name: "Palladium", atomic_num: 46, atomic_weight: 106.42 },
    "Ag": { name: "Silver", atomic_num: 47, atomic_weight: 107.87 },
    "Cd": { name: "Cadmium", atomic_num: 48, atomic_weight: 112.41 },
    "In": { name: "Indium", atomic_num: 49, atomic_weight: 114.82 },
    "Sn": { name: "Tin", atomic_num: 50, atomic_weight: 118.71 },
    "Sb": { name: "Antimony", atomic_num: 51, atomic_weight: 121.76 },
    "Te": { name: "Tellurium", atomic_num: 52, atomic_weight: 127.6 },
    "I": { name: "Iodine", atomic_num: 53, atomic_weight: 126.90 },
    "Xe": { name: "Xenon", atomic_num: 54, atomic_weight: 131.29 },
    "Cs": { name: "Cesium", atomic_num: 55, atomic_weight: 132.91 },
    "Ba": { name: "Barium", atomic_num: 56, atomic_weight: 137.33 },
    "La": { name: "Lanthanum", atomic_num: 57, atomic_weight: 138.91 },
    "Ce": { name: "Cerium", atomic_num: 58, atomic_weight: 140.12 },
    "Pr": { name: "Praseodymium", atomic_num: 59, atomic_weight: 140.91 },
    "Nd": { name: "Neodymium", atomic_num: 60, atomic_weight: 144.24 },
    "Pm": { name: "Promethium", atomic_num: 61, atomic_weight: 145 },
    "Sm": { name: "Samarium", atomic_num: 62, atomic_weight: 150.36 },
    "Eu": { name: "Europium", atomic_num: 63, atomic_weight: 151.96 },
    "Gd": { name: "Gadolinium", atomic_num: 64, atomic_weight: 157.25 },
    "Tb": { name: "Terbium", atomic_num: 65, atomic_weight: 158.93 },
    "Dy": { name: "Dysprosium", atomic_num: 66, atomic_weight: 162.50 },
    "Ho": { name: "Holmium", atomic_num: 67, atomic_weight: 164.93 },
    "Er": { name: "Erbium", atomic_num: 68, atomic_weight: 167.26 },
    "Tm": { name: "Thulium", atomic_num: 69, atomic_weight: 168.93 },
    "Yb": { name: "Ytterbium", atomic_num: 70, atomic_weight: 173.05 },
    "Lu": { name: "Lutetium", atomic_num: 71, atomic_weight: 174.97 },
    "Hf": { name: "Hafnium", atomic_num: 72, atomic_weight: 178.49 },
    "Ta": { name: "Tantalum", atomic_num: 73, atomic_weight: 180.95 },
    "W": { name: "Tungsten", atomic_num: 74, atomic_weight: 183.84 },
    "Re": { name: "Rhenium", atomic_num: 75, atomic_weight: 186.21 },
    "Os": { name: "Osmium", atomic_num: 76, atomic_weight: 190.23 },
    "Ir": { name: "Iridium", atomic_num: 77, atomic_weight: 192.22 },
    "Pt": { name: "Platinum", atomic_num: 78, atomic_weight: 195.08 },
    "Au": { name: "Gold", atomic_num: 79, atomic_weight: 196.97 },
    "Hg": { name: "Mercury", atomic_num: 80, atomic_weight: 200.59 },
    "Tl": { name: "Thallium", atomic_num: 81, atomic_weight: 204.38 },
    "Pb": { name: "Lead", atomic_num: 82, atomic_weight: 207.2 },
    "Bi": { name: "Bismuth", atomic_num: 83, atomic_weight: 208.98 },
    "Po": { name: "Polonium", atomic_num: 84, atomic_weight: 209 },
    "At": { name: "Astatine", atomic_num: 85, atomic_weight: 210 },
    "Rn": { name: "Radon", atomic_num: 86, atomic_weight: 222 },
    "Fr": { name: "Francium", atomic_num: 87, atomic_weight: 223 },
    "Ra": { name: "Radium", atomic_num: 88, atomic_weight: 226 },
    "Ac": { name: "Actinium", atomic_num: 89, atomic_weight: 227 },
    "Th": { name: "Thorium", atomic_num: 90, atomic_weight: 232.04 },
    "Pa": { name: "Protactinium", atomic_num: 91, atomic_weight: 231.04 },
    "U": { name: "Uranium", atomic_num: 92, atomic_weight: 238.03 },
    "Np": { name: "Neptunium", atomic_num: 93, atomic_weight: 237 },
    "Pu": { name: "Plutonium", atomic_num: 94, atomic_weight: 244 },
    "Am": { name: "Americium", atomic_num: 95, atomic_weight: 243 },
    "Cm": { name: "Curium", atomic_num: 96, atomic_weight: 247 },
    "Bk": { name: "Berkelium", atomic_num: 97, atomic_weight: 247 },
    "Cf": { name: "Californium", atomic_num: 98, atomic_weight: 251 },
    "Es": { name: "Einsteinium", atomic_num: 99, atomic_weight: 252 },
    "Fm": { name: "Fermium", atomic_num: 100, atomic_weight: 257 },
    "Md": { name: "Mendelevium", atomic_num: 101, atomic_weight: 258 },
    "No": { name: "Nobelium", atomic_num: 102, atomic_weight: 259 },
    "Lr": { name: "Lawrencium", atomic_num: 103, atomic_weight: 262 },
    "Rf": { name: "Rutherfordium", atomic_num: 104, atomic_weight: 267 },
    "Db": { name: "Dubnium", atomic_num: 105, atomic_weight: 270 },
    "Sg": { name: "Seaborgium", atomic_num: 106, atomic_weight: 271 },
    "Bh": { name: "Bohrium", atomic_num: 107, atomic_weight: 270 },
    "Hs": { name: "Hassium", atomic_num: 108, atomic_weight: 277 },
    "Mt": { name: "Meitnerium", atomic_num: 109, atomic_weight: 278 },
    "Ds": { name: "Darmstadtium", atomic_num: 110, atomic_weight: 281 },
    "Rg": { name: "Roentgenium", atomic_num: 111, atomic_weight: 282 },
    "Cn": { name: "Copernicium", atomic_num: 112, atomic_weight: 285 },
    "Nh": { name: "Nihonium", atomic_num: 113, atomic_weight: 286 },
    "Fl": { name: "Flerovium", atomic_num: 114, atomic_weight: 289 },
    "Mc": { name: "Moscovium", atomic_num: 115, atomic_weight: 290 },
    "Lv": { name: "Livermorium", atomic_num: 116, atomic_weight: 293 },
    "Ts": { name: "Tennessine", atomic_num: 117, atomic_weight: 294 },
    "Og": { name: "Oganesson", atomic_num: 118, atomic_weight: 294 }
};

const baseElements = {
    "H": { count: 100, unlocked: true },
    "He": { count: 0, unlocked: false },
    "Li": { count: 0, unlocked: false },
    "Be": { count: 0, unlocked: false },
    "B": { count: 0, unlocked: false },
    "C": { count: 0, unlocked: false },
    "N": { count: 0, unlocked: false },
    "O": { count: 0, unlocked: false },
    "F": { count: 0, unlocked: false },
    "Ne": { count: 0, unlocked: false },
    "Na": { count: 0, unlocked: false },
    "Mg": { count: 0, unlocked: false },
    "Al": { count: 0, unlocked: false },
    "Si": { count: 0, unlocked: false },
    "P": { count: 0, unlocked: false },
    "S": { count: 0, unlocked: false },
    "Cl": { count: 0, unlocked: false },
    "Ar": { count: 0, unlocked: false },
    "K": { count: 0, unlocked: false },
    "Ca": { count: 0, unlocked: false },
    "Sc": { count: 0, unlocked: false },
    "Ti": { count: 0, unlocked: false },
    "V": { count: 0, unlocked: false },
    "Cr": { count: 0, unlocked: false },
    "Mn": { count: 0, unlocked: false },
    "Fe": { count: 0, unlocked: false },
    "Co": { count: 0, unlocked: false },
    "Ni": { count: 0, unlocked: false },
    "Cu": { count: 0, unlocked: false },
    "Zn": { count: 0, unlocked: false },
    "Ga": { count: 0, unlocked: false },
    "Ge": { count: 0, unlocked: false },
    "As": { count: 0, unlocked: false },
    "Se": { count: 0, unlocked: false },
    "Br": { count: 0, unlocked: false },
    "Kr": { count: 0, unlocked: false },
    "Rb": { count: 0, unlocked: false },
    "Sr": { count: 0, unlocked: false },
    "Y": { count: 0, unlocked: false },
    "Zr": { count: 0, unlocked: false },
    "Nb": { count: 0, unlocked: false },
    "Mo": { count: 0, unlocked: false },
    "Tc": { count: 0, unlocked: false },
    "Ru": { count: 0, unlocked: false },
    "Rh": { count: 0, unlocked: false },
    "Pd": { count: 0, unlocked: false },
    "Ag": { count: 0, unlocked: false },
    "Cd": { count: 0, unlocked: false },
    "In": { count: 0, unlocked: false },
    "Sn": { count: 0, unlocked: false },
    "Sb": { count: 0, unlocked: false },
    "Te": { count: 0, unlocked: false },
    "I": { count: 0, unlocked: false },
    "Xe": { count: 0, unlocked: false },
    "Cs": { count: 0, unlocked: false },
    "Ba": { count: 0, unlocked: false },
    "La": { count: 0, unlocked: false },
    "Ce": { count: 0, unlocked: false },
    "Pr": { count: 0, unlocked: false },
    "Nd": { count: 0, unlocked: false },
    "Pm": { count: 0, unlocked: false },
    "Sm": { count: 0, unlocked: false },
    "Eu": { count: 0, unlocked: false },
    "Gd": { count: 0, unlocked: false },
    "Tb": { count: 0, unlocked: false },
    "Dy": { count: 0, unlocked: false },
    "Ho": { count: 0, unlocked: false },
    "Er": { count: 0, unlocked: false },
    "Tm": { count: 0, unlocked: false },
    "Yb": { count: 0, unlocked: false },
    "Lu": { count: 0, unlocked: false },
    "Hf": { count: 0, unlocked: false },
    "Ta": { count: 0, unlocked: false },
    "W": { count: 0, unlocked: false },
    "Re": { count: 0, unlocked: false },
    "Os": { count: 0, unlocked: false },
    "Ir": { count: 0, unlocked: false },
    "Pt": { count: 0, unlocked: false },
    "Au": { count: 0, unlocked: false },
    "Hg": { count: 0, unlocked: false },
    "Tl": { count: 0, unlocked: false },
    "Pb": { count: 0, unlocked: false },
    "Bi": { count: 0, unlocked: false },
    "Po": { count: 0, unlocked: false },
    "At": { count: 0, unlocked: false },
    "Rn": { count: 0, unlocked: false },
    "Fr": { count: 0, unlocked: false },
    "Ra": { count: 0, unlocked: false },
    "Ac": { count: 0, unlocked: false },
    "Th": { count: 0, unlocked: false },
    "Pa": { count: 0, unlocked: false },
    "U": { count: 0, unlocked: false },
    "Np": { count: 0, unlocked: false },
    "Pu": { count: 0, unlocked: false },
    "Am": { count: 0, unlocked: false },
    "Cm": { count: 0, unlocked: false },
    "Bk": { count: 0, unlocked: false },
    "Cf": { count: 0, unlocked: false },
    "Es": { count: 0, unlocked: false },
    "Fm": { count: 0, unlocked: false },
    "Md": { count: 0, unlocked: false },
    "No": { count: 0, unlocked: false },
    "Lr": { count: 0, unlocked: false },
    "Rf": { count: 0, unlocked: false },
    "Db": { count: 0, unlocked: false },
    "Sg": { count: 0, unlocked: false },
    "Bh": { count: 0, unlocked: false },
    "Hs": { count: 0, unlocked: false },
    "Mt": { count: 0, unlocked: false },
    "Ds": { count: 0, unlocked: false },
    "Rg": { count: 0, unlocked: false },
    "Cn": { count: 0, unlocked: false },
    "Nh": { count: 0, unlocked: false },
    "Fl": { count: 0, unlocked: false },
    "Mc": { count: 0, unlocked: false },
    "Lv": { count: 0, unlocked: false },
    "Ts": { count: 0, unlocked: false },
    "Og": { count: 0, unlocked: false },   
}

export { bonds, dat, baseElements}