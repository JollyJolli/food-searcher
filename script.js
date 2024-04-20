document.addEventListener('DOMContentLoaded', function() {
    const baseURL = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';

    // Mostrar pantalla de carga
    const loader = document.getElementById('loader');
    loader.style.display = 'block'; // Ocultamos el loader al principio

    // Función para obtener una letra aleatoria entre 'a' y 'z'
    function getRandomLetter() {
        const alphabet = 'abcdefghijklmnopqrstuvwxyz';
        return alphabet.charAt(Math.floor(Math.random() * alphabet.length));
    }

    // Función para hacer una solicitud a la API y obtener recetas aleatorias
    async function getRandomMeals() {
        const meals = [];
        try {
            for (let i = 0; i < 3; i++) {
                const randomLetter = getRandomLetter();
                const response = await fetch(`${baseURL}${randomLetter}`);
                const data = await response.json();
                const randomMeal = data.meals[Math.floor(Math.random() * data.meals.length)];
                meals.push(randomMeal);
            }
            return meals;
        } catch (error) {
            console.error('Error al obtener recetas:', error);
        }
    }

    // Función para mostrar las recetas en tarjetas
  // Función para mostrar las recetas en tarjetas
  async function displayRandomMeals() {
      const meals = await getRandomMeals();
      const searchResults = document.getElementById('searchResults');
      meals.forEach(meal => {
          const card = `
              <div class="card">
                  <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                  <div class="card-info">
                      <h3 class="title">${meal.strMeal}</h3>
                      <p><strong class="subtitle">ID de la Comida:</strong> ${meal.idMeal}</p>
                      <p class="subtitle"><i class="fas fa-utensils"></i> Categoría:</p>
                      <p>${meal.strCategory}</p>
                      <p class="subtitle"><i class="fas fa-globe-americas"></i> Área:</p>
                      <p>${meal.strArea}</p>
                      <p class="subtitle"><i class="fas fa-book-open"></i> Instrucciones:</p>
                      <p class="instructions">${meal.strInstructions}</p>
                      <button class="toggle-instructions">Ver Instrucciones</button>
                  </div>
              </div>
          `;
          searchResults.innerHTML += card;
      });

      // Ocultar pantalla de carga
      loader.style.display = 'none';

      // Agregar event listener a los botones Ver Instrucciones
      document.querySelectorAll('.toggle-instructions').forEach(button => {
          button.addEventListener('click', function() {
              const instructions = this.previousElementSibling;
              if (instructions.style.display === 'none') {
                  instructions.style.display = 'block';
                  this.textContent = 'Ocultar Instrucciones';
              } else {
                  instructions.style.display = 'none';
                  this.textContent = 'Ver Instrucciones';
              }
          });
      });
  }


    displayRandomMeals();

    // Función para manejar la búsqueda cuando se presiona Enter o se hace clic en el botón de búsqueda
    document.getElementById('searchInput').addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            searchMeals();
        }
    });

    document.getElementById('searchButton').addEventListener('click', function() {
        searchMeals();
    });

    // Función para realizar la búsqueda de comidas
  // Función para realizar la búsqueda de comidas
  // Función para realizar la búsqueda de comidas
  async function searchMeals() {
      const searchTerm = document.getElementById('searchInput').value.trim();
      if (searchTerm === '') {
          alert('Por favor ingresa una búsqueda.');
          return;
      }

      try {
          // Verificar si el término de búsqueda es un número (ID)
          if (!isNaN(searchTerm)) {
              // Si el término de búsqueda es un número, buscar por ID
              const responseById = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${encodeURIComponent(searchTerm)}`);
              const dataById = await responseById.json();
              if (dataById.meals === null) {
                  alert('No se encontraron resultados.');
                  return;
              }
              displaySearchResults(dataById.meals);
              return;
          }

          // Verificar si el término de búsqueda es una categoría
          const categoriesResponse = await fetch('https://www.themealdb.com/api/json/v1/1/categories.php');
          const categoriesData = await categoriesResponse.json();
          const category = categoriesData.categories.find(cat => cat.strCategory.toLowerCase() === searchTerm.toLowerCase());
          if (category) {
              const categoryResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${encodeURIComponent(category.strCategory)}`);
              const categoryData = await categoryResponse.json();
              if (categoryData.meals === null) {
                  alert('No se encontraron resultados para esta categoría.');
                  return;
              }
              displaySearchResults(categoryData.meals);
              return;
          }

          // Si no es ni un número ni una categoría, buscar por nombre
          const response = await fetch(`${baseURL}${encodeURIComponent(searchTerm)}`);
          const data = await response.json();
          if (data.meals === null) {
              alert('No se encontraron resultados.');
              return;
          }
          displaySearchResults(data.meals);
      } catch (error) {
          console.error('Error al buscar comidas:', error);
      }
  }


  // Función para mostrar los resultados de búsqueda en tarjetas
  function displaySearchResults(meals) {
      const searchResults = document.getElementById('searchResults');
      searchResults.innerHTML = ''; // Limpiamos los resultados anteriores
      meals.forEach(meal => {
          const card = `
              <div class="card">
                  <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                  <div class="card-info">
                      <h3 class="title">${meal.strMeal}</h3>
                      <p><strong class="subtitle">ID de la Comida:</strong> ${meal.idMeal}</p>
                      <p class="subtitle"><i class="fas fa-utensils"></i> Categoría:</p>
                      <p>${meal.strCategory}</p>
                      <p class="subtitle"><i class="fas fa-globe-americas"></i> Área:</p>
                      <p>${meal.strArea}</p>
                      <p class="subtitle"><i class="fas fa-book-open"></i> Instrucciones:</p>
                      <p class="instructions">${meal.strInstructions}</p>
                      <button class="toggle-instructions">Ver Instrucciones</button>
                  </div>
              </div>
          `;
          searchResults.innerHTML += card;
      });

      // Agregar event listener a los botones Ver Instrucciones
      document.querySelectorAll('.toggle-instructions').forEach(button => {
          button.addEventListener('click', function() {
              const instructions = this.previousElementSibling;
              if (instructions.style.display === 'none') {
                  instructions.style.display = 'block';
                  this.textContent = 'Ocultar Instrucciones';
              } else {
                  instructions.style.display = 'none';
                  this.textContent = 'Ver Instrucciones';
              }
          });
      });
  }
  
  // Función para obtener y mostrar todas las categorías disponibles
  document.getElementById('categoriesButton').addEventListener('click', async function() {
      try {
          const categoriesResponse = await fetch('https://www.themealdb.com/api/json/v1/1/categories.php');
          const categoriesData = await categoriesResponse.json();
          const categoryNames = categoriesData.categories.map(cat => cat.strCategory);
          alert('Categorías Disponibles:\n\n' + categoryNames.join('\n'));
      } catch (error) {
          console.error('Error al obtener categorías:', error);
      }
  });
  
});
