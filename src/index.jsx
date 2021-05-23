import React, { useState, useCallback, useRef, useEffect } from "react";
import { render, createPortal } from "react-dom";
import years from "./resources/data/products";

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

function ProductContainer({ product: { name, status, description, features, sources }, onDismiss }) {
  return (
    <div className="product-container">
      <div className={"product-status " + status + "-product"}>
        <i className={statusIcons[status]} /> {statusLabels[status]}
      </div>
      <div className="product-name">{name}</div>
      <div className="product-description">{description}</div>

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
                <a href={source.link} target="_blank" className="source-link">
                  {source.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      <button className="fas fa-times close-button" onClick={onDismiss} />
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
  return years.map(({ yearName, months }) => <YearCard key={yearName} year={yearName} months={months} />);
}

render(<App />, document.querySelector(".wrapper"));
