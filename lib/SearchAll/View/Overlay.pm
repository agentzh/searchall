use strict;
use warnings;

package SearchAll::View::Overlay;
use base 'XUL::App::View::Base';
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

=start comment

            toolbaritem {
                attr {
                    id => "sa-toolbar-new",
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

=cut

            toolbaritem {
                attr {
                    id => "tb-searchall-box",
                    align => "center",
                    persist => "width",
                    #onmousedown => 'this.firstChild.focus()',
                }
                # ...
                toolbarbutton {
                    attr {
                        id => "tb-searchall-button2",
                        image => "chrome://$XUL::App::APP_NAME/content/logo-small.png",
                        oncommand => "toOpenWindowByType('searchall:win', '$URI2')",
                        #label => "SearchAll",
                        tooltiptext => _("SearchAll"),
                    }
                }

                textbox {
                    attr {
                        #type => "autocomplete",
                        #autocompletesearch => "form-history",

                        id => "searchall-searchbox",
                        clickSelectsAll => 'true',
                        onkeydown => "handleKeydown('$URI', event, this);",
                        #autocompletepopup => "PopupAutoComplete",
                        #completeselectedindex => "true",
                        #tabscrolling => "true",
                        #disablehistory => 'false',
                    }
                }
                button {
                    attr {
                        id => 'searchall-button',
                        #image => "chrome://searchall/content/logo-small.png",
                        image => "chrome://searchall/content/application_lightning.png",
                        label => " " . _('SearchAll'),
                        oncommand => "toSearchAll('$URI', document.getElementById('searchall-searchbox').value, event);",
                    }
                }
            }
        }

        popup {
            attr { id => "contentAreaContextMenu" }
            menuitem {
                attr {
                    image => "chrome://searchall/content/logo-small.png",
                    id => "right-click-sa",
                    label => _("SearchAll"),
                    class => "menuitem-iconic",
                    accesskey => "S",
                    insertafter => "context-sep-selectall",
                    oncommand => "contextSearchAll('$URI');",
                }
            }
        }

        menupopup {
            attr { id => "menu_ToolsPopup" }
            menuitem {
                attr {
                    image => "chrome://searchall/content/logo-small.png",
                    id => "tb-searchall-menu",
                    class => "menuitem-iconic",
                    oncommand => "toOpenWindowByType('searchall:win', '$URI2')",
                    insertafter => "javascriptConsole,devToolsSeparator",
                    label => _("SearchAll"),
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

