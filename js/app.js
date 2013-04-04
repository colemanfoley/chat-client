(function(){
	//chatroom definition
	var chatroom = $('#new-chatroom').val() || "messages";

	//The chatLoader function will take the chatroom as an argument and will be called when
	//the user creates a new chat room, thereby refreshing the chat-log

	var chatLoader = function(chatroom){
		var chatroomParseURL = 'https://api.parse.com/1/classes/' + chatroom;
		$.ajax( chatroomParseURL, {
		  beforeSend: headerSetter,
		  contentType: 'application/json',
		  success: function(data){
		  	console.log(data);
				var messagePrepender = function(message){
					var prependableMsg = "<div class='message-container' data-username='" + message.username + "'>" +
						"<span" + " class='username'>" + message.username + ": </span>" +
					  "<span class='text'>" + message.text + "</span>" +
						"</div>";
					$('#chat-log').prepend(prependableMsg);
				};

				$("#chat-log").html('');
				_.each(data.results, messagePrepender);
		  }
		});
	}

	chatLoader(chatroom);

	//Chat sender
	$(document).ready(function(){
		$('#chat-form').submit(function(event) {
			event.preventDefault();
			var userMessage = {};
			var userMessageDestination = 'https://api.parse.com/1/classes/' + chatroom;
			userMessage.username = $("#username-input").val();
			userMessage.text = $("#chat").val();

			$.ajax(userMessageDestination, {
	  		beforeSend: headerSetter,
	  		contentType: 'application/json',
	  		type: 'POST',
	  		data: JSON.stringify(userMessage),
	  		success: function(data){
	  			chatLoader(chatroom); //only update new msgs

	  		}
			});
		});

	//setting event handlers on each username span in chat-log

	//code to allow user to bold chats from selected users

		$('#chat-log').on('click', '.message-container', function(event){
			var name = $(this).data("username");
			$(".message-container[data-username='" + name + "']").css('font-weight', 'bold');
		});

	//code to define and take user to new chat rooms

	//goals for code below:
	//i) add newChatroom name to chatroom-list
	//ii) replace contents of chat-log with chat-log from newChatroom
	//iii) redirect new usermessages to new room
	//iv) give user the ability to change room via the dropdown
		$('#chatroom-list').change(function(){
			chatroom = $('option:selected').val();
			if(chatroom === "main"){
				chatroom = "messages";
			}
			chatLoader(chatroom);
		});

		$('#chat-room').submit(function(event) {
			event.preventDefault();

			chatroom = $('#new-chatroom').val();
			
			$('#chatroom-list').append("<option value='" + chatroom + "'>" + chatroom + "</option>" );
			$('#new-chatroom').html();
			
			chatLoader(chatroom);
		});
	});
})();