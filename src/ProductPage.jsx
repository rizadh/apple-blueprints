import React, { useCallback, useContext } from "react";
import { useParams } from "react-router-dom";
import { ProductsContext, router } from ".";
import { Modal } from "./Modal";
import { ProductContainer } from "./ProductContainer";

export function ProductPage() {
  const products = useContext(ProductsContext);
  const { product: slug } = useParams();
  const allProducts = products.flatMap((year) => year.months.flatMap((month) => month.products));
  const product = allProducts.find((product) => product.slug === slug);

  const closeModal = useCallback(() => {
    router.navigate("/");
  });

  return (
    <Modal onDismiss={closeModal}>{product ? <ProductContainer product={product} /> : <div>Loading...</div>}</Modal>
  );
}
