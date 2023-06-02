export const fnFormatNumber = (value: number) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'decimal',
  }).format(value);
