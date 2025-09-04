import React from "react";
import { getRecipeFromMistral } from "../ai";

export function Main() {
  const [ingredients, setIngredients] = React.useState([]);
  const [RecipeShown, setRecipeShown] = React.useState(false);

  const ingredientsList = ingredients.map((ingredient) => (
    <li key={ingredient}>{ingredient}</li>
  ));

    // add an ingredient
   function addIngredient(event) {
    event.preventDefault();
    const newIngredient = event.currentTarget.ingredient.value.trim();
    if (!newIngredient) return;
    setIngredients(prev => [...prev, newIngredient]);
    event.currentTarget.reset();
  }

  // delay part of the page to after having some ingredients
  function ready_recipe() {
    if (ingredients.length > 3) {
      return (
        <section className="ingredients-section">
          <h2>Ingredients on hand:</h2>
          <ul className="ingredients-list" aria-live="polite">
            {ingredientsList}
          </ul>
          <div className="get-recipe-container">
            <div>
              <h3>Ready for a recipe?</h3>
              <p>Generate a recipe from your list of ingredients.</p>
            </div>
            <button onClick={showRecipeShown}>Get a recipe</button>
          </div>
        </section>
      );
    } else if (ingredients.length > 0) {
      return (
        <section className="ingredients-section">
          <h2>Ingredients on hand:</h2>
          <ul className="ingredients-list" aria-live="polite">
            {ingredientsList}
          </ul>
        </section>
      );
    }
    else 
        return ("");
  }

  // get ai recommended recipe
  const [recipeText, setRecipeText] = React.useState("");
  // show recipe
  async function showRecipeShown() {
    const text = await getRecipeFromMistral(ingredients);
    setRecipeText(text || "nao funcionou");
    setRecipeShown(true); // now it shows
  }
  // to test if this works ...
  async function showRecipe() {
   console.log("call ai");
   const result = await getRecipeFromMistral(ingredients);
   console.log("ai result", result);
   setRecipeText(result);
  }

  return (
    <main>
      <form className="add-ingredient-form" onSubmit={addIngredient}>
        <input
          type="text"
          name="ingredient"
          placeholder="e.g. Oregano"
        />
        <button type="submit">+ Add ingredient</button>
      </form>

      {ready_recipe()}

      {RecipeShown && (
        <section>
          <h2>Chef Claude Recommends:</h2>
          <article
            className="suggested-recipe-container"
          >
            {recipeText}
          </article>
        </section>
      )}
    </main>
  );
}