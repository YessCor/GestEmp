-- GestEmp SaaS - Tabla de Solicitudes de Registro
-- Las personas llenan el formulario de sign-up y se crea una solicitud pendiente.
-- El superadmin la aprueba o rechaza desde su panel.

-- ============================================
-- TABLA: registration_requests
-- ============================================
CREATE TABLE IF NOT EXISTS public.registration_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  company_name TEXT NOT NULL,
  company_ruc TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  rejection_reason TEXT,
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_registration_requests_status ON public.registration_requests(status);
CREATE INDEX IF NOT EXISTS idx_registration_requests_email ON public.registration_requests(email);

-- Trigger updated_at
DROP TRIGGER IF EXISTS update_registration_requests_updated_at ON public.registration_requests;
CREATE TRIGGER update_registration_requests_updated_at
  BEFORE UPDATE ON public.registration_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- RLS POLICIES
-- ============================================
ALTER TABLE public.registration_requests ENABLE ROW LEVEL SECURITY;

-- Cualquiera puede insertar (enviar solicitud, incluso sin estar autenticado)
CREATE POLICY "Anyone can submit registration request"
  ON public.registration_requests
  FOR INSERT
  WITH CHECK (true);

-- Solo superadmin puede ver todas las solicitudes
CREATE POLICY "Superadmin can view all registration requests"
  ON public.registration_requests
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'superadmin'
    )
  );

-- Solo superadmin puede actualizar (aprobar/rechazar)
CREATE POLICY "Superadmin can update registration requests"
  ON public.registration_requests
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'superadmin'
    )
  );
