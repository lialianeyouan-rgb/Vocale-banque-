// server.js

const express = require('express');
const { spawn } = require('child_process');
const VoiceResponse = require('twilio').twiml.VoiceResponse; 
// Note: banking logic would need to be extracted into its own module in a real app.
// For this example, we assume it's available. We'll create a placeholder.

const app = express();
// Twilio sends data as x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Placeholder for bank logic and data
const MOCK_USERS = {
  'user-001': { id: 'user-001', name: 'Alex', balance: 75500 },
  'awa': { name: 'Awa', balance: 10000 },
  'moussa': { name: 'Moussa', balance: 25000 },
};

function handleBankAction(action, db) {
    if (action.name === 'getBalance') {
        return { success: true, message: `Votre solde est de ${db['user-001'].balance} francs.` };
    }
    if (action.name === 'transferFunds') {
        const { amount, recipientName } = action.args;
        const recipientKey = recipientName.toLowerCase();
        if (!db[recipientKey]) {
            return { success: false, message: `Désolé, je ne trouve pas ${recipientName}.` };
        }
        if (db['user-001'].balance < amount) {
             return { success: false, message: `Solde insuffisant pour ce virement.` };
        }
        db['user-001'].balance -= amount;
        db[recipientKey].balance += amount;
        return { success: true, message: `Le virement de ${amount} francs à ${recipientName} a été effectué.`};
    }
    return { success: false, message: "Action non reconnue." };
}
// End placeholder

/**
 * Exécute un script Python et retourne sa sortie.
 * @param {string} scriptPath - Le chemin du script Python.
 * @param {string[]} args - Les arguments à passer au script.
 * @returns {Promise<string>} La sortie du script.
 */
function runPythonScript(scriptPath, args) {
    return new Promise((resolve, reject) => {
        // Exécute le script avec l'interpréteur Python (assurez-vous que 'python3' est dans le PATH)
        const process = spawn('python3', [scriptPath, ...args]);
        let output = '';
        let errorOutput = '';

        process.stdout.on('data', (data) => {
            output += data.toString().trim();
        });

        process.stderr.on('data', (data) => {
            errorOutput += data.toString().trim();
        });

        process.on('close', (code) => {
            if (code !== 0) {
                // Si le script s'est terminé avec une erreur
                reject(new Error(`Script ${scriptPath} terminé avec le code ${code}. Erreur: ${errorOutput}`));
            } else {
                resolve(output);
            }
        });
        
        process.on('error', (err) => {
             reject(new Error(`Erreur de lancement du processus Python: ${err.message}`));
        });
    });
}


app.post('/ivr/incoming', async (req, res) => {
    // 🚨 IMPORTANT: Récupérer l'URL de l'audio et l'ID de session du fournisseur VoIP
    // Pour cet exemple, nous simulons. En réalité, vous téléchargerez l'audio du req.body.
    // NOTE: This endpoint now expects a `Record` action from Twilio to process speech.
    const twiml = new VoiceResponse();
    
    // Check if the request contains speech-to-text results from Twilio
    if (req.body.SpeechResult) {
        const userText = req.body.SpeechResult;
        const sessionId = req.body.CallSid || 'test_session_' + Date.now();
        let responseMessage = "Je n'ai pas compris. Veuillez réessayer.";
        
        console.log("Transcription (from Twilio):", userText);

        try {
            // 2. NLU: Analyser l'intention
            const actionJSON = await runPythonScript('./nlu_service.py', [userText]);
            const action = JSON.parse(actionJSON);
            console.log("Action NLU:", action);

            if (action && action.name) {
                // 3. Exécuter la Logique Bancaire
                const actionResult = handleBankAction(action, MOCK_USERS);
                responseMessage = actionResult.message;
            }

            // 4. TTS: Générer le fichier audio de réponse
            const audioFileName = await runPythonScript('./tts_service.py', [responseMessage, sessionId]);
            console.log("Audio généré:", audioFileName);

             if (audioFileName.startsWith("ERROR_TTS")) {
                throw new Error("Erreur de synthèse vocale.");
            }

            // You need to serve the 'tts_output' directory publicly for Twilio to access it.
            const publicAudioUrl = `YOUR_PUBLIC_URL/${audioFileName}`; // ⚠️ REMPLACEZ PAR VOTRE URL PUBLIQUE (ex: ngrok)
            twiml.play({}, publicAudioUrl);

        } catch (error) {
            console.error("Erreur complète RVI:", error.message);
            twiml.say("Une erreur système est survenue. Nous ne pouvons pas traiter votre demande.");
        }
        
    } else {
        // If no speech result, this is the initial call. Welcome and gather input.
        twiml.say({ voice: 'alice', language: 'fr-FR' }, 'Bienvenue à la Banque Vocale NSIA. Dites votre commande après le bip.');
        // Record the user's speech and post the result to this same webhook
        twiml.record({
            action: '/ivr/incoming',
            maxLength: 5, // record for up to 5 seconds of silence
            trim: 'trim-silence'
        });
    }

    res.type('text/xml');
    res.send(twiml.toString());
});


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Serveur RVI autonome démarré sur le port ${PORT}`);
    console.log('Assurez-vous que ce serveur est accessible publiquement (via ngrok, par exemple) pour que Twilio puisse y accéder.');
});
