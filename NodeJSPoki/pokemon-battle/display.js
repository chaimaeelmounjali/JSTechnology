// ─── display.js ──────────────────────────────────────────────────────────────
// Fonctions d'affichage pour le terminal (couleurs ANSI, barres de vie, etc.)
// ─────────────────────────────────────────────────────────────────────────────

// Codes couleur ANSI
const C = {
    reset:  '\x1b[0m',
    bold:   '\x1b[1m',
    red:    '\x1b[31m',
    green:  '\x1b[32m',
    yellow: '\x1b[33m',
    cyan:   '\x1b[36m',
    white:  '\x1b[37m',
    gray:   '\x1b[90m',
};

/**
 * Met la première lettre en majuscule
 */
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Génère une barre de PV colorée
 * @param {number} current
 * @param {number} max
 * @param {number} barLength
 */
function getHPBar(current, max, barLength = 18) {
    const ratio  = current / max;
    const filled = Math.max(0, Math.round(ratio * barLength));
    const empty  = barLength - filled;

    const color = ratio > 0.5 ? C.green : ratio > 0.25 ? C.yellow : C.red;

    const bar = '█'.repeat(filled) + '░'.repeat(empty);
    return `${color}[${bar}]${C.reset} ${current}/${max}`;
}

/**
 * Génère la couleur des PP selon le pourcentage restant
 */
function ppColor(current, max) {
    const ratio = current / max;
    if (current === 0) return C.red;
    if (ratio <= 0.25) return C.red;
    if (ratio <= 0.5)  return C.yellow;
    return C.green;
}

/**
 * Affiche le titre du jeu
 */
function printTitle() {
    console.clear();
    console.log(C.yellow);
    console.log('  ╔══════════════════════════════════════════════════╗');
    console.log('  ║       🎮  POKÉMON BATTLE CLI  🎮                 ║');
    console.log('  ║         Développé avec Node.js (TP)              ║');
    console.log('  ║   Modules: https · events · inquirer · npm       ║');
    console.log('  ╚══════════════════════════════════════════════════╝');
    console.log(C.reset);
}

/**
 * Affiche les barres de PV des deux Pokémon
 */
function printBattleStatus(player, bot) {
    const sep = '═'.repeat(58);
    console.log('\n' + sep);
    console.log(
        `  🎮 ${C.green}${capitalize(player.name).padEnd(16)}${C.reset}` +
        `PV: ${getHPBar(player.currentHP, player.maxHP)}`
    );
    console.log(
        `  🤖 ${C.red}${capitalize(bot.name).padEnd(16)}${C.reset}` +
        `PV: ${getHPBar(bot.currentHP, bot.maxHP)}`
    );
    console.log(sep);
}

/**
 * Affiche la liste des attaques du joueur avec leur état
 */
function printMovesStatus(pokemon) {
    console.log(`\n${C.cyan}📋 Attaques de ${capitalize(pokemon.name)}:${C.reset}`);
    pokemon.moves.forEach((m, i) => {
        const pc     = ppColor(m.currentPP, m.pp);
        const status = m.currentPP === 0 ? ` ${C.red}[ÉPUISÉ]${C.reset}` : '';
        console.log(
            `  ${i + 1}. ${m.name.padEnd(24)}` +
            `${C.white}PWR:${String(m.power).padStart(4)}${C.reset}` +
            ` | PP: ${pc}${m.currentPP}/${m.pp}${C.reset}` +
            ` | ACC: ${m.accuracy}%` +
            status
        );
    });
}

/**
 * Affiche les résultats d'un tour de combat
 */
function printTurnResult(player, playerMove, bot, botMove, result, playerPPUsed, botPPUsed) {
    const { playerResult, botResult } = result;

    console.log(`\n${C.cyan}📣 Résultats du tour:${C.reset}`);
    console.log('  ' + '─'.repeat(52));

    // ── Attaque du joueur ──────────────────────────────────────────────────────
    console.log(
        `  ➡️  ${C.green}${capitalize(player.name)}${C.reset}` +
        ` utilise ${C.yellow}${playerMove.name}${C.reset}` +
        ` ${C.gray}(PP restants: ${playerMove.currentPP}/${playerMove.pp})${C.reset}`
    );

    if (!playerResult.hit) {
        if (playerResult.reason === 'pp_blocked') {
            console.log(
                `     ${C.red}❌ Bloqué!${C.reset} Vos PP (${playerPPUsed}) sont` +
                ` inférieurs aux PP ennemis (${botPPUsed})`
            );
        } else {
            console.log(`     ${C.gray}💨 Rate! (précision: ${playerMove.accuracy}%)${C.reset}`);
        }
    } else {
        console.log(`     ${C.red}💥 -${playerResult.damage} PV${C.reset} infligés à ${capitalize(bot.name)}`);
    }

    // ── Attaque du bot ─────────────────────────────────────────────────────────
    if (botResult !== null) {
        console.log(
            `\n  ⬅️  ${C.red}${capitalize(bot.name)}${C.reset}` +
            ` utilise ${C.yellow}${botMove.name}${C.reset}` +
            ` ${C.gray}(PP restants: ${botMove.currentPP}/${botMove.pp})${C.reset}`
        );

        if (!botResult.hit) {
            if (botResult.reason === 'pp_blocked') {
                console.log(
                    `     ${C.red}❌ Bloqué!${C.reset} Les PP du bot (${botPPUsed}) sont` +
                    ` inférieurs à vos PP (${playerPPUsed})`
                );
            } else {
                console.log(`     ${C.gray}💨 Rate! (précision: ${botMove.accuracy}%)${C.reset}`);
            }
        } else {
            console.log(`     ${C.red}💥 -${botResult.damage} PV${C.reset} vous sont infligés`);
        }
    } else {
        console.log(`\n  💀 ${capitalize(bot.name)} est K.O. et ne peut plus attaquer!`);
    }
}

module.exports = {
    printTitle,
    printBattleStatus,
    printMovesStatus,
    printTurnResult,
    capitalize,
};
