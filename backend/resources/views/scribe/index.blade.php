<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta content="IE=edge,chrome=1" http-equiv="X-UA-Compatible">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
    <title>Laravel API Documentation</title>

    <link href="https://fonts.googleapis.com/css?family=Open+Sans&display=swap" rel="stylesheet">

    <link rel="stylesheet" href="{{ asset("/vendor/scribe/css/theme-default.style.css") }}" media="screen">
    <link rel="stylesheet" href="{{ asset("/vendor/scribe/css/theme-default.print.css") }}" media="print">

    <script src="https://cdn.jsdelivr.net/npm/lodash@4.17.10/lodash.min.js"></script>

    <link rel="stylesheet"
          href="https://unpkg.com/@highlightjs/cdn-assets@11.6.0/styles/obsidian.min.css">
    <script src="https://unpkg.com/@highlightjs/cdn-assets@11.6.0/highlight.min.js"></script>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/jets/0.14.1/jets.min.js"></script>

    <style id="language-style">
        /* starts out as display none and is replaced with js later  */
                    body .content .bash-example code { display: none; }
                    body .content .javascript-example code { display: none; }
            </style>

    <script>
        var tryItOutBaseUrl = "http://localhost";
        var useCsrf = Boolean();
        var csrfUrl = "/sanctum/csrf-cookie";
    </script>
    <script src="{{ asset("/vendor/scribe/js/tryitout-5.11.0.js") }}"></script>

    <script src="{{ asset("/vendor/scribe/js/theme-default-5.11.0.js") }}"></script>

</head>

<body data-languages="[&quot;bash&quot;,&quot;javascript&quot;]">

<a href="#" id="nav-button">
    <span>
        MENU
        <img src="{{ asset("/vendor/scribe/images/navbar.png") }}" alt="navbar-image"/>
    </span>
</a>
<div class="tocify-wrapper">
    
            <div class="lang-selector">
                                            <button type="button" class="lang-button" data-language-name="bash">bash</button>
                                            <button type="button" class="lang-button" data-language-name="javascript">javascript</button>
                    </div>
    
    <div class="search">
        <input type="text" class="search" id="input-search" placeholder="Search">
    </div>

    <div id="toc">
                    <ul id="tocify-header-introduction" class="tocify-header">
                <li class="tocify-item level-1" data-unique="introduction">
                    <a href="#introduction">Introduction</a>
                </li>
                            </ul>
                    <ul id="tocify-header-authenticating-requests" class="tocify-header">
                <li class="tocify-item level-1" data-unique="authenticating-requests">
                    <a href="#authenticating-requests">Authenticating requests</a>
                </li>
                            </ul>
                    <ul id="tocify-header-endpoints" class="tocify-header">
                <li class="tocify-item level-1" data-unique="endpoints">
                    <a href="#endpoints">Endpoints</a>
                </li>
                                    <ul id="tocify-subheader-endpoints" class="tocify-subheader">
                                                    <li class="tocify-item level-2" data-unique="endpoints-GETapi-customers">
                                <a href="#endpoints-GETapi-customers">GET api/customers</a>
                            </li>
                                                                                <li class="tocify-item level-2" data-unique="endpoints-POSTapi-customers">
                                <a href="#endpoints-POSTapi-customers">POST api/customers</a>
                            </li>
                                                                                <li class="tocify-item level-2" data-unique="endpoints-GETapi-customers--id-">
                                <a href="#endpoints-GETapi-customers--id-">GET api/customers/{id}</a>
                            </li>
                                                                                <li class="tocify-item level-2" data-unique="endpoints-PUTapi-customers--id-">
                                <a href="#endpoints-PUTapi-customers--id-">PUT api/customers/{id}</a>
                            </li>
                                                                                <li class="tocify-item level-2" data-unique="endpoints-DELETEapi-customers--id-">
                                <a href="#endpoints-DELETEapi-customers--id-">DELETE api/customers/{id}</a>
                            </li>
                                                                                <li class="tocify-item level-2" data-unique="endpoints-GETapi-categories">
                                <a href="#endpoints-GETapi-categories">GET api/categories</a>
                            </li>
                                                                                <li class="tocify-item level-2" data-unique="endpoints-POSTapi-categories">
                                <a href="#endpoints-POSTapi-categories">POST api/categories</a>
                            </li>
                                                                                <li class="tocify-item level-2" data-unique="endpoints-GETapi-categories--id-">
                                <a href="#endpoints-GETapi-categories--id-">GET api/categories/{id}</a>
                            </li>
                                                                                <li class="tocify-item level-2" data-unique="endpoints-PUTapi-categories--id-">
                                <a href="#endpoints-PUTapi-categories--id-">PUT api/categories/{id}</a>
                            </li>
                                                                                <li class="tocify-item level-2" data-unique="endpoints-DELETEapi-categories--id-">
                                <a href="#endpoints-DELETEapi-categories--id-">DELETE api/categories/{id}</a>
                            </li>
                                                                                <li class="tocify-item level-2" data-unique="endpoints-GETapi-products">
                                <a href="#endpoints-GETapi-products">GET api/products</a>
                            </li>
                                                                                <li class="tocify-item level-2" data-unique="endpoints-POSTapi-products">
                                <a href="#endpoints-POSTapi-products">POST api/products</a>
                            </li>
                                                                                <li class="tocify-item level-2" data-unique="endpoints-GETapi-products--id-">
                                <a href="#endpoints-GETapi-products--id-">GET api/products/{id}</a>
                            </li>
                                                                                <li class="tocify-item level-2" data-unique="endpoints-PUTapi-products--id-">
                                <a href="#endpoints-PUTapi-products--id-">PUT api/products/{id}</a>
                            </li>
                                                                                <li class="tocify-item level-2" data-unique="endpoints-DELETEapi-products--id-">
                                <a href="#endpoints-DELETEapi-products--id-">DELETE api/products/{id}</a>
                            </li>
                                                                                <li class="tocify-item level-2" data-unique="endpoints-GETapi-users">
                                <a href="#endpoints-GETapi-users">GET api/users</a>
                            </li>
                                                                                <li class="tocify-item level-2" data-unique="endpoints-POSTapi-users">
                                <a href="#endpoints-POSTapi-users">POST api/users</a>
                            </li>
                                                                                <li class="tocify-item level-2" data-unique="endpoints-GETapi-users--id-">
                                <a href="#endpoints-GETapi-users--id-">GET api/users/{id}</a>
                            </li>
                                                                                <li class="tocify-item level-2" data-unique="endpoints-PUTapi-users--id-">
                                <a href="#endpoints-PUTapi-users--id-">PUT api/users/{id}</a>
                            </li>
                                                                                <li class="tocify-item level-2" data-unique="endpoints-DELETEapi-users--id-">
                                <a href="#endpoints-DELETEapi-users--id-">DELETE api/users/{id}</a>
                            </li>
                                                                                <li class="tocify-item level-2" data-unique="endpoints-GETapi-sales">
                                <a href="#endpoints-GETapi-sales">GET api/sales</a>
                            </li>
                                                                                <li class="tocify-item level-2" data-unique="endpoints-POSTapi-sales">
                                <a href="#endpoints-POSTapi-sales">POST api/sales</a>
                            </li>
                                                                                <li class="tocify-item level-2" data-unique="endpoints-GETapi-sales--id-">
                                <a href="#endpoints-GETapi-sales--id-">GET api/sales/{id}</a>
                            </li>
                                                                                <li class="tocify-item level-2" data-unique="endpoints-DELETEapi-sales--id-">
                                <a href="#endpoints-DELETEapi-sales--id-">DELETE api/sales/{id}</a>
                            </li>
                                                                        </ul>
                            </ul>
            </div>

    <ul class="toc-footer" id="toc-footer">
                    <li style="padding-bottom: 5px;"><a href="{{ route("scribe.postman") }}">View Postman collection</a></li>
                            <li style="padding-bottom: 5px;"><a href="{{ route("scribe.openapi") }}">View OpenAPI spec</a></li>
                <li><a href="http://github.com/knuckleswtf/scribe">Documentation powered by Scribe ✍</a></li>
    </ul>

    <ul class="toc-footer" id="last-updated">
        <li>Last updated: June 8, 2026</li>
    </ul>
</div>

<div class="page-wrapper">
    <div class="dark-box"></div>
    <div class="content">
        <h1 id="introduction">Introduction</h1>
<aside>
    <strong>Base URL</strong>: <code>http://localhost</code>
</aside>
<pre><code>This documentation aims to provide all the information you need to work with our API.

&lt;aside&gt;As you scroll, you'll see code examples for working with the API in different programming languages in the dark area to the right (or as part of the content on mobile).
You can switch the language used with the tabs at the top right (or from the nav menu at the top left on mobile).&lt;/aside&gt;</code></pre>

        <h1 id="authenticating-requests">Authenticating requests</h1>
<p>This API is not authenticated.</p>

        <h1 id="endpoints">Endpoints</h1>

    

                                <h2 id="endpoints-GETapi-customers">GET api/customers</h2>

<p>
</p>



<span id="example-requests-GETapi-customers">
<blockquote>Example request:</blockquote>


<div class="bash-example">
    <pre><code class="language-bash">curl --request GET \
    --get "http://localhost/api/customers" \
    --header "Content-Type: application/json" \
    --header "Accept: application/json"</code></pre></div>


<div class="javascript-example">
    <pre><code class="language-javascript">const url = new URL(
    "http://localhost/api/customers"
);

const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
};


fetch(url, {
    method: "GET",
    headers,
}).then(response =&gt; response.json());</code></pre></div>

</span>

<span id="example-responses-GETapi-customers">
            <blockquote>
            <p>Example response (200):</p>
        </blockquote>
                <details class="annotation">
            <summary style="cursor: pointer;">
                <small onclick="textContent = parentElement.parentElement.open ? 'Show headers' : 'Hide headers'">Show headers</small>
            </summary>
            <pre><code class="language-http">cache-control: no-cache, private
content-type: application/json
access-control-allow-origin: *
 </code></pre></details>         <pre>

