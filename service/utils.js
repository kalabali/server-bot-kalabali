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

module.exports = {
    getMonthIndex
}