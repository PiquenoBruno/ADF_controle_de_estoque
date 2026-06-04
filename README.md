# 🧺 CESTA MANAGER V3

Sistema inteligente de gestão de cestas básicas, famílias e logística social  

📱 Mobile App (Expo) • 🔥 Supabase • ⚡ Tempo real • 📊 Gestão completa  

---

## 🚀 O que é o ADF Cesta Manager?

O **CESTA MANAGER V3** é uma plataforma mobile criada para automatizar e organizar toda a operação de distribuição de cestas básicas, incluindo:

- Controle de estoque de alimentos  
- Cadastro de famílias beneficiárias  
- Montagem inteligente de cestas  
- Registro de entregas  
- Gestão de usuários do sistema  
- Dashboard operacional  

💡 Pensado para ONGs, projetos sociais e iniciativas de assistência comunitária.  

---

## ✨ Diferenciais do Sistema

- ⚡ Arquitetura modular por domínio  
- 🔥 Integração completa com Supabase (Auth + DB + API)  
- 🧠 Hooks inteligentes por módulo (Users, Products, Families…)  
- 📦 Controle de estoque em tempo real  
- 🧺 Montagem dinâmica de cestas  
- 🚚 Logística de entregas rastreável  
- 📊 Base preparada para dashboard analítico  

---

## 🧱 Stack Tecnológica

- ⚛️ React Native (Expo Router)  
- 🟦 TypeScript  
- 🔥 Supabase (Backend completo serverless)  
- 🧭 File-based routing  
- 🧠 Custom Hooks Architecture  
- 🎨 StyleSheet (UI leve e performática)  

---

## 📁 Estrutura do Projeto

```bash
CESTA_MANAGER_V3
│
├── app
│   ├── (auth)
│   ├── (drawer)
│   ├── menu
│   │   ├── users.tsx
│   │   └── _layout.tsx
│   │
│   ├── baskets
│   │   ├── create.tsx
│   │   ├── edit.tsx
│   │   ├── details.tsx
│   │   └── index.tsx
│   │
│   ├── deliveries
│   │   ├── create.tsx
│   │   ├── details.tsx
│   │   └── index.tsx
│   │
│   ├── families
│   │   ├── create.tsx
│   │   ├── edit.tsx
│   │   ├── details.tsx
│   │   └── index.tsx
│   │
│   ├── products
│   │   ├── create.tsx
│   │   ├── edit.tsx
│   │   ├── details.tsx
│   │   └── index.tsx
│   │
│   └── users
│       ├── createUsers.tsx
│       ├── editUsers.tsx
│       ├── _layout.tsx
│       └── index.tsx
│
├── app-example
├── assets
├── node_modules
│
├── src
│   ├── components
│   ├── hooks
│   │   ├── useAuth.ts
│   │   ├── useBasketItems.ts
│   │   ├── useBaskets.ts
│   │   ├── useDashboard.ts
│   │   ├── useDeliveries.ts
│   │   ├── useFamilies.ts
│   │   ├── useProducts.ts
│   │   └── useUsers.ts
│   │
│   ├── providers
│   ├── services
│   │   ├── auth.service.ts
│   │   ├── basketItems.service.ts
│   │   ├── baskets.service.ts
│   │   ├── dashboard.service.ts
│   │   ├── delivery-builder.service.ts
│   │   ├── deliveries.service.ts
│   │   ├── families.service.ts
│   │   ├── product.service.ts
│   │   ├── stock.service.ts
│   │   ├── supabase.ts
│   │   └── users.service.ts
│   │
│   ├── style
│   │   └── style.js
│   │
│   └── types
│       ├── basket.ts
│       ├── basketItem.ts
│       ├── delivery.ts
│       ├── family.ts
│       └── product.ts
│
├── .env
└── .gitignore

```

Este sistema foi projetado como um MVP escalável, podendo evoluir para:

SaaS para ONGs

Plataforma de assistência social

Controle logístico completo de doações

👨‍💻 Desenvolvedor
Bruno Torres

