import { Button } from "../ui/button";
import { RecipeProps } from "@/pages";

interface RecipeComponentProps {
    recipe: RecipeProps;
    handleGetRecipe: () => void;
    handleReset: () => void;
}

export default function Recipe({ recipe, handleGetRecipe, handleReset }: RecipeComponentProps) {
    return (
        <div className="mt-10">
            <h1 className="text-2xl font-extrabold">{ recipe?.title }</h1>
            <h2 className="text-xl font-bold mt-5">Ingredientes</h2>
            <ul>
                { recipe?.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                ))}
            </ul>
            <h2 className="text-xl font-bold mt-5">Modo de preparo</h2>
            { recipe?.instructions.map((instruction, index) => (
                <p key={index}>{instruction}</p>
            ))}
            <h3 className="text-lg font-bold mt-5">Observações ❗</h3>
            { recipe?.notes.map((note, index) => (
                <p key={index}>{note}</p>
            ))}
            { recipe?.suggestions.length > 0 && (
                <>
                    <h3 className="text-lg font-bold mt-5">Sugestões</h3>
                    { recipe?.suggestions.map((suggestion, index) => (
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
            <div className="flex max-w-3xl:flex-row justify-between max-sm:flex-col gap-2 mt-6">
                <Button onClick={handleGetRecipe}>Sugerir outra receita</Button>
                <Button variant="ghost" onClick={handleReset}>Limpar tudo</Button>
            </div>
        </div>
    );
}