-- Migración: Agregar rol 'user' para usuarios individuales
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE public.users ADD CONSTRAINT users_role_check 
  CHECK (role IN ('superadmin', 'admin', 'empleado', 'user'));