<code class="language-json" style="max-height: 300px;">{
    &quot;data&quot;: [
        {
            &quot;id&quot;: 1,
            &quot;tipo_documento&quot;: &quot;AZypB4PtLL6Y4EOy0GWp&quot;,
            &quot;numero_documento&quot;: &quot;L0J6LYDjJgLm4jwWltzj&quot;,
            &quot;nombre&quot;: &quot;0Hc0n0u5od5fETPLPjxSYvzqF3esDyn3ogKKU22IgI5ROsemuxNZOVJRjIalYZgHYkMTWa4ZYmnyDdD7mJ5fNzYsXU3SHITuwlIQ&quot;,
            &quot;apellido&quot;: &quot;BoqztbAK1ZxRJjnlxduSwyummC0CHdOFfBh6afNp2R3MbrrbzA3K4f8Ga7n1K62GQvxnWas7AsUwxJIVtwDAYlUjPIPO0eK1PKr7&quot;,
            &quot;email&quot;: &quot;qrosenbaum@example.com&quot;,
            &quot;telefono&quot;: &quot;3ZqMG9SQ1fSOzfk0d040&quot;,
            &quot;direccion&quot;: &quot;Sit consequuntur quaerat sit in incidunt fugiat. Rerum autem maxime qui enim voluptas adipisci. Quidem et perspiciatis quia quam et vel. Aperiam blanditiis suscipit laboriosam fugiat aut.&quot;,
            &quot;distrito&quot;: &quot;z5ujwEoH4h8cW0aD3gpVaiMPnjkNPLKnYSVI3Sv4w9zrRSrV8mPwCYZABVG83otWTnKh7zSqz7Ln4RgRhYb4gAgKpp4ZeBgOmyrZ&quot;,
            &quot;provincia&quot;: &quot;dROW6DnzDJbtetoWR4BfCzhIqffK9Jpbjht3O0wIqUCQTuwBszfJFormVRfpeiUzSObBfL3KtUs3vCZ4R5c5Tced1cDkV1LXczbv&quot;,
            &quot;departamento&quot;: &quot;8G30u0p5s4CMGnsYivW4uCTTvxMzrY5nerVsOMWcYUgxmmrcql90AAR1Z4aBZJVL0mAzqLkROxLxnFJLqP4YTfEyxpDSIOw9Rmhm&quot;,
            &quot;estado&quot;: true
        },
        {
            &quot;id&quot;: 2,
            &quot;tipo_documento&quot;: &quot;NcHj6xpTkWCOoFyCvaql&quot;,
            &quot;numero_documento&quot;: &quot;q7YtXm5sI5oL3zed10SV&quot;,
            &quot;nombre&quot;: &quot;Zmq0n5n0ZDKgOUqob3LO3GSAAmrQQ34KVNOaXMVipJiwCiqPI9k9hGiF7tRqa5ZvT8ycHgF2qmBZ7bVeLel9kpFQNzTOlrTD7dbq&quot;,
            &quot;apellido&quot;: &quot;MfnoD0RLTjuEo282ks9I46qw2GeElH6rbz7LZIoNol0BvGPzjEzw25A7sV5z9JJpB7xEazyp8MW6a3y0KxeZ4kM2Znqfz78ZfRyN&quot;,
            &quot;email&quot;: &quot;millie.bogan@example.org&quot;,
            &quot;telefono&quot;: &quot;O20xKyRtF9pGXAUwfvon&quot;,
            &quot;direccion&quot;: &quot;Voluptas suscipit magnam doloribus deleniti et consequuntur illo voluptates. Aut dolorum enim et autem velit et totam. Repellat facilis doloremque ut corrupti culpa blanditiis sit.&quot;,
            &quot;distrito&quot;: &quot;zZDnIWvsfPdNbHQvxSnntF6HrYPgRCkP1pPuHySTy8mf0hHZnZMBgECTJy0XmLG9dQYqeT80stCWyL9QfgYfh77N8qOzMai1WisF&quot;,
            &quot;provincia&quot;: &quot;r8vnK3e2lz56arDgki9sUgYU1zyyOFJdkS6cPd7TcRWfaU5ptWkmdB92qygLFQ2UykIuvWBDSt9VDpsXaLdF4TCapXyvc5K4ZI6x&quot;,
            &quot;departamento&quot;: &quot;AvOz8v9wUzf9m4FAJoZ7FPxW92EqBLmKi0KMfXPf6qkzs0GnshpiGYhmbUOhe7LwIeOPD3O4scd9vXh5HRbXWI1kacmv7itQe4p3&quot;,
            &quot;estado&quot;: true
        },
        {
            &quot;id&quot;: 3,
            &quot;tipo_documento&quot;: &quot;RWFHziTuffDKSaHqtBQ7&quot;,
            &quot;numero_documento&quot;: &quot;cJIXJjPDvqijq5sRxxYT&quot;,
            &quot;nombre&quot;: &quot;A9lgaBZxKorUr49qmAM3KWFjwJG9x9zGwaBT1xotfiwYPEtitFK7a9TgQKauVgm1W19ltw90bZ84VUD8Xh6aoJVaVLgSz9ltKkCl&quot;,
            &quot;apellido&quot;: &quot;fv3rQH1GN1e7t3Ic1CQRKaDsFPnuFi80Yu1x2jLBHNjzuQG1zUe7bx7GKU0L9F9MbeQUzgQqL5DJuBMbzS6d8A1q8ZfjPE6iPECm&quot;,
            &quot;email&quot;: &quot;fglover@example.org&quot;,
            &quot;telefono&quot;: &quot;nbk3FreQNwyjaCHVTJyu&quot;,
            &quot;direccion&quot;: &quot;Est sapiente iure et et assumenda nihil sapiente. Deserunt et nam cupiditate molestiae eveniet qui. Vel illo animi voluptas et necessitatibus.&quot;,
            &quot;distrito&quot;: &quot;5YyUpLdr1WXhPCqpvUSTmesGcQIfp9ZzO0zT5yRybHBCcm7BXzgsoLNtp0issF4zJjwMe8UAtf1eXRpqgzHAW4mMUDx2CjO8LRyr&quot;,
            &quot;provincia&quot;: &quot;Q7td0JnBOjBjLO7OPXgJ81T2ugXh4B4LyK04oDvSiysAyjYcFRB3izGiRLKN6r8pqYyWl7cnH4QyG91wPVq4MquwqF5gkaK8EQWw&quot;,
            &quot;departamento&quot;: &quot;fRusFFuB3tnpoiY6kxiFjgKdGkxfiwvlvIxN3p1Q1gXm6vX2Q09CfxS0QTxSnYKOOmut2aqzyxQ3XFCS0knjd5Gei2tCiEN4vD1h&quot;,
            &quot;estado&quot;: false
        },
        {
            &quot;id&quot;: 4,
            &quot;tipo_documento&quot;: &quot;gAashdtAYu5KR4EZrN6T&quot;,
            &quot;numero_documento&quot;: &quot;L5SxBBPkOnnIz4Tzey8G&quot;,
            &quot;nombre&quot;: &quot;cE27v0481DPSHwT3HQqX3CCodVqYhlo1JRpQHkX0m7fbTaDPB9Z9BbjLkelA0VG06cri7bcwTyTpnMU7Gser6sb7s0DQztrbNKMV&quot;,
            &quot;apellido&quot;: &quot;o31Yd4y6ub1oOYo28nLJFJcoLX0nk6kImZNH5H9cYahi7GKmG9nqcAKGsoqTVHRdPsKl62iGEVKvRhTpFo7QLtpGnku4LBB94rkS&quot;,
            &quot;email&quot;: &quot;ischumm@example.com&quot;,
            &quot;telefono&quot;: &quot;FnN7vrfaSksrxJp1fo1u&quot;,
            &quot;direccion&quot;: &quot;Quis molestiae eos reprehenderit et. Debitis debitis saepe amet. Ut et quia aut quia ipsum mollitia omnis dolor.&quot;,
            &quot;distrito&quot;: &quot;S46P73HVhD4AxTGkzH8BSHVJRRqbu79uDaR0P5XRa6R2k7GNAJtMzOmY3vb6FZgJVDAPAJkHM29KRoMhGSiB2hEXVWsDGuvuyOj6&quot;,
            &quot;provincia&quot;: &quot;d9B8U45nlZp63dIOyPEw9axSqk2kXtgs7EcobSAvptDXbNs13iln8AexZyI2F9tD8U77M3Dj3I0iu3lRQQC4tT7DN48FElLzxIH0&quot;,
            &quot;departamento&quot;: &quot;OLO5EoDPy63WwC5Uw5BclVQMl2OVW7VXgaPOCi8OOqF5ZGKsUjgjwg78Wi2OG12AvLYPbkSe73I3FkGrtSvLL49mux9GyByxwnS1&quot;,
            &quot;estado&quot;: true
        },
        {
            &quot;id&quot;: 5,
            &quot;tipo_documento&quot;: &quot;B5PbGXQgvCc6yRNYlMTm&quot;,
            &quot;numero_documento&quot;: &quot;RHtmXV0HN5eScq0ZNRuy&quot;,
            &quot;nombre&quot;: &quot;XGZCgkpWfPdfzhOzPAhhMu1r0GJJpJFw4GBvaGEPUTJFmE6pxMGSbGqtfbSDqwRPXQZqiYool3X2hmQAhG3q6sQtR7pbKlMGN4fm&quot;,
            &quot;apellido&quot;: &quot;D9pqW9u3ZWQMlf41U4ZYRJPs8YVvmRpeSq3vcWsXsf5UeI9p9RT5Omr4q4tuZRVnMxpacCk5vfDJF0CLK4WE3j4yoapxoHhHOLHP&quot;,
            &quot;email&quot;: &quot;marcella88@example.net&quot;,
            &quot;telefono&quot;: &quot;RS0ScX8OaUb0EZQAq9Ym&quot;,
            &quot;direccion&quot;: &quot;Eveniet perspiciatis voluptas est accusantium vitae. At pariatur eum laboriosam. Quae in dolores commodi eveniet consectetur. Veniam exercitationem et sunt omnis recusandae.&quot;,
            &quot;distrito&quot;: &quot;pUhWeyIpXSYumY9ooNW2dHtrH5ZTRWVmM2bT1QqSWqXtc4On64jpjiuJI2IvtH3D8AyVmkRZyqi3RCcHMPUl3mZKKbAhAAbfEOkH&quot;,
            &quot;provincia&quot;: &quot;qIGhdFhFT7rfFHJFZeOMSh9EcMmupqeRmM9PNFcK7HinHUUNcfbajoXzsQeXTBCgRax2XOLY386rLxrXIBqH24aegtS1gj1m2LJh&quot;,
            &quot;departamento&quot;: &quot;t3bjsWzKjtc3ISk3gNLJS3d7SOeTFAJ2Y1qlTqcLalMdbxWGuJ2yR1lvjFv5IHZ0GkQLoQ8h9swftuzBKKNlvG4H4fKjzHJzS3qg&quot;,
            &quot;estado&quot;: false
        },
        {
            &quot;id&quot;: 6,
            &quot;tipo_documento&quot;: &quot;k8JC4Chmmz4moUaAwB3V&quot;,
            &quot;numero_documento&quot;: &quot;GaibROgzunvTV044pO6U&quot;,
            &quot;nombre&quot;: &quot;0ZugcAaAw54jbhloCe4Bid5p8FQmWTE33ymsnaYGfRa6vahIfSGM2EDbzZbOqS9GZ2WwAPN4Oa4HnLRqfVvFwPagppTsHH7DTMkr&quot;,
            &quot;apellido&quot;: &quot;xYBg4h4ysM3JwdOi5zcoDS2RJHBHCmPLwPmORtkpg9TVFe3y6fqAzgutkDDIdcCy1oSNuD1al6ba1NOyBxVpSiIrYCKXtYAS7dQI&quot;,
            &quot;email&quot;: &quot;wschiller@example.net&quot;,
            &quot;telefono&quot;: &quot;ydMUFl4FpSdiowB37hIG&quot;,
            &quot;direccion&quot;: &quot;Consequatur eaque quo voluptatibus ut. Nesciunt quia ipsum ab. Dolor ullam quia tempore accusamus. Illum vero qui sapiente repellat voluptatem.&quot;,
            &quot;distrito&quot;: &quot;6GuNjT9twfH3tR5S1GKCnuzsY0tAyvKOLHJygqUmFRRWo5qizX06Rng6WuYOIDfY1ZeqPTBu5h8Fe7sVxQdUB8gMqZQuQK6xDNcC&quot;,
            &quot;provincia&quot;: &quot;h84xq0tKJuYY8XOwLxde1LlRSTNvVvYK9IsRa7yHs7l6ii4I3yvTaAaE1zlsCyAZnJWHIKtZA5O5yBOkSFmP73DeBKxJaou9MUCO&quot;,
            &quot;departamento&quot;: &quot;2gn6LfQWDyBp7duS7888DsoAHFmru0cnFKiaZgjsNwDKnXcocCkovoiIcoszjtdDGfP9ibI6Sp5w4HNQh3xOvm9e4FsAYkiULOVT&quot;,
            &quot;estado&quot;: false
        },
        {
            &quot;id&quot;: 7,
            &quot;tipo_documento&quot;: &quot;cLp1wJWKlfVKRVL9Y3gW&quot;,
            &quot;numero_documento&quot;: &quot;NBKDTlCIQshY9SosIjrG&quot;,
            &quot;nombre&quot;: &quot;UfmX78PD72adwd30F2Vjg3EHZKL5DAejhLEiHPnWMNz5svADVoSTjKGRuKJCgshEDNJCri3sIoH0y0nMzMr5CBJwSwiZX0FMSFwV&quot;,
            &quot;apellido&quot;: &quot;7nPTQ7Da5oXSo8duUrsRXbSaAtveYaVBsHym07y9b9EnhfeKCu6ZjVkZ7NOLdRWrYs7HQKX4Kq9Jnlf7T7g1opTwkkSrCuiB3EV5&quot;,
            &quot;email&quot;: &quot;selmer28@example.com&quot;,
            &quot;telefono&quot;: &quot;I1GGeoxiMfvJqFlmYxlA&quot;,
            &quot;direccion&quot;: &quot;Ut impedit velit et officiis. Dolor corporis porro nihil odio et eos totam. At beatae illo sint ut et et.&quot;,
            &quot;distrito&quot;: &quot;Gk18S1Jyt6cz4ru8QsPvohtElpAFc9wKeql5qn4yMQaex9FIilvfj1FeIfSuLD6n2B83GHHjCnBAI66mvykhp6l0iFv5FkNrfLdo&quot;,
            &quot;provincia&quot;: &quot;KEg7yZmYYyFjQGvPlqji9tAGjAebBzEziPlyreqtYQ7ketve3G37lgC3nnN5gS068hPOUK2BYLt0Oj4AL1ojT1KJ2ZOOjuVweod1&quot;,
            &quot;departamento&quot;: &quot;pphFu3gPtc0grej7IbkW3GV37eRdoSTlD5afSAtBvEqLMGdXCwDrNg9H73v4F1xNGSM4e6SmiilkGrUpNgT0ETbM4bpDTylTTgXf&quot;,
            &quot;estado&quot;: true
        },
        {
            &quot;id&quot;: 8,
            &quot;tipo_documento&quot;: &quot;x8FuoxckQHEoPIqAR00x&quot;,
            &quot;numero_documento&quot;: &quot;tmJo7ZU1I3pQzMldGKcM&quot;,
            &quot;nombre&quot;: &quot;JtQ1INIRxHd09AhEBNqUNjB6gBu7YVTinQ0RhQwuLUjH20Jr80QUKYCjrXGenb4cExskF1hJBa0MtZ3WdlCKjYQ80KTavwvFhvZ3&quot;,
            &quot;apellido&quot;: &quot;4ZMZ8o42qkR9qMVFiMIDhT5jDq2ZL5yNBXovaxRHR5VBuxezyRo4t3Sg22izOvP90AFe6eZVlXQUA3PSzWrVxZqXRs87iX1tWIDP&quot;,
            &quot;email&quot;: &quot;myrtle50@example.org&quot;,
            &quot;telefono&quot;: &quot;5IaNbinRRZl76c3IdLPw&quot;,
            &quot;direccion&quot;: &quot;Et magni repudiandae autem sed aut consequatur porro. Cumque autem fugiat sapiente esse nostrum est. Et eaque odio voluptatem minima quasi at. Aperiam voluptatibus dicta ut atque.&quot;,
            &quot;distrito&quot;: &quot;Vh6ghmRa3eLyZQ4I3GOeuIG3evizkLLNoZVmShceAzajUzGyfkUtS4o0Po6y810H8TYkQpDqRCAHIjaXzzuCNy93R6sm5v0zEPRd&quot;,
            &quot;provincia&quot;: &quot;sA0652OpPCzCv6znqw9tt4gwKTjoFC4d4kumqTvKMC9Fo3QVGMgI6vzOnwupeXXECkAfL0wwYdvAgg9EvwU7n1stgGYi7tUYyxFM&quot;,
            &quot;departamento&quot;: &quot;Duatz6vKui72um9QGmRmDxvUAEzloRJtYBmBwMlOMVkPDW9ApoWQ9ZOFtAmNGxMaCcMFGSz0kh9CRqu3vasQti6it5xqeTuU4IQ5&quot;,
            &quot;estado&quot;: true
        },
        {
            &quot;id&quot;: 9,
            &quot;tipo_documento&quot;: &quot;2wfDtJLkjnTDwPN5T5IN&quot;,
            &quot;numero_documento&quot;: &quot;ftsxfcfNGKOmd9coZVel&quot;,
            &quot;nombre&quot;: &quot;ymmyEs8pWnTXEkF7wveSCE34yPCn7zh6effi0te8Gjeh6o9T7HNv5mgPzfHdxOwhmVNkV5RK22hmWiqrqWn857Bgdj2JpkeIvEeL&quot;,
            &quot;apellido&quot;: &quot;ecphwqQWSUQaGoNVhEiCMgJfKJJLFPltyg451WgrBtIWCE7gu2Pxo5c1aiz7xOwdt6e2BW4mTrtp2sqcTmJmoROgZiyOAmyYEYZK&quot;,
            &quot;email&quot;: &quot;napoleon89@example.com&quot;,
            &quot;telefono&quot;: &quot;bEs7nKmsSUaYCuk8nAVe&quot;,
            &quot;direccion&quot;: &quot;Modi accusamus sed autem ut. Voluptatibus sunt in nostrum quas sed. Et veniam voluptas qui quisquam occaecati nostrum dolor modi.&quot;,
            &quot;distrito&quot;: &quot;mGxLBI0QARq6aNmO0vSQ9zhLN0jSgreUwnV8oj7PCpHkVobImreOV0RNsAGJ01VzAMcNbStLkxlea3LAHyth3YGYPtK2VTVvHygF&quot;,
            &quot;provincia&quot;: &quot;232UpUIMTszSlsKZUghHHmuDSlLnhfA3dG4yLaFLn7O03vQ5wHPfH7jgvdBh31KJ2WcQo9vHBtjwKbHr1ZJuNPkFakIe8H49OcOF&quot;,
            &quot;departamento&quot;: &quot;TZFh2ysAHoHluVsuZ2kQvMyFvCUq6kUJEN0oRPrvqjYqXTaB1ckKaDBxwXvn0JDVrEvNzH8cstjnTExhV7Cs345IxPv8ACXnLfRP&quot;,
            &quot;estado&quot;: true
        },
        {
            &quot;id&quot;: 10,
            &quot;tipo_documento&quot;: &quot;v3tmxRwAPGcFdk5lqf17&quot;,
            &quot;numero_documento&quot;: &quot;ebHyCC1PpFder98CcF9D&quot;,
            &quot;nombre&quot;: &quot;mLHAqHQAlaa1SfGG5OQ0ced5vZ5403BfY7wCvcV2ChZxtsCFrrFQM9SbZZNJLMN2Uz1WRO0wX4B8ATEscrvg516ecHdpRj9mtyIi&quot;,
            &quot;apellido&quot;: &quot;FYSPwEjICFZNGKAZQ3nfOzkjFuzeipkouRl02ijP6WSVVzzjLtrQYPcp72ZRHEdli48j0BdCFhC9dXrBZBgVGU6N9uux3VcuvmuK&quot;,
            &quot;email&quot;: &quot;leonardo43@example.com&quot;,
            &quot;telefono&quot;: &quot;EoBhmIi89eqZ9EryQ8qF&quot;,
            &quot;direccion&quot;: &quot;Ut et tenetur pariatur. Minima ipsa veritatis enim voluptas cum. Natus error veritatis aspernatur ea consequuntur eum nihil. Quasi nesciunt maxime est facere.&quot;,
            &quot;distrito&quot;: &quot;0MtTcM7dp5STthSuE9ybY6ArX9N0dx7MvVJGm7ZEwsH1CTDPnrPWz2ouKBqPB8M361JitGn9e1mYoiQsmAIqJL3K4LqyWoQOu8jk&quot;,
            &quot;provincia&quot;: &quot;OydN1OSI6jWbUi0YxsbgploCXeulYWUHaA67b5HvzL4IZ1dTjm1Ga4W89KPO5BbG9av6BNO4CjcTLogfQZwIGtud5mDR5jfqGgSX&quot;,
            &quot;departamento&quot;: &quot;zoDddhBVoOuJoyv3fIwbNZlQhT2bqbkhAxNnRHa7lOTXH8CHkDqOcEa9nrarMQLWRHj3cBfTu9VnYnYNjbQeQC04V8uhezy8ZQPC&quot;,
            &quot;estado&quot;: false
        },
        {
            &quot;id&quot;: 11,
            &quot;tipo_documento&quot;: &quot;OvOpmD0wYNDJGpdcLPSV&quot;,
            &quot;numero_documento&quot;: &quot;M16elPsMyTEpzOLxzha8&quot;,
            &quot;nombre&quot;: &quot;1NTO84dn1eh5a12htKSTw53sGu2k8jjCLqB3DrGjbqVWUA3c7VMisDYRxhj3c2b3H3sEVJQd01qI1s7Bcj0llcrV08DZayxVCFA8&quot;,
            &quot;apellido&quot;: &quot;0Q2DKKJ0k4Z2CWq5GF3RMO5opj9pkrI81oB4rkHXmunnRxE3JoNy8z4XjmofqDxpGvlyh9qSG8a2YpHeC3vEH7s4EhVJDsv14ZOV&quot;,
            &quot;email&quot;: &quot;jmedhurst@example.org&quot;,
            &quot;telefono&quot;: &quot;Ne1QgMdTXVjbDU00HfcJ&quot;,
            &quot;direccion&quot;: &quot;Aut eum repudiandae vitae enim. Impedit omnis dolor magnam cumque quam rerum. Labore qui eum alias voluptatum ullam dolorem ut architecto. Vitae nulla dolore omnis nihil dolor inventore.&quot;,
            &quot;distrito&quot;: &quot;YfFnfpZRREq9tu3ut51otXzdLgOKbhJE59ojDtF3YSqmRApZBapq72biwccKKIswWxIWfHRID5h99GKPcdUrtfhVSo3bm0GR4Ckj&quot;,
            &quot;provincia&quot;: &quot;UyMiWeLd5HsPSpg2mqJV3FKeqHnJwsw3al1TBTEe3Daw1myIrgCIVtZX9tL07x1Ig9rr2qCd7xfraZZzG8av7ab8oCbwFsGhQtbG&quot;,
            &quot;departamento&quot;: &quot;fOw3pmWyNOAQ05Ml7fQB2UREOr5QHH5M6W6iNZxomPVRWkohIGJj4jggPjnIjGc1vMIztADrHhiol7KFhPxe6sNZ50kEK8Xg0xzS&quot;,
            &quot;estado&quot;: true
        },
        {
            &quot;id&quot;: 12,
            &quot;tipo_documento&quot;: &quot;sZyCrLgebdEECP79iGH5&quot;,
            &quot;numero_documento&quot;: &quot;fQd7WwEvIZGG0Op1glDL&quot;,
            &quot;nombre&quot;: &quot;If6aZgNHK5qTq43NjyLg8iCH3KdssXxruM6GlcRzbIjFXMY4upYrOYDUCYJZSN4D6Q1o5TgGUhTZBsDuTet7tcYbFIm0vAlYpaVe&quot;,
            &quot;apellido&quot;: &quot;eegOvt38cFHyjPQ3qTh9qp21QIHfKVsJJSxTbkOsbu69Ud335njkWZnRJN4gBy4HeFXZby9hRIvUAZZsNrvx5trou99onNxL6dDp&quot;,
            &quot;email&quot;: &quot;zgrant@example.org&quot;,
            &quot;telefono&quot;: &quot;ztvVHyf5fWLul8payRZx&quot;,
            &quot;direccion&quot;: &quot;Consequuntur tenetur quae nulla neque delectus est. Voluptatem quos est qui aspernatur. Doloribus dolores dolor odit hic sit.&quot;,
            &quot;distrito&quot;: &quot;A47LA6rV0PvjvEZFKf4H25R9ACYM9PLtOxZRgXskSeeeSuRRjp76AUjeoZIKxcTkCafsRbEVYrlzDqlPWCeAbPpkbxMTdk4f3laj&quot;,
            &quot;provincia&quot;: &quot;GokxLsDson3a0WidaPhTyK69HUWybYFYOqUB9nsjBvSZqxbcWPtu80C1A6HzGZsfzcf4GO7DCjTg8PYOMU19CMHrUjGSE7gLMbBi&quot;,
            &quot;departamento&quot;: &quot;M3odebC0K6DrCB4OZHXTJEHw5BGPSaTYvfcEoBkXsYz8EJMCAcE9XZ10GGZKxuQGtr6Ah8j0oWptPnmtVpLVGcjBQAtLVDD3OGfl&quot;,
            &quot;estado&quot;: true
        },
        {
            &quot;id&quot;: 13,
            &quot;tipo_documento&quot;: &quot;8m8WoCD6t5dQ6HVwlyhw&quot;,
            &quot;numero_documento&quot;: &quot;bCDiVlK726guTPn47Yi4&quot;,
            &quot;nombre&quot;: &quot;CH6X43isqnKIc9adOnD6tZaHNF2o4HOv2i8u71tOQIdXoa6rIIBWXMzyyM7Mto9dyaqulIMPdpKx7OB25iz7AASpmq1vB9O5v7WM&quot;,
            &quot;apellido&quot;: &quot;7tL51kUsq4ovm7038S5TRZQD8LVziPS3ahZ2aZj7BXN39NWf9vIBjQmhOYFwMoBws3cFwdvoFXW5zhjiROu4nO9mheUetG2Ctflz&quot;,
            &quot;email&quot;: &quot;ycassin@example.org&quot;,
            &quot;telefono&quot;: &quot;OlubNIUILpQKGcC2p6Fu&quot;,
            &quot;direccion&quot;: &quot;Sed corporis quia illum consequuntur et sit. Rerum dolor molestias nobis quo. Minima et laboriosam eos officiis non.&quot;,
            &quot;distrito&quot;: &quot;BxIsrEEaTkRdgiPy7JRcXiGNxcBQqWpDkW7IwWi37OVGTE42PKZI5le0P9GHmavbd0l9a91EvQowy6y8DuC4DxWeLr49P915DDik&quot;,
            &quot;provincia&quot;: &quot;TOFYS0D8GqQun0KO64xiHDMz06WwUGTFeGE21LOC9vTITPxWMEQZD6YWJ7w44yR84XHJeAVjrc7CuulQfudginqDlAtf1mFWvdTA&quot;,
            &quot;departamento&quot;: &quot;GbNeWeQHGgz4M1aQkvqTUdMsxQwGQFGS5ao4dPiRU6eDUi5ax5lEoAIkqvN306ueO26hYGyZ19BffT9gPHlP2yP8r7VF1Oa2O7RE&quot;,
            &quot;estado&quot;: true
        },
        {
            &quot;id&quot;: 14,
            &quot;tipo_documento&quot;: &quot;KdvZ2kSD2osbGe5kHH0A&quot;,
            &quot;numero_documento&quot;: &quot;xYeRMbKq1pNHImyRDCZI&quot;,
            &quot;nombre&quot;: &quot;dOBVuREWqO6KRNmf9tW6Zf09Ol7eVAAucJzBL0tLysHBBY4lL5IRR9waeYEOw3u8P7jnMlttg4LXqZ3SpFo1QzEu9LVXRVEvx24v&quot;,
            &quot;apellido&quot;: &quot;xtolwYqjmrVHNo6GkmdynExt3KE6Sr8bIhB91RcD71NX7nJ7RHOp2oLKHsush1bqvMxOsXepu10n3DyNku1rfTj8cdnSAI7TRtOp&quot;,
            &quot;email&quot;: &quot;bartoletti.loyce@example.net&quot;,
            &quot;telefono&quot;: &quot;RtV1rSzsMzj9cy0BZXD5&quot;,
            &quot;direccion&quot;: &quot;Fuga quo ipsa necessitatibus labore. Dolorem sit perspiciatis voluptates sint. Voluptatem debitis dicta eveniet et molestiae.&quot;,
            &quot;distrito&quot;: &quot;yKlgidUO1dbAq8nJ4laP9iMOjKDkiRB0CqjRYYcqzNM6LvCURaCVLekFOy0x5PdRZu0sUvyj3zSjF07KnYl43nbRPLx2Ucy7I69U&quot;,
            &quot;provincia&quot;: &quot;fEdEpZPhFFhUraR5lJAmymvAA3lbnglTWOphqauhX1hW567KBvfhbmmdmwmGcPAEOiYrrSA7C6NhhKXiPdGHYJpmFCM5i1OMHW3B&quot;,
            &quot;departamento&quot;: &quot;WgVatPxpNBUfWpY7Fr0o2bJ21DnS68RSBXMPCXR17cgbLe3scqhOHLJEGnMPKTKNfkmiqfdxcOREOOKWERwkTYqJG9LcBHi4HXkW&quot;,
            &quot;estado&quot;: true
        },
        {
            &quot;id&quot;: 15,
            &quot;tipo_documento&quot;: &quot;CPJTwkuQNgZh4MLdqmWK&quot;,
            &quot;numero_documento&quot;: &quot;iw6uWCNqvbXmtS4rI8ex&quot;,
            &quot;nombre&quot;: &quot;YlSQSyuy6XIV8uA5VW0ERZmMpekATFo46hNDo7EYdmxcTtVe2RxW9mWl3POgPrvpQo8eXt8FqgStWKSidNeohdpn588htBwouZtd&quot;,
            &quot;apellido&quot;: &quot;lxCeou7yOslxSOkGAPz5z0045n8L1cx3X7LMb1rWYDrlfRkcb3qO3MLJteh6r1BkjKGBFweUlLji9w8K3arkCIAlqEemwoMNnQHh&quot;,
            &quot;email&quot;: &quot;tevin.balistreri@example.com&quot;,
            &quot;telefono&quot;: &quot;zd9SP2rr2xChbGa2DcMl&quot;,
            &quot;direccion&quot;: &quot;Odio ipsam ut iste dolore. Voluptas magni vel est consequatur dolores fuga fugit consequatur. Commodi eveniet distinctio et illum ut officiis ab. Rerum saepe quis perferendis modi voluptas.&quot;,
            &quot;distrito&quot;: &quot;d3yKWAX87I4K0lOmQYAVMtkM2T5eZw6jvVOVcnS0HTCvtbWM1Rdc1G8jxmnd4Nt8sqrN4aEfeEibLhpT9IvDr0t3W19bAt7efykp&quot;,
            &quot;provincia&quot;: &quot;SOFktgoAG6XWqQcBBMJdFIbCYxMKuKKFxV5GwL5L58tqLXFGdxgE1d5DqWb71JbkL3qbPTcjrOSGRpenw1zntdPpuOL8ARBuz0vN&quot;,
            &quot;departamento&quot;: &quot;XHKZcaQ6PnHf4wZ8X8nz5Nxn6VPpTbIrPjMy15GgRR2SbeH6WHqn6mqFjDZS8ei3Sjt75en1BMColHYmMKtkklIMHWJyEoevlVl9&quot;,
            &quot;estado&quot;: false
        }
    ]
}</code>
 </pre>
    </span>
<span id="execution-results-GETapi-customers" hidden>
    <blockquote>Received response<span
                id="execution-response-status-GETapi-customers"></span>:
    </blockquote>
    <pre class="json"><code id="execution-response-content-GETapi-customers"
      data-empty-response-text="<Empty response>" style="max-height: 400px;"></code></pre>
</span>
<span id="execution-error-GETapi-customers" hidden>
    <blockquote>Request failed with error:</blockquote>
    <pre><code id="execution-error-message-GETapi-customers">

Tip: Check that you&#039;re properly connected to the network.
If you&#039;re a maintainer of ths API, verify that your API is running and you&#039;ve enabled CORS.
You can check the Dev Tools console for debugging information.</code></pre>
</span>
<form id="form-GETapi-customers" data-method="GET"
      data-path="api/customers"
      data-authed="0"
      data-hasfiles="0"
      data-isarraybody="0"
      autocomplete="off"
      onsubmit="event.preventDefault(); executeTryOut('GETapi-customers', this);">
    <h3>
        Request&nbsp;&nbsp;&nbsp;
                    <button type="button"
                    style="background-color: #8fbcd4; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-tryout-GETapi-customers"
                    onclick="tryItOut('GETapi-customers');">Try it out ⚡
            </button>
            <button type="button"
                    style="background-color: #c97a7e; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-canceltryout-GETapi-customers"
                    onclick="cancelTryOut('GETapi-customers');" hidden>Cancel 🛑
            </button>&nbsp;&nbsp;
            <button type="submit"
                    style="background-color: #6ac174; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-executetryout-GETapi-customers"
                    data-initial-text="Send Request 💥"
                    data-loading-text="⏱ Sending..."
                    hidden>Send Request 💥
            </button>
            </h3>
            <p>
            <small class="badge badge-green">GET</small>
            <b><code>api/customers</code></b>
        </p>
                <h4 class="fancy-heading-panel"><b>Headers</b></h4>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Content-Type</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Content-Type"                data-endpoint="GETapi-customers"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Accept</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Accept"                data-endpoint="GETapi-customers"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                        </form>

                    <h2 id="endpoints-POSTapi-customers">POST api/customers</h2>

<p>
</p>



<span id="example-requests-POSTapi-customers">
<blockquote>Example request:</blockquote>


<div class="bash-example">
    <pre><code class="language-bash">curl --request POST \
    "http://localhost/api/customers" \
    --header "Content-Type: application/json" \
    --header "Accept: application/json" \
    --data "{
    \"tipo_documento\": \"RUC\",
    \"numero_documento\": \"20601234567\",
    \"nombre\": \"Corporación de Café Amazonas S.A.C.\",
    \"apellido\": null,
    \"email\": \"compras@cafeamazonas.com\",
    \"telefono\": \"945678912\",
    \"direccion\": \"Av. Héroes del Cenepa Nro. 450\",
    \"distrito\": \"Bagua\",
    \"provincia\": \"Bagua\",
    \"departamento\": \"Amazonas\",
    \"estado\": true
}"
</code></pre></div>


<div class="javascript-example">
    <pre><code class="language-javascript">const url = new URL(
    "http://localhost/api/customers"
);

const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
};

let body = {
    "tipo_documento": "RUC",
    "numero_documento": "20601234567",
    "nombre": "Corporación de Café Amazonas S.A.C.",
    "apellido": null,
    "email": "compras@cafeamazonas.com",
    "telefono": "945678912",
    "direccion": "Av. Héroes del Cenepa Nro. 450",
    "distrito": "Bagua",
    "provincia": "Bagua",
    "departamento": "Amazonas",
    "estado": true
};

fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
}).then(response =&gt; response.json());</code></pre></div>

</span>

<span id="example-responses-POSTapi-customers">
</span>
<span id="execution-results-POSTapi-customers" hidden>
    <blockquote>Received response<span
                id="execution-response-status-POSTapi-customers"></span>:
    </blockquote>
    <pre class="json"><code id="execution-response-content-POSTapi-customers"
      data-empty-response-text="<Empty response>" style="max-height: 400px;"></code></pre>
</span>
<span id="execution-error-POSTapi-customers" hidden>
    <blockquote>Request failed with error:</blockquote>
    <pre><code id="execution-error-message-POSTapi-customers">

Tip: Check that you&#039;re properly connected to the network.
If you&#039;re a maintainer of ths API, verify that your API is running and you&#039;ve enabled CORS.
You can check the Dev Tools console for debugging information.</code></pre>
</span>
<form id="form-POSTapi-customers" data-method="POST"
      data-path="api/customers"
      data-authed="0"
      data-hasfiles="0"
      data-isarraybody="0"
      autocomplete="off"
      onsubmit="event.preventDefault(); executeTryOut('POSTapi-customers', this);">
    <h3>
        Request&nbsp;&nbsp;&nbsp;
                    <button type="button"
                    style="background-color: #8fbcd4; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-tryout-POSTapi-customers"
                    onclick="tryItOut('POSTapi-customers');">Try it out ⚡
            </button>
            <button type="button"
                    style="background-color: #c97a7e; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-canceltryout-POSTapi-customers"
                    onclick="cancelTryOut('POSTapi-customers');" hidden>Cancel 🛑
            </button>&nbsp;&nbsp;
            <button type="submit"
                    style="background-color: #6ac174; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-executetryout-POSTapi-customers"
                    data-initial-text="Send Request 💥"
                    data-loading-text="⏱ Sending..."
                    hidden>Send Request 💥
            </button>
            </h3>
            <p>
            <small class="badge badge-black">POST</small>
            <b><code>api/customers</code></b>
        </p>
                <h4 class="fancy-heading-panel"><b>Headers</b></h4>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Content-Type</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Content-Type"                data-endpoint="POSTapi-customers"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Accept</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Accept"                data-endpoint="POSTapi-customers"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                                <h4 class="fancy-heading-panel"><b>Body Parameters</b></h4>
        <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>tipo_documento</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
<i>optional</i> &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="tipo_documento"                data-endpoint="POSTapi-customers"
               value="RUC"
               data-component="body">
    <br>
<p>Tipo de documento de identidad oficial (DNI o RUC). Example: <code>RUC</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>numero_documento</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
<i>optional</i> &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="numero_documento"                data-endpoint="POSTapi-customers"
               value="20601234567"
               data-component="body">
    <br>
<p>Número único identificador del cliente. Example: <code>20601234567</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>nombre</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="nombre"                data-endpoint="POSTapi-customers"
               value="Corporación de Café Amazonas S.A.C."
               data-component="body">
    <br>
<p>Razón social o nombres del cliente. Example: <code>Corporación de Café Amazonas S.A.C.</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>apellido</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
<i>optional</i> &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="apellido"                data-endpoint="POSTapi-customers"
               value=""
               data-component="body">
    <br>
<p>Apellidos completos (Aplica si es persona natural).</p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>email</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
<i>optional</i> &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="email"                data-endpoint="POSTapi-customers"
               value="compras@cafeamazonas.com"
               data-component="body">
    <br>
<p>Correo electrónico corporativo o personal. Example: <code>compras@cafeamazonas.com</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>telefono</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
<i>optional</i> &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="telefono"                data-endpoint="POSTapi-customers"
               value="945678912"
               data-component="body">
    <br>
