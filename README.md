# 🛒 React + Supabase Product Manager

A complete **React (Vite)** + **Supabase** project with authentication, product management (CRUD), and image uploads.
Perfect for learning **Supabase Auth, Database, Storage, and RLS policies** in a real-world setup.

---

## ✨ Features

* 🔐 **Authentication**: Email + Password (signup, login, logout)
* 📦 **Product CRUD**: Add, Update, Delete, List Products
* 🖼 **Image Uploads**: Supabase Storage integration
* ⏱ **Timestamps**: Track product creation date
* 🔒 **Row Level Security**: Protect user data
* ⚡ **Realtime**: Auto-refresh product list on changes

---

## 🛠 Tech Stack

* [React (Vite)](https://vitejs.dev/)
* [Supabase](https://supabase.com/) (Auth, Database, Storage, Realtime)
* [UUID](https://www.npmjs.com/package/uuid) for unique file names
* Plain CSS for styling (easy to replace with Tailwind/MUI)

---

## ⚙️ Setup Guide

### 1️⃣ Clone & Install

```bash
git clone https://github.com/TanmayShil/react-supabase-setup-crud-project.git
cd supabase-react-products
npm install
```

---

### 2️⃣ Supabase Setup

#### a) Database Schema

```sql
create extension if not exists "uuid-ossp";

create table public.products (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  image_url text,
  price numeric not null,
  created_at timestamptz default now(),
  owner uuid references auth.users(id)
);
```

#### b) Row Level Security (RLS)

```sql
alter table public.products enable row level security;

-- allow select to authenticated users
create policy "Allow select to authenticated"
on public.products for select
using (auth.role() = 'authenticated');

-- allow insert (owner must be current user)
create policy "Allow insert for authenticated"
on public.products for insert
with check (auth.uid() = owner);

-- allow update/delete only by owner
create policy "Allow update/delete by owner"
on public.products for update, delete
using (auth.uid() = owner)
with check (auth.uid() = owner);
```

---

### 3️⃣ Storage Setup

* Go to **Supabase Dashboard → Storage**
* Create a bucket named: **`products-images`**
* If you want simplicity → mark it **Public**
* If private → add policies below

#### Storage RLS Policies (for private bucket)

```sql
-- Allow uploads for authenticated users
create policy "Allow uploads for authenticated users"
on storage.objects for insert
to authenticated
with check ( bucket_id = 'products-images' );

-- Allow update/delete only by file owner
create policy "Allow update/delete own files"
on storage.objects for update, delete
to authenticated
using ( bucket_id = 'products-images' and owner = auth.uid() );

-- Allow public read (optional, for image display)
create policy "Allow public read"
on storage.objects for select
using ( bucket_id = 'products-images' );
```

---

### 4️⃣ Environment Variables

Create a `.env` file:

```env
VITE_SUPABASE_URL=https://<your-project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>
VITE_STORAGE_BUCKET=products-images
```

⚠️ Use **Anon key** only (never expose `service_role` key).

---

### 5️⃣ Run the App

```bash
npm run dev
```

Open: [http://localhost:5173](http://localhost:5173)

---

## 📂 Project Structure

```
src/
├── App.jsx              # Main app container
├── supabaseClient.js    # Supabase client config
├── components/
│   ├── Auth.jsx         # Signup / Login / Logout
│   ├── ProductForm.jsx  # Add / Edit product
│   ├── ProductList.jsx  # List products
│   └── ProductItem.jsx  # Single product card
├── styles.css           # Basic styling
```

---

## 🧪 Usage Flow

1. **Sign Up / Log In**

   * Use email + password
   * Session persists automatically

2. **Add Product**

   * Fill product form → name, description, price
   * Upload image → saved to Supabase Storage
   * Owner tracked by `auth.uid()`

3. **Edit / Delete**

   * Only owner can edit/delete their own products

4. **List Products**

   * All authenticated users can view all products
   * Realtime updates → auto-refresh when new products are added

---

## 🧰 Troubleshooting

### ❌ Error: `403 Unauthorized - new row violates row-level security policy`

* Happens if **RLS policies missing or too strict**
* Ensure:

  * You are signed in before upload
  * `owner` field is set correctly in insert
  * Storage policies allow `insert` to `products-images`

### ❌ Images not showing?

* If bucket is **private**, use `createSignedUrl` instead of `getPublicUrl`
* If bucket is **public**, ensure file path is correct

### Debug checklist:

* Confirm `session.user.id` is being used as `owner`
* Re-check **SQL policies**
* Verify bucket settings (public/private)

---

## 📦 Example `package.json`

```json
{
  "name": "supabase-react-products",
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.46.1",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "uuid": "^9.0.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.1",
    "vite": "^5.2.0"
  }
}
```

---

## 🚀 Future Improvements

* ✅ Convert to **Next.js + TypeScript**
* 🎨 Add **Tailwind or MUI** UI
* 🔒 Use **private storage + signed URLs**
* ⚡ Replace fetch logic with **React Query**
* 🔔 Add notifications (Firebase/OneSignal)
* 📅 Add categories, stock management

---

## 🙋‍♂️ Author

Made with ❤️ by Tanmay Shil
GitHub: [@TanmayShil](https://github.com/TanmayShil)
