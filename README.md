🚀 Sistema de Gestão de Vendas

Aplicação web completa para gerenciamento de vendas com CI/CD automatizado

🌐 Links de Acesso

🖥️ Aplicação Frontend: https://sales-management-frontend.onrender.com
⚙️ API Backend: https://sales-management-backend.onrender.com
📊 Health Check: https://sales-management-backend.onrender.com/health
🔧 GitHub Actions: https://github.com/vitorarj/sales-manager/actions

📋 Sobre o Projeto
Sistema completo de gestão de vendas desenvolvido para atender às necessidades de empresas no controle de pedidos, clientes e produtos. A aplicação implementa diferentes perfis de usuário com permissões específicas e oferece relatórios gerenciais detalhados.
🎯 Principais Funcionalidades

🔐 Autenticação JWT com diferentes perfis de usuário
👥 Gestão de Usuários (Admin, Cliente, Vendedor)
📦 Controle de Produtos e estoque
🛒 Gestão de Pedidos com workflow completo
📊 Dashboard Executivo com métricas em tempo real
📈 Relatórios Gerenciais detalhados
🔄 Sistema de Aprovação de pedidos
🌐 Deploy Automatizado com CI/CD

🏗️ Arquitetura e Tecnologias
Backend

Java 17 + Spring Boot 3.5.0
PostgreSQL 15 (Database)
Spring Data JPA + Hibernate
JWT Authentication
Docker containerization
Gradle build system

Frontend

React 18 + TypeScript
Vite build tool
Tailwind CSS styling
Lucide React icons
Axios HTTP client
React Router navigation

DevOps & Deploy

GitHub Actions CI/CD
Docker multi-stage builds
Render cloud hosting
PostgreSQL managed database
Nginx web server

🚀 Pipeline CI/CD
Etapas Implementadas

🔨 Build & Test

Compilação Java com Gradle
Build React com Vite/Yarn
Testes unitários automatizados
Validação TypeScript


🐳 Dockerização

Multi-stage builds otimizados
Images para backend e frontend
Push para GitHub Container Registry
Cache layers para performance


🌐 Deploy Automático

Deploy automático no Render
Health checks pós-deploy
Rollback automático em falhas
Notificações de status



⚡ Triggers

Push na main: Deploy completo
Pull Requests: Testes e validação
Schedules: Health checks periódicos

👥 Perfis de Usuário
🔧 Administrador

Acesso total ao sistema
Gestão de usuários
Visualização de todos os relatórios
Aprovação de pedidos

👤 Cliente

Visualização do catálogo de produtos
Criação de pedidos
Acompanhamento de status
Histórico de compras

💼 Vendedor

Gestão de estoque
Aprovação/rejeição de pedidos
Relatórios de vendas
Controle de produtos

📊 Dashboard e Relatórios
Métricas Principais

Total de usuários, produtos e pedidos
Valor total e pendente das vendas
Produtos com estoque baixo
Pedidos por status
Top clientes e produtos
Tendências de vendas

Relatórios Disponíveis

📈 Dashboard Executivo: Visão geral das métricas
🏆 Top Clientes: Clientes mais ativos
📦 Top Produtos: Produtos mais vendidos
⚠️ Estoque Baixo: Produtos que precisam reposição
📊 Tendência de Vendas: Análise temporal
🔍 Status do Sistema: Health checks e estatísticas

🛠️ Como Executar Localmente
Pré-requisitos

Java 17+
Node.js 20+
PostgreSQL 15+
Docker (opcional)

1. Clonar o Repositório
bashgit clone https://github.com/vitorarj/sales-manager.git
cd sales-manager
2. Configurar Database
bash# PostgreSQL local
createdb salesdb

# Ou usar Docker
docker run --name salesdb \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=salesdb \
  -p 5432:5432 \
  -d postgres:15
3. Executar Backend
bashcd backend
./gradlew bootRun
4. Executar Frontend
bashcd frontend
yarn install
yarn dev
5. Acessar Aplicação

Frontend: http://localhost:3000
Backend: http://localhost:8080
API Docs: http://localhost:8080/api

