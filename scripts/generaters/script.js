'use strict';
const fs = require('hexo-fs');
const url = require('url');

// function(locals)
hexo.extend.generator.register('script', function(_) {
  const config = hexo.config;
  const theme = hexo.theme.config;

  var env = require('../../package.json')

  var siteConfig = {
    version: env['version'],
    hostname: config.url,
    root: config.root,
    statics: theme.statics,
    inner_proxy: theme.inner_proxy,
    plugin_proxy: theme.plugin_proxy,
    favicon: {
      normal: theme.images + "/favicon.ico",
      hidden: theme.images + "/failure.ico"
    },
    darkmode: theme.darkmode,
    auto_scroll: theme.auto_scroll,
    js: {
      valine: theme.vendors.js.valine,
      chart: theme.vendors.js.chart,
      copy_tex: theme.vendors.js.copy_tex,
      fancybox: theme.vendors.js.fancybox
    },
    css: {
      valine: theme.css + "/comment.css",
      katex: theme.vendors.css.katex,
      fancybox: theme.vendors.css.fancybox
    },
    loader: theme.loader,
    search : null,
    valine: theme.valine,
    quicklink: {
      timeout : theme.quicklink.timeout,
      priority: theme.quicklink.priority
    }
  };

  if(config.algolia) {
    siteConfig.search = {
      appID    : config.algolia.appId,
      apiKey   : config.algolia.apiKey,
      indexName: config.algolia.indexName,
      hits     : theme.search.hits
    };
  }

  var text = '';

  ['utils', 'dom', 'global', 'sidebar', 'page', 'pjax'].forEach(function(item) {
    text += fs.readFileSync('themes/shoka/source/js/_app/'+item+'.js').toString();
  });

  text = 'var CONFIG = ' + JSON.stringify(siteConfig) + ';' + text;

  return {
      path: theme.js + '/app.js',
      data: function() {
        return hexo.render.renderSync({text:  text, engine: 'js'});
      }
    };
});
