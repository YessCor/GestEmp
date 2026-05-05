-- Migración: Actualizar trigger para soportar rol 'user'
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role TEXT;
  user_company_id UUID;
BEGIN
  -- Obtener el rol y company_id de los metadatos del usuario
  user_role := COALESCE(NEW.raw_user_meta_data ->> 'role', 'user');
  user_company_id := (NEW.raw_user_meta_data ->> 'company_id')::UUID;
  
  -- Validar el rol
  IF user_role NOT IN ('superadmin', 'admin', 'empleado', 'user') THEN
    user_role := 'user';
  END IF;

  -- Insertar el nuevo usuario en la tabla public.users
  INSERT INTO public.users (
    id,
    email,
    full_name,
    role,
    company_id,
    is_active
  ) VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', 'Usuario'),
    user_role,
    user_company_id,
    true
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    updated_at = now();

  RETURN NEW;
END;
$$;
