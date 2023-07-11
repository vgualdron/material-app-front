const validateDate = (date) => {
  const dateFormatRegex = /^(0?[1-9]|[1-2][0-9]|3[01])[/](0?[1-9]|1[0-2])[/]\d{4}$/;
  let isValidDate = false;
  if (date.match(dateFormatRegex)) {
    const dateParts = date.split('/');
    if (dateParts.length === 3) {
      const day = parseInt(dateParts[0], 10);
      const month = parseInt(dateParts[1], 10);
      const year = parseInt(dateParts[2], 10);
      // valid month range is 1 - 12
      if (month < 1 || month > 12) {
        return false;
      }
      // validate days in month
      const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      let monthLength = daysInMonth[month - 1];
      if ((month === 2) && ((!(year % 4) && year % 100) || !(year % 400))) {
        monthLength = 29;
      }
      if (day < 1 || day > monthLength) {
        return false;
      }
      // checks have passed
      isValidDate = true;
    }
  }
  return isValidDate;
};

export { validateDate };