<p>Número telefónico de contacto. Example: <code>945678912</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>direccion</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
<i>optional</i> &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="direccion"                data-endpoint="POSTapi-customers"
               value="Av. Héroes del Cenepa Nro. 450"
               data-component="body">
    <br>
<p>Dirección física fiscal o domiciliaria. Example: <code>Av. Héroes del Cenepa Nro. 450</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>distrito</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
<i>optional</i> &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="distrito"                data-endpoint="POSTapi-customers"
               value="Bagua"
               data-component="body">
    <br>
<p>Distrito de ubicación de la operación. Example: <code>Bagua</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>provincia</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
<i>optional</i> &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="provincia"                data-endpoint="POSTapi-customers"
               value="Bagua"
               data-component="body">
    <br>
<p>Provincia correspondiente. Example: <code>Bagua</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>departamento</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
<i>optional</i> &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="departamento"                data-endpoint="POSTapi-customers"
               value="Amazonas"
               data-component="body">
    <br>
<p>Departamento de origen. Example: <code>Amazonas</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>estado</code></b>&nbsp;&nbsp;
<small>boolean</small>&nbsp;
 &nbsp;
 &nbsp;
                <label data-endpoint="POSTapi-customers" style="display: none">
            <input type="radio" name="estado"
                   value="true"
                   data-endpoint="POSTapi-customers"
                   data-component="body"             >
            <code>true</code>
        </label>
        <label data-endpoint="POSTapi-customers" style="display: none">
            <input type="radio" name="estado"
                   value="false"
                   data-endpoint="POSTapi-customers"
                   data-component="body"             >
            <code>false</code>
        </label>
    <br>
<p>Define si el cliente está apto para transacciones comerciales. Example: <code>true</code></p>
        </div>
        </form>

                    <h2 id="endpoints-GETapi-customers--id-">GET api/customers/{id}</h2>

<p>
</p>



<span id="example-requests-GETapi-customers--id-">
<blockquote>Example request:</blockquote>


<div class="bash-example">
    <pre><code class="language-bash">curl --request GET \
    --get "http://localhost/api/customers/1" \
    --header "Content-Type: application/json" \
    --header "Accept: application/json"</code></pre></div>


<div class="javascript-example">
    <pre><code class="language-javascript">const url = new URL(
    "http://localhost/api/customers/1"
);

const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
};


fetch(url, {
    method: "GET",
    headers,
}).then(response =&gt; response.json());</code></pre></div>

</span>

<span id="example-responses-GETapi-customers--id-">
            <blockquote>
            <p>Example response (200):</p>
        </blockquote>
                <details class="annotation">
            <summary style="cursor: pointer;">
                <small onclick="textContent = parentElement.parentElement.open ? 'Show headers' : 'Hide headers'">Show headers</small>
            </summary>
            <pre><code class="language-http">cache-control: no-cache, private
content-type: application/json
access-control-allow-origin: *
 </code></pre></details>         <pre>

<code class="language-json" style="max-height: 300px;">{
    &quot;data&quot;: {
        &quot;id&quot;: 1,
        &quot;tipo_documento&quot;: &quot;AZypB4PtLL6Y4EOy0GWp&quot;,
        &quot;numero_documento&quot;: &quot;L0J6LYDjJgLm4jwWltzj&quot;,
        &quot;nombre&quot;: &quot;0Hc0n0u5od5fETPLPjxSYvzqF3esDyn3ogKKU22IgI5ROsemuxNZOVJRjIalYZgHYkMTWa4ZYmnyDdD7mJ5fNzYsXU3SHITuwlIQ&quot;,
        &quot;apellido&quot;: &quot;BoqztbAK1ZxRJjnlxduSwyummC0CHdOFfBh6afNp2R3MbrrbzA3K4f8Ga7n1K62GQvxnWas7AsUwxJIVtwDAYlUjPIPO0eK1PKr7&quot;,
        &quot;email&quot;: &quot;qrosenbaum@example.com&quot;,
        &quot;telefono&quot;: &quot;3ZqMG9SQ1fSOzfk0d040&quot;,
        &quot;direccion&quot;: &quot;Sit consequuntur quaerat sit in incidunt fugiat. Rerum autem maxime qui enim voluptas adipisci. Quidem et perspiciatis quia quam et vel. Aperiam blanditiis suscipit laboriosam fugiat aut.&quot;,
        &quot;distrito&quot;: &quot;z5ujwEoH4h8cW0aD3gpVaiMPnjkNPLKnYSVI3Sv4w9zrRSrV8mPwCYZABVG83otWTnKh7zSqz7Ln4RgRhYb4gAgKpp4ZeBgOmyrZ&quot;,
        &quot;provincia&quot;: &quot;dROW6DnzDJbtetoWR4BfCzhIqffK9Jpbjht3O0wIqUCQTuwBszfJFormVRfpeiUzSObBfL3KtUs3vCZ4R5c5Tced1cDkV1LXczbv&quot;,
        &quot;departamento&quot;: &quot;8G30u0p5s4CMGnsYivW4uCTTvxMzrY5nerVsOMWcYUgxmmrcql90AAR1Z4aBZJVL0mAzqLkROxLxnFJLqP4YTfEyxpDSIOw9Rmhm&quot;,
        &quot;estado&quot;: true
    }
}</code>
 </pre>
    </span>
<span id="execution-results-GETapi-customers--id-" hidden>
    <blockquote>Received response<span
                id="execution-response-status-GETapi-customers--id-"></span>:
    </blockquote>
    <pre class="json"><code id="execution-response-content-GETapi-customers--id-"
      data-empty-response-text="<Empty response>" style="max-height: 400px;"></code></pre>
</span>
<span id="execution-error-GETapi-customers--id-" hidden>
    <blockquote>Request failed with error:</blockquote>
    <pre><code id="execution-error-message-GETapi-customers--id-">

Tip: Check that you&#039;re properly connected to the network.
If you&#039;re a maintainer of ths API, verify that your API is running and you&#039;ve enabled CORS.
You can check the Dev Tools console for debugging information.</code></pre>
</span>
<form id="form-GETapi-customers--id-" data-method="GET"
      data-path="api/customers/{id}"
      data-authed="0"
      data-hasfiles="0"
      data-isarraybody="0"
      autocomplete="off"
      onsubmit="event.preventDefault(); executeTryOut('GETapi-customers--id-', this);">
    <h3>
        Request&nbsp;&nbsp;&nbsp;
                    <button type="button"
                    style="background-color: #8fbcd4; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-tryout-GETapi-customers--id-"
                    onclick="tryItOut('GETapi-customers--id-');">Try it out ⚡
            </button>
            <button type="button"
                    style="background-color: #c97a7e; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-canceltryout-GETapi-customers--id-"
                    onclick="cancelTryOut('GETapi-customers--id-');" hidden>Cancel 🛑
            </button>&nbsp;&nbsp;
            <button type="submit"
                    style="background-color: #6ac174; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-executetryout-GETapi-customers--id-"
                    data-initial-text="Send Request 💥"
                    data-loading-text="⏱ Sending..."
                    hidden>Send Request 💥
            </button>
            </h3>
            <p>
            <small class="badge badge-green">GET</small>
            <b><code>api/customers/{id}</code></b>
        </p>
                <h4 class="fancy-heading-panel"><b>Headers</b></h4>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Content-Type</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Content-Type"                data-endpoint="GETapi-customers--id-"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Accept</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Accept"                data-endpoint="GETapi-customers--id-"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                        <h4 class="fancy-heading-panel"><b>URL Parameters</b></h4>
                    <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>id</code></b>&nbsp;&nbsp;
<small>integer</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="number" style="display: none"
               step="any"               name="id"                data-endpoint="GETapi-customers--id-"
               value="1"
               data-component="url">
    <br>
<p>The ID of the customer. Example: <code>1</code></p>
            </div>
                    </form>

                    <h2 id="endpoints-PUTapi-customers--id-">PUT api/customers/{id}</h2>

<p>
</p>



<span id="example-requests-PUTapi-customers--id-">
<blockquote>Example request:</blockquote>


<div class="bash-example">
    <pre><code class="language-bash">curl --request PUT \
    "http://localhost/api/customers/1" \
    --header "Content-Type: application/json" \
    --header "Accept: application/json" \
    --data "{
    \"tipo_documento\": \"DNI\",
    \"numero_documento\": \"45678912\",
    \"nombre\": \"Juan Alberto\",
    \"apellido\": \"Fernandez Delgado\",
    \"email\": \"juan.fernandez@gmail.com\",
    \"telefono\": \"961234567\",
    \"direccion\": \"Sector El Parco - Finca La Victoria\",
    \"distrito\": \"Cajaruro\",
    \"provincia\": \"Utcubamba\",
    \"departamento\": \"Amazonas\",
    \"estado\": true
}"
</code></pre></div>


<div class="javascript-example">
    <pre><code class="language-javascript">const url = new URL(
    "http://localhost/api/customers/1"
);

const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
};

let body = {
    "tipo_documento": "DNI",
    "numero_documento": "45678912",
    "nombre": "Juan Alberto",
    "apellido": "Fernandez Delgado",
    "email": "juan.fernandez@gmail.com",
    "telefono": "961234567",
    "direccion": "Sector El Parco - Finca La Victoria",
    "distrito": "Cajaruro",
    "provincia": "Utcubamba",
    "departamento": "Amazonas",
    "estado": true
};

fetch(url, {
    method: "PUT",
    headers,
    body: JSON.stringify(body),
}).then(response =&gt; response.json());</code></pre></div>

</span>

<span id="example-responses-PUTapi-customers--id-">
</span>
<span id="execution-results-PUTapi-customers--id-" hidden>
    <blockquote>Received response<span
                id="execution-response-status-PUTapi-customers--id-"></span>:
    </blockquote>
    <pre class="json"><code id="execution-response-content-PUTapi-customers--id-"
      data-empty-response-text="<Empty response>" style="max-height: 400px;"></code></pre>
</span>
<span id="execution-error-PUTapi-customers--id-" hidden>
    <blockquote>Request failed with error:</blockquote>
    <pre><code id="execution-error-message-PUTapi-customers--id-">

Tip: Check that you&#039;re properly connected to the network.
If you&#039;re a maintainer of ths API, verify that your API is running and you&#039;ve enabled CORS.
You can check the Dev Tools console for debugging information.</code></pre>
</span>
<form id="form-PUTapi-customers--id-" data-method="PUT"
      data-path="api/customers/{id}"
      data-authed="0"
      data-hasfiles="0"
      data-isarraybody="0"
      autocomplete="off"
      onsubmit="event.preventDefault(); executeTryOut('PUTapi-customers--id-', this);">
    <h3>
        Request&nbsp;&nbsp;&nbsp;
                    <button type="button"
                    style="background-color: #8fbcd4; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-tryout-PUTapi-customers--id-"
                    onclick="tryItOut('PUTapi-customers--id-');">Try it out ⚡
            </button>
            <button type="button"
                    style="background-color: #c97a7e; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-canceltryout-PUTapi-customers--id-"
                    onclick="cancelTryOut('PUTapi-customers--id-');" hidden>Cancel 🛑
            </button>&nbsp;&nbsp;
            <button type="submit"
                    style="background-color: #6ac174; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-executetryout-PUTapi-customers--id-"
                    data-initial-text="Send Request 💥"
                    data-loading-text="⏱ Sending..."
                    hidden>Send Request 💥
            </button>
            </h3>
            <p>
            <small class="badge badge-darkblue">PUT</small>
            <b><code>api/customers/{id}</code></b>
        </p>
            <p>
            <small class="badge badge-purple">PATCH</small>
            <b><code>api/customers/{id}</code></b>
        </p>
                <h4 class="fancy-heading-panel"><b>Headers</b></h4>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Content-Type</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Content-Type"                data-endpoint="PUTapi-customers--id-"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Accept</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Accept"                data-endpoint="PUTapi-customers--id-"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                        <h4 class="fancy-heading-panel"><b>URL Parameters</b></h4>
                    <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>id</code></b>&nbsp;&nbsp;
<small>integer</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="number" style="display: none"
               step="any"               name="id"                data-endpoint="PUTapi-customers--id-"
               value="1"
               data-component="url">
    <br>
<p>The ID of the customer. Example: <code>1</code></p>
            </div>
                            <h4 class="fancy-heading-panel"><b>Body Parameters</b></h4>
        <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>tipo_documento</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
<i>optional</i> &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="tipo_documento"                data-endpoint="PUTapi-customers--id-"
               value="DNI"
               data-component="body">
    <br>
<p>Tipo de documento de identidad oficial. Example: <code>DNI</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>numero_documento</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
<i>optional</i> &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="numero_documento"                data-endpoint="PUTapi-customers--id-"
               value="45678912"
               data-component="body">
    <br>
<p>Número único identificador del cliente. Example: <code>45678912</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>nombre</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="nombre"                data-endpoint="PUTapi-customers--id-"
               value="Juan Alberto"
               data-component="body">
    <br>
<p>Nombres del productor o cliente. Example: <code>Juan Alberto</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>apellido</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
<i>optional</i> &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="apellido"                data-endpoint="PUTapi-customers--id-"
               value="Fernandez Delgado"
               data-component="body">
    <br>
<p>Apellidos del productor o cliente. Example: <code>Fernandez Delgado</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>email</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
<i>optional</i> &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="email"                data-endpoint="PUTapi-customers--id-"
               value="juan.fernandez@gmail.com"
               data-component="body">
    <br>
<p>Correo electrónico de contacto. Example: <code>juan.fernandez@gmail.com</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>telefono</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
<i>optional</i> &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="telefono"                data-endpoint="PUTapi-customers--id-"
               value="961234567"
               data-component="body">
    <br>
<p>Número telefónico o celular. Example: <code>961234567</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>direccion</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
<i>optional</i> &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="direccion"                data-endpoint="PUTapi-customers--id-"
               value="Sector El Parco - Finca La Victoria"
               data-component="body">
    <br>
<p>Dirección física o nombre de la finca cafetalera. Example: <code>Sector El Parco - Finca La Victoria</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>distrito</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
<i>optional</i> &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="distrito"                data-endpoint="PUTapi-customers--id-"
               value="Cajaruro"
               data-component="body">
    <br>
<p>Distrito de residencia o acopio. Example: <code>Cajaruro</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>provincia</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
<i>optional</i> &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="provincia"                data-endpoint="PUTapi-customers--id-"
               value="Utcubamba"
               data-component="body">
    <br>
<p>Provincia correspondiente. Example: <code>Utcubamba</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>departamento</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
<i>optional</i> &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="departamento"                data-endpoint="PUTapi-customers--id-"
               value="Amazonas"
               data-component="body">
    <br>
<p>Departamento de origen. Example: <code>Amazonas</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>estado</code></b>&nbsp;&nbsp;
<small>boolean</small>&nbsp;
 &nbsp;
 &nbsp;
                <label data-endpoint="PUTapi-customers--id-" style="display: none">
            <input type="radio" name="estado"
                   value="true"
                   data-endpoint="PUTapi-customers--id-"
                   data-component="body"             >
            <code>true</code>
        </label>
        <label data-endpoint="PUTapi-customers--id-" style="display: none">
            <input type="radio" name="estado"
                   value="false"
                   data-endpoint="PUTapi-customers--id-"
                   data-component="body"             >
            <code>false</code>
        </label>
    <br>
<p>Estado operativo del cliente. Example: <code>true</code></p>
        </div>
        </form>

                    <h2 id="endpoints-DELETEapi-customers--id-">DELETE api/customers/{id}</h2>

<p>
</p>



<span id="example-requests-DELETEapi-customers--id-">
<blockquote>Example request:</blockquote>


<div class="bash-example">
    <pre><code class="language-bash">curl --request DELETE \
    "http://localhost/api/customers/1" \
    --header "Content-Type: application/json" \
    --header "Accept: application/json"</code></pre></div>


<div class="javascript-example">
    <pre><code class="language-javascript">const url = new URL(
    "http://localhost/api/customers/1"
);

const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
};


fetch(url, {
    method: "DELETE",
    headers,
}).then(response =&gt; response.json());</code></pre></div>

</span>

<span id="example-responses-DELETEapi-customers--id-">
</span>
<span id="execution-results-DELETEapi-customers--id-" hidden>
    <blockquote>Received response<span
                id="execution-response-status-DELETEapi-customers--id-"></span>:
    </blockquote>
    <pre class="json"><code id="execution-response-content-DELETEapi-customers--id-"
      data-empty-response-text="<Empty response>" style="max-height: 400px;"></code></pre>
</span>
<span id="execution-error-DELETEapi-customers--id-" hidden>
    <blockquote>Request failed with error:</blockquote>
    <pre><code id="execution-error-message-DELETEapi-customers--id-">

Tip: Check that you&#039;re properly connected to the network.
If you&#039;re a maintainer of ths API, verify that your API is running and you&#039;ve enabled CORS.
You can check the Dev Tools console for debugging information.</code></pre>
</span>
<form id="form-DELETEapi-customers--id-" data-method="DELETE"
      data-path="api/customers/{id}"
      data-authed="0"
      data-hasfiles="0"
      data-isarraybody="0"
      autocomplete="off"
      onsubmit="event.preventDefault(); executeTryOut('DELETEapi-customers--id-', this);">
    <h3>
        Request&nbsp;&nbsp;&nbsp;
                    <button type="button"
                    style="background-color: #8fbcd4; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-tryout-DELETEapi-customers--id-"
                    onclick="tryItOut('DELETEapi-customers--id-');">Try it out ⚡
            </button>
            <button type="button"
                    style="background-color: #c97a7e; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-canceltryout-DELETEapi-customers--id-"
                    onclick="cancelTryOut('DELETEapi-customers--id-');" hidden>Cancel 🛑
            </button>&nbsp;&nbsp;
            <button type="submit"
                    style="background-color: #6ac174; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-executetryout-DELETEapi-customers--id-"
                    data-initial-text="Send Request 💥"
                    data-loading-text="⏱ Sending..."
                    hidden>Send Request 💥
            </button>
            </h3>
            <p>
            <small class="badge badge-red">DELETE</small>
            <b><code>api/customers/{id}</code></b>
        </p>
                <h4 class="fancy-heading-panel"><b>Headers</b></h4>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Content-Type</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Content-Type"                data-endpoint="DELETEapi-customers--id-"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Accept</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Accept"                data-endpoint="DELETEapi-customers--id-"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                        <h4 class="fancy-heading-panel"><b>URL Parameters</b></h4>
                    <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>id</code></b>&nbsp;&nbsp;
<small>integer</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="number" style="display: none"
               step="any"               name="id"                data-endpoint="DELETEapi-customers--id-"
               value="1"
               data-component="url">
    <br>
<p>The ID of the customer. Example: <code>1</code></p>
            </div>
                    </form>

                    <h2 id="endpoints-GETapi-categories">GET api/categories</h2>

<p>
</p>



<span id="example-requests-GETapi-categories">
<blockquote>Example request:</blockquote>


<div class="bash-example">
    <pre><code class="language-bash">curl --request GET \
    --get "http://localhost/api/categories" \
    --header "Content-Type: application/json" \
    --header "Accept: application/json"</code></pre></div>


<div class="javascript-example">
    <pre><code class="language-javascript">const url = new URL(
    "http://localhost/api/categories"
);

const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
};


fetch(url, {
    method: "GET",
    headers,
}).then(response =&gt; response.json());</code></pre></div>

</span>

<span id="example-responses-GETapi-categories">
            <blockquote>
            <p>Example response (200):</p>
        </blockquote>
                <details class="annotation">
            <summary style="cursor: pointer;">
                <small onclick="textContent = parentElement.parentElement.open ? 'Show headers' : 'Hide headers'">Show headers</small>
            </summary>
            <pre><code class="language-http">cache-control: no-cache, private
content-type: application/json
access-control-allow-origin: *
 </code></pre></details>         <pre>

<code class="language-json" style="max-height: 300px;">{
    &quot;data&quot;: [
        {
            &quot;id&quot;: 1,
            &quot;nombre&quot;: &quot;ZoxGfvxNAbrpLIDgmgWh8kucGgU4ujbpTdchwPrPiSpfwOgkuIH8GmUTI9Q18FWhAqZAgVCwRBybYCux6sVm44840vpgsk3YQcCD&quot;,
            &quot;descripcion&quot;: &quot;Ut sint dolores et omnis delectus. Non qui rerum error et nulla doloremque corrupti. Voluptatum molestias odit suscipit esse perspiciatis.&quot;,
            &quot;estado&quot;: false
        },
        {
            &quot;id&quot;: 2,
            &quot;nombre&quot;: &quot;WNF1IAHwCx6yBkJnchzLgmd0f1PSROvvxhCLBVmtyUV6T8jXTvKUwQKxy3p7V5RZwIl8ANxwNYoZlWtJPX0FKSckwEMka6RV3hDQ&quot;,
            &quot;descripcion&quot;: &quot;Totam sint officia distinctio soluta natus quos. Beatae sequi nam ipsa id quos maxime corrupti. Ducimus rem non corporis aliquid voluptas. Eius sint aliquid enim dolorem dolor ipsum.&quot;,
            &quot;estado&quot;: true
        },
        {
            &quot;id&quot;: 3,
            &quot;nombre&quot;: &quot;oXKOUup0EVSdHSXhzyLOEUfD1S9APGkAdvHpnqrpHfgYMYw6p2AM9Gd3HuJ1UAlHLpO2nghbpVTgaHLU1AfIU9l1nFeSR08XSCeP&quot;,
            &quot;descripcion&quot;: &quot;Et suscipit quis nam consequuntur laborum in omnis. Ad nihil blanditiis neque molestiae est id. Voluptate doloribus dolor at deleniti consequatur incidunt.&quot;,
            &quot;estado&quot;: true
        },
        {
            &quot;id&quot;: 4,
            &quot;nombre&quot;: &quot;l2kUId2dYyYR1R5QzJfmqa8zcg6VoYVYFS2CdHlrwHNDQUXsAwNRWfUPY1CEYvYbJkTMeVsCCZZ4LW49gghre05Z6m0PRLElYRcw&quot;,
            &quot;descripcion&quot;: &quot;Eveniet explicabo repellendus blanditiis itaque eius. Atque illum vero animi iusto. Mollitia sit placeat iusto sit voluptatem. Dolor odio sequi doloribus voluptatem id.&quot;,
            &quot;estado&quot;: false
        },
        {
            &quot;id&quot;: 5,
            &quot;nombre&quot;: &quot;cIBCznibp1huSh7h6dGmsMJpsakou0p9clMxkvXXZwFTca7voUGSBGqPlx10lZtdAsrxpVJkmU5Zv0xXrs5mAK9zrPMMoCsRgQKs&quot;,
            &quot;descripcion&quot;: &quot;Sed autem et eligendi. Excepturi consequatur ipsa hic nostrum blanditiis voluptatem dignissimos. Minus quia nostrum voluptates pariatur.&quot;,
            &quot;estado&quot;: true
        },
        {
            &quot;id&quot;: 6,
            &quot;nombre&quot;: &quot;HMXdF7dOXSXGyyeJQ5oLlbdtiBI3ESGzMDfbUP8wCO0CzJnFHqx3cdEASjhIdKDfZ1KrqsXR1CTYMZcSTWJmhZMg9YTX46mORfPs&quot;,
            &quot;descripcion&quot;: &quot;Voluptatem possimus dolor rerum fugiat rerum voluptatem ut occaecati. Aut optio adipisci suscipit officia.&quot;,
            &quot;estado&quot;: false
        },
        {
            &quot;id&quot;: 7,
            &quot;nombre&quot;: &quot;2UTPZeuj0WQYXpLwCR5bVMO7IjbqFEX7O3pd6Neqni8e6Nmhju4B187ndIT05DRSyS4pmgAU3ZIkD93FnGQOM5ik25FDpN9QIVAc&quot;,
            &quot;descripcion&quot;: &quot;Non quod ad quia laboriosam et cupiditate harum. Molestiae qui repudiandae atque et adipisci est neque ex. Dolorem aspernatur earum veritatis aperiam excepturi.&quot;,
            &quot;estado&quot;: false
        },
        {
            &quot;id&quot;: 8,
            &quot;nombre&quot;: &quot;Ks03rJkjVqipghJwAxOhXbHRYrDct0PajQmnOmJ5Q5Y3V67pDKypgttQ7wmLWr50q8a0zdcEYiVr4S4BI7GsEpqGWuLEUGHjD0Ho&quot;,
            &quot;descripcion&quot;: &quot;Perspiciatis similique recusandae molestias. Repellat odit quia consequatur labore quia praesentium. Et qui in praesentium rerum corrupti sed.&quot;,
            &quot;estado&quot;: true
        },
        {
            &quot;id&quot;: 9,
            &quot;nombre&quot;: &quot;MjR3XN7PmYp8osEMTKh96VdTbRrYdVY5VogUm55b5uzB1xUb7T6j7PtoaCVWhWAJo9xwIWF2SpAljHHI5mQTnNvrYOSIosIQy8Ep&quot;,
            &quot;descripcion&quot;: &quot;Non est magnam eos aperiam quisquam. Labore qui quidem est. Sed et perspiciatis totam.&quot;,
            &quot;estado&quot;: false
        },
        {
            &quot;id&quot;: 10,
            &quot;nombre&quot;: &quot;ZzesBc8AoE5PPBcREjTO0Yc4M3laU45fkkekTZcsxOZnvdB7pjaTvgo1NfkBQEK69izSHJXUeRxbsdRlENjtHOEUMJOhBrGN5hl6&quot;,
            &quot;descripcion&quot;: &quot;Consequuntur nisi culpa soluta ratione sed laborum magni. Dolorum quia ut non aspernatur. Quo quam quo porro laudantium sit voluptatem. Accusantium et assumenda facilis est.&quot;,
            &quot;estado&quot;: true
        },
        {
            &quot;id&quot;: 11,
            &quot;nombre&quot;: &quot;c0LN9NJWtIldkvouj7H8QpCO6uWpshepQMpjP6wD0YHTsaPjPsIL0ScG5oLLdGfGUAHRsDeAN546dC4SmFyZqqsZODdSCkx55l4h&quot;,
            &quot;descripcion&quot;: &quot;Illum harum unde in quae ratione repudiandae mollitia. Necessitatibus blanditiis voluptatibus tempore soluta architecto. Dicta autem laudantium et rem delectus.&quot;,
            &quot;estado&quot;: true
        },
        {
            &quot;id&quot;: 12,
            &quot;nombre&quot;: &quot;8AXaLCoGLlOHiu91W1lyRIZLAAOwXuu6qXKR1JvdCMXaDu2wb2op1pM7ryawv4UdesCckASxWpxj6d7mcbSuNDRrq9G6nj6u2hZe&quot;,
            &quot;descripcion&quot;: &quot;Quis aut laboriosam consequuntur earum. Voluptates aliquid magnam ab totam nemo iste. Dolorem saepe nulla ipsam sunt et esse ab. Occaecati voluptatem est quisquam quae excepturi praesentium.&quot;,
            &quot;estado&quot;: false
        },
        {
            &quot;id&quot;: 13,
            &quot;nombre&quot;: &quot;9eHNpef98ofnegs1UJ13NGuTRaUDQm4PdRBrvhtKuqSzjxlhuyxYonPhci3x5nsiig2sIwWgB5vWtUR5razBjhK1TcwevKj8dgZp&quot;,
            &quot;descripcion&quot;: &quot;Eligendi ut debitis quasi ratione odio. Et omnis natus ipsa vel. Nihil veniam sequi ipsa consequatur. Assumenda maiores nesciunt esse animi. Magni nesciunt officiis sunt illum fuga modi corrupti.&quot;,
            &quot;estado&quot;: false
        },
        {
            &quot;id&quot;: 14,
            &quot;nombre&quot;: &quot;dn4X6gImq6F3s96JoXuk833nymMaKhpW27QJ8oO8CYVOSD5McWwwpYASgRTi9lo0tmCaY3vcqQy2s1pSGZgrQzSFkZQDHPfVRJrD&quot;,
            &quot;descripcion&quot;: &quot;Voluptatem voluptate quia quam est nostrum dolor. Molestiae delectus maxime qui hic nulla molestias. Est et qui libero id suscipit veritatis. Tempore aut dolorum laboriosam ipsum sunt asperiores qui.&quot;,
            &quot;estado&quot;: false
        },
        {
            &quot;id&quot;: 15,
            &quot;nombre&quot;: &quot;tnFvw7I1rmAM0SOnNknnro2MLgidHKjHgJFWz7cAExfH4INbsfdMJGbM1PXpD7aB6IIVQweNW8IMd75LM8yIJq9Czv9ZQnOOmqzm&quot;,
            &quot;descripcion&quot;: &quot;Ut cum eos in non. Distinctio assumenda pariatur nobis fuga ex. Corrupti distinctio fugiat temporibus officia architecto eum. Provident harum quisquam accusantium similique non omnis fugit eaque.&quot;,
            &quot;estado&quot;: false
        }
    ]
}</code>
 </pre>
    </span>
