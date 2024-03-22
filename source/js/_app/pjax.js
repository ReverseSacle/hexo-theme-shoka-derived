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

const recent_comment_create = function(comments) {
  var len = comments.length;
  if(0 == len){ return; }

  var getDate = function(timestamp) {
    var date = new Date(timestamp);
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    month = month < 10 ? '0' + month : month;
    day = day < 10 ? '0' + day : day;
    return year + '-' + month + '-' + day;
  };
  var getText = function(new_text) {
    new_text = new_text.replace(/\n/g, '');
    var place_text = '';
    var text_size = 100;
    var len = new_text.length;
    var smallest = [
      'r','g','t','j',
      'f','i','v','y',
      'x','z',',','.',
      '!',';',':','"',
      '(',')','-',' '
    ];
    var regex = /[a-z]/;
    var regex2 = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/;
    var regex3 = /[A-Z]/;

    for(var i = 0,count = 0;i < len;)
    {
      if('<' == new_text[i])
      { 
        while(i < len && '>' != new_text[i++]);
        continue;
      }
      if(count >= text_size)
      {
        if(i < len){ place_text += '...'; }
        break; 
      }
      var c = new_text[i++];
      if(c in smallest){ count += 1; }
      else if(regex.test(c) || regex2.test(c)){ count += 2; }
      else if(regex3.test(c)){ count += 2.5; }
      else{ count += 3.5; }
      
      place_text += c;
    }
  
    return place_text;
  };
  var waline_recent = document.getElementById('waline-recent');
  var i = 0;
  var li_label = document.createElement('li');
  li_label.setAttribute('class','item');
  
  var a_label = document.createElement('a');
  a_label.setAttribute('href',comments[i].url);
  a_label.setAttribute('data-pjax-state','');

  var breadcrumb_label = document.createElement('span');
  breadcrumb_label.style.marginBottom = '-5.3px';
  breadcrumb_label.innerText = comments[i].nick + ' @ ' + getDate(comments[i].time);

  var text_span = document.createElement('span');
  text_span.innerText = getText(comments[i].comment);

  a_label.appendChild(breadcrumb_label);
  a_label.appendChild(text_span);
  li_label.appendChild(a_label);
  waline_recent.append(li_label);

  for(++i;i < len;++i)
  {
    var new_li_label = li_label.cloneNode(false);
    var new_a_label = a_label.cloneNode(false);
    new_a_label.setAttribute('href',comments[i].url);

    var new_breadcrumb_label = breadcrumb_label.cloneNode(false);
    new_breadcrumb_label.innerText = comments[i].nick + ' @ ' + getDate(comments[i].time);

    var new_text_span = text_span.cloneNode(false);
    new_text_span.innerText = getText(comments[i].comment);

    new_a_label.appendChild(new_breadcrumb_label);
    new_a_label.appendChild(new_text_span);
    new_li_label.appendChild(new_a_label);
    waline_recent.append(new_li_label);
  }
};

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
      var old_script = document.querySelector('body script' + '.' + name);
      if(undefined != old_script){
        document.body.removeChild(old_script);
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
          var parent_label = waline_recent.parentNode;

          parent_label.removeChild(waline_recent);
          parent_label.appendChild(waline_recent.cloneNode(false));
        }

        Waline.RecentComments({
          serverURL: options.serverURL,
          count: 10,
        }).then(({ comments }) => { recent_comment_create(comments.data); });

        if(undefined != document.getElementById('waline-comment'))
        {
          Waline.init(options);
          setTimeout(function(){
            positionInit(1);
            postFancybox('#waline-comment');
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
