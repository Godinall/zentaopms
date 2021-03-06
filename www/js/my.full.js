/**
 * Load css file of special browser.
 * 
 * @access public
 * @return void
 */
function loadFixedCSS()
{
    cssFile = '';
    if($.browser.msie )
    {
        cssFile = $.browser.version == '6.0' ? config.themeRoot + '/browser/ie.6.css' : config.themeRoot + 'browser/ie.css';
    }
    else if($.browser.mozilla) 
    {
        cssFile = config.themeRoot + '/browser/firefox.css';
    }
    else if($.browser.opera) 
    {
        cssFile = config.themeRoot + '/browser/opera.css';
    }
    else if($.browser.safari) 
    {
        cssFile = config.themeRoot + '/browser/safari.css';
    }
    else if($.browser.chrome) 
    {
        cssFile = config.themeRoot + '/browser/chrome.css';
    }

    if(cssFile != '')
    {
        /* Thanks ekerner, please visit ekerner.com. The code is from: 
         * http://stackoverflow.com/questions/1184950/dynamically-loading-css-stylesheet-doesnt-work-on-ie. 
         */
        $("<link>").appendTo($('head')).attr({type: 'text/css', rel: 'stylesheet'}).attr('href', cssFile);
    }
}

/**
 * Create link. 
 * 
 * @param  string $moduleName 
 * @param  string $methodName 
 * @param  string $vars 
 * @param  string $viewType 
 * @access public
 * @return string
 */
function createLink(moduleName, methodName, vars, viewType, isOnlyBody)
{
    if(!viewType)   viewType   = config.defaultView;
    if(!isOnlyBody) isOnlyBody = false;
    if(vars)
    {
        vars = vars.split('&');
        for(i = 0; i < vars.length; i ++) vars[i] = vars[i].split('=');
    }
    if(config.requestType == 'PATH_INFO')
    {
        link = config.webRoot + moduleName + config.requestFix + methodName;
        if(vars)
        {
            if(config.pathType == "full")
            {
                for(i = 0; i < vars.length; i ++) link += config.requestFix + vars[i][0] + config.requestFix + vars[i][1];
            }
            else
            {
                for(i = 0; i < vars.length; i ++) link += config.requestFix + vars[i][1];
            }
        }
        link += '.' + viewType;
    }
    else
    {
        link = config.router + '?' + config.moduleVar + '=' + moduleName + '&' + config.methodVar + '=' + methodName + '&' + config.viewVar + '=' + viewType;
        if(vars) for(i = 0; i < vars.length; i ++) link += '&' + vars[i][0] + '=' + vars[i][1];
    }

    /* if page has onlybody param then add this param in all link. the param hide header and footer. */
    if(onlybody == 'yes' || isOnlyBody)
    {
        var onlybody = config.requestType == 'PATH_INFO' ? "?onlybody=yes" : '&onlybody=yes';
        link = link + onlybody;
    }
    return link;
}

/**
 * Go to the view page of one object.
 * 
 * @access public
 * @return void
 */
function shortcut()
{
    objectType  = $('#searchType').attr('value');
    objectValue = $('#searchQuery').attr('value');
    if(objectType && objectValue)
    {
        location.href=createLink(objectType, 'view', "id=" + objectValue);
    }
}

/**
 * Show drop menu. 
 * 
 * @param  string $objectType product|project
 * @param  int    $objectID 
 * @param  string $module 
 * @param  string $method 
 * @param  string $extra 
 * @access public
 * @return void
 */
var showMenu = 0; //Showing or hiding drop menu.
function showDropMenu(objectType, objectID, module, method, extra)
{
    if(showMenu == 1) { showMenu = 0; return $("#dropMenu").hide();};
    $('#wrap').click(function(){showMenu = 0; return $("#dropMenu").hide();});

    $.get(createLink(objectType, 'ajaxGetDropMenu', "objectID=" + objectID + "&module=" + module + "&method=" + method + "&extra=" + extra), function(data){ $('#dropMenu').html(data);});
    var offset = $('#currentItem').offset();
    $("#dropMenu").css({ top:offset.top + $('#currentItem').height() + "px", left:offset.left });
    $("#dropMenu").show('fast', function(){$("#dropMenu #search").focus();});
    showMenu = 1;
}

