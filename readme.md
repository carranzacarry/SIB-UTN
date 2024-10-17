
# SIBUTN | Sistema de Indexación Bibliotecaria UTN

Esta API te permite obtener una lista paginada de libros de un catálogo, con soporte para funcionalidad de búsqueda y controles de paginación personalizados.

## Funcionalidades
- Obtener libros con paginación y límites personalizados.
- Funcionalidad de búsqueda para filtrar libros por título, autor o ISBN.
- Controles de paginación que incluyen botones de primera, última, página anterior y siguiente.
- Paginación responsiva con indicación dinámica de la página activa.

## Tabla de Contenidos
1. [Introducción](#introducción)
2. [Endpoints de la API](#endpoints-de-la-api)
3. [Integración con el Frontend](#integración-con-el-frontend)
4. [Paginación](#paginación)
5. [Manejo de Errores](#manejo-de-errores)

## Introducción

Para ejecutar este proyecto localmente, sigue estos pasos:

### Requisitos
- Un servidor web funcional (por ejemplo, Node.js, Apache, Nginx).
- Navegador con JavaScript habilitado.

### Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/carranzacarry/sib-utn.git
   ```
   
2. Navega al directorio del proyecto:
   ```bash
   cd sib-utn
   ```

3. Instala las dependencias (si es necesario):
   ```bash
   npm install
   ```

4. Inicia el servidor:
   ```bash
   npm start
   ```

5. Accede al frontend desde tu navegador en \`http://localhost:3000\` (suponiendo una configuración predeterminada).

## Endpoints de la API

### Obtener Libros

#### \`GET /books\`
Obtiene una lista paginada de libros con funcionalidad de búsqueda opcional.

**Parámetros de Consulta:**
- \`page\`: El número de página a obtener (por defecto: 1).
- \`limit\`: La cantidad de elementos por página (por defecto: 10).
- \`search\`: Un término de búsqueda para filtrar libros por título (opcional).

**Ejemplo de Solicitud:**
```bash
GET /books?page=1&limit=10&search=Harry
```

**Respuesta:**
```json
{
  "books": [
    {
      "title": "Harry Potter y la piedra filosofal",
      "author": "J.K. Rowling"
    },
    ...
  ],
  "totalPages": 5
}
```

## Integración con el Frontend

En el frontend provisto (\`script.js\`), la API se utiliza para obtener y mostrar libros de forma dinámica. Los controles de paginación se actualizan automáticamente según el número total de páginas y la página actual. Las siguientes funciones principales manejan las interacciones clave con la API:

### \`fetchBooks(page = 1)\`
Obtiene los libros para la página especificada, aplicando términos de búsqueda y elementos por página si es necesario. El resultado se renderiza en el DOM.

### \`renderBooks(books)\`
Limpia el catálogo de libros actual y renderiza la lista de libros proporcionada por la API.

### \`renderPagination(totalPages, currentPage)\`
Renderiza los controles de paginación, incluidos los botones de primera, última y numerados, junto con las flechas de navegación.

## Paginación

La paginación se maneja automáticamente mediante la función \`renderPagination\` en \`script.js\`. Esto incluye:
- **Botones de Primera y Última Página**: Navega directamente a la primera o última página.
- **Indicación de la Página Actual**: La página actual se resalta con la clase \`active\`.
- **Botones de Anterior y Siguiente**: Navega a la página anterior o siguiente.
- **Puntos Suspensivos**: Se muestran cuando hay páginas ocultas entre la página actual y la primera/última página.

La API solo mostrará paginación si hay más de una página de resultados.

## Manejo de Errores

Los errores como fallos de red o errores en las solicitudes a la API se capturan y se registran en la consola del navegador. La parte relevante del script es:

```javascript
.catch(error => {
    console.error('Error al obtener libros:', error);
});
```

## Licencia

Este proyecto es propiedad de la Universidad Tecnológica Nacional (UTN). Su uso, distribución, modificación y cualquier otra forma de aprovechamiento están prohibidos sin la autorización correspondiente.