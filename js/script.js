document.addEventListener("DOMContentLoaded", () => {
  let moviesData = [];

  // Carga los datos de la API y habilita el botón de búsqueda
  fetch("https://japceibal.github.io/japflix_api/movies-data.json")
    .then(response => response.json())
    .then(data => {
      moviesData = data;
      console.log("Datos de películas cargados:", moviesData); // Verificación de datos
    })
    .catch(error => console.error("Error al cargar los datos de la API:", error));

  const inputBuscar = document.getElementById("inputBuscar");
  const btnBuscar = document.getElementById("btnBuscar");
  const lista = document.getElementById("lista");

  // Elementos del Offcanvas
  const movieTitle = document.getElementById("movieTitle");
  const movieOverview = document.getElementById("movieOverview");
  const movieGenres = document.getElementById("movieGenres");
  const dropdownDetails = document.getElementById("dropdownDetails");
  const offcanvasElement = document.getElementById("offcanvasInfo");

  // Función para mostrar las estrellas según el rating
  const generateStars = (rating) => {
    let stars = "";
    for (let i = 1; i <= 10; i++) {
      stars += `<span class="fa fa-star${i <= rating ? ' checked' : ''}"></span>`;
    }
    return stars;
  };

  // Muestra el listado de películas en base a la búsqueda
  const mostrarPeliculas = (peliculas) => {
    lista.innerHTML = "";
    peliculas.forEach(pelicula => {
      const listItem = document.createElement("li");
      listItem.classList.add("list-group-item", "bg-dark", "text-light");

      listItem.innerHTML = `
        <h5>${pelicula.title}</h5>
        <p>${pelicula.tagline || "Sin tagline disponible"}</p>
        <div>${generateStars(pelicula.vote_average)}</div>
      `;

      // Agrega evento para mostrar detalles en el Offcanvas al hacer clic
      listItem.addEventListener("click", () => mostrarDetalles(pelicula));
      lista.appendChild(listItem);
    });
  };

  // Filtra y muestra las películas que coinciden con la búsqueda
  btnBuscar.addEventListener("click", () => {
    const searchText = inputBuscar.value.trim().toLowerCase();
    if (searchText && moviesData.length) { // Verifica que moviesData tenga contenido
      const filteredMovies = moviesData.filter(movie => {
        return (
          movie.title.toLowerCase().includes(searchText) ||
          movie.genres.some(genre => genre.name.toLowerCase().includes(searchText)) ||
          (movie.tagline && movie.tagline.toLowerCase().includes(searchText)) ||
          (movie.overview && movie.overview.toLowerCase().includes(searchText))
        );
      });
      mostrarPeliculas(filteredMovies);
    }
  });

  // Función para mostrar los detalles de una película en el Offcanvas
  const mostrarDetalles = (pelicula) => {
    movieTitle.textContent = pelicula.title;
    movieOverview.textContent = pelicula.overview;
    movieGenres.textContent = pelicula.genres.map(genre => genre.name).join(", ");
    
    // Genera detalles adicionales en el dropdown
    dropdownDetails.innerHTML = `
      <li>Año de lanzamiento: ${pelicula.release_date.split("-")[0]}</li>
      <li>Duración: ${pelicula.runtime} min</li>
      <li>Presupuesto: $${pelicula.budget.toLocaleString()}</li>
      <li>Ganancias: $${pelicula.revenue.toLocaleString()}</li>
    `;

    const offcanvas = new bootstrap.Offcanvas(offcanvasElement);
    offcanvas.show();
  };
});
