document.addEventListener('DOMContentLoaded', function() {
    const baseURL = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const categoriesButton = document.getElementById('categoriesButton');
    const loader = document.getElementById('loader');
    const modal = document.getElementById('instructionsModal');
    const closeModal = document.querySelector('.close');
    const modalMealTitle = document.getElementById('modalMealTitle');
    const modalMealInstructions = document.getElementById('modalMealInstructions');

    // Mostrar pantalla de carga
    loader.style.display = 'block';

    async function getRandomMeals() {
        const meals = [];
        try {
            for (let i = 0; i < 10; i++) {
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

    function getRandomLetter() {
        const alphabet = 'abcdefghijklmnopqrstuvwxyz';
        return alphabet.charAt(Math.floor(Math.random() * alphabet.length));
    }

    async function displayRandomMeals() {
        const meals = await getRandomMeals();
        const searchResults = document.getElementById('searchResults');
        searchResults.innerHTML = '';

        meals.forEach(meal => {
            const mealCard = document.createElement('div');
            mealCard.classList.add('card');

            mealCard.innerHTML = `
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                <div class="card-info">
                    <h3 class="title">${meal.strMeal}</h3>
                    <p class="subtitle">Categoría: ${meal.strCategory}</p>
                    <button class="toggle-instructions" data-id="${meal.idMeal}">Ver Instrucciones</button>
                </div>
            `;

            searchResults.appendChild(mealCard);
        });

        loader.style.display = 'none'; // Ocultar pantalla de carga

        const instructionButtons = document.querySelectorAll('.toggle-instructions');
        instructionButtons.forEach(button => {
            button.addEventListener('click', async function() {
                const mealId = this.getAttribute('data-id');
                const mealDetails = await getMealDetails(mealId);

                modalMealTitle.textContent = mealDetails.strMeal;
                modalMealInstructions.textContent = mealDetails.strInstructions;

                modal.style.display = 'block'; // Mostrar el modal
            });
        });
    }

    async function getMealDetails(mealId) {
        try {
            const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
            const data = await response.json();
            return data.meals[0];
        } catch (error) {
            console.error('Error al obtener detalles de la receta:', error);
        }
    }

    // Cerrar el modal cuando el usuario hace clic en la "X"
    closeModal.onclick = function() {
        modal.style.display = 'none';
    };

    // Cerrar el modal cuando el usuario hace clic fuera del contenido del modal
    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };

    // Función para buscar comidas por nombre
    async function searchMealsByName(query) {
        try {
            const response = await fetch(`${baseURL}${query}`);
            const data = await response.json();
            if (data.meals) {
                displayMeals(data.meals);
            } else {
                displayErrorMessage("No se encontraron resultados para tu búsqueda.");
            }
        } catch (error) {
            console.error('Error al buscar comidas:', error);
            displayErrorMessage("Error al buscar comidas. Intenta nuevamente.");
        }
    }

    // Mostrar los resultados de búsqueda
    function displayMeals(meals) {
        const searchResults = document.getElementById('searchResults');
        searchResults.innerHTML = '';

        meals.forEach(meal => {
            const mealCard = document.createElement('div');
            mealCard.classList.add('card');

            mealCard.innerHTML = `
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                <div class="card-info">
                    <h3 class="title">${meal.strMeal}</h3>
                    <p class="subtitle">Categoría: ${meal.strCategory}</p>
                    <button class="toggle-instructions" data-id="${meal.idMeal}">Ver Instrucciones</button>
                </div>
            `;

            searchResults.appendChild(mealCard);
        });

        const instructionButtons = document.querySelectorAll('.toggle-instructions');
        instructionButtons.forEach(button => {
            button.addEventListener('click', async function() {
                const mealId = this.getAttribute('data-id');
                const mealDetails = await getMealDetails(mealId);

                modalMealTitle.textContent = mealDetails.strMeal;
                modalMealInstructions.textContent = mealDetails.strInstructions;

                modal.style.display = 'block'; // Mostrar el modal
            });
        });
    }

    // Mostrar mensaje de error si no hay resultados
    function displayErrorMessage(message) {
        const searchResults = document.getElementById('searchResults');
        searchResults.innerHTML = `<p>${message}</p>`;
    }

    // Función para buscar categorías de comida
    async function searchMealsByCategory(category) {
        try {
            const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
            const data = await response.json();
            if (data.meals) {
                displayMeals(data.meals);
            } else {
                displayErrorMessage("No se encontraron resultados para esta categoría.");
            }
        } catch (error) {
            console.error('Error al buscar categorías:', error);
            displayErrorMessage("Error al buscar categorías. Intenta nuevamente.");
        }
    }

    // Buscar cuando se presiona el botón de búsqueda
    searchButton.addEventListener('click', function() {
        const query = searchInput.value.trim();
        if (query) {
            loader.style.display = 'block'; // Mostrar el loader
            searchMealsByName(query);
            loader.style.display = 'none'; // Ocultar el loader después de la búsqueda
        }
    });

    // Mostrar comidas aleatorias al cargar la página
    displayRandomMeals();

    // Botón de categorías
    categoriesButton.addEventListener('click', function() {
        const categories = ['Beef', 'Chicken', 'Dessert', 'Vegetarian', 'Vegan', 'Seafood'];
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        searchMealsByCategory(randomCategory);
    });
});
