export type MenuItem = {
  nombre: string;          // etiqueta visible
  ruta: string;            // ruta absoluta
  icono?: string;          // nombre del ícono en lucide-react
  orden?: number;          // para ordenar
  requireModule?: string;  // módulo requerido para ver el item
  requireRole?: string;    // rol requerido (opcional)
};

// 👇 Ajusta los módulos/rutas a tu dominio
export const MENU_ESTATICO: MenuItem[] = [
  {
    nombre: "Dashboard",
    ruta: "/dashboard",
    icono: "LayoutDashboard",
    orden: 1,
    requireModule: "dashboard",
  },
  {
    nombre: "Comercios",
    ruta: "/comercios",
    icono: "User",
    orden: 2,
    requireModule: "comercios",
  },
  {
    nombre: "Cotizaciones",
    ruta: "/cotizaciones",
    icono: "FileText",
    orden: 2,
    requireModule: "cotizaciones",
  },
  {
    nombre: "Pedidos",
    ruta: "/pedidos",
    icono: "ClipboardList",
    orden: 3,
    requireModule: "pedidos",
  },
  {
    nombre: "Usuarios",
    ruta: "/usuarios",
    icono: "Users",
    orden: 4,
    requireModule: "users",
  },
  {
    nombre: "Reportes",
    ruta: "/reportes",
    icono: "BarChart4",
    orden: 99,
    requireModule: "reportes",
    requireRole: "admin", // ejemplo de restricción por rol
  },
  {
    nombre: "Publicidad",
    ruta: "/publicidad",
    icono: "BarChart4",
    orden: 99,
    requireModule: "publicidad",
    requireRole: "administrador", // ejemplo de restricción por rol
  },
 {
    nombre: "Categorias",
    ruta: "/categorias",
    icono: "FolderTree ",
    orden: 99,
    requireModule: "categories",
    requireRole: "comercio", // ejemplo de restricción por rol
  },
  
  {
    nombre: "Productos",
    ruta: "/productos",
    icono: "Product ",
    orden: 99,
    requireModule: "products",
    requireRole: "comercio", // ejemplo de restricción por rol
  },


  {
    nombre: "Horarios",
    ruta: "/horarios",
    icono: "Clock",
    orden: 99,
    requireModule: "horarios",
    requireRole: "comercio", // ejemplo de restricción por rol
  },

   {
    nombre: "Servicios",
    ruta: "/servicios",
    icono: "Tags",
    orden: 99,
    requireModule: "services",
    requireRole: "administrador", // ejemplo de restricción por rol
  },


     {
    nombre: "Imagenes",
    ruta: "/imagenes",
    icono: "Picture",
    orden: 100,
    requireModule: "imagenes",
    requireRole: "comercio", // ejemplo de restricción por rol
  },
];
