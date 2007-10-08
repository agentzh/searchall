use strict;
use warnings;

package SearchAll::View::Overlay;
use base 'SearchAll::View::Base';
use Template::Declare::Tags 'XUL';

# This is the overlay that adds a "SearchAll"
# button to the toolbar palette.

our $URI = "chrome://$XUL::App::APP_NAME/content/searchall-page.xul";
our $URI2 = "chrome://$XUL::App::APP_NAME/content/searchall.xul";

template main => sub {
    show 'header';
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
                        oncommand => "toOpenWindowByType('searchall:win', '$URI2')",
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
                    onmousedown => 'this.firstChild.focus()',
                }
                # ...
                toolbarbutton {
                    attr {
                        id => "tb-searchall-button2",
                        image => "chrome://$XUL::App::APP_NAME/content/logo-small.png",
                        oncommand => "toOpenWindowByType('searchall:win', '$URI2')",
                        #label => "SearchAll",
                        tooltiptext => "SearchAll",
                    }
                }

                textbox {
                    attr {
                        id => "searchall-searchbox",
                        clickSelectsAll => 'true',
                        onkeydown => "handleKeydown('$URI', event, this);",
                    }
                }
                button {
                    attr {
                        id => 'searchall-button',
                        image => "chrome://$XUL::App::APP_NAME/content/application_lightning.png",
                        label => ' SearchAll',
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
                    oncommand => "toOpenWindowByType('searchall:win', '$URI2')",
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
                    defaultset => 'tb-searchall-box',
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

