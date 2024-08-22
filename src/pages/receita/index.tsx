import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { FormContext } from "@/context/FormContext";
import Skeleton from "react-loading-skeleton";
import Link from "next/link";

export interface RecipeProps {
    title: string
    ingredients: string[]
    instructions: string[]
    notes?: string[]
    suggestions?: string[]
}

export default function Recipe() {
    const [recipe, setRecipe] = useState<RecipeProps | undefined>();
    const [isLoading, setIsLoading] = useState(false);
    const { ingredientList } = useContext(FormContext);

    async function handleGetRecipe() {
        setIsLoading(true);
        const response = await axios.post('/api/recipe', ingredientList);
        const recipe = response.data as RecipeProps;
        setRecipe(recipe);
        setIsLoading(false);
    }

    useEffect(() => {
        handleGetRecipe();
    }, []);


    return (
        <main className="flex flex-row pt-2 justify-center">
            {isLoading && (
                <div className="w-[500px]">
                    <Skeleton count={1} height={40} className="mb-5" />
                    <Skeleton count={10} height={10} />
                </div>
            )}

            {!isLoading && (
                <>
                    <div className="max-w-3xl mb-7">
                        <h1 className="text-2xl font-extrabold">{recipe?.title}</h1>
                        <h2 className="text-xl font-bold mt-5">Ingredientes</h2>
                        <ul>
                            {recipe?.ingredients.map((ingredient, index) => (
                                <li key={index}>{ingredient}</li>
                            ))}
                        </ul>
                        <h2 className="text-xl font-bold mt-5">Modo de preparo</h2>
                        {recipe?.instructions.map((instruction, index) => (
                            <p key={index}>{instruction}</p>
                        ))}
                        {recipe?.notes && recipe?.notes.length > 0 && (
                            <>
                                <h3 className="text-lg font-bold mt-5">Observações ❗</h3>
                                {recipe.notes.map((note, index) => (
                                    <p key={index}>{note}</p>
                                ))}
                            </>
                        )}
                        {recipe?.suggestions && recipe.suggestions.length > 0 && (
                            <>
                                <h3 className="text-lg font-bold mt-5">Sugestões</h3>
                                {recipe.suggestions.map((suggestion, index) => (
                                    <p key={index}>{suggestion}</p>
                                ))}
                            </>
                        )}
                        <a 
                            className="mt-6 text-sky-600 flex" 
                            target="_blank" 
                            href={`http://www.youtube.com/results?search_query=${recipe?.title}`}>
                                Buscar por vídeos sobre a receita
                        </a>
                    </div>
                    <div className="flex items-center justify-center w-full gap-2 mt-6 fixed bottom-0 bg-white pt-4 pb-4 border-t border-gray-300">
                        <Button onClick={handleGetRecipe}>Sugerir outra receita</Button>
                        <Link href="/" className="ml-5">Alterar ingredientes</Link>
                    </div>
                </>
            )}
        </main>
    )
}