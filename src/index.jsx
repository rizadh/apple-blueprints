import React, { useState, useCallback, useRef, useEffect, useMemo, createContext, useContext } from "react";
import { render, createPortal } from "react-dom";
import { Outlet, RouterProvider, createBrowserRouter, useParams, Link } from "react-router-dom";

const statusIcons = {
  released: "fa-solid fa-circle-check",
  announced: "fa-regular fa-circle-check",
  rumoured: "fa-regular fa-circle-question",
};

const statusLabels = {
  released: "Released",
  announced: "Announced",
  rumoured: "Rumoured",
};

const router = createBrowserRouter([
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

function ProductItem({ product }) {
  const { name, status, slug } = product;

  return (
    <Link to={"/product/" + slug} className={status + "-product product-item"}>
      <i className={`${statusIcons[status]} product-item-icon`} /> {name}
    </Link>
  );
}

function MonthCard({ month, products }) {
  if (month === "unknown" && products.length === 0) {
    return null;
  }
  return (
    <ul className="monthCard">
      <span className="month-label">{month}</span>
      {/* <span className="counter">{products.length}</span> */}
      {products.map((product) => (
        <ProductItem key={product.name} product={product} />
      ))}
    </ul>
  );
}

function YearCard({ months, year }) {
  return (
    <>
      <div className="year-label">{year}</div>
      <div className="container">
        {months.map(({ name, products }) => (
          <MonthCard key={name ?? "unknown"} month={name} products={products} />
        ))}
      </div>
    </>
  );
}

function ProductPage() {
  const products = useContext(ProductsContext);
  const { product: slug } = useParams();
  const allProducts = products.flatMap((year) => year.months.flatMap((month) => month.products));
  const product = allProducts.find((product) => product.slug === slug);

  const closeModal = useCallback(() => {
    router.navigate("/");
  });

  return (
    <Modal onDismiss={closeModal}>{product ? <ProductContainer product={product} /> : <div>Loading...</div>}</Modal>
  );
}

function ProductContainer({ product: { name, status, description, features, sources, images }, onDismiss }) {
  return (
    <div className="product-container">
      <div className="titlebar">
        <div className={"product-status " + status + "-product"}>
          <i className={statusIcons[status]} /> {statusLabels[status]}
        </div>
        <div className="product-name">{name}</div>
      </div>
      <div className="product-description">{description}</div>
      {images && (
        <div className="product-image-container">
          {images.map((image) => (
            <img key={image.file.url} className="product-image" src={image.file.url} alt={image.description} />
          ))}
        </div>
      )}
      {features && (
        <div className="product-header">
          What's new:
          <ul className="product-features">
            {features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </div>
      )}
      {sources && (
        <div className="product-header sources-header">
          Sources:
          <ul className="product-sources">
            {sources.map((source) => (
              <li key={source} className="source-link">
                <a href={source.url} target="_blank" className="source-link">
                  {source.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* <button className="fas fa-times close-button" onClick={onDismiss} /> */}
    </div>
  );
}

function Modal({ onDismiss, children }) {
  const element = useRef(document.createElement("div"));

  useEffect(() => {
    const parentNode = document.querySelector("#modal-container");
    parentNode.appendChild(element.current);

    return () => element.current.remove();
  });

  return createPortal(
    <>
      <div className="overlay" onClick={onDismiss} />
      {children}
    </>,
    element.current
  );
}

const ProductsContext = createContext();

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
    <ProductsContext.Provider value={products}>
      {products.map(({ yearName, months }) => (
        <YearCard key={yearName} year={yearName} months={months} />
      ))}

      {unknownProducts.length > 0 && <YearCard key="unknown" year="unknown" months={unknownMonths} />}

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
  );
}

async function fetchData() {
  const spaceId = import.meta.env.VITE_CONTENTFUL_SPACE_ID;
  const accessToken = import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN;
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

  const slugs = data.items.map((item) => item.fields.slug);

  console.log({ data, slugs });

  return { products, unknownProducts, lastUpdated };
}

render(<RouterProvider router={router} />, document.querySelector(".wrapper"));
