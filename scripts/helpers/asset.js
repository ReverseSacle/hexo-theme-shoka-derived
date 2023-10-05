/* global hexo */

'use strict';
const { htmlTag, url_for } = require('hexo-util');
const theme_env = require('../../package.json');

hexo.extend.helper.register('hexo_env', function(type) {
  return this.env[type];
});

hexo.extend.helper.register('theme_env', function(type) {
  return theme_env[type];
});

// Optional code for google font
/*
// () => {}
hexo.extend.helper.register('_vendor_font', function() {
  const config = hexo.theme.config.font;

  if (!config || !config.enable) return '';

  const fontDisplay = '&display=swap';
  const fontSubset = '&subset=latin,latin-ext';
  const fontStyles = ':300,300italic,400,400italic,700,700italic';
  const fontHost = '//fonts.googleapis.com';

  //Get a font list from config
  // item => {}
  let fontFamilies = ['global', 'logo', 'title', 'headings', 'posts', 'codes'].map(function(item) {
    if (config[item] && config[item].family && config[item].external) {
      return config[item].family + fontStyles;
    }
    return '';
  });

  // item => {}
  fontFamilies = fontFamilies.filter(function(item) { item !== ''; });
  fontFamilies = [...new Set(fontFamilies)];
  fontFamilies = fontFamilies.join('|');

  // Merge extra parameters to the final processed font string
  return fontFamilies ? htmlTag('link', { rel: 'stylesheet', href: `${fontHost}/css?family=${fontFamilies.concat(fontDisplay, fontSubset)}` }) : '';
});
*/

// () =>
hexo.extend.helper.register('_vendor_js', function() {
  const all_config = hexo.theme.config;
  const config = all_config.vendors.js;
  if (!config){ return ''; }

  //Get a font list from config
  var Js_mix = [];
  var jsdelivr_url = "";
  
  ['pace', 'pjax', 'anime', 'algolia', 'instantsearch', 'lazyload', 'quicklink'].forEach(function(item) {
    let url_path = config[item];
    if(url_path.length)
    {
      if(-1 == url_path.indexOf("npm")){ Js_mix.push(url_path); }
      else{ jsdelivr_url += jsdelivr_url ? ("," + url_path) : url_path; }
    }
  });

  if(jsdelivr_url.length)
  {
    const proxy = all_config.plugin_proxy;

    if("/" != proxy && -1 == proxy.indexOf("/")){
      Js_mix.push("//" + proxy + '/' + jsdelivr_url);
    }
    else{ Js_mix.push("https://cdn.jsdelivr.net/combine/" + jsdelivr_url); }
  }

  return Js_mix.map(function(url) {
      return htmlTag('script', { src: `${url}` }, '');
  }).join('');
});

hexo.extend.helper.register('_css', function(...urls) {
  const { statics, css } = hexo.theme.config;

  // url => {}，`.bind(this)` will make outer `this` binded in inner.
  return urls.map(function(url) { 
    return htmlTag('link', { rel: 'stylesheet', href: url_for.call(this, `${statics}${css}/${url}?v=${theme_env['version']}`) });
  }.bind(this)).join('');
});


hexo.extend.helper.register('_js', function(...urls) {
  const { statics, js } = hexo.theme.config;

  // url => {}
  return urls.map(function(url) { 
    return htmlTag('script', { src: url_for.call(this, `${statics}${js}/${url}?v=${theme_env['version']}`) }, '');
  }.bind(this)).join('');
});