/**
 * Show drop result. 
 * 
 * @param  objectType $objectType 
 * @param  objectID $objectID 
 * @param  module $module 
 * @param  method $method 
 * @param  extra $extra 
 * @access public
 * @return void
 */
function showDropResult(objectType, objectID, module, method, extra)
{
    $('#resultList').load(createLink(objectType, 'ajaxGetDropMenu', "objectID=" + objectID + "&module=" + module + "&method=" + method + "&extra=" + extra) + ' #searchResult');
}

/**
 * Search items. 
 * 
 * @param  string $keywords 
 * @param  string $objectType 
 * @param  int    $objectID 
 * @param  string $module 
 * @param  string $method 
 * @param  string $extra 
 * @access public
 * @return void
 */
function searchItems(keywords, objectType, objectID, module, method, extra)
{
    if(keywords == '')
    {
        showMenu = 0;
        showDropResult(objectType, objectID, module, method, extra);
        setTimeout(function(){$("#dropMenu #search").focus();}, 300);
    }
    else
    {
        keywords = encodeURI(keywords);
        if(keywords != '-') $.get(createLink(objectType, 'ajaxGetMatchedItems', "keywords=" + keywords + "&module=" + module + "&method=" + method + "&extra=" + extra), function(data){$('#searchResult').html(data);});
    }
}

/**
 * Show or hide more items. 
 * 
 * @access public
 * @return void
 */
function switchMore()
{
    $('#moreMenu').css('width', $('#defaultMenu').width());
    $('#moreMenu').toggle();
    $('#search').focus();
}

/**
 * Switch doc library.
 * 
 * @param  int    $libID 
 * @param  string $module 
 * @param  string $method 
 * @param  string $extra 
 * @access public
 * @return void
 */
function switchDocLib(libID, module, method, extra)
{
    if(module == 'doc')
    {
        if(method != 'view' && method != 'edit')
        {
            link = createLink(module, method, "rootID=" + libID);
        }
        else
        {
            link = createLink('doc', 'browse');
        }
    }
    else if(module == 'tree')
    {
        link = createLink(module, method, "rootID=" + libID + '&type=' + extra);
    }
    location.href=link;
}

/**
 * Set the ping url.
 * 
 * @access public
 * @return void
 */
function setPing()
{
    $('#hiddenwin').attr('src', createLink('misc', 'ping'));
}

/**
 * Set required fields, add star class to them.
 * 
 * @access public
 * @return void
 */
function setRequiredFields()
{
    if(!config.requiredFields) return false;
    requiredFields = config.requiredFields.split(',');
    for(i = 0; i < requiredFields.length; i++)
    {
        $('#' + requiredFields[i]).after('<span class="star"> * </span>');
    }
}

/**
 * Set the help links of forum's items.
 * 
 * @access public
 * @return void
 */
function setHelpLink()
{
    if(!$.cookie('help')) $.cookie('help', 'off', {expires:config.cookieLife, path:config.webRoot});
    className = $.cookie('help') == 'off' ? 'hidden' : '';

    $('form input[id], form select[id], form textarea[id]').each(function()
    {
        if($(this).attr('type') == 'hidden' || $(this).attr('type') == 'file') return;
        currentFieldName = $(this).attr('name') ? $(this).attr('name') : $(this).attr('id');
        if(currentFieldName == 'submit' || currentFieldName == 'reset') return;
        if(currentFieldName.indexOf('[') > 0) currentFieldName = currentFieldName.substr(0, currentFieldName.indexOf('['));
        currentFieldName = currentFieldName.toLowerCase();
        helpLink = createLink('help', 'field', 'module=' + config.currentModule + '&method=' + config.currentMethod + '&field=' + currentFieldName);
        $(this).after(' <a class="helplink ' + className + '" href=' + helpLink + ' target="_blank">?</a> ');
    });

    if($('a.helplink').size()) $("a.helplink").colorbox({width:600, height:240, iframe:true, transition:'none', scrolling:false});
}

/**
 * Set paceholder. 
 * 
 * @access public
 * @return void
 */
function setPlaceholder()
{
    if(typeof(holders) != "undefined")
    {
        for(var key in holders)
        {
            if($('#' + key).prop('tagName') == 'INPUT')
            {
                $("#" + key).attr('placeholder', holders[key]);
            }
            else
            {
                $("#" + key).parent().append(holders[key]);
            }
        }
    }
}

