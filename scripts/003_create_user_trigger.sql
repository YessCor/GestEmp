-- GestEmp SaaS - Trigger para crear usuario automáticamente al registrarse
-- Este trigger crea un registro en public.users cuando un usuario se registra en auth.users

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
  user_role := COALESCE(NEW.raw_user_meta_data ->> 'role', 'empleado');
  user_company_id := (NEW.raw_user_meta_data ->> 'company_id')::UUID;
  
  -- Validar el rol
  IF user_role NOT IN ('superadmin', 'admin', 'empleado', 'user', 'empresa') THEN
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

-- Eliminar trigger existente si existe
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Crear el trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Función para actualizar stock después de una venta
CREATE OR REPLACE FUNCTION update_product_stock_after_sale()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Reducir el stock del producto
  UPDATE public.products
  SET current_stock = current_stock - NEW.quantity
  WHERE id = NEW.product_id;
  
  -- Crear log de inventario
  INSERT INTO public.inventory_logs (
    company_id,
    product_id,
    user_id,
    type,
    quantity,
    previous_stock,
    new_stock,
    reason,
    reference_id
  )
  SELECT 
    p.company_id,
    NEW.product_id,
    s.user_id,
    'salida',
    NEW.quantity,
    p.current_stock + NEW.quantity,
    p.current_stock,
    'Venta',
    NEW.sale_id
  FROM public.products p
  JOIN public.sales s ON s.id = NEW.sale_id
  WHERE p.id = NEW.product_id;
  
  RETURN NEW;
END;
$$;

-- Trigger para actualizar stock
DROP TRIGGER IF EXISTS on_sale_item_created ON public.sale_items;
CREATE TRIGGER on_sale_item_created
  AFTER INSERT ON public.sale_items
  FOR EACH ROW
  EXECUTE FUNCTION update_product_stock_after_sale();

-- Función para generar número de venta automático
CREATE OR REPLACE FUNCTION generate_sale_number()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  next_number INTEGER;
  year_prefix TEXT;
BEGIN
  year_prefix := TO_CHAR(CURRENT_DATE, 'YYYY');
  
  SELECT COALESCE(MAX(CAST(SUBSTRING(sale_number FROM 6) AS INTEGER)), 0) + 1
  INTO next_number
  FROM public.sales
  WHERE company_id = NEW.company_id
  AND sale_number LIKE year_prefix || '-%';
  
  NEW.sale_number := year_prefix || '-' || LPAD(next_number::TEXT, 6, '0');
  
  RETURN NEW;
END;
$$;

-- Trigger para número de venta
DROP TRIGGER IF EXISTS set_sale_number ON public.sales;
CREATE TRIGGER set_sale_number
  BEFORE INSERT ON public.sales
  FOR EACH ROW
  WHEN (NEW.sale_number IS NULL OR NEW.sale_number = '')
  EXECUTE FUNCTION generate_sale_number();

-- Función para generar número de factura automático
CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  next_number INTEGER;
  series_prefix TEXT;
BEGIN
  series_prefix := 'F' || TO_CHAR(CURRENT_DATE, 'YYYY');
  
  SELECT COALESCE(MAX(CAST(SUBSTRING(invoice_number FROM 6) AS INTEGER)), 0) + 1
  INTO next_number
  FROM public.invoices
  WHERE company_id = NEW.company_id
  AND invoice_number LIKE series_prefix || '-%';
  
  NEW.invoice_number := series_prefix || '-' || LPAD(next_number::TEXT, 6, '0');
  
  RETURN NEW;
END;
$$;

-- Trigger para número de factura
DROP TRIGGER IF EXISTS set_invoice_number ON public.invoices;
CREATE TRIGGER set_invoice_number
  BEFORE INSERT ON public.invoices
  FOR EACH ROW
  WHEN (NEW.invoice_number IS NULL OR NEW.invoice_number = '')
  EXECUTE FUNCTION generate_invoice_number();
