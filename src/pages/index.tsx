import { Inter } from "next/font/google";
import Head from "next/head";
import { Button } from "@/components/ui/button";
import { useState, useContext } from "react";
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import Recipe from "@/components/Recipe";
import IngredientList from "@/components/IngredientList";
import Form from "@/components/Form";
import { FormContext } from "@/context/FormContext";
import axios from "axios";

const inter = Inter({ subsets: ["latin"] });

export interface RecipeProps {
    title: string
    ingredients: string[]
    instructions: string[]
    notes: string[]
    suggestions: string[]
}

export default function Home() {
    const { ingredientList, resetIngredientList } = useContext(FormContext);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [recipe, setRecipe] = useState<RecipeProps>();

    async function handleGetRecipe() {
        setIsLoading(true);
        const response = await axios.post('/api/recipe', ingredientList);
        const recipe = response.data as RecipeProps;
        setRecipe(recipe);
        setIsLoading(false);
    }

    function handleReset() {
        resetIngredientList();
        setRecipe(undefined);
    }

    return (
        <main className={`flex min-h-screen flex-col max-sm:p-8 pt-6 max-w-3xl mt-0 mb-0 ml-auto mr-auto ${inter.className}`}>
            <Head>
                <title>Receita de hoje</title>
            </Head>

            <h1 className="text-4xl font-extrabold mb-5">O que temos na geladeira? 🤔</h1>
            
            <Form />

            <IngredientList />

            <Button className="mt-6" disabled={!!!ingredientList.length} onClick={handleGetRecipe}>Sugerir receita</Button>

            {isLoading && 
                <>
                    <Skeleton height={30} className="mt-6 mb-4" />
                    <Skeleton height={20} count={5} />
                </>
            }

            {!isLoading && recipe &&
                <Recipe recipe={recipe} handleGetRecipe={() => handleGetRecipe()} handleReset={handleReset} />
            }
        </main>
    );
}
