import { lazy } from "react";
import { RouteObject, Navigate } from "react-router-dom";
import ProtectedRoute from "../components/feature/ProtectedRoute";

const SplashPage = lazy(() => import("../pages/splash/page"));
const HomePage = lazy(() => import("../pages/home/page"));
const PrincipalPage = lazy(() => import("../pages/principal/page"));
const TransacoesPage = lazy(() => import("../pages/transacoes/page"));
const PlanejamentoPage = lazy(() => import("../pages/planejamento/page"));
const MaisPage = lazy(() => import("../pages/mais/page"));
const InvestimentosPage = lazy(() => import("../pages/investimentos/page"));
const PatrimonioPage = lazy(() => import("../pages/patrimonio/page"));
const RelatoriosPage = lazy(() => import("../pages/relatorios/page"));
const NotFoundPage = lazy(() => import("../pages/NotFound"));
const LoginPage = lazy(() => import("../pages/auth/login"));
const RegisterPage = lazy(() => import("../pages/auth/register"));
const AdicionarTransacao = lazy(() => import("../pages/transacao/adicionar"));
const AdicionarMeta = lazy(() => import("../pages/meta/adicionar"));
const ContasPage = lazy(() => import("../pages/contas/page"));
const AdicionarConta = lazy(() => import("../pages/contas/adicionar"));
const CartoesPage = lazy(() => import("../pages/cartoes/page"));
const ObjetivosPage = lazy(() => import("../pages/objetivos/page"));
const AdicionarObjetivo = lazy(() => import("../pages/objetivos/adicionar"));
const EditarObjetivo = lazy(() => import("../pages/objetivos/editar"));
const AdicionarInvestimento = lazy(() => import("../pages/investimentos/adicionar"));
const DashboardPage = lazy(() => import("../pages/dashboard/page"));
const AdicionarPatrimonio = lazy(() => import("../pages/patrimonio/adicionar"));
const CategoriasPage = lazy(() => import("../pages/categorias/page"));

const routes: RouteObject[] = [
  {
    path: '/',
    element: <SplashPage />
  },
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/register',
    element: <RegisterPage />
  },
  {
    path: '/auth/login',
    element: <LoginPage />
  },
  {
    path: '/auth/register',
    element: <RegisterPage />
  },
  {
    path: '/home',
    element: <ProtectedRoute><HomePage /></ProtectedRoute>
  },
  {
    path: '/principal',
    element: <ProtectedRoute><PrincipalPage /></ProtectedRoute>
  },
  {
    path: '/dashboard',
    element: <ProtectedRoute><DashboardPage /></ProtectedRoute>
  },
  {
    path: '/transacoes',
    element: <ProtectedRoute><TransacoesPage /></ProtectedRoute>
  },
  {
    path: '/transacao/adicionar',
    element: <ProtectedRoute><AdicionarTransacao /></ProtectedRoute>
  },
  {
    path: '/contas',
    element: <ProtectedRoute><ContasPage /></ProtectedRoute>
  },
  {
    path: '/contas/adicionar',
    element: (
      <ProtectedRoute>
        <AdicionarConta />
      </ProtectedRoute>
    ),
  },
  {
    path: '/cartoes',
    element: <ProtectedRoute><CartoesPage /></ProtectedRoute>
  },
  {
    path: '/categorias',
    element: <ProtectedRoute><CategoriasPage /></ProtectedRoute>
  },
  {
    path: '/investimentos',
    element: <ProtectedRoute><InvestimentosPage /></ProtectedRoute>
  },
  {
    path: '/investimentos/adicionar',
    element: <ProtectedRoute><AdicionarInvestimento /></ProtectedRoute>
  },
  {
    path: '/patrimonio',
    element: <ProtectedRoute><PatrimonioPage /></ProtectedRoute>
  },
  {
    path: '/patrimonio/adicionar',
    element: <ProtectedRoute><AdicionarPatrimonio /></ProtectedRoute>
  },
  {
    path: '/relatorios',
    element: <ProtectedRoute><RelatoriosPage /></ProtectedRoute>
  },
  {
    path: '/objetivos',
    element: <ProtectedRoute><ObjetivosPage /></ProtectedRoute>
  },
  {
    path: '/objetivos/adicionar',
    element: <ProtectedRoute><AdicionarObjetivo /></ProtectedRoute>
  },
  {
    path: '/objetivos/editar',
    element: <ProtectedRoute><EditarObjetivo /></ProtectedRoute>
  },
  {
    path: '/planejamento',
    element: <ProtectedRoute><PlanejamentoPage /></ProtectedRoute>
  },
  {
    path: '/meta/adicionar',
    element: <ProtectedRoute><AdicionarMeta /></ProtectedRoute>
  },
  {
    path: '/mais',
    element: <ProtectedRoute><MaisPage /></ProtectedRoute>
  },
  {
    path: '*',
    element: <NotFoundPage />
  }
];

export default routes;
