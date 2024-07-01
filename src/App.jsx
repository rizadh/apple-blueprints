import React, { useState, useEffect, useMemo } from "react";
import { Outlet } from "react-router-dom";
import { YearCard } from "./YearCard";
import { ProductsDataContext } from "./ProductsDataContext";
import { transformProductsData } from "./transformProductsData";
import { fetchProductsData } from "./fetchProductsData";
import { LastUpdated } from "./LastUpdated";

export function App() {
  const [productsData, setProductsData] = useState(null);
  const { productsByYear, unknownProducts, lastUpdated } = useMemo(
    () => (productsData ? transformProductsData(productsData) : {}),
    [productsData]
  );

  useEffect(() => {
    fetchProductsData().then((data) => setProductsData(data));
  }, []);

  const unknownMonths = useMemo(() => [{ products: unknownProducts }], [unknownProducts]);

  return (
    <div className="app">
      <ProductsDataContext.Provider value={productsData}>
        <div className="year-list">
          {productsByYear &&
            productsByYear.map(({ yearName, months }) => <YearCard key={yearName} year={yearName} months={months} />)}
          {unknownProducts?.length > 0 && <YearCard key="unknown" year="unknown" months={unknownMonths} />}
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
          {lastUpdated && <LastUpdated lastUpdated={lastUpdated} />}
        </div>
        <Outlet />
      </ProductsDataContext.Provider>
    </div>
  );
}
