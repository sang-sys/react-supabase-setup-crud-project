import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import Auth from "./components/Auth";
import ProductList from "./components/ProductList";
import ProductForm from "./components/ProductForm";

export default function App() {
  const [session, setSession] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    const s = supabase.auth.getSession().then((res) => {
      if (res?.data?.session) setSession(res.data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      listener?.subscription?.unsubscribe();
    };
  }, []);

  return (
    <div className="container">
      <h1>Supabase React — Products</h1>

      <Auth session={session} />

      {session && (
        <>
          <div style={{ marginTop: 16 }}>
            <ProductForm
              session={session}
              productToEdit={editingProduct}
              onSaved={() => setEditingProduct(null)}
            />
          </div>

          <hr />

          <ProductList
            onEdit={(product) => setEditingProduct(product)}
            session={session}
          />
        </>
      )}

      {!session && <p>Please sign in or sign up above to manage products.</p>}
    </div>
  );
}
