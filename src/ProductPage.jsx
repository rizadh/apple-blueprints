import React, { useCallback, useContext } from "react";
import { useParams } from "react-router-dom";
import { ProductsDataContext, router } from ".";
import { Modal } from "./Modal";
import { ProductContainer } from "./ProductContainer";

export function ProductPage() {
  const productsData = useContext(ProductsDataContext);
  const { product: slug } = useParams();

  const product = productsData?.items.find((product) => product.fields.slug === slug);

  const closeModal = useCallback(() => {
    router.navigate("/");
  });

  return (
    <Modal onDismiss={closeModal}>{product ? <ProductContainer product={product} /> : <div>Loading...</div>}</Modal>
  );
}
