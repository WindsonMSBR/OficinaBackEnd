import { createBrowserRouter } from "react-router";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { OrdemServicoList } from "./pages/OrdemServicoList";
import { NovaOrdemServico } from "./pages/NovaOrdemServico";
import { Estoque } from "./pages/Estoque";
import { Agendamento } from "./pages/Agendamento";
import { Financeiro } from "./pages/Financeiro";
import { Relatorios } from "./pages/Relatorios";
import { Clientes } from "./pages/Clientes";
import { Veiculos } from "./pages/Veiculos";
import { MainLayout } from "./components/MainLayout";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/",
    Component: MainLayout,
    children: [
      { index: true, Component: Dashboard },
      { path: "clientes", Component: Clientes },
      { path: "veiculos", Component: Veiculos },
      { path: "os", Component: OrdemServicoList },
      { path: "os/nova", Component: NovaOrdemServico },
      { path: "estoque", Component: Estoque },
      { path: "agendamento", Component: Agendamento },
      { path: "financeiro", Component: Financeiro },
      { path: "relatorios", Component: Relatorios },
    ],
  },
]);