<span id="execution-results-GETapi-categories" hidden>
    <blockquote>Received response<span
                id="execution-response-status-GETapi-categories"></span>:
    </blockquote>
    <pre class="json"><code id="execution-response-content-GETapi-categories"
      data-empty-response-text="<Empty response>" style="max-height: 400px;"></code></pre>
</span>
<span id="execution-error-GETapi-categories" hidden>
    <blockquote>Request failed with error:</blockquote>
    <pre><code id="execution-error-message-GETapi-categories">

Tip: Check that you&#039;re properly connected to the network.
If you&#039;re a maintainer of ths API, verify that your API is running and you&#039;ve enabled CORS.
You can check the Dev Tools console for debugging information.</code></pre>
</span>
<form id="form-GETapi-categories" data-method="GET"
      data-path="api/categories"
      data-authed="0"
      data-hasfiles="0"
      data-isarraybody="0"
      autocomplete="off"
      onsubmit="event.preventDefault(); executeTryOut('GETapi-categories', this);">
    <h3>
        Request&nbsp;&nbsp;&nbsp;
                    <button type="button"
                    style="background-color: #8fbcd4; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-tryout-GETapi-categories"
                    onclick="tryItOut('GETapi-categories');">Try it out ⚡
            </button>
            <button type="button"
                    style="background-color: #c97a7e; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-canceltryout-GETapi-categories"
                    onclick="cancelTryOut('GETapi-categories');" hidden>Cancel 🛑
            </button>&nbsp;&nbsp;
            <button type="submit"
                    style="background-color: #6ac174; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-executetryout-GETapi-categories"
                    data-initial-text="Send Request 💥"
                    data-loading-text="⏱ Sending..."
                    hidden>Send Request 💥
            </button>
            </h3>
            <p>
            <small class="badge badge-green">GET</small>
            <b><code>api/categories</code></b>
        </p>
                <h4 class="fancy-heading-panel"><b>Headers</b></h4>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Content-Type</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Content-Type"                data-endpoint="GETapi-categories"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Accept</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Accept"                data-endpoint="GETapi-categories"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                        </form>

                    <h2 id="endpoints-POSTapi-categories">POST api/categories</h2>

<p>
</p>



<span id="example-requests-POSTapi-categories">
<blockquote>Example request:</blockquote>


<div class="bash-example">
    <pre><code class="language-bash">curl --request POST \
    "http://localhost/api/categories" \
    --header "Content-Type: application/json" \
    --header "Accept: application/json" \
    --data "{
    \"nombre\": \"Café Especial de Altura\",
    \"descripcion\": \"Variedades de café pergamino y derivados de cacao.\",
    \"estado\": true
}"
</code></pre></div>


<div class="javascript-example">
    <pre><code class="language-javascript">const url = new URL(
    "http://localhost/api/categories"
);

const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
};

let body = {
    "nombre": "Café Especial de Altura",
    "descripcion": "Variedades de café pergamino y derivados de cacao.",
    "estado": true
};

fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
}).then(response =&gt; response.json());</code></pre></div>

</span>

<span id="example-responses-POSTapi-categories">
</span>
<span id="execution-results-POSTapi-categories" hidden>
    <blockquote>Received response<span
                id="execution-response-status-POSTapi-categories"></span>:
    </blockquote>
    <pre class="json"><code id="execution-response-content-POSTapi-categories"
      data-empty-response-text="<Empty response>" style="max-height: 400px;"></code></pre>
</span>
<span id="execution-error-POSTapi-categories" hidden>
    <blockquote>Request failed with error:</blockquote>
    <pre><code id="execution-error-message-POSTapi-categories">

Tip: Check that you&#039;re properly connected to the network.
If you&#039;re a maintainer of ths API, verify that your API is running and you&#039;ve enabled CORS.
You can check the Dev Tools console for debugging information.</code></pre>
</span>
<form id="form-POSTapi-categories" data-method="POST"
      data-path="api/categories"
      data-authed="0"
      data-hasfiles="0"
      data-isarraybody="0"
      autocomplete="off"
      onsubmit="event.preventDefault(); executeTryOut('POSTapi-categories', this);">
    <h3>
        Request&nbsp;&nbsp;&nbsp;
                    <button type="button"
                    style="background-color: #8fbcd4; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-tryout-POSTapi-categories"
                    onclick="tryItOut('POSTapi-categories');">Try it out ⚡
            </button>
            <button type="button"
                    style="background-color: #c97a7e; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-canceltryout-POSTapi-categories"
                    onclick="cancelTryOut('POSTapi-categories');" hidden>Cancel 🛑
            </button>&nbsp;&nbsp;
            <button type="submit"
                    style="background-color: #6ac174; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-executetryout-POSTapi-categories"
                    data-initial-text="Send Request 💥"
                    data-loading-text="⏱ Sending..."
                    hidden>Send Request 💥
            </button>
            </h3>
            <p>
            <small class="badge badge-black">POST</small>
            <b><code>api/categories</code></b>
        </p>
                <h4 class="fancy-heading-panel"><b>Headers</b></h4>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Content-Type</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Content-Type"                data-endpoint="POSTapi-categories"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Accept</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Accept"                data-endpoint="POSTapi-categories"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                                <h4 class="fancy-heading-panel"><b>Body Parameters</b></h4>
        <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>nombre</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="nombre"                data-endpoint="POSTapi-categories"
               value="Café Especial de Altura"
               data-component="body">
    <br>
<p>Nombre de la categoría de la industria agrícola. Example: <code>Café Especial de Altura</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>descripcion</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
<i>optional</i> &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="descripcion"                data-endpoint="POSTapi-categories"
               value="Variedades de café pergamino y derivados de cacao."
               data-component="body">
    <br>
<p>Especificaciones del tipo de grano o derivados. Example: <code>Variedades de café pergamino y derivados de cacao.</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>estado</code></b>&nbsp;&nbsp;
<small>boolean</small>&nbsp;
 &nbsp;
 &nbsp;
                <label data-endpoint="POSTapi-categories" style="display: none">
            <input type="radio" name="estado"
                   value="true"
                   data-endpoint="POSTapi-categories"
                   data-component="body"             >
            <code>true</code>
        </label>
        <label data-endpoint="POSTapi-categories" style="display: none">
            <input type="radio" name="estado"
                   value="false"
                   data-endpoint="POSTapi-categories"
                   data-component="body"             >
            <code>false</code>
        </label>
    <br>
<p>Define si la categoría está activa para el catálogo. Example: <code>true</code></p>
        </div>
        </form>

                    <h2 id="endpoints-GETapi-categories--id-">GET api/categories/{id}</h2>

<p>
</p>



<span id="example-requests-GETapi-categories--id-">
<blockquote>Example request:</blockquote>


<div class="bash-example">
    <pre><code class="language-bash">curl --request GET \
    --get "http://localhost/api/categories/1" \
    --header "Content-Type: application/json" \
    --header "Accept: application/json"</code></pre></div>


<div class="javascript-example">
    <pre><code class="language-javascript">const url = new URL(
    "http://localhost/api/categories/1"
);

const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
};


fetch(url, {
    method: "GET",
    headers,
}).then(response =&gt; response.json());</code></pre></div>

</span>

<span id="example-responses-GETapi-categories--id-">
            <blockquote>
            <p>Example response (200):</p>
        </blockquote>
                <details class="annotation">
            <summary style="cursor: pointer;">
                <small onclick="textContent = parentElement.parentElement.open ? 'Show headers' : 'Hide headers'">Show headers</small>
            </summary>
            <pre><code class="language-http">cache-control: no-cache, private
content-type: application/json
access-control-allow-origin: *
 </code></pre></details>         <pre>

<code class="language-json" style="max-height: 300px;">{
    &quot;data&quot;: {
        &quot;id&quot;: 1,
        &quot;nombre&quot;: &quot;ZoxGfvxNAbrpLIDgmgWh8kucGgU4ujbpTdchwPrPiSpfwOgkuIH8GmUTI9Q18FWhAqZAgVCwRBybYCux6sVm44840vpgsk3YQcCD&quot;,
        &quot;descripcion&quot;: &quot;Ut sint dolores et omnis delectus. Non qui rerum error et nulla doloremque corrupti. Voluptatum molestias odit suscipit esse perspiciatis.&quot;,
        &quot;estado&quot;: false
    }
}</code>
 </pre>
    </span>
<span id="execution-results-GETapi-categories--id-" hidden>
    <blockquote>Received response<span
                id="execution-response-status-GETapi-categories--id-"></span>:
    </blockquote>
    <pre class="json"><code id="execution-response-content-GETapi-categories--id-"
      data-empty-response-text="<Empty response>" style="max-height: 400px;"></code></pre>
</span>
<span id="execution-error-GETapi-categories--id-" hidden>
    <blockquote>Request failed with error:</blockquote>
    <pre><code id="execution-error-message-GETapi-categories--id-">

Tip: Check that you&#039;re properly connected to the network.
If you&#039;re a maintainer of ths API, verify that your API is running and you&#039;ve enabled CORS.
You can check the Dev Tools console for debugging information.</code></pre>
</span>
<form id="form-GETapi-categories--id-" data-method="GET"
      data-path="api/categories/{id}"
      data-authed="0"
      data-hasfiles="0"
      data-isarraybody="0"
      autocomplete="off"
      onsubmit="event.preventDefault(); executeTryOut('GETapi-categories--id-', this);">
    <h3>
        Request&nbsp;&nbsp;&nbsp;
                    <button type="button"
                    style="background-color: #8fbcd4; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-tryout-GETapi-categories--id-"
                    onclick="tryItOut('GETapi-categories--id-');">Try it out ⚡
            </button>
            <button type="button"
                    style="background-color: #c97a7e; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-canceltryout-GETapi-categories--id-"
                    onclick="cancelTryOut('GETapi-categories--id-');" hidden>Cancel 🛑
            </button>&nbsp;&nbsp;
            <button type="submit"
                    style="background-color: #6ac174; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-executetryout-GETapi-categories--id-"
                    data-initial-text="Send Request 💥"
                    data-loading-text="⏱ Sending..."
                    hidden>Send Request 💥
            </button>
            </h3>
            <p>
            <small class="badge badge-green">GET</small>
            <b><code>api/categories/{id}</code></b>
        </p>
                <h4 class="fancy-heading-panel"><b>Headers</b></h4>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Content-Type</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Content-Type"                data-endpoint="GETapi-categories--id-"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Accept</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Accept"                data-endpoint="GETapi-categories--id-"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                        <h4 class="fancy-heading-panel"><b>URL Parameters</b></h4>
                    <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>id</code></b>&nbsp;&nbsp;
<small>integer</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="number" style="display: none"
               step="any"               name="id"                data-endpoint="GETapi-categories--id-"
               value="1"
               data-component="url">
    <br>
<p>The ID of the category. Example: <code>1</code></p>
            </div>
                    </form>

                    <h2 id="endpoints-PUTapi-categories--id-">PUT api/categories/{id}</h2>

<p>
</p>



<span id="example-requests-PUTapi-categories--id-">
<blockquote>Example request:</blockquote>


<div class="bash-example">
    <pre><code class="language-bash">curl --request PUT \
    "http://localhost/api/categories/1" \
    --header "Content-Type: application/json" \
    --header "Accept: application/json" \
    --data "{
    \"nombre\": \"Derivados de Cacao Fino de Aroma\",
    \"descripcion\": \"Coberturas de chocolate, pasta pura de cacao, bombones y subproductos para exportación.\",
    \"estado\": true
}"
</code></pre></div>


<div class="javascript-example">
    <pre><code class="language-javascript">const url = new URL(
    "http://localhost/api/categories/1"
);

const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
};

let body = {
    "nombre": "Derivados de Cacao Fino de Aroma",
    "descripcion": "Coberturas de chocolate, pasta pura de cacao, bombones y subproductos para exportación.",
    "estado": true
};

fetch(url, {
    method: "PUT",
    headers,
    body: JSON.stringify(body),
}).then(response =&gt; response.json());</code></pre></div>

</span>

<span id="example-responses-PUTapi-categories--id-">
</span>
<span id="execution-results-PUTapi-categories--id-" hidden>
    <blockquote>Received response<span
                id="execution-response-status-PUTapi-categories--id-"></span>:
    </blockquote>
    <pre class="json"><code id="execution-response-content-PUTapi-categories--id-"
      data-empty-response-text="<Empty response>" style="max-height: 400px;"></code></pre>
</span>
<span id="execution-error-PUTapi-categories--id-" hidden>
    <blockquote>Request failed with error:</blockquote>
    <pre><code id="execution-error-message-PUTapi-categories--id-">

Tip: Check that you&#039;re properly connected to the network.
If you&#039;re a maintainer of ths API, verify that your API is running and you&#039;ve enabled CORS.
You can check the Dev Tools console for debugging information.</code></pre>
</span>
<form id="form-PUTapi-categories--id-" data-method="PUT"
      data-path="api/categories/{id}"
      data-authed="0"
      data-hasfiles="0"
      data-isarraybody="0"
      autocomplete="off"
      onsubmit="event.preventDefault(); executeTryOut('PUTapi-categories--id-', this);">
    <h3>
        Request&nbsp;&nbsp;&nbsp;
                    <button type="button"
                    style="background-color: #8fbcd4; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-tryout-PUTapi-categories--id-"
                    onclick="tryItOut('PUTapi-categories--id-');">Try it out ⚡
            </button>
            <button type="button"
                    style="background-color: #c97a7e; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-canceltryout-PUTapi-categories--id-"
                    onclick="cancelTryOut('PUTapi-categories--id-');" hidden>Cancel 🛑
            </button>&nbsp;&nbsp;
            <button type="submit"
                    style="background-color: #6ac174; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-executetryout-PUTapi-categories--id-"
                    data-initial-text="Send Request 💥"
                    data-loading-text="⏱ Sending..."
                    hidden>Send Request 💥
            </button>
            </h3>
            <p>
            <small class="badge badge-darkblue">PUT</small>
            <b><code>api/categories/{id}</code></b>
        </p>
            <p>
            <small class="badge badge-purple">PATCH</small>
            <b><code>api/categories/{id}</code></b>
        </p>
                <h4 class="fancy-heading-panel"><b>Headers</b></h4>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Content-Type</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Content-Type"                data-endpoint="PUTapi-categories--id-"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Accept</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Accept"                data-endpoint="PUTapi-categories--id-"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                        <h4 class="fancy-heading-panel"><b>URL Parameters</b></h4>
                    <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>id</code></b>&nbsp;&nbsp;
<small>integer</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="number" style="display: none"
               step="any"               name="id"                data-endpoint="PUTapi-categories--id-"
               value="1"
               data-component="url">
    <br>
<p>The ID of the category. Example: <code>1</code></p>
            </div>
                            <h4 class="fancy-heading-panel"><b>Body Parameters</b></h4>
        <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>nombre</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="nombre"                data-endpoint="PUTapi-categories--id-"
               value="Derivados de Cacao Fino de Aroma"
               data-component="body">
    <br>
<p>Nombre actualizado de la categoría agrícola. Example: <code>Derivados de Cacao Fino de Aroma</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>descripcion</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
<i>optional</i> &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="descripcion"                data-endpoint="PUTapi-categories--id-"
               value="Coberturas de chocolate, pasta pura de cacao, bombones y subproductos para exportación."
               data-component="body">
    <br>
<p>Especificaciones modificadas sobre el alcance o tipo de subproductos. Example: <code>Coberturas de chocolate, pasta pura de cacao, bombones y subproductos para exportación.</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>estado</code></b>&nbsp;&nbsp;
<small>boolean</small>&nbsp;
 &nbsp;
 &nbsp;
                <label data-endpoint="PUTapi-categories--id-" style="display: none">
            <input type="radio" name="estado"
                   value="true"
                   data-endpoint="PUTapi-categories--id-"
                   data-component="body"             >
            <code>true</code>
        </label>
        <label data-endpoint="PUTapi-categories--id-" style="display: none">
            <input type="radio" name="estado"
                   value="false"
                   data-endpoint="PUTapi-categories--id-"
                   data-component="body"             >
            <code>false</code>
        </label>
    <br>
<p>Estado operativo actual del registro en el catálogo. Example: <code>true</code></p>
        </div>
        </form>

                    <h2 id="endpoints-DELETEapi-categories--id-">DELETE api/categories/{id}</h2>

<p>
</p>



<span id="example-requests-DELETEapi-categories--id-">
<blockquote>Example request:</blockquote>


<div class="bash-example">
    <pre><code class="language-bash">curl --request DELETE \
    "http://localhost/api/categories/1" \
    --header "Content-Type: application/json" \
    --header "Accept: application/json"</code></pre></div>


<div class="javascript-example">
    <pre><code class="language-javascript">const url = new URL(
    "http://localhost/api/categories/1"
);

const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
};


fetch(url, {
    method: "DELETE",
    headers,
}).then(response =&gt; response.json());</code></pre></div>

</span>

<span id="example-responses-DELETEapi-categories--id-">
</span>
<span id="execution-results-DELETEapi-categories--id-" hidden>
    <blockquote>Received response<span
                id="execution-response-status-DELETEapi-categories--id-"></span>:
    </blockquote>
    <pre class="json"><code id="execution-response-content-DELETEapi-categories--id-"
      data-empty-response-text="<Empty response>" style="max-height: 400px;"></code></pre>
</span>
<span id="execution-error-DELETEapi-categories--id-" hidden>
    <blockquote>Request failed with error:</blockquote>
    <pre><code id="execution-error-message-DELETEapi-categories--id-">

Tip: Check that you&#039;re properly connected to the network.
If you&#039;re a maintainer of ths API, verify that your API is running and you&#039;ve enabled CORS.
You can check the Dev Tools console for debugging information.</code></pre>
</span>
<form id="form-DELETEapi-categories--id-" data-method="DELETE"
      data-path="api/categories/{id}"
      data-authed="0"
      data-hasfiles="0"
      data-isarraybody="0"
      autocomplete="off"
      onsubmit="event.preventDefault(); executeTryOut('DELETEapi-categories--id-', this);">
    <h3>
        Request&nbsp;&nbsp;&nbsp;
                    <button type="button"
                    style="background-color: #8fbcd4; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-tryout-DELETEapi-categories--id-"
                    onclick="tryItOut('DELETEapi-categories--id-');">Try it out ⚡
            </button>
            <button type="button"
                    style="background-color: #c97a7e; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-canceltryout-DELETEapi-categories--id-"
                    onclick="cancelTryOut('DELETEapi-categories--id-');" hidden>Cancel 🛑
            </button>&nbsp;&nbsp;
            <button type="submit"
                    style="background-color: #6ac174; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-executetryout-DELETEapi-categories--id-"
                    data-initial-text="Send Request 💥"
                    data-loading-text="⏱ Sending..."
                    hidden>Send Request 💥
            </button>
            </h3>
            <p>
            <small class="badge badge-red">DELETE</small>
            <b><code>api/categories/{id}</code></b>
        </p>
                <h4 class="fancy-heading-panel"><b>Headers</b></h4>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Content-Type</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Content-Type"                data-endpoint="DELETEapi-categories--id-"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Accept</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Accept"                data-endpoint="DELETEapi-categories--id-"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                        <h4 class="fancy-heading-panel"><b>URL Parameters</b></h4>
                    <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>id</code></b>&nbsp;&nbsp;
<small>integer</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="number" style="display: none"
               step="any"               name="id"                data-endpoint="DELETEapi-categories--id-"
               value="1"
               data-component="url">
    <br>
<p>The ID of the category. Example: <code>1</code></p>
            </div>
                    </form>

                    <h2 id="endpoints-GETapi-products">GET api/products</h2>

<p>
</p>



<span id="example-requests-GETapi-products">
<blockquote>Example request:</blockquote>


<div class="bash-example">
    <pre><code class="language-bash">curl --request GET \
    --get "http://localhost/api/products" \
    --header "Content-Type: application/json" \
    --header "Accept: application/json"</code></pre></div>


<div class="javascript-example">
    <pre><code class="language-javascript">const url = new URL(
    "http://localhost/api/products"
);

const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
};


fetch(url, {
    method: "GET",
    headers,
}).then(response =&gt; response.json());</code></pre></div>

</span>

<span id="example-responses-GETapi-products">
            <blockquote>
            <p>Example response (200):</p>
        </blockquote>
                <details class="annotation">
            <summary style="cursor: pointer;">
                <small onclick="textContent = parentElement.parentElement.open ? 'Show headers' : 'Hide headers'">Show headers</small>
            </summary>
            <pre><code class="language-http">cache-control: no-cache, private
