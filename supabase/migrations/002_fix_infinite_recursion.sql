-- Create a security definer function to check if the current user is an admin.
-- SECURITY DEFINER allows this function to bypass RLS, preventing infinite recursion.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop all the old recursive policies
DROP POLICY IF EXISTS "Admin can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admin can manage categories" ON public.categories;
DROP POLICY IF EXISTS "Admin can manage products" ON public.products;
DROP POLICY IF EXISTS "Admin can manage all orders" ON public.orders;
DROP POLICY IF EXISTS "Admin can manage order tracking" ON public.order_tracking;
DROP POLICY IF EXISTS "Admin can manage vouchers" ON public.vouchers;
DROP POLICY IF EXISTS "Admin can manage all custom orders" ON public.custom_orders;

-- Recreate them using the safe is_admin() function
CREATE POLICY "Admin can view all profiles" ON public.profiles FOR SELECT USING (is_admin());
CREATE POLICY "Admin can manage categories" ON public.categories FOR ALL USING (is_admin());
CREATE POLICY "Admin can manage products" ON public.products FOR ALL USING (is_admin());
CREATE POLICY "Admin can manage all orders" ON public.orders FOR ALL USING (is_admin());
CREATE POLICY "Admin can manage order tracking" ON public.order_tracking FOR ALL USING (is_admin());
CREATE POLICY "Admin can manage vouchers" ON public.vouchers FOR ALL USING (is_admin());
CREATE POLICY "Admin can manage all custom orders" ON public.custom_orders FOR ALL USING (is_admin());

