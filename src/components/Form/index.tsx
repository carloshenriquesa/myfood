import { useContext, useRef, useState, FormEvent } from "react";
import { FormContext } from "@/context/FormContext";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { IngredientProps } from "@/context/FormContext";
import axios from "axios";

export default function Form() {
    const { addIngredient } = useContext(FormContext);
    const [ingredient, setIngredient] = useState<string>("");
    const [quantity, setQuantity] = useState<string>("");
    const [unity, setUnity] = useState<string>("");
    const [isFood, setIsFood] = useState<boolean>(true);

    const inputRef = useRef<HTMLInputElement>(null);

    function handleAddIngredient(e: FormEvent) {
        e.preventDefault();
        if (ingredient && quantity) {
            const data: IngredientProps = {
                ingredient: ingredient,
                quantity: quantity,
                unity: unity
            };

            addIngredient(data);
            setIngredient("");
            setQuantity("");
            setUnity("");
            inputRef.current?.focus();
        }
    }

    async function handleValidateIngredient() {
        if (ingredient) {
            const response = await axios.post('/api/ingredient', { ingredient, quantity, unity });
            const { isFood } = response.data;
            setIsFood(isFood);
        }
    }

    async function handleSuggestUnity() {
        if (ingredient && quantity) {
            const response = await axios.post('/api/weight-measurements', { ingredient, quantity, unity });
            const { weightMeasurements } = response.data;
            setUnity(weightMeasurements);
        }
    }

    return (
        <form onSubmit={handleAddIngredient} className="flex flex-row max-sm:flex-col gap-2">
            <Input 
                ref={inputRef} 
                placeholder="Ingrediente" 
                value={ingredient} 
                onChange={(e) => setIngredient(e.target.value)}
                errorMessage={isFood ? "" : "Ingrediente inválido"}
                onBlur={() => handleValidateIngredient()}
            />
            <Input 
                placeholder="Quantidade" 
                type="number" 
                value={quantity} 
                disabled={!isFood || !!!ingredient}
                onChange={(e) => setQuantity(e.target.value)} 
                onBlur={() => handleSuggestUnity()}
                errorMessage=""
            />
            <Select 
                value={unity} 
                onValueChange={(e) => setUnity(e)} 
                disabled={!isFood || !!!ingredient || !!!quantity || !!!unity}>
                <SelectTrigger>
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="unit">unidade</SelectItem>
                    <SelectItem value="mg">miligramas</SelectItem>
                    <SelectItem value="g">gramas</SelectItem>
                    <SelectItem value="kg">quilogramas</SelectItem>
                </SelectContent>
            </Select>
            <Button 
                type="submit" 
                disabled={!isFood|| !!!quantity || !!!unity}>Adicionar</Button>
        </form>
    )
}
