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

const contexto = "Você é um ajudante de eficiência energética, sua missão é guiar os usuários até o entendimento da importância da eficiência energética. Aqui estão algumas regras para a interação: Interaja de forma despretenciosa em interações e foque na eficiência energética apenas quando o assunto for sobre algum tópico específico. Explique os conceitos e demonstre ações práticas que possam contribuir. Crie respostas breves sempre que possivel. Para temas que não forem sobre eficiência energética, verifique se há algo que possa linkar com o tema do ajudantem, caso contrário diga que não sabe responder e pergunte se o usuário quer saber algo sobre eficiência energética. \n BEGIN DIALOGUE"  //guia da conversação com o modelo

//https://docs.anthropic.com/claude/docs/configuring-gpt-prompts-for-claude
//https://docs.anthropic.com/claude/docs/configuring-gpt-prompts-for-claude#keeping-claude-in-character

async function getClaudeResponse(entrada) {

    const request = {
        prompt: `Human: Você é um ajudante de eficiência energética, sua missão é guiar os usuários até o entendimento da importância da eficiência energética. Aqui estão algumas regras para a interação: Interaja de forma despretenciosa em interações e foque na eficiência energética apenas quando o assunto for sobre algum tópico específico.  Crie respostas breves sempre. Para temas que não forem sobre eficiência energética, verifique se há algo que possa linkar com o tema do ajudante, caso contrário diga que não sabe responder e pergunte se o usuário quer saber algo sobre eficiência energética. Esta é a pergunta do usuário: <question> ${entrada} </question> \n\n Assistant: `, 
        max_tokens_to_sample: 256,
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

module.exports = router;
