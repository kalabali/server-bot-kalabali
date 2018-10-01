function getMonthIndex(month){
    const months = [
        "januari",
        "februari",
        "maret",
        "april",
        "mei",
        "juni",
        "juli",
        "agustus",
        "september",
        "oktober",
        "nopember",
        "desember"
    ];

    const monthsEn = [
        "january",
        "february",
        "march",
        "april",
        "may",
        "june",
        "july",
        "august",
        "september",
        "october",
        "november",
        "december"
    ];

    if(months.indexOf(month) != -1){
        return months.indexOf(month) + 1;
    }
    else if(monthsEn.indexOf(month) != -1){
        return monthsEn.indexOf(month) + 1;
    }
    return -1;
}

function getMonthName(month){
    const months = [
        "Januari",
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Agustus",
        "September",
        "Oktober",
        "Nopember",
        "Desember"
    ];
    
    return months[month - 1] !== undefined ? months[month - 1] : "";
}

module.exports = {
    getMonthIndex,
    getMonthName
}