---
layout: post
title: Minesweeper
date: 2025-04-15 11:12:00-0400
description: Luck meets probability
tags: code games
categories: idea
hidden: true
---

It is impossible to not embrace nostalgic days using a Pentium 4 PC. My first exposure to a computer game was minesweeper. Although the mysterious board full of squares and digits looks intimidating, the game is way more straighforward than it seems.
{: .text-justify}

<center>
<div class="img_row" style="height: 250px;width: 200px">
    <img class="col three" src="{{ site.baseurl }}/assets/img/minesweeper.png" alt="" title="Childhood memories unblocked"/>
</div>
</center>


## Game Description
The goal of the game is to clear the grid of squares without detonating any hidden mines. For that purpose, we click on a square to reveal it; if its a mine, the game is over, and if its a number, it represents how many mines are within the eight (or possibly less) surrounding squares. We should analytical use this information to flag (right click) and unconver squares that we have the certainty are safe. Once all non-mine squares are revealed the game is won.
{: .text-justify}

Ok then, let's play! But wait: where do we click first? In order to protect gamers' mental health, classic minewsweeper makes sure the first click is always safe and it opens a flood-fill region of zeroes if possible. A simple way to implement this is by setting mine placement process right after the first click position is determined. Moreover, once the first click happens, a local empty region usually opens up. Evidently, the bigger the area cleared out, we can use purely logic to uncover most of the board, requiring fewer guesses and higher win chance. 
{: .text-justify}

Naturally, this led me to question **how likely are we expected to win?** That is, assuming perfect play, could we get an estimate of winning chances given random boards. Let us consider due to computational constraints, the smallest minesweeper size:
{: .text-justify}

{% highlight python %}
# Game parameters
GRID_SIZE = 10
MINES = 10
SIMULATIONS = 100000 # 100K

# Directions to check neighbors
directions = [(-1, -1), (-1, 0), (-1, 1), (0, -1), (0,-1),
              (1, -1), (1, 0), (1, 1)  ]
{% endhighlight %}

As described above, we require as input the first move coordiantes, in order to randomly sample the location of the mines. Moreover, our experiments include `safe_zone_radius` as a parameter to flood-fill surrounding symmetric safe area around the first click. 

{% highlight python %}
def in_grid(x, y):
    return 0 <= x < GRID_SIZE and 0 <= y < GRID_SIZE

def place_mines(first_move, safe_zone_radius=1):
    """
    Place mines randomly, but guarantee that the 3x3 region around first_move
    (for radius=1) has NO mines. This ensures the first click is zero and
    reveals a flood-fill region, like typical Minesweeper.
    """
    grid = np.zeros((GRID_SIZE, GRID_SIZE), dtype=int)
    fx, fy = first_move

    # Cells where we are not allowed to place mines (safe zone)
    forbidden = {
        (fx + dx, fy + dy)
        for dx in range(-safe_zone_radius, safe_zone_radius + 1)
        for dy in range(-safe_zone_radius, safe_zone_radius + 1)
        if in_grid(fx + dx, fy + dy)
    }

    all_cells = [(i, j) for i in range(GRID_SIZE) for j in range(GRID_SIZE)]
    available = [cell for cell in all_cells if cell not in forbidden]

    mine_positions = np.random.choice(len(available), MINES, replace=False)
    for pos in mine_positions:
        x, y = available[pos]
        grid[x, y] = -1

    # Compute neighbor counts
    for x in range(GRID_SIZE):
        for y in range(GRID_SIZE):
            if grid[x, y] == -1:
                continue
            count = 0
            for dx, dy in directions:
                nx, ny = x + dx, y + dy
                if in_grid(nx, ny) and grid[nx, ny] == -1:
                    count += 1
            grid[x, y] = count

    return grid
{% endhighlight %}

Ultimately, we define the solver routine. Nothing fancy here. One function that uses a recursive flood-fill approach to reveal as much cells as possible, once a click has done and its not a mine; and our main solver which uses the game rules until the point where we need to make another random click to guess next safe location.

{% highlight python %}
def reveal(grid, revealed, flagged, x, y):
    """
    Reveal cell (x, y). Flood-fill if it's a 0.
    We assume the caller has already checked that (x, y) is not a mine
    when this matters (e.g., guesses). We *don't* reveal flagged cells.
    """
    if not in_grid(x, y):
        return
    if revealed[x, y] or flagged[x, y]:
        return

    revealed[x, y] = True

    if grid[x, y] == 0:
        for dx, dy in directions:
            nx, ny = x + dx, y + dy
            if in_grid(nx, ny) and not revealed[nx, ny] and not flagged[nx, ny]:
                reveal(grid, revealed, flagged, nx, ny)


