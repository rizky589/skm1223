# SKM BPS Kabupaten Labuhanbatu Utara

Migrasi aplikasi Survei Kepuasan Masyarakat dari Flask ke Next.js App Router, React, TypeScript, Tailwind CSS, shadcn/ui, Supabase, Framer Motion, GSAP, Zustand, React Hook Form, Zod, Axios, NProgress, Sonner, `next/image`, dan `next/font`.

## Jalankan Lokal

1. Install dependency:

```bash
npm install
```

2. Buat `.env.local` dari `.env.example`, lalu isi:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

3. Jalankan SQL di `supabase/schema.sql` pada Supabase SQL Editor.

4. Buat user admin melalui Supabase Auth, lalu login dengan email dan password tersebut.

5. Jalankan aplikasi:

```bash
npm run dev
```

## Deploy Vercel Free

Import repository ke Vercel, pilih framework Next.js, lalu tambahkan environment variables yang sama dengan `.env.example`.
