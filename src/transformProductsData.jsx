export function transformProductsData(data) {
  const productsByYear = [];
  const unknownProducts = [];

  data.items.forEach((item) => {
    if (!item.fields.date) {
      unknownProducts.push(item);
      return;
    }

    const date = new Date(item.fields.date);
    const year = date.getUTCFullYear();
    const monthIndex = date.getUTCMonth();
    const monthName = new Intl.DateTimeFormat("en-US", { month: "long" }).format(date);

    let productsForYear = productsByYear.find((yearObject) => yearObject.yearName === year);
    if (!productsForYear) {
      productsForYear = { yearName: year, months: [] };
      productsByYear.push(productsForYear);
    }

    let productsForMonth = productsForYear.months.find((monthObject) => monthObject.name === monthName);
    if (!productsForMonth) {
      productsForMonth = { name: monthName, index: monthIndex, products: [] };
      productsForYear.months.push(productsForMonth);
    }

    productsForMonth.products.push(item);
  });

  productsByYear.sort((a, b) => a.yearName - b.yearName);
  productsByYear.forEach((year) => year.months.sort((a, b) => a.index - b.index));

  const lastUpdated = data.items
    .map((item) => new Date(item.sys.updatedAt))
    .sort((a, b) => a.getTime() - b.getTime())
    .pop();

  // const slugs = data.items.map((item) => item.fields.slug);
  // console.log({ data, slugs });
  return { productsByYear, unknownProducts, lastUpdated };
}
