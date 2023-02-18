---
layout: post
title: Turnstyle
date: 2023-02-15 11:12:00-0400
description: Permutation puzzle 
tags: math programming
categories: idea
hidden: true
---

Naturally, a casual walk on a stimulating work environment can trigger the most prominent forms of [nerd snipping](https://xkcd.com/356/). Another addictive puzzle from the ninth floor dazzled me. Hopefully, I can share some of my curiosity with the reader.    

<center>
<div class="img_row" style="height: 450px;width: 450px">
    <img class="col three" src="{{ site.baseurl }}/assets/img/turnstyle.png" alt="" title="Turnstyle"/>
</div>
</center>

The **[Turnstyle](https://gamewright.com/product/turnstyle)** brain teaser consists of two discs connected by a gear on the back. Allowing two types of valid moves:

- *Shift*  all the numbers one position right (clockwise) or left (counter-clockwise).
- *Flip* the connected gears to change the order the numbers from ABCD to BADC.

After interacting with the puzzle for a few seconds, I knew my best hope was to write a program to find an optimal solution for me. 
{: .text-justify} 

**Let's solve it!**

Being particularly bad at games, I couldn't help but think whether I should invest a few hours into it. Naturally, one thought crossed my mind: the imminent fear of a jigsaw puzzle missing a piece. What if someone on purpose designed a devilish unsolvable game? Let's better take one step back, and first prove the solvability of the game. 
{: .text-justify} 

## Digging into math

We build up our intution by introducing a set of definitions. Let us consider $$\mathcal{A} = \{1,...,n\}$$. We define a *permutation* $$\sigma$$ as a function from $$\mathcal{A}$$ to itself, which is onto and one-to-one. In other words, a reording of the elements of $$\mathcal{A}$$. Any permutation $$\sigma$$ can be represented by a set of disjoint cycles, with the interpretation that any consecutive pair $$i,j$$ indicates that $$i$$ is mapped to $$j$$, and any $$i$$ at the end of a parenthesized cycle maps to $$j$$ at the start of the same cycle. 
{: .text-justify} 

For example, the permutation $$\sigma : \{1,2,3,4\} \rightarrow \{2,1,4,3\} $$ can be denoted as $$\sigma = (12)(34)$$. In addition, a cycle consisting of only two elements is called a *transposition* and a cycle of one element (which can be avoided in the cycle notation) is called *fixed point*. In our case, our permutation is expressed as the union of two transpositions.
{: .text-justify}

We define the order of the permutation is the defined the smallest positive integer $$m$$ such that $$\sigma^m = id$$. That is, how many times we should apply the permutation mapping until we obtain the identity map. For example, for the above permutation $$\sigma$$ the order is $$2$$.
{: .text-justify}

Regarding the parity of a permutation, using the cycle notation, the permutation is odd if and only if this factorization contains an odd number of even-length cycles. Thus, our permutation $$\sigma = (12)(34)$$ is even. It is easy to proof that the composition of two even permutation is another even permutation. This will be a useful property for proving the solvability. 
 {: .text-justify}

The set of all permutations of $$\mathcal{A}$$ is the **symmetric group** of $$n$$ symbols, denoted by $$S_n$$. As detailed in [this](https://kconrad.math.uconn.edu/blurbs/grouptheory/genset.pdf) paper, for a group $$\mathcal{G}$$ a subset $$\mathcal{X} \subset \mathcal{G}$$ is a generating set for $$\mathcal{G}$$ if every $$g \in \mathcal{G}$$ can be written as a product of powers of elements taken from $$\mathcal{X}$$:
 {: .text-justify}

<center>
$$ g = x_1^{a_1} x_2^{a_2} \cdots x_r^{a_r} $$,
</center> where $$x_i \in \mathcal{X}$$ and $$a_i \in \Z$$. Thus, $$\mathcal{X} $$ generates $$\mathcal{G}$$ and is denoted by $$ \mathcal{G} = \langle \mathcal{X} \rangle $$.
{: .text-justify}

### Lemma 
For any odd integer $$ n>4$$, the permutations $$\sigma_1 = (1,2,3,\cdots, n)$$ and $$\sigma_2 = (1,2)(3,4) $$ do not generate $$S_n$$. This solves the open question stated [here](https://www.cs.brandeis.edu/~storer/JimPuzzles/ZPAGES/zzzTurnstyle.html).


### Proof 
Let us consider odd values of $$n>4$$. We can easily verify that for odd $$n>8$$, the permutations $$\sigma_1 = (1,2,3,\cdots, n)$$ and $$\sigma_2 = (1,2)(3,4) $$ are both even. Therefore, every composition of these two permutations would result in an even permutation, by the property described above. Thus, it is not possible to generate odd permutations, and ultimately $$S_n$$. ∎
{: .text-justify}

### Main Result 
<center>
$$S_{12} = \langle (1,2,3,\cdots, 12), (1,2) (3,4) \rangle$$
</center>

### Proof

[TODO]


<!---
For this case, we can trivially verify $$\sigma_1$$ and $$\sigma_2$$ have opposite parity, as a necessity for generating $$S_n$$. Let us define $$\sigma_3 = \sigma_1^4$$. We have that $$\sigma_3^3 = \sigma_2^2 = id$$. By using the [theorem proven by Miller](https://www.ams.org/journals/bull/1901-07-10/S0002-9904-1901-00826-9/S0002-9904-1901-00826-9.pdf), which shows that for $$n>8$$, the symmetric group $$S_n$$ can be generated by a permutation of order $$2$$ and a permutation of order $$3$$, we can guarantee the existence of two permutations of order $$2$$ and $$3$$, which generate $$S_{12}$$.
{: .text-justify}
-->

In plain words, by using the two valid game moves (flip and shift), we can reach any possible configuration, for the case of $$n=12$$. Therefore, we can now *safely* verify the solutions using computer search.  
{: .text-justify}

*I wanted to take this opportunity to relate [Feynman's famous quote](https://www.youtube.com/watch?v=px_4TxC2mXU) on knowing the name of something. Despite I am nowhere near being a formerly trained mathematician, sometimes one can benefit by knowing the name of some obscure group theory concept in order to tackle a problem and appropriately explore previous research efforts on the field.*
{: .text-justify} 

## Time to code 

From an algorithmic point, the problem consists of a graph traversal task. Each node represents each of the cyclic permutation formed by the 12 pieces. In order to restrict the number of nodes, 
{: .text-justify} 

{% highlight python %}
import math
import numpy as np
from copy import deepcopy
from collections import deque

# Solution state
solution_state = [i+1 for i in range(n)]
{% endhighlight %}

Function for applying flip operation on the linear array state for the indices [ix%n, (ix+1)%n, (ix+2)%n, (ix+3)%n ] Returns the next state, shifted to have '1' as start of string.
{: .text-justify} 

{% highlight python %}
def flip(state, ix):
    # Copy mutable state variable 
    new_state = state.copy()

    # Swap the elements (ix%n, (ix+1)%n) and (ix+2)%n, (ix+3)%n)
    new_state[ix], new_state[(ix + 1) % n] = (
        new_state[(ix + 1) % n], 
        new_state[ix],
    )
    new_state[(ix + 2) % n], new_state[(ix + 3) % n] = (
        new_state[(ix + 3) % n],
        new_state[(ix + 2) % n],
    )

    # Corner cases for resetting 1 at the beginning of the new state
    if ix == 0 or ix == n - 2:
        new_state = new_state[1:] + [new_state[0]]

    elif ix == n - 3 or ix == n - 1:
        new_state = [new_state[-1]] + new_state[:-1]

    return new_state
{% endhighlight %}




Due to the high number of possible nodes (11! states = ~39M) in the connected graph, a naive implementation of DFS would reach maximum recursion limits. Thus, I opted for using BFS, since that would allow to answer shortest path queries between any initial state to the solved state.
{: .text-justify} 

{% highlight python %}
# Create a set for visited states 
visited = set()

# Keep track of parent states during traversal for path reconstruction
parent = dict()
parent_idx = dict()

# Perform a traversal through the game states graph using BFS algorithm
def bfs(state):

  # Intialization of 
  initial_state = tuple(state)
  visited.add(initial_state)
  queue = deque([tuple(state)]) 
  parent[initial_state] = tuple(solution_state)
  parent_idx[initial_state] = -1

  # Exploring neighbors not visited
  while queue:
    current_state = list(queue.popleft())
    current_state_tuple = tuple(current_state)
    for i in range(n):
      next_state = tuple(flip(current_state, i))
      if next_state not in visited:
        visited.add(next_state)
        queue.append(next_state)
        parent[next_state] = current_state_tuple
        parent_idx[next_state] = i
{% endhighlight %}


## References

* Turnstyle solution approach via computer search of SWAP - [link](https://www.cs.brandeis.edu/~storer/JimPuzzles/ZPAGES/zzzTurnstyle.html)
* Tom's Turnstile description and puzzle solution by J. A. Storer - [link](https://www.cs.brandeis.edu/~storer/JimPuzzles/SLIDE/TomsTurnstile/TomsTurnstile.pdf)
* Miller, G.A., 'On the groups generated by 2 operators', 1901. - [link](https://www.ams.org/journals/bull/1901-07-10/S0002-9904-1901-00826-9/S0002-9904-1901-00826-9.pdf)
* MathOverflow discussion over genenator of Symmetric group. - [link](https://mathoverflow.net/questions/405256/what-is-the-standard-2-generating-set-of-the-symmetric-group-good-for#comment1038737_405273)
* Keith Conrad, 'Generating Sets' - [link](https://kconrad.math.uconn.edu/blurbs/grouptheory/genset.pdf)
* Bases for permutation groups, Tim Burness, University of Bristol - [link](https://seis.bristol.ac.uk/~tb13602/docs/padova_lecture_1.pdf)
* Group Theory, J.S. Milne - [link](https://www.jmilne.org/math/CourseNotes/GT.pdf)

## Acknowledgment
Thanks to Niek Lamoree for the group theory ideas and proofreading this post. 


<!----

---->