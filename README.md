# PS-Affiliates Web

Portal Next.js do programa de afiliados PS-Mobile. A aplicação está organizada por
responsabilidade: `app/lib` contém o cliente HTTP e a sessão; `app/components`
separa autenticação, navegação e páginas de funcionalidade; `app/page.tsx`
coordena o estado da sessão e as operações da API.

Inclui registo e confirmação de e-mail, início de sessão com 2FA, visão geral,
comissões, pedidos de levantamento e o fluxo administrativo de aprovação,
pagamento e rejeição. A interface e os valores estão apresentados em português.

## Local development

1. Copie `.env.example` para `.env.local`; por omissão, o portal usa a API de teste em `http://102.37.1.46:8082`.
2. Copie `.env.example` para `.env.local`.
3. Execute `npm install` e `npm run dev`.

A interface fica disponível em `http://localhost:3001` (o PS Faturas usa a porta 3000).
A URL base deve incluir `/api/v1`. Para produção, configure
`NEXT_PUBLIC_PS_AFFILIATES_API_BASE_URL` com a URL HTTPS da API publicada. A URL HTTP do VPS
está configurada apenas para testes.
