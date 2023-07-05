const ContadorBOT = require("../models/contadorBot");

const CTMCornejo = async () => {
    try{
        const result = await ContadorBOT.findByPk(1);
        const times = result.veces + 1;
        result.update({ veces: times });
        return times;
    }catch(e) {
        return { message: "An error has occured", error: e };
    }
}

const CTMHoracio = async () => {
    try{
        const result = await ContadorBOT.findByPk(2);
        const times = result.veces + 1;
        result.update({ veces: times });
        return times;
    }catch(e) {
        return { message: "An error has occured", error: e };
    }
}

const CTMPro = async () => {
    try{
        const result = await ContadorBOT.findByPk(3);
        const times = result.veces + 1;
        result.update({ veces: times });
        return times;
    }catch(e) {
        return { message: "An error has occured", error: e };
    }
}
const Pro = async () => {
    try{
        const result = await ContadorBOT.findByPk(4);
        const times = result.veces + 1;
        result.update({ veces: times });
        return times;
    }catch(e) {
        return { message: "An error has occured", error: e };
    }
}

// Esport all functions
module.exports = {
    CTMCornejo,
    CTMHoracio,
    CTMPro,
    Pro
};