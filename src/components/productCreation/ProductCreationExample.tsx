import React from "react";
import ProductCreationForm from "./ProductCreationForm";
import { useParams } from "react-router-dom";
import { useAdminSingleEntity } from "@/hooks/useUsers";

// Example page component showing how to use the ProductCreationForm
const ProductCreationExample = () => {
  const params = useParams();
  const id = params.id;
  const { data: product, isLoading } = useAdminSingleEntity("products", id);
  if (isLoading) return <div>Loading...</div>;
  console.log(product);
  return <ProductCreationForm product={product} disableCreate={false} />;
};

export default ProductCreationExample;
