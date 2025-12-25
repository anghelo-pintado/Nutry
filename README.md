# Calculadora Nutricional

Una aplicación web diseñada para calcular requerimientos nutricionales, gasto energético y generar una distribución detallada de macronutrientes para pacientes. Esta herramienta facilita la creación de planes nutricionales personalizados mediante la integración con flujos de automatización en n8n.

## Características Principales

### 1. Gestión de Datos del Paciente

- Entrada de datos básicos: Nombre, Edad, Peso, Estatura y Género.
- Validación de campos requeridos para cálculos precisos.

### 2. Cálculo de Energía y Metabolismo

- **Tasa Metabólica Basal (TMB)**: Soporte para múltiples fórmulas predictivas adaptadas a diferentes poblaciones:
  - **Mifflin-St Jeor** (Estándar de oro actual)
  - **Harris-Benedict (Revisada)**
  - **FAO/OMS**
  - **Valencia** (Específica para población Mexicana/Latina)
- **Gasto Energético Total (GET)**: Cálculo basado en el Factor de Actividad Física (desde Sedentario hasta Muy Activo).

### 3. Definición de Objetivos Calóricos

- **Ajuste Automático**: Selección rápida de objetivos predefinidos (Déficit, Mantenimiento, Superávit) con ajustes porcentuales (-20% a +20%).
- **Ajuste Manual**: Opción para sobrescribir el cálculo automático e ingresar una meta calórica específica.

### 4. Distribución de Macronutrientes

- Configuración flexible de porcentajes para Proteínas, Grasas y Carbohidratos.
- Cálculo automático de gramos totales por macronutriente.
- Cálculo de gramos por kilogramo de peso (g/kg), útil para nutrición deportiva.
- Validación en tiempo real de la suma de porcentajes (debe ser 100%).

### 5. Integración y Automatización

- Envío seguro de los datos calculados a un webhook de **n8n** mediante una función serverless.
- Campo para observaciones y preferencias dietéticas (número de comidas, restricciones, etc.).

## Tecnologías Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript (ES6 Modules).
- **Backend**: Node.js (Serverless Function) para el proxy de API.
- **Diseño**: CSS Grid/Flexbox, Diseño responsivo y tipografía Inter (Google Fonts).

## Estructura del Proyecto

```
/
├── api/                # Funciones Serverless (Backend)
│   └── enviar-n8n.js   # Proxy seguro para enviar datos al webhook
├── src/                # Código fuente del Frontend
│   ├── css/            # Estilos
│   ├── js/             # Lógica de la aplicación
│   │   ├── api.js          # Llamadas al backend
│   │   ├── calculations.js # Lógica matemática (TMB, Macros, etc.)
│   │   ├── formState.js    # Manejo del estado del formulario
│   │   ├── main.js         # Punto de entrada y eventos
│   │   └── ui.js           # Manipulación del DOM
│   └── pages/          # Páginas HTML
└── README.md           # Documentación
```

## Configuración y Uso Local

Este proyecto está diseñado para funcionar en entornos que soporten funciones serverless (como Vercel) y alojamiento de sitios estáticos.

### Requisitos Previos

- Node.js instalado (para desarrollo local o despliegue).

### Ejecución Local

Para ejecutar la aplicación localmente, necesitas servir los archivos estáticos y configurar la variable de entorno para la función serverless.

1. **Clonar el repositorio**

2. **Configurar Variables de Entorno**
   La función `api/enviar-n8n.js` requiere la URL del webhook de n8n.

   Crea un archivo `.env` (o configura en tu entorno de despliegue):

   ```
   N8N_WEBHOOK_URL=https://tu-instancia-n8n.com/webhook/...
   ```

3. **Despliegue**
   - **Vercel**: El proyecto detectará automáticamente la carpeta `api/` como funciones serverless. Asegúrate de configurar la variable de entorno `N8N_WEBHOOK_URL` en el panel de Vercel.

## Flujo de Datos

1. El nutricionista ingresa los datos en la interfaz web.
2. La aplicación calcula los requerimientos en tiempo real.
3. Al hacer clic en "Generar Plan Nutricional", los datos se envían a `/api/enviar-n8n`.
4. La función serverless reenvía los datos de forma segura a la URL configurada en `N8N_WEBHOOK_URL`.
5. n8n procesa la información para generar y enviar el plan al nutricionista (según la configuración de tu flujo), ya que debe pasar por su revisión para su posterior envio al paciente.
