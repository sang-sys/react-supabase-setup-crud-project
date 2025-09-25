import React from "react";
import { supabase } from "../supabaseClient";

export default function ProductItem({ product, onEdit, session }) {
  async function handleDelete() {
    if (!confirm("Delete this product?")) return;
    try {
      const { error } = await supabase
        .from("Products")
        .delete()
        .eq("id", product.id);
      if (error) throw error;
      alert("Deleted");
    } catch (err) {
      console.error(err);
      alert(err.message || "Error deleting");
    }
  }

  const canEdit = session && session.user?.id === product.owner;

  return (
    <div className="product-item">
      {product.image_url && (
        <img
          src={product.image_url}
          alt={product.name}
          style={{ width: 120, height: 80, objectFit: "cover" }}
        />
      )}
      <div className="product-details">
        <h4>{product.name}</h4>
        <div>{product.description}</div>
        <div>₹ {product.price}</div>
        <div className="meta">
          Created: {new Date(product.created_at).toLocaleString()}
        </div>
      </div>
      <div className="actions">
        {canEdit && <button onClick={onEdit}>Edit</button>}
        {canEdit && <button onClick={handleDelete}>Delete</button>}
      </div>
    </div>
  );
}
