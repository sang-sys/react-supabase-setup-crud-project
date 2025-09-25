import React, { useEffect, useState } from "react";
import { supabase, BUCKET } from "../supabaseClient";
import { v4 as uuidv4 } from "uuid";

export default function ProductForm({ session, productToEdit, onSaved }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name || "");
      setDescription(productToEdit.description || "");
      setPrice(productToEdit.price || "");
      setImageFile(null);
    } else {
      setName("");
      setDescription("");
      setPrice("");
      setImageFile(null);
    }
  }, [productToEdit]);

  async function uploadImage(file) {
    if (!file) return null;
    const fileExt = file.name.split(".").pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(filePath, file, { upsert: false });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(filePath);
    return data.publicUrl;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name || !price) {
      alert("Name and price are required");
      return;
    }

    setLoading(true);
    try {
      let image_url = productToEdit?.image_url || null;
      if (imageFile) {
        image_url = await uploadImage(imageFile);
      }

      const userId = session.user.id;

      if (productToEdit) {
        const { error } = await supabase
          .from("Products")
          .update({
            name,
            description,
            price,
            image_url,
          })
          .eq("id", productToEdit.id);

        if (error) throw error;
        alert("Product updated");
      } else {
        const { error } = await supabase.from("Products").insert([
          {
            name,
            description,
            price,
            image_url,
            owner: userId,
          },
        ]);

        if (error) throw error;
        alert("Product added");
      }

      setName("");
      setDescription("");
      setPrice("");
      setImageFile(null);
      onSaved?.();
    } catch (err) {
      console.error(err);
      alert(err.message || "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="product-form">
      <h3>{productToEdit ? "Edit Product" : "Add Product"}</h3>
      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImageFile(e.target.files[0])}
      />
      <button type="submit" disabled={loading}>
        {loading ? "Saving..." : productToEdit ? "Update" : "Add"}
      </button>
    </form>
  );
}
