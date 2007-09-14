var testResults = {};
var curTestFile;
var testFiles = $("#test-file-list")[0];

$("#run-tests").click( function () {
    if (!curTestFile) curTestFile = testFiles.selectedItem.label;
    $("#test")[0].value = '';
    var func = $("#test-file-list")[0].selectedItem.value;
    var code = func + "()";
    info(code);
    eval(code);
} );

$(testFiles).select( function () {
    //alert(this.selectedItem.label);
    var testbox = $("#test")[0];
    if (curTestFile)
        testResults[curTestFile] = testbox.value;
    curTestFile = this.selectedItem.label;
    $("#test")[0].value = testResults[curTestFile] || '';
} );

