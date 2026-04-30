import { useState } from "react";
import { Search, Plus, Minus, X } from "lucide-react";

const produtosEstoque = [
  {
    codigo: "P001",
    nome: "Óleo 5W30",
    quantidade: 25,
    minimo: 10,
    precoCusto: 35,
    precoVenda: 45,
  },
  {
    codigo: "P002",
    nome: "Filtro de óleo",
    quantidade: 18,
    minimo: 15,
    precoCusto: 20,
    precoVenda: 28,
  },
  {
    codigo: "P003",
    nome: "Pastilha de freio",
    quantidade: 12,
    minimo: 8,
    precoCusto: 90,
    precoVenda: 120,
  },
  {
    codigo: "P004",
    nome: "Disco de freio",
    quantidade: 5,
    minimo: 6,
    precoCusto: 140,
    precoVenda: 180,
  },
  {
    codigo: "P005",
    nome: "Filtro de ar",
    quantidade: 15,
    minimo: 10,
    precoCusto: 25,
    precoVenda: 35,
  },
  {
    codigo: "P006",
    nome: "Velas de ignição",
    quantidade: 3,
    minimo: 12,
    precoCusto: 15,
    precoVenda: 22,
  },
  {
    codigo: "P007",
    nome: "Correia dentada",
    quantidade: 8,
    minimo: 5,
    precoCusto: 85,
    precoVenda: 115,
  },
  {
    codigo: "P008",
    nome: "Fluido de freio",
    quantidade: 2,
    minimo: 8,
    precoCusto: 18,
    precoVenda: 25,
  },
  {
    codigo: "P009",
    nome: "Aditivo de radiador",
    quantidade: 20,
    minimo: 10,
    precoCusto: 12,
    precoVenda: 18,
  },
];

export function Estoque() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"entrada" | "saida">("entrada");

  const openModal = (type: "entrada" | "saida") => {
    setModalType(type);
    setShowModal(true);
  };

  const filteredProducts = produtosEstoque.filter((produto) =>
    produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    produto.codigo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-primary">Controle de Estoque</h1>
        <div className="flex gap-3">
          <button
            onClick={() => openModal("entrada")}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <Plus size={20} />
            Entrada
          </button>
          <button
            onClick={() => openModal("saida")}
            className="px-6 py-3 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors flex items-center gap-2"
          >
            <Minus size={20} />
            Saída
          </button>
        </div>
      </div>

      <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
        <div className="mb-6">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={20}
            />
            <input
              type="text"
              placeholder="Buscar por nome ou código..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-3 text-muted-foreground">Código</th>
                <th className="text-left p-3 text-muted-foreground">Nome</th>
                <th className="text-left p-3 text-muted-foreground">
                  Quantidade
                </th>
                <th className="text-left p-3 text-muted-foreground">Mínimo</th>
                <th className="text-left p-3 text-muted-foreground">
                  Preço Custo
                </th>
                <th className="text-left p-3 text-muted-foreground">
                  Preço Venda
                </th>
                <th className="text-left p-3 text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((produto) => {
                const isCritico = produto.quantidade < produto.minimo;
                return (
                  <tr
                    key={produto.codigo}
                    className={`border-b border-border hover:bg-muted transition-colors ${
                      isCritico ? "bg-red-50" : ""
                    }`}
                  >
                    <td className="p-3">{produto.codigo}</td>
                    <td className="p-3">{produto.nome}</td>
                    <td className="p-3">
                      <span
                        className={
                          isCritico ? "text-destructive font-semibold" : ""
                        }
                      >
                        {produto.quantidade}
                      </span>
                    </td>
                    <td className="p-3">{produto.minimo}</td>
                    <td className="p-3">R$ {produto.precoCusto.toFixed(2)}</td>
                    <td className="p-3">R$ {produto.precoVenda.toFixed(2)}</td>
                    <td className="p-3">
                      {isCritico ? (
                        <span className="bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-xs">
                          Estoque Baixo
                        </span>
                      ) : (
                        <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs">
                          Normal
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <h4 className="text-amber-800 mb-2">⚠️ Produtos com estoque crítico</h4>
          <p className="text-sm text-amber-700">
            {
              produtosEstoque.filter((p) => p.quantidade < p.minimo).length
            }{" "}
            produtos estão abaixo do estoque mínimo e precisam de reposição.
          </p>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card p-6 rounded-lg max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-primary">
                {modalType === "entrada" ? "Entrada" : "Saída"} de Produto
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-secondary rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form className="space-y-4">
              <div>
                <label className="block mb-2 text-muted-foreground">
                  Produto
                </label>
                <select className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                  <option value="">Selecione...</option>
                  {produtosEstoque.map((produto) => (
                    <option key={produto.codigo} value={produto.codigo}>
                      {produto.codigo} - {produto.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-2 text-muted-foreground">
                  Quantidade
                </label>
                <input
                  type="number"
                  min="1"
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block mb-2 text-muted-foreground">
                  Observações
                </label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  placeholder="Detalhes sobre a movimentação..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors"
                >
                  Confirmar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
