function Task(text,important,date) {
	this.date = date;
	this.text = text;
	this.important = important;
	this.completed = false;
	this.changecompletedprop = function() { 
		if (this.completed == false) {
			this.completed = true; 
			return true;
		} else {
			this.completed = false; 
			return false;
		}
	}
}

var todolist = new Object();
todolist.tasks = new Array();
todolist.dc = 0;
todolist.impchecked = false;
todolist.divischanging = false;
todolist.changingdivi = -1;
todolist.hidecomp = false;
todolist.onlyimp = false;

todolist.addTask = function () {
	var text = $("#adddiv").text();
	if (text == "") {return;}
	var date = new Date();
	if (todolist.impchecked) {
		var important = true;
	} else {
		var important = false;
	}
	var newtask = new Task(text,important,date);
	var d = new Date().toString();
	d = d.split('G');
	newtask.edited = d[0];
	todolist.tasks.push(newtask);
	$("#adddiv").text("");
	todolist.impchecked = false;
	$("#imp").attr({class: "addimportantfalse"});

	var div1 = $("<div class = 'task'></div>")
	div1.attr({id: todolist.dc}).appendTo('#tasksdiv');
	$("<div class = 'tasknumber'></div>").text("#" + todolist.dc + "  ").appendTo(div1);
	$("<div class = 'taskdate'></div>").text(date.toDateString()).appendTo(div1);
	if (important) {$("<div class = 'important'></div>").text("Important!").appendTo(div1);}
	$("<div class = 'uncompleteddiv'></div>").html("Uncompleted <img src = 'images/uncomp.png'>").appendTo(div1);

	$("<div class = 'editablediv'></div>").appendTo(div1).text(text);
	
	$('.task').prop('onclick',null).off('click');
	$('.completeddiv, .uncompleteddiv').prop('onclick',null).off('click');
	
	var tasklist0 = $('.completeddiv, .uncompleteddiv');
	$.each(tasklist0, function(i, div) {
		$(div).click(function() {
			if (!todolist.divischanging) {
				var t = todolist.tasks[i].changecompletedprop();
				if (!t) {
					$(div).attr({class: "uncompleteddiv"}).html("Uncompleted <img src = 'images/uncomp.png'>");
				} else {
					$(div).attr({class: "completeddiv"}).html("Completed <img src = 'images/comp.png'>");
				}
				event.stopPropagation();
			}
		});
	});
	
	var tasklist1 = $('.task');
	$.each(tasklist1, function(i, div) {
		$(div).click(function() {
			todolist.changeDiv(i);
		});
	});
		
	todolist.dc++;
	var objDiv = document.getElementById("tasksdiv");
	//objDiv.scrollTop = objDiv.scrollHeight;
	$("#tasksdiv").stop(true, false).animate({scrollTop: $("#tasksdiv").get(0).scrollHeight}, 1000);
	document.getElementById("adddiv").focus();
}

todolist.changeDiv = function (number) {
	if ((todolist.divischanging)&&(todolist.changingdivi != number)) {todolist.save();}
	if ((todolist.divischanging)&&(todolist.changingdivi == number)) {return;}
	todolist.divischanging = true;
	todolist.changingdivi = number;
	$('#' + number).find('.editablediv').attr({contentEditable: true});
	$("<button input type = 'button' class = 'btn' id = 'save'>Save</button>").appendTo(document.getElementById(number));
	
	$("#save").on('click', function (event) {
		todolist.save(); 
		event.stopPropagation();
	});
	
	var isCtrl = false;
	document.onkeyup=function(e){
		if(e.keyCode == 17) {isCtrl=false;}
	}
	document.onkeydown = function(e){
		if(e.keyCode == 17) {isCtrl=true;}
		if((e.keyCode == 83) && (isCtrl)) {
			todolist.save();
			return false;
		}
	}
}

todolist.save = function () {
	if (!todolist.divischanging) {return;}
	$('#' + todolist.changingdivi).find('.editablediv').attr({contentEditable: false});
	todolist.tasks[todolist.changingdivi].text = $('#' + todolist.changingdivi).text();
	var d = new Date().toString();
	d = d.split('G');
	todolist.tasks[todolist.changingdivi].edited = d[0];
	todolist.divischanging = false;
	todolist.changingdivi = "-1"; 
	$('#save').attr("id","old").slideUp(300, function(){ $(this).remove();});
	document.getElementById("adddiv").focus();
};

$(document).ready(function() {
	$("#hidecomp").change(function() {
		if (!todolist.hidecomp) {
			for (var i = 0; i < todolist.tasks.length; i++) {
				if (todolist.tasks[i].completed) {
					$('#' + i).attr({class: 'hidden'});
				}
			}
			todolist.hidecomp = true;
		} else {
			for (var i = 0; i < todolist.tasks.length; i++) {
				$('#' + i).attr({class: 'task'});
			}
			todolist.hidecomp = false;
		}
	});
	$("#onlyimp").change(function() {
		if (!todolist.onlyimp) {
			for (var i = 0; i < todolist.tasks.length; i++) {
				if (!todolist.tasks[i].important) {
					$('#' + i).attr({class: 'hidden'});
				}
			}
			todolist.onlyimp = true;
		} else {
			for (var i = 0; i < todolist.tasks.length; i++) {
				$('#' + i).attr({class: 'task'});
			}
			todolist.onlyimp = false;
		}
	
	});
	
	var div1 = $("<div class = 'newdiv'></div>").appendTo('#add');
	$("<div class = 'tasknumber'></div>").text("+  ").appendTo(div1);
	var date = new Date();
	$("<div class = 'taskdate'></div>").attr({class: "taskdate"}).text(date.toDateString()).appendTo(div1);
	$("<div class = 'addimportantfalse' id = 'imp'></div>").text("Important!").appendTo(div1);
	$("<div class = 'editablediv' contentEditable='true' id = 'adddiv'></div>").appendTo(div1);
	$("<button input type = 'button' class = 'btn' id = 'addbutton'>Add</button>").appendTo(div1);
	document.getElementById("adddiv").focus();
	$("#imp").on('click', function (event) {
		if (!todolist.impchecked) {
			$("#imp").attr({class: "addimportanttrue"});
			todolist.impchecked = true;
		} else {
			$("#imp").attr({class: "addimportantfalse"});
			todolist.impchecked = false;
		}
	});
	$("#addbutton").on('click', function (event) {todolist.addTask();});
	$("#adddiv").on('click', function (event) {todolist.save();});
});