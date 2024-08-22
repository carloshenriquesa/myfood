import { useContext, useRef, useState } from "react";
import { FormContext } from "@/context/FormContext";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
  } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { toast } from 'react-toastify';
import { IngredientProps } from "@/context/FormContext";
import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
    ingredient: z.string().min(1, {
        message: "Cadê o ingrediente?",
    }),
    quantity: z.string().min(1, {
        message: "Cadê a quantidade?",
    }),
    unity: z.string().min(1, {
        message: "Cadê a unidade?",
    }),
}) satisfies z.ZodType<IngredientProps>;

export default function IngredientForm() {
    const { addIngredient } = useContext(FormContext);

    const form = useForm<IngredientProps>(
        {
            resolver: zodResolver(formSchema),
            defaultValues: {
                ingredient: "",
                quantity: "",
                unity: "",
            },
        }
    );
    
    async function handleSuggestUnity(data: IngredientProps) {
        const response = await axios.post('/api/weight-measurements', data);
        const { weightMeasurements } = response.data;
        form.setValue('unity', weightMeasurements);
    }
    
    async function handleAddIngredient(data: IngredientProps) {
        const loading = toast.loading('Adicionando ingrediente...');
        await axios.post('/api/ingredient', data)
        .then(() => {
            addIngredient(data);

            toast.update(loading, {
                render: `${data.ingredient} incluído com sucesso! 😃`,
                type: 'success',
                isLoading: false,
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        })
        .catch(() => {
            toast.update(loading, {
                render: `${data.ingredient} não é alimento!`,
                type: 'error',
                isLoading: false,
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            })
        });

        form.setValue('ingredient', '');
        form.setValue('quantity', '');
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAddIngredient)} className="flex flex-row max-sm:flex-col gap-2">
                <FormField
                    control={form.control}
                    name="ingredient"
                    render={({ field }) => (
                        <FormItem className="flex w-full">
                            <FormControl>
                                <Input 
                                    placeholder="Ingrediente" 
                                    {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                        <FormItem className="flex w-full">
                            <FormControl>
                                <Input
                                    placeholder="Quantidade"
                                    {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="unity"
                    render={({ field }) => (
                        <FormItem className="flex w-full">
                            <FormControl>
                                <Select onValueChange={field.onChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Unidade de medida" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="unit">unidade</SelectItem>
                                        <SelectItem value="mg">miligramas</SelectItem>
                                        <SelectItem value="g">gramas</SelectItem>
                                        <SelectItem value="kg">quilogramas</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit">Adicionar</Button>
            </form>
        </Form>
    )
}
