export const formatDate = (date) => {
    const d = new Date(date);
    let month = `${d.getMonth() + 1}`;
    let day = `${d.getDate()}`;
    const year = d.getFullYear();

    if (month.length < 2) {
        // december is 12 where january is 1
        month = `0${month}`;
        // result - december is 12 where january is 01
    }
    if (day.length < 2) {
        day = `0${day}`;
    }

    return [year, month, day].join('-'); // yyyy-MM-dd
};
