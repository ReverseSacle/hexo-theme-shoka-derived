'use strict';

const nunjucks = require('nunjucks');
const path = require('path');

// data => {}
const pangu = { spacing: function(data) { return data; } };

function njkCompile(data) {
  const templateDir = path.dirname(data.path);
  const env = nunjucks.configure(templateDir, {
    autoescape: false,
    throwOnUndefined: false,
    trimBlocks: false,
    lstripBlocks: false
  });
  // dictionary => {}
  env.addFilter('safedump', function(dictionary) {
    if (typeof dictionary !== 'undefined' && dictionary !== null) {
      return JSON.stringify(dictionary);
    }
    return '""';
  });

  // dictionary => {}
  env.addFilter('pangu', function(dictionary) {
    if (typeof dictionary !== 'undefined' && dictionary !== null) {
      return pangu.spacing(dictionary);
    }
    return '""';
  });

  return nunjucks.compile(data.text, env, data.path);
};

function njkRenderer(data, locals) {
  return njkCompile(data).render(locals);
};

// Return a compiled renderer.
njkRenderer.compile = function(data) {
  const compiledTemplate = njkCompile(data);
  // Need a closure to keep the compiled template.
  return function(locals) {
    return compiledTemplate.render(locals);
  };
};

hexo.extend.renderer.register('njk', 'html', njkRenderer);
