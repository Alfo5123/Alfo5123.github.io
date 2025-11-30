---
layout: post
title: Minesweeper
date: 2025-04-15 11:12:00-0400
description: Luck meets probability
tags: code games
categories: idea
hidden: true
---

It is impossible to not embrace nostalgic days using a Pentium 4 PC. My first exposure to a computer game was minesweeper. Although the mysterious board full of squares and digits looks intimidating, 
{: .text-justify}

<center>
<div class="img_row" style="height: 250px;width: 200px">
    <img class="col three" src="{{ site.baseurl }}/assets/img/minesweeper.png" alt="" title="Childhood memories unblocked"/>
</div>
</center>



## Game Description

[TODO]
{: .text-justify}

I would like to encourage readers to estimate **how likely are we expected to win?** That is, assuming perfect play, could we get an estimate of chances to 



Minesweeper games typically avoid this by guaranteeing a safe initial move. Estimated probability of winning with perfect play: 87.62%.  10/81 (~12.35%)





## Simulation Code

{% highlight python %}
import numpy as np
from itertools import product

# Game parameters
GRID_SIZE = 9
MINES = 10
SIMULATIONS = 1000

# Directions to check neighbors
directions = [(dx, dy) for dx, dy in product(range(-1, 2), repeat=2) if not (dx == 0 and dy == 0)]

# Utility functions
def in_grid(x, y):
    return 0 <= x < GRID_SIZE and 0 <= y < GRID_SIZE

def place_mines():
    grid = np.zeros((GRID_SIZE, GRID_SIZE), dtype=int)
    all_cells = [(i, j) for i in range(GRID_SIZE) for j in range(GRID_SIZE)]
    mine_positions = np.random.choice(len(all_cells), MINES, replace=False)
    for pos in mine_positions:
        x, y = all_cells[pos]
        grid[x][y] = -1
        for dx, dy in directions:
            nx, ny = x + dx, y + dy
            if in_grid(nx, ny) and grid[nx][ny] != -1:
                grid[nx][ny] += 1
    return grid

def reveal(grid, revealed, x, y):
    if revealed[x][y] or grid[x][y] == -1:
        return
    revealed[x][y] = True
    if grid[x][y] == 0:
        for dx, dy in directions:
            nx, ny = x + dx, y + dy
            if in_grid(nx, ny) and not revealed[nx][ny]:
                reveal(grid, revealed, nx, ny)

def simulate_game():
    revealed = np.zeros((GRID_SIZE, GRID_SIZE), dtype=bool)
    grid = place_mines()

    first_move = (np.random.randint(GRID_SIZE), np.random.randint(GRID_SIZE))
    if grid[first_move[0]][first_move[1]] == -1:
        return False

    reveal(grid, revealed, *first_move)

    while True:
        progress = False
        for x in range(GRID_SIZE):
            for y in range(GRID_SIZE):
                if revealed[x][y] and grid[x][y] > 0:
                    neighbors = [(x+dx, y+dy) for dx, dy in directions if in_grid(x+dx, y+dy)]
                    unrevealed = [(nx, ny) for nx, ny in neighbors if not revealed[nx][ny]]
                    flagged = sum(grid[nx][ny] == -1 for nx, ny in unrevealed)

                    if grid[x][y] == flagged and unrevealed:
                        for nx, ny in unrevealed:
                            if grid[nx][ny] != -1:
                                reveal(grid, revealed, nx, ny)
                                progress = True

        if not progress:
            unrevealed_cells = [(i, j) for i in range(GRID_SIZE) for j in range(GRID_SIZE) if not revealed[i][j]]
            if not unrevealed_cells:
                return True

            guess = unrevealed_cells[np.random.randint(len(unrevealed_cells))]
            if grid[guess[0]][guess[1]] == -1:
                return False
            else:
                reveal(grid, revealed, *guess)

# Simulation
def calculate_probability(simulations=SIMULATIONS):
    wins = sum(simulate_game() for _ in range(simulations))
    return wins / simulations

if __name__ == '__main__':
    win_probability = calculate_probability()
    print(f"Estimated probability of winning with perfect play: {win_probability:.2%}")
{% endhighlight %}






| ----------- | ----------- | ----------- |
| Pattern      | Expected Draws To Win - 1 player | Expected Draws To Win - 1k players | 
| :----:       |    :----:   |    :----: |
| Full Cover      | 72.96       | 58.79       |
| B   | 72.00        | 53.16      |
| O   | 71.52        | 50.56       |
| N   | 70.15        | 43.56       |




## References

- [Introduction to Minesweeper](https://minesweeper-pro.com/introduction/)
- [Minesweeper is NP Complete](https://ic.unicamp.br/~santiago/assets/mc558/2024%20-%202%20-%20projects/minesweeper%20is%20np-complete.pdf)
