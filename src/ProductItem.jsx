import React from "react";
import { Link } from "react-router-dom";
import { statusIcons } from ".";

export function ProductItem({ product }) {
  const { name, status, slug } = product;

  return (
    <Link to={"/product/" + slug} className={status + "-product product-item"}>
      <i className={`${statusIcons[status]} product-item-icon`} /> {name}
    </Link>
  );
}
