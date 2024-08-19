import { Button } from "../ui/button";
import { TrashIcon } from "@radix-ui/react-icons";
import { useContext } from "react";
import { FormContext } from "@/context/FormContext";
import { IngredientProps } from "@/context/FormContext";

export default function IngredientList() {
    const { ingredientList, deleteIngredient } = useContext(FormContext);
    
    function handleDeleteItem(ingredient: IngredientProps) {
        deleteIngredient(ingredient);
    }

    function handleTranslateUnit(quantity: string, unit: string) {
        if (unit === "unit") {
            if (Number(quantity) > 1) return " unidades de ";
            return " unidade de ";
        }
        return `${unit} de `;
    }

    return (
        <ul className="flex flex-col gap-2 mt-5">
            {ingredientList.map((ingredient, index) => (
                <li key={index}>
                    <p className="flex justify-between items-center hover:bg-gray-100 rounded-md p-2">
                        {ingredient.quantity}{handleTranslateUnit(ingredient.quantity, ingredient.unity)}{ingredient.ingredient}
                        <Button
                            variant="destructive"
                            size="icon"
                            className="ml-2"
                            onClick={() => handleDeleteItem(ingredient)}
                            onKeyDown={(e) => e.key === "Enter" && handleDeleteItem(ingredient)}>
                            <TrashIcon />
                        </Button>
                    </p>
                </li>
            ))}
        </ul>
    );
}