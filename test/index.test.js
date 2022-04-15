const pakit = require("../src/pakit.js");
const path = require("path");

describe("pakit test suite", function() {
  describe("when bundling a module with no dependencies", function() {
    var result;

    function setup () {
      return pakit("test/sample/hello-world/all.js", { log: false }).then(ctx => result = ctx);
    }

    it("then result has a 'main' shard", async () => {
      await setup();
      expect(result.shards).toHaveProperty("main");
    });

    it("then content of the 'main' shard with correct  value", async () => {
      await setup();
      const actual = removeToIndexOf(trimResult(result.shards["main"].content), "Miguel Castillo <manchagnu@gmail.com>");
      const expected = `Miguel Castillo <manchagnu@gmail.com>. Licensed under MIT */require=_bb$iter=function(r,e){var t={};function n(e){if(!t.hasOwnProperty(e)){var i={exports:{}},f=r[e][0],u=r[e][1];t[e]=i.exports,f((a=u,function(r){var e=a[r];if(o(e))return n(e);for(var t=n.next;t;t=t.next)if(t.has(e))return t.get(e);for(var i=n.prev;i;i=i.prev)if(i.has(e))return i.get(e);throw new Error("Module \'"+r+"\' with id "+e+" was not found")}),i,i.exports),t[e]=i.exports}var a;return t[e]}function o(e){return r[e]}if(n.get=n,n.has=o,n.next="undefined"==typeof _bb$iter?null:_bb$iter,e.length)for(var i=n,f=n.next;f;)f.prev=i,i=f,f=f.next;return e.forEach(n),n}({1:[function(r,e,t){"use strict";console.log("hello world")},{}]},[1]);`;
      expect(actual).toEqual(expected);
    });

    it("then the result has one module", async () => {
      await setup();
      expect(result.shards["main"].modules).toHaveLength(1);
    });
  });

  describe("when bundling a module and defining shard rules", function() {
    var result;

    function setup () {
      return pakit("test/sample/hello-world/index.js", {
        log: false,
        shards: {
          hello: { match: "hello.js$" },
          world: { match: /world.js$/ }
        }
      })
      .then(ctx => result = ctx);
    }

    it("then the 'main' bundle is created", async () => {
      await setup();
      expect(result.shards).toHaveProperty("main");
    });

    it("then the 'main' bundle has the expected content", async () => {
      await setup();
      const actual = removeToIndexOf(trimResult(result.shards["main"].content), "Miguel Castillo <manchagnu@gmail.com>");
      const expected = `Miguel Castillo <manchagnu@gmail.com>. Licensed under MIT */require=_bb$iter=function(r,e){var t={};function n(e){if(!t.hasOwnProperty(e)){var i={exports:{}},f=r[e][0],u=r[e][1];t[e]=i.exports,f((a=u,function(r){var e=a[r];if(o(e))return n(e);for(var t=n.next;t;t=t.next)if(t.has(e))return t.get(e);for(var i=n.prev;i;i=i.prev)if(i.has(e))return i.get(e);throw new Error("Module \'"+r+"\' with id "+e+" was not found")}),i,i.exports),t[e]=i.exports}var a;return t[e]}function o(e){return r[e]}if(n.get=n,n.has=o,n.next="undefined"==typeof _bb$iter?null:_bb$iter,e.length)for(var i=n,f=n.next;f;)f.prev=i,i=f,f=f.next;return e.forEach(n),n}({1:[function(r,e,t){"use strict";r("./hello"),console.log(" == "),r("./world")},{"./hello":2,"./world":3}]},[1]);`;
      expect(actual).toEqual(expected);
    });

    it("then the 'main' bundle has one module", async () => {
      await setup();
      expect(result.shards["main"].modules).toHaveLength(1);
    });

    it("then the 'hello' bundle is created", async () => {
      await setup();
      expect(result.shards).toHaveProperty("hello");
    });

    it("then the 'hello' bundle has the expected content", async () => {
      await setup();
      const actual = removeToIndexOf(trimResult(result.shards["main"].content), "Miguel Castillo <manchagnu@gmail.com>");
      const expected = `Miguel Castillo <manchagnu@gmail.com>. Licensed under MIT */require=_bb$iter=function(r,e){var t={};function n(e){if(!t.hasOwnProperty(e)){var i={exports:{}},f=r[e][0],u=r[e][1];t[e]=i.exports,f((a=u,function(r){var e=a[r];if(o(e))return n(e);for(var t=n.next;t;t=t.next)if(t.has(e))return t.get(e);for(var i=n.prev;i;i=i.prev)if(i.has(e))return i.get(e);throw new Error("Module '"+r+"' with id "+e+" was not found")}),i,i.exports),t[e]=i.exports}var a;return t[e]}function o(e){return r[e]}if(n.get=n,n.has=o,n.next="undefined"==typeof _bb$iter?null:_bb$iter,e.length)for(var i=n,f=n.next;f;)f.prev=i,i=f,f=f.next;return e.forEach(n),n}({1:[function(r,e,t){"use strict";r("./hello"),console.log(" == "),r("./world")},{"./hello":2,"./world":3}]},[1]);`;
      expect(actual).toEqual(expected);
    });

    it("then the 'hello' bundle has one module", async () => {
      await setup();
      expect(result.shards["hello"].modules).toHaveLength(4);
    });

    it("then the 'world' bundle is created", async () => {
      await setup();
      expect(result.shards).toHaveProperty("world");
    });

    it("then the 'world' bundle has the expected content", async () => {
      await setup();
      const actual = removeToIndexOf(trimResult(result.shards["main"].content), "Miguel Castillo <manchagnu@gmail.com>");
      const expected = escapeChars(`Miguel Castillo <manchagnu@gmail.com>. Licensed under MIT */require=_bb$iter=function(r,e){var t={};function n(e){if(!t.hasOwnProperty(e)){var i={exports:{}},f=r[e][0],u=r[e][1];t[e]=i.exports,f((a=u,function(r){var e=a[r];if(o(e))return n(e);for(var t=n.next;t;t=t.next)if(t.has(e))return t.get(e);for(var i=n.prev;i;i=i.prev)if(i.has(e))return i.get(e);throw new Error("Module '"+r+"' with id "+e+" was not found")}),i,i.exports),t[e]=i.exports}var a;return t[e]}function o(e){return r[e]}if(n.get=n,n.has=o,n.next="undefined"==typeof _bb$iter?null:_bb$iter,e.length)for(var i=n,f=n.next;f;)f.prev=i,i=f,f=f.next;return e.forEach(n),n}({1:[function(r,e,t){"use strict";r("./hello"),console.log(" == "),r("./world")},{"./hello":2,"./world":3}]},[1]);`);
      expect(actual).toEqual(expected);
    });

    it("then the 'world' bundle has one module", async () => {
      await setup();
      expect(result.shards["world"].modules).toHaveLength(1);
    });
  });

  describe("when bundling a module with two dependencies", function() {
    var result;

    function setup () {
      return pakit("test/sample/hello-world/index.js", { log: false }).then(ctx => result = ctx);
    }

    it("then result has a 'main' shard", async () => {
      await setup();
      expect(result.shards).toHaveProperty("main");
    });

    it("then content of the 'main' shard with correct  value", async () => {
      await setup();
      const actual = removeToIndexOf(trimResult(result.shards["main"].content), "Miguel Castillo <manchagnu@gmail.com>");
      const expected = escapeChars(`Miguel Castillo <manchagnu@gmail.com>. Licensed under MIT */require=_bb$iter=function(e,t){var o={};function n(t){if(!o.hasOwnProperty(t)){var l={exports:{}},s=e[t][0],i=e[t][1];o[t]=l.exports,s((u=i,function(e){var t=u[e];if(r(t))return n(t);for(var o=n.next;o;o=o.next)if(o.has(t))return o.get(t);for(var l=n.prev;l;l=l.prev)if(l.has(t))return l.get(t);throw new Error("Module '"+e+"' with id "+t+" was not found")}),l,l.exports),o[t]=l.exports}var u;return o[t]}function r(t){return e[t]}if(n.get=n,n.has=r,n.next="undefined"==typeof _bb$iter?null:_bb$iter,t.length)for(var l=n,s=n.next;s;)s.prev=l,l=s,s=s.next;return t.forEach(n),n}({1:[function(e,t,o){"use strict";e("./hello"),console.log(" == "),e("./world")},{"./hello":2,"./world":3}],2:[function(e,t,o){"use strict";e("./hello.css"),e("./hello.json"),console.log("hello")},{"./hello.css":4,"./hello.json":5}],3:[function(e,t,o){"use strict";console.log("world")},{}],4:[function(e,t,o){e("$bit-loader-css/loadstyle")(".hello {\n  color: blue;\n}\n")},{"$bit-loader-css/loadstyle":6}],5:[function(e,t,o){t.exports={hello:"json"}},{}],6:[function(e,t,o){t.exports=function(e){var t=document.getElementsByTagName("head")[0],o=document.createElement("style");o.setAttribute("type","text/css"),o.innerHTML=e,t.appendChild(o)}},{}]},[1]);`);
      expect(actual).toEqual(expected);
    });

    it("then the result has 6 module", async () => {
      await setup();
      expect(result.shards["main"].modules).toHaveLength(6);
    });
  });

  describe("when bundling a file content with no dependencies", function() {
    var result, content;

    function setup () {
      content = "console.log('hello world - content');";
      return pakit({ content: content }, { log: false }).then(ctx => result = ctx);
    }

    it("then result has a 'main' shard", async () => {
      await setup();
      expect(result.shards).toHaveProperty("main");
    });

    it("then content of the 'main' shard with correct  value", async () => {
      await setup();
      const actual = removeToIndexOf(trimResult(result.shards["main"].content), "Miguel Castillo <manchagnu@gmail.com>");
      const expected = escapeChars(`Miguel Castillo <manchagnu@gmail.com>. Licensed under MIT */require=_bb$iter=function(r,e){var t={};function n(e){if(!t.hasOwnProperty(e)){var f={exports:{}},i=r[e][0],u=r[e][1];t[e]=f.exports,i((a=u,function(r){var e=a[r];if(o(e))return n(e);for(var t=n.next;t;t=t.next)if(t.has(e))return t.get(e);for(var f=n.prev;f;f=f.prev)if(f.has(e))return f.get(e);throw new Error("Module '"+r+"' with id "+e+" was not found")}),f,f.exports),t[e]=f.exports}var a;return t[e]}function o(e){return r[e]}if(n.get=n,n.has=o,n.next="undefined"==typeof _bb$iter?null:_bb$iter,e.length)for(var f=n,i=n.next;i;)i.prev=f,f=i,i=i.next;return e.forEach(n),n}({1:[function(r,e,t){console.log("hello world - content")},{}]},[1]);`);
      expect(actual).toEqual(expected);
    });

    it("then the result has one module", async () => {
      await setup();
      expect(result.shards["main"].modules).toHaveLength(1);
    });
  });

  describe("when bundling a file content with two dependencies", function() {
    var result, content, filePath = path.join(process.cwd(), "test/sample/hello-world/");

    function setup () {
      content = `require("./hello");console.log(" == ");require("./world");`;
      return pakit({ content: content, path: filePath }, { log: false }).then(ctx => result = ctx);
    }

    it("then result has a 'main' shard", async () => {
      await setup();
      expect(result.shards).toHaveProperty("main");
    });

    it("then content of the 'main' shard with correct  value", async () => {
      await setup();
      const actual = removeToIndexOf(trimResult(result.shards["main"].content), "Miguel Castillo <manchagnu@gmail.com>");
      const expected = escapeChars(`Miguel Castillo <manchagnu@gmail.com>. Licensed under MIT */require=_bb$iter=function(e,t){var o={};function n(t){if(!o.hasOwnProperty(t)){var l={exports:{}},s=e[t][0],i=e[t][1];o[t]=l.exports,s((u=i,function(e){var t=u[e];if(r(t))return n(t);for(var o=n.next;o;o=o.next)if(o.has(t))return o.get(t);for(var l=n.prev;l;l=l.prev)if(l.has(t))return l.get(t);throw new Error("Module '"+e+"' with id "+t+" was not found")}),l,l.exports),o[t]=l.exports}var u;return o[t]}function r(t){return e[t]}if(n.get=n,n.has=r,n.next="undefined"==typeof _bb$iter?null:_bb$iter,t.length)for(var l=n,s=n.next;s;)s.prev=l,l=s,s=s.next;return t.forEach(n),n}({1:[function(e,t,o){e("./hello"),console.log(" == "),e("./world")},{"./hello":2,"./world":3}],2:[function(e,t,o){"use strict";e("./hello.css"),e("./hello.json"),console.log("hello")},{"./hello.css":4,"./hello.json":5}],3:[function(e,t,o){"use strict";console.log("world")},{}],4:[function(e,t,o){e("$bit-loader-css/loadstyle")(".hello {\n  color: blue;\n}\n")},{"$bit-loader-css/loadstyle":6}],5:[function(e,t,o){t.exports={hello:"json"}},{}],6:[function(e,t,o){t.exports=function(e){var t=document.getElementsByTagName("head")[0],o=document.createElement("style");o.setAttribute("type","text/css"),o.innerHTML=e,t.appendChild(o)}},{}]},[1]);`);
      expect(actual).toEqual(expected);
    });

    it("then the result has 6 module", async () => {
      await setup();
      expect(result.shards["main"].modules).toHaveLength(6);
    });
  });
});

function trimResult(data) {
  return data
    .toString()
    .replace(/\n/g, "")
    .replace(/\/\/# sourceMappingURL=.*/, "");
}

function removeToIndexOf(str, pattern) {
  return str.substr(str.indexOf(pattern));
}

function escapeChars(str) {
  return str.replace(/\n/g, "\\n");
}
