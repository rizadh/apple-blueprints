import React, { useState } from "react";
import { Link } from "react-router-dom";
import { statusIcons } from "./statusIcons";
import { useContentfulLiveUpdates } from "@contentful/live-preview/react";
import { ContentfulLivePreview } from "@contentful/live-preview";

export function ProductItem({ product }) {
  const updatedProduct = useContentfulLiveUpdates(product);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      to={"/product/" + updatedProduct.fields.slug}
      className={updatedProduct.fields.status + "-product product-item"}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <i
        className={`${statusIcons[updatedProduct.fields.status]} product-item-icon`}
        {...ContentfulLivePreview.getProps({ entryId: product.sys.id, fieldId: "status" })}
      />{" "}
      <span
        className={`product-item-text ${isHovered ? "hovered-text" : ""}`}
        {...ContentfulLivePreview.getProps({ entryId: product.sys.id, fieldId: "productName" })}
      >
        {updatedProduct.fields.productName}
      </span>
    </Link>
  );
}
