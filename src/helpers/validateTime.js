const validateTime = (time) => /^(2[0-3]|[01]?[0-9]):([0-5]?[0-9])$/.test(time);
export { validateTime };
