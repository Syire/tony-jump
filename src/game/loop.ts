import { World } from "./types";
import {
    GRAVITY,
    MOVE_SPEED,
    JUMP_VY,
    GAME_H,
    PLATFORM_MIN_ON_SCREEN,
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
    world.time += dt;

    const p = world.player;

    // input -> velocità orizzontale
    const dir = (input.right ? 1 : 0) - (input.left ? 1 : 0);
    p.vel.x = dir * MOVE_SPEED;

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

        for (const plat of world.platforms) {
            const platTop = plat.pos.y;

            const overlapX =
                p.pos.x + p.w > plat.pos.x && p.pos.x < plat.pos.x + plat.w;

            const crossedTop =
                playerBottomPrev <= platTop && playerBottomNow >= platTop;

            if (overlapX && crossedTop) {
                p.pos.y = platTop - p.h;
                p.vel.y = JUMP_VY;
                break;
            }
        }
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
    world.platforms = world.platforms.filter((pl) => pl.pos.y < bottomLimit);

    while (world.platforms.length < PLATFORM_MIN_ON_SCREEN) {
        const topY = Math.min(...world.platforms.map((pl) => pl.pos.y));
        const topPlat = world.platforms.reduce((a, b) => (a.pos.y < b.pos.y ? a : b));
        const newY = topY - randInt(GAP_Y_MIN, GAP_Y_MAX);

        world.platforms.push(spawnPlatform(newY, topPlat?.pos.x, world.width));
    }
}
