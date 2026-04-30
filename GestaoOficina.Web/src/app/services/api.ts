const API_URL = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Erro ${response.status} ao chamar a API`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export type Cliente = {
  id: number;
  nome: string;
  cpfCnpj: string;
  telefone: string;
  email: string;
  endereco: string;
  dataCadastro: string;
  ativo: boolean;
  quantidadeVeiculos: number;
};

export type ClienteRequest = {
  nome: string;
  cpfCnpj: string;
  telefone: string;
  email: string;
  endereco: string;
};

export type Veiculo = {
  id: number;
  placa: string;
  modelo: string;
  marca: string;
  cor: string;
  ano: number;
  kmAtual: number;
  clienteId: number;
  nomeCliente: string;
};

export type VeiculoRequest = {
  placa: string;
  modelo: string;
  marca: string;
  cor: string;
  ano: number;
  kmAtual: number;
  clienteId: number;
};

export type OrdemServico = {
  id: number;
  numero: string;
  clienteId: number;
  nomeCliente: string;
  veiculoId: number;
  veiculoDescricao: string;
  placa: string;
  mecanicoResponsavel: string;
  dataAbertura: string;
  dataPrometida: string | null;
  observacoes: string;
  valorTotal: number;
  status: string;
};

export type OrdemServicoRequest = {
  clienteId: number;
  veiculoId: number;
  mecanicoResponsavel: string;
  dataPrometida: string | null;
  observacoes: string;
  valorTotal: number;
  status: string;
};

export const clientesApi = {
  list: () => request<Cliente[]>("/api/Cliente"),
  create: (cliente: ClienteRequest) =>
    request<Cliente>("/api/Cliente", {
      method: "POST",
      body: JSON.stringify(cliente),
    }),
  update: (id: number, cliente: ClienteRequest) =>
    request<void>(`/api/Cliente/${id}`, {
      method: "PUT",
      body: JSON.stringify(cliente),
    }),
  remove: (id: number) =>
    request<void>(`/api/Cliente/${id}`, {
      method: "DELETE",
    }),
};

export const veiculosApi = {
  list: () => request<Veiculo[]>("/api/Veiculo"),
  create: (veiculo: VeiculoRequest) =>
    request<Veiculo>("/api/Veiculo", {
      method: "POST",
      body: JSON.stringify(veiculo),
    }),
  update: (id: number, veiculo: VeiculoRequest) =>
    request<void>(`/api/Veiculo/${id}`, {
      method: "PUT",
      body: JSON.stringify(veiculo),
    }),
  remove: (id: number) =>
    request<void>(`/api/Veiculo/${id}`, {
      method: "DELETE",
    }),
};

export const ordensServicoApi = {
  list: () => request<OrdemServico[]>("/api/OrdemServico"),
  create: (ordemServico: OrdemServicoRequest) =>
    request<OrdemServico>("/api/OrdemServico", {
      method: "POST",
      body: JSON.stringify(ordemServico),
    }),
  update: (id: number, ordemServico: OrdemServicoRequest) =>
    request<void>(`/api/OrdemServico/${id}`, {
      method: "PUT",
      body: JSON.stringify(ordemServico),
    }),
  remove: (id: number) =>
    request<void>(`/api/OrdemServico/${id}`, {
      method: "DELETE",
    }),
};
