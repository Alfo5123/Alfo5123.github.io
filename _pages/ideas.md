---
layout: page
title: Ideas
permalink: /ideas/
description: Brainstorming
order: 2
---


<!--Tags generator-->
{% assign all_tags = '' | split: ',' %}

 {% for post in site.categories.idea %}
    {% for tags in post.tags %}
        {% for tag in tags %}
            {% assign all_tags = all_tags | push: tag %}
        {% endfor %}
    {% endfor %}
{% endfor %}

{% assign all_tags = all_tags | sort %}
{% assign all_tags = all_tags | uniq %}


<!--TagCloud-->
<center> <br><br>
{% include tagcloud.html %}
</center>


