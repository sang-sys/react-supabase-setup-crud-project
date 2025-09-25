import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import ProductItem from "./ProductItem";

export default function ProductList({ onEdit, session }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  async function fetchProducts() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("Products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      console.error(err);
      alert(err.message || "Error fetching products");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();

    const productsSub = supabase
      .channel("public:Products")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "Products" },
        () => {
          fetchProducts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(productsSub);
    };
  }, []);

  return (
    <div>
      <h3>Products</h3>
      {loading && <div>Loading...</div>}
      {products.length === 0 && !loading && <div>No products yet.</div>}
      <div className="product-list">
        {products.map((p) => (
          <ProductItem
            key={p.id}
            product={p}
            onEdit={() => onEdit?.(p)}
            session={session}
          />
        ))}
      </div>
    </div>
  );
}
