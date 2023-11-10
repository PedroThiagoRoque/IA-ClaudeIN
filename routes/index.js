//ROUTES
const express = require('express');
const router = express.Router();
const { BedrockRuntimeClient, InvokeModelCommand } = require("@aws-sdk/client-bedrock-runtime");
require('dotenv').config();

const cliente = new BedrockRuntimeClient({ 
    region: "us-east-1",
        apiVersion: '2023-09-30',
        credentials:{
            accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? ""
        } 
});

async function getClaudeResponse(entrada) {

    const request = {
        prompt: `Human:${entrada} \n\n Assistant:`,
        max_tokens_to_sample: 1000,
        temperature: 0.5,
        top_k: 250,
        top_p: 1,
      };

      const input = {
        body: JSON.stringify(request),
        contentType: "application/json",
        accept: "application/json",
        modelId: "anthropic.claude-v2",
      };
    
    try {
        const response = await cliente.send(new InvokeModelCommand(input));
        const completion = JSON.parse(
            Buffer.from(response.body).toString("utf-8")
          );
            console.log(completion);
        return completion;
    }  
    catch (error) {
        console.error('Erro ao comunicar com a Bedrock API:', error);
        return { choices: [{ message: { content: 'Desculpe, não foi possível obter uma resposta. :C' } }] };
    }

}

router.post('/ask', async (req, res) => {

    const userInput = req.body.userInput;
    const claudeResponse = await getClaudeResponse(userInput);

    res.json({ claudeResponse });
});

router.get('/', (req, res) => {
    res.render('chat/chat', { response: '' });
    
});





/*const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });



router.post('/ask', async (req, res) => {
    const userInput = req.body.userInput;

    const openAiResponse = await getOpenAiResponse(userInput);

    res.json({ response: openAiResponse.choices[0].message.content });
});

async function getOpenAiResponse(prompt) {
    try {
        const response = await openai.chat.completions.create({
            messages: [
                { role: "system", content: "Você é um ajudante de eficiência energética, sua missão é guiar os usuários até o entendimento da importância da eficiência energética. Explique os conceitos e demonstre ações práticas que possam contribuir. Seja paciente, descomplicado e cuidadoso nas explicações. Crie respostas breves sempre que possivel, mantenha o tema da conversa sobre eficiência energética. Para temas que não forem sobre eficiência energética responda que não sabe responder e direcione para algo sobre eficiência energética." }, //guia inicial da conversação com o modelo
                { role: "user", content: prompt } //prompt do usuário
            ],
            model: "gpt-3.5-turbo",
        });
        return response;
    } catch (error) {
        console.error('Erro ao comunicar com a OpenAI API:', error);
        return { choices: [{ message: { content: 'Desculpe, não foi possível obter uma resposta. :C' } }] };
    }
}*/

module.exports = router;