content-type: application/json
access-control-allow-origin: *
 </code></pre></details>         <pre>

<code class="language-json" style="max-height: 300px;">{
    &quot;data&quot;: [
        {
            &quot;id&quot;: 1,
            &quot;category_id&quot;: 6,
            &quot;sku&quot;: &quot;deleniti&quot;,
            &quot;codigo_barras&quot;: &quot;XQHMLZbW37XIiJ6THlnCfIaxbLF8QCTapEuMWLLAAUhHUFKSIo&quot;,
            &quot;nombre&quot;: &quot;consequatur&quot;,
            &quot;descripcion&quot;: &quot;Eaque consectetur saepe cumque voluptas. Cum ad est nobis iure est. Eligendi repellendus adipisci vero culpa a.&quot;,
            &quot;precio_compra&quot;: &quot;11738018.42&quot;,
            &quot;precio_minorista&quot;: &quot;79669965.88&quot;,
            &quot;precio_mayorista&quot;: &quot;16977208.02&quot;,
            &quot;afecto_igv&quot;: true,
            &quot;unidad_medida&quot;: &quot;natus&quot;,
            &quot;stock_actual&quot;: &quot;77974182.44&quot;,
            &quot;stock_minimo&quot;: &quot;94154858.30&quot;,
            &quot;imagen_url&quot;: &quot;occaecati&quot;,
            &quot;estado&quot;: true
        },
        {
            &quot;id&quot;: 2,
            &quot;category_id&quot;: 7,
            &quot;sku&quot;: &quot;maxime&quot;,
            &quot;codigo_barras&quot;: &quot;3lLLx4LEJwCih6OiKM1cvR049eFxSeE3czAxEaYTmcSyS9wtJM&quot;,
            &quot;nombre&quot;: &quot;commodi&quot;,
            &quot;descripcion&quot;: &quot;Est maiores hic nihil ipsum enim. Repellat tempore magnam omnis placeat non est. At tempore beatae consequatur ratione voluptas facere.&quot;,
            &quot;precio_compra&quot;: &quot;6885924.75&quot;,
            &quot;precio_minorista&quot;: &quot;93036840.56&quot;,
            &quot;precio_mayorista&quot;: &quot;26171136.05&quot;,
            &quot;afecto_igv&quot;: false,
            &quot;unidad_medida&quot;: &quot;nisi&quot;,
            &quot;stock_actual&quot;: &quot;28829997.56&quot;,
            &quot;stock_minimo&quot;: &quot;86631171.48&quot;,
            &quot;imagen_url&quot;: &quot;eum&quot;,
            &quot;estado&quot;: true
        },
        {
            &quot;id&quot;: 3,
            &quot;category_id&quot;: 8,
            &quot;sku&quot;: &quot;rerum&quot;,
            &quot;codigo_barras&quot;: &quot;b5Ae6rQfkwvbsvpgViHn8XjbuoYpHxnQNdNGIr77vgV2OJRozL&quot;,
            &quot;nombre&quot;: &quot;eaque&quot;,
            &quot;descripcion&quot;: &quot;Nemo incidunt est aut nisi praesentium aperiam at. Distinctio animi natus voluptatum et quia qui libero. Aliquam eligendi optio corrupti quo.&quot;,
            &quot;precio_compra&quot;: &quot;23174761.94&quot;,
            &quot;precio_minorista&quot;: &quot;24024624.48&quot;,
            &quot;precio_mayorista&quot;: &quot;32572649.24&quot;,
            &quot;afecto_igv&quot;: false,
            &quot;unidad_medida&quot;: &quot;non&quot;,
            &quot;stock_actual&quot;: &quot;47652512.90&quot;,
            &quot;stock_minimo&quot;: &quot;37233065.18&quot;,
            &quot;imagen_url&quot;: &quot;ea&quot;,
            &quot;estado&quot;: true
        },
        {
            &quot;id&quot;: 4,
            &quot;category_id&quot;: 9,
            &quot;sku&quot;: &quot;ipsam&quot;,
            &quot;codigo_barras&quot;: &quot;JaphdRMdjIUePiiidPJu5nwY9AV9JGKBJACo4QA2IRBkJ38Vl5&quot;,
            &quot;nombre&quot;: &quot;laborum&quot;,
            &quot;descripcion&quot;: &quot;Doloribus dolores ex esse corrupti. Molestiae beatae omnis at rem iusto. Consequatur sed explicabo libero harum exercitationem neque. Sed et suscipit consequatur rerum natus quasi ratione veniam.&quot;,
            &quot;precio_compra&quot;: &quot;76860775.92&quot;,
            &quot;precio_minorista&quot;: &quot;6705246.08&quot;,
            &quot;precio_mayorista&quot;: &quot;16088930.90&quot;,
            &quot;afecto_igv&quot;: false,
            &quot;unidad_medida&quot;: &quot;molestiae&quot;,
            &quot;stock_actual&quot;: &quot;25591046.28&quot;,
            &quot;stock_minimo&quot;: &quot;73142248.09&quot;,
            &quot;imagen_url&quot;: &quot;voluptates&quot;,
            &quot;estado&quot;: false
        },
        {
            &quot;id&quot;: 5,
            &quot;category_id&quot;: 10,
            &quot;sku&quot;: &quot;reprehenderit&quot;,
            &quot;codigo_barras&quot;: &quot;UYcKSuI3YLkxV43IfDdyDy8nCEYo5UIX6RiaEgUTC3EnmYHao2&quot;,
            &quot;nombre&quot;: &quot;placeat&quot;,
            &quot;descripcion&quot;: &quot;Distinctio est facere fuga omnis minima dolor. At aut asperiores voluptas ab cupiditate hic dolor natus. Quia quo esse nam assumenda est non et fugit.&quot;,
            &quot;precio_compra&quot;: &quot;15209577.70&quot;,
            &quot;precio_minorista&quot;: &quot;74773995.70&quot;,
            &quot;precio_mayorista&quot;: &quot;9269367.67&quot;,
            &quot;afecto_igv&quot;: false,
            &quot;unidad_medida&quot;: &quot;vel&quot;,
            &quot;stock_actual&quot;: &quot;39043987.32&quot;,
            &quot;stock_minimo&quot;: &quot;37521612.75&quot;,
            &quot;imagen_url&quot;: &quot;asperiores&quot;,
            &quot;estado&quot;: false
        },
        {
            &quot;id&quot;: 6,
            &quot;category_id&quot;: 11,
            &quot;sku&quot;: &quot;voluptatem&quot;,
            &quot;codigo_barras&quot;: &quot;Mg5QWglzkGAMKShpfkpzVr2bBICab8U76LwfiX0KxNAMwTEysO&quot;,
            &quot;nombre&quot;: &quot;omnis&quot;,
            &quot;descripcion&quot;: &quot;Asperiores corrupti sint veritatis quae. Voluptas et consequatur sit aut rerum asperiores. Alias esse inventore ut sint.&quot;,
            &quot;precio_compra&quot;: &quot;64735284.89&quot;,
            &quot;precio_minorista&quot;: &quot;26618291.40&quot;,
            &quot;precio_mayorista&quot;: &quot;13851294.11&quot;,
            &quot;afecto_igv&quot;: true,
            &quot;unidad_medida&quot;: &quot;tempora&quot;,
            &quot;stock_actual&quot;: &quot;19071141.82&quot;,
            &quot;stock_minimo&quot;: &quot;35860745.72&quot;,
            &quot;imagen_url&quot;: &quot;ducimus&quot;,
            &quot;estado&quot;: true
        },
        {
            &quot;id&quot;: 7,
            &quot;category_id&quot;: 12,
            &quot;sku&quot;: &quot;illo&quot;,
            &quot;codigo_barras&quot;: &quot;yZrUWocwBu32VzNCSkLNsIUfhj9PKhkOj5FcbcPihBFGoECQSE&quot;,
            &quot;nombre&quot;: &quot;eos&quot;,
            &quot;descripcion&quot;: &quot;Dolores iste saepe similique. Et sapiente accusamus a est quaerat perspiciatis eos sit. Consectetur repudiandae placeat voluptas qui atque ut esse. Suscipit dolor et quidem occaecati placeat est.&quot;,
            &quot;precio_compra&quot;: &quot;71223509.10&quot;,
            &quot;precio_minorista&quot;: &quot;97596525.30&quot;,
            &quot;precio_mayorista&quot;: &quot;40583809.39&quot;,
            &quot;afecto_igv&quot;: false,
            &quot;unidad_medida&quot;: &quot;neque&quot;,
            &quot;stock_actual&quot;: &quot;32284970.13&quot;,
            &quot;stock_minimo&quot;: &quot;39617039.46&quot;,
            &quot;imagen_url&quot;: &quot;repellat&quot;,
            &quot;estado&quot;: true
        },
        {
            &quot;id&quot;: 8,
            &quot;category_id&quot;: 13,
            &quot;sku&quot;: &quot;in&quot;,
            &quot;codigo_barras&quot;: &quot;8hyPBl2eb6qd6AkJbRCscSdiL5prQ6otNaGxEb3S6xpgkOi5i6&quot;,
            &quot;nombre&quot;: &quot;nulla&quot;,
            &quot;descripcion&quot;: &quot;Eos dignissimos minima ut rerum earum laudantium. Earum laborum doloribus rerum aut rerum similique ullam et. Molestiae molestias ut qui.&quot;,
            &quot;precio_compra&quot;: &quot;11088873.78&quot;,
            &quot;precio_minorista&quot;: &quot;88155164.42&quot;,
            &quot;precio_mayorista&quot;: &quot;69063435.85&quot;,
            &quot;afecto_igv&quot;: true,
            &quot;unidad_medida&quot;: &quot;aperiam&quot;,
            &quot;stock_actual&quot;: &quot;62624839.25&quot;,
            &quot;stock_minimo&quot;: &quot;46568711.63&quot;,
            &quot;imagen_url&quot;: &quot;iusto&quot;,
            &quot;estado&quot;: true
        },
        {
            &quot;id&quot;: 9,
            &quot;category_id&quot;: 14,
            &quot;sku&quot;: &quot;eaque&quot;,
            &quot;codigo_barras&quot;: &quot;8nDcHq6r3wU7v2OwzSLmkqG7luLL5vZ1iLffycVsGfF2ysnp2n&quot;,
            &quot;nombre&quot;: &quot;voluptas&quot;,
            &quot;descripcion&quot;: &quot;Totam praesentium aut cum similique. Earum perspiciatis repellendus enim molestiae dicta accusantium ipsa pariatur. Similique optio quo eos minima. Quis mollitia ipsa necessitatibus.&quot;,
            &quot;precio_compra&quot;: &quot;9799735.76&quot;,
            &quot;precio_minorista&quot;: &quot;10130341.91&quot;,
            &quot;precio_mayorista&quot;: &quot;91845370.16&quot;,
            &quot;afecto_igv&quot;: true,
            &quot;unidad_medida&quot;: &quot;cumque&quot;,
            &quot;stock_actual&quot;: &quot;18548060.08&quot;,
            &quot;stock_minimo&quot;: &quot;22143108.31&quot;,
            &quot;imagen_url&quot;: &quot;sint&quot;,
            &quot;estado&quot;: true
        },
        {
            &quot;id&quot;: 10,
            &quot;category_id&quot;: 15,
            &quot;sku&quot;: &quot;eos&quot;,
            &quot;codigo_barras&quot;: &quot;Jhbz97G4rUvG3ihsfoHWTB8QvL9n2epSlxOkB3rf1dMTAS1wPB&quot;,
            &quot;nombre&quot;: &quot;magni&quot;,
            &quot;descripcion&quot;: &quot;Alias dolores assumenda voluptatem. In sed quo autem eligendi. Aut illo cupiditate possimus qui labore.&quot;,
            &quot;precio_compra&quot;: &quot;48456479.16&quot;,
            &quot;precio_minorista&quot;: &quot;95434506.83&quot;,
            &quot;precio_mayorista&quot;: &quot;1334075.12&quot;,
            &quot;afecto_igv&quot;: true,
            &quot;unidad_medida&quot;: &quot;rerum&quot;,
            &quot;stock_actual&quot;: &quot;21359419.55&quot;,
            &quot;stock_minimo&quot;: &quot;47661260.53&quot;,
            &quot;imagen_url&quot;: &quot;quas&quot;,
            &quot;estado&quot;: false
        }
    ]
}</code>
 </pre>
    </span>
<span id="execution-results-GETapi-products" hidden>
    <blockquote>Received response<span
                id="execution-response-status-GETapi-products"></span>:
    </blockquote>
    <pre class="json"><code id="execution-response-content-GETapi-products"
      data-empty-response-text="<Empty response>" style="max-height: 400px;"></code></pre>
</span>
<span id="execution-error-GETapi-products" hidden>
    <blockquote>Request failed with error:</blockquote>
    <pre><code id="execution-error-message-GETapi-products">

Tip: Check that you&#039;re properly connected to the network.
If you&#039;re a maintainer of ths API, verify that your API is running and you&#039;ve enabled CORS.
You can check the Dev Tools console for debugging information.</code></pre>
</span>
<form id="form-GETapi-products" data-method="GET"
      data-path="api/products"
      data-authed="0"
      data-hasfiles="0"
      data-isarraybody="0"
      autocomplete="off"
      onsubmit="event.preventDefault(); executeTryOut('GETapi-products', this);">
    <h3>
        Request&nbsp;&nbsp;&nbsp;
                    <button type="button"
                    style="background-color: #8fbcd4; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-tryout-GETapi-products"
                    onclick="tryItOut('GETapi-products');">Try it out ⚡
            </button>
            <button type="button"
                    style="background-color: #c97a7e; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-canceltryout-GETapi-products"
                    onclick="cancelTryOut('GETapi-products');" hidden>Cancel 🛑
            </button>&nbsp;&nbsp;
            <button type="submit"
                    style="background-color: #6ac174; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-executetryout-GETapi-products"
                    data-initial-text="Send Request 💥"
                    data-loading-text="⏱ Sending..."
                    hidden>Send Request 💥
            </button>
            </h3>
            <p>
            <small class="badge badge-green">GET</small>
            <b><code>api/products</code></b>
        </p>
                <h4 class="fancy-heading-panel"><b>Headers</b></h4>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Content-Type</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Content-Type"                data-endpoint="GETapi-products"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Accept</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Accept"                data-endpoint="GETapi-products"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                        </form>

                    <h2 id="endpoints-POSTapi-products">POST api/products</h2>

<p>
</p>



<span id="example-requests-POSTapi-products">
<blockquote>Example request:</blockquote>


<div class="bash-example">
    <pre><code class="language-bash">curl --request POST \
    "http://localhost/api/products" \
    --header "Content-Type: application/json" \
    --header "Accept: application/json" \
    --data "{
    \"category_id\": 1,
    \"sku\": \"CAF-ORGA-QQ\",
    \"codigo_barras\": \"7501055304721\",
    \"nombre\": \"Café Orgánico Lavado Grano Seco\",
    \"descripcion\": \"Café con 84 puntos en taza, humedad al 12%, certificación Orgánica y Fairtrade.\",
    \"precio_compra\": 450,
    \"precio_minorista\": 600,
    \"precio_mayorista\": 530,
    \"afecto_igv\": false,
    \"unidad_medida\": \"Quintal\",
    \"stock_actual\": 120.5,
    \"stock_minimo\": 10,
    \"imagen_url\": \"imagen.jpg\",
    \"estado\": true
}"
</code></pre></div>


<div class="javascript-example">
    <pre><code class="language-javascript">const url = new URL(
    "http://localhost/api/products"
);

const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
};

let body = {
    "category_id": 1,
    "sku": "CAF-ORGA-QQ",
    "codigo_barras": "7501055304721",
    "nombre": "Café Orgánico Lavado Grano Seco",
    "descripcion": "Café con 84 puntos en taza, humedad al 12%, certificación Orgánica y Fairtrade.",
    "precio_compra": 450,
    "precio_minorista": 600,
    "precio_mayorista": 530,
    "afecto_igv": false,
    "unidad_medida": "Quintal",
    "stock_actual": 120.5,
    "stock_minimo": 10,
    "imagen_url": "imagen.jpg",
    "estado": true
};

fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
}).then(response =&gt; response.json());</code></pre></div>

</span>

<span id="example-responses-POSTapi-products">
</span>
<span id="execution-results-POSTapi-products" hidden>
    <blockquote>Received response<span
                id="execution-response-status-POSTapi-products"></span>:
    </blockquote>
    <pre class="json"><code id="execution-response-content-POSTapi-products"
      data-empty-response-text="<Empty response>" style="max-height: 400px;"></code></pre>
</span>
<span id="execution-error-POSTapi-products" hidden>
    <blockquote>Request failed with error:</blockquote>
    <pre><code id="execution-error-message-POSTapi-products">

Tip: Check that you&#039;re properly connected to the network.
If you&#039;re a maintainer of ths API, verify that your API is running and you&#039;ve enabled CORS.
You can check the Dev Tools console for debugging information.</code></pre>
</span>
<form id="form-POSTapi-products" data-method="POST"
      data-path="api/products"
      data-authed="0"
      data-hasfiles="0"
      data-isarraybody="0"
      autocomplete="off"
      onsubmit="event.preventDefault(); executeTryOut('POSTapi-products', this);">
    <h3>
        Request&nbsp;&nbsp;&nbsp;
                    <button type="button"
                    style="background-color: #8fbcd4; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-tryout-POSTapi-products"
                    onclick="tryItOut('POSTapi-products');">Try it out ⚡
            </button>
            <button type="button"
                    style="background-color: #c97a7e; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-canceltryout-POSTapi-products"
                    onclick="cancelTryOut('POSTapi-products');" hidden>Cancel 🛑
            </button>&nbsp;&nbsp;
            <button type="submit"
                    style="background-color: #6ac174; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-executetryout-POSTapi-products"
                    data-initial-text="Send Request 💥"
                    data-loading-text="⏱ Sending..."
                    hidden>Send Request 💥
            </button>
            </h3>
            <p>
            <small class="badge badge-black">POST</small>
            <b><code>api/products</code></b>
        </p>
                <h4 class="fancy-heading-panel"><b>Headers</b></h4>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Content-Type</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Content-Type"                data-endpoint="POSTapi-products"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Accept</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Accept"                data-endpoint="POSTapi-products"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                                <h4 class="fancy-heading-panel"><b>Body Parameters</b></h4>
        <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>category_id</code></b>&nbsp;&nbsp;
<small>integer</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="number" style="display: none"
               step="any"               name="category_id"                data-endpoint="POSTapi-products"
               value="1"
               data-component="body">
    <br>
<p>ID de la categoría asociada (Café, Cacao, Insumos). Example: <code>1</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>sku</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="sku"                data-endpoint="POSTapi-products"
               value="CAF-ORGA-QQ"
               data-component="body">
    <br>
<p>Código SKU único de control de inventario. Example: <code>CAF-ORGA-QQ</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>codigo_barras</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
<i>optional</i> &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="codigo_barras"                data-endpoint="POSTapi-products"
               value="7501055304721"
               data-component="body">
    <br>
<p>Código de barras internacional o interno. Example: <code>7501055304721</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>nombre</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="nombre"                data-endpoint="POSTapi-products"
               value="Café Orgánico Lavado Grano Seco"
               data-component="body">
    <br>
<p>Nombre comercial del producto agrícola o derivado. Example: <code>Café Orgánico Lavado Grano Seco</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>descripcion</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
<i>optional</i> &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="descripcion"                data-endpoint="POSTapi-products"
               value="Café con 84 puntos en taza, humedad al 12%, certificación Orgánica y Fairtrade."
               data-component="body">
    <br>
<p>Detalles del perfil de taza, humedad o certificación. Example: <code>Café con 84 puntos en taza, humedad al 12%, certificación Orgánica y Fairtrade.</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>precio_compra</code></b>&nbsp;&nbsp;
<small>number</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="number" style="display: none"
               step="any"               name="precio_compra"                data-endpoint="POSTapi-products"
               value="450"
               data-component="body">
    <br>
<p>Costo de compra por unidad de medida. Example: <code>450</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>precio_minorista</code></b>&nbsp;&nbsp;
<small>number</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="number" style="display: none"
               step="any"               name="precio_minorista"                data-endpoint="POSTapi-products"
               value="600"
               data-component="body">
    <br>
<p>Precio de venta para consumo regular o local. Example: <code>600</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>precio_mayorista</code></b>&nbsp;&nbsp;
<small>number</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="number" style="display: none"
               step="any"               name="precio_mayorista"                data-endpoint="POSTapi-products"
               value="530"
               data-component="body">
    <br>
<p>Precio de venta por volumen o exportación. Example: <code>530</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>afecto_igv</code></b>&nbsp;&nbsp;
<small>boolean</small>&nbsp;
 &nbsp;
 &nbsp;
                <label data-endpoint="POSTapi-products" style="display: none">
            <input type="radio" name="afecto_igv"
                   value="true"
                   data-endpoint="POSTapi-products"
                   data-component="body"             >
            <code>true</code>
        </label>
        <label data-endpoint="POSTapi-products" style="display: none">
            <input type="radio" name="afecto_igv"
                   value="false"
                   data-endpoint="POSTapi-products"
                   data-component="body"             >
            <code>false</code>
        </label>
    <br>
<p>Especifica si el producto está grabado con el IGV (18%). Example: <code>false</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>unidad_medida</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="unidad_medida"                data-endpoint="POSTapi-products"
               value="Quintal"
               data-component="body">
    <br>
<p>Unidad de despacho del almacén (Saco 69kg, Quintal QQ, Unidad). Example: <code>Quintal</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>stock_actual</code></b>&nbsp;&nbsp;
<small>number</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="number" style="display: none"
               step="any"               name="stock_actual"                data-endpoint="POSTapi-products"
               value="120.5"
               data-component="body">
    <br>
<p>Stock físico actual en los almacenes de acopio. Example: <code>120.5</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>stock_minimo</code></b>&nbsp;&nbsp;
<small>number</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="number" style="display: none"
               step="any"               name="stock_minimo"                data-endpoint="POSTapi-products"
               value="10"
               data-component="body">
    <br>
<p>Umbral de alerta de reposición mínima en almacén. Example: <code>10</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>imagen_url</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
<i>optional</i> &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="imagen_url"                data-endpoint="POSTapi-products"
               value="imagen.jpg"
               data-component="body">
    <br>
<p>Ruta de la imagen del producto guardada en el storage. Example: <code>imagen.jpg</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>estado</code></b>&nbsp;&nbsp;
<small>boolean</small>&nbsp;
 &nbsp;
 &nbsp;
                <label data-endpoint="POSTapi-products" style="display: none">
            <input type="radio" name="estado"
                   value="true"
                   data-endpoint="POSTapi-products"
                   data-component="body"             >
            <code>true</code>
        </label>
        <label data-endpoint="POSTapi-products" style="display: none">
            <input type="radio" name="estado"
                   value="false"
                   data-endpoint="POSTapi-products"
                   data-component="body"             >
            <code>false</code>
        </label>
    <br>
<p>Estado de disponibilidad del producto en el catálogo. Example: <code>true</code></p>
        </div>
        </form>

                    <h2 id="endpoints-GETapi-products--id-">GET api/products/{id}</h2>

<p>
</p>



<span id="example-requests-GETapi-products--id-">
<blockquote>Example request:</blockquote>


<div class="bash-example">
    <pre><code class="language-bash">curl --request GET \
    --get "http://localhost/api/products/1" \
    --header "Content-Type: application/json" \
    --header "Accept: application/json"</code></pre></div>


<div class="javascript-example">
    <pre><code class="language-javascript">const url = new URL(
    "http://localhost/api/products/1"
);

const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
};


fetch(url, {
    method: "GET",
    headers,
}).then(response =&gt; response.json());</code></pre></div>

</span>

<span id="example-responses-GETapi-products--id-">
            <blockquote>
            <p>Example response (200):</p>
        </blockquote>
                <details class="annotation">
            <summary style="cursor: pointer;">
                <small onclick="textContent = parentElement.parentElement.open ? 'Show headers' : 'Hide headers'">Show headers</small>
            </summary>
            <pre><code class="language-http">cache-control: no-cache, private
content-type: application/json
access-control-allow-origin: *
 </code></pre></details>         <pre>

