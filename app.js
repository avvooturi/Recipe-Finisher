const appId = {MY_API_ID};
const appKey = {MY_API_KEY};
const baseUrl = `https://api.edamam.com/api/recipes/v2?type=public&app_id=${appId}&app_key=${appKey}`;
let boxContainer;
const txtSearch = document.querySelector("#txtSearch");
const submitBtn = document.querySelector(".submitbtn");
const howToUseItButton = document.querySelector(".topright button");

howToUseItButton.addEventListener("click", () => {
  window.location.href = "how_to.html";
});

function clearSelectedRecipes() {
  // code to clear selected recipe boxes
  const selectedRecipes = document.querySelectorAll('.cloned-recipe-container');
  selectedRecipes.forEach(recipe => {
      document.body.removeChild(recipe.parentNode.parentNode);
  });

  // Smoothly scroll back to the top of the page
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Hide the clear button
  document.getElementById("clearBtn").style.display = "none";
}

// Add an event listener to the clear button
document.getElementById("clearBtn").onclick = function() {
  clearSelectedRecipes();
}

submitBtn.addEventListener("click", () => {
  const inputVal = txtSearch.value;
  loadRecipies(inputVal);

  // Update the styles of the .topnav element
  const topnav = document.querySelector(".topnav");
  topnav.style.position = "static";
  topnav.style.transform = "none";
});

txtSearch.addEventListener("keyup", (e) => {
  const inputVal = txtSearch.value;
  if (e.keyCode === 13) {
      loadRecipies(inputVal);

      // Update the styles of the .topnav element
      const topnav = document.querySelector(".topnav");
      topnav.style.position = "static";
      topnav.style.transform = "none";
  }
});

window.addEventListener('DOMContentLoaded', () => {
  boxContainer = document.querySelector('.box-container');
});

txtSearch.addEventListener("keyup", (e) => {
  const inputVal = txtSearch.value;
  if (e.keyCode === 13) {
    loadRecipies(inputVal);
  }
})

function loadRecipies(type) {
  if (!type) return;
  const url = baseUrl + `&q=${type}`;
  fetch(url)
      .then((res) => res.json())
      .then((data) => renderRecipes(data.hits))
      .catch((error) => console.log(error));
}

const renderRecipes = (recipeList = []) => {
  boxContainer.innerHTML = '';
  const noResultsElement = document.querySelector('.no-results');

  if (recipeList.length === 0) {
    noResultsElement.textContent = 'Sorry, but there are no search results that match your query. Please try again or edit your search.';
  } else {
    noResultsElement.textContent = '';
  }
  
  recipeList.forEach(recipeObj => {
    const {
      label: recipeTitle,
      ingredientLines,
      image: recipeImage,
      url: recipeUrl
    } = recipeObj.recipe;
    const container = document.createElement('div');
    container.classList.add('recipe-container');

    const htmlStr = `
      <div class="content">
        <div class="text">
          <h2>${recipeTitle}</h2>
        </div>
        <div class="image">
          <img src="${recipeImage}" alt="Image">
        </div>
      </div>
      <div class="divider"></div>
      <ol class="list">
        ${ingredientLines.map(ingredient => `<li>${ingredient}</li>`).join('')}
      </ol>
      <a href="${recipeUrl}" target="_blank">
        <button class="view-recipe-button">View full recipe</button>
      </a>
    `;

    container.innerHTML = htmlStr;

    container.addEventListener('mouseover', () => {
      const contentElement = container.querySelector('.content');
      const dividerElement = container.querySelector('.divider');
      contentElement.style.color = '#ff0000';
      dividerElement.style.opacity = '0.2';
    });
    container.addEventListener('mouseout', () => {
      const contentElement = container.querySelector('.content');
      const dividerElement = container.querySelector('.divider');
      contentElement.style.color = '#ffffff';
      dividerElement.style.opacity = '0';
    });    

    boxContainer.appendChild(container);
    const viewRecipeButton = container.querySelector('.view-recipe-button');
    viewRecipeButton.classList.add('hidden-link');

    container.addEventListener('click', () => {
      document.body.style.marginTop = '0px';
      document.getElementById("clearBtn").style.display = "block";
    
      const clone = container.cloneNode(true);
      clone.classList.add('cloned-recipe-container');
      clone.querySelector('button').classList.remove('hidden-link');
      clone.classList.add('slow-transition');
      clone.style.marginTop = '-1px';
    
      const parentContainer = document.createElement('div');
      parentContainer.style.display = 'flex';
      parentContainer.style.marginLeft = '20px';
      parentContainer.style.alignItems = 'flex-start';
      parentContainer.style.marginTop = '100px';
    
      const recipeContainer = document.createElement('div');
      recipeContainer.style.display = 'block';
      recipeContainer.appendChild(clone);
      parentContainer.appendChild(recipeContainer);
    
      document.body.appendChild(parentContainer);
    
      const ingredients = clone.querySelectorAll('.list li');
      ingredients.forEach(ingredient => {
        ingredient.addEventListener('click', () => {
          // Check if a select element already exists
          let selectElement = recipeContainer.querySelector('select');
          if (!selectElement) {
            // Create a select element
            selectElement = document.createElement('select');
            selectElement.style.width = '270px';
            selectElement.style.height = '40px';
            selectElement.style.marginBottom = '10px';
            recipeContainer.insertBefore(selectElement, clone);
    
            // Add an event listener to handle the change event
            selectElement.addEventListener('change', (event) => {
              // Remove any existing map container
              const existingMapContainer = parentContainer.querySelector('.map-container');
              if (existingMapContainer) {
                existingMapContainer.remove();
              }
    
              // Create a new map container for the selected ingredient
              const mapContainer = document.createElement('div');
              mapContainer.classList.add('map-container');
    
              const ingredientElement = document.createElement('p');
              ingredientElement.textContent = event.target.value;
              mapContainer.appendChild(ingredientElement);
    
              const mapElement = document.createElement('iframe');
              mapElement.src =
                `https://www.google.com/maps/embed/v1/search?key=AIzaSyCOvqXj5-oYnqsYG8SfTAXdHt8FZwf7jn4&q=${event.target.value}+store+near+me`;
              mapElement.width = 600;
              mapElement.height = 450;
              mapContainer.appendChild(mapElement);
    
              // Append the map container to the parent container
              parentContainer.appendChild(mapContainer);
            });
          }
    
          // Add a new option for the clicked ingredient
          const optionElement = document.createElement('option');
          optionElement.value = ingredient.textContent;
          optionElement.textContent = ingredient.textContent;
          selectElement.appendChild(optionElement);
    
          // Set the value of the select element to the clicked ingredient
          selectElement.value = ingredient.textContent;
    
          // Trigger the change event to display the map automatically
          selectElement.dispatchEvent(new Event('change'));
        });
      });
    });       
  });
};
