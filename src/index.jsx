import React, { useState, useCallback, useRef, useEffect } from "react";
import { render, createPortal } from "react-dom";
// import years from "./resources/data/products";

const statusIcons = {
  released: "fas fa-check-circle",
  announced: "far fa-check-circle",
  rumoured: "far fa-question-circle",
};

const statusLabels = {
  released: "Released",
  announced: "Announced",
  rumoured: "Rumoured",
};

function ProductItem({ product }) {
  const { name, status } = product;
  const [showDetails, setShowDetails] = useState(false);
  const showModal = useCallback(() => setShowDetails(true));
  const closeModal = useCallback(() => setShowDetails(false));

  return (
    <>
      <li>
        <a className={status + "-product"} onClick={showModal}>
          <i className={statusIcons[status]} /> {name}
        </a>
      </li>
      {showDetails && (
        <Modal>
          <div className="overlay" onClick={closeModal} />
          <ProductContainer product={product} onDismiss={closeModal} />
        </Modal>
      )}
    </>
  );
}

function MonthCard({ month, products }) {
  return (
    <ul className="item">
      <span className="month">{month}</span>
      {/* <span className="counter">{products.length}</span>  */}
      {products.map((product) => (
        <ProductItem key={product.name} product={product} />
      ))}
    </ul>
  );
}

function YearCard({ months, year }) {
  return (
    <>
      <div className="year">{year}</div>
      <div className="container">
        {months.map(({ name, products }) => (
          <MonthCard key={name} month={name} products={products} />
        ))}
      </div>
    </>
  );
}

function ProductContainer({ product: { name, status, description, features, sources, images }, onDismiss }) {
  return (
    <div className="product-container">
      <div className={"product-status " + status + "-product"}>
        <i className={statusIcons[status]} /> {statusLabels[status]}
      </div>
      <div className="product-name">{name}</div>
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
          Features
          <ul className="product-features">
            {features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </div>
      )}
      {sources && (
        <div className="product-header">
          Sources
          <ul className="product-features">
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

function Modal({ children }) {
  const element = useRef(document.createElement("div"));

  useEffect(() => {
    const parentNode = document.querySelector("#modal-container");
    parentNode.appendChild(element.current);

    return () => element.current.remove();
  });

  return createPortal(children, element.current);
}

function App() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts().then((products) => setProducts(products));
  }, []);

  return products.map(({ yearName, months }) => <YearCard key={yearName} year={yearName} months={months} />);
}

async function fetchProducts() {
  const spaceId = "1zn4b0ow3sim";
  const accessToken = "xkzA96ThdMaC5DW91RubOhJhrMi8ZHPrxCCWZ7DbZek";
  const apiUrl = `https://cdn.contentful.com/spaces/${spaceId}/entries?access_token=${accessToken}&content_type=product`;
  const data = await fetch(apiUrl).then((res) => res.json());

  const products = [];
  data.items.forEach((item) => {
    const date = new Date(item.fields.date);
    const year = date.getUTCFullYear();
    const monthIndex = date.getUTCMonth();
    const monthName = new Intl.DateTimeFormat("en-US", { month: "long" }).format(date).toLocaleLowerCase();

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

    productsForMonth.products.push({
      name: item.fields.productName,
      status: item.fields.status,
      description: item.fields.description,
      features: item.fields.features,
      sources: item.fields.sources?.map(
        (source) => data.includes.Entry.find((entry) => entry.sys.id === source.sys.id).fields
      ),
      images: item.fields.images?.map(
        (image) => data.includes.Asset.find((asset) => asset.sys.id === image.sys.id).fields
      ),
    });
  });

  products.sort((a, b) => a.yearName - b.yearName);
  products.forEach((year) => year.months.sort((a, b) => a.index - b.index));

  console.log({ products, data });
  return products;
}

render(<App />, document.querySelector(".wrapper"));
