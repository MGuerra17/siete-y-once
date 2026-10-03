# Game rules

Implemented in `packages/game-core` (`reduce`, `getDefaultAction`, selectors). Values live in
`packages/game-core/src/constants.ts`.

## Setup

- Two players, each starting with **$1,000,000**.
- Minimum bet **$50,000**. Bets move in steps of 50k / 100k / 200k and must be multiples of 50k.

## Roles

- **Shooter** rolls the dice.
- **Bettor** places the bet and wins on craps or a seven-out.

## Flow

1. **Initial roll** — player 1 rolls, then player 2. The higher sum becomes the shooter. On a tie
   both roll again, starting with player 1.
2. **Opening bet** — the bettor bets between the minimum and the **lower of both balances**
   (nobody can lose more than they have, nor win more than the opponent has).
3. **Come-out roll** by the shooter:
   - 7 or 11 → shooter wins (natural).
   - 2, 3 or 12 → bettor wins (craps).
   - Any other sum becomes the **point**.
4. **Point phase** — before each roll the bettor keeps or raises the bet (never lowers it).
   The bettor can also **lock** the bet to keep it automatically for the rest of the round.
   - Point rolled → shooter wins.
   - 7 rolled → bettor wins (seven-out).
   - Anything else → roll again.
5. **Payout** — the loser pays the bet to the winner. The **round winner becomes the shooter**
   of the next round.
6. **Game over** — when a player can no longer cover the minimum bet; the other player wins.

## Turn timer

Each turn lasts **8 s**. When it expires the default action is applied
(`getDefaultAction`):

| Phase | Default action |
|---|---|
| Initial roll | Roll for the player |
| Opening bet | Bet the minimum |
| Point phase | Keep the current bet |
| Shooter's roll | Roll for the shooter |

Online, the server owns the deadline (`turnDeadline`, 8 s + 3 s for animations). Clients ask the
server to apply the timeout (`turnTimeout`) and the server only accepts it once the deadline has
passed, so the default action is always server-decided.

## Leaving and disconnections (online)

- **Leaving on purpose** (exit button) forfeits immediately: the opponent wins.
- **Losing connection** starts a **60 s** grace period. The player can rejoin with their private
  rejoin token. After the grace period the opponent can claim the win.
- Turn timeouts keep running during the grace period.
