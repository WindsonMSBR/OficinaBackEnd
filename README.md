# Gestao Oficina

Sistema de gestao para oficina mecanica, com API em .NET, banco PostgreSQL/Supabase e front-end em React + Vite.

O projeto permite cadastrar clientes, veiculos e ordens de servico, conectando a interface visual ao back-end e persistindo os dados no banco.

## Visao Geral

```text
GestaoOficina/
  GestaoOficina.API/              API REST .NET
  GestaoOficina.Application/      Camada de aplicacao
  GestaoOficina.Communication/    DTOs de entrada e saida
  GestaoOficina.Domain/           Entidades e interfaces
  GestaoOficina.Infrastructure/   EF Core, DbContext, repositorios e migrations
  GestaoOficina.Web/              Front-end React + Vite
```

## Funcionalidades

- Cadastro, edicao, listagem e exclusao logica de clientes.
- Cadastro, edicao, listagem e exclusao de veiculos.
- Criacao, listagem e exclusao de ordens de servico.
- Bloqueio de exclusao de veiculo com OS vinculada.
- Validacoes para evitar erros internos no banco.
- Dashboard com indicadores basicos vindos da API.
- Integracao front/back via proxy do Vite em `/api`.
- Listagens com busca e paginacao no servidor.

## Tecnologias

**Back-end**

- .NET 9
- ASP.NET Core Web API
- Entity Framework Core
- Npgsql/PostgreSQL
- Supabase
- Swagger

**Front-end**

- React
- Vite
- TypeScript
- Tailwind CSS
- Lucide React
- Recharts

## Requisitos

Antes de rodar, instale:

- .NET SDK 9
- Node.js
- npm
- Acesso ao banco PostgreSQL/Supabase configurado no `appsettings.json`

Para conferir:

```powershell
dotnet --version
node --version
npm --version
```

## Configuracao do Banco

A string de conexao fica em:

```text
GestaoOficina.API/appsettings.json
```

Exemplo do formato:

```json
{
  "ConnectionStrings": {
    "PostgreSQLConnection": "Host=...;Port=6543;Database=postgres;Username=...;Password=...;SSL Mode=Require;Trust Server Certificate=true;Pooling=false"
  }
}
```

Observacao importante: usando o pooler da Supabase na porta `6543`, o projeto esta com `Pooling=false` para evitar travamentos nas migrations e conexoes do EF Core.

## Como Rodar o Back-end

Na raiz do projeto:

```powershell
dotnet restore GestaoOficina.API\GestaoOficina.API.csproj
dotnet run --project GestaoOficina.API\GestaoOficina.API.csproj --launch-profile http
```

A API deve subir em:

```text
http://localhost:5109
```

Swagger:

```text
http://localhost:5109/swagger
```

## Como Rodar o Front-end

Em outro terminal:

```powershell
cd GestaoOficina.Web
npm install
npm run dev -- --host 127.0.0.1 --port 5173
```

Abra:

```text
http://127.0.0.1:5173
```

O front usa proxy do Vite para encaminhar chamadas:

```text
/api -> http://localhost:5109
```

Por isso, no navegador o front pode chamar `/api/Cliente`, `/api/Veiculo` e `/api/OrdemServico`.

## Fluxo de Uso

1. Abra o front-end.
2. Acesse **Clientes** e cadastre um cliente.
3. Acesse **Veiculos** e cadastre um veiculo vinculado ao cliente.
4. Acesse **Ordens de Servico**.
5. Clique em **Nova OS**.
6. Selecione cliente, veiculo, servicos, produtos e detalhes.
7. Salve a OS.

## Endpoints Principais

### Clientes

```http
GET    /api/Cliente
GET    /api/Cliente/paged?page=1&pageSize=20&search=texto
GET    /api/Cliente/{id}
GET    /api/Cliente/buscar/{nome}
POST   /api/Cliente
PUT    /api/Cliente/{id}
DELETE /api/Cliente/{id}
```

### Veiculos

```http
GET    /api/Veiculo
GET    /api/Veiculo/paged?page=1&pageSize=20&search=texto
GET    /api/Veiculo/{id}
GET    /api/Veiculo/cliente/{clienteId}
POST   /api/Veiculo
PUT    /api/Veiculo/{id}
DELETE /api/Veiculo/{id}
```

### Ordens de Servico

```http
GET    /api/OrdemServico
GET    /api/OrdemServico/paged?page=1&pageSize=20&search=texto&status=Aberta
GET    /api/OrdemServico/{id}
GET    /api/OrdemServico/cliente/{clienteId}
POST   /api/OrdemServico
PUT    /api/OrdemServico/{id}
DELETE /api/OrdemServico/{id}
```

## Migrations

As migrations ficam em:

```text
GestaoOficina.Infrastructure/Migrations
```

As migrations automaticas no startup ficam desativadas por padrao para a API iniciar mais rapido.

Para aplicar migrations:

```powershell
dotnet ef database update --project GestaoOficina.Infrastructure\GestaoOficina.Infrastructure.csproj
```

Para criar uma nova migration:

```powershell
dotnet ef migrations add NomeDaMigration --project GestaoOficina.Infrastructure\GestaoOficina.Infrastructure.csproj
```

## Regras Importantes

- Cliente excluido fica inativo e nao aparece mais na listagem principal.
- Veiculo com OS vinculada nao pode ser excluido.
- CPF/CNPJ duplicado retorna `409 Conflict`.
- Placa duplicada retorna `409 Conflict`.
- Campos acima do tamanho permitido retornam `400 Bad Request`.
- Datas sao tratadas em UTC para funcionar corretamente com PostgreSQL.
- Listagens principais usam paginacao para evitar carregar muitos registros de uma vez.
- Migrations devem ser aplicadas manualmente com `dotnet ef database update`.

## Erros Comuns

### A API nao sobe ou fica parada ao conectar no banco

Confira se a string de conexao tem:

```text
Pooling=false
```

### O front nao encontra a API

Confira se a API esta rodando em:

```text
http://localhost:5109
```

E se o front esta rodando em:

```text
http://127.0.0.1:5173
```

### Erro ao excluir veiculo

Se o veiculo tem ordem de servico vinculada, a API retorna:

```text
409 Conflict
```

Nesse caso, exclua a OS vinculada antes ou implemente uma regra de inativacao de veiculo.

## Comandos Uteis

Build da API:

```powershell
dotnet build GestaoOficina.API\GestaoOficina.API.csproj
```

Build do front:

```powershell
cd GestaoOficina.Web
npm run build
```

Rodar API:

```powershell
dotnet run --project GestaoOficina.API\GestaoOficina.API.csproj --launch-profile http
```

Rodar front:

```powershell
cd GestaoOficina.Web
npm run dev -- --host 127.0.0.1 --port 5173
```

## Status Atual

O sistema ja possui integracao funcional entre front-end, API e banco para:

- Clientes
- Veiculos
- Ordens de servico
- Dashboard com dados da API

Proximos passos sugeridos:

- Inativar veiculos em vez de excluir definitivamente.
- Criar cadastro real de produtos/estoque.
- Criar cadastro real de servicos.
- Melhorar agenda e financeiro com persistencia no banco.
- Adicionar autenticacao de usuario.
