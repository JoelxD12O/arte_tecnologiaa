# 🧠 Arte Tecnológica - Simulador de Dopamina Digital

> **Una experiencia artística interactiva que simula la adicción al scroll infinito y el consumo descontrolado de contenido digital.**

---

## 📖 ¿Qué es este proyecto?

**Arte Tecnológica** es una aplicación web experimental que representa de forma visual y visceral el impacto psicológico del consumo compulsivo de contenido en redes sociales. A través de una simulación de "reels" infinitos, el usuario experimenta cómo la dopamina digital degrada progresivamente su percepción, tiempo y bienestar mental.

### 🎯 Concepto Artístico

La aplicación utiliza **elementos visuales progresivos** para mostrar:
- **Degradación perceptual**: Los colores se vuelven grises, la imagen se vuelve borrosa
- **Aceleración temporal**: El tiempo transcurre cada vez más rápido
- **Caos visual**: Elementos flotantes y mensajes perturbadores
- **Vigilancia constante**: Una cámara que te observa mientras consumes contenido
- **Pérdida de control**: La velocidad de reproducción aumenta automáticamente

Todo esto busca generar **conciencia crítica** sobre nuestros hábitos digitales.

---

## 🎮 ¿Cómo se usa?

### 1️⃣ Instalación

```bash
# Clona el repositorio
git clone <tu-repositorio>
cd arte_tecnologiaa

# Instala las dependencias
pnpm install
# o si usas npm:
npm install
```

### 2️⃣ Ejecutar en desarrollo

```bash
pnpm dev
# o
npm run dev
```

Abre tu navegador en `http://localhost:5173`

### 3️⃣ Construir para producción

```bash
pnpm build
# o
npm run build
```

---

## 🕹️ Controles de la Aplicación

### Página Principal (`/`)

1. **Botón "ESTIMULAR CEREBRO" (verde)** 🧠
   - Inicia la simulación de scroll infinito
   - Activa la reproducción automática de videos
   - Comienza el temporizador

2. **Botón "¡DETENER CAOS!" (rojo)** 😵‍💫
   - Detiene la simulación
   - Muestra un mensaje reflexivo sobre el consumo
   - Reinicia el nivel de caos

3. **Control de Audio** 🔊
   - Icono superior izquierdo
   - Activa/desactiva la música de fondo

4. **Botón "NEXT" (scroll manual)** ⬇️
   - Aparece dentro de la "tablet" durante la simulación
   - Permite avanzar manualmente al siguiente video
   - Aumenta el contador de consumo

5. **Botón "CÁMARA"** 📸
   - Esquina superior derecha
   - Lleva a la vista de cámara limpia (`/camera`)

### Página de Cámara (`/camera`)

- Vista de la cámara web sin efectos de degradación
- Útil para comparar con la versión afectada en la página principal

---

## 🧩 Componentes Principales

### 1. **HomePage** (`src/pages/HomePage.tsx`)
Página principal que orquesta toda la experiencia:
- Maneja el estado de "modo dopamina" (activado/desactivado)
- Controla el nivel de caos (aumenta con cada video visto)
- Muestra el mensaje reflexivo al detener
- Aplica degradación de color al fondo según el nivel de caos

### 2. **ReelComponent** (`src/features/reel/ReelComponent.tsx`)
Simula una aplicación de "reels" estilo TikTok/Instagram:
- Reproduce videos en formato vertical
- Contador de reels consumidos
- Likes falsos que aumentan progresivamente
- Efectos visuales de degradación (escala de grises, desenfoque)
- Velocidad de reproducción acelerada según consumo
- Efecto "glitch" cuando está inactivo

### 3. **Timer** (`src/features/timer/Timer.tsx`)
Temporizador que simula la distorsión temporal:
- **Nivel 0-5**: Tiempo normal (amarillo)
- **Nivel 6-10**: Se acelera y parpadea (naranja)
- **Nivel 11+**: Tiempo frenético, muestra horas falsas (rojo, animado)
- La velocidad aumenta exponencialmente con el caos

### 4. **CameraComponent** (`src/features/camera/CameraComponent.tsx`)
Ventana flotante con tu cámara web:
- **Modo limpio**: En la ruta `/camera` sin efectos
- **Modo degradado**: En la página principal, se degrada con el caos
- Efectos progresivos: escala de grises, desenfoque, brillo reducido
- Glitch visual cuando el caos es muy alto (nivel 15+)
- Indicador "REC" parpadeante

### 5. **BackgroundBubbles** (`src/features/bubbles/BackgroundBubbles.tsx`)
Mensajes flotantes perturbadores:
- Frases sobre el consumo digital
- Emojis relacionados con tecnología y vacío
- Movimiento rápido y errático
- Cantidad aumenta con el nivel de caos
- Se vuelven rojas cuando el caos es alto

### 6. **AudioControl** (`src/features/audio/AudioControl.tsx`)
Control de música ambiente:
- Hook personalizado (`useAudioPlayer.ts`) para manejar el audio
- Tracks definidos en `audioTracks.ts`
- Botón con ícono visual de parlante

