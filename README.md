# URL Shortener

Este é um projeto de API para encurtamento de URLs, construído com **NestJS** e utilizando **TypeORM** para a persistência de dados. A aplicação possui suporte a **multi-tenant**, o que permite que múltiplos clientes utilizem a mesma instância da API, isolando seus dados de forma segura.

## Tecnologias Utilizadas

- **NestJS**: Framework Node.js progressivo para construção de aplicações escaláveis e eficientes. Utilizado para a criação da API e da arquitetura modular.
- **TypeORM**: ORM para interação com o banco de dados PostgreSQL, facilitando o gerenciamento de entidades e migrações. Utilizado para implementar o modelo **multi-tenant**.
- **PostgreSQL**: Banco de dados relacional utilizado para armazenar as URLs e suas informações relacionadas.
- **Docker**: Utilizado para containerização da aplicação e fácil gerenciamento dos ambientes de desenvolvimento e produção.
- **Swagger**: Documentação automática da API, facilitando o entendimento e a integração com outros serviços.


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

## Contribuição

Para contribuir com o projeto, por favor, siga estas etapas:

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Faça commit das suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Faça push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request
 
