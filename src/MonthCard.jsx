import React from "react";
import { ProductItem } from "./ProductItem";

export function MonthCard({ month, products }) {
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
