import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import {
  ArrowLeft,
  CheckCircle,
  FileText,
  Package,
  Plus,
  Save,
  Search,
  User,
  Wrench,
  X,
} from "lucide-react";
import {
  Cliente,
  clientesApi,
  ordensServicoApi,
  Veiculo,
  veiculosApi,
} from "../services/api";

const servicosPadrao = [
  { id: 1, nome: "Troca de oleo", preco: 150 },
  { id: 2, nome: "Revisao completa", preco: 450 },
  { id: 3, nome: "Alinhamento", preco: 80 },
  { id: 4, nome: "Balanceamento", preco: 60 },
  { id: 5, nome: "Troca de pastilhas de freio", preco: 320 },
  { id: 6, nome: "Troca de filtro de ar", preco: 45 },
];

const produtosEstoque = [
  { id: 1, codigo: "P001", nome: "Oleo 5W30", preco: 45, estoque: 25 },
  { id: 2, codigo: "P002", nome: "Filtro de oleo", preco: 28, estoque: 18 },
  { id: 3, codigo: "P003", nome: "Pastilha de freio", preco: 120, estoque: 12 },
  { id: 4, codigo: "P004", nome: "Disco de freio", preco: 180, estoque: 8 },
  { id: 5, codigo: "P005", nome: "Filtro de ar", preco: 35, estoque: 15 },
];

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function NovaOrdemServico() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [clienteId, setClienteId] = useState(0);
  const [veiculoId, setVeiculoId] = useState(0);
  const [mecanicoResponsavel, setMecanicoResponsavel] = useState("");
  const [dataPrometida, setDataPrometida] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [status, setStatus] = useState("Aberta");
  const [servicosSelecionados, setServicosSelecionados] = useState<number[]>([]);
  const [produtosSelecionados, setProdutosSelecionados] = useState<
    Array<{ id: number; quantidade: number }>
  >([]);
  const [showProdutoModal, setShowProdutoModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const clienteSelecionado = clientes.find((cliente) => cliente.id === clienteId);
  const veiculosDoCliente = useMemo(
    () => veiculos.filter((veiculo) => veiculo.clienteId === clienteId),
    [clienteId, veiculos]
  );
  const veiculoSelecionado = veiculos.find((veiculo) => veiculo.id === veiculoId);

  const steps = [
    { number: 1, title: "Cliente e Veiculo", icon: User },
    { number: 2, title: "Servicos", icon: Wrench },
    { number: 3, title: "Produtos", icon: Package },
    { number: 4, title: "Detalhes", icon: FileText },
    { number: 5, title: "Resumo", icon: CheckCircle },
  ];

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError("");

      try {
        const [clientesResponse, veiculosResponse] = await Promise.all([
          clientesApi.list(),
          veiculosApi.list(),
        ]);

        setClientes(clientesResponse);
        setVeiculos(veiculosResponse);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao carregar dados");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  function toggleServico(id: number) {
    setServicosSelecionados((prev) =>
      prev.includes(id) ? prev.filter((servicoId) => servicoId !== id) : [...prev, id]
    );
  }

  function addProduto(id: number) {
    setProdutosSelecionados((prev) => {
      const existing = prev.find((produto) => produto.id === id);
      if (existing) {
        return prev.map((produto) =>
          produto.id === id
            ? { ...produto, quantidade: produto.quantidade + 1 }
            : produto
        );
      }

      return [...prev, { id, quantidade: 1 }];
    });
    setShowProdutoModal(false);
  }

  function removeProduto(id: number) {
    setProdutosSelecionados((prev) => prev.filter((produto) => produto.id !== id));
  }

  function calcularTotal() {
    const totalServicos = servicosSelecionados.reduce((acc, id) => {
      const servico = servicosPadrao.find((item) => item.id === id);
      return acc + (servico?.preco || 0);
    }, 0);

    const totalProdutos = produtosSelecionados.reduce((acc, item) => {
      const produto = produtosEstoque.find((produtoItem) => produtoItem.id === item.id);
      return acc + (produto?.preco || 0) * item.quantidade;
    }, 0);

    return totalServicos + totalProdutos;
  }

  function canGoNext() {
    if (currentStep === 1) return clienteId > 0 && veiculoId > 0;
    return true;
  }

  async function salvarOrdemServico() {
    if (!clienteId || !veiculoId) {
      setError("Selecione cliente e veiculo antes de salvar.");
      setCurrentStep(1);
      return;
    }

    setSaving(true);
    setError("");

    try {
      await ordensServicoApi.create({
        clienteId,
        veiculoId,
        mecanicoResponsavel,
        dataPrometida: dataPrometida || null,
        observacoes,
        valorTotal: calcularTotal(),
        status,
      });

      navigate("/os");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar ordem");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/os")}
          className="p-2 hover:bg-secondary rounded-lg transition-colors"
          title="Voltar"
        >
          <ArrowLeft size={24} className="text-primary" />
        </button>
        <div>
          <h1 className="text-primary">Nova Ordem de Servico</h1>
          <p className="text-sm text-muted-foreground">
            Crie uma OS real usando clientes e veiculos da API.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/30 text-destructive rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
          {steps.map((step) => {
            const Icon = step.icon;
            const isActive = currentStep === step.number;
            const isCompleted = currentStep > step.number;

            return (
              <button
                key={step.number}
                onClick={() => setCurrentStep(step.number)}
                className={`p-3 rounded-lg border transition-colors text-left ${
                  isActive
                    ? "border-accent bg-accent/10"
                    : isCompleted
                    ? "border-green-500/30 bg-green-500/10"
                    : "border-border bg-muted"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon size={20} className={isActive ? "text-accent" : "text-primary"} />
                  <span className="text-sm">{step.title}</span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="min-h-[380px]">
          {currentStep === 1 && (
            <div className="space-y-6">
              <h3 className="text-primary">Cliente e veiculo</h3>

              {loading ? (
                <div className="p-4 bg-muted rounded-lg text-muted-foreground">
                  Carregando clientes e veiculos...
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 text-muted-foreground">
                      Cliente
                    </label>
                    <select
                      value={clienteId}
                      onChange={(event) => {
                        setClienteId(Number(event.target.value));
                        setVeiculoId(0);
                      }}
                      className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value={0}>Selecione um cliente</option>
                      {clientes.map((cliente) => (
                        <option key={cliente.id} value={cliente.id}>
                          {cliente.nome} - {cliente.cpfCnpj}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block mb-2 text-muted-foreground">
                      Veiculo
                    </label>
                    <select
                      value={veiculoId}
                      onChange={(event) => setVeiculoId(Number(event.target.value))}
                      disabled={!clienteId}
                      className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60"
                    >
                      <option value={0}>Selecione um veiculo</option>
                      {veiculosDoCliente.map((veiculo) => (
                        <option key={veiculo.id} value={veiculo.id}>
                          {veiculo.placa} - {veiculo.marca} {veiculo.modelo}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <div className="p-4 bg-muted rounded-lg">
                <h4 className="mb-3 text-primary">Selecionado</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Cliente</p>
                    <p>{clienteSelecionado?.nome ?? "Nenhum cliente selecionado"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Telefone</p>
                    <p>{clienteSelecionado?.telefone || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Veiculo</p>
                    <p>
                      {veiculoSelecionado
                        ? `${veiculoSelecionado.marca} ${veiculoSelecionado.modelo}`
                        : "Nenhum veiculo selecionado"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Placa</p>
                    <p>{veiculoSelecionado?.placa ?? "-"}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <h3 className="text-primary">Servicos</h3>
              <div className="space-y-2">
                {servicosPadrao.map((servico) => (
                  <label
                    key={servico.id}
                    className="flex items-center justify-between p-4 bg-muted rounded-lg hover:bg-secondary transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={servicosSelecionados.includes(servico.id)}
                        onChange={() => toggleServico(servico.id)}
                        className="w-5 h-5 rounded border-border"
                      />
                      <span>{servico.nome}</span>
                    </div>
                    <span className="text-primary">{formatCurrency(servico.preco)}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-primary">Produtos</h3>
                <button
                  onClick={() => setShowProdutoModal(true)}
                  className="px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors flex items-center gap-2"
                >
                  <Plus size={20} />
                  Adicionar Produto
                </button>
              </div>

              {produtosSelecionados.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  Nenhum produto adicionado
                </div>
              ) : (
                <div className="space-y-2">
                  {produtosSelecionados.map((item) => {
                    const produto = produtosEstoque.find((produtoItem) => produtoItem.id === item.id);
                    if (!produto) return null;

                    return (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-4 bg-muted rounded-lg"
                      >
                        <div>
                          <p>{produto.nome}</p>
                          <p className="text-sm text-muted-foreground">
                            Codigo: {produto.codigo}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span>Qtd: {item.quantidade}</span>
                          <span className="text-primary">
                            {formatCurrency(produto.preco * item.quantidade)}
                          </span>
                          <button
                            onClick={() => removeProduto(item.id)}
                            className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                          >
                            <X size={18} className="text-destructive" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <h3 className="text-primary">Detalhes da OS</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block mb-2 text-muted-foreground">
                    Mecanico responsavel
                  </label>
                  <input
                    value={mecanicoResponsavel}
                    onChange={(event) => setMecanicoResponsavel(event.target.value)}
                    placeholder="Nome do mecanico"
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-muted-foreground">
                    Data prometida
                  </label>
                  <input
                    type="date"
                    value={dataPrometida}
                    onChange={(event) => setDataPrometida(event.target.value)}
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-muted-foreground">Status</label>
                  <select
                    value={status}
                    onChange={(event) => setStatus(event.target.value)}
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="Aberta">Aberta</option>
                    <option value="Em andamento">Em andamento</option>
                    <option value="Aguardando pecas">Aguardando pecas</option>
                    <option value="Aguardando aprovacao">Aguardando aprovacao</option>
                    <option value="Concluida">Concluida</option>
                  </select>
                </div>
              </div>
              <textarea
                rows={5}
                value={observacoes}
                onChange={(event) => setObservacoes(event.target.value)}
                placeholder="Detalhes adicionais sobre o servico..."
                className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-6">
              <h3 className="text-primary">Resumo da Ordem de Servico</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="mb-2 text-primary">Cliente</h4>
                    <p>{clienteSelecionado?.nome ?? "-"}</p>
                    <p className="text-sm text-muted-foreground">
                      {veiculoSelecionado
                        ? `${veiculoSelecionado.modelo} - ${veiculoSelecionado.placa}`
                        : "-"}
                    </p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="mb-2 text-primary">Servicos</h4>
                    {servicosSelecionados.length === 0 ? (
                      <p className="text-sm text-muted-foreground">Nenhum servico selecionado</p>
                    ) : (
                      servicosSelecionados.map((id) => {
                        const servico = servicosPadrao.find((item) => item.id === id);
                        return (
                          <div key={id} className="flex justify-between text-sm mb-1">
                            <span>{servico?.nome}</span>
                            <span>{formatCurrency(servico?.preco ?? 0)}</span>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
                <div className="p-6 bg-accent/10 border-2 border-accent rounded-lg h-fit">
                  <h4 className="mb-4 text-primary">Valor Total</h4>
                  <p className="text-4xl text-accent">
                    {formatCurrency(calcularTotal())}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
          <button
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className="px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>
          {currentStep === 5 ? (
            <button
              onClick={salvarOrdemServico}
              disabled={saving}
              className="px-6 py-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors flex items-center gap-2 disabled:opacity-60"
            >
              <Save size={20} />
              {saving ? "Salvando..." : "Salvar OS"}
            </button>
          ) : (
            <button
              onClick={() => {
                if (!canGoNext()) {
                  setError("Selecione cliente e veiculo para continuar.");
                  return;
                }
                setError("");
                setCurrentStep(Math.min(5, currentStep + 1));
              }}
              className="px-6 py-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors"
            >
              Proxima
            </button>
          )}
        </div>
      </div>

      {showProdutoModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card p-6 rounded-lg max-w-2xl w-full mx-4 max-h-[80vh] overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-primary">Selecionar Produto</h3>
              <button
                onClick={() => setShowProdutoModal(false)}
                className="p-2 hover:bg-secondary rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="relative mb-4">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={20}
              />
              <input
                disabled
                placeholder="Produtos padrao desta primeira versao"
                className="w-full pl-10 pr-4 py-3 bg-input-background border border-border rounded-lg"
              />
            </div>
            <div className="space-y-2">
              {produtosEstoque.map((produto) => (
                <button
                  key={produto.id}
                  className="w-full flex items-center justify-between p-4 bg-muted rounded-lg hover:bg-secondary transition-colors text-left"
                  onClick={() => addProduto(produto.id)}
                >
                  <div>
                    <p>{produto.nome}</p>
                    <p className="text-sm text-muted-foreground">
                      Codigo: {produto.codigo} | Estoque: {produto.estoque}
                    </p>
                  </div>
                  <span className="text-primary">{formatCurrency(produto.preco)}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
