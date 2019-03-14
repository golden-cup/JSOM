https://teamspace.healthcare.siemens.com/content/90003131/Pages/FileSize.aspx

console.log("FileSize test3.js started...");

var ProjectsIDs = [];
var projectsIdx = 0;

var URL = "https://teamspace.healthcare.siemens.com/content/90003135";

$(document).ready(function () {
    //don't exectute any jsom until sp.js file has loaded.        
    SP.SOD.executeFunc('sp.js', 'SP.ClientContext', addControls);
});

function addControls() {
    var myDiv = document.getElementById("testDiv");
    myDiv.innerHTML = "";
    var btn1 = document.createElement("input");
    btn1.id = "addRowsButton";
    btn1.type = "button";
    btn1.value = "Come on";


    btn1.onclick = function () {
        letsStart();
    }

    myDiv.appendChild(btn1);
}

function letsStart() {
    console.log("StartedZZ234...");
    loadLibs();
    //FetchLib();
}

function loadLibs() {
    var call = $.ajax({
        url: URL + "/_api/web/Lists?$select=Title",
        // url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/Lists?$select=Title",
        type: "GET",
        dataType: "json",
        headers: {
            Accept: "application/json;odata=verbose"
        }
    });


    call.done(function (data, textStatus, jqXHR) {
        //console.log("Success: " + jqXHR.responseText);

        $.each(data.d.results, function (index, value) {
            if (value.Title.match(/PD.*/)) {
                //console.log(value.Title);
                ProjectsIDs.push(value.Title);
            }           
        });
        ProjectsIDs.reverse();
        FetchLib(ProjectsIDs.pop());
        //FetchLib("PD14003");
    });

    call.fail(function (jqXHR, textStatus, errorThrown) {
        console.log("Error retrieving Tasks: " + jqXHR.responseText);
    });

}





function FetchLib(libName) {

    //var context = new SP.ClientContext.get_current();
    var context = new SP.ClientContext(URL);
    var web = context.get_web();
    //var list = web.get_lists().getByTitle("Pictures");
    var list = web.get_lists().getByTitle(libName);
    var query = SP.CamlQuery.createAllItemsQuery();
    allItems = list.getItems(query);
    context.load(allItems, "Include(Title, ContentType, File,File_x0020_Size)");
    context.executeQueryAsync(
        function() {
            success(libName);
        }, 
        Function.createDelegate(this, this.failed)
    );
}

function success(libName) {

    //onsole.log("success");
    var fileUrls = "";
    var Filename = new Array();
    var i = 0;
    var ListEnumerator = allItems.getEnumerator();
    var total = 0;
    while (ListEnumerator.moveNext()) {
        var currentItem = ListEnumerator.get_current();
        var _contentType = currentItem.get_contentType();
        if (_contentType.get_name() != "Folder") {
            var File = currentItem.get_file();
            if (File != null) {
                fileUrls += File.get_serverRelativeUrl() + ' Length: ' + File.$5_0.$H_0.Length + '\n';
                //console.log(File.get_serverRelativeUrl() + ' Length: ' + File.$5_0.$H_0.Length + '\n');
                // console.log(File.get_serverRelativeUrl().split("/")[3] + ";"
                // + File.get_serverRelativeUrl().split(libName)[0] + ";" +
                // + File.$5_0.$H_0.Length);
                	
                $( "#testDiv" ).append( File.get_serverRelativeUrl().split("/")[3] + ";"
                + File.get_serverRelativeUrl().split(libName)[1] + ";"
                + File.$5_0.$H_0.Length
                + "<br>" );

                total += parseInt(File.$5_0.$H_0.Length);
                var url = fileUrls.split('/');
                var folder = url[url.length - 2];
                if (folder == "TestFolder") {
                    Filename[i] = File.get_name();
                    i++;
                }
            }
        }
    }
    //    console.log(Filename);
    //    console.log(fileUrls);
    // console.log("Total: " + total);
    FetchLib(ProjectsIDs.pop());
}

function failed() {
    console.log("FAIL");
}

// function init14002() {
//     for (var i=0; i<3000; i++) {
//         dummy14002();
//     }
// }

// function dummy14002() {
//     var context = new SP.ClientContext.get_current();
//     var list = context.get_web().get_lists().getByTitle(targetList);

//     var itemCreateInfo = new SP.ListItemCreationInformation();
//     var listItem = list.addItem(itemCreateInfo);

//     listItem.set_item('Title', 'My New Item!');
//     listItem.set_item('City', 'DeleteMe');
//     listItem.set_item("OldID",100000);

//     listItem.update();

//     context.load(listItem);

//     context.executeQueryAsync(Function.createDelegate(this, this.onQuerySucceeded), Function.createDelegate(this, this.onQueryFailed));

// }

// function getSortedIDs() {
//     var context = new SP.ClientContext.get_current();
//     var list = context.get_web().get_lists().getByTitle(sourceList);
//     var query = new SP.CamlQuery();

//     var totalCount=0;

