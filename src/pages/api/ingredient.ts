import type { NextApiRequest, NextApiResponse } from 'next'
import model from "@/lib/gemini";
import { IngredientProps } from "@/context/FormContext";
 
type ResponseData = {
  success: boolean
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
                                "success": true
                            }
                        `
    
        const result = await model.generateContent(prompt);
        const response = result.response.text();
        const responseJSON = JSON.parse(response.replaceAll("`", "").replace("json", "")) as ResponseData;
        if (responseJSON.success) res.status(200).json({ success: responseJSON.success });
        res.status(400).json({ success: responseJSON.success });
    }
}