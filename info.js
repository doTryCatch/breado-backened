// for manager point of view
export const schema = [
  {
    date: '',
    order: {
      userId: 2,
      username: '',
      totalOrderCost: '',
      paidAmountForOrder: '',
      productDetails: [
        { productName, quantity, totalPriceOfRespectiveProductItem },
      ],
    },
  },
  {
    date: '',
    order: {},
  },
  // and so on upto all possible dates available
];
// for sellers point of view
export const schema2 = {
  date: {
    totalOrderCost,
    paidAmountForOrder,
    productDetails: [
      { productName, quantity, totalPriceOfRespectiveProductItem },
    ],
  },
  data: {},
  // and so on upto all possible dates available
};
