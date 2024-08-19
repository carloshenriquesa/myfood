import type { NextApiRequest, NextApiResponse } from 'next'
import { GoogleGenerativeAI } from "@google/generative-ai";
import { IngredientProps } from "@/context/FormContext";


const apiKey = process.env.GEMINI_API_KEY;

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(apiKey || '');

// The Gemini 1.5 models are versatile and work with most use cases
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
 
type ResponseData = {
  isFood: boolean
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
    if (req.method === 'POST') {
        const { ingredient, quantity, unity } = req.body as IngredientProps;
        const prompt = `
                            Com base no ingrediente ${ingredient}, identifique se, de fato o ingrediente é um alimento ou não. Caso não seja um alimento,
                            retorne, em formato JSON apenas o valor booleano false. Caso seja um alimento, retorne como true.
                            Siga o exemplo abaixo:
                            {
                                "isFood": true
                            }
                        `
    
        const result = await model.generateContent(prompt);
        const response = result.response.text();
        const responseJSON = JSON.parse(response.replaceAll("`", "").replace("json", "")) as ResponseData;
        res.status(200).json({ isFood: responseJSON.isFood });
    }
}