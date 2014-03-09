var express = require('express'),
    app     = express(),
    hbs     = require('hbs');

app.set('view engine', 'html');
app.engine('html', hbs.__express);

app.use(express.bodyParser());
app.use(express.static('assets'));
//app.use(express.cookieParser());
//app.use(express.session({secret: config.SESSION_SECRET}));

app.get('/',function(req, res){
	res.render('main');
});

app.get('*', function(req, res){
	res.status(404);
	url = req.url;
  res.render('404', {title: '404: File Not Found', url: url });
});

var port = process.env.PORT || 4050;

server = app.listen(port, function(){
	console.log('Node Game is Listening...');
});

io = require('socket.io').listen(server);

var teams = {'blue':{users:{},count:0},'red':{users:{},count:0}};

io.sockets.on('connection', function (socket) {
//
//  exports.updateServ = function(website_id, site_status){
//	  socket.emit('update', { id: website_id, status: site_status });
//	};
//
//  var getSites = function(){
//	  socket.emit('getSites', { method: 'get sites'});
//	};
//
//	socket.on('getSites', function(data){
//		getSites();
//	});
//
//	getSites();
//
  var yourTeam;
  if ( teams.blue.count > teams.red.count ) {
    socket.team = 'red';
    socket.join('red');
    teams.red.count++;
    yourTeam = 'Red';
    socket.emit('Waiting', { message: 'Other Player\s Turn' });
  } else if ( teams.blue.count == teams.red.count || teams.blue.count < teams.red.count ) {
    socket.team = 'blue';
    socket.join('blue');
    teams.blue.count++;
    yourTeam = 'Blue';
    socket.emit('Bump', { message: 'You\'re first!' });
  }
  socket.emit('Welcome', { message: 'Welcome to Team '+yourTeam, team: yourTeam});
  socket.broadcast.emit('clearBoard');
  setTimeout(function(){
    socket.broadcast.to('blue').emit('Bump', { message: 'You\'re first!' });
    socket.broadcast.to('red').emit('Waiting', { message: 'Other Player\s Turn' });
  },1000);
  
  
  socket.on('turnOver', function(data){
    var whichTeam = data.team.toString().toLowerCase(),
        nextTeam = whichTeam == 'blue' ? 'red' : 'blue',
        playedCell = data.cell.toString();
    
    socket.broadcast.to(nextTeam).emit('YourTurn', { message: 'It\'s Your Turn!', cell: playedCell });
    
  });
  
  socket.on('Win', function(data){
    var whichTeam = data.team.toString().toLowerCase(),
        loseTeam = whichTeam == 'blue' ? 'red' : 'blue',
        playedCell = data.cell.toString();
    
    socket.broadcast.to(loseTeam).emit('Loser', { message: 'You lost', cell: playedCell });
  });
  
  socket.on("disconnect", function(){
    socket.leave(socket.team);
    if ( socket.team == 'red' ) {
      teams.red.count--;
    } else {
      teams.blue.count--;
    }
  });
  
});