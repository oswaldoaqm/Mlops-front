# MLOps Lite — Frontend v2.0

Dashboard para el sistema MLOps Lite con 5 microservicios en AWS.

## Stack

React 18 + TypeScript + Vite + Tailwind CSS

## Setup local

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar entorno
cp .env.example .env
# El .env.example ya tiene la URL del API Gateway lista

# 3. Levantar dev server
npm run dev
```

## Variables de entorno

| Variable | Descripción |
|---|---|
| `VITE_API_URL` | URL base del API Gateway (sin slash final) |

El `.env` **nunca** debe subirse al repositorio. Solo `.env.example`.

## Deploy en AWS Amplify

1. Conectar el repo en Amplify Console
2. En **Environment variables** agregar:
   - `VITE_API_URL` = `https://91ka2ysb93.execute-api.us-east-1.amazonaws.com`
3. Amplify detecta el `amplify.yml` automáticamente y hace el build

## Microservicios consumidos

| Tab | Microservicio | Métodos |
|---|---|---|
| Dashboard | Ms3 stats, health checks | GET |
| Features | Ms1 datasets + features | GET, POST, PUT, DELETE |
| Models | Ms2 modelos + métricas | GET, POST, PUT, DELETE |
| Predict | Ms4 gateway | POST (single + batch) |
| Logs | Ms3 predlogs | GET, DELETE |
| Analytics | Ms5 Athena queries | GET (4 endpoints) |

## API Gateway base URL

```
https://91ka2ysb93.execute-api.us-east-1.amazonaws.com
```

Rutas: `/features`, `/models`, `/predlogs`, `/gateway`, `/monitoring`
