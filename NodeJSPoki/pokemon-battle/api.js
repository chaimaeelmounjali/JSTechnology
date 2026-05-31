// ─── api.js ──────────────────────────────────────────────────────────────────
// Module pour les appels à l'API PokeAPI
// Utilise le module natif node:https (vu en cours)
// ─────────────────────────────────────────────────────────────────────────────

const https = require('node:https');

/**
 * Récupère du JSON depuis une URL via le module https natif
 * @param {string} url
 * @returns {Promise<object>}
 */
function fetchJSON(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let raw = '';
            res.on('data', (chunk) => { raw += chunk; });
            res.on('end', () => {
                try {
                    resolve(JSON.parse(raw));
                } catch (e) {
                    reject(new Error(`Erreur parsing JSON depuis ${url}: ${e.message}`));
                }
            });
        }).on('error', (err) => {
            reject(new Error(`Erreur réseau: ${err.message}`));
        });
    });
}

/**
 * Récupère la liste des Pokémon disponibles
 * @param {number} limit
 * @returns {Promise<Array<{name: string, url: string}>>}
 */
async function getPokemonList(limit = 50) {
    const data = await fetchJSON(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=0`);
    return data.results;
}

/**
 * Récupère les données complètes d'un Pokémon par nom ou ID
 * @param {string|number} nameOrId
 */
async function getPokemonData(nameOrId) {
    return await fetchJSON(`https://pokeapi.co/api/v2/pokemon/${nameOrId}`);
}

/**
 * Récupère les données d'une attaque via son URL
 * @param {string} url
 */
async function getMoveData(url) {
    return await fetchJSON(url);
}

module.exports = { getPokemonList, getPokemonData, getMoveData };
