---
layout: post
title: Population growth
date: 2023-06-23 11:12:00-0400
description: When intuition misfires
tags: programming math
categories: idea
hidden: true
---

Recently I  came across the following quantitative question:

>A mythical city contains $$100,000$$ monogamously married couples but no children. Each family wishes to "continue the male line", but they do not wish to overpopulate. So, each family has one baby per annum until the arrival of the first boy. For example, if (at some future date) a family has five children, then it must be either that they are all girls, and another child is planned, or that there are four girls and one boy, and no more children are planned. Assume that the children are equally likely to be born male or female. 
Let $$p(t)$$ be the percentage of **children** that are male at the end of year $$t$$.  How is this percentage expected to evolve through time?
{: .text-justify} 

At this point, the ambitious reader should not avoid spoilers and take a few minutes to try to solve it without using a piece of paper for calculations (ideally). If you do any mathematics whatsoever, you probably are missing the point. 
{: .text-justify} 

A few additional assumptions, if unclear:

- Consider that no person in the city dies. 
- The kids will not become parents themselves during the time horizon of the analysis.
- The marriages remain fixed.


## Naive Intuition



## Simulation 
{% highlight python %}

import numpy as np
import matplotlib.pyplot as plt 

plt.figure(figsize = (10, 5))

# Repeat experiment multiple times
tries = 100
for _ in range(tries):
  np.random.seed()
  available_couples = 100000 # Couples who did not have a boy yet
  male_cumulative = [0] # Cumulative male children per year
  female_cumulative = [0] # Cumulative female children per year
  ratio = [0.5]
  years = [0]
  
  # Run growth simulation for a fixed time horizon
  total_years = 30 
  for t in range(total_years):
    years.append(t+1)

    if available_couples == 0:
      male_children = 0
      female_children = 0
    else:
      male_children = np.random.binomial(available_couples, 0.5)
      female_children = available_couples - male_children 
      available_couples -= male_children

    male_cumulative.append(male_children + male_cumulative[-1])
    female_cumulative.append(female_children + female_cumulative[-1])
    ratio.append(male_cumulative[-1]/(male_cumulative[-1] + female_cumulative[-1]))

  plt.plot(years, ratio, alpha=0.1, color='g')
  plt.xticks(range(0,len(years), 5))

plt.xlabel('years')
plt.ylabel('Male Children Ratio')
plt.title('Expected Ratio over Time')
plt.show()

{% endhighlight %}


<center>
<div class="img_row" style="height: 500px;width: 900px">
    <img class="col three" src="{{ site.baseurl }}/assets/img/population_growth_simulation.png" alt="" title="Turnstyle"/>
</div>
</center>


> So, what went wrong?! 

## Analysis 
The key word in the problem statement is **expected**.

## References

* [TODO]

## Acknowledgment
Thanks to Brigitte Castañeda and Aleksandra Galitsyna for the constructive feedback and hightling a few clarifications on the problem statement.