/**
 * Toggle the help links.
 * 
 * @access public
 * @return void
 */
function toggleHelpLink()
{
    $('.helplink').toggle();
    if($.cookie('help') == 'off') return $.cookie('help', 'on',  {expires:config.cookieLife, path:config.webRoot});
    if($.cookie('help') == 'on')  return $.cookie('help', 'off', {expires:config.cookieLife, path:config.webRoot});
}

/**
 * Hide tree box 
 * 
 * @param  string $treeType 
 * @access public
 * @return void
 */
function hideTreeBox(treeType)
{
    $.cookie(treeType, 'hide', {expires:config.cookieLife, path:config.webRoot});
    $('.side').hide();
    $('.divider').hide();
    $('.treeSlider span').css("border-right", "0 none");
    $('.treeSlider span').css("border-left", "4px solid #000000");

}

/**
 * Show tree box 
 * 
 * @param  string $treeType 
 * @access public
 * @return void
 */
function showTreeBox(treeType)
{
    $.cookie(treeType, 'show', {expires:config.cookieLife, path:config.webRoot});
    $('.side').show();
    $('.divider').show();
    $('.treeSlider span').css("border-right", "4px solid #000000");
    $('.treeSlider span').css("border-left", "0 none");
}

/**
 * Toggle tree menu.
  
 * @access public
 * @return void
 */
function toggleTreeBox()
{
    var treeType = $('.treeSlider').attr('id');
    if(typeof treeType == 'undefined') return;
    if($.cookie(treeType) == 'hide') hideTreeBox(treeType);

    $('.treeSlider').toggle
    (
        function()
        {
            if($.cookie(treeType) == 'hide') return showTreeBox(treeType);
            hideTreeBox(treeType);
        }, 
        function()
        {
            if($.cookie(treeType) == 'show') return hideTreeBox(treeType);
            showTreeBox(treeType);
        }
    );
}

/**
 * Set language.
 * 
 * @access public
 * @return void
 */
function selectLang(lang)
{
    $.cookie('lang', lang, {expires:config.cookieLife, path:config.webRoot});
    location.href = removeAnchor(location.href);
}

/**
 * Set theme.
 * 
 * @access public
 * @return void
 */
function selectTheme(theme)
{
    $.cookie('theme', theme, {expires:config.cookieLife, path:config.webRoot});
    location.href = removeAnchor(location.href);
}

/**
 * Remove anchor from the url.
 * 
 * @param  string $url 
 * @access public
 * @return string
 */
function removeAnchor(url)
{
    pos = url.indexOf('#');
    if(pos > 0) return url.substring(0, pos);
    return url;
}

/**
 * Get the window size and save to cookie.
 * 
 * @access public
 * @return void
 */
function saveWindowSize()
{
    width  = $(window).width(); 
    height = $(window).height();
    $.cookie('windowWidth',  width)
    $.cookie('windowHeight', height)
}

/**
 * Set Outer box's width and height.
 * 
 * @access public
 * @return void
 */
function setOuterBox()
{
    var winWidth  = window.screen.width;
    var winHeight = $(window).height();
    var headerH   = $('#header').height();
    var navbarH   = $('#modulemenu').height();
    var footerH   = $('#footer').height() + 15;

    var outerH = winHeight - headerH - footerH - navbarH - 50;
    if ($.browser.msie && ($.browser.version == "6.0") && !$.support.style) outerH = winHeight - headerH - footerH - 98;
    if ($.browser.msie && ($.browser.version == "6.0")) $('.outer').css('height', outerH);
    $('.outer').css('min-height', outerH);

    if($.browser.msie && ($.browser.version == "6.0") && !$.support.style)
    {
        winWidth -= 49;
        $('#wrap').width(winWidth);
    }
}

/**
 * Set the about link. 
 * 
 * @access public
 * @return void
 */
function setAbout()
{
    if($('a.about').size()) $("a.about").colorbox({width:900, height:330, iframe:true, transition:'none', scrolling:false});
}

/**
 * Set QR Code. 
 * 
 * @access public
 * @return void
 */
function setQRCode()
{
    if($('a.qrCode').size()) $("a.qrCode").colorbox({width:400, height:400, iframe:true, transition:'none', scrolling:false});
}

