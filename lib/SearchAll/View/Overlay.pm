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
        script {
            qq{
                function toSearchAll () {
                    toOpenWindowByType(
                        'agentzh:searchall',
                        "chrome://$XUL::App::APP_NAME/content/searchall.xul"
                    );
                }
            }
        }

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
    }
};

1;

