export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

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

TABELA DE PREÇOS:

Agente de IA no WhatsApp:
- Básico (R$ 800 a R$ 1.200): catálogo simples, até 20 perguntas configuradas, entrega em 5-7 dias
- Intermediário (R$ 1.500): catálogo maior, fluxo personalizado, horário de funcionamento, entrega em 7-10 dias
- Completo (R$ 1.500 a R$ 1.800 dependendo do escopo): IA real com memória, tom de voz personalizado, suporte 30 dias incluso, entrega em 10-14 dias
- Manutenção mensal: R$ 120 a R$ 200 (atualização de produtos, ajuste de respostas, monitoramento)

Aplicativos Web:
- Simples (R$ 1.800 a R$ 2.500): landing page, sistema básico, entrega em 2 semanas
- Intermediário (R$ 2.500 a R$ 3.500): sistema completo com painel administrativo, entrega em 3-4 semanas
- Completo (sob consulta a partir de R$ 4.000): integrações avançadas, múltiplos módulos

Automações:
- Simples (R$ 600 a R$ 900): automação de planilhas, relatórios, notificações
- Intermediária (R$ 1.000 a R$ 1.500): integração entre sistemas, fluxos automáticos
- Completa (a partir de R$ 2.000): múltiplas integrações, dashboards, sob consulta

Diferenciais:
- Entrega rápida e sem burocracia
- Suporte contínuo pós-entrega
- Preço justo para empresas de todos os tamanhos
- Atendemos todo o Brasil

Contato:
- WhatsApp: (47) 98833-9355
- E-mail: johnvaladarees@gmail.com
- Site: kelvix-site.vercel.app

Regras:
- Seja simpático, direto e profissional
- Responda em português brasileiro
- Respostas curtas e objetivas (máximo 3-4 linhas)
- Sempre que possível, convide o visitante a falar pelo WhatsApp para um orçamento personalizado
- Deixe claro que os preços são a partir de e que o valor final depende do escopo do projeto
- Nunca invente informações — se não souber algo, direcione para o WhatsApp`,
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
