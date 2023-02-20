/** @type {import("prettier").Config} */
module.exports = {
  tabWidth: 2,
  plugins: [require.resolve('prettier-plugin-tailwindcss')],
  importOrder: ['^@/(.*)$', '^[./]'],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};
