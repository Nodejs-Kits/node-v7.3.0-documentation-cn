<div id="toc">
  <h2>Table of Contents</h2>
  <ul>
    <li><span class="stability_undefined"><a href="#synopsis_usage">Usage</a></span>
      <ul>
        <li><span class="stability_undefined"><a href="#synopsis_example">Example</a></span></li>
      </ul>
    </li>
  </ul>

</div>

<div id="apicontent">
  <h1>Usage<span><a class="mark" href="#synopsis_usage" id="synopsis_usage">#</a></span></h1>
  <!--type=misc-->
  <p><code>node [options] [v8 options] [script.js | -e &quot;script&quot;] [arguments]</code></p>
  <p>Please see the <a href="cli.html#cli_command_line_options">Command Line Options</a> document for information
    about
    different options and ways to run scripts with Node.js.</p>
  <h2>Example<span><a class="mark" href="#synopsis_example" id="synopsis_example">#</a></span></h2>
  <p>An example of a <a href="http.html">web server</a> written with Node.js which responds with
    <code>&#39;Hello World&#39;</code>:</p>
<pre><code class="lang-js">const http = require(&#39;http&#39;);

const hostname = &#39;127.0.0.1&#39;;
const port = 3000;

const server = http.createServer((req, res) =&gt; {
  res.statusCode = 200;
  res.setHeader(&#39;Content-Type&#39;, &#39;text/plain&#39;);
  res.end(&#39;Hello World\n&#39;);
});

server.listen(port, hostname, () =&gt; {
  console.log(`Server running at http://${hostname}:${port}/`);
});
</code></pre>
  <p>To run the server, put the code into a file called <code>example.js</code> and execute
    it with Node.js:</p>
<pre><code class="lang-txt">$ node example.js
Server running at http://127.0.0.1:3000/
</code></pre>
  <p>All of the examples in the documentation can be run similarly.</p>

</div>
