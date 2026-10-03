# Seven-Eleven Back AWS

Backend en AWS CDK para el juego Seven-Eleven.

Expone un backend serverless con:
- API Gateway WebSocket para la comunicación en tiempo real
- Lambdas para gestionar el flujo de partida
- DynamoDB para almacenar el estado de las partidas y conexiones

## Requisitos

- Node.js 18+
- npm
- AWS CLI configurado con credenciales válidas
- CDK v2 (se instala como dependencia de desarrollo)

## Instalación

```bash
npm install
```

## Comandos útiles

- **Build TypeScript**:
  ```bash
  npm run build
  ```

- **Ver cambios de infraestructura (synth)**:
  ```bash
  npm run synth
  ```

- **Deploy de la infraestructura**:
  ```bash
  npm run deploy
  ```

- **Tests**:
  ```bash
  npm test
  ```

## Estructura básica

- `src/`: código fuente de las stacks de CDK y lambdas
- `cdk.out/`: artefactos generados por CDK (ignorado en git)
- `tsconfig.json`: configuración de TypeScript

## Notas

- No subas ficheros `.env` ni secretos al repositorio.
- Revisa el fichero `.gitignore` para ver qué se excluye del control de versiones.
