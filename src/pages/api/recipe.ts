import type { NextApiRequest, NextApiResponse } from 'next'
import { RecipeProps } from '@/pages/receita';
import model from '@/lib/gemini';
import { IngredientProps } from "@/context/FormContext";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RecipeProps>
) {
    if (req.method === 'POST') {
        try {
            const list = req.body as IngredientProps[];
            const prompt = `
                        ## Você é uma experiente chefe de cozinha.
                        ## Indique uma receita que tenha os seguintes ingredientes considerando o limite de quantidade de cada ingrediente:
                        ${list.map(item => `${item.quantity}${item.unity} de ${item.ingredient}`)}
                        ### Priorize receitas que tenham vídeos no YouTube.
                        ### Caso não tenha uma receita que combine com todos os ingredientes, indique uma receita que tenha o maior número de ingredientes possíveis.
                        ### Caso a quantidade de algum ingrediente seja muito pequena, indique uma receita que tenha o ingrediente em maior quantidade e avise o usuário no campo de anotações.
                        ### Caso não possua algum ingrediente da receita, sugerir uma lista de compras. Porém a lista deve conter o menor número de ingredientes possíveis.
                        ### A resposta deve vir apenas em formato JSON, seguindo o exemplo abaixo:
                            {
                                "title": "Receita de bolo de chocolate",
                                "ingredients": [
                                    "200g de farinha de trigo", 
                                    "100g de açúcar", "100g de chocolate em pó", 
                                    "100g de manteiga", 
                                    "100g de ovos", 
                                    "100g de leite", 
                                    "100g de fermento em pó", 
                                    "100g de chocolate em barra"
                                ],
                                "instructions": [
                                    "Misture todos os ingredientes em uma tigela.",
                                    "Leve ao forno preaquecido a 180°C por 30 minutos.",
                                    "Sirva em seguida."
                                ],
                                "notes": ["Este bolo é muito bom!"],
                                "suggestions": [
                                    "Você pode adicionar 100g de chocolate em barra para dar um toque extra de chocolate.",
                                    "Você pode adicionar 100g de chocolate em barra para dar um toque extra de chocolate."
                                ]
                            }
                        
                        ### Se por acaso não receba qualquer ingrediente, retorne um JSON com os seguintes campos:
                            {
                                "error": true
                            }
                        `
    
            const result = await model.generateContent(prompt);
            const response = result.response.text();
            console.log(response);
            const { ingredients, instructions, notes, suggestions, title } = JSON.parse(response.replaceAll("`", "").replace("json", "")) as RecipeProps;
    
            res.status(200).json({ 
                title,
                ingredients,
                instructions,
                notes,
                suggestions
            });
        } catch {
            res.status(500).json({
                title: '',
                ingredients: [],
                instructions: [],
                notes: [],
                suggestions: []
            });
        }
    }
}