//     var previous = 14002; // initial value = starting useful item - 1
//     var queryText = "<View><Query><Where><Gt><FieldRef Name='OldID'/><Value Type='Number'>" + previous + "</Value></Gt></Where>Gt<OrderBy><FieldRef Name='OldID' Ascending='True'/></OrderBy></Query><ViewFields><FieldRef Name='ID' /><FieldRef Name='OldID' /></ViewFields></View>";
//     //var queryText = "<View><Query><Where><And><Gt><FieldRef Name='OldID'/><Value Type='Number'>100</Value></Gt><Lt><FieldRef Name='OldID'/><Value Type='Number'>200</Value></Lt></And></Where><OrderBy><FieldRef Name='OldID' Ascending='True'/></OrderBy></Query><ViewFields><FieldRef Name='ID' /><FieldRef Name='OldID' /></ViewFields></View>";

//     // var previous = 18019;
//     // var queryText = "<View><Query><Where><And><Gt><FieldRef Name='OldID'/><Value Type='Number'>18019</Value></Gt><Lt><FieldRef Name='OldID'/><Value Type='Number'>18039</Value></Lt></And></Where><OrderBy><FieldRef Name='OldID' Ascending='True'/></OrderBy></Query><ViewFields><FieldRef Name='ID' /><FieldRef Name='OldID' /></ViewFields></View>";
//     query.set_viewXml(queryText);
//     var items = list.getItems(query);
//     context.load(items);
//     context.executeQueryAsync(
//         function (sender, args) {
//             var listEnumerator = items.getEnumerator();

//             while (listEnumerator.moveNext()) {
//                 var OldID = listEnumerator.get_current().get_item('OldID');
//                 var newID = listEnumerator.get_current().get_item('ID')
//                 totalCount++;

//                 if (OldID > (previous + 1)) {
//                     for (var i = previous + 1; i < OldID; i++) {
//                         console.log("dummy, OldID : 100000");
//                         ProjectsIDs.push({ OldID: 100000, newID: 100000 });
//                     }
//                     console.log(OldID);
//                     ProjectsIDs.push({ OldID: OldID, newID: newID });
//                 }
//                 else {
//                     console.log(OldID);
//                     ProjectsIDs.push({ OldID: OldID, newID: newID });
//                 }
//                 previous = OldID;
//                 // if (count==100) {
//                 //     break;
//                 // }
//             }

//             console.log("## Total items: " + totalCount);
//             getAllFields(sourceList);
//             //throw new Error("Something went badly wrong!");
//         },
//         function (sender, args) { alert("error: " + args.get_message()); }
//     );
// }

// function getAllFields(listName) {
//     var ctx = new SP.ClientContext.get_current();
//     var list = ctx.get_web().get_lists().getByTitle(listName);
//     var fieldCollection = list.get_fields();     //get_fields() returns SP.FieldCollection object
//     ctx.load(fieldCollection, 'Include(InternalName,StaticName,ReadOnlyField)');

//     ctx.executeQueryAsync(function () {
//         var cont = 0;
//         var fields = 'SP.FieldCollection from list.get_fields()'
//         fields += 'Internal Name - Static Name \n';
//         fields += '--------------------------- \n';
//         var listEnumerator = fieldCollection.getEnumerator();
//         while (listEnumerator.moveNext()) {
//             var field = listEnumerator.get_current();

//             // TODO : Attachments
//             if (!field.get_readOnlyField()) {
//                 copyFieldsArray.push(field);
//             }
//             fields += listEnumerator.get_current().get_internalName() + ' - ' + listEnumerator.get_current().get_staticName() + " - " + listEnumerator.get_current().get_readOnlyField() + ";\n ";
//             cont++;
//         }
//         //console.log(fields + '-------------------------- \n Number of Fields: ' + cont);
//         getById(ProjectsIDs[0]);
//     },
//         function (sender, args) {
//             console.log('Request collListItem failed. ' + args.get_message() + '\n' + args.get_stackTrace());
//         }
//     );
// }

// function getById(project) {
//     if (ProjectsIDs.length == projectsIdx) {
//         return;
//     }

//     if (project.OldID == 100000) {
//         createDummy();
//         return;
//     }

//     var context = new SP.ClientContext.get_current();
//     var list = context.get_web().get_lists().getByTitle(sourceList);
//     var listItem = list.getItemById(project.newID);
//     context.load(listItem);
//     context.executeQueryAsync(
//         function (sender, args) {
//             //console.log("------------------------------");
//             console.log("old: " + project.OldID + "  new: " + project.newID + "  " + listItem.get_item('Title') + "  " + listItem.get_item('City'));
//             //console.log(project.OldID);
//             addToAnotherList(listItem);
//         },
//         function (sender, args) {
//             console.log('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
//             createDummy();
//         }
//     );
// }

// function createDummy() {
//     //demoSleeep();
//     var context = new SP.ClientContext.get_current();
//     var list = context.get_web().get_lists().getByTitle(targetList);

