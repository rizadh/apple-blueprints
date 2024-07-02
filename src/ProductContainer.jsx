import React, { useContext, useEffect, useRef, useMemo } from "react";
import { statusLabels } from "./statusLabels";
import { statusIcons } from "./statusIcons";
import { ProductsDataContext } from "./ProductsDataContext";
import { useContentfulLiveUpdates } from "@contentful/live-preview/react";
import { ContentfulLivePreview } from "@contentful/live-preview";
import { router } from "./router";

export function ProductContainer({ product, onDismiss }) {
  const productsData = useContext(ProductsDataContext);
  const sortedProductSlugs = useMemo(
    () =>
      productsData.items
        .toSorted((a, b) => new Date(a.fields.date).getTime() - new Date(b.fields.date).getTime())
        .map((item) => item.fields.slug),
    [productsData]
  );
  const currentProductIndex = sortedProductSlugs.indexOf(product.fields.slug);
  const nextProductSlug = sortedProductSlugs[currentProductIndex + 1];
  const previousProductSlug = sortedProductSlugs[currentProductIndex - 1];

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
    const handler = (event) => {
      switch (event.key) {
        case "Escape":
          onDismiss();
          break;
        case "ArrowLeft":
          if (previousProductSlug) router.navigate(`/product/${previousProductSlug}`);
          break;
        case "ArrowRight":
          if (nextProductSlug) router.navigate(`/product/${nextProductSlug}`);
          break;
      }
    };

    document.addEventListener("keydown", handler);

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener("keydown", handler);
    };
  }, [previousProductSlug, nextProductSlug]);

  // TODO: Remove if this does not work
  const productContainerRef = useRef();
  useEffect(() => {
    productContainerRef.current?.focus();
  }, [productContainerRef.current]);

  return (
    <div className="product-container" ref={productContainerRef}>
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
