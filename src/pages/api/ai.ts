import { GoogleGenerativeAI } from "@google/generative-ai";
import { IngredientProps } from "@/context/FormContext";
import { RecipeProps } from "..";

const apiKey = process.env.GEMINI_API_KEY;

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(apiKey || '');

// The Gemini 1.5 models are versatile and work with most use cases
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function getRecipe(list: IngredientProps[]) {
  const prompt = `
                    Você é uma experiente chefe de cozinha.
                    Indique uma receita que tenha os seguintes ingredientes considerando o limite de quantidade de cada ingrediente:
                    ${list.map(item => `${item.quantity}${item.unity} de ${item.ingredient}`)}
                    Priorize receitas que tenham vídeos no YouTube.
                    Caso não tenha uma receita que combine com todos os ingredientes, indique uma receita que tenha o maior número de ingredientes possíveis.
                    Caso a quantidade de algum ingrediente seja muito pequena, indique uma receita que tenha o ingrediente em maior quantidade e avise o usuário no campo de anotações.
                    Caso não possua algum ingrediente da receita, sugerir uma lista de compras. Porém a lista deve conter o menor número de ingredientes possíveis.
                    A resposta deve vir apenas em formato JSON, seguindo o exemplo abaixo:
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
                    }`

  const result = await model.generateContent(prompt);
  const response = result.response.text();
  const responseJSON = JSON.parse(response.replaceAll("`", "").replace("json", "")) as RecipeProps;

  return responseJSON;
}
