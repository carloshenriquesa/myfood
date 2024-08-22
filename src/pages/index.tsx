import { Inter } from "next/font/google";
import Head from "next/head";
import { Button } from "@/components/ui/button";
import { useContext } from "react";
import IngredientList from "@/components/IngredientList";
import Form from "@/components/Form";
import { FormContext } from "@/context/FormContext";
import { useRouter } from "next/router";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
    const { ingredientList } = useContext(FormContext);
    const router = useRouter();

    function goToRecipe() {
        router.push('/receita');
    }

    return (
        <main className={`flex min-h-screen flex-col max-sm:p-8 pt-6 max-w-3xl mt-0 mb-0 ml-auto mr-auto ${inter.className}`}>
            <Head>
                <title>Receita de hoje</title>
            </Head>

            <h1 className="text-4xl font-extrabold mb-5">O que temos na geladeira? 🤔</h1>
            
            <Form />

            <IngredientList />

            <Button className="mt-6" disabled={!!!ingredientList.length} onClick={goToRecipe}>Sugerir receita</Button>
        </main>
    );
}
