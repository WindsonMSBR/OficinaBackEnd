import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router";
import {
  LayoutDashboard,
  FileText,
  Package,
  Calendar,
  DollarSign,
  BarChart3,
  Menu,
  X,
  User,
  Users,
  Car,
} from "lucide-react";

export function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const menuItems = [
    { path: "/", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/clientes", icon: Users, label: "Clientes" },
    { path: "/veiculos", icon: Car, label: "Veiculos" },
    { path: "/os", icon: FileText, label: "Ordens de Serviço" },
    { path: "/estoque", icon: Package, label: "Estoque" },
    { path: "/agendamento", icon: Calendar, label: "Agendamento" },
    { path: "/financeiro", icon: DollarSign, label: "Financeiro" },
    { path: "/relatorios", icon: BarChart3, label: "Relatórios" },
  ];

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const currentDate = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex h-screen bg-background">
      <aside
        className={`bg-sidebar text-sidebar-foreground transition-all duration-300 flex flex-col ${
          collapsed ? "w-16" : "w-64"
        }`}
      >
        <div className="p-4 flex items-center justify-between border-b border-sidebar-border">
          {!collapsed && (
            <h2 className="text-xl font-semibold text-sidebar-primary-foreground">
              Auto Oficina
            </h2>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 hover:bg-sidebar-accent rounded-lg transition-colors"
            title={collapsed ? "Expandir menu" : "Recolher menu"}
          >
            {collapsed ? <Menu size={20} /> : <X size={20} />}
          </button>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      active
                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                        : "hover:bg-sidebar-accent text-sidebar-foreground"
                    }`}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon size={20} />
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-card border-b border-border p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground capitalize">
              {currentDate}
            </p>
            <h1 className="text-xl text-primary">Bem-vindo, Administrador</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground">
              <User size={20} />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
