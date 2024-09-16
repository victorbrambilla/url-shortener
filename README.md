# URL Shortener

Este é um projeto de API para encurtamento de URLs, construído com **NestJS** e utilizando **TypeORM** para a persistência de dados. A aplicação possui suporte a **multi-tenant**, o que permite que múltiplos clientes utilizem a mesma instância da API, isolando seus dados de forma segura.

## Tecnologias Utilizadas

- **NestJS**: Framework Node.js progressivo para construção de aplicações escaláveis e eficientes. Utilizado para a criação da API e da arquitetura modular.
- **TypeORM**: ORM para interação com o banco de dados PostgreSQL, facilitando o gerenciamento de entidades e migrações. Utilizado para implementar o modelo **multi-tenant**.
- **PostgreSQL**: Banco de dados relacional utilizado para armazenar as URLs e suas informações relacionadas.
- **Docker**: Utilizado para containerização da aplicação e fácil gerenciamento dos ambientes de desenvolvimento e produção.
- **Swagger**: Documentação automática da API, facilitando o entendimento e a integração com outros serviços.

## Utilizando Node.js 18

Este projeto foi configurado para rodar com **Node.js 18**, garantindo a compatibilidade com as últimas features do JavaScript, otimizações de desempenho e suporte para novas APIs.

## Estrutura base do Projeto

```
src/
├── auth/
│   ├── dto/
│   ├── exceptions/
│   ├── guards/
│   ├── auth.controller.spec.ts
│   ├── auth.controller.ts
│   ├── auth.module.ts
│   ├── auth.service.spec.ts
│   ├── auth.service.ts
│   └── jwt.strategy.ts
├── shared/
├── tenant/
│   ├── middleware/
│   ├── tenant.entity.ts
│   ├── tenant.module.ts
│   └── tenant.service.ts
├── url/
├── user/
│   ├── dto/
│   ├── user.controller.spec.ts
│   ├── user.controller.ts
│   ├── user.entity.ts
│   ├── user.module.ts
│   ├── user.service.spec.ts
│   └── user.service.ts
├── utils/
│   ├── app.controller.spec.ts
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   └── main.ts
└── test/
```

## Requisitos

- Docker
- Docker Compose

## Configuração e Execução

1. Clone o repositório:
   ```
   git clone https://github.com/victorbrambilla/url-shortener.git
   cd <NOME_DO_DIRETORIO>
   ```

2. Configure as variáveis de ambiente:
   Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

   ```
    PORT=3000
    DB_HOST=localhost
    DB_PORT=5432
    DB_USERNAME=postgres
    DB_PASSWORD=postgres
    DB_NAME=url_shortener
    JWT_SECRET=your_secret_key
    BASE_URL=http://localhost:3000
    DEBUG=false
    USE_JSON_LOGGER=false
   ```

   Nota: Ajuste os valores conforme necessário para o seu ambiente.

3. Inicie os contêineres Docker:
   ```
   docker-compose up -d
   ```

   Isso iniciará a API na porta 3000 e o banco de dados PostgreSQL na porta 6432.

4. A API estará disponível em `http://localhost:3000`.

5. A documentação Swagger estará disponível em `http://localhost:3000/swagger`.

## Variáveis de Ambiente

As seguintes variáveis de ambiente são utilizadas:

- `PORT`: Porta em que a aplicação será executada (padrão: 3000)
- `DB_HOST`: Host do banco de dados
- `DB_PORT`: Porta do banco de dados
- `DB_USERNAME`: Usuário do banco de dados
- `DB_PASSWORD`: Senha do banco de dados
- `DB_NAME`: Nome do banco de dados
- `JWT_SECRET`: Chave secreta para geração de tokens JWT
- `BASE_URL`: URL base da aplicação
- `DEBUG`: Ativa o modo de depuração (true/false)
- `USE_JSON_LOGGER`: Utiliza logger em formato JSON (true/false)

## Desenvolvimento

Para desenvolvimento local sem Docker:

1. Instale as dependências:
   ```
   npm install
   ```

2. Configure as variáveis de ambiente no arquivo `.env`.

3. Execute o projeto:
   ```
   npm run start:dev
   ```

## Testes

Execute os testes com:

```
npm run test
```

## Documentação da API

A documentação da API está disponível através do Swagger UI. Após iniciar a aplicação, você pode acessar a documentação em:

```
http://localhost:3000/swagger
```

Esta interface fornece uma visão detalhada de todos os endpoints disponíveis, permitindo também testar as requisições diretamente pelo navegador.

## Funcionalidades

- Autenticação de usuários
- Gerenciamento de inquilinos (tenants)
- Encurtamento de URLs
- Gerenciamento de usuários

## Possíveis Mudanças para Escalar a Aplicação

