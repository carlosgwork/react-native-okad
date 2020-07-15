export const navigateHome = (navigate: Function) => {
  navigate('Main');
};

export const phoneFormat = (number: string) => {
  if (number.length > 10) {
    const f_val = number.replace(/\D[^.]/g, '');
    return (
      '(' + f_val.slice(0, 3) + ') ' + f_val.slice(3, 6) + '-' + f_val.slice(6)
    );
  }
  return '';
};
