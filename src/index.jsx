import React, { useState, useEffect, useMemo, createContext } from "react";
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import { YearCard } from "./YearCard";
import { ProductPage } from "./ProductPage";
import { createRoot } from "react-dom/client";

export const statusIcons = {
  released: "fa-solid fa-circle-check",
  announced: "fa-regular fa-circle-check",
  rumoured: "fa-regular fa-circle-question",
};

export const statusLabels = {
  released: "Released",
  announced: "Announced",
  rumoured: "Rumoured",
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/product/:product",
        element: <ProductPage />,
      },
    ],
  },
]);

export const ProductsContext = createContext();

function App() {
  const [products, setProducts] = useState([]);
  const [unknownProducts, setUnknownProducts] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    fetchData().then((data) => {
      setProducts(data.products);
      setUnknownProducts(data.unknownProducts);
      setLastUpdated(data.lastUpdated);
    });
  }, []);

  const lastUpdatedDateString = new Intl.DateTimeFormat(navigator.language, {
    day: "numeric",
    year: "numeric",
    month: "long",
    hour: "numeric",
    minute: "numeric",
  }).format(lastUpdated);

  const unknownMonths = useMemo(() => [{ products: unknownProducts }], [unknownProducts]);

  return (
    <div className="app">
      <ProductsContext.Provider value={products}>
        <div className="year-list">
          {products.map(({ yearName, months }) => (
            <YearCard key={yearName} year={yearName} months={months} />
          ))}
          {unknownProducts.length > 0 && <YearCard key="unknown" year="unknown" months={unknownMonths} />}
        </div>

        <div id="footer">
          <div id="footer-button-container">
            <a
              href="mailto:appleblueprints@gmail.com?subject=Suggest an edit&body=What would you like to change?"
              target="_blank"
              className="footer-button"
              id="suggest-button"
            >
              <i className="fas fa-wrench"></i>&nbsp;&nbsp;Suggest an edit
            </a>
            <a href="https://www.x.com/appleblueprints" target="_blank" className="footer-button" id="twitter-button">
              <i className="fab fa-x-twitter"></i>&nbsp;&nbsp;Follow
            </a>
            <a
              href="https://www.buymeacoffee.com/appleblueprints"
              target="_blank"
              className="footer-button"
              id="donate-button"
            >
              <i className="far fa-grin"></i>&nbsp;&nbsp;Donate
            </a>
          </div>
          {lastUpdated && (
            <div title="Last updated" id="last-updated">
              Last updated: {lastUpdatedDateString}
            </div>
          )}
        </div>
        <Outlet />
      </ProductsContext.Provider>
    </div>
  );
}

async function fetchData() {
  const spaceId = process.env.CONTENTFUL_SPACE_ID;
  const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;
  const apiUrl = `https://cdn.contentful.com/spaces/${spaceId}/entries?access_token=${accessToken}&content_type=product`;
  const data = await fetch(apiUrl).then((res) => res.json());

  const products = [];
  const unknownProducts = [];
  data.items.forEach((item) => {
    const product = {
      name: item.fields.productName,
      status: item.fields.status,
      slug: item.fields.slug,
      description: item.fields.description,
      features: item.fields.features,
      sources: item.fields.sources?.map(
        (source) => data.includes.Entry.find((entry) => entry.sys.id === source.sys.id).fields
      ),
      images: item.fields.images?.map(
        (image) => data.includes.Asset.find((asset) => asset.sys.id === image.sys.id).fields
      ),
    };

    if (!item.fields.date) {
      unknownProducts.push(product);
      return;
    }

    const date = new Date(item.fields.date);
    const year = date.getUTCFullYear();
    const monthIndex = date.getUTCMonth();
    const monthName = new Intl.DateTimeFormat("en-US", { month: "long" }).format(date);

    let productsForYear = products.find((yearObject) => yearObject.yearName === year);
    if (!productsForYear) {
      productsForYear = { yearName: year, months: [] };
      products.push(productsForYear);
    }

    let productsForMonth = productsForYear.months.find((monthObject) => monthObject.name === monthName);
    if (!productsForMonth) {
      productsForMonth = { name: monthName, index: monthIndex, products: [] };
      productsForYear.months.push(productsForMonth);
    }

    productsForMonth.products.push(product);
  });

  products.sort((a, b) => a.yearName - b.yearName);
  products.forEach((year) => year.months.sort((a, b) => a.index - b.index));

  const lastUpdated = data.items
    .map((item) => new Date(item.sys.updatedAt))
    .sort((a, b) => a.getTime() - b.getTime())
    .pop();

  // const slugs = data.items.map((item) => item.fields.slug);

  // console.log({ data, slugs });

  return { products, unknownProducts, lastUpdated };
}

const root = createRoot(document.querySelector(".wrapper"));
root.render(<RouterProvider router={router} />);