/**
 * Set the css of the iframe.
 * 
 * @param  string $color 
 * @access public
 * @return void
 */
function setDebugWin(color)
{  
    if($.browser.msie && $('.debugwin').size() == 1)
    {
        var debugWin = $(".debugwin")[0].contentWindow.document;
        $("body", debugWin).append("<style>body{background:" + color + "}</style>");
    }
}

/**
 * Disable the submit button when submit form.
 * 
 * @access public
 * @return void
 */
function setForm()
{
    var formClicked = false;
    $('form').submit(function()
    {
        submitObj   = $(this).find(':submit');
        if($(submitObj).size() == 1)
        {
            submitLabel = $(submitObj).attr('value');
            $(submitObj).attr('disabled', 'disabled');
            $(submitObj).attr('value', config.submitting);
            $(submitObj).addClass('button-d');
            formClicked = true;
        }
    });

    $("body").click(function()
    {
        if(formClicked)
        {
            $(submitObj).removeAttr('disabled');
            $(submitObj).attr('value', submitLabel);
            $(submitObj).removeClass('button-d');
        }
        formClicked = false;
    });
}

/**
 * Set form action and submit.
 * 
 * @param  url    $actionLink 
 * @param  string $hiddenwin 'hiddenwin'
 * @access public
 * @return void
 */
function setFormAction(actionLink, hiddenwin)
{
  if(hiddenwin) $('form').attr('target', hiddenwin);
  $('form').attr('action', actionLink).submit();
}

/**
 * Set the max with of image.
 * 
 * @access public
 * @return void
 */
function setImageSize(image, maxWidth)
{
    /* If not set maxWidth, set it auto. */
    if(!maxWidth)
    {
        bodyWidth = $('body').width();
        maxWidth  = bodyWidth - 470; // The side bar's width is 336, and add some margins.
    }

    if($(image).width() > maxWidth) $(image).attr('width', maxWidth);
    $(image).wrap('<a href="' + $(image).attr('src') + '" target="_blank"></a>');
}

/**
 * Set the repo link.
 * 
 * @access public
 * @return void
 */
function setRepoLink()
{
    if($('.repolink').size()) $('.repolink').colorbox({width:960, height:600, iframe:true, transition:'elastic', speed:350, scrolling:true});
}

/* Set the colorbox of export. */
function setExport()
{
   if($('.export').size()) $(".export").colorbox({width:650, height:240, iframe:true, transition:'none', scrolling:true});
}

/**
 * Set mailto list from a contact list..
 * 
 * @param  string $mailto 
 * @param  int    $contactListID 
 * @access public
 * @return void
 */
function setMailto(mailto, contactListID)
{
    link = createLink('user', 'ajaxGetContactUsers', 'listID=' + contactListID);
    $.get(link, function(users)
    {
        $('#' + mailto).replaceWith(users);
        $('#' + mailto + '_chzn').remove();
        $('#' + mailto).chosen({no_results_text: noResultsMatch});
    });
}

/**
 * Set comment. 
 * 
 * @access public
 * @return void
 */
function setComment()
{
    $('#commentBox').toggle();
    $('.ke-container').css('width', '100%');
    setTimeout(function() { $('#commentBox textarea').focus(); }, 50);
}

/**
 * Auto checked the checkbox of a row. 
 * 
 * @access public
 * @return void
 */
function autoCheck()
{
    $('.tablesorter tr :checkbox').click(function(){clickInCheckbox = 1;});

    $('.tablesorter tr').click(function()
    {
        if(document.activeElement.type != 'select-one' && document.activeElement.type != 'text')
        {
            if(typeof(clickInCheckbox) != 'undefined' && clickInCheckbox == 1)
            {
                clickInCheckbox = 0;
            }
            else
            {
                if($(this).find(':checkbox').attr('checked'))
                {
                    $(this).find(':checkbox').attr('checked', false);
                }
                else
                {
                    $(this).find(':checkbox').attr('checked', true);
                }
            }
        }
    });
}

/**
 * Toogle the search form.
 * 
 * @access public
 * @return void
 */
