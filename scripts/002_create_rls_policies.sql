-- GestEmp SaaS - Políticas RLS (Row Level Security)
-- Multitenancy: Aislamiento de datos por empresa

-- ============================================
-- FUNCIÓN HELPER: Obtener company_id del usuario actual
-- ============================================
CREATE OR REPLACE FUNCTION get_user_company_id()
RETURNS UUID AS $$
  SELECT company_id FROM public.users WHERE id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER;

-- ============================================
-- FUNCIÓN HELPER: Verificar si es superadmin
-- ============================================
CREATE OR REPLACE FUNCTION is_superadmin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role = 'superadmin'
  )
$$ LANGUAGE sql SECURITY DEFINER;

-- ============================================
-- FUNCIÓN HELPER: Verificar si es admin o superadmin
-- ============================================
CREATE OR REPLACE FUNCTION is_admin_or_superadmin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role IN ('superadmin', 'admin')
  )
$$ LANGUAGE sql SECURITY DEFINER;

-- ============================================
-- RLS: companies
-- ============================================
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- Superadmin puede ver todas las empresas
CREATE POLICY "superadmin_view_all_companies" ON public.companies
  FOR SELECT USING (is_superadmin());

-- Usuarios pueden ver su propia empresa
CREATE POLICY "users_view_own_company" ON public.companies
  FOR SELECT USING (id = get_user_company_id());

-- Solo superadmin puede crear empresas
CREATE POLICY "superadmin_create_companies" ON public.companies
  FOR INSERT WITH CHECK (is_superadmin());

-- Solo superadmin puede actualizar empresas
CREATE POLICY "superadmin_update_companies" ON public.companies
  FOR UPDATE USING (is_superadmin());

-- Solo superadmin puede eliminar empresas
CREATE POLICY "superadmin_delete_companies" ON public.companies
  FOR DELETE USING (is_superadmin());

-- ============================================
-- RLS: users
-- ============================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Superadmin puede ver todos los usuarios
CREATE POLICY "superadmin_view_all_users" ON public.users
  FOR SELECT USING (is_superadmin());

-- Admin puede ver usuarios de su empresa
CREATE POLICY "admin_view_company_users" ON public.users
  FOR SELECT USING (
    company_id = get_user_company_id() 
    AND EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'superadmin'))
  );

-- Usuarios pueden ver su propio perfil
CREATE POLICY "users_view_own_profile" ON public.users
  FOR SELECT USING (id = auth.uid());

-- Superadmin puede crear cualquier usuario
CREATE POLICY "superadmin_create_users" ON public.users
  FOR INSERT WITH CHECK (is_superadmin());

-- Admin puede crear usuarios en su empresa (no admin ni superadmin)
CREATE POLICY "admin_create_company_users" ON public.users
  FOR INSERT WITH CHECK (
    is_admin_or_superadmin() 
    AND company_id = get_user_company_id()
    AND role = 'empleado'
  );

-- Empresa puede gestionar su propia empresa
CREATE POLICY "empresa_manage_own_company" ON public.companies
  FOR ALL USING (
    id = get_user_company_id()
    AND EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'empresa')
  );

-- Usuarios pueden actualizar su propio perfil (excepto rol y company_id)
CREATE POLICY "users_update_own_profile" ON public.users
  FOR UPDATE USING (id = auth.uid());

-- Admin puede actualizar usuarios de su empresa
CREATE POLICY "admin_update_company_users" ON public.users
  FOR UPDATE USING (
    is_admin_or_superadmin() 
    AND company_id = get_user_company_id()
  );

-- Superadmin puede actualizar cualquier usuario
CREATE POLICY "superadmin_update_any_user" ON public.users
  FOR UPDATE USING (is_superadmin());

-- ============================================
-- RLS: categories
-- ============================================
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Usuarios pueden ver categorías de su empresa
CREATE POLICY "users_view_company_categories" ON public.categories
  FOR SELECT USING (company_id = get_user_company_id() OR is_superadmin());

-- Admin puede crear categorías en su empresa
CREATE POLICY "admin_create_categories" ON public.categories
  FOR INSERT WITH CHECK (
    is_admin_or_superadmin() 
    AND (company_id = get_user_company_id() OR is_superadmin())
  );