🐳 Executar com Docker
Desenvolvimento
bashdocker-compose up -d
Produção
bashdocker-compose -f docker-compose.prod.yml up -d
🧪 Como Testar
1. Dados de Demonstração
bash# Criar usuários, produtos e pedidos de exemplo
curl https://sales-management-backend.onrender.com/setup-demo
2. Usuários de Teste
EmailSenhaPerfiladmin@sistema.com123456ADMINmaria@email.com123456CLIENTEjoao@email.com123456VENDEDOR
3. Fluxo de Teste

Login como cliente → Criar pedido
Login como vendedor → Aprovar pedido
Login como admin → Visualizar relatórios

4. API Endpoints
bash# Health check
GET /health

# Dashboard
GET /api/reports/dashboard

# Usuários para login
GET /api/auth/users-for-login

# Login test
GET /api/auth/login-test/{email}
📁 Estrutura do Projeto
sales-manager/
├── .github/
│   └── workflows/
│       └── ci-cd.yml              # Pipeline GitHub Actions
├── backend/
│   ├── src/main/java/
│   │   └── com/salesmanagement/
│   │       ├── controller/        # REST Controllers
│   │       ├── entity/            # JPA Entities
│   │       ├── repository/        # Data Repositories
│   │       └── security/          # JWT Security
│   ├── Dockerfile                 # Backend container
│   └── build.gradle              # Dependencies
├── frontend/
│   ├── src/
│   │   ├── components/           # React Components
│   │   ├── services/             # API Services
│   │   └── types/                # TypeScript Types
│   ├── Dockerfile                # Frontend container
│   └── package.json              # Dependencies
├── docker-compose.yml            # Local development
├── docker-compose.prod.yml       # Production deploy
└── README.md                     # Documentation
🔒 Segurança Implementada

🔐 JWT Authentication: Tokens seguros com expiração
🛡️ Role-based Access: Controle por perfil de usuário
🔒 Password Hashing: Senhas criptografadas
🌐 CORS Configuration: Políticas de origem cruzada
🚫 SQL Injection Prevention: Queries parametrizadas
📝 Input Validation: Validação de dados de entrada

📈 Métricas e Monitoramento

Health Checks automáticos
Logs estruturados com níveis apropriados
Monitoring de performance do database
Error tracking e alertas
Uptime monitoring via GitHub Actions

🌟 Diferenciais Implementados
✅ Requisitos Obrigatórios Atendidos

✅ Autenticação JWT com perfis específicos
✅ Gestão completa de pedidos com status
✅ Visão gerencial com relatórios e gráficos
✅ Pipeline CI/CD com GitHub Actions
✅ Dockerização funcional
✅ Deploy automático na nuvem

🚀 Extras Implementados

✅ Testes automatizados na pipeline
✅ Health checks e monitoramento
✅ Multi-stage Docker builds otimizados
✅ Logs estruturados e debugging
✅ Dashboard executivo completo
✅ API documentada e testável
✅ Cache de dependências na CI/CD
✅ Rollback automático em falhas

🎯 Workflow de Pedidos
mermaidgraph TD
    A[Cliente cria pedido] --> B[PENDENTE]
    B --> C{Vendedor aprova?}
    C -->|Sim| D[APROVADO]
    C -->|Não| E[REJEITADO]
    D --> F[FINALIZADO]
    E --> G[Fim]
    F --> G[Fim]
🔄 Estados dos Pedidos

🟡 PENDENTE: Aguardando aprovação
🟢 APROVADO: Aprovado pelo vendedor
🔴 REJEITADO: Rejeitado pelo vendedor
✅ FINALIZADO: Pedido completado
❌ CANCELADO: Pedido cancelado

📄 Licença
Este projeto foi desenvolvido como desafio técnico e está disponível para fins educacionais e demonstração.

🏆 Resultados Alcançados

✅ Sistema completo funcionando em produção
✅ Pipeline CI/CD automatizada e robusta
✅ Deploy na nuvem com alta disponibilidade
✅ Testes automatizados garantindo qualidade
✅ Documentação completa e código limpo
✅ Arquitetura escalável e bem estruturada

🚀 Acesse o sistema em funcionamento: https://sales-management-frontend.onrender.com
