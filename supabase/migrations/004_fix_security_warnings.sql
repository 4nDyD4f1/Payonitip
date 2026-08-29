-- 1. Fix "Function Search Path Mutable"
-- Ini untuk memastikan fungsi-fungsi database menggunakan jalur pencarian tabel yang aman
ALTER FUNCTION public.handle_new_user() SET search_path = public;
ALTER FUNCTION public.handle_new_order() SET search_path = public;
ALTER FUNCTION public.is_admin() SET search_path = public;

-- 2. Fix "Public Can Execute SECURITY DEFINER"
-- Secara bawaan PostgreSQL, siapa saja (PUBLIC) bisa mencoba menjalankan fungsi. 
-- Kita akan mencabut izin tersebut agar fungsi penting hanya berjalan saat diizinkan/otomatis.
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.handle_new_order() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC;

-- Berikan izin HANYA kepada pengguna yang mengakses via web (anon & authenticated) untuk is_admin
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated;

-- 3. Fix "Public Bucket Allows Listing"
-- Menghapus policy SELECT berarti orang iseng tidak bisa melihat daftar/nama-nama file bukti transfer orang lain, 
-- tetapi bukti transfer tetap bisa diakses oleh sistem untuk ditampilkan karena foldernya bersifat "Public".
DROP POLICY IF EXISTS "Public Read Payment Proofs" ON storage.objects;

