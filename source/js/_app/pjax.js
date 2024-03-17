const domInit = function() {
  $.each('.overview .menu > .item', function(el) {
    siteNav.child('.menu').appendChild(el.cloneNode(true));
  });

  loadCat.addEventListener('click', Loader.vanish);
  menuToggle.addEventListener('click', sideBarToggleHandle);
  $('.dimmer').addEventListener('click', sideBarToggleHandle);

  quickBtn.child('.down').addEventListener('click', goToBottomHandle);
  quickBtn.child('.up').addEventListener('click', backToTopHandle);
  if(!toolBtn) {
    toolBtn = siteHeader.createChild('div', {
      id: 'tool',
      innerHTML: '<div class="item contents"><i class="ic i-list-ol"></i></div><div class="item chat"><i class="ic i-comments"></i></div><div class="item back-to-top"><i class="ic i-arrow-up"></i><span>0%</span></div>'
    });
  }

  backToTop = toolBtn.child('.back-to-top');
  goToComment = toolBtn.child('.chat');
  showContents = toolBtn.child('.contents');

  backToTop.addEventListener('click', backToTopHandle);
  goToComment.addEventListener('click', goToCommentHandle);
  showContents.addEventListener('click', sideBarToggleHandle);
};

const pjaxReload = function() {
  pagePosition();

  if(sideBar.hasClass('on')) {
    transition(sideBar, function() {
        sideBar.removeClass('on');
        menuToggle.removeClass('close');
      }); // 'transition.slideRightOut'
  }

  $('#main').innerHTML = '';
  $('#main').appendChild(loadCat.lastChild.cloneNode(true));
  pageScroll(0);
};

const recent_comment_create = function(data) {
  var waline_recent = document.getElementById('waline-recent');
  var li_label = document.createElement('li');
  li_label.setAttribute('class','item');
  
  var a_label = document.createElement('a');
  a_label.setAttribute('href',data.url);
  a_label.setAttribute('data-pjax-state','');

  var breadcrumb_label = document.createElement('span');
  var date = new Date(data.time);
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  month = month < 10 ? '0' + month : month;
  day = day < 10 ? '0' + day : day;
  breadcrumb_label.innerText = data.nick + ' @ ' + year + '-' + month + '-' + day;

  var text_span = document.createElement('span');
  var new_text = data.comment.replace('<p>','').replace('</p>','').replace('<br>','');
  var place_text = '';
  var text_size = 27;

  var len = new_text.length;
  for(var i = 0;i < len;++i)
  {
    while('<' == new_text[i]){ while(i < len && '>' != new_text[i++]); }
    if(i >= len || place_text.length >= text_size){ break; }
    place_text += new_text[i];
  }

  if(new_text.length > text_size) { place_text += '...'; }
  text_span.innerText = place_text;

  a_label.appendChild(breadcrumb_label);
  a_label.appendChild(text_span);
  li_label.appendChild(a_label);
  waline_recent.append(li_label);
}

const siteRefresh = function(reload) {
  LOCAL_HASH = 0;
  LOCAL_URL = window.location.href;

  vendorCss('katex');
  vendorJs('copy_tex');
  vendorJs('chart');

  if(CONFIG.waline.serverURL)
  {
    vendorCss_body('waline');
    var getScript = function(options) {
      var name = 'script-waline';
      var old_script = document.getElementsByClassName(name)[0];
      if(undefined != old_script){
        var body_label = document.body;
        body_label.removeChild(old_script);
      }

      var script = document.createElement('script');
      script.defer = true;
      script.crossOrigin = 'anonymous';
      script.setAttribute('class','script-waline');
      Object.keys(options).forEach(function(key) {
          script[key] = options[key];
      });
      document.body.appendChild(script);
    };

    getScript({
      src: assetUrl('js','waline'),
      onload: function() {
        var waline_recent = document.getElementById('waline-recent');
        var options = Object.assign({}, CONFIG.waline);
        options = Object.assign(options, LOCAL.waline||{});
        options.el = '#waline-comment';
  
        if(waline_recent.hasChildNodes())
        {
          var footer_label = document.getElementById('footer');
          var inner = footer_label.getElementsByClassName('widgets')[0];
          var last_child = inner.lastElementChild;
          var waline_recent_old = last_child.lastElementChild;
          last_child.removeChild(waline_recent_old);

          var new_waline_recent = document.createElement('ul');
          new_waline_recent.setAttribute('id','waline-recent');

          last_child.appendChild(new_waline_recent);
        }

        Waline.RecentComments({
          serverURL: options.serverURL,
          count: 10,
        }).then(({ comments }) => {
          comments.data.forEach(function(data){
            recent_comment_create(data);
          });
        });

        if(undefined != document.getElementById('waline-comment'))
        {
          Waline.init(options);
          setTimeout(function(){
            positionInit(1);
            postFancybox('.v');
          }, 1000);
        }
      }
    });
  }

  if(!reload) { $.each('script[data-pjax]', pjaxScript); }

  originTitle = document.title;

  resizeHandle();

  menuActive();

  sideBarTab();
  sidebarTOC();

  registerExtURL();
  postBeauty();
  tabFormat();

  Loader.hide();

  setTimeout(function(){
    positionInit();
  }, 500);

  cardActive();

  lazyload.observe();
};

const siteInit = function() {
  domInit();

  pjax = new Pjax({
            selectors: [
              'head title',
              '.languages',
              '.pjax',
              'script[data-config]'
            ],
            analytics: false,
            cacheBust: false
          });

  CONFIG.quicklink.ignores = LOCAL.ignores;
  quicklink.listen(CONFIG.quicklink);

  visibilityListener();
  themeColorListener();

  algoliaSearch(pjax);

  window.addEventListener('scroll', scrollHandle);
  window.addEventListener('resize', resizeHandle);
  window.addEventListener('pjax:send', pjaxReload);
  window.addEventListener('pjax:success', siteRefresh);
  window.addEventListener('beforeunload', function() {
    pagePosition();
  });
  siteRefresh(1);
};

window.addEventListener('DOMContentLoaded', siteInit);
console.log('%c Theme.Shoka.Derived v' + CONFIG.version + ' ', 'color: white; background: #e9546b; padding:5px 0;');
