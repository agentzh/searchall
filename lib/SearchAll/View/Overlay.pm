use strict;
use warnings;

package SearchAll::View::Overlay;
use base 'SearchAll::View::Base';
use Template::Declare::Tags 'XUL';

# This is the overlay that adds a "SearchAll"
# button to the toolbar palette.

our $URI = "chrome://$XUL::App::APP_NAME/content/searchall.xul";

template main => sub {
    overlay {
        attr {
            id => "SearchallBrowserToolbar",
            xmlns => $::XUL_NAME_SPACE,
        }
        toolbarpalette {
            attr { id => "BrowserToolbarPalette" }
            toolbaritem {
                attr {
                    id => "tb-searchall-new",
                    align => "center",
                    persist => "width",
                    crop => 'end',
                }
                toolbarbutton {
                    attr {
                        id => "tb-searchall-button",
                        image => "chrome://$XUL::App::APP_NAME/content/logo-small.png",
                        oncommand => "toOpenWindowByType('searchall:win', '$URI')",
                        #label => "SearchAll",
                        tooltiptext => "SearchAll",
                    }
                }
            }
            toolbaritem {
                attr {
                    id => "tb-searchall-box",
                    align => "center",
                    persist => "width",
                }
                # ...
                textbox {
                    attr {
                        id => "searchall-searchbox",
                        onkeydown => "handleKeydown('$URI', event, this);",
                    }
                }
                button {
                    attr {
                        id => 'searchall-button',
                        image => "chrome://$XUL::App::APP_NAME/content/logo-small.png",
                        label => 'SearchAll',
                        style => 'font-size: 15px;',
                        oncommand => "toSearchAll('$URI', document.getElementById('searchall-searchbox').value, event);",
                    }
                }
            }
        }

        menupopup {
            attr { id => "menu_ToolsPopup" }
            menuitem {
                attr {
                    id => "tb-searchall-menu",
                    oncommand => "toSearchAll('$URI', '', event)",
                    insertafter => "javascriptConsole,devToolsSeparator",
                    label => "SearchAll",
                    accesskey => "",
                }
            }
        }

        toolbox {
            attr { id => "navigator-toolbox", crop => 'end' }
            toolbar {
                attr {
                    id => "searchall-toolbar",
                    iconsize => 'small',
                    #customindex => 1,
                    defaultset => 'tb-searchall-new,tb-searchall-box',
                    customizable => 'true',
                    context => 'toolbar-context-menu',
                    toolbarname => 'SearchAll Toolbar',
                    crop => 'end',
                    persist => 'collapsed mode currentset',
                }
            }
        }
    }
};

1;

