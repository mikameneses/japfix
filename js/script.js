document.addEventListener("DOMContentLoaded", () => {
  let moviesData = [];

  // Carga los datos de la API
  fetch("https://japceibal.github.io/japflix_api/movies-data.json")
    .then(response => response.json())
    .then(data => moviesData = data)
    .catch(error => console.error("Error al cargar los datos de la API:", error));

  const inputBuscar = document.getElementById("inputBuscar");
  const btnBuscar = document.getElementById("btnBuscar");
  const lista = document.getElementById("lista");

  // Elementos del Offcanvas
  const movieTitle = document.getElementById("movieTitle");
  const movieOverview = document.getElementById("movieOverview");
  const movieGenres = document.getElementById("movieGenres");
  const movieYear = document.getElementById("movieYear");
  const movieDuration = document.getElementById("movieDuration");
  const movieBudget = document.getElementById("movieBudget");
  const movieRevenue = document.getElementById("movieRevenue");
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
        <p>${pelicula.tagline}</p>
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
  if (searchText) {
    const filteredMovies = moviesData.filter(movie => {
      return (
        movie.title.toLowerCase().includes(searchText) ||
        (movie.genres && movie.genres.some(genre => genre.name.toLowerCase().includes(searchText))) ||
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
    movieGenres.textContent = pelicula.genres.join(", ");
    movieYear.textContent = pelicula.release_date.split("-")[0];
    movieDuration.textContent = pelicula.runtime;
    movieBudget.textContent = pelicula.budget.toLocaleString();
    movieRevenue.textContent = pelicula.revenue.toLocaleString();

    const offcanvas = new bootstrap.Offcanvas(offcanvasElement);
    offcanvas.show();
  };
});
