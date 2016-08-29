var gerecht;
var hoeveelheid;
var opmerking;
var date;
var time;

function createDoc(){

     gerecht = $("#gerecht").val();
     hoeveelheid = $("#hoeveelheid").val();
     opmerking = $("#opmerking").val();
     date = getDate();
     time = getTime();
    var geleverd = $("#geleverd").val();
 
    var doc = {};

    doc.name = gerecht;
    doc.hoeveelheid = parseInt(hoeveelheid);
    doc.opmerking = opmerking;
    doc.date = date;
    doc.time = time;
    doc.geleverd = geleverd;
    var json = JSON.stringify(doc);

    $.ajax({
        type : 'PUT',
        url : '../../' + doc.name,
        //url : 'http://3ppo.cloudant.com/students/' + name + firstName,
        // url : 'http://127.0.0.1:5984/students/' + name+ firstName,
        data : json,
        contentType : 'application/json',
        async : true,
        success : function(data){
            $("#gerecht").val('');
            $("#hoeveelheid").val('');				
            $("#opmerking").val('');
            fillTypeAhead();
        },
        error : function(XMLHttpRequest, textStatus, errorThrown){
            console.log(textStatus);
        }
    });
}

function getDate(){
	var currentTime = new Date()
	var month = currentTime.getMonth() + 1
	var day = currentTime.getDate()
	var year = currentTime.getFullYear()
	
return month + "/" + day + "/" + year;
}

function getTime(){
	var currentTime = new Date()	
	var hours = currentTime.getHours() // => 9
	var min = currentTime.getMinutes() // =>  30
return  hours +" : "+ min
}

function buildOutput(){

    $('#output').empty();
    var html = '<table class="table table-hover">';
    $.ajax({
        type : 'GET',
        url : '../../_all_docs?include_docs=true',
        async : true,
        success : function(data){
            var arr = JSON.parse(data).rows;

            for(var i = 0; i < arr.length; i++){

                if (arr[i].id.indexOf('_design') == -1){
                    var doc = arr[i].doc;
                    html += '<tr>'
                    		+ '<td>' + doc.name + '</td><td>' + doc.hoeveelheid+ '</td>'
                    		+'<td>' + doc.opmerking + '</td>'+ '<td>'+ doc.date+'</td>'
                    		+'<td>' + doc.time + '</td>'+ '<td>'+ doc.geleverd+'</td>'
                            + '<td><button type="button" class="btn btn-danger" onClick="deleteDoc(\'' + doc._id + '\',\'' + doc._rev + '\')">X</button></td>'
                            + '<td><button type="button" class="btn btn-success" onClick="updateDoc(\'' + doc._id + '\',\'' + doc._rev + '\')">geleverd</button></td>'
                }
            }
            html += '</table>';
            $('#output').html(html);
        },
        error : function(XMLHttpRequest, textStatus, errorThrown){
            console.log(errorThrown);
        }
    });
}



//__________________________________

function deleteDoc(id, rev){
    $.ajax({
        type:     'DELETE',
        url:     '../../' + id + '?rev=' + rev,
        success: function(){
            fillTypeAhead();
            buildOutput();
        },
        error:   function(XMLHttpRequest, textStatus, errorThrown) { console.log(errorThrown); }
    });
}


function updateDoc(u_id, u_rev){
    
    var doc = {};

    doc._id = u_id;
    doc._rev = u_rev;
    doc.name = gerecht;
    doc.hoeveelheid = hoeveelheid;
    doc.opmerking = opmerking;
    doc.date = date;
    doc.time = time;
    doc.geleverd = "Ja";
    var json = JSON.stringify(doc);
    
    console.log(json)
    
	$.ajax({
		type : 'PUT',
		url : '../../' + u_id,
		data : json,
		contentType : 'application/json',
		async : true,
		success : function(data){
			$('#output').show();
			buildOutput();
		},
		error : function(XMLHttpRequest, textStatus, errorThrown){
			console.log(errorThrown);
		}
	});
}

function fillTypeAhead(){
    
    buildOutput();
    
    $.ajax({
        type:    'GET',
        url:    '_view/allstudents',
        async: true,
        success:function(data){ 
            var rows = JSON.parse(data).rows;
            var names = [];
            $.each(rows, function(key, value){
                names.push(value.key);
            });
            
            $('#students').typeahead({
                hint: true,
                highlight: true,
                minLength: 1
                },
                {
                name: 'names',
                displayKey: 'value',
                source: substringMatcher(names)
                });
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) { alert(XMLHttpRequest.responseText); }
    });
}

function searchDoc(){
    
    var name = $("#students").val();
    var docName = name.replace(/\s+/g, '');
    console.log(docName);
    
    $.ajax({
        type:    'GET',
        url:    '../../' + docName,
        async: true,
        success:function(data){
            var doc = JSON.parse(data);
            editDoc(docName, doc._rev, doc.lastName, doc.firstName, doc.points);
            $("#students").val('');
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) { alert(XMLHttpRequest.responseText); }
    });    
}

function substringMatcher(strs) {
    return function findMatches(q, cb) {
    var matches, substrRegex;
     
    // an array that will be populated with substring matches
    matches = [];
     
    // regex used to determine if a string contains the substring `q`
    substrRegex = new RegExp(q, 'i');
     
    // iterate through the pool of strings and for any string that
    // contains the substring `q`, add it to the `matches` array
    $.each(strs, function(i, str) {
    if (substrRegex.test(str)) {
    // the typeahead jQuery plugin expects suggestions to a
    // JavaScript object, refer to typeahead docs for more info
    matches.push({ value: str });
    }
    });
     
    cb(matches);
    };
}
    
$(document).ready(fillTypeAhead());