import React from "react";
import { statusIcons, statusLabels } from ".";

export function ProductContainer({ product: { name, status, description, features, sources, images }, onDismiss }) {
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
