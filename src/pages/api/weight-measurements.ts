import type { NextApiRequest, NextApiResponse } from 'next';
import model from "@/lib/gemini";
import { IngredientProps } from "@/context/FormContext";

type ResponseData = {
    weightMeasurements: boolean
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
    if (req.method === 'POST') {
        const { ingredient, quantity, unity } = req.body as IngredientProps;
        const prompt = `
                        Com base no ingrediente ${ingredient} e na quantidade ${quantity}, sugira uma unidade de medida adequada. 
                        Retorne a resposta em formato JSON apenas com a unidade de medida.
                        Siga o exemplo abaixo:
                        # ingrediente: ovo
                        # quantidade: 1
                        Resposta:
                        {
                            "weightMeasurements": "unit"
                        }
                    `
  
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    const responseJSON = JSON.parse(response.replaceAll("`", "").replace("json", "")) as ResponseData;
        res.status(200).json({ weightMeasurements: responseJSON.weightMeasurements });
    }
}