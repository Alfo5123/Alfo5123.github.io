---
layout: post
title: Curious combinatorial identity
date: 2020-04-20 11:12:00-0400
description: First math post
tags: math 
categories: idea
hidden: true
---


It is often the case in mathematics, when seemingly unrelated ideas suddenly exhibit curious connections. That's precisely where beauty lies. Let me share with you a combinatorial identity that recently was presented to me.
{: .text-justify}

For all intergers $$n \geq 0$$, it follows
{: .text-justify}

$$ \displaystyle \sum_{k=0}^{n}\dbinom{n-k}{k} = F_{n+1} $$.
{: style="font-size: 120%; text-align: center;"}

where $$ F_{n+1}$$ corresponds to the $$(n+1)^{th}$$ term of the [Fibonacci sequence](http://oeis.org/A000045), and the combinatorial number $$ \displaystyle \dbinom{n}{k} = \frac{n!}{k!(n-k)!} $$ is assumed to be zero for $$ n < k $$.
{: .text-justify}

#### Proof

We prove the identity using strong induction. For the base case, we trivially verify $$\binom{0}{0} = F_1 = 1$$. 

As inductive step, we assume that the identity holds for all integers $$n'$$ such that $$ 0 \leq n' \leq n $$. Then, we want to deduce that our hypothesis implies the identity holds for $$ n' = n + 1 $$. That is, 

$$ \displaystyle \sum_{k=0}^{n+1}\dbinom{n+1-k}{k} = \dbinom{n+1}{0} + \dbinom{n}{1} + \cdots + \dbinom{0}{n+1} = F_{n+2}$$.
{: style="font-size: 100%; text-align: center;"}

We need to consider the "Pascal's Triangle" formula for combinatorials,

$$ \displaystyle \dbinom{n}{k} = \dbinom{n-1}{k} + \dbinom{n-1}{k-1} $$.
{: style="font-size: 100%; text-align: center;"}

Thus, by applying this formula to all terms except the first and last ones,

$$ \displaystyle \sum_{k=0}^{n+1}\dbinom{n+1-k}{k} = \dbinom{n+1}{0} + \dbinom{n}{1} + \cdots + \dbinom{0}{n+1} $$.

$$ \displaystyle \sum_{k=0}^{n+1}\dbinom{n+1-k}{k} = \dbinom{n+1}{0} + \left( \dbinom{n-1}{1} + \dbinom{n-1}{0} \right)  + \cdots + \dbinom{0}{n+1} $$.

$$ \displaystyle \sum_{k=0}^{n+1}\dbinom{n+1-k}{k} = \dbinom{n}{0} + \left( \dbinom{n-1}{1} + \dbinom{n-1}{0} \right)  + \cdots + \dbinom{0}{n} $$.

$$ \displaystyle \sum_{k=0}^{n+1}\dbinom{n+1-k}{k} = F_{n+1} + F_{n} = F_{n+2} $$.

Therefore, we proved the identity holds for all integers $$ n \geq 0 $$. ∎

#### Derivation
Although the identity was proved, the avid reader must be wondering how the formula was obtained in first place. To derive the formula we will use one of the most powerful weapons in combinatorics: generating functions. 
{: .text-justify}

Let us consider the following ordinary generating function, 

$$ \displaystyle F(x) = \sum_{n \geq  0} \Big \lbrace \sum_{k=0}^{n}\dbinom{n-k}{k} \Big \rbrace x^n $$.
{: style="font-size: 100%; text-align: center;"}

where the coefficient of $$x^n$$ in the expansion of $$F(x)$$ corresponds to the quantitiy of interest. 

$$ \displaystyle F(x) = \sum_{n \geq  0} \Big \lbrace \sum_{k=0}^{n}\dbinom{n-k}{k} \Big \rbrace x^n $$.

$$ \displaystyle F(x) = \sum_{k \geq  0} \Big \lbrace   \sum_{n \geq  0}  \dbinom{n}{k}  x^{n+k}  \Big \rbrace $$.

$$ \displaystyle F(x) = \sum_{n \geq  0}  \Big \lbrace   \sum_{k \geq  0}   \dbinom{n}{k}  x^{k}   \Big \rbrace  x^n $$.

$$ \displaystyle F(x) = \sum_{n \geq  0}  \Big \lbrace   \sum_{k = 0}^{n}   \dbinom{n}{k}  x^{k}   \Big \rbrace  x^n $$.

$$ \displaystyle F(x) = \sum_{n \geq  0}  (1+x)^n  x^n  = \sum_{n \geq  0}  \left( (1+x) x \right)^n  $$.

$$ \displaystyle F(x) = \frac{1}{1-(1+x)x} = \frac{1}{1-x-x^2}$$.

We recognize the last expression as the generating function of the  $$(n+1)^{th}$$ term of the Fibonacci sequence. ∎
{: .text-justify}