# hexo-theme-shoka-derived

[简体中文](./README.md) | [English](./README_en.md)

## 使用方法

1. hexo根目录中克隆这个仓库

   ```bash
   # cd your_blog_root_path
   git clone https://github.com/ReverseSacle/hexo-theme-shoka-derived.git ./themes/shoka
   ```

2. 确保已进入到hexo根目录，打开`_config.yml`文件，修改`theme`的值为`shoka`

3. 安装必要的插件

   ```bash
   # hexo-renderer-multi-markdown-it
   npm uninstall hexo-renderer-marked --save
   npm install https://github.com/ReverseSacle/hexo-renderer-multi-markdown-it.git --save
   
   # hexo-autoprefixer
   npm install hexo-autoprefixer --save
   
   # hexo-algoliasearch
   npm install hexo-algoliasearch --save
   
   # hexo-symbols-count-time
   npm install hexo-symbols-count-time --save
   
   # hexo-feed
   npm install hexo-feed --save-dev
   ```

4. 进入到hexo根目录，打开`_config.yml`文件，添加下面内容到文件末尾

   ```yaml
   # markdown
   markdown:
     render: # Render setting
       html: false # Filter HTML lable
       xhtmlOut: true # Use '/' to close the sigle lable(<br />)
       breaks: true # Change the '\n' in text to <br>
       linkify: true # Change the text form of link to real link
       typographer: 
       quotes: '“”‘’'
     plugins: # markdown-it plugins setting
       - plugin:
           name: markdown-it-toc-and-anchor
           enable: true
           options: # No need to change the below setting, it is default
             tocClassName: 'toc'
             anchorClassName: 'anchor'
       - plugin:
           name: markdown-it-multimd-table
           enable: true
           options:
             multiline: true
             rowspan: true
             headerless: true
       - plugin:
           name: ./markdown-it-furigana
           enable: true
           options:
             fallbackParens: "()"
       - plugin:
           name: ./markdown-it-spoiler
           enable: true
           options:
             title: "You Know too much"
     
   # autoprefixer
   autoprefixer:
     exclude:
       - '*.min.css'
   
   # algolia
   algolia:
     appId: # Your appId
     apiKey: # Your apiKey
     adminApiKey: # Your adminApiKey
     chunkSize: 5000
     indexName: #"shoka"
     fields:
       - title # default
       - path # default
       - categories # Optional setting
       - content:strip:truncate,0,2000
       - gallery
       - photos
       - tags
       
   # feed
   feed:
       limit: 20
       order_by: "-date"
       tag_dir: false
       category_dir: false
       rss:
           enable: true
           template: "themes/shoka/layout/_alternate/rss.ejs"
           output: "rss.xml"
       atom:
           enable: true
           template: "themes/shoka/layout/_alternate/atom.ejs"
           output: "atom.xml"
       jsonFeed:
           enable: true
           template: "themes/shoka/layout/_alternate/json.ejs"
           output: "feed.json"
   ```

## 可选插件

使用`Gulp`来压缩JS, CSS 和 HTML。

```bash
# install gulp
npm install --global gulp-cli
npm install gulp --save-dev

# install gulp plugins
npm install gulp-clean-css gulp-html-minifier-terser gulp-htmlclean gulp-terser --save-dev
```

进入到`hexo`根目录，新建一个名为`gulpfile.js`的文件，打开该文件并添加下面内容。

(通常的使用命令 - `hexo clean && hexo g && gulp`)

```javascript
// Dependience
const gulp = require('gulp');
const cleanCSS = require('gulp-clean-css');
const htmlmin = require('gulp-html-minifier-terser');
const htmlclean = require('gulp-htmlclean');
const terser = require('gulp-terser');

// Compress js
gulp.task('compress', async() =>{
	return gulp.src(['./public/**/*.js', '!./public/**/*.min.js'])
	  .pipe(terser())
	  .pipe(gulp.dest('./public'));
});

// Compress css
gulp.task('minify-css', () => {
	return gulp.src(['./public/**/*.css'])
	  .pipe(cleanCSS())
      .pipe(gulp.dest('./public'));
});

// Compress html
gulp.task('minify-html', () => {
    return gulp.src('./public/**/*.html','!./public/**/json.ejs','!./public/**/atom.ejs','!./public/**/rss.ejs')
		.pipe(htmlclean())
		.pipe(htmlmin({
			removeComments: true,
			collapseWhitespace: true,
			collapseBooleanAttributes: true,
			removeEmptyAttributes: true,
			removeScriptTypeAttributes: true,
			removeStyleLinkTypeAttributes: true,
			removeAttributeQuotes: true,
			removeCDATASectionsFromCDATA: true,
			caseSensitive: true,
			minifyJS: true,
			minifyCSS: true,
			minifyURLs: true
		}))
		.pipe(gulp.dest('./public'));
});

// Task command for using gulp command
gulp.task('default', gulp.parallel(
  'compress','minify-css', 'minify-html'
));
```

## 已修改的内容

+ 删除`SEO`插件
+ 删除`Mermaid`插件
+ 删除`media`插件
+ 删除`fireworks`效果
+ 移除网址副标题
+ 修正主题的代码逻辑
+ 移除头像模糊效果，修改头像的`CSS`样式
+ 将主题的`statics`参数拆分为三部分
  + `statics` - 博客静态部署链接，主要用于html, js and css
  + `inner_proxy` - 文章/翻转卡片封面以及`.ico`文件的反向代理链接
  + `plugin_proxy` - 主题插件的反向代理链接
+ 修改滚动条的配色
+ 修改页面中头像区域顶部以及底部的菜单css样式
+ 修正HTML标签属性
+ 修正CSS样式属性
+ 添加超链接(`Hyperlink`)标签的CSS样式，修改`collapse`(折叠块)超链接的CSS样式
+ 修正ul标签下的li标签的CSS样式
+ 调整主题字体间距
+ 评论系统从valine迁移到waline
