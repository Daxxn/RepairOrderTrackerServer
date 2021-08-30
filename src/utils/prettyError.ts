const cleanError = (err: Error): string => {
  if (err !== undefined) {
    return `${err.name}\n\t${err.message}\n\n{${err.stack}\n}`;
  }
  return '';
};

export default cleanError;
