const makeDate = function(){
    let d = new Date();
    let formattedDate = "";
    formattedDate += (d.getMonth() + 1) + "_";
    formattedDate += d.getDay() + "_";
    formattedDate += d.getFullYear();
    return formattedDate;
};

module.exports = makeDate;