### 1. **Banco de Dados**

#### **Replicação e Particionamento**
- **Replicação**: Implementar replicação de leitura no PostgreSQL para distribuir a carga de consultas entre várias réplicas e melhorar a escalabilidade. As réplicas de leitura podem ser usadas em conjunto com um balanceador de carga para distribuir as consultas de leitura e otimizar o desempenho.
- **Particionamento de Tabelas**: Dividir grandes tabelas, como a tabela de **URLs**, em várias partições. O particionamento por tenant (multi-tenant) pode ser uma solução eficiente, dividindo os dados dos clientes de forma lógica e melhorando o desempenho em consultas de grande escala.

#### **Auto Scaling no Banco de Dados**
- Considerar a utilização de serviços gerenciados de banco de dados, como **Amazon RDS** ou **Google Cloud SQL**, que oferecem escalabilidade automática com base na carga, backups automáticos e alta disponibilidade.

### 2. **Cache de Requisições**

#### **Redis ou Memcached**
- Implementar um sistema de cache com **Redis** ou **Memcached** para armazenar respostas de redirecionamentos frequentes, reduzindo a necessidade de consultas repetitivas ao banco de dados. Isso pode melhorar drasticamente o tempo de resposta e a capacidade de lidar com um grande número de requisições.

### 3. **Escalabilidade Horizontal**

#### **Containerização com Docker e Orquestração com Kubernetes**
- Migrar a infraestrutura para **Kubernetes** para orquestração e gestão de containers. O Kubernetes oferece escalabilidade automática (horizontal pod autoscaling), onde mais instâncias da API podem ser criadas automaticamente com base na demanda, além de gerenciamento de falhas e balanceamento de carga.
  
#### **Load Balancer**
- Utilizar um **balanceador de carga** para distribuir o tráfego de forma eficiente entre várias instâncias da API. Serviços como **AWS Elastic Load Balancer (ELB)** ou **NGINX** podem ser utilizados para esse propósito, melhorando a disponibilidade e resiliência da aplicação.

### 4. **Desacoplamento de Serviços**

#### **Microserviços**
- Para uma escalabilidade ainda maior, a aplicação pode ser refatorada para uma arquitetura de **microserviços**. Cada parte da aplicação, como a lógica de encurtamento de URLs, gestão de tenants, e métricas, pode ser separada em microserviços independentes. Isso permite escalar individualmente partes da aplicação com base na demanda.

#### **Mensageria Assíncrona (Fila)**
- Implementar um sistema de mensagens assíncronas, como **RabbitMQ** ou **Amazon SQS**, para gerenciar processos demorados ou com grande volume, como o processamento de métricas e logs, redirecionamentos massivos e outras operações. A mensageria desacopla processos e melhora a resiliência da aplicação.

### 5. **Monitoramento e Observabilidade**

#### **Prometheus e Grafana**
- O **Prometheus** pode ser configurado para monitorar mais métricas detalhadas, como uso de CPU, memória, latência e taxa de erro por rota. **Grafana** pode ser utilizado para visualizar e configurar alertas proativos com base nessas métricas.

#### **Logs Centralizados**
- Usar uma solução de logs centralizados, como **ELK Stack (Elasticsearch, Logstash, Kibana)** ou **AWS CloudWatch**, para armazenar e analisar logs. Isso ajudará a identificar gargalos de desempenho e falhas na aplicação em tempo real.

### 6. **Serviço de DNS e CDN**

#### **Cloudflare ou AWS CloudFront**
- Utilizar um serviço de **CDN (Content Delivery Network)** como **Cloudflare** ou **AWS CloudFront** para otimizar a entrega de conteúdo estático e reduzir a latência para usuários em diferentes partes do mundo. O Cloudflare também pode atuar como um proxy reverso e fornecer proteção contra ataques DDoS.

#### **DNS Gerenciado**
- Usar um serviço de DNS gerenciado como **Route 53** da AWS ou o DNS do **Cloudflare** para roteamento global e alta disponibilidade, garantindo que o serviço esteja acessível com baixa latência e redirecionando o tráfego para instâncias geograficamente próximas aos usuários.

### 7. **Segurança**

#### **Rate Limiting**
- Implementar **Rate Limiting** para limitar o número de requisições que cada IP ou cliente pode fazer em um determinado intervalo de tempo. Isso ajuda a prevenir abuso e protege a API contra ataques de negação de serviço (DoS).

#### **Proteção contra DDoS**
- Utilizar serviços gerenciados como **AWS Shield** ou **Cloudflare** para proteger a aplicação de ataques DDoS e garantir alta disponibilidade mesmo sob cargas elevadas.

## Contribuição

Para contribuir com o projeto, por favor, siga estas etapas:

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Faça commit das suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Faça push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request
 
