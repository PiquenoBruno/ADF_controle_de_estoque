
Plano da estrutura do projeto:

```bash
app-stock/
│
├── app/
│   ├── _layout.tsx
│   ├── index.tsx               
│
│   ├── (auth)/
│   │   ├── _layout.tsx
│   │   ├── login.tsx
│   │   └── forgot-password.tsx
│
│   ├── (tabs)/
│   │   ├── _layout.tsx
│   │   ├── dashboard.tsx
│   │   ├── produtos.tsx
│   │   ├── familias.tsx
│   │   ├── cestas.tsx
│   │   └── entregas.tsx
│
│   ├── products/
│   │   ├── create.tsx
│   │   ├── edit/
│   │   │   └── [id].tsx
│   │   └── details/
│   │       └── [id].tsx
│
│   ├── families/
│   │   ├── create.tsx
│   │   ├── edit/
│   │   │   └── [id].tsx
│   │   └── details/
│   │       └── [id].tsx
│
│   ├── baskets/
│   │   ├── create.tsx
│   │   ├── edit/
│   │   │   └── [id].tsx
│   │   └── details/
│   │       └── [id].tsx
│
│   └── deliveries/
│       ├── create.tsx
│       └── details/
│           └── [id].tsx
│
├── src/
│
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Loading.tsx
│   │   │   └── EmptyState.tsx
│   │   │
│   │   ├── ProductCard.tsx
│   │   ├── FamilyCard.tsx
│   │   ├── BasketCard.tsx
│   │   └── DeliveryCard.tsx
│
│   ├── services/
│   │   ├── supabase.ts
│   │   ├── auth.service.ts
│   │   ├── products.service.ts
│   │   ├── families.service.ts
│   │   ├── baskets.service.ts
│   │   └── deliveries.service.ts
│
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useProducts.ts
│   │   ├── useFamilies.ts
│   │   ├── useBaskets.ts
│   │   └── useDeliveries.ts
│
│   ├── providers/
│   │   ├── AuthProvider.tsx
│   │   └── QueryProvider.tsx
│
│   ├── types/
│   │   ├── database.ts
│   │   ├── product.ts
│   │   ├── family.ts
│   │   ├── basket.ts
│   │   └── delivery.ts
│
│   ├── validations/
│   │   ├── product.schema.ts
│   │   ├── family.schema.ts
│   │   ├── basket.schema.ts
│   │   └── login.schema.ts
│
│   ├── constants/
│   │   ├── colors.ts
│   │   └── routes.ts
│
│   └── utils/
│       ├── formatDate.ts
│       ├── formatPhone.ts
│       └── stock.ts
│
├── assets/
│   ├── logo.png
│   ├── icon.png
│   └── splash.png
│
├── .env
├── app.json
├── babel.config.js
├── tsconfig.json
├── package.json
└── eas.json
```