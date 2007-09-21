var selectedURLIndex, selectedTabIndex;
$(document).ready( function () {
    selectedTabIndex = $("#view-tabs").attr("lastSelected");
    if (selectedTabIndex == undefined) {
        selectedTabIndex = 0;
    }
    Debug.log("Selecting tab " + selectedTabIndex + "...");
    //alert("I got this: " + $("#view-tabbox")[0].selectedIndex);
    $("#view-tabbox")[0].selectedIndex = selectedTabIndex;
    $("#view-tabs")[0].addEventListener(
        'command',
        function () {
            selectedTabIndex = this.selectedIndex;
            this.setAttribute("lastSelected", this.selectedIndex);
            //alert(selectedTabIndex);
        },
        false
    );
    //$("#view-tab-" + selectedTab)[0].selected = true;
    //alert($("#url-list-0").attr('lastSelected'));
    for (var i = 0; i < 3; i++) {
        selectedURLIndex = $("#url-list-" + i)
            .attr('lastSelected');
        if (selectedURLIndex != undefined) {
            var url_list = $("#url-list-" + i)[0];
            url_list.selectedIndex = selectedURLIndex;
            browsers[i].goHome(url_list.value);
        }
    }
} );

