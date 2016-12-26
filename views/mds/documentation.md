<div id="toc">
  <h2>Table of Contents</h2>
  <ul>
    <li><span class="stability_undefined"><a
            href="#documentation_about_this_documentation">About this Documentation</a></span>
      <ul>
        <li><span class="stability_undefined"><a
                href="#documentation_stability_index">Stability Index</a></span></li>
        <li><span class="stability_1"><a href="#documentation_json_output">JSON Output</a></span></li>
        <li><span class="stability_undefined"><a href="#documentation_syscalls_and_man_pages">Syscalls and man pages</a></span>
        </li>
      </ul>
    </li>
  </ul>

</div>

<div id="apicontent">
  <h1>About this Documentation<span><a class="mark" href="#documentation_about_this_documentation"
                                       id="documentation_about_this_documentation">#</a></span></h1>
  <!-- type=misc -->
  <p>The goal of this documentation is to comprehensively explain the Node.js
    API, both from a reference as well as a conceptual point of view. Each
    section describes a built-in module or high-level concept.</p>
  <p>Where appropriate, property types, method arguments, and the arguments
    provided to event handlers are detailed in a list underneath the topic
    heading.</p>
  <p>Every <code>.html</code> document has a corresponding <code>.json</code> document presenting
    the same information in a structured manner. This feature is
    experimental, and added for the benefit of IDEs and other utilities that
    wish to do programmatic things with the documentation.</p>
  <p>Every <code>.html</code> and <code>.json</code> file is generated based on the corresponding
    <code>.md</code> file in the <code>doc/api/</code> folder in Node.js&#39;s source tree. The
    documentation is generated using the <code>tools/doc/generate.js</code> program.
    The HTML template is located at <code>doc/template.html</code>.</p>
  <p>If you find an error in this documentation, please <a href="https://github.com/nodejs/node/issues/new">submit an
    issue</a>
    or see <a href="https://github.com/nodejs/node/blob/master/CONTRIBUTING.md">the contributing guide</a> for
    directions on how to submit a patch.</p>
  <h2>Stability Index<span><a class="mark" href="#documentation_stability_index"
                              id="documentation_stability_index">#</a></span></h2>
  <!--type=misc-->
  <p>Throughout the documentation, you will see indications of a section&#39;s
    stability. The Node.js API is still somewhat changing, and as it
    matures, certain parts are more reliable than others. Some are so
    proven, and so relied upon, that they are unlikely to ever change at
    all. Others are brand new and experimental, or known to be hazardous
    and in the process of being redesigned.</p>
  <p>The stability indices are as follows:</p>
<pre class="api_stability api_stability_0">Stability: 0 - Deprecated
This feature is known to be problematic, and changes are
planned.  Do not rely on it.  Use of the feature may cause warnings.  Backwards
compatibility should not be expected.</pre><pre class="api_stability api_stability_1">Stability: 1 - Experimental
This feature is subject to change, and is gated by a command line flag.
It may change or be removed in future versions.</pre><pre class="api_stability api_stability_2">Stability: 2 - Stable
The API has proven satisfactory. Compatibility with the npm ecosystem
is a high priority, and will not be broken unless absolutely necessary.</pre><pre class="api_stability api_stability_3">Stability: 3 - Locked
Only fixes related to security, performance, or bug fixes will be accepted.
Please do not suggest API changes in this area; they will be refused.</pre>
  <h2>JSON Output<span><a class="mark" href="#documentation_json_output" id="documentation_json_output">#</a></span>
  </h2>
  <pre class="api_stability api_stability_1">Stability: 1 - Experimental</pre>
  <p>Every HTML file in the markdown has a corresponding JSON file with the
    same data.</p>
  <p>This feature was added in Node.js v0.6.12. It is experimental.</p>
  <h2>Syscalls and man pages<span><a class="mark" href="#documentation_syscalls_and_man_pages"
                                     id="documentation_syscalls_and_man_pages">#</a></span></h2>
  <p>System calls like <a href="http://man7.org/linux/man-pages/man2/open.2.html">open(2)</a> and <a
          href="http://man7.org/linux/man-pages/man2/read.2.html">read(2)</a> define the interface between user
    programs
    and the underlying operating system. Node functions which simply wrap a syscall,
    like <code>fs.open()</code>, will document that. The docs link to the corresponding man
    pages (short for manual pages) which describe how the syscalls work.</p>
  <p><strong>Caveat:</strong> some syscalls, like <a href="http://man7.org/linux/man-pages/man2/lchown.2.html">lchown(2)</a>,
    are BSD-specific. That means, for
    example, that <code>fs.lchown()</code> only works on Mac OS X and other BSD-derived systems,
    and is not available on Linux.</p>
  <p>Most Unix syscalls have Windows equivalents, but behavior may differ on Windows
    relative to Linux and OS X. For an example of the subtle ways in which it&#39;s
    sometimes impossible to replace Unix syscall semantics on Windows, see <a
            href="https://github.com/nodejs/node/issues/4760">Node
      issue 4760</a>.</p>

</div>
