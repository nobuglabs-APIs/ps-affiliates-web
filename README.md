# Nobug Rewards

Portal Next.js da plataforma Nobug Rewards — recompensas e ecossistema de parceiros. A aplicação está organizada por
responsabilidade: `app/lib` contém o cliente HTTP e a sessão; `app/components`
separa autenticação, navegação e páginas de funcionalidade; `app/page.tsx`
coordena o estado da sessão e as operações da API.

Inclui registo e confirmação de e-mail, login com Google/Facebook e 2FA, visão
geral, comissões, levantamentos e notificações. A gestão de pagamentos está num
repositório Git independente em `../ps-affiliates-admin`.

## Local development

1. Copie `.env.example` para `.env.local`.
2. Configure `NEXT_PUBLIC_PS_AFFILIATES_API_BASE_URL` com a URL da API, incluindo `/api/v1`.
3. Configure `NEXT_PUBLIC_GOOGLE_CLIENT_ID` e `NEXT_PUBLIC_FACEBOOK_APP_ID` para ativar os botões sociais.
4. Execute `npm install` e `npm run dev`.

O portal de afiliados fica disponível em `http://localhost:3001`. A administração
fica em `http://localhost:3002`; execute os mesmos passos no repositório
`frontends/ps-affiliates-admin`. Configure o CORS da API com as origens dos dois
frontends. Em produção, use URLs HTTPS e mantenha o App Secret do Facebook
exclusivamente no ambiente da API.

O portal e a administração incluem manifest e service worker para instalação
como PWA. O service worker não intercepta pedidos nem guarda respostas privadas
da API. As páginas do painel são marcadas como `noindex`.