<code class="language-json" style="max-height: 300px;">{
    &quot;data&quot;: {
        &quot;id&quot;: 1,
        &quot;category_id&quot;: 6,
        &quot;sku&quot;: &quot;deleniti&quot;,
        &quot;codigo_barras&quot;: &quot;XQHMLZbW37XIiJ6THlnCfIaxbLF8QCTapEuMWLLAAUhHUFKSIo&quot;,
        &quot;nombre&quot;: &quot;consequatur&quot;,
        &quot;descripcion&quot;: &quot;Eaque consectetur saepe cumque voluptas. Cum ad est nobis iure est. Eligendi repellendus adipisci vero culpa a.&quot;,
        &quot;precio_compra&quot;: &quot;11738018.42&quot;,
        &quot;precio_minorista&quot;: &quot;79669965.88&quot;,
        &quot;precio_mayorista&quot;: &quot;16977208.02&quot;,
        &quot;afecto_igv&quot;: true,
        &quot;unidad_medida&quot;: &quot;natus&quot;,
        &quot;stock_actual&quot;: &quot;77974182.44&quot;,
        &quot;stock_minimo&quot;: &quot;94154858.30&quot;,
        &quot;imagen_url&quot;: &quot;occaecati&quot;,
        &quot;estado&quot;: true
    }
}</code>
 </pre>
    </span>
<span id="execution-results-GETapi-products--id-" hidden>
    <blockquote>Received response<span
                id="execution-response-status-GETapi-products--id-"></span>:
    </blockquote>
    <pre class="json"><code id="execution-response-content-GETapi-products--id-"
      data-empty-response-text="<Empty response>" style="max-height: 400px;"></code></pre>
</span>
<span id="execution-error-GETapi-products--id-" hidden>
    <blockquote>Request failed with error:</blockquote>
    <pre><code id="execution-error-message-GETapi-products--id-">

Tip: Check that you&#039;re properly connected to the network.
If you&#039;re a maintainer of ths API, verify that your API is running and you&#039;ve enabled CORS.
You can check the Dev Tools console for debugging information.</code></pre>
</span>
<form id="form-GETapi-products--id-" data-method="GET"
      data-path="api/products/{id}"
      data-authed="0"
      data-hasfiles="0"
      data-isarraybody="0"
      autocomplete="off"
      onsubmit="event.preventDefault(); executeTryOut('GETapi-products--id-', this);">
    <h3>
        Request&nbsp;&nbsp;&nbsp;
                    <button type="button"
                    style="background-color: #8fbcd4; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-tryout-GETapi-products--id-"
                    onclick="tryItOut('GETapi-products--id-');">Try it out ⚡
            </button>
            <button type="button"
                    style="background-color: #c97a7e; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-canceltryout-GETapi-products--id-"
                    onclick="cancelTryOut('GETapi-products--id-');" hidden>Cancel 🛑
            </button>&nbsp;&nbsp;
            <button type="submit"
                    style="background-color: #6ac174; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-executetryout-GETapi-products--id-"
                    data-initial-text="Send Request 💥"
                    data-loading-text="⏱ Sending..."
                    hidden>Send Request 💥
            </button>
            </h3>
            <p>
            <small class="badge badge-green">GET</small>
            <b><code>api/products/{id}</code></b>
        </p>
                <h4 class="fancy-heading-panel"><b>Headers</b></h4>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Content-Type</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Content-Type"                data-endpoint="GETapi-products--id-"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Accept</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Accept"                data-endpoint="GETapi-products--id-"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                        <h4 class="fancy-heading-panel"><b>URL Parameters</b></h4>
                    <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>id</code></b>&nbsp;&nbsp;
<small>integer</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="number" style="display: none"
               step="any"               name="id"                data-endpoint="GETapi-products--id-"
               value="1"
               data-component="url">
    <br>
<p>The ID of the product. Example: <code>1</code></p>
            </div>
                    </form>

                    <h2 id="endpoints-PUTapi-products--id-">PUT api/products/{id}</h2>

<p>
</p>



<span id="example-requests-PUTapi-products--id-">
<blockquote>Example request:</blockquote>


<div class="bash-example">
    <pre><code class="language-bash">curl --request PUT \
    "http://localhost/api/products/1" \
    --header "Content-Type: application/json" \
    --header "Accept: application/json" \
    --data "{
    \"category_id\": 2,
    \"sku\": \"CACAO-CCN51-ST\",
    \"codigo_barras\": \"7501055304851\",
    \"nombre\": \"Café Orgánico Tostado en Grano\",
    \"descripcion\": \"Perfil de taza con notas a chocolate y frutos rojos, acidez media, origen Bagua Grande.\",
    \"precio_compra\": 480,
    \"precio_minorista\": 650,
    \"precio_mayorista\": 580,
    \"afecto_igv\": false,
    \"unidad_medida\": \"Saco\",
    \"stock_actual\": 85.5,
    \"stock_minimo\": 5,
    \"imagen_url\": \"https:\\/\\/sigesafe.edu.pe\\/storage\\/products\\/cafe-tostado.jpg\",
    \"estado\": true
}"
</code></pre></div>


<div class="javascript-example">
    <pre><code class="language-javascript">const url = new URL(
    "http://localhost/api/products/1"
);

const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
};

let body = {
    "category_id": 2,
    "sku": "CACAO-CCN51-ST",
    "codigo_barras": "7501055304851",
    "nombre": "Café Orgánico Tostado en Grano",
    "descripcion": "Perfil de taza con notas a chocolate y frutos rojos, acidez media, origen Bagua Grande.",
    "precio_compra": 480,
    "precio_minorista": 650,
    "precio_mayorista": 580,
    "afecto_igv": false,
    "unidad_medida": "Saco",
    "stock_actual": 85.5,
    "stock_minimo": 5,
    "imagen_url": "https:\/\/sigesafe.edu.pe\/storage\/products\/cafe-tostado.jpg",
    "estado": true
};

fetch(url, {
    method: "PUT",
    headers,
    body: JSON.stringify(body),
}).then(response =&gt; response.json());</code></pre></div>

</span>

<span id="example-responses-PUTapi-products--id-">
</span>
<span id="execution-results-PUTapi-products--id-" hidden>
    <blockquote>Received response<span
                id="execution-response-status-PUTapi-products--id-"></span>:
    </blockquote>
    <pre class="json"><code id="execution-response-content-PUTapi-products--id-"
      data-empty-response-text="<Empty response>" style="max-height: 400px;"></code></pre>
</span>
<span id="execution-error-PUTapi-products--id-" hidden>
    <blockquote>Request failed with error:</blockquote>
    <pre><code id="execution-error-message-PUTapi-products--id-">

Tip: Check that you&#039;re properly connected to the network.
If you&#039;re a maintainer of ths API, verify that your API is running and you&#039;ve enabled CORS.
You can check the Dev Tools console for debugging information.</code></pre>
</span>
<form id="form-PUTapi-products--id-" data-method="PUT"
      data-path="api/products/{id}"
      data-authed="0"
      data-hasfiles="0"
      data-isarraybody="0"
      autocomplete="off"
      onsubmit="event.preventDefault(); executeTryOut('PUTapi-products--id-', this);">
    <h3>
        Request&nbsp;&nbsp;&nbsp;
                    <button type="button"
                    style="background-color: #8fbcd4; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-tryout-PUTapi-products--id-"
                    onclick="tryItOut('PUTapi-products--id-');">Try it out ⚡
            </button>
            <button type="button"
                    style="background-color: #c97a7e; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-canceltryout-PUTapi-products--id-"
                    onclick="cancelTryOut('PUTapi-products--id-');" hidden>Cancel 🛑
            </button>&nbsp;&nbsp;
            <button type="submit"
                    style="background-color: #6ac174; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-executetryout-PUTapi-products--id-"
                    data-initial-text="Send Request 💥"
                    data-loading-text="⏱ Sending..."
                    hidden>Send Request 💥
            </button>
            </h3>
            <p>
            <small class="badge badge-darkblue">PUT</small>
            <b><code>api/products/{id}</code></b>
        </p>
            <p>
            <small class="badge badge-purple">PATCH</small>
            <b><code>api/products/{id}</code></b>
        </p>
                <h4 class="fancy-heading-panel"><b>Headers</b></h4>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Content-Type</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Content-Type"                data-endpoint="PUTapi-products--id-"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Accept</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Accept"                data-endpoint="PUTapi-products--id-"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                        <h4 class="fancy-heading-panel"><b>URL Parameters</b></h4>
                    <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>id</code></b>&nbsp;&nbsp;
<small>integer</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="number" style="display: none"
               step="any"               name="id"                data-endpoint="PUTapi-products--id-"
               value="1"
               data-component="url">
    <br>
<p>The ID of the product. Example: <code>1</code></p>
            </div>
                            <h4 class="fancy-heading-panel"><b>Body Parameters</b></h4>
        <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>category_id</code></b>&nbsp;&nbsp;
<small>integer</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="number" style="display: none"
               step="any"               name="category_id"                data-endpoint="PUTapi-products--id-"
               value="2"
               data-component="body">
    <br>
<p>ID de la categoría asociada. Example: <code>2</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>sku</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="sku"                data-endpoint="PUTapi-products--id-"
               value="CACAO-CCN51-ST"
               data-component="body">
    <br>
<p>Código SKU único (ignora el ID del producto actual). Example: <code>CACAO-CCN51-ST</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>codigo_barras</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
<i>optional</i> &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="codigo_barras"                data-endpoint="PUTapi-products--id-"
               value="7501055304851"
               data-component="body">
    <br>
<p>Código de barras opcional. Example: <code>7501055304851</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>nombre</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="nombre"                data-endpoint="PUTapi-products--id-"
               value="Café Orgánico Tostado en Grano"
               data-component="body">
    <br>
<p>Nombre del producto agrícola. Example: <code>Café Orgánico Tostado en Grano</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>descripcion</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
<i>optional</i> &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="descripcion"                data-endpoint="PUTapi-products--id-"
               value="Perfil de taza con notas a chocolate y frutos rojos, acidez media, origen Bagua Grande."
               data-component="body">
    <br>
<p>Descripción opcional del perfil. Example: <code>Perfil de taza con notas a chocolate y frutos rojos, acidez media, origen Bagua Grande.</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>precio_compra</code></b>&nbsp;&nbsp;
<small>number</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="number" style="display: none"
               step="any"               name="precio_compra"                data-endpoint="PUTapi-products--id-"
               value="480"
               data-component="body">
    <br>
<p>Límites numéricos de compra. Example: <code>480</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>precio_minorista</code></b>&nbsp;&nbsp;
<small>number</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="number" style="display: none"
               step="any"               name="precio_minorista"                data-endpoint="PUTapi-products--id-"
               value="650"
               data-component="body">
    <br>
<p>Límites numéricos minoristas. Example: <code>650</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>precio_mayorista</code></b>&nbsp;&nbsp;
<small>number</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="number" style="display: none"
               step="any"               name="precio_mayorista"                data-endpoint="PUTapi-products--id-"
               value="580"
               data-component="body">
    <br>
<p>Límites numéricos mayoristas. Example: <code>580</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>afecto_igv</code></b>&nbsp;&nbsp;
<small>boolean</small>&nbsp;
 &nbsp;
 &nbsp;
                <label data-endpoint="PUTapi-products--id-" style="display: none">
            <input type="radio" name="afecto_igv"
                   value="true"
                   data-endpoint="PUTapi-products--id-"
                   data-component="body"             >
            <code>true</code>
        </label>
        <label data-endpoint="PUTapi-products--id-" style="display: none">
            <input type="radio" name="afecto_igv"
                   value="false"
                   data-endpoint="PUTapi-products--id-"
                   data-component="body"             >
            <code>false</code>
        </label>
    <br>
<p>Indicador fiscal de IGV. Example: <code>false</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>unidad_medida</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="unidad_medida"                data-endpoint="PUTapi-products--id-"
               value="Saco"
               data-component="body">
    <br>
<p>Unidad de empaque o venta. Example: <code>Saco</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>stock_actual</code></b>&nbsp;&nbsp;
<small>number</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="number" style="display: none"
               step="any"               name="stock_actual"                data-endpoint="PUTapi-products--id-"
               value="85.5"
               data-component="body">
    <br>
<p>Control de stock actual. Example: <code>85.5</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>stock_minimo</code></b>&nbsp;&nbsp;
<small>number</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="number" style="display: none"
               step="any"               name="stock_minimo"                data-endpoint="PUTapi-products--id-"
               value="5"
               data-component="body">
    <br>
<p>Alerta de stock mínimo. Example: <code>5</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>imagen_url</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
<i>optional</i> &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="imagen_url"                data-endpoint="PUTapi-products--id-"
               value="https://sigesafe.edu.pe/storage/products/cafe-tostado.jpg"
               data-component="body">
    <br>
<p>URL opcional de la imagen. Example: <code>https://sigesafe.edu.pe/storage/products/cafe-tostado.jpg</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>estado</code></b>&nbsp;&nbsp;
<small>boolean</small>&nbsp;
 &nbsp;
 &nbsp;
                <label data-endpoint="PUTapi-products--id-" style="display: none">
            <input type="radio" name="estado"
                   value="true"
                   data-endpoint="PUTapi-products--id-"
                   data-component="body"             >
            <code>true</code>
        </label>
        <label data-endpoint="PUTapi-products--id-" style="display: none">
            <input type="radio" name="estado"
                   value="false"
                   data-endpoint="PUTapi-products--id-"
                   data-component="body"             >
            <code>false</code>
        </label>
    <br>
<p>Estado del producto en el catálogo. Example: <code>true</code></p>
        </div>
        </form>

                    <h2 id="endpoints-DELETEapi-products--id-">DELETE api/products/{id}</h2>

<p>
</p>



<span id="example-requests-DELETEapi-products--id-">
<blockquote>Example request:</blockquote>


<div class="bash-example">
    <pre><code class="language-bash">curl --request DELETE \
    "http://localhost/api/products/1" \
    --header "Content-Type: application/json" \
    --header "Accept: application/json"</code></pre></div>


<div class="javascript-example">
    <pre><code class="language-javascript">const url = new URL(
    "http://localhost/api/products/1"
);

const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
};


fetch(url, {
    method: "DELETE",
    headers,
}).then(response =&gt; response.json());</code></pre></div>

</span>

<span id="example-responses-DELETEapi-products--id-">
</span>
<span id="execution-results-DELETEapi-products--id-" hidden>
    <blockquote>Received response<span
                id="execution-response-status-DELETEapi-products--id-"></span>:
    </blockquote>
    <pre class="json"><code id="execution-response-content-DELETEapi-products--id-"
      data-empty-response-text="<Empty response>" style="max-height: 400px;"></code></pre>
</span>
<span id="execution-error-DELETEapi-products--id-" hidden>
    <blockquote>Request failed with error:</blockquote>
    <pre><code id="execution-error-message-DELETEapi-products--id-">

Tip: Check that you&#039;re properly connected to the network.
If you&#039;re a maintainer of ths API, verify that your API is running and you&#039;ve enabled CORS.
You can check the Dev Tools console for debugging information.</code></pre>
</span>
<form id="form-DELETEapi-products--id-" data-method="DELETE"
      data-path="api/products/{id}"
      data-authed="0"
      data-hasfiles="0"
      data-isarraybody="0"
      autocomplete="off"
      onsubmit="event.preventDefault(); executeTryOut('DELETEapi-products--id-', this);">
    <h3>
        Request&nbsp;&nbsp;&nbsp;
                    <button type="button"
                    style="background-color: #8fbcd4; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-tryout-DELETEapi-products--id-"
                    onclick="tryItOut('DELETEapi-products--id-');">Try it out ⚡
            </button>
            <button type="button"
                    style="background-color: #c97a7e; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-canceltryout-DELETEapi-products--id-"
                    onclick="cancelTryOut('DELETEapi-products--id-');" hidden>Cancel 🛑
            </button>&nbsp;&nbsp;
            <button type="submit"
                    style="background-color: #6ac174; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-executetryout-DELETEapi-products--id-"
                    data-initial-text="Send Request 💥"
                    data-loading-text="⏱ Sending..."
                    hidden>Send Request 💥
            </button>
            </h3>
            <p>
            <small class="badge badge-red">DELETE</small>
            <b><code>api/products/{id}</code></b>
        </p>
                <h4 class="fancy-heading-panel"><b>Headers</b></h4>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Content-Type</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Content-Type"                data-endpoint="DELETEapi-products--id-"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Accept</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Accept"                data-endpoint="DELETEapi-products--id-"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                        <h4 class="fancy-heading-panel"><b>URL Parameters</b></h4>
                    <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>id</code></b>&nbsp;&nbsp;
<small>integer</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="number" style="display: none"
               step="any"               name="id"                data-endpoint="DELETEapi-products--id-"
               value="1"
               data-component="url">
    <br>
<p>The ID of the product. Example: <code>1</code></p>
            </div>
                    </form>

                    <h2 id="endpoints-GETapi-users">GET api/users</h2>

<p>
</p>



<span id="example-requests-GETapi-users">
<blockquote>Example request:</blockquote>


<div class="bash-example">
    <pre><code class="language-bash">curl --request GET \
    --get "http://localhost/api/users" \
    --header "Content-Type: application/json" \
    --header "Accept: application/json"</code></pre></div>


<div class="javascript-example">
    <pre><code class="language-javascript">const url = new URL(
    "http://localhost/api/users"
);

const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
};


fetch(url, {
    method: "GET",
    headers,
}).then(response =&gt; response.json());</code></pre></div>

</span>

<span id="example-responses-GETapi-users">
            <blockquote>
            <p>Example response (200):</p>
        </blockquote>
                <details class="annotation">
            <summary style="cursor: pointer;">
                <small onclick="textContent = parentElement.parentElement.open ? 'Show headers' : 'Hide headers'">Show headers</small>
            </summary>
            <pre><code class="language-http">cache-control: no-cache, private
content-type: application/json
access-control-allow-origin: *
 </code></pre></details>         <pre>

<code class="language-json" style="max-height: 300px;">{
    &quot;data&quot;: [
        {
            &quot;id&quot;: 1,
            &quot;name&quot;: &quot;Chaz Frami&quot;,
            &quot;email&quot;: &quot;ghansen@example.com&quot;,
            &quot;email_verified_at&quot;: 162004,
            &quot;role&quot;: &quot;FiseKOIWXBySghRsc7YlORhpNiJ0L5sj7JcUzLWX3c8HsN0KKH&quot;,
            &quot;is_active&quot;: true
        },
        {
            &quot;id&quot;: 2,
            &quot;name&quot;: &quot;Belle Denesik&quot;,
            &quot;email&quot;: &quot;kuhlman.andreane@example.org&quot;,
            &quot;email_verified_at&quot;: 1257374491,
            &quot;role&quot;: &quot;NlALS1Xf8cLV17G8GLw475YKSDZvENGatc1u3ZPxfPyTM0CgLW&quot;,
            &quot;is_active&quot;: false
        },
        {
            &quot;id&quot;: 3,
            &quot;name&quot;: &quot;Magali Hoppe&quot;,
            &quot;email&quot;: &quot;cronin.breanne@example.net&quot;,
            &quot;email_verified_at&quot;: 106218547,
            &quot;role&quot;: &quot;sF8g13RAGVz1xPANdnTROq0jeMasPpUV0CaCtV2fsNOHoJ9DbF&quot;,
            &quot;is_active&quot;: false
        },
        {
            &quot;id&quot;: 4,
            &quot;name&quot;: &quot;Mafalda Fay&quot;,
            &quot;email&quot;: &quot;auer.anastasia@example.org&quot;,
            &quot;email_verified_at&quot;: 568727705,
            &quot;role&quot;: &quot;HgYPAUixOmS9R3NFGVbU4QO1AyKAnf71Kws7Khqfi5sBqwED3w&quot;,
            &quot;is_active&quot;: false
        },
        {
            &quot;id&quot;: 5,
            &quot;name&quot;: &quot;Kianna Langworth&quot;,
            &quot;email&quot;: &quot;wtoy@example.org&quot;,
            &quot;email_verified_at&quot;: 432728990,
            &quot;role&quot;: &quot;lbe5mRVkZxWQYmxnIlRUIYnl6kDR8puVJ5WPN6O1A9WJmBCJqM&quot;,
            &quot;is_active&quot;: true
        },
        {
            &quot;id&quot;: 6,
            &quot;name&quot;: &quot;Llewellyn Schaden&quot;,
            &quot;email&quot;: &quot;keyshawn04@example.com&quot;,
            &quot;email_verified_at&quot;: 1058112616,
            &quot;role&quot;: &quot;RZc7qRRTloU9ZSxmHmc5OhahUiTaAQnhxMK9HOso81dXJzwsco&quot;,
            &quot;is_active&quot;: true
        },
        {
            &quot;id&quot;: 7,
            &quot;name&quot;: &quot;Prof. Dandre Beahan&quot;,
            &quot;email&quot;: &quot;nikolaus.cecil@example.com&quot;,
            &quot;email_verified_at&quot;: 595300395,
            &quot;role&quot;: &quot;IFeupWEPvCk7mHZIWWMNHYHsh5pSGk4jzL5nXvgvR4cMN1iUBY&quot;,
            &quot;is_active&quot;: false
        },
        {
            &quot;id&quot;: 8,
            &quot;name&quot;: &quot;Kennith Konopelski&quot;,
            &quot;email&quot;: &quot;kirlin.rigoberto@example.org&quot;,
            &quot;email_verified_at&quot;: 32904535,
            &quot;role&quot;: &quot;51d3uSmie9HydfAS6itX1injgyUGGbZj36siS7aebxSNKX8EYW&quot;,
            &quot;is_active&quot;: false
        },
        {
            &quot;id&quot;: 9,
            &quot;name&quot;: &quot;Hector Harris&quot;,
            &quot;email&quot;: &quot;sharon47@example.net&quot;,
            &quot;email_verified_at&quot;: 1368181465,
            &quot;role&quot;: &quot;6CIeci3nx2IVm2WERkw2uwqXfoU09POMDyV6ahOUKqqEOHH9u8&quot;,
            &quot;is_active&quot;: false
        },
        {
            &quot;id&quot;: 10,
            &quot;name&quot;: &quot;Prof. Kiara Wiza DVM&quot;,
            &quot;email&quot;: &quot;berniece24@example.org&quot;,
            &quot;email_verified_at&quot;: 367084816,
            &quot;role&quot;: &quot;kqTGvdUCQarvsJsKleAXYfgwwKM90FIaTNplUCnowOpOskeHiZ&quot;,
            &quot;is_active&quot;: true
        },
        {
            &quot;id&quot;: 11,
            &quot;name&quot;: &quot;Jacinto Collier&quot;,
            &quot;email&quot;: &quot;kdoyle@example.com&quot;,
            &quot;email_verified_at&quot;: 390338613,
            &quot;role&quot;: &quot;Z5LK7maMBzLaKT4nJNjYPz0QXPB5PqDahHYCb8GoOB2DFuC7MS&quot;,
            &quot;is_active&quot;: false
        },
        {
            &quot;id&quot;: 12,
            &quot;name&quot;: &quot;Winnifred Grant&quot;,
            &quot;email&quot;: &quot;hauck.luz@example.com&quot;,
            &quot;email_verified_at&quot;: 832657053,
            &quot;role&quot;: &quot;wF4g0FZzWn9q3y9iehvwkDHdJ2eEwvUaujIAoKHt34wNxAyu91&quot;,
            &quot;is_active&quot;: true
        },
        {
            &quot;id&quot;: 13,
            &quot;name&quot;: &quot;Don Frami&quot;,
            &quot;email&quot;: &quot;antone.bernier@example.net&quot;,
            &quot;email_verified_at&quot;: 712786214,
            &quot;role&quot;: &quot;Ec4WZgvN0nnuaq8UNRHoCNXnIYzzI3Q1cIPaYOISswg8cfhAJ8&quot;,
            &quot;is_active&quot;: false
        },
        {
            &quot;id&quot;: 14,
            &quot;name&quot;: &quot;Omari Rogahn&quot;,
            &quot;email&quot;: &quot;ygoodwin@example.com&quot;,
            &quot;email_verified_at&quot;: 1298888740,
            &quot;role&quot;: &quot;rv68t6h2zTp1iEx3P4S2i3KesPeNiMEELk2RnA6jYV8XgnXKYP&quot;,
            &quot;is_active&quot;: false
        },
        {
            &quot;id&quot;: 15,
            &quot;name&quot;: &quot;Juana Johnson&quot;,
            &quot;email&quot;: &quot;mills.winifred@example.com&quot;,
            &quot;email_verified_at&quot;: 285185670,
            &quot;role&quot;: &quot;zuZlHAC3TmPW3oCnwMkH3He9rc2WVJN78uccDnds5yjYs4iEng&quot;,
            &quot;is_active&quot;: true
        }
    ]
}</code>
 </pre>
    </span>
<span id="execution-results-GETapi-users" hidden>
    <blockquote>Received response<span
                id="execution-response-status-GETapi-users"></span>:
    </blockquote>
    <pre class="json"><code id="execution-response-content-GETapi-users"
      data-empty-response-text="<Empty response>" style="max-height: 400px;"></code></pre>
