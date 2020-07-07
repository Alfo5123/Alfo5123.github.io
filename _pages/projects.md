---
layout: page
title: Projects
permalink: /projects/
description: A growing collection of your previous and current projects.
order: 4
---


<div class="project ">
{% assign n = site.posts | size %}
{% assign listprojects = site.projects | sample: n %}
{% for project in listprojects %}
    <div class="thumbnail">
        <a href="{{project.external_url}}" target="_blank">
        {% if project.img %}
        <img class="thumbnail" src="{{ project.img | prepend: site.baseurl | prepend: site.url }}"/>
        {% else %}
        <div class="thumbnail blankbox"></div>
        {% endif %}    
        <span>
            <h1>{{ project.title }}</h1>
            <br/>
            <p>{{ project.description }}</p>
        </span>
        </a>
    </div>
{% endfor %}
</div>

