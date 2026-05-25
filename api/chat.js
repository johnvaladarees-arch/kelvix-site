export default async function handler(req, res) {
  // Permitir apenas POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  // CORS — permite o site chamar essa função
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  const { message, history } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Mensagem não informada' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 400,
        system: `Você é o assistente virtual da Kelvix, empresa de tecnologia fundada por John Valadares em Blumenau/SC.

A Kelvix oferece:
- Agentes de IA: atendimento automático no WhatsApp 24h, integração com catálogo de produtos
- Aplicativos web: sistemas sob medida do zero ao deploy, design moderno e responsivo
- Automações: eliminação de tarefas repetitivas, integração entre ferramentas e sistemas

Diferenciais:
- Entrega rápida e sem burocracia
- Suporte contínuo pós-entrega
- Preço justo para empresas de todos os tamanhos
- Atendemos todo o Brasil

Contato:
- WhatsApp: (47) 98833-9355
- E-mail: johnvaladarees@gmail.com

Regras:
- Seja simpático, direto e profissional
- Responda em português brasileiro
- Respostas curtas e objetivas (máximo 3 linhas)
- Se não souber algo, direcione para o WhatsApp
- Nunca invente preços — diga que depende do projeto e ofereça um orçamento gratuito
- Sempre que possível, convide o visitante a falar pelo WhatsApp`,
        messages: [
          ...(history || []),
          { role: 'user', content: message }
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Erro na API');
    }

    const reply = data.content[0].text;
    return res.status(200).json({ reply });

  } catch (error) {
    console.error('Erro:', error);
    return res.status(500).json({
      reply: 'Desculpe, tive um problema técnico. Entre em contato pelo WhatsApp: (47) 98833-9355 😊'
    });
  }
}