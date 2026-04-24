# GestEmp - Sistema de Gestión Empresarial

GestEmp es una plataforma SaaS moderna diseñada para simplificar la administración de pequeñas y medianas empresas. Permite gestionar inventarios, realizar ventas, generar facturas y visualizar estadísticas clave en tiempo real, todo bajo una arquitectura multi-empresa robusta.

## 🚀 Demo
Puedes ver el proyecto en vivo aquí: [https://tu-dominio.com](https://tu-dominio.com)
*(Nota: Asegúrate de configurar las variables de entorno correctamente)*

## ✨ Características Principales

- **Dashboard Inteligente**: Resumen dinámico de productos, ventas totales, ingresos y alertas de stock bajo.
- **Gestión de Inventario**: Control total sobre tus productos, categorías y niveles de existencias.
- **Sistema de Ventas**: Registro ágil de transacciones comerciales.
- **Facturación**: Generación de documentos fiscales para tus clientes.
- **Multi-tenant (Multi-empresa)**: Diseñado para manejar múltiples empresas con aislamiento de datos.
- **Roles y Permisos**: Diferentes niveles de acceso (Superadmin, Administrador, Empleado).
- **Diseño Premium**: Interfaz moderna, rápida y responsiva construida con lo último en tecnologías web.

## 🛠️ Tecnologías Utilizadas

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Base de Datos y Autenticación**: [Supabase](https://supabase.com/)
- **Estilos**: [Tailwind CSS](https://tailwindcss.com/)
- **Componentes UI**: [Radix UI](https://www.radix-ui.com/) y [Lucide Icons](https://lucide.dev/)
- **Gestión de Formularios**: [React Hook Form](https://react-hook-form.com/) y [Zod](https://zod.dev/)
- **Gráficos**: [Recharts](https://recharts.org/)

## ⚙️ Configuración Local

1. Clona el repositorio:
   ```bash
   git clone <url-del-repositorio>
   ```

2. Instala las dependencias:
   ```bash
   npm install
   # o
   pnpm install
   ```

3. Configura las variables de entorno:
   Crea un archivo `.env` en la raíz con lo siguiente:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
   NEXT_PUBLIC_SITE_URL=https://tu-dominio.com
   ```

4. Ejecuta el servidor de desarrollo:
   ```bash
   npm run dev
   ```

## 📄 Licencia

Este proyecto está bajo la licencia MIT.

---
Desarrollado con ❤️ por [BIY Solutions](https://biy.solutions)