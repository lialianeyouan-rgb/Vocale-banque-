
import { Chat, FunctionCall, GenerateContentResponse, Type } from '@google/genai';
import { BankActionResult } from '../types';

const tools = [
  {
    functionDeclarations: [
      {
        name: 'getBalance',
        description: 'Obtenir le solde actuel du compte de l\'utilisateur.',
        parameters: { type: Type.OBJECT, properties: {} }
      },
      {
        name: 'getStatement',
        description: 'Obtenir l\'historique des transactions récentes de l\'utilisateur.',
        parameters: {
          type: Type.OBJECT,
          properties: {
            limit: {
              type: Type.NUMBER,
              description: 'Le nombre de transactions à récupérer. La valeur par défaut est 3.'
            }
          }
        }
      },
      {
        name: 'transferFunds',
        description: 'Transférer de l\'argent du compte de l\'utilisateur vers un autre compte.',
        parameters: {
          type: Type.OBJECT,
          properties: {
            recipientName: {
              type: Type.STRING,
              description: 'Le nom du destinataire du virement.'
            },
            amount: {
              type: Type.NUMBER,
              description: 'Le montant à transférer.'
            }
          },
          required: ['recipientName', 'amount']
        }
      }
    ]
  }
];

export const getAiResponseAndAction = async (
    chat: Chat, 
    prompt: string,
    handleBankAction: (functionCall: FunctionCall) => BankActionResult
): Promise<{ responseText: string }> => {
    
    let response: GenerateContentResponse = await chat.sendMessage({
        message: prompt,
        config: { tools }
    });

    let functionCalls = response.functionCalls;

    while (functionCalls && functionCalls.length > 0) {
        const call = functionCalls[0];
        const result = handleBankAction(call);

        response = await chat.sendMessage({
            message: '', // The message can be empty when sending tool responses.
            toolResponses: [{
                functionResponse: {
                    name: call.name,
                    response: { result: result.message }
                }
            }]
        });
        
        functionCalls = response.functionCalls;
    }
    
    return { responseText: response.text };
};
