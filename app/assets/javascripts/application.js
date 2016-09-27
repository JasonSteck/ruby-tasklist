// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require twitter/bootstrap
//= require turbolinks
//= require_tree .

// CS 4540, Spring 2015
// Written by Paul Hanson and Jason Steck

//returns a browser-appropriate xml http request object
function getHTTPObject() {
    // If the browser knows what a XMLHttpRequest is then use that
    if (typeof XMLHttpRequest != 'undefined') {
        return new XMLHttpRequest();
    } 
    // Try to create a new Msxml2 XMLHttp
    try {
        return new ActiveXObject("Msxml2.XMLHTTP");
    } catch (e) {
        // Since that failed, try to create a Microsoft XML Http
        try {
            return new ActiveXObject("Microsoft.XMLHTTP");
        } catch (e) {}
    }
    // If we weren't able to get any XMLHttp object then just return false.
    return false;
}

// Grab an XMLHttp request object
var httpObject = getHTTPObject();

//attempt to login user
function login(form) {
    var username = form.username.value;
    var password = form.password.value;

    //   Send a synchonous request to wherever the form points to and use the username and password
    // provided in in the form
    httpObject.open("get", form.action, false, username, password);
    // Doesn't matter what we send, we only want to know if the authentication credentials are good
    httpObject.send(""); 
    // If we were able to load the page OK
    if (httpObject.status == 200) {
        // Redirect to the page
        document.location = form.action; 
    } else {
        // Something went wrong with the request
        var box = $("#warningBox");
        var title = "Oops!";
        var msg = "There was a problem with your login. <br/> Please try again.";
        // If the warning box exists, use that
        if(box.length)
        {
            box.html("<strong>"+title+"</strong> "+msg);
            box.show();
        }
        else // Use the default alert functionality
            alert(msg);
        // Clear the password
        form.password.value = "";
        // focus on the password field
        form.password.focus();
    }

    // Prevent the form from submitting. We only change pages if the credentials are correct.
    return false;
}

// log the user out by sending bad credentials and moving to the main page
function logout() {
    // send bad credentials
	httpObject.open("get", "/tasks", false, 'blah', 'jk');
    httpObject.send("");
    
    // Redirect to the main page
    document.location = "/";
    return false;
}

// Whenever the document is ready OR when the page loads
$(document).on('ready page:load', function () 
{
    //when checkboxes are changed, update db and change table row's class (for css formatting)
    $(".completedCheckbox").change(function() 
    {    
        // Collect all the information we need
        var tr = $(this).parent().parent();
        var taskid = tr.attr("id");
        var checked = $(this).is(":checked");   
        var theBox = $(this);

        // Create an ajax request to udate the particular task
        $.ajax({
        	type: "GET",
        	url: "/tasks/" + taskid + "/checkboxAjax",
        	dataType: "json",
        	data: {is: taskid, isChecked: checked},
        	success: function(data){
                // If we marked a task as done then change it's class      
        	    if(checked) 
        	    {
            		tr.addClass("done");
            		tr.removeClass("todo");
        	    }
                else // change it's class to not done
        	    {
            		tr.addClass("todo");
            		tr.removeClass("done");
        	    }
            },
    	   error: function(){
                // Revert the checkbox to what it was
                theBox.prop("checked", !checked);
                alert("Error:\nThere was a problem processing the request.\nPlease check your internet connection and try again.");
            }
        });
    });
    
    //set table row's class depending on whether or not checkbox is checked (for css formatting)
    $(".completedCheckbox").each(function() {
        // remember the table row
        var tr = $(this).parent().parent();
        
        // Change how the row is displayed depending on whether it's done or not
        if($(this).is(":checked"))
    	    tr.addClass("done");
        else 
    	    tr.addClass("todo");
    });


    // Enables the column resizing ability and allow it to remember where the columns are
    $(function(){
        $("table").resizableColumns({
          store: store
        });
      });    

});

