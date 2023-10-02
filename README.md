# hexo-theme-shoka-derived
## Usage

1. Clone this repository.

   ```bash
   # cd your_blog_root_path
   git clone https://github.com/ReverseSacle/hexo-theme-shoka-derived.git ./themes/shoka
   ```

2. Be sure you are in the root of hexo dir，open file `_config.yml`，change the value of  the variable `theme` to `shoka`.  

3. Install the necessary plugins.

   ```bash
   # hexo-renderer-multi-markdown-it
   npm uninsatll hexo-renderer-marked --save
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

4. In the root of hexo dir, open file `_config.yml`，add following content to the end of file.

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

(**Optional**)Using Gulp for cleaning Js, CSS and HTML.

```bash
# install gulp
npm install gulp --save-dev

# install gulp plugins
npm install gulp-clean-css gulp-html-minifier-terser gulp-htmlclean gulp-terser --save-dev
```

Move to your hexo root dir, and create a new file named `gulp.js`，add following content.

```javascript
// Dependience
var gulp = require('gulp');
var cleanCSS = require('gulp-clean-css');
var htmlmin = require('gulp-html-minifier-terser');
var htmlclean = require('gulp-htmlclean');
var terser = require('gulp-terser');

// Compress js
gulp.task('compress', () =>
  gulp.src(['./public/**/*.js', '!./public/**/*.min.js'])
    .pipe(terser())
    .pipe(gulp.dest('./public'))
);

// Compress css
gulp.task('minify-css', () => {
    return gulp.src(['./public/**/*.css'])
        .pipe(cleanCSS({
            compatibility: 'ie11'
        }))
        .pipe(gulp.dest('./public'));
});

// Compress html
gulp.task('minify-html', () => {
    return gulp.src('./public/**/*.html','!./public/**/json.ejs','!./public/**/atom.ejs','!./public/**/rss.ejs')
        .pipe(htmlclean())
        .pipe(htmlmin({
            removeComments: true, // Delete html comments
            collapseWhitespace: true, // Compress html
            collapseBooleanAttributes: true,
            // Ignore the value of bool type, 
            // example：<input checked="true"/> ==> <input />
            removeEmptyAttributes: true,
            // Delete all the space value of attribute, 
            // example：<input id="" /> ==> <input />
            removeScriptTypeAttributes: true,
            // Delete the attribute type="text/javascript" in lable <script>
            removeStyleLinkTypeAttributes: true,
            // Delete the attribute type="text/css" in <style> and <link>
            minifyJS: true, // Compress JS
            minifyCSS: true, // Compress CSS
            minifyURLs: true  // Compress URL
        }))
        .pipe(gulp.dest('./public'))
});

// Task command for using gulp command
gulp.task('default', gulp.parallel(
  'compress', 'minify-css', 'minify-html'
));
```

## Modification

+ Delete `SEO` setting
+ Delete `Mermaid` plugin
+ Delete `media` plugin
+ Delete the `fireworks` effect
+ Remove the subtitle in the title
+ Code correct
