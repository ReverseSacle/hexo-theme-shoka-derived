'use strict';

var fs = require('hexo-fs');

// (categories, parent) => {}
const prepareQuery = function(categories, parent) {
  const query = {};

  if (parent) { query.parent = parent; } 
  else { query.parent = {$exists: false}; }

  // cat => {}
  return categories.find(query).sort('name', 1).filter(function(cat) { return cat.length; });
};

hexo.extend.helper.register('_list_categories', function(depth = 0) {
  let hexo = this;
  let categories = hexo.site.categories;

  if (!categories || !categories.length) return '';

  // (level, parent) => {}
  const hierarchicalList = function(level, parent) {
    let result = '';

    // (cat, i) => {}
    prepareQuery(categories, parent).forEach(function(cat) {
      let child;

      if (level + 1 < depth) {
        child = hierarchicalList(level + 1, cat._id);
      }

      let catname = `<a itemprop="url" href="${hexo.url_for(cat.path)}">${cat.name}</a><small>( ${cat.length} )</small>`;

      switch(level) {
        case 0:
          result += `<div><h2 class="item header">${catname}</h2>`;
          break;
        case 1:
          result += `<h3 class="item section">${catname}</h3>`;
          break;
        case 2:
          result += `<div class="item normal"><div class="title">${catname}</div></div>`;
          break;
      }

      if (child) { result += `${child}`; }
      if(level === 0) { result += '</div>'; }
    });

    return result;
  };

  return hierarchicalList(0);
});

hexo.extend.helper.register('_categories', function() {
  let hexo = this;
  let categories = hexo.site.categories;
  if (!categories || !categories.length) return '';

  // data => {}
  var pangu = { spacing: function(data) { return data; } };
  let result = {};

  // (cat, i) => {}
  categories.forEach(function(cat) {
    let child = prepareQuery(categories, cat._id);
    let cover = 'source/_posts' + cat.path.replace(hexo.config.category_dir, '') + 'cover.jpg'

    if (fs.existsSync(cover)) {
      let className = cat.slug.split('/');
      className.pop();
      cat.class = className.join(' ');
      cat.name = pangu.spacing(cat.name);

      if (child.length != 0) { cat.child = child; }

      result[cat._id] = cat;
    }
  })

  return result;
});

hexo.extend.helper.register('_category_prev', function(name) {
  let hexo = this;
  let categories = hexo.site.categories;
  if (!categories || !categories.length) return '';

  let result = '';

  // (current) => {}
  categories.find({name}).forEach(function(current) {
    if(current.parent) {
      // (cat, i) => {}
      categories.find({_id: current.parent}).forEach(function(cat) {
        result += `<a href="${hexo.url_for(cat.path)}">${cat.name}</a>`;
      })
    }
  })

  return result;
});

hexo.extend.helper.register('_category_posts', function(page) {
  let hexo = this;
  let categories = hexo.site.categories;
  if (!categories || !categories.length || !page.categories || !page.categories.length) return '';

  let result = '';
  let cat = page.categories.toArray();

  // (category) => {}
  categories.find({_id: cat[cat.length - 1]._id}).forEach(function(category) {

    if(category.posts) {
      // (post) => {}
      category.posts.sort('date', 1).forEach(function(post) {
        var current = '';
        if(post.path == page.path) { current = ' class="active"'; }
        result += `<li${current}><a href="${hexo.url_for(post.path)}" rel="bookmark" title="${post.title}">${post.title}</a></li>`;
      })
    }
  })

  return result;
});