function toggleSearch()
{
    $("#bysearchTab").toggle
    (
        function()
        {
            if(browseType == 'bymodule')
            {
                $('#treebox').addClass('hidden');
                $('.divider').addClass('hidden');
                $('#bymoduleTab').removeClass('active');
            }
            else
            {
                $('#' + browseType + 'Tab').removeClass('active');
            }
            $('#bysearchTab').addClass('active');
            ajaxGetSearchForm();
            $('#querybox').removeClass('hidden');
        },
        function()
        {
            if(browseType == 'bymodule')
            {
                $('#treebox').removeClass('hidden');
                $('.divider').removeClass('hidden');
                $('#bymoduleTab').addClass('active');
            }
            else
            {
                $('#' + browseType +'Tab').addClass('active');
            }
            $('#bysearchTab').removeClass('active');
            $('#querybox').addClass('hidden');
        } 
    );
}

/**
 * Ajax get search form 
 * 
 * @access public
 * @return void
 */
function ajaxGetSearchForm()
{
    if($('#querybox').html() == '')
    {
        $.get(createLink('search', 'buildForm'), function(data){
            $('#querybox').html(data);
        });
    }
}

/**
 * Hide the link of clearData.
 * 
 * @access public
 * @return void
 */
function hideClearDataLink()
{
    if(typeof showDemoUsers == 'undefined' || !showDemoUsers) $('#submenuclearData').addClass('hidden');
}

/**
 * add one option of a select to another select. 
 * 
 * @param  string $SelectID 
 * @param  string $TargetID 
 * @access public
 * @return void
 */
function addItem(SelectID,TargetID)
{
    ItemList = document.getElementById(SelectID);
    Target   = document.getElementById(TargetID);
    for(var x = 0; x < ItemList.length; x++)
    {
        var opt = ItemList.options[x];
        if (opt.selected)
        {
            flag = true;
            for (var y=0;y<Target.length;y++)
            {
                var myopt = Target.options[y];
                if (myopt.value == opt.value)
                {
                    flag = false;
                }
            }
            if(flag)
            {
                Target.options[Target.options.length] = new Option(opt.text, opt.value, 0, 0);
            }
        }
    }
}

/**
 * Remove one selected option from a select.
 * 
 * @param  string $SelectID 
 * @access public
 * @return void
 */
function delItem(SelectID)
{
    ItemList = document.getElementById(SelectID);
    for(var x=ItemList.length-1;x>=0;x--)
    {
        var opt = ItemList.options[x];
        if (opt.selected)
        {
            ItemList.options[x] = null;
        }
    }
}

/**
 * move one selected option up from a select. 
 * 
 * @param  string $SelectID 
 * @access public
 * @return void
 */
function upItem(SelectID)
{
    ItemList = document.getElementById(SelectID);
    for(var x=1;x<ItemList.length;x++)
    {
        var opt = ItemList.options[x];
        if(opt.selected)
        {
            tmpUpValue = ItemList.options[x-1].value;
            tmpUpText  = ItemList.options[x-1].text;
            ItemList.options[x-1].value = opt.value;
            ItemList.options[x-1].text  = opt.text;
            ItemList.options[x].value = tmpUpValue;
            ItemList.options[x].text  = tmpUpText;
            ItemList.options[x-1].selected = true;
            ItemList.options[x].selected = false;
            break;
        }
    }
}

/**
 * move one selected option down from a select. 
 * 
 * @param  string $SelectID 
 * @access public
 * @return void
 */
function downItem(SelectID)
{
    ItemList = document.getElementById(SelectID);
    for(var x=0;x<ItemList.length;x++)
    {
        var opt = ItemList.options[x];
        if(opt.selected)
        {
            tmpUpValue = ItemList.options[x+1].value;
            tmpUpText  = ItemList.options[x+1].text;
            ItemList.options[x+1].value = opt.value;
            ItemList.options[x+1].text  = opt.text;
            ItemList.options[x].value = tmpUpValue;
            ItemList.options[x].text  = tmpUpText;
            ItemList.options[x+1].selected = true;
            ItemList.options[x].selected = false;
            break;
        }
    }
}

/**
 * select all items of a select. 
 * 
 * @param  string $SelectID 
 * @access public
 * @return void
 */
function selectItem(SelectID)
{
    ItemList = document.getElementById(SelectID);
    for(var x=ItemList.length-1;x>=0;x--)
    {
        var opt = ItemList.options[x];
        opt.selected = true;
    }
}