-- Admin puede actualizar categorías de su empresa
CREATE POLICY "admin_update_categories" ON public.categories
  FOR UPDATE USING (
    is_admin_or_superadmin() 
    AND (company_id = get_user_company_id() OR is_superadmin())
  );

-- Admin puede eliminar categorías de su empresa
CREATE POLICY "admin_delete_categories" ON public.categories
  FOR DELETE USING (
    is_admin_or_superadmin() 
    AND (company_id = get_user_company_id() OR is_superadmin())
  );

-- ============================================
-- RLS: products
-- ============================================
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Usuarios pueden ver productos de su empresa
CREATE POLICY "users_view_company_products" ON public.products
  FOR SELECT USING (company_id = get_user_company_id() OR is_superadmin());

-- Admin puede crear productos en su empresa
CREATE POLICY "admin_create_products" ON public.products
  FOR INSERT WITH CHECK (
    is_admin_or_superadmin() 
    AND (company_id = get_user_company_id() OR is_superadmin())
  );

-- Admin puede actualizar productos de su empresa
CREATE POLICY "admin_update_products" ON public.products
  FOR UPDATE USING (
    is_admin_or_superadmin() 
    AND (company_id = get_user_company_id() OR is_superadmin())
  );

-- Admin puede eliminar productos de su empresa
CREATE POLICY "admin_delete_products" ON public.products
  FOR DELETE USING (
    is_admin_or_superadmin() 
    AND (company_id = get_user_company_id() OR is_superadmin())
  );

-- ============================================
-- RLS: sales
-- ============================================
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;

-- Usuarios pueden ver ventas de su empresa
CREATE POLICY "users_view_company_sales" ON public.sales
  FOR SELECT USING (company_id = get_user_company_id() OR is_superadmin());

-- Usuarios pueden crear ventas en su empresa
CREATE POLICY "users_create_sales" ON public.sales
  FOR INSERT WITH CHECK (
    company_id = get_user_company_id() 
    AND user_id = auth.uid()
  );

-- Admin puede actualizar ventas de su empresa
CREATE POLICY "admin_update_sales" ON public.sales
  FOR UPDATE USING (
    is_admin_or_superadmin() 
    AND (company_id = get_user_company_id() OR is_superadmin())
  );

-- ============================================
-- RLS: sale_items
-- ============================================
ALTER TABLE public.sale_items ENABLE ROW LEVEL SECURITY;

-- Usuarios pueden ver items de ventas de su empresa
CREATE POLICY "users_view_company_sale_items" ON public.sale_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.sales s 
      WHERE s.id = sale_id 
      AND (s.company_id = get_user_company_id() OR is_superadmin())
    )
  );

-- Usuarios pueden crear items de venta
CREATE POLICY "users_create_sale_items" ON public.sale_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.sales s 
      WHERE s.id = sale_id 
      AND s.company_id = get_user_company_id()
      AND s.user_id = auth.uid()
    )
  );

-- ============================================
-- RLS: invoices
-- ============================================
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- Usuarios pueden ver facturas de su empresa
CREATE POLICY "users_view_company_invoices" ON public.invoices
  FOR SELECT USING (company_id = get_user_company_id() OR is_superadmin());

-- Admin puede crear facturas en su empresa
CREATE POLICY "admin_create_invoices" ON public.invoices
  FOR INSERT WITH CHECK (
    is_admin_or_superadmin() 
    AND (company_id = get_user_company_id() OR is_superadmin())
  );

-- Admin puede actualizar facturas de su empresa
CREATE POLICY "admin_update_invoices" ON public.invoices
  FOR UPDATE USING (
    is_admin_or_superadmin() 
    AND (company_id = get_user_company_id() OR is_superadmin())
  );

-- ============================================
-- RLS: inventory_logs
-- ============================================
ALTER TABLE public.inventory_logs ENABLE ROW LEVEL SECURITY;

-- Usuarios pueden ver logs de inventario de su empresa
CREATE POLICY "users_view_company_inventory_logs" ON public.inventory_logs
  FOR SELECT USING (company_id = get_user_company_id() OR is_superadmin());

-- Admin puede crear logs de inventario
CREATE POLICY "admin_create_inventory_logs" ON public.inventory_logs
  FOR INSERT WITH CHECK (
    is_admin_or_superadmin() 
    AND (company_id = get_user_company_id() OR is_superadmin())
  );
