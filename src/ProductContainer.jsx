import React, { useContext, useEffect } from "react";
import { statusLabels } from "./statusLabels";
import { statusIcons } from "./statusIcons";
import { ProductsDataContext } from "./ProductsDataContext";
import { useContentfulLiveUpdates } from "@contentful/live-preview/react";
import { ContentfulLivePreview } from "@contentful/live-preview";

export function ProductContainer({ product, onDismiss }) {
  const productsData = useContext(ProductsDataContext);
  const updatedProduct = useContentfulLiveUpdates(product);
  const updatedAssets = useContentfulLiveUpdates(productsData.includes.Asset);
  const updatedEntries = useContentfulLiveUpdates(productsData.includes.Entry);

  const images = updatedProduct.fields.images?.map((image) =>
    updatedAssets.find((asset) => asset.sys.id === image.sys.id)
  );
  const sources = updatedProduct.fields.sources?.map((source) =>
    updatedEntries.find((entry) => entry.sys.id === source.sys.id)
  );

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        console.log("Escape key pressed");
        onDismiss();
      }
    };

    document.addEventListener("keydown", handleEsc);

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  return (
    <div className="product-container">
      <div className="top-section">
        <div className="titlebar">
          <div
            className="product-name"
            {...ContentfulLivePreview.getProps({ entryId: product.sys.id, fieldId: "productName" })}
          >
            {updatedProduct.fields.productName}
          </div>
          <div
            className={"product-status " + updatedProduct.fields.status + "-product"}
            {...ContentfulLivePreview.getProps({ entryId: product.sys.id, fieldId: "status" })}
          >
            <i className={statusIcons[updatedProduct.fields.status]} /> {statusLabels[updatedProduct.fields.status]}
          </div>
          {/* <button className="fa-solid fa-xmark close-button" onClick={onDismiss} /> */}
        </div>
        <div
          className="product-description"
          {...ContentfulLivePreview.getProps({ entryId: product.sys.id, fieldId: "description" })}
        >
          {updatedProduct.fields.description}
        </div>
        {images && (
          <div
            className="product-image-container"
            {...ContentfulLivePreview.getProps({ entryId: product.sys.id, fieldId: "images" })}
          >
            {images.map((image) => (
              <img
                key={image.fields.file.url}
                className="product-image"
                src={image.fields.file.url}
                alt={image.fields.description}
              />
            ))}
          </div>
        )}
      </div>

      {updatedProduct.fields.features && (
        <div
          className="product-header"
          {...ContentfulLivePreview.getProps({ entryId: product.sys.id, fieldId: "features" })}
        >
          What's new:
          <ul className="product-features">
            {updatedProduct.fields.features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </div>
      )}
      {sources && (
        <div className="product-header sources-header">
          Sources:
          <ul
            className="product-sources"
            {...ContentfulLivePreview.getProps({ entryId: product.sys.id, fieldId: "sources" })}
          >
            {sources.map((source) => (
              <li key={source} className="source-link">
                <a href={source.fields.url} target="_blank" className="source-link">
                  {source.fields.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
