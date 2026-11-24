NOVATECH - PROYECTO FINAL ESTRUCTURAS DE DATOS II

Plataforma web e-commerce desarrollada en React + Vite con implementación de 5 estructuras de datos (Pila, Cola, Árbol N-ario, Trie y Grafo Ponderado), autenticación real y sincronización en vivo con Supabase.

Autor
- Jorge Eduardo Quiñones Alvarez

Enlaces del Proyecto
- Propuesta Gráfica (CodePen): https://codepen.io/editor/Aiko-Kurokawa/pen/01a20792-2dd1-7374-928f-408bb945249f
- Aplicación Desplegada (Netlify): https://novatech-appproyectofinal.netlify.app/login
- Documentación Técnica: DOCUMENTACION.md

Arquitectura (novatech-app/src)
- Helpers/: Implementación de las 5 estructuras de datos (Stack, Queue, NAryTree, Trie, Graph) y cliente de Supabase.
- Context/: Estado global de autenticación (AuthContext) y tienda (StoreContext).
- Hooks/: Custom Hooks (useAuth, useStore).
- Routes/: Protección de rutas públicas y privadas (AppRoutes, UserRoutes, AdminRoutes).
- Pages/: Vistas principales (Index, Auth, User, Admin).
- Components/: Componentes reutilizables estilizados con .module.scss.