import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal, render } from 'react-dom';

// Constants for status icons and labels
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

// Fetch data from Contentful
const fetchData = async () => {
  const spaceId = '1zn4b0ow3sim';
  const accessToken = 'xkzA96ThdMaC5DW91RubOhJhrMi8ZHPrxCCWZ7DbZek';
  const apiUrl = `https://cdn.contentful.com/spaces/${spaceId}/entries?access_token=${accessToken}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error('Error fetching data from Contentful:', error);
    return [];
  }
};

// Component to render individual product items
function ProductItem({ product }) {
  const { name, status } = product.fields;
  const [showDetails, setShowDetails] = useState(false);
  const showModal = useCallback(() => setShowDetails(true), []);
  const closeModal = useCallback(() => setShowDetails(false), []);

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

// Component to render products for a month
function MonthCard({ month, products }) {
  return (
    <ul className="item">
      <span className="month">{month}</span>
      {products.map((product) => (
        <ProductItem key={product.sys.id} product={product} />
      ))}
    </ul>
  );
}

// Component to render year-wise products
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

// Component to render product details in a modal
function ProductContainer({ product, onDismiss }) {
  const { name, status, description, features, sources } = product.fields;
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
    </div>
  );
}

// Modal component
function Modal({ children }) {
  const element = useRef(document.createElement("div"));

  useEffect(() => {
    const parentNode = document.querySelector("#modal-container");
    parentNode.appendChild(element.current);

    return () => element.current.remove();
  }, []);

  return createPortal(children, element.current);
}

// Main App component
function App() {
  const [years, setYears] = useState([]);

  useEffect(() => {
    fetchData().then(data => {
      // Process and group data by year and month
      const groupedData = groupByYearAndMonth(data);
      setYears(groupedData);
    });
  }, []);

  return years.map(({ yearName, months }) => (
    <YearCard key={yearName} year={yearName} months={months} />
  ));
}

// Helper function to group products by year and month
const groupByYearAndMonth = (data) => {
  // Logic to group data by year and month
  const grouped = {};

  data.forEach(item => {
    const date = new Date(item.fields.releaseDate);
    const year = date.getFullYear();
    const month = date.toLocaleString('default', { month: 'long' });

    if (!grouped[year]) grouped[year] = {};
    if (!grouped[year][month]) grouped[year][month] = [];

    grouped[year][month].push(item);
  });

  return Object.keys(grouped).map(year => ({
    yearName: year,
    months: Object.keys(grouped[year]).map(month => ({
      name: month,
      products: grouped[year][month]
    }))
  }));
};

// Render the App
render(<App />, document.querySelector(".wrapper"));
