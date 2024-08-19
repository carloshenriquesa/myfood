import { createContext, ReactNode, useState } from "react";

export interface IngredientProps {
    ingredient: string;
    quantity: string;
    unity: string;
}

interface FormContextData {
    ingredientList: IngredientProps[];
    addIngredient: (data: IngredientProps) => void;
    deleteIngredient: (data: IngredientProps) => void;
    resetIngredientList: () => void;
}

export const FormContext = createContext({} as FormContextData);

export function FormProvider({ children }: { children: ReactNode }) {
    const [ingredientList, setIngredientList] = useState<IngredientProps[]>([]);

    function addIngredient({ingredient, quantity, unity}: IngredientProps) {
        const data: IngredientProps = {
            ingredient: ingredient,
            quantity: quantity,
            unity: unity
        };

        setIngredientList(oldList => [...oldList, data]);        
    }

    function deleteIngredient(ingredient: IngredientProps) {
        setIngredientList(oldList => oldList.filter(item => item !== ingredient))
    }

    function  resetIngredientList() {
        setIngredientList([]);
    }

    return (
        <FormContext.Provider value={{ingredientList, addIngredient, deleteIngredient, resetIngredientList}}>
            {children}
        </FormContext.Provider>
    );
}