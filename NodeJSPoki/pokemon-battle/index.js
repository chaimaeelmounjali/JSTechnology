#!/usr/bin/env node
// ─── index.js ────────────────────────────────────────────────────────────────
// Point d'entrée du jeu - Boucle principale et interactions CLI
// Utilise: CommonJS · node:https · inquirer (npm) · modules locaux
// ─────────────────────────────────────────────────────────────────────────────

const inquirer = require('inquirer');

const { getPokemonList }                                      = require('./api');
const { buildPokemon, executeTurn }                           = require('./game');
const { printTitle, printBattleStatus, printMovesStatus,
        printTurnResult, capitalize }                         = require('./display');

// ─── Utilitaires ─────────────────────────────────────────────────────────────

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// ─── Sélection du Pokémon ────────────────────────────────────────────────────

async function selectPokemon(pokemonList) {
    const choices = pokemonList.map((p) => ({
        name:  capitalize(p.name),
        value: p.name,
    }));

    const { choice } = await inquirer.prompt([
        {
            type:     'list',
            name:     'choice',
            message:  '🎮 Choisissez votre Pokémon :',
            choices,
            pageSize: 15,
        },
    ]);

    return choice;
}

// ─── Sélection de l'attaque du joueur ────────────────────────────────────────

async function selectAttack(pokemon) {
    const available = pokemon.moves.filter((m) => m.currentPP > 0);

    // Plus aucune attaque disponible → Lutte
    if (available.length === 0) {
        console.log('\n  ⚠️  Tous vos PP sont épuisés ! Vous utilisez \x1b[33mLUTTE\x1b[0m !');
        return {
            name:       'lutte',
            power:      50,
            pp:         1,
            currentPP:  1,
            accuracy:   100,
            isStruggle: true,
        };
    }

    // Affiche d'abord l'état complet de toutes les attaques
    printMovesStatus(pokemon);

    const { move } = await inquirer.prompt([
        {
            type:    'list',
            name:    'move',
            message: '⚔️  Quelle attaque utilisez-vous ?',
            choices: available.map((m) => ({
                name:  `${m.name.padEnd(24)}PWR:${String(m.power).padStart(4)} | PP: ${m.currentPP}/${m.pp} | ACC: ${m.accuracy}%`,
                value: m,
            })),
        },
    ]);

    return move;
}

// ─── Sélection aléatoire du bot ──────────────────────────────────────────────

function getBotMove(pokemon) {
    const available = pokemon.moves.filter((m) => m.currentPP > 0);

    if (available.length === 0) {
        return {
            name:       'lutte',
            power:      50,
            pp:         1,
            currentPP:  1,
            accuracy:   100,
            isStruggle: true,
        };
    }

    // Choix aléatoire parmi les attaques disponibles
    return available[Math.floor(Math.random() * available.length)];
}

// ─── Point d'entrée principal ─────────────────────────────────────────────────