</span>
<span id="execution-error-GETapi-users" hidden>
    <blockquote>Request failed with error:</blockquote>
    <pre><code id="execution-error-message-GETapi-users">

Tip: Check that you&#039;re properly connected to the network.
If you&#039;re a maintainer of ths API, verify that your API is running and you&#039;ve enabled CORS.
You can check the Dev Tools console for debugging information.</code></pre>
</span>
<form id="form-GETapi-users" data-method="GET"
      data-path="api/users"
      data-authed="0"
      data-hasfiles="0"
      data-isarraybody="0"
      autocomplete="off"
      onsubmit="event.preventDefault(); executeTryOut('GETapi-users', this);">
    <h3>
        Request&nbsp;&nbsp;&nbsp;
                    <button type="button"
                    style="background-color: #8fbcd4; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-tryout-GETapi-users"
                    onclick="tryItOut('GETapi-users');">Try it out ⚡
            </button>
            <button type="button"
                    style="background-color: #c97a7e; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-canceltryout-GETapi-users"
                    onclick="cancelTryOut('GETapi-users');" hidden>Cancel 🛑
            </button>&nbsp;&nbsp;
            <button type="submit"
                    style="background-color: #6ac174; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-executetryout-GETapi-users"
                    data-initial-text="Send Request 💥"
                    data-loading-text="⏱ Sending..."
                    hidden>Send Request 💥
            </button>
            </h3>
            <p>
            <small class="badge badge-green">GET</small>
            <b><code>api/users</code></b>
        </p>
                <h4 class="fancy-heading-panel"><b>Headers</b></h4>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Content-Type</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Content-Type"                data-endpoint="GETapi-users"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Accept</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Accept"                data-endpoint="GETapi-users"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                        </form>

                    <h2 id="endpoints-POSTapi-users">POST api/users</h2>

<p>
</p>



<span id="example-requests-POSTapi-users">
<blockquote>Example request:</blockquote>


<div class="bash-example">
    <pre><code class="language-bash">curl --request POST \
    "http://localhost/api/users" \
    --header "Content-Type: application/json" \
    --header "Accept: application/json" \
    --data "{
    \"name\": \"Dante Ryuu\",
    \"email\": \"dryuu@sigesafe.edu.pe\",
    \"password\": \"password123\",
    \"role\": \"vendedor\",
    \"is_active\": true
}"
</code></pre></div>


<div class="javascript-example">
    <pre><code class="language-javascript">const url = new URL(
    "http://localhost/api/users"
);

const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
};

let body = {
    "name": "Dante Ryuu",
    "email": "dryuu@sigesafe.edu.pe",
    "password": "password123",
    "role": "vendedor",
    "is_active": true
};

fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
}).then(response =&gt; response.json());</code></pre></div>

</span>

<span id="example-responses-POSTapi-users">
</span>
<span id="execution-results-POSTapi-users" hidden>
    <blockquote>Received response<span
                id="execution-response-status-POSTapi-users"></span>:
    </blockquote>
    <pre class="json"><code id="execution-response-content-POSTapi-users"
      data-empty-response-text="<Empty response>" style="max-height: 400px;"></code></pre>
</span>
<span id="execution-error-POSTapi-users" hidden>
    <blockquote>Request failed with error:</blockquote>
    <pre><code id="execution-error-message-POSTapi-users">

Tip: Check that you&#039;re properly connected to the network.
If you&#039;re a maintainer of ths API, verify that your API is running and you&#039;ve enabled CORS.
You can check the Dev Tools console for debugging information.</code></pre>
</span>
<form id="form-POSTapi-users" data-method="POST"
      data-path="api/users"
      data-authed="0"
      data-hasfiles="0"
      data-isarraybody="0"
      autocomplete="off"
      onsubmit="event.preventDefault(); executeTryOut('POSTapi-users', this);">
    <h3>
        Request&nbsp;&nbsp;&nbsp;
                    <button type="button"
                    style="background-color: #8fbcd4; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-tryout-POSTapi-users"
                    onclick="tryItOut('POSTapi-users');">Try it out ⚡
            </button>
            <button type="button"
                    style="background-color: #c97a7e; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-canceltryout-POSTapi-users"
                    onclick="cancelTryOut('POSTapi-users');" hidden>Cancel 🛑
            </button>&nbsp;&nbsp;
            <button type="submit"
                    style="background-color: #6ac174; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-executetryout-POSTapi-users"
                    data-initial-text="Send Request 💥"
                    data-loading-text="⏱ Sending..."
                    hidden>Send Request 💥
            </button>
            </h3>
            <p>
            <small class="badge badge-black">POST</small>
            <b><code>api/users</code></b>
        </p>
                <h4 class="fancy-heading-panel"><b>Headers</b></h4>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Content-Type</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Content-Type"                data-endpoint="POSTapi-users"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Accept</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Accept"                data-endpoint="POSTapi-users"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                                <h4 class="fancy-heading-panel"><b>Body Parameters</b></h4>
        <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>name</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="name"                data-endpoint="POSTapi-users"
               value="Dante Ryuu"
               data-component="body">
    <br>
<p>Nombre completo del usuario o personal de la cooperativa. Example: <code>Dante Ryuu</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>email</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="email"                data-endpoint="POSTapi-users"
               value="dryuu@sigesafe.edu.pe"
               data-component="body">
    <br>
<p>Correo electrónico institucional para el acceso al sistema. Example: <code>dryuu@sigesafe.edu.pe</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>password</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="password"                data-endpoint="POSTapi-users"
               value="password123"
               data-component="body">
    <br>
<p>Contraseña de autenticación en texto plano (será encriptada en el backend). Example: <code>password123</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>role</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="role"                data-endpoint="POSTapi-users"
               value="vendedor"
               data-component="body">
    <br>
<p>Rol del usuario dentro del sistema (ej. administrador, vendedor, acopiador). Example: <code>vendedor</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>is_active</code></b>&nbsp;&nbsp;
<small>boolean</small>&nbsp;
 &nbsp;
 &nbsp;
                <label data-endpoint="POSTapi-users" style="display: none">
            <input type="radio" name="is_active"
                   value="true"
                   data-endpoint="POSTapi-users"
                   data-component="body"             >
            <code>true</code>
        </label>
        <label data-endpoint="POSTapi-users" style="display: none">
            <input type="radio" name="is_active"
                   value="false"
                   data-endpoint="POSTapi-users"
                   data-component="body"             >
            <code>false</code>
        </label>
    <br>
<p>Define si el usuario tiene acceso permitido al panel administrativo. Example: <code>true</code></p>
        </div>
        </form>

                    <h2 id="endpoints-GETapi-users--id-">GET api/users/{id}</h2>

<p>
</p>



<span id="example-requests-GETapi-users--id-">
<blockquote>Example request:</blockquote>


<div class="bash-example">
    <pre><code class="language-bash">curl --request GET \
    --get "http://localhost/api/users/1" \
    --header "Content-Type: application/json" \
    --header "Accept: application/json"</code></pre></div>


<div class="javascript-example">
    <pre><code class="language-javascript">const url = new URL(
    "http://localhost/api/users/1"
);

const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
};


fetch(url, {
    method: "GET",
    headers,
}).then(response =&gt; response.json());</code></pre></div>

</span>

<span id="example-responses-GETapi-users--id-">
            <blockquote>
            <p>Example response (200):</p>
        </blockquote>
                <details class="annotation">
            <summary style="cursor: pointer;">
                <small onclick="textContent = parentElement.parentElement.open ? 'Show headers' : 'Hide headers'">Show headers</small>
            </summary>
            <pre><code class="language-http">cache-control: no-cache, private
content-type: application/json
access-control-allow-origin: *
 </code></pre></details>         <pre>

<code class="language-json" style="max-height: 300px;">{
    &quot;data&quot;: {
        &quot;id&quot;: 1,
        &quot;name&quot;: &quot;Chaz Frami&quot;,
        &quot;email&quot;: &quot;ghansen@example.com&quot;,
        &quot;email_verified_at&quot;: 162004,
        &quot;role&quot;: &quot;FiseKOIWXBySghRsc7YlORhpNiJ0L5sj7JcUzLWX3c8HsN0KKH&quot;,
        &quot;is_active&quot;: true
    }
}</code>
 </pre>
    </span>
<span id="execution-results-GETapi-users--id-" hidden>
    <blockquote>Received response<span
                id="execution-response-status-GETapi-users--id-"></span>:
    </blockquote>
    <pre class="json"><code id="execution-response-content-GETapi-users--id-"
      data-empty-response-text="<Empty response>" style="max-height: 400px;"></code></pre>
</span>
<span id="execution-error-GETapi-users--id-" hidden>
    <blockquote>Request failed with error:</blockquote>
    <pre><code id="execution-error-message-GETapi-users--id-">

Tip: Check that you&#039;re properly connected to the network.
If you&#039;re a maintainer of ths API, verify that your API is running and you&#039;ve enabled CORS.
You can check the Dev Tools console for debugging information.</code></pre>
</span>
<form id="form-GETapi-users--id-" data-method="GET"
      data-path="api/users/{id}"
      data-authed="0"
      data-hasfiles="0"
      data-isarraybody="0"
      autocomplete="off"
      onsubmit="event.preventDefault(); executeTryOut('GETapi-users--id-', this);">
    <h3>
        Request&nbsp;&nbsp;&nbsp;
                    <button type="button"
                    style="background-color: #8fbcd4; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-tryout-GETapi-users--id-"
                    onclick="tryItOut('GETapi-users--id-');">Try it out ⚡
            </button>
            <button type="button"
                    style="background-color: #c97a7e; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-canceltryout-GETapi-users--id-"
                    onclick="cancelTryOut('GETapi-users--id-');" hidden>Cancel 🛑
            </button>&nbsp;&nbsp;
            <button type="submit"
                    style="background-color: #6ac174; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-executetryout-GETapi-users--id-"
                    data-initial-text="Send Request 💥"
                    data-loading-text="⏱ Sending..."
                    hidden>Send Request 💥
            </button>
            </h3>
            <p>
            <small class="badge badge-green">GET</small>
            <b><code>api/users/{id}</code></b>
        </p>
                <h4 class="fancy-heading-panel"><b>Headers</b></h4>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Content-Type</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Content-Type"                data-endpoint="GETapi-users--id-"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Accept</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Accept"                data-endpoint="GETapi-users--id-"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                        <h4 class="fancy-heading-panel"><b>URL Parameters</b></h4>
                    <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>id</code></b>&nbsp;&nbsp;
<small>integer</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="number" style="display: none"
               step="any"               name="id"                data-endpoint="GETapi-users--id-"
               value="1"
               data-component="url">
    <br>
<p>The ID of the user. Example: <code>1</code></p>
            </div>
                    </form>

                    <h2 id="endpoints-PUTapi-users--id-">PUT api/users/{id}</h2>

<p>
</p>



<span id="example-requests-PUTapi-users--id-">
<blockquote>Example request:</blockquote>


<div class="bash-example">
    <pre><code class="language-bash">curl --request PUT \
    "http://localhost/api/users/1" \
    --header "Content-Type: application/json" \
    --header "Accept: application/json" \
    --data "{
    \"name\": \"Dante Ryuu\",
    \"email\": \"dryuu@sigesafe.edu.pe\",
    \"password\": \"nuevaContrasena123\",
    \"role\": \"administrador\",
    \"is_active\": true
}"
</code></pre></div>


<div class="javascript-example">
    <pre><code class="language-javascript">const url = new URL(
    "http://localhost/api/users/1"
);

const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
};

let body = {
    "name": "Dante Ryuu",
    "email": "dryuu@sigesafe.edu.pe",
    "password": "nuevaContrasena123",
    "role": "administrador",
    "is_active": true
};

fetch(url, {
    method: "PUT",
    headers,
    body: JSON.stringify(body),
}).then(response =&gt; response.json());</code></pre></div>

</span>

<span id="example-responses-PUTapi-users--id-">
</span>
<span id="execution-results-PUTapi-users--id-" hidden>
    <blockquote>Received response<span
                id="execution-response-status-PUTapi-users--id-"></span>:
    </blockquote>
    <pre class="json"><code id="execution-response-content-PUTapi-users--id-"
      data-empty-response-text="<Empty response>" style="max-height: 400px;"></code></pre>
</span>
<span id="execution-error-PUTapi-users--id-" hidden>
    <blockquote>Request failed with error:</blockquote>
    <pre><code id="execution-error-message-PUTapi-users--id-">

Tip: Check that you&#039;re properly connected to the network.
If you&#039;re a maintainer of ths API, verify that your API is running and you&#039;ve enabled CORS.
You can check the Dev Tools console for debugging information.</code></pre>
</span>
<form id="form-PUTapi-users--id-" data-method="PUT"
      data-path="api/users/{id}"
      data-authed="0"
      data-hasfiles="0"
      data-isarraybody="0"
      autocomplete="off"
      onsubmit="event.preventDefault(); executeTryOut('PUTapi-users--id-', this);">
    <h3>
        Request&nbsp;&nbsp;&nbsp;
                    <button type="button"
                    style="background-color: #8fbcd4; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-tryout-PUTapi-users--id-"
                    onclick="tryItOut('PUTapi-users--id-');">Try it out ⚡
            </button>
            <button type="button"
                    style="background-color: #c97a7e; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-canceltryout-PUTapi-users--id-"
                    onclick="cancelTryOut('PUTapi-users--id-');" hidden>Cancel 🛑
            </button>&nbsp;&nbsp;
            <button type="submit"
                    style="background-color: #6ac174; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-executetryout-PUTapi-users--id-"
                    data-initial-text="Send Request 💥"
                    data-loading-text="⏱ Sending..."
                    hidden>Send Request 💥
            </button>
            </h3>
            <p>
            <small class="badge badge-darkblue">PUT</small>
            <b><code>api/users/{id}</code></b>
        </p>
            <p>
            <small class="badge badge-purple">PATCH</small>
            <b><code>api/users/{id}</code></b>
        </p>
                <h4 class="fancy-heading-panel"><b>Headers</b></h4>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Content-Type</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Content-Type"                data-endpoint="PUTapi-users--id-"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Accept</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Accept"                data-endpoint="PUTapi-users--id-"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                        <h4 class="fancy-heading-panel"><b>URL Parameters</b></h4>
                    <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>id</code></b>&nbsp;&nbsp;
<small>integer</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="number" style="display: none"
               step="any"               name="id"                data-endpoint="PUTapi-users--id-"
               value="1"
               data-component="url">
    <br>
<p>The ID of the user. Example: <code>1</code></p>
            </div>
                            <h4 class="fancy-heading-panel"><b>Body Parameters</b></h4>
        <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>name</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="name"                data-endpoint="PUTapi-users--id-"
               value="Dante Ryuu"
               data-component="body">
    <br>
<p>Nombre completo actualizado del usuario. Example: <code>Dante Ryuu</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>email</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="email"                data-endpoint="PUTapi-users--id-"
               value="dryuu@sigesafe.edu.pe"
               data-component="body">
    <br>
<p>Correo electrónico institucional (ignora el ID actual para permitir guardar sin cambiar el email). Example: <code>dryuu@sigesafe.edu.pe</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>password</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
<i>optional</i> &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="password"                data-endpoint="PUTapi-users--id-"
               value="nuevaContrasena123"
               data-component="body">
    <br>
<p>Nueva contraseña de acceso (dejar opcional/nullable suele ser la mejor práctica en actualizaciones). Example: <code>nuevaContrasena123</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>role</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="role"                data-endpoint="PUTapi-users--id-"
               value="administrador"
               data-component="body">
    <br>
<p>Rol del usuario dentro del sistema. Example: <code>administrador</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>is_active</code></b>&nbsp;&nbsp;
<small>boolean</small>&nbsp;
 &nbsp;
 &nbsp;
                <label data-endpoint="PUTapi-users--id-" style="display: none">
            <input type="radio" name="is_active"
                   value="true"
                   data-endpoint="PUTapi-users--id-"
                   data-component="body"             >
            <code>true</code>
        </label>
        <label data-endpoint="PUTapi-users--id-" style="display: none">
            <input type="radio" name="is_active"
                   value="false"
                   data-endpoint="PUTapi-users--id-"
                   data-component="body"             >
            <code>false</code>
        </label>
    <br>
<p>Estado de habilitación del usuario en el panel. Example: <code>true</code></p>
        </div>
        </form>

                    <h2 id="endpoints-DELETEapi-users--id-">DELETE api/users/{id}</h2>

<p>
</p>



<span id="example-requests-DELETEapi-users--id-">
<blockquote>Example request:</blockquote>


<div class="bash-example">
    <pre><code class="language-bash">curl --request DELETE \
    "http://localhost/api/users/1" \
    --header "Content-Type: application/json" \
    --header "Accept: application/json"</code></pre></div>


<div class="javascript-example">
    <pre><code class="language-javascript">const url = new URL(
    "http://localhost/api/users/1"
);

const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
};


fetch(url, {
    method: "DELETE",
    headers,
}).then(response =&gt; response.json());</code></pre></div>

</span>

<span id="example-responses-DELETEapi-users--id-">
</span>
<span id="execution-results-DELETEapi-users--id-" hidden>
    <blockquote>Received response<span
                id="execution-response-status-DELETEapi-users--id-"></span>:
    </blockquote>
    <pre class="json"><code id="execution-response-content-DELETEapi-users--id-"
      data-empty-response-text="<Empty response>" style="max-height: 400px;"></code></pre>
</span>
<span id="execution-error-DELETEapi-users--id-" hidden>
    <blockquote>Request failed with error:</blockquote>
    <pre><code id="execution-error-message-DELETEapi-users--id-">

Tip: Check that you&#039;re properly connected to the network.
If you&#039;re a maintainer of ths API, verify that your API is running and you&#039;ve enabled CORS.
You can check the Dev Tools console for debugging information.</code></pre>
</span>
<form id="form-DELETEapi-users--id-" data-method="DELETE"
      data-path="api/users/{id}"
      data-authed="0"
      data-hasfiles="0"
      data-isarraybody="0"
      autocomplete="off"
      onsubmit="event.preventDefault(); executeTryOut('DELETEapi-users--id-', this);">
    <h3>
        Request&nbsp;&nbsp;&nbsp;
                    <button type="button"
                    style="background-color: #8fbcd4; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-tryout-DELETEapi-users--id-"
                    onclick="tryItOut('DELETEapi-users--id-');">Try it out ⚡
            </button>
            <button type="button"
                    style="background-color: #c97a7e; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-canceltryout-DELETEapi-users--id-"
                    onclick="cancelTryOut('DELETEapi-users--id-');" hidden>Cancel 🛑
            </button>&nbsp;&nbsp;
            <button type="submit"
                    style="background-color: #6ac174; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-executetryout-DELETEapi-users--id-"
                    data-initial-text="Send Request 💥"
                    data-loading-text="⏱ Sending..."
                    hidden>Send Request 💥
            </button>
            </h3>
            <p>
            <small class="badge badge-red">DELETE</small>
            <b><code>api/users/{id}</code></b>
        </p>
                <h4 class="fancy-heading-panel"><b>Headers</b></h4>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Content-Type</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Content-Type"                data-endpoint="DELETEapi-users--id-"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Accept</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Accept"                data-endpoint="DELETEapi-users--id-"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                        <h4 class="fancy-heading-panel"><b>URL Parameters</b></h4>
                    <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>id</code></b>&nbsp;&nbsp;
<small>integer</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="number" style="display: none"
               step="any"               name="id"                data-endpoint="DELETEapi-users--id-"
               value="1"
               data-component="url">
    <br>
<p>The ID of the user. Example: <code>1</code></p>
            </div>
                    </form>

                    <h2 id="endpoints-GETapi-sales">GET api/sales</h2>

<p>
</p>



<span id="example-requests-GETapi-sales">
<blockquote>Example request:</blockquote>


<div class="bash-example">
    <pre><code class="language-bash">curl --request GET \
    --get "http://localhost/api/sales" \
    --header "Content-Type: application/json" \
    --header "Accept: application/json"</code></pre></div>


<div class="javascript-example">
    <pre><code class="language-javascript">const url = new URL(
    "http://localhost/api/sales"
);

const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
};


fetch(url, {
    method: "GET",
    headers,
}).then(response =&gt; response.json());</code></pre></div>

</span>

<span id="example-responses-GETapi-sales">
            <blockquote>
            <p>Example response (200):</p>
        </blockquote>
                <details class="annotation">
            <summary style="cursor: pointer;">
                <small onclick="textContent = parentElement.parentElement.open ? 'Show headers' : 'Hide headers'">Show headers</small>
            </summary>
            <pre><code class="language-http">cache-control: no-cache, private
content-type: application/json
access-control-allow-origin: *
 </code></pre></details>         <pre>

