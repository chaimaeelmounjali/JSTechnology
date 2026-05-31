// ─── game.js ─────────────────────────────────────────────────────────────────
// Logique du jeu : construction des Pokémon et mécaniques de combat
// ─────────────────────────────────────────────────────────────────────────────

const { getPokemonData, getMoveData } = require('./api');

const MAX_HP    = 300;
const MAX_MOVES = 5;

/**
 * Construit un objet Pokémon prêt au combat en récupérant ses données depuis l'API
 * @param {string} name - Nom du Pokémon
 * @returns {Promise<object>}
 */
async function buildPokemon(name) {
    const data = await getPokemonData(name);

    // Mélange les attaques pour de la variété à chaque partie
    const allMoveUrls = [...data.moves]
        .sort(() => Math.random() - 0.5)
        .map((m) => m.move.url);

    const moves = [];
    const BATCH_SIZE = 10;

    // Récupère les attaques par lots jusqu'à trouver MAX_MOVES attaques valides
    for (let i = 0; i < allMoveUrls.length && moves.length < MAX_MOVES; i += BATCH_SIZE) {
        const batch = allMoveUrls.slice(i, i + BATCH_SIZE);

        const details = await Promise.all(
            batch.map((url) => getMoveData(url).catch(() => null))
        );

        for (const m of details) {
            // On garde seulement les attaques qui infligent des dégâts
            if (m && m.power > 0 && m.pp > 0 && m.damage_class?.name !== 'status') {
                moves.push({
                    name:      m.name,
                    power:     m.power,
                    pp:        m.pp,          // PP max
                    currentPP: m.pp,          // PP restants
                    accuracy:  m.accuracy || 100
                });
                if (moves.length >= MAX_MOVES) break;
            }
        }
    }

    return {
        name:      data.name,
        maxHP:     MAX_HP,
        currentHP: MAX_HP,
        moves
    };
}

/**
 * Exécute un tour de combat complet
 *
 * Règles :
 *  1. Les PP sont comparés AVANT d'être consommés (équité pour les deux)
 *  2. Si PP_attaquant < PP_défenseur → l'attaque échoue (règle du TP)
 *  3. Sinon, l'attaque rate si le jet de précision échoue
 *  4. Sinon, les dégâts sont calculés avec une variance de ±15%
 *
 * @param {object} playerPokemon
 * @param {object} playerMove    - Attaque choisie par le joueur
 * @param {object} botPokemon
 * @param {object} botMove       - Attaque choisie par le bot
 * @returns {{ playerResult, botResult, playerPPUsed, botPPUsed }}
 */
function executeTurn(playerPokemon, playerMove, botPokemon, botMove) {
    // ── Sauvegarder les PP AVANT consommation (utilisés pour la comparaison) ──
    const playerPPUsed = playerMove.currentPP;
    const botPPUsed    = botMove.currentPP;

    // ── Consommer les PP (sauf si c'est "Lutte") ──────────────────────────────
    if (!playerMove.isStruggle) {
        playerMove.currentPP = Math.max(0, playerMove.currentPP - 1);
    }
    if (!botMove.isStruggle) {
        botMove.currentPP = Math.max(0, botMove.currentPP - 1);
    }

    // ── Attaque du joueur ─────────────────────────────────────────────────────
    const playerResult = resolveAttack(
        playerMove, botPokemon, playerPPUsed, botPPUsed
    );

    // ── Attaque du bot (seulement s'il est encore en vie) ─────────────────────
    let botResult = null;
    if (botPokemon.currentHP > 0) {
        botResult = resolveAttack(
            botMove, playerPokemon, botPPUsed, playerPPUsed
        );
    }

    return { playerResult, botResult, playerPPUsed, botPPUsed };
}

/**
 * Résout une attaque individuelle
 * @param {object} move         - Attaque utilisée
 * @param {object} defender     - Pokémon défenseur
 * @param {number} myPP         - PP de l'attaquant AVANT consommation
 * @param {number} enemyPP      - PP du défenseur AVANT consommation
 * @returns {{ hit: boolean, reason?: string, damage: number }}
 */
function resolveAttack(move, defender, myPP, enemyPP) {
    // Règle 1 : Si PP attaquant < PP ennemi → attaque bloquée (règle du TP)
    if (!move.isStruggle && myPP < enemyPP) {
        return { hit: false, reason: 'pp_blocked', damage: 0 };
    }

    // Règle 2 : Jet de précision (1-100)
    const accuracyRoll = Math.floor(Math.random() * 100) + 1;
    if (accuracyRoll > move.accuracy) {
        return { hit: false, reason: 'missed', damage: 0 };
    }

    // Règle 3 : Calcul des dégâts avec variance ±15%
    // Mise à l'échelle × 0.5 pour des combats qui durent 5-10 tours sur 300 PV
    const variance = 0.85 + Math.random() * 0.30;
    const damage   = Math.max(1, Math.floor(move.power * 0.5 * variance));

    defender.currentHP = Math.max(0, defender.currentHP - damage);

    return { hit: true, damage };
}

module.exports = { buildPokemon, executeTurn, MAX_HP };