async function main() {
    printTitle();

    // ── 1. Charger la liste des Pokémon ───────────────────────────────────────
    process.stdout.write('  ⏳ Chargement de la liste Pokémon...');
    let pokemonList;

    try {
        pokemonList = await getPokemonList(50);
        console.log(' ✅\n');
    } catch (err) {
        console.log(`\n  ❌ Erreur API : ${err.message}`);
        console.log('  Vérifiez votre connexion internet et réessayez.');
        process.exit(1);
    }

    // ── 2. Le joueur choisit son Pokémon ──────────────────────────────────────
    const playerName = await selectPokemon(pokemonList);

    process.stdout.write(`\n  ⏳ Chargement de ${capitalize(playerName)}...`);
    let playerPokemon;

    try {
        playerPokemon = await buildPokemon(playerName);
        console.log(` ✅  (${playerPokemon.moves.length} attaques de dégâts trouvées)`);
    } catch (err) {
        console.log(`\n  ❌ Erreur : ${err.message}`);
        process.exit(1);
    }

    if (playerPokemon.moves.length === 0) {
        console.log('\n  ❌ Ce Pokémon n\'a aucune attaque de dégâts disponible.');
        console.log('  Relancez le jeu et choisissez-en un autre.');
        process.exit(1);
    }

    // ── 3. Le bot choisit aléatoirement un autre Pokémon ──────────────────────
    let botData;
    do {
        botData = pokemonList[Math.floor(Math.random() * pokemonList.length)];
    } while (botData.name === playerName);

    process.stdout.write(`  🤖 Le bot choisit : ${capitalize(botData.name)}...`);
    let botPokemon;

    try {
        botPokemon = await buildPokemon(botData.name);

        // Si le bot a tiré un Pokémon sans attaques, on en reprend un autre
        if (botPokemon.moves.length === 0) {
            const fallback = pokemonList.find(
                (p) => p.name !== playerName && p.name !== botData.name
            );
            botPokemon = await buildPokemon(fallback.name);
            botData = fallback;
        }

        console.log(` ✅  (${botPokemon.moves.length} attaques)\n`);
    } catch (err) {
        console.log(`\n  ❌ Erreur bot : ${err.message}`);
        process.exit(1);
    }

    // ── 4. Annonce du combat ───────────────────────────────────────────────────
    await sleep(500);
    console.log('\x1b[33m');
    console.log('  ⚡ ' + '━'.repeat(46) + ' ⚡');
    console.log(
        `       ${capitalize(playerPokemon.name).padEnd(18)} ` +
        `\x1b[31mVS\x1b[33m ` +
        `${capitalize(botPokemon.name)}`
    );
    console.log('  ⚡ ' + '━'.repeat(46) + ' ⚡');
    console.log('\x1b[0m');
    console.log('  📜 Règles du combat :');
    console.log('     • Si vos PP < PP ennemis → votre attaque est bloquée');
    console.log('     • Chaque attaque a une précision (chance de rater)');
    console.log('     • Les dégâts varient de ±15% autour de la puissance');
    console.log('     • Les deux joueurs ont 300 PV. Le premier à 0 perd !');
    await sleep(1500);

    // ── 5. Boucle de combat ────────────────────────────────────────────────────
    let turn = 1;

    while (playerPokemon.currentHP > 0 && botPokemon.currentHP > 0) {
        console.log(
            `\n\x1b[36m  ${'═'.repeat(20)} TOUR ${String(turn).padStart(2)} ${'═'.repeat(20)}\x1b[0m`
        );
        printBattleStatus(playerPokemon, botPokemon);

        // Joueur sélectionne son attaque (interactif)
        const playerMove = await selectAttack(playerPokemon);

        // Bot choisit aléatoirement
        const botMove = getBotMove(botPokemon);
        console.log(
            `\n  🤖 Le bot utilise : \x1b[33m${botMove.name}\x1b[0m` +
            ` \x1b[90m(PP: ${botMove.currentPP}/${botMove.pp})\x1b[0m`
        );

        // Exécuter le tour et récupérer les résultats
        const result = executeTurn(playerPokemon, playerMove, botPokemon, botMove);

        // Afficher les résultats
        printTurnResult(
            playerPokemon, playerMove,
            botPokemon,    botMove,
            result,
            result.playerPPUsed,
            result.botPPUsed
        );

        turn++;
        await sleep(300);
    }

    // ── 6. Fin de combat ───────────────────────────────────────────────────────
    console.log();
    printBattleStatus(playerPokemon, botPokemon);
    console.log('\n  ' + '═'.repeat(54));

    if (playerPokemon.currentHP > 0 && botPokemon.currentHP <= 0) {
        console.log(
            `\x1b[32m  🏆  VICTOIRE ! ${capitalize(playerPokemon.name)} a remporté le combat !\x1b[0m`
        );
    } else if (botPokemon.currentHP > 0 && playerPokemon.currentHP <= 0) {
        console.log(
            `\x1b[31m  💀  DÉFAITE... ${capitalize(botPokemon.name)} a gagné cette fois.\x1b[0m`
        );
    } else {
        console.log('\x1b[33m  🤝  ÉGALITÉ ! Les deux Pokémon s\'effondrent en même temps !\x1b[0m');
    }

    console.log('  ' + '═'.repeat(54) + '\n');

    // Proposer une revanche
    const { again } = await inquirer.prompt([
        {
            type:    'confirm',
            name:    'again',
            message: 'Voulez-vous rejouer ?',
            default: true,
        },
    ]);

    if (again) {
        await main();
    } else {
        console.log('\n  À bientôt ! 👋\n');
    }
}

// ─── Lancement ────────────────────────────────────────────────────────────────

main().catch((err) => {
    console.error('\n  ❌ Erreur fatale :', err.message);
    process.exit(1);
});
