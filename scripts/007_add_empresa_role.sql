-- Migración: Agregar rol 'empresa' para dueños de empresas
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE public.users ADD CONSTRAINT users_role_check 
  CHECK (role IN ('superadmin', 'admin', 'empleado', 'user', 'empresa'));

-- Actualizar función helper para verificar roles de empresa/admin
CREATE OR REPLACE FUNCTION is_empresa_or_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role IN ('empresa', 'admin', 'superadmin')
  )
$$ LANGUAGE sql SECURITY DEFINER;