### 7. **PlayButton** (`src/features/play/PlayButton.tsx`)
Botón principal de inicio/detención:
- Estilo neobrutalist (bordes gruesos, sombras duras)
- Cambia de color según el estado (verde/rojo)
- Feedback háptico (vibración en dispositivos compatibles)
- Animación de "presionar"

---

## 📂 Estructura del Proyecto

```
arte_tecnologiaa/
├── src/
│   ├── App.tsx                    # Router principal
│   ├── main.tsx                   # Punto de entrada
│   ├── index.css                  # Estilos globales + animaciones
│   ├── pages/
│   │   └── HomePage.tsx           # Página principal
│   ├── features/
│   │   ├── audio/                 # Control de audio
│   │   ├── bubbles/               # Mensajes flotantes
│   │   ├── camera/                # Componente de cámara web
│   │   ├── play/                  # Botón de play/stop
│   │   ├── reel/                  # Simulador de reels
│   │   └── timer/                 # Temporizador acelerado
│   └── media/                     # Videos (video1.mp4 - video18.MP4)
├── v2/                            # Versión alternativa (HTML puro)
├── package.json                   # Dependencias del proyecto
├── vite.config.ts                 # Configuración de Vite
├── tailwind.config.js             # Configuración de Tailwind CSS
└── README.md                      # Este archivo
```

---

## 🎨 Características Técnicas

### Stack Tecnológico
- **React 19** + **TypeScript**
- **Vite** (build tool ultrarrápido)
- **Tailwind CSS 4** (estilos utility-first)
- **React Router DOM** (navegación)
- **Hooks personalizados** para lógica reutilizable

### Efectos Visuales Progresivos

| Nivel de Caos | Efecto                                    |
|---------------|-------------------------------------------|
| 0-5           | Normal, colores vibrantes                 |
| 6-10          | Saturación reducida, timer naranja        |
| 11-15         | Escala de grises parcial, desenfoque leve |
| 16+           | Glitch en cámara, tiempo falso, caos total|

### Fórmulas de Degradación

```typescript
// Escala de grises (0-100%)
grayScale = (totalConsumed - 10) * 8

// Desenfoque (0-4px en reels, 0-8px en cámara)
blur = (totalConsumed - 20) * 0.3

// Velocidad de reproducción (1x - 1.6x+)
playbackRate = 1.0 + (totalConsumed * 0.03)

// Velocidad del temporizador (1000ms - 50ms)
timerSpeed = Math.max(50, 1000 / (1 + chaosLevel * 0.5))
```

---

## 🎥 Videos Requeridos

La aplicación requiere **18 videos** en la carpeta `src/media/`:
- `video1.mp4` a `video7.mp4` (minúsculas)
- `video8.MP4` a `video18.MP4` (MAYÚSCULAS)

Estos videos se reproducen aleatoriamente en el simulador de reels.

---

## 🎭 Intención Artística

Este proyecto es una **crítica social interactiva** sobre:
- La adicción a las redes sociales
- El scroll infinito y su impacto psicológico
- La pérdida de tiempo y atención
- La vigilancia digital constante
- La degradación de nuestra percepción por sobreestimulación

**No es una aplicación para entretenimiento**, sino una experiencia que incomoda intencionalmente para generar reflexión.

---

## 🔧 Personalización

### Cambiar Videos
Reemplaza los archivos en `src/media/` y actualiza `videoPlaylist.ts`:

```typescript
// src/features/reel/videoPlaylist.ts
export const videoPlaylist = [
  new URL('../../media/tuvideo.mp4', import.meta.url).href,
  // ...más videos
];
```

### Ajustar Velocidad de Degradación
Modifica las constantes en cada componente:
- `ReelComponent.tsx`: líneas 21-23 (escala de grises, blur, playback)
- `Timer.tsx`: línea 11 (fórmula de aceleración)
- `CameraComponent.tsx`: líneas 11-13 (filtros visuales)

### Cambiar Mensajes Flotantes
Edita los arrays en `BackgroundBubbles.tsx`:

```typescript
const FRASES = ["Tu mensaje aquí", /* ... */]
const EMOJIS = ["🔥", /* ... */]
```

---

## 📱 Compatibilidad

- ✅ Chrome, Edge, Firefox (últimas versiones)
- ✅ Responsive (móvil y escritorio)
- ✅ Requiere permiso de cámara web
- ✅ Feedback háptico en dispositivos compatibles

---

## 👥 Créditos

**Proyecto de Arte Tecnológica**
Desarrollo: [Tu nombre aquí]
Concepto: Crítica a la cultura del scroll infinito

---

## 📄 Licencia

Este proyecto es de naturaleza artística y educativa.

---

## 🚀 Comandos Útiles

```bash
# Desarrollo
pnpm dev

# Build de producción
pnpm build

# Preview del build
pnpm preview

# Linting
pnpm lint
```

---

**⚠️ ADVERTENCIA**: Esta aplicación puede resultar incómoda o perturbadora. Ese es precisamente su objetivo.
