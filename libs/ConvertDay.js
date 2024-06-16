const addZero = (i) => {
    let index = "";
    if (i < 10) {
        index = "0" + i;
    } else {
        index = "" + i;
    }
    return index;
};

const ConvertDays = (date, type = "dd/mm/yy") => {
    if (!date || date === "NaN-NaN-NaN" || date === "-") {
        return null;
    }

    const newdate = new Date(date);

    switch (type) {
        case "dd/mm/yy":
            return `${addZero(newdate.getDate())} / ${addZero(newdate.getMonth() + 1)} / ${newdate.getFullYear()}`;
        case "dd-mm-yy":
            return `${addZero(newdate.getDate())}-${addZero(newdate.getMonth() + 1)}-${newdate.getFullYear()}`;
        case "dd/mm/yy hh:mm:ss":
            return `${addZero(newdate.getDate())}/${addZero(newdate.getMonth() + 1)}/${newdate.getFullYear()} ${addZero(newdate.getHours())}:${addZero(newdate.getMinutes())}:${addZero(
                newdate.getSeconds()
            )}`;
        case "dd/mm/yy hh:mm":
            return `${addZero(newdate.getDate())}/${addZero(newdate.getMonth() + 1)}/${newdate.getFullYear()} ${addZero(newdate.getHours())}:${addZero(newdate.getMinutes())}`;
        case "dd-mm-yy hh:mm:ss":
            return `${addZero(newdate.getDate())}/${addZero(newdate.getMonth() + 1)}/${newdate.getFullYear()} ${addZero(newdate.getHours())}:${addZero(newdate.getMinutes())}:${addZero(
                newdate.getSeconds()
            )}`;
        case "dd-mm-yy hh:mm":
            return `${addZero(newdate.getDate())}/${addZero(newdate.getMonth() + 1)}/${newdate.getFullYear()} ${addZero(newdate.getHours())}:${addZero(newdate.getMinutes())}`;
        case "yy/mm/dd":
            return `${newdate.getFullYear()}/${addZero(newdate.getMonth() + 1)}/${addZero(newdate.getDate())}`;
        case "yy-mm-dd":
            return `${newdate.getFullYear()}-${addZero(newdate.getMonth() + 1)}-${addZero(newdate.getDate())}`;
        case "yy-mm-dd hh:mm:ss":
            return `${newdate.getFullYear()}-${addZero(newdate.getMonth() + 1)}-${addZero(newdate.getDate())} ${addZero(newdate.getHours())}:${addZero(newdate.getMinutes())}:${addZero(
                newdate.getSeconds()
            )}`;
        case "yy/mm/dd hh:mm:ss":
            return `${addZero(newdate.getDate())}/${addZero(newdate.getMonth() + 1)}/${newdate.getFullYear()} ${addZero(newdate.getHours())}:${addZero(newdate.getMinutes())}:${addZero(
                newdate.getSeconds()
            )}`;
        case "yy/mm/dd hh:mm":
            return `${addZero(newdate.getDate())}/${addZero(newdate.getMonth() + 1)}/${newdate.getFullYear()} ${addZero(newdate.getHours())}:${addZero(newdate.getMinutes())}`;
        case "hh:mm":
            return `${addZero(newdate.getHours())}:${addZero(newdate.getMinutes())}`;
        case "hh:mm:ss":
            return `${addZero(newdate.getHours())}:${addZero(newdate.getMinutes())}:${addZero(newdate.getSeconds())}`;
        default:
            return "-";
    }
};

module.exports = { ConvertDays }