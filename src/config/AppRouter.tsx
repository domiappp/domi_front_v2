// routes/AppRouter.tsx  (✅ sin BrowserRouter aquí)
import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import PrivateRoute from "./PrivateRoute";
import PublicOnlyRoute from "./PublicOnlyRoute";
import { useLoader } from "../store/loader.store";
import PublicLayout from "../layouts/PublicLayout";
import ComercioPage from "../pages/public/ComercioPage";

const Home = lazy(() => import("../pages/public/HomePage"));
const Login = lazy(() => import("../pages/public/LoginPage"));
const Dashboard = lazy(() => import("../pages/admin/DashboardPage"));
const Forbidden = lazy(() => import("../pages/public/ForbiddenPage"));
const Populares = lazy(() => import("../pages/public/PopularesPage"));
const Comercios = lazy(() => import("../pages/admin/ComerciosPage"));
const Publicidad = lazy(() => import("../pages/admin/PublicidadPage"));
const Usuarios = lazy(() => import("../pages/admin/UsuariosPage"));
const Categorias = lazy(() => import("../pages/comercio/Categorias"));
const Productos = lazy(() => import("../pages/comercio/Productos"));
const Horarios = lazy(() => import("../pages/comercio/ComercioHorariosPage"));

const Servicios = lazy(() => import("../pages/admin/ServicioPage"));
const Imagenes = lazy(() => import("../pages/comercio/Imagenes"));


/** ---------- Tipos de config ---------- */
type LayoutCmp = React.ComponentType; // Layout que internamente renderiza <Outlet />

type PublicRouteCfg = {
    path: string;
    element: React.ReactElement;
    layout?: LayoutCmp | null; // 👈 ya lo tienes
};


type PrivateRouteCfg = {
    path: string;
    element: React.ReactElement;
    layout?: LayoutCmp | null; // opcional: layout privado (MainLayout, etc.)
    requireModule: string;
    requireRole?: string | string[]; // 👈 rol o lista de roles permitidos
};

/** ---------- Fallback del Suspense (usa tu loader global) ---------- */
const RouteFallback: React.FC = () => {
    const show = useLoader(s => s.show);
    const hide = useLoader(s => s.hide);

    React.useEffect(() => {
        show();
        return () => hide();
    }, [show, hide]);

    return null; // LoaderGate se encarga de tapar la UI
};

/** ---------- Config de rutas ---------- */

// Públicas (puedes añadir layout si alguna pública lo requiere)
const publicRoutes: PublicRouteCfg[] = [
    { path: "/domicilios-pitalito", element: <Home />, layout: PublicLayout },
    { path: "/locales-populares", element: <Populares />, layout: PublicLayout },
    { path: "/local-comercial/:id", element: <ComercioPage />, layout: PublicLayout },

    { path: "/403", element: <Forbidden /> },
];

// Privadas (cada una define módulo, rol(es) y layout si aplica)
const privateRoutes: PrivateRouteCfg[] = [
    {
        path: "/dashboard",
        element: <Dashboard />,
        layout: MainLayout,               // 👈 esta requiere MainLayout
        requireModule: "dashboard",
        requireRole: "administrador",     // 👈 rol requerido (o ["admin","super"])
    },
    {
        path: "/comercios",
        element: <Comercios />,
        layout: MainLayout,               // 👈 esta requiere MainLayout
        requireModule: "comercios",
        requireRole: "administrador",     // 👈 rol requerido (o ["admin","super"])
    },

    {
        path: "/usuarios",
        element: <Usuarios />,
        layout: MainLayout,               // 👈 esta requiere MainLayout
        requireModule: "users",
        requireRole: "administrador",     // 👈 rol requerido (o ["admin","super"])
    },

    {
        path: "/publicidad",
        element: <Publicidad />,
        layout: MainLayout,               // 👈 esta requiere MainLayout
        requireModule: "publicidad",
        requireRole: "administrador",     // 👈 rol requerido (o ["admin","super"])
    },

    {
        path: "/categorias",
        element: <Categorias />,
        layout: MainLayout,               // 👈 esta requiere MainLayout
        requireModule: "categories",
        requireRole: "comercio",     // 👈 rol requerido (o ["admin","super"])
    },

    {
        path: "/productos",
        element: <Productos />,
        layout: MainLayout,               // 👈 esta requiere MainLayout
        requireModule: "products",
        requireRole: "comercio",     // 👈 rol requerido (o ["admin","super"])
    },

       {
        path: "/imagenes",
        element: <Imagenes />,
        layout: MainLayout,               // 👈 esta requiere MainLayout
        requireModule: "imagenes",
        requireRole: "comercio",     // 👈 rol requerido (o ["admin","super"])
    },

    {
        path: "/horarios",
        element: <Horarios />,
        layout: MainLayout,               // 👈 esta requiere MainLayout
        requireModule: "horarios",
        requireRole: "comercio",     // 👈 rol requerido (o ["admin","super"])
    },

     {
        path: "/servicios",
        element: <Servicios />,
        layout: MainLayout,               // 👈 esta requiere MainLayout
        requireModule: "services",
        requireRole: "administrador",     // 👈 rol requerido (o ["admin","super"])
    },

    // Ejemplo extra:
    // {
    //   path: "/reportes",
    //   element: <ReportsPage />,
    //   layout: MainLayout,
    //   requireModule: "reportes",
    //   requireRole: ["analista", "administrador"],
    // },
];

/** ---------- Render helper: layout opcional ---------- */
function withOptionalLayout(
    Layout: LayoutCmp | null | undefined,
    path: string,
    element: React.ReactElement
) {
    // Si hay Layout, anida un <Route element={<Layout />}> y dentro el path real
    return Layout ? (
        <Route element={<Layout />}>
            <Route path={path} element={element} />
        </Route>
    ) : (
        <Route path={path} element={element} />
    );
}

/** ---------- Router ---------- */
const AppRouter: React.FC = () => {
    return (
        <Suspense fallback={<RouteFallback />}>
            <Routes>
                {/* Redirección raíz */}
                <Route path="/" element={<Navigate to="/domicilios-pitalito" replace />} />

                {/* Login solo para no autenticados */}
                <Route element={<PublicOnlyRoute redirectTo="/domicilios-pitalito" />}>
                    <Route path="/login" element={<Login />} />
                </Route>


                {/* Públicas desde config */}
                {publicRoutes.map(({ path, element, layout }) =>
                    withOptionalLayout(layout, path, element)
                )}

                {/* Privadas desde config: cada una con su PrivateRoute y layout opcional */}
                {privateRoutes.map(({ path, element, layout, requireModule, requireRole }) => (
                    <Route
                        key={path}
                        element={<PrivateRoute requireModule={requireModule} requireRole={requireRole} />}
                    >
                        {withOptionalLayout(layout, path, element)}
                    </Route>
                ))}

                {/* Not Found */}
                <Route path="*" element={<Navigate to="/" replace />} />
                
            </Routes>
        </Suspense>
    );
};

export default AppRouter;