def simulate_game():
    revealed = np.zeros((GRID_SIZE, GRID_SIZE), dtype=bool)
    flagged = np.zeros((GRID_SIZE, GRID_SIZE), dtype=bool)

    # Choose a random first move
    first_move = (np.random.randint(GRID_SIZE), np.random.randint(GRID_SIZE))
    grid = place_mines(first_move=first_move, safe_zone_radius=1)

    # With a safe zone, the first move should never be a mine
    if grid[first_move] == -1:
        # Shouldn't happen, but let's be defensive.
        return False

    # Reveal the first move (should be 0, so this opens a region)
    reveal(grid, revealed, flagged, *first_move)

    while True:
        progress = False

        # Apply local logical rules repeatedly:
        for x in range(GRID_SIZE):
            for y in range(GRID_SIZE):
                if not revealed[x, y]:
                    continue
                val = grid[x, y]
                if val <= 0:
                    # Skip 0s and (hypothetical) revealed mines
                    continue

                neighbors = [
                    (x + dx, y + dy)
                    for dx, dy in directions
                    if in_grid(x + dx, y + dy)
                ]

                hidden = [
                    (nx, ny)
                    for (nx, ny) in neighbors
                    if not revealed[nx, ny] and not flagged[nx, ny]
                ]
                flagged_neighbors = [
                    (nx, ny)
                    for (nx, ny) in neighbors
                    if flagged[nx, ny]
                ]

                if not hidden:
                    continue

                F = len(flagged_neighbors)
                H = len(hidden)

                # Rule 1: All remaining mines already flagged -> hidden are safe
                if F == val and H > 0:
                    for (nx, ny) in hidden:
                        # We decide logically they're safe; if grid says otherwise, we lose.
                        if grid[nx, ny] == -1:
                            return False
                        reveal(grid, revealed, flagged, nx, ny)
                        progress = True

                # Rule 2: All hidden neighbors must be mines -> flag them
                elif H == val - F and H > 0:
                    for (nx, ny) in hidden:
                        flagged[nx, ny] = True
                        progress = True

        if not progress:
            # No more logical moves. Check if we've already won.
            # Win condition: all non-mine cells revealed.
            if np.all((grid == -1) | revealed):
                return True

            # Need to guess: pick a random hidden, unflagged cell.
            candidates = [
                (i, j)
                for i in range(GRID_SIZE)
                for j in range(GRID_SIZE)
                if not revealed[i, j] and not flagged[i, j]
            ]

            if not candidates:
                # No candidates but not all safe cells revealed -> something inconsistent.
                return False

            gx, gy = candidates[np.random.randint(len(candidates))]

            # Guess outcome: if it's a mine, we lose; otherwise reveal it.
            if grid[gx, gy] == -1:
                return False
            reveal(grid, revealed, flagged, gx, gy)
{% endhighlight %}

# Simulation Results

After running the results with 100K instances (10 times) we obtain,

| -----------  | ----------- |
| Safe Zone Radius    | Winning Prob| 
| :----:       |    :----:   |   
| 1   | 91.85 +/- 0.10 |
| 2   | 90.73 +/- 0.09 |
| 3   | 86.79 +/- 0.12 |
| 4   | 79.62 +/- 0.14 |

When I first encountered these results, I couldn't help but smile. 

Consider `safe_zone_radius`=3, we would get a board like the one below, where at most 51 cells are available to randomly place 10 mines. 

{% highlight shell %}
. . . . . 1 # # # #
. . . . . 1 1 2 # #
. . F . . . . 2 # #
. . . . . . . 2 # #
. . . . . . 1 3 # #
1 1 1 1 1 1 1 # # #
# # # # # # # # # #
# # # # # # # # # #
# # # # # # # # # #
# # # # # # # # # #
{% endhighlight %}

with the corresponding revealed pattern, 

{% highlight shell %}
. . . . . 1 * 2 1 1
. . . . . 1 1 2 * 1
. . F . . . . 2 2 2
. . . . . . . 2 * 2
. . . . . . 1 3 * 2
1 1 1 1 1 1 1 * 2 1
1 * 1 2 * 2 1 1 1 .
1 1 1 2 * 2 . 1 1 1
. . . 1 1 1 . 1 * 2
. . . . . . . 1 2 *
{% endhighlight %}

We could boldy assume that larger zero-flood region should help solve Mineswepper, thus increasing the win rate. However, a bigger safe zone, also forces all mines into smaller, denser and more awkwardly-placed mine regions, which might lead to ambiguity cases where we need to simply guess. I just happen to love when experimental evidence constrasts initial intuition.
{: .text-justify}

## References

- [Introduction to Minesweeper](https://minesweeper-pro.com/introduction/)
- [Minesweeper is NP Complete](https://ic.unicamp.br/~santiago/assets/mc558/2024%20-%202%20-%20projects/minesweeper%20is%20np-complete.pdf)
