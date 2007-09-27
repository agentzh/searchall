use strict;
use warnings;

package SearchAll::View::Overlay;
use base 'SearchAll::View::Base';
use Template::Declare::Tags 'XUL';

# This is the overlay that adds a "SearchAll"
# button to the toolbar palette.

template main => sub {
    overlay {
        attr {
            id => "SearchallBrowserToolbar",
            xmlns => $::XUL_NAME_SPACE,
        }
        script { attr { src => "chrome://$XUL::App::APP_NAME/content/jquery.js" } }
        toolbarpalette {
            attr { id => "BrowserToolbarPalette" }
            toolbarbutton {
                attr {
                    id => "tb-searchall-open",
                    image => "chrome://$XUL::App::APP_NAME/content/logo.png",
                    oncommand => "toSearchAll()",
                    label => "SearchAll",
                    orient => 'vertical',
                    tooltiptext => "SearchAll",
                }
            }
        }

        menupopup {
            attr { id => "menu_ToolsPopup" }
            menuitem {
                attr {
                    id => "tb-searchall-menu",
                    oncommand => "toSearchAll()",
                    insertafter => "javascriptConsole,devToolsSeparator",
                    label => "SearchAll",
                    accesskey => "",
                }
            }
        }

        toolbox {
            attr { id => "navigator-toolbox" }
            toolbar {
                attr { id => "searchall-toolbar" }
                textbox {
                    attr {
                        id => "searchall-searchbox",
                        onkeydown => "handleKeydown(event, this);",
                    }
                }
                button {
                    attr {
                        id => 'searchall-button',
                        image => "chrome://$XUL::App::APP_NAME/content/logo-small.png",
                        label => 'SearchAll',
                        style => 'font-size: 15px;',
                        oncommand => "toSearchAll(document.getElementById('searchall-searchbox').value);",
                    }
                }
            }
        }

        script {
            qq{
                function toSearchAll (query) {
                    if (query == undefined)
                        query = "";
                    var uri = "chrome://$XUL::App::APP_NAME/content/searchall.xul";
                    var winopts = "chrome,extrachrome,menubar,resizable,scrollbars,status,toolbar";
                    var win = window.open(uri, "_blank", winopts);
                    if (query != '') {
                        setTimeout( function () {
                            \$("#search-box", win.document)[0].value = query;
                            \$("#search-button", win.document)[0].click();
                        }, 3500 );
                    }
                }
                function handleKeydown (e, obj) {
                    //alert("Hey!");
                    if (e.keyCode == 13) {
                        //alert("Found enter key!");
                        toSearchAll(obj.value);
                        return false;
                    } else {
                        //info("Got key: " + e.keyCode);
                    }
                    //alert(e.keyCode + " pressed!");
                    return true;
                }
            }
        }
    }
};

1;