<code class="language-json" style="max-height: 300px;">{
    &quot;data&quot;: [
        {
            &quot;id&quot;: 1,
            &quot;customer_id&quot;: 6,
            &quot;user_id&quot;: 6,
            &quot;tipo_venta&quot;: &quot;minorista&quot;,
            &quot;tipo_comprobante&quot;: &quot;xLNZyTxAPX8rFowCDZK9y5GM1ikGkMn5zzTsC1iWa88VmSKQem&quot;,
            &quot;serie&quot;: &quot;X15N&quot;,
            &quot;correlativo&quot;: &quot;q3bOZhAHix&quot;,
            &quot;subtotal&quot;: &quot;43235863.20&quot;,
            &quot;igv&quot;: &quot;99356944.57&quot;,
            &quot;total&quot;: &quot;28520753.90&quot;,
            &quot;metodo_pago&quot;: &quot;assumenda&quot;,
            &quot;estado_pago&quot;: &quot;ea&quot;,
            &quot;fecha_venta&quot;: &quot;1991-09-28T16:05:44.000000Z&quot;,
            &quot;estado&quot;: false
        },
        {
            &quot;id&quot;: 2,
            &quot;customer_id&quot;: 7,
            &quot;user_id&quot;: 7,
            &quot;tipo_venta&quot;: &quot;minorista&quot;,
            &quot;tipo_comprobante&quot;: &quot;nQtzASQVs3AtebhiLclfitts4357b8XjwvPi8h1UjgwpLlPEG5&quot;,
            &quot;serie&quot;: &quot;SSTP&quot;,
            &quot;correlativo&quot;: &quot;N1JgJqswlp&quot;,
            &quot;subtotal&quot;: &quot;70658965.67&quot;,
            &quot;igv&quot;: &quot;70499005.10&quot;,
            &quot;total&quot;: &quot;55182993.06&quot;,
            &quot;metodo_pago&quot;: &quot;non&quot;,
            &quot;estado_pago&quot;: &quot;fuga&quot;,
            &quot;fecha_venta&quot;: &quot;1984-09-09T08:33:33.000000Z&quot;,
            &quot;estado&quot;: false
        },
        {
            &quot;id&quot;: 3,
            &quot;customer_id&quot;: 8,
            &quot;user_id&quot;: 8,
            &quot;tipo_venta&quot;: &quot;mayorista&quot;,
            &quot;tipo_comprobante&quot;: &quot;5UjYzEADmgbZg1qeRzsrqzXNMEkWjd3IQUUstiPCpFb8t9003Y&quot;,
            &quot;serie&quot;: &quot;CO1c&quot;,
            &quot;correlativo&quot;: &quot;19o8s7qjkk&quot;,
            &quot;subtotal&quot;: &quot;22097953.93&quot;,
            &quot;igv&quot;: &quot;38066274.73&quot;,
            &quot;total&quot;: &quot;78158904.36&quot;,
            &quot;metodo_pago&quot;: &quot;dolores&quot;,
            &quot;estado_pago&quot;: &quot;repudiandae&quot;,
            &quot;fecha_venta&quot;: &quot;1985-02-12T16:34:08.000000Z&quot;,
            &quot;estado&quot;: true
        },
        {
            &quot;id&quot;: 4,
            &quot;customer_id&quot;: 9,
            &quot;user_id&quot;: 9,
            &quot;tipo_venta&quot;: &quot;mayorista&quot;,
            &quot;tipo_comprobante&quot;: &quot;Tau9NDYXd1bslgEfHmpIvoCavmyAqcuYz1oPP3LoGW0QNLzQft&quot;,
            &quot;serie&quot;: &quot;eZlU&quot;,
            &quot;correlativo&quot;: &quot;ERiX6c5dVB&quot;,
            &quot;subtotal&quot;: &quot;36982938.47&quot;,
            &quot;igv&quot;: &quot;58409128.03&quot;,
            &quot;total&quot;: &quot;14726293.46&quot;,
            &quot;metodo_pago&quot;: &quot;temporibus&quot;,
            &quot;estado_pago&quot;: &quot;delectus&quot;,
            &quot;fecha_venta&quot;: &quot;2015-04-30T04:35:10.000000Z&quot;,
            &quot;estado&quot;: false
        },
        {
            &quot;id&quot;: 5,
            &quot;customer_id&quot;: 10,
            &quot;user_id&quot;: 10,
            &quot;tipo_venta&quot;: &quot;minorista&quot;,
            &quot;tipo_comprobante&quot;: &quot;Y7MVWIVXhFzQaCGRaPuvamoXsoU1IusitZs8a2fuHMSkyDiAmS&quot;,
            &quot;serie&quot;: &quot;klQv&quot;,
            &quot;correlativo&quot;: &quot;z9RHZLf89O&quot;,
            &quot;subtotal&quot;: &quot;64887606.84&quot;,
            &quot;igv&quot;: &quot;91987325.38&quot;,
            &quot;total&quot;: &quot;77862208.55&quot;,
            &quot;metodo_pago&quot;: &quot;et&quot;,
            &quot;estado_pago&quot;: &quot;atque&quot;,
            &quot;fecha_venta&quot;: &quot;2014-07-06T21:38:55.000000Z&quot;,
            &quot;estado&quot;: false
        },
        {
            &quot;id&quot;: 6,
            &quot;customer_id&quot;: 11,
            &quot;user_id&quot;: 11,
            &quot;tipo_venta&quot;: &quot;mayorista&quot;,
            &quot;tipo_comprobante&quot;: &quot;aoF1nXWEjFvW61OO470LSPz44ouwc1NlV4V9mj47q4asiXWWNp&quot;,
            &quot;serie&quot;: &quot;aQXV&quot;,
            &quot;correlativo&quot;: &quot;SHhRPeMIXq&quot;,
            &quot;subtotal&quot;: &quot;26770793.52&quot;,
            &quot;igv&quot;: &quot;29559251.68&quot;,
            &quot;total&quot;: &quot;23690906.41&quot;,
            &quot;metodo_pago&quot;: &quot;quisquam&quot;,
            &quot;estado_pago&quot;: &quot;possimus&quot;,
            &quot;fecha_venta&quot;: &quot;2002-02-15T15:01:26.000000Z&quot;,
            &quot;estado&quot;: false
        },
        {
            &quot;id&quot;: 7,
            &quot;customer_id&quot;: 12,
            &quot;user_id&quot;: 12,
            &quot;tipo_venta&quot;: &quot;minorista&quot;,
            &quot;tipo_comprobante&quot;: &quot;a031ToEcn43EYmWxjRNRdjofahE0trqo8dDLaTKH3gymWYKre8&quot;,
            &quot;serie&quot;: &quot;u4rU&quot;,
            &quot;correlativo&quot;: &quot;SRGea4g1Vx&quot;,
            &quot;subtotal&quot;: &quot;66205603.47&quot;,
            &quot;igv&quot;: &quot;54064730.67&quot;,
            &quot;total&quot;: &quot;12605843.88&quot;,
            &quot;metodo_pago&quot;: &quot;rerum&quot;,
            &quot;estado_pago&quot;: &quot;quis&quot;,
            &quot;fecha_venta&quot;: &quot;1987-02-01T16:24:18.000000Z&quot;,
            &quot;estado&quot;: true
        },
        {
            &quot;id&quot;: 8,
            &quot;customer_id&quot;: 13,
            &quot;user_id&quot;: 13,
            &quot;tipo_venta&quot;: &quot;minorista&quot;,
            &quot;tipo_comprobante&quot;: &quot;CeFdbzyXmuzKGw6LJbebR5d2WwjzDLuB4T8EoSUhTMWSBsRAoD&quot;,
            &quot;serie&quot;: &quot;LUi3&quot;,
            &quot;correlativo&quot;: &quot;82KEyhQnFi&quot;,
            &quot;subtotal&quot;: &quot;8298276.93&quot;,
            &quot;igv&quot;: &quot;10468470.03&quot;,
            &quot;total&quot;: &quot;93648003.91&quot;,
            &quot;metodo_pago&quot;: &quot;aliquid&quot;,
            &quot;estado_pago&quot;: &quot;veritatis&quot;,
            &quot;fecha_venta&quot;: &quot;2000-07-21T16:24:49.000000Z&quot;,
            &quot;estado&quot;: false
        },
        {
            &quot;id&quot;: 9,
            &quot;customer_id&quot;: 14,
            &quot;user_id&quot;: 14,
            &quot;tipo_venta&quot;: &quot;mayorista&quot;,
            &quot;tipo_comprobante&quot;: &quot;HD6xIJrZcNkcrGXNjDHJUS66k0tOGuaO6wEHzwk6WP5q44h1K1&quot;,
            &quot;serie&quot;: &quot;hipX&quot;,
            &quot;correlativo&quot;: &quot;3XGjdz1pGU&quot;,
            &quot;subtotal&quot;: &quot;81151660.89&quot;,
            &quot;igv&quot;: &quot;26824162.91&quot;,
            &quot;total&quot;: &quot;41746372.05&quot;,
            &quot;metodo_pago&quot;: &quot;repudiandae&quot;,
            &quot;estado_pago&quot;: &quot;harum&quot;,
            &quot;fecha_venta&quot;: &quot;1981-11-29T16:21:41.000000Z&quot;,
            &quot;estado&quot;: false
        },
        {
            &quot;id&quot;: 10,
            &quot;customer_id&quot;: 15,
            &quot;user_id&quot;: 15,
            &quot;tipo_venta&quot;: &quot;minorista&quot;,
            &quot;tipo_comprobante&quot;: &quot;2xbhCSjvvOmRcDCSUqPJGkmOCOaAQ5kmCObSv6eiVGYrcNQ494&quot;,
            &quot;serie&quot;: &quot;fCy0&quot;,
            &quot;correlativo&quot;: &quot;wKxLGOippp&quot;,
            &quot;subtotal&quot;: &quot;46599788.38&quot;,
            &quot;igv&quot;: &quot;13887472.97&quot;,
            &quot;total&quot;: &quot;43566449.28&quot;,
            &quot;metodo_pago&quot;: &quot;maiores&quot;,
            &quot;estado_pago&quot;: &quot;voluptate&quot;,
            &quot;fecha_venta&quot;: &quot;1997-07-02T20:11:25.000000Z&quot;,
            &quot;estado&quot;: true
        }
    ]
}</code>
 </pre>
    </span>
<span id="execution-results-GETapi-sales" hidden>
    <blockquote>Received response<span
                id="execution-response-status-GETapi-sales"></span>:
    </blockquote>
    <pre class="json"><code id="execution-response-content-GETapi-sales"
      data-empty-response-text="<Empty response>" style="max-height: 400px;"></code></pre>
</span>
<span id="execution-error-GETapi-sales" hidden>
    <blockquote>Request failed with error:</blockquote>
    <pre><code id="execution-error-message-GETapi-sales">

Tip: Check that you&#039;re properly connected to the network.
If you&#039;re a maintainer of ths API, verify that your API is running and you&#039;ve enabled CORS.
You can check the Dev Tools console for debugging information.</code></pre>
</span>
<form id="form-GETapi-sales" data-method="GET"
      data-path="api/sales"
      data-authed="0"
      data-hasfiles="0"
      data-isarraybody="0"
      autocomplete="off"
      onsubmit="event.preventDefault(); executeTryOut('GETapi-sales', this);">
    <h3>
        Request&nbsp;&nbsp;&nbsp;
                    <button type="button"
                    style="background-color: #8fbcd4; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-tryout-GETapi-sales"
                    onclick="tryItOut('GETapi-sales');">Try it out ⚡
            </button>
            <button type="button"
                    style="background-color: #c97a7e; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-canceltryout-GETapi-sales"
                    onclick="cancelTryOut('GETapi-sales');" hidden>Cancel 🛑
            </button>&nbsp;&nbsp;
            <button type="submit"
                    style="background-color: #6ac174; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-executetryout-GETapi-sales"
                    data-initial-text="Send Request 💥"
                    data-loading-text="⏱ Sending..."
                    hidden>Send Request 💥
            </button>
            </h3>
            <p>
            <small class="badge badge-green">GET</small>
            <b><code>api/sales</code></b>
        </p>
                <h4 class="fancy-heading-panel"><b>Headers</b></h4>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Content-Type</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Content-Type"                data-endpoint="GETapi-sales"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Accept</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Accept"                data-endpoint="GETapi-sales"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                        </form>

                    <h2 id="endpoints-POSTapi-sales">POST api/sales</h2>

<p>
</p>



<span id="example-requests-POSTapi-sales">
<blockquote>Example request:</blockquote>


<div class="bash-example">
    <pre><code class="language-bash">curl --request POST \
    "http://localhost/api/sales" \
    --header "Content-Type: application/json" \
    --header "Accept: application/json" \
    --data "{
    \"customer_id\": 1,
    \"user_id\": 2,
    \"tipo_venta\": \"mayorista\",
    \"tipo_comprobante\": \"FACTURA\",
    \"serie\": \"F001\",
    \"metodo_pago\": \"Depósito\",
    \"estado_pago\": \"pagado\",
    \"items\": [
        {
            \"product_id\": 1,
            \"cantidad\": 15.5,
            \"descuento\": 0
        }
    ]
}"
</code></pre></div>


<div class="javascript-example">
    <pre><code class="language-javascript">const url = new URL(
    "http://localhost/api/sales"
);

const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
};

let body = {
    "customer_id": 1,
    "user_id": 2,
    "tipo_venta": "mayorista",
    "tipo_comprobante": "FACTURA",
    "serie": "F001",
    "metodo_pago": "Depósito",
    "estado_pago": "pagado",
    "items": [
        {
            "product_id": 1,
            "cantidad": 15.5,
            "descuento": 0
        }
    ]
};

fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
}).then(response =&gt; response.json());</code></pre></div>

</span>

<span id="example-responses-POSTapi-sales">
</span>
<span id="execution-results-POSTapi-sales" hidden>
    <blockquote>Received response<span
                id="execution-response-status-POSTapi-sales"></span>:
    </blockquote>
    <pre class="json"><code id="execution-response-content-POSTapi-sales"
      data-empty-response-text="<Empty response>" style="max-height: 400px;"></code></pre>
</span>
<span id="execution-error-POSTapi-sales" hidden>
    <blockquote>Request failed with error:</blockquote>
    <pre><code id="execution-error-message-POSTapi-sales">

Tip: Check that you&#039;re properly connected to the network.
If you&#039;re a maintainer of ths API, verify that your API is running and you&#039;ve enabled CORS.
You can check the Dev Tools console for debugging information.</code></pre>
</span>
<form id="form-POSTapi-sales" data-method="POST"
      data-path="api/sales"
      data-authed="0"
      data-hasfiles="0"
      data-isarraybody="0"
      autocomplete="off"
      onsubmit="event.preventDefault(); executeTryOut('POSTapi-sales', this);">
    <h3>
        Request&nbsp;&nbsp;&nbsp;
                    <button type="button"
                    style="background-color: #8fbcd4; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-tryout-POSTapi-sales"
                    onclick="tryItOut('POSTapi-sales');">Try it out ⚡
            </button>
            <button type="button"
                    style="background-color: #c97a7e; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-canceltryout-POSTapi-sales"
                    onclick="cancelTryOut('POSTapi-sales');" hidden>Cancel 🛑
            </button>&nbsp;&nbsp;
            <button type="submit"
                    style="background-color: #6ac174; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-executetryout-POSTapi-sales"
                    data-initial-text="Send Request 💥"
                    data-loading-text="⏱ Sending..."
                    hidden>Send Request 💥
            </button>
            </h3>
            <p>
            <small class="badge badge-black">POST</small>
            <b><code>api/sales</code></b>
        </p>
                <h4 class="fancy-heading-panel"><b>Headers</b></h4>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Content-Type</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Content-Type"                data-endpoint="POSTapi-sales"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Accept</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Accept"                data-endpoint="POSTapi-sales"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                                <h4 class="fancy-heading-panel"><b>Body Parameters</b></h4>
        <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>customer_id</code></b>&nbsp;&nbsp;
<small>integer</small>&nbsp;
<i>optional</i> &nbsp;
 &nbsp;
                <input type="number" style="display: none"
               step="any"               name="customer_id"                data-endpoint="POSTapi-sales"
               value="1"
               data-component="body">
    <br>
<p>ID único del cliente registrado. Example: <code>1</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>user_id</code></b>&nbsp;&nbsp;
<small>integer</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="number" style="display: none"
               step="any"               name="user_id"                data-endpoint="POSTapi-sales"
               value="2"
               data-component="body">
    <br>
<p>ID del vendedor/usuario que procesa la operación. Example: <code>2</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>tipo_venta</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="tipo_venta"                data-endpoint="POSTapi-sales"
               value="mayorista"
               data-component="body">
    <br>
<p>Canal de distribución o tarifa a aplicar al precio del producto. Example: <code>mayorista</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>tipo_comprobante</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="tipo_comprobante"                data-endpoint="POSTapi-sales"
               value="FACTURA"
               data-component="body">
    <br>
<p>Comprobante emitido según SUNAT (BOLETA, FACTURA, TICKET). Example: <code>FACTURA</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>serie</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="serie"                data-endpoint="POSTapi-sales"
               value="F001"
               data-component="body">
    <br>
<p>Identificador del terminal o punto de venta física. Example: <code>F001</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>metodo_pago</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="metodo_pago"                data-endpoint="POSTapi-sales"
               value="Depósito"
               data-component="body">
    <br>
<p>Canal financiero de recepción del dinero (Efectivo, Depósito, Yape). Example: <code>Depósito</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
            <b style="line-height: 2;"><code>estado_pago</code></b>&nbsp;&nbsp;
<small>string</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="estado_pago"                data-endpoint="POSTapi-sales"
               value="pagado"
               data-component="body">
    <br>
<p>Control de flujo de caja de la venta (pagado, pendiente). Example: <code>pagado</code></p>
        </div>
                <div style=" padding-left: 28px;  clear: unset;">
        <details>
            <summary style="padding-bottom: 10px;">
                <b style="line-height: 2;"><code>items</code></b>&nbsp;&nbsp;
<small>object[]</small>&nbsp;
 &nbsp;
 &nbsp;
<br>
<p>Estructura indexada del carrito de compras (Despacho de café/cacao).</p>
            </summary>
                                                <div style="margin-left: 14px; clear: unset;">
                        <b style="line-height: 2;"><code>product_id</code></b>&nbsp;&nbsp;
<small>integer</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="number" style="display: none"
               step="any"               name="items.0.product_id"                data-endpoint="POSTapi-sales"
               value="1"
               data-component="body">
    <br>
<p>ID del producto agrícola en almacén. Example: <code>1</code></p>
                    </div>
                                                                <div style="margin-left: 14px; clear: unset;">
                        <b style="line-height: 2;"><code>cantidad</code></b>&nbsp;&nbsp;
<small>number</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="number" style="display: none"
               step="any"               name="items.0.cantidad"                data-endpoint="POSTapi-sales"
               value="15.5"
               data-component="body">
    <br>
<p>Volumen físico o cantidad de sacos/quintales/kilos a despachar. Example: <code>15.5</code></p>
                    </div>
                                                                <div style="margin-left: 14px; clear: unset;">
                        <b style="line-height: 2;"><code>descuento</code></b>&nbsp;&nbsp;
<small>number</small>&nbsp;
<i>optional</i> &nbsp;
 &nbsp;
                <input type="number" style="display: none"
               step="any"               name="items.0.descuento"                data-endpoint="POSTapi-sales"
               value="0"
               data-component="body">
    <br>
<p>Deducción monetaria directa aplicable al ítem. Example: <code>0</code></p>
                    </div>
                                    </details>
        </div>
        </form>

                    <h2 id="endpoints-GETapi-sales--id-">GET api/sales/{id}</h2>

<p>
</p>



<span id="example-requests-GETapi-sales--id-">
<blockquote>Example request:</blockquote>


<div class="bash-example">
    <pre><code class="language-bash">curl --request GET \
    --get "http://localhost/api/sales/1" \
    --header "Content-Type: application/json" \
    --header "Accept: application/json"</code></pre></div>


<div class="javascript-example">
    <pre><code class="language-javascript">const url = new URL(
    "http://localhost/api/sales/1"
);

const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
};


fetch(url, {
    method: "GET",
    headers,
}).then(response =&gt; response.json());</code></pre></div>

</span>

<span id="example-responses-GETapi-sales--id-">
            <blockquote>
            <p>Example response (200):</p>
        </blockquote>
                <details class="annotation">
            <summary style="cursor: pointer;">
                <small onclick="textContent = parentElement.parentElement.open ? 'Show headers' : 'Hide headers'">Show headers</small>
            </summary>
            <pre><code class="language-http">cache-control: no-cache, private
content-type: application/json
access-control-allow-origin: *
 </code></pre></details>         <pre>

<code class="language-json" style="max-height: 300px;">{
    &quot;data&quot;: {
        &quot;id&quot;: 1,
        &quot;customer_id&quot;: 6,
        &quot;user_id&quot;: 6,
        &quot;tipo_venta&quot;: &quot;minorista&quot;,
        &quot;tipo_comprobante&quot;: &quot;xLNZyTxAPX8rFowCDZK9y5GM1ikGkMn5zzTsC1iWa88VmSKQem&quot;,
        &quot;serie&quot;: &quot;X15N&quot;,
        &quot;correlativo&quot;: &quot;q3bOZhAHix&quot;,
        &quot;subtotal&quot;: &quot;43235863.20&quot;,
        &quot;igv&quot;: &quot;99356944.57&quot;,
        &quot;total&quot;: &quot;28520753.90&quot;,
        &quot;metodo_pago&quot;: &quot;assumenda&quot;,
        &quot;estado_pago&quot;: &quot;ea&quot;,
        &quot;fecha_venta&quot;: &quot;1991-09-28T16:05:44.000000Z&quot;,
        &quot;estado&quot;: false
    }
}</code>
 </pre>
    </span>
<span id="execution-results-GETapi-sales--id-" hidden>
    <blockquote>Received response<span
                id="execution-response-status-GETapi-sales--id-"></span>:
    </blockquote>
    <pre class="json"><code id="execution-response-content-GETapi-sales--id-"
      data-empty-response-text="<Empty response>" style="max-height: 400px;"></code></pre>
</span>
<span id="execution-error-GETapi-sales--id-" hidden>
    <blockquote>Request failed with error:</blockquote>
    <pre><code id="execution-error-message-GETapi-sales--id-">

Tip: Check that you&#039;re properly connected to the network.
If you&#039;re a maintainer of ths API, verify that your API is running and you&#039;ve enabled CORS.
You can check the Dev Tools console for debugging information.</code></pre>
</span>
<form id="form-GETapi-sales--id-" data-method="GET"
      data-path="api/sales/{id}"
      data-authed="0"
      data-hasfiles="0"
      data-isarraybody="0"
      autocomplete="off"
      onsubmit="event.preventDefault(); executeTryOut('GETapi-sales--id-', this);">
    <h3>
        Request&nbsp;&nbsp;&nbsp;
                    <button type="button"
                    style="background-color: #8fbcd4; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-tryout-GETapi-sales--id-"
                    onclick="tryItOut('GETapi-sales--id-');">Try it out ⚡
            </button>
            <button type="button"
                    style="background-color: #c97a7e; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-canceltryout-GETapi-sales--id-"
                    onclick="cancelTryOut('GETapi-sales--id-');" hidden>Cancel 🛑
            </button>&nbsp;&nbsp;
            <button type="submit"
                    style="background-color: #6ac174; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-executetryout-GETapi-sales--id-"
                    data-initial-text="Send Request 💥"
                    data-loading-text="⏱ Sending..."
                    hidden>Send Request 💥
            </button>
            </h3>
            <p>
            <small class="badge badge-green">GET</small>
            <b><code>api/sales/{id}</code></b>
        </p>
                <h4 class="fancy-heading-panel"><b>Headers</b></h4>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Content-Type</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Content-Type"                data-endpoint="GETapi-sales--id-"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Accept</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Accept"                data-endpoint="GETapi-sales--id-"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                        <h4 class="fancy-heading-panel"><b>URL Parameters</b></h4>
                    <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>id</code></b>&nbsp;&nbsp;
<small>integer</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="number" style="display: none"
               step="any"               name="id"                data-endpoint="GETapi-sales--id-"
               value="1"
               data-component="url">
    <br>
<p>The ID of the sale. Example: <code>1</code></p>
            </div>
                    </form>

                    <h2 id="endpoints-DELETEapi-sales--id-">DELETE api/sales/{id}</h2>

<p>
</p>



<span id="example-requests-DELETEapi-sales--id-">
<blockquote>Example request:</blockquote>


<div class="bash-example">
    <pre><code class="language-bash">curl --request DELETE \
    "http://localhost/api/sales/1" \
    --header "Content-Type: application/json" \
    --header "Accept: application/json"</code></pre></div>


<div class="javascript-example">
    <pre><code class="language-javascript">const url = new URL(
    "http://localhost/api/sales/1"
);

const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
};


fetch(url, {
    method: "DELETE",
    headers,
}).then(response =&gt; response.json());</code></pre></div>

</span>

<span id="example-responses-DELETEapi-sales--id-">
</span>
<span id="execution-results-DELETEapi-sales--id-" hidden>
    <blockquote>Received response<span
                id="execution-response-status-DELETEapi-sales--id-"></span>:
    </blockquote>
    <pre class="json"><code id="execution-response-content-DELETEapi-sales--id-"
      data-empty-response-text="<Empty response>" style="max-height: 400px;"></code></pre>
</span>
<span id="execution-error-DELETEapi-sales--id-" hidden>
    <blockquote>Request failed with error:</blockquote>
    <pre><code id="execution-error-message-DELETEapi-sales--id-">

Tip: Check that you&#039;re properly connected to the network.
If you&#039;re a maintainer of ths API, verify that your API is running and you&#039;ve enabled CORS.
You can check the Dev Tools console for debugging information.</code></pre>
</span>
<form id="form-DELETEapi-sales--id-" data-method="DELETE"
      data-path="api/sales/{id}"
      data-authed="0"
      data-hasfiles="0"
      data-isarraybody="0"
      autocomplete="off"
      onsubmit="event.preventDefault(); executeTryOut('DELETEapi-sales--id-', this);">
    <h3>
        Request&nbsp;&nbsp;&nbsp;
                    <button type="button"
                    style="background-color: #8fbcd4; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-tryout-DELETEapi-sales--id-"
                    onclick="tryItOut('DELETEapi-sales--id-');">Try it out ⚡
            </button>
            <button type="button"
                    style="background-color: #c97a7e; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-canceltryout-DELETEapi-sales--id-"
                    onclick="cancelTryOut('DELETEapi-sales--id-');" hidden>Cancel 🛑
            </button>&nbsp;&nbsp;
            <button type="submit"
                    style="background-color: #6ac174; padding: 5px 10px; border-radius: 5px; border-width: thin;"
                    id="btn-executetryout-DELETEapi-sales--id-"
                    data-initial-text="Send Request 💥"
                    data-loading-text="⏱ Sending..."
                    hidden>Send Request 💥
            </button>
            </h3>
            <p>
            <small class="badge badge-red">DELETE</small>
            <b><code>api/sales/{id}</code></b>
        </p>
                <h4 class="fancy-heading-panel"><b>Headers</b></h4>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Content-Type</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Content-Type"                data-endpoint="DELETEapi-sales--id-"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                                <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>Accept</code></b>&nbsp;&nbsp;
&nbsp;
 &nbsp;
 &nbsp;
                <input type="text" style="display: none"
                              name="Accept"                data-endpoint="DELETEapi-sales--id-"
               value="application/json"
               data-component="header">
    <br>
<p>Example: <code>application/json</code></p>
            </div>
                        <h4 class="fancy-heading-panel"><b>URL Parameters</b></h4>
                    <div style="padding-left: 28px; clear: unset;">
                <b style="line-height: 2;"><code>id</code></b>&nbsp;&nbsp;
<small>integer</small>&nbsp;
 &nbsp;
 &nbsp;
                <input type="number" style="display: none"
               step="any"               name="id"                data-endpoint="DELETEapi-sales--id-"
               value="1"
               data-component="url">
    <br>
<p>The ID of the sale. Example: <code>1</code></p>
            </div>
                    </form>

            

        
    </div>
    <div class="dark-box">
                    <div class="lang-selector">
                                                        <button type="button" class="lang-button" data-language-name="bash">bash</button>
                                                        <button type="button" class="lang-button" data-language-name="javascript">javascript</button>
                            </div>
            </div>
</div>
</body>
</html>
