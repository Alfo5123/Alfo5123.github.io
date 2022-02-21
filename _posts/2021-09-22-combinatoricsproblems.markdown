---
layout: post
title: A combinatoric approach
date: 2021-09-22 11:12:00-0400
description: Few challenges to escape routine
tags: math
categories: idea
hidden: true
---

In an unxpected turn of events, returning from a trip to Yellowstone, I found in my phone the book ["Principles and Techniques in Combinatorics"](https://www.isinj.com/mt-usamo/Principles%20and%20Techniques%20in%20Combinatorics%20-%20Chen%20Chuan-Chong,%20Koh%20Khee-Meng%20(WS,%201992).pdf). Being a passionate about combinatorics I decided to give it a try. Only a few pages later, I was totally engaged with the material. I do plan to continue reading the following chapters in the upcoming months. However, at least for now, let me share some of the problems from the book that grabbed my attention and present as well the solutions I came up with.
{: .text-justify}


#### Problem 1
Prove that it is impossible for seven distinct straight lines to be situated in the Euclidean plane so as to have at least six points where exactly three of these lines intersect and at least four points where exactly two of these lines intersect. (*Putnam, 1973*).
{: .text-justify}

#### Problem 2
Let $$S=\{1, 2, \cdots, 1990\}$$. A 31-element subset $$A$$ of $$S$$ is said to be *good* if the sum $$\sum_{a\in A} a$$ is divisible by 5. Find the number of 31-element subsets of $$S$$ which are good. (*Proposed by the Indian team at the 31st IMO*).
{: .text-justify}

#### Problem 3
For $$\{1, 2, \cdots, n\}$$ and each of its nonempty subsets, a unique *alternating sum* is defined as follows: Arrange the numbers in the subset in decreasing order and then, beginning with the largest, alternatively add and substract successive numbers. (For example, the alternating sum for $$\{1, 2, 4, 6, 9\}$$ is $$9-6+4-2+1=6$$ and for $$\{5\}$$ is simply 5.) Find the sum of all such alternating sums for $$n=7$$. (*AIME, 1983/13*)
{: .text-justify}

#### Problem 4
For what $$n \in \mathbb{N} $$ does there exist a permutation $$(x_1, x_2, \cdots, x_n)$$ of $$(1, 2, \cdots, n)$$ such that the differences $$|x_k-k|$$, $$1\leq k \leq n$$, are all distinct? (*Proposed by M.J Pelling, 1989*)
{: .text-justify}

At this point, the curious reader can stop reading, and struggle with these problems. :)



### Solutions 

Here I present the casual solutions I came up with to solve the above tasks. 

#### Problem 1 
Let us consider the set of line pairs $$ L = \{ (l_i, l_j) , \text{s.t. } 1 \leq i < j \leq 7 \} $$, where $$l_i$$ represents the line $$i$$. The cardinality of this set is given by $$ |L| = \binom{7}{2} = 21 $$. We can construct the set $$L$$ based on the points of intersection for the given lines. Each point where exactly two lines intersect, adds one element to the set. Also, each point where exactly three lines intersect, adds $$\binom{3}{2} = 3$$ elements to the set. Thus, the cardinality of the formed set is at least $$ 6 \times 3 + 4 \times 1 =  22$$, which contradicts with the actual cardinality of the set and proves the claim. 
{: .text-justify}

#### Problem 2 
Let us consider the circular arrangement of numbers of the set $$S$$ in clock-wise increasing order. We notice that a 31-element subset $$A$$ can be represented by a set of marked numbers in this circular arrangement. We define the bijection $$f$$ as moving each marked number to its immediate right position in the circle. We notice that given a 31-element subset $$A$$, if  $$\sum_{a\in A} a \text{ mod } 5 = k$$, then $$f(A) = \sum_{a\in A} (a+1) \text{ mod } 5 = (k + 1) \text{ mod } 5$$. By denoting $$N_k$$ the number of 31-element subsets with sum modulo 5 equal $$k$$, we observe that by applying the bijection $$f$$, we obtain $$N_0 = N_1 = N_2 = N_3 = N_4$$. Finally, since $$\sum_{k=0}^4 N_k = \binom{1990}{31} $$, the answer is given by $$N_0 = \frac15 \binom{1990}{31}$$.
{: .text-justify}

#### Problem 3
We define $$S_n$$ to be the sum of alternating sums for all non-emtpy subsets of $$\{1, 2, \cdots, n\}$$. We observe that we have two types of subsets. The ones where $$n$$ is the maximum element and the ones where its not. There are $$2^{n-1}$$ and $$2^{n-1} - 1$$ such subsets for each case, respectively. The key insight is that for each subset of the second type, we can add the element $$n$$ and obtain a unique subset of the first type. However, given the definition of alternating sums, when summing up both subsets from each type, all the terms will cancel except the $$n$$. Thus, $$ S_n = n 2^{n-1} $$. The answer is given by $$7\times 2^6 = 448$$.
{: .text-justify}

#### Problem 4
From the problem statement it is evident that the expression $$|x_k-k|$$ will take different values between $$0$$ and $$n-1$$. Moreover, given that $$\sum_{k=1}^n (x_k-k) = 0$$, we can conclude that $$ \sum_{k=1}^n |x_k-k| = \sum_{i=0}^{n-1} i = \frac{n(n-1)}{2} $$ must an even number. We consider all possible values $$n$$ of the form $$4p$$, $$4p+1$$, $$4p+2$$ and $$4p+3$$, for $$p \geq 0$$. We can easily verify that for $$n=0,1 \ (\text{mod } 4)$$ the previous expression is even. However for $$n=2,3\ (\text{mod } 4)$$ we obtain odd numbers. Therefore, we can only obtain such permutations for $$n=0,1 \ (\text{mod } 4)$$. To conclude the proof, we need to show how to construct such permutations for each case. 
{: .text-justify}

- When $$n=4p$$ we can define our permutation by alternating numbers on opposite sides of the list $$\{1, 2, \cdots, n\}$$ skipping the number $$3p$$ (which maps to itself). For example, for $$p=1$$, we have the following permutation $$1\rightarrow 4$$, $$4\rightarrow 2$$, $$2\rightarrow 4$$ and $$3\rightarrow 3$$.
- When $$n=4p+1$$, we can define our permutation by alternating numbers on opposite sides of the list $$\{1, 2, \cdots, n\}$$ skipping the number $$p+1$$. For example, for $$p=1$$ we have the following permutation $$1\rightarrow 5$$, $$5\rightarrow 3$$, $$3\rightarrow 4$$, $$4\rightarrow 1$$, and $$2\rightarrow 2$$.

<blockquote>
    Every mathematical proof can be elegantly written within three lines. 
    The difficult part is to find those lines. 

    —Vladimir Spokoiny.
</blockquote>