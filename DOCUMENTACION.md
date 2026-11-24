DOCUMENTACIÓN TÉCNICA - NOVATECH HARDWARE STORE

1. Alcance del Sistema
NovaTech es una aplicación web de comercio electrónico enfocada en hardware y periféricos. Permite explorar el catálogo público mediante filtros jerárquicos y búsqueda predictiva, gestionar historial de navegación, registrar e iniciar sesión con control de roles (cliente y administrador), administrar un carrito con opción de deshacer, calcular rutas óptimas de entrega entre zonas urbanas, comunicarse en tiempo real con soporte y despachar pedidos en orden estricto de llegada.

2. Tecnologías Utilizadas
- Frontend: React 19, Vite, React Router DOM y estilos modulares encapsulados con Sass (.module.scss).
- Backend y Base de Datos: Supabase (PostgreSQL para persistencia de órdenes y mensajes, Supabase Auth para autenticación y control de acceso, y Supabase Realtime para actualización en vivo).
- Control de Versiones y Despliegue: Git y GitHub (flujo por ramas integradas en main) y hosting continuo en Netlify.

3. Estructuras de Datos Implementadas y Justificación

3.1. Pila (src/Helpers/Stack.js)
- Aplicación: Controla el historial de productos vistos recientemente en el catálogo y la función de quitar el último equipo agregado al carrito.
- Justificación: Su política LIFO (Last-In, First-Out) ofrece inserción y extracción en tiempo constante O(1) mediante push y pop, modelando de forma natural la reversión de la acción más reciente y el orden cronológico inverso del historial.

3.2. Cola (src/Helpers/Queue.js)
- Aplicación: Gestiona la bandeja de despacho de pedidos en el panel administrativo, sincronizada con la tabla orders de Supabase.
- Justificación: Su política FIFO (First-In, First-Out) garantiza que la primera orden confirmada por un cliente (enqueue) sea estrictamente la primera en ser despachada (dequeue), asegurando equidad operativa en los envíos.

3.3. Árbol N-ario (src/Helpers/NAryTree.js)
- Aplicación: Organiza la jerarquía de categorías y subcategorías del catálogo (Catálogo -> Laptops / Periféricos -> Ultrabooks, Workstations, Teclados, Audio Hi-Res).
- Justificación: Permite representar taxonomías de productos con múltiples ramificaciones por nodo padre, superando la rigidez de un arreglo plano o de un árbol binario limitado a dos hijos.

3.4. Árbol de Prefijos / Trie (src/Helpers/Trie.js)
- Aplicación: Impulsa el buscador superior del catálogo filtrando equipos en tiempo real según el prefijo escrito.
- Justificación: Realiza búsquedas por prefijo en tiempo proporcional a la longitud de la palabra buscada O(L), evitando recorrer y comparar cadenas completas contra todo el inventario en cada pulsación de tecla.

3.5. Grafo Ponderado (src/Helpers/Graph.js)
- Aplicación: Modela la red logística entre la Bodega Central y las zonas de entrega (Zona Sur, Zona Norte, Zona Centro), ejecutando el algoritmo de Dijkstra para determinar la ruta más corta, distancia en kilómetros y tiempo estimado.
- Justificación: Las redes de distribución tienen conexiones no lineales con distintos costos de distancia; una lista de adyacencia ponderada permite calcular trayectos óptimos entre puntos de entrega.