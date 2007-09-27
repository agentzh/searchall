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

        toolbox {
            attr { id => "navigator-toolbox" }
            toolbar {
                attr { id => "findfile_toolbar" }
                label {
                    attr {
                        control => "findfile_filename",
                        value => "Search for files named:",
                    }
                }
                textbox {
                    attr { id => "findfile_filename" }
                }
                label {
                    attr {
                        control => "findfile_dir",
                        value => "Directory:",
                    }
                }
                textbox {
                    attr {  id => "findfile_dir" }
                }
                button {
                    attr { label => "Browse..." }
                }
            }
        }
    }
};

1;

