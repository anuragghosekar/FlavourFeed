import React, { useState, useEffect } from 'react';
import { useParams, Navigate ,useNavigate} from 'react-router-dom';
import RecipeService from '../../Service/RecipeService';
import UserService from '../../Service/UserService';
import LogNavbar from './LogNavbar';

export default function EditRecipe() {
        const { id } = useParams();
        const [loggedIn, setLoggedIn] = useState(true);
        const [isadmin, setisadmin] = useState(false);
        const [formDetails, setFormDetails] = useState({
          recipeId: "",
          recipeName: "",
          instructions: "",
          cookTime: "",
          totalCalories: "",
          recipeType: "",
          recipeDescription: "",
          recipeIngredients:[],
          recipe_image: null,
        });

        const navigate = useNavigate();
        // useEffect(() => {
        //   const userId = localStorage.getItem('userId');
        //   if (!userId) {
        //     setLoggedIn(false);
        //   } else {
        //   const fetchRecipeDetails = async () => {
        //     try {
        //       const response = await RecipeService.getRecipeById(id);
        //       const recipe = response.data;  
        //       const ingredientsResponse = await RecipeService.getIngredientsByRecipe(id);
        //       const ingredients = ingredientsResponse.data;

        //       const updatedFormDetails = {
        //         ...recipe,
        //         recipeIngredients: ingredients
        //       };
        
        //       setFormDetails(updatedFormDetails);
        //       } catch (error) {
        //       console.error('Error fetching recipe details:', error);
        //     }
        //   };

        //   fetchRecipeDetails();
        //   }}, [id]);

        useEffect(() => {
          const fetchData = async () => {
            const userId = localStorage.getItem('userId');
            if (!userId) {
              setLoggedIn(false);
              return;
            }
      
            try {
              const userResponse = await UserService.getUserById(userId);
              const userData = userResponse.data;
              if (userData.role === "admin") {
                setisadmin(true);
                return;
              }
      
              const response = await RecipeService.getRecipeById(id);
              const recipe = response.data;
              const ingredientsResponse = await RecipeService.getIngredientsByRecipe(id);
              const ingredients = ingredientsResponse.data;
      
              const updatedFormDetails = {
                ...recipe,
                recipeIngredients: ingredients
              };
      
              setFormDetails(updatedFormDetails);
            } catch (error) {
              console.error('Error fetching recipe details:', error);
            }
          };
      
          fetchData();
        }, [id]);

          if (!loggedIn) {
            return <Navigate to="/login" replace />;
          }

          if (isadmin) {
            return <Navigate to="/adminDashboard" replace />;
          }
        
        const updateRecipe = () => {
          if (
            formDetails.recipeId === "" || 
            formDetails.recipeName === "" ||
            formDetails.instructions === "" ||
            formDetails.cookTime === "" ||
            formDetails.totalCalories === "" ||
            formDetails.recipeType === "" ||
            formDetails.recipeDescription === ""
          ) {
            alert("Please fill in all the fields");
            return;
          }
         
          RecipeService.updateRecipe(formDetails)
            .then((result) => {
              setFormDetails({
                recipeId: "",
                recipeName: "",
                instructions: "",
                cookTime: "",
                totalCalories: "",
                recipeType: "",
                recipeDescription: "",
                recipe_image: null,
                recipeIngredients:[]
              });
              navigate("/userrecipes");
            })
            .catch((err) => {
              console.log("Error occurred", err);
            });
        };


        return (
          <>
          <div>
            <form>
              <div className="form-group">
                <input 
                  type="text" 
                  className="form-control" 
                  id="recipeId" 
                  name="recipeId"
                  value={formDetails.recipeId}
                  readOnly
                  hidden
                />
              </div>
              <div className="form-group">
                <label htmlFor="recipeName">Recipe Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  id="recipeName" 
                  name="recipeName"
                  value={formDetails.recipeName}
                  onChange={(event) => {
                    setFormDetails({...formDetails, recipeName: event.target.value});
                  }}
                />
              </div>
              <div className="form-group">
                <label htmlFor="instructions">Instructions</label>
                <input 
                  type="text" 
                  className="form-control" 
                  id="instructions" 
                  name="instructions"
                  value={formDetails.instructions}
                  onChange={(event) => {
                    setFormDetails({...formDetails, instructions: event.target.value});
                  }}
                />
              </div>
              <div className="form-group">
                <label htmlFor="cookTime">Cook Time</label>
                <input 
                  type="text" 
                  className="form-control" 
                  id="cookTime" 
                  name="cookTime"
                  value={formDetails.cookTime}
                  onChange={(event) => {
                    setFormDetails({...formDetails, cookTime: event.target.value});
                  }}
                />
              </div>


              <div className="form-group">
                <label htmlFor="totalCalories">Total Calories</label>
                <input 
                  type="text" 
                  className="form-control" 
                  id="totalCalories" 
                  name="totalCalories"
                  value={formDetails.totalCalories}
                  onChange={(event) => {
                    setFormDetails({...formDetails, totalCalories: event.target.value});
                  }}
                />
              </div>
              <div className="form-group">
  <label htmlFor="recipeType">Recipe Type</label>
  <select
    className="form-control"
    id="recipeType"
    name="recipeType"
    value={formDetails.recipeType}
    onChange={(event) => {
      setFormDetails({ ...formDetails, recipeType: event.target.value });
    }}
  >
    <option value="">Select Recipe Type</option>
    <option value="Veg">Veg</option>
    <option value="Non-Veg">Non-Veg</option>
  </select>
</div>

              <div className="form-group">
                <label htmlFor="recipeDescription">Recipe Description</label>
                <input 
                  type="text" 
                  className="form-control" 
                  id="recipeDescription" 
                  name="recipeDescription"
                  value={formDetails.recipeDescription}
                  onChange={(event) => {
                    setFormDetails({...formDetails, recipeDescription: event.target.value});
                  }}
                />
              </div>
              <div className="form-group">
        <label htmlFor="recipeIngredients">Recipe Ingredients</label>
        <ul>
          {formDetails.recipeIngredients.map((ingredient, index) => (
            <li key={index}>{ingredient.ingredientName}</li>
          ))}
        </ul>
        {console.log(formDetails.recipeIngredients)}
      </div>
      <button 
          type="button" 
          className="btn btn-primary" 
          onClick={updateRecipe}
      >
      Update Recipe
      </button>
      </form>
      </div>
      </>
      );
  }