//     var itemCreateInfo = new SP.ListItemCreationInformation();
//     var newListItem = list.addItem(itemCreateInfo);
//     newListItem.set_item('Title', 'DeleteMe');
//     newListItem.set_item('City', 'DeleteMe');
//     newListItem.set_item("OldID",100000);
//     newListItem.update();
//     context.load(newListItem);
//     context.executeQueryAsync(onGoodQuery, onQueryFailed);
// }

// function onGoodQuery(sender, args) {
//     //console.log("good query");
//     //sleepFor();
//     projectsIdx++;
//     // if (projectsIdx>totalCount) {
//     //     console.log("FINISHED DELETING");
//     // }
//     getById(ProjectsIDs[projectsIdx]);
// }

// function addToAnotherList(listItem) {
//     var context = new SP.ClientContext.get_current();
//     var list = context.get_web().get_lists().getByTitle(targetList);

//     var itemCreateInfo = new SP.ListItemCreationInformation();
//     var newListItem = list.addItem(listItem);

//     var lib1="https://teamspace.healthcare.siemens.com/content/90003132/"
//     var lib2="https://teamspace.healthcare.siemens.com/content/90003133/"
//     var lib3="https://teamspace.healthcare.siemens.com/content/90003134/"
//     var lib4="https://teamspace.healthcare.siemens.com/content/90003135/"

//     for (var i = 0; i < copyFieldsArray.length; i++) {
//         var intName = copyFieldsArray[i].get_internalName();
//         if (intName == "ContentType") continue;
//         if (intName == "Attachments") continue; //TODO
//         try {
//             if (intName=="DocLibrary") {
//                 var docLib="";
//                 var rePD = /PD\d+/g;
//                 var str = listItem.get_item(intName).get_url();                
//                 var PD = (String(str).match(rePD))[0];
//                 if (str.includes("docs/1")) {
//                 docLib = lib1 + PD;
//                 }
//                 else if  (str.includes("docs/2")) {
//                 docLib = lib2 + PD;
//                 }
//                 else if  (str.includes("docs/3")) {
//                 docLib = lib3 + PD;
//                 }
//                 else if  (str.includes("docs/4")) {
//                 docLib = lib4 + PD;
//                 }
//                 newListItem.set_item(intName, docLib);
//             }
//             else {
//                 newListItem.set_item(intName, listItem.get_item(intName));
//             }
//         }
//         catch (err) {
//             console.log(err);
//         }
//     }

//     newListItem.update();
//     context.load(newListItem);

//     //context.executeQueryAsync(Function.createDelegate(this, this.onQuerySucceeded), Function.createDelegate(this, this.onQueryFailed));
//     context.executeQueryAsync(onGoodQuery, onQueryFailed);
// }



// // function onQuerySucceeded(sender, args) {
// // }

// function onQueryFailed(sender, args) {
//     console.log("FAILED. Sender: " + sender + "  Args:" + args);
// }



// function deleteShit() {

//     console.log("deleting shit...");

//     var context = new SP.ClientContext.get_current();
//     var list = context.get_web().get_lists().getByTitle(targetList);

//     var query = new SP.CamlQuery();
//     var queryText = "<View><Query><Where><Eq><FieldRef Name='OldID'/><Value Type='Counter'>100000</Value></Eq></Where><OrderBy><FieldRef Name='ID' Ascending='True'/></OrderBy></Query><ViewFields><FieldRef Name='City' /><FieldRef Name='ID' /></ViewFields></View>";

//     query.set_viewXml(queryText);
//     var items = list.getItems(query);
//     context.load(items);
//     var count = 0;
//     context.executeQueryAsync(
//         function (sender, args) {
//             var listEnumerator = items.getEnumerator();

//             while (listEnumerator.moveNext()) {
//                 try {
//                     var newID = listEnumerator.get_current().get_item('ID');
//                     //var OldID = listEnumerator.get_current().get_item('OldID');
//                     console.log("ID: " + newID);
//                     count++;
//                     deleteArray.push(newID);
//                 }
//                 catch (err) {
//                     console.log(err);
//                 }
//             }
//             console.log("## Total items: " + count);
//             deleteItem(deleteArray[0]);
//         },
//         function (sender, args) { console.log("error: " + args.get_message()); }
//     );
// }

// function deleteItem(itemId) {
//     //demoSleeep();
//     var context = new SP.ClientContext.get_current();
//     var list = context.get_web().get_lists().getByTitle(targetList);

//     try {
//         listItem = list.getItemById(itemId);
//         listItem.deleteObject();
//         list.update();
//         context.load(list);
//     }
//     catch (err) {
//         console.log(err);
//     }


//     //console.log("item to delete: " + listItem.get_item('City'));

//     context.executeQueryAsync( function () {
//         if (deleteArray.length==0) {
//             console.log("Delete done");
//             return;
//         }
//         deleteItem(deleteArray.pop());
//     }, 
//     function (sender, args) { console.log("error: " + args.get_message()); }
// );
// }
