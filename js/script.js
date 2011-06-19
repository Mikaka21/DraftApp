$(document).ready(function() {
	
	var leagueId = 1;
	
	console.log('script');
	
	// Helper object for sorting teams by draft position
	/*
	var arrange = {

	    byObjectsAttribute:function(name){
	        return function(obj1,obj2){
	            var n1;
	            var n2;
	            if(typeof obj1 === 'object' && typeof obj2 === 'object' && obj1 && obj2){
	                n1 = obj1[name];
	                n2 = obj2[name];
	                if(n1 === n2){
	                    return obj1;
	                }
	                if(typeof n1 === typeof n2){
	                    return n1 < n2 ? -1 : 1;
	                }
	            }else{
	                throw{
	                    name: 'Error',
	                    message: 'Expected object when sorting by ' + name
	                };
	            }
	        };
	    }

	};
	*/
	
	$.getJSON('/DraftApp/league/1/getTeams.json', function(data) {

		
		
		$.each(data, function(key, val) {
			console.log('adding list item');
			var li = $('<li />', {
				text: val.name
			});
			
			// These are the divs for the OpenTok streams to go in
			var div = $('<div />', {
				'id': 'videoContainer-' + val.teamID,
				'class': 'teamPic'
			});
			
			$(li).append(div);
			
			$('#teamList').append(li);
		});
		
		
		// Connect to openTok session after divs are created		
		session.connect(apiKey, token);
	});
	
	

	var sessionId = '28757622dbf26a5a7599c2d21323765662f1d436';
	var token = 'devtoken';
	var apiKey = '413302';
	
	var session = TB.initSession(sessionId);
	
	var streamCount = 0;
	
	// TB.setLogLevel(TB.DEBUG);
	
	session.addEventListener('sessionConnected', sessionConnectedHandler);
	session.addEventListener('streamCreated', streamCreatedHandler);
	session.addEventListener('streamDestroyed', streamDestroyedHandler);
	
	function sessionConnectedHandler(event) {
		subscribeToStreams(event.streams);
	}
	
	function streamCreatedHandler(event) {
		subscribeToStreams(event.streams);
	}
	
	function streamDestroyedHandler(event) {
		streamCount--;
	}
	
	function subscribeToStreams(streams) {
		for (var i = 0; i < streams.length; i++) {
			var stream = streams[i];
			
			var div = document.createElement('div');
			div.setAttribute('id', 'stream-' + stream.streamid);
			
			$('#videoContainer-' + stream.name).append(div);
			
			session.subscribe(stream, div.id, { width: 75, height: 75 });
			
			streamCount++;
		}
	}
	
});