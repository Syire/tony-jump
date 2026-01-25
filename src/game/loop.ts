import { World } from "./types";
import { makePlatform } from "./world";
import {
    GRAVITY,
    MOVE_SPEED,
    JUMP_VY,
    GAME_H,
    GAP_Y_MIN,
    GAP_Y_MAX,
    PLATFORM_W,
    PLATFORM_H,
    SIDE_MARGIN,
} from "./constants";
import { Input } from "./input";

// util
const rand = (min: number, max: number) => Math.random() * (max - min) + min;
const randInt = (min: number, max: number) => Math.floor(rand(min, max + 1));
const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
const uid = () => Math.random().toString(36).slice(2, 9);


let playerTilt = 0;

if (typeof window !== "undefined") {
    window.addEventListener("deviceorientation", (event) => {
        const gamma = event.gamma ?? 0;
        // Normalizza gamma in un range [-1, 1]
        playerTilt = Math.max(-1, Math.min(1, gamma / 30));
    });
}

function spawnPlatform(y: number, prevX?: number, worldW = 360) {
    const xRandom = randInt(SIDE_MARGIN, worldW - PLATFORM_W - SIDE_MARGIN);
    const x =
        prevX === undefined ? xRandom : clamp(xRandom, prevX - 140, prevX + 140);

    return {
        id: uid(),
        pos: { x, y },
        w: PLATFORM_W,
        h: PLATFORM_H,
    };
}

export function update(world: World, input: Input, dt: number) {
    // aggiorna il tempo di gioco
    world.time += dt;

    const p = world.player;

    // input -> velocità orizzontale
    const dir = (input.right ? 1 : 0) - (input.left ? 1 : 0);
    // Applica una dead zone al tilt per evitare drift su mobile
    let tiltX = Math.abs(playerTilt) > 0.12 ? playerTilt : 0;
    p.vel.x = dir * MOVE_SPEED;
    if (tiltX !== 0) {
        p.vel.x = tiltX * MOVE_SPEED;
    }

    // gravità
    p.vel.y += GRAVITY * dt;

    // salva posizione precedente (serve per collisione robusta)
    const prevY = p.pos.y;

    // integra posizione
    p.pos.x += p.vel.x * dt;
    p.pos.y += p.vel.y * dt;

    // wrap orizzontale
    if (p.pos.x < -p.w) p.pos.x = world.width;
    if (p.pos.x > world.width) p.pos.x = -p.w;

    // collisione piattaforme (solo se cade)
    if (p.vel.y > 0) {
        const playerBottomPrev = prevY + p.h;
        const playerBottomNow = p.pos.y + p.h;
        let landed = false;
        const TOLLERANZA_Y = 16; // tolleranza verticale maggiore per mobile
        const TOLLERANZA_X = 8;  // tolleranza orizzontale per piccoli drift
        for (let i = 0; i < world.platforms.length; ++i) {
            const plat = world.platforms[i];
            const platTop = plat.pos.y;
            // Controlla se il player era sopra la piattaforma nel frame precedente
            const overlapX =
                p.pos.x + p.w - TOLLERANZA_X > plat.pos.x && p.pos.x + TOLLERANZA_X < plat.pos.x + plat.w;
            // Controlla se il player è atterrato sulla piattaforma in questo frame
            const isOnPlatform =
                overlapX &&
                playerBottomNow >= platTop &&
                playerBottomNow <= platTop + TOLLERANZA_Y;
            if (isOnPlatform) {
                landed = true;
                if (plat.type === "broken") {
                    // Primo salto: fa saltare e poi sparisce subito
                    p.pos.y = platTop - p.h;
                    p.vel.y = JUMP_VY;
                    world.platforms.splice(i, 1);
                    break;
                } else if (plat.type === "jump") {
                    // piattaforma jump: salto più alto
                    p.pos.y = platTop - p.h;
                    p.vel.y = JUMP_VY * 1.4;
                    break;
                } else {
                    // piattaforma base
                    p.pos.y = platTop - p.h;
                    p.vel.y = JUMP_VY;
                    break;
                }
            }
        }
        // Se non ha toccato nessuna piattaforma, continua a cadere (niente salto nel vuoto)
        // nessuna azione: il player continua a cadere
    }

    // scroll verticale del mondo (se il player supera una certa linea)
    const cameraLine = GAME_H * 0.35;
    if (p.pos.y < cameraLine) {
        const delta = cameraLine - p.pos.y;
        p.pos.y = cameraLine;

        // muove le piattaforme verso il basso
        for (const plat of world.platforms) {
            plat.pos.y += delta;
        }

        // score in base allo scroll
        world.score += Math.floor(delta);
    }

    // game over
    if (p.pos.y > world.height + 80) {
        world.state = "gameover";
        return;
    }

    // piattaforme: rimuovi sotto e genera sopra
    const bottomLimit = world.height + 120;
    const prevCount = world.platforms.length;
    world.platforms = world.platforms.filter((pl) => pl.pos.y < bottomLimit);
    const removed = prevCount - world.platforms.length;
    for (let i = 0; i < removed; ++i) {
        // Trova la piattaforma più in alto
        const topPlat = world.platforms.reduce((a, b) => (a.pos.y < b.pos.y ? a : b));
        let newY = topPlat.pos.y - randInt(GAP_Y_MIN, GAP_Y_MAX);
        world.platforms.push(makePlatform(newY, topPlat?.pos.x, world.score));
    }

    // Se le piattaforme sono meno del minimo, genera fino a raggiungerlo
    let highestPlatY = Math.min(...world.platforms.map(pl => pl.pos.y));
    while (highestPlatY > -GAP_Y_MAX) {
        const topPlat = world.platforms.reduce((a, b) => (a.pos.y < b.pos.y ? a : b));
        let newY = topPlat.pos.y - randInt(GAP_Y_MIN, GAP_Y_MAX);
        world.platforms.push(makePlatform(newY, topPlat?.pos.x, world.score));
        highestPlatY = Math.min(...world.platforms.map(pl => pl.pos.y));
    }
}