/**
 * Set modal for list page.
 *
 * Open operation pages in modal for list pages, after the modal window close, reload the list content and repace the replaceID.
 * 
 * @param string   colorboxClass   the class for colorbox binding.
 * @param string   replaceID       the html object to be replaced.
 * @access public
 * @return void
 */
function setModal4List(colorboxClass, replaceID, callback, width, height)
{
    if(typeof(width) == 'undefined') width = 900
    if(typeof(height) == 'undefined') height = 500
    $('.' + colorboxClass).colorbox(
    {
        width: width,
        height: height,
        iframe: true,
        transition: 'none',

        onCleanup:function()
        {
            var selfClose = $.cookie('selfClose');
            if(selfClose != 1) return;
            saveWindowSize();

            var link = self.location.href;
            $('#' + replaceID).wrap("<div id='tmpDiv'></div>");
            $('#tmpDiv').load(link + ' #' + replaceID, function()
            {
                $('#tmpDiv').replaceWith($('#tmpDiv').html());
                setModal4List(colorboxClass, replaceID, callback, width, height);

                try{$('.colored').colorize();}catch(err){}
                $('tfoot td').css('background', 'white').unbind('click').unbind('hover');
                try
                {
                    $(".date").datePicker({createButton:true, startDate:startDate})
                    .dpSetPosition($.dpConst.POS_TOP, $.dpConst.POS_RIGHT)
                }
                catch(err){}
                if(typeof(callback) == 'function') callback();
                $.cookie('selfClose', 0);
            });
        }
    });
}

/**
 * Delete item use ajax.
 * 
 * @param  string url 
 * @param  string replaceID 
 * @param  string notice 
 * @access public
 * @return void
 */
function ajaxDelete(url, replaceID, notice)
{
    if(confirm(notice))
    {
        $.ajax(
        {
            type:     'GET', 
            url:      url,
            dataType: 'json', 
            success:  function(data) 
            {
                if(data.result == 'success') 
                {
                    $('#' + replaceID).wrap("<div id='tmpDiv'></div>");
                    $('#tmpDiv').load(document.location.href + ' #' + replaceID, function()
                    {
                        $('#tmpDiv').replaceWith($('#tmpDiv').html());
                        if(typeof sortTable == 'function')
                        {
                            sortTable(); 
                        }
                        else
                        {
                            $('.colored').colorize();
                            $('tfoot td').css('background', 'white').unbind('click').unbind('hover');
                        }
                    });
                }
            }
        });
    }
}

/* Ping the server every some minutes to keep the session. */
needPing = true;

/* When body's ready, execute these. */
$(document).ready(function() 
{
    loadFixedCSS();
    setForm();
    saveWindowSize();
    setDebugWin('white');
    setOuterBox();

    setRequiredFields();
    setPlaceholder();

    setAbout();
    setQRCode();
    setExport();
    setRepoLink();

    autoCheck();
    toggleSearch();
    toggleTreeBox();

    hideClearDataLink();

    $(window).resize(function(){saveWindowSize()});   // When window resized, call it again.
    if(needPing) setTimeout('setPing()', 1000 * 60);  // After 5 minutes, begin ping.

    $('.export').bind('click', function()
    {
        var checkeds = '';
        $(':checkbox').each(function()
        {
            if($(this).attr('checked'))
            {
                var checkedVal = parseInt($(this).val());
                if(checkedVal != 0) checkeds = checkeds + checkedVal + ',';
            }
        })
        if(checkeds != '') checkeds = checkeds.substring(0, checkeds.length - 1);
        $.cookie('checkedItem', checkeds, {expires:config.cookieLife, path:config.webRoot});
    });
});

/* CTRL+g, auto focus on the search box. */
$(document).bind('keydown', 'Ctrl+g', function(evt)
{
    $('#searchQuery').attr('value', '');
    $('#searchQuery').focus();
    evt.stopPropagation( );  
    evt.preventDefault( );
    return false;
});

/* left, go to pre object. */
$(document).bind('keydown', 'left', function(evt)
{
    preLink = ($('#pre').attr("href"));
    if(typeof(preLink) != 'undefined') location.href = preLink;
});

/* right, go to next object. */
$(document).bind('keydown', 'right', function(evt)
{
    nextLink = ($('#next').attr("href"));
    if(typeof(nextLink) != 'undefined') location.href = nextLink;
});
