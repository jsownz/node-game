$(document).ready(function(){

  var socket = io.connect('http://192.168.0.11:4050'), //Need to make this more variable -- maybe like location.href or some config setting?
      teamName;
  
  socket.on('Welcome', function (data) {
    teamName = data.team.toString().toLowerCase();
    
    console.log(teamName);
    
    if ( teamName == 'blue') {
      $('.disabled').toggleClass('disabled', false);
    }
    
    $('.team-name').text(data.team);
    $('#game').toggleClass(teamName, true);
    
  });
  
  socket.on('clearBoard', function(){
    console.log('clear');
    $('#game').find('td').toggleClass('selected played', false);
    $('.popover').toggleClass('animated', false);
    setTimeout(function(){ $('.popover').toggleClass('show', false).blur(); },500);
    if ( teamName == 'red' ) {
      setTimeout(function(){ $('.waiting').toggleClass('show', true); },800);
      setTimeout(function(){ $('.waiting').toggleClass('animated', true); },1000);
    }
  });
  
  socket.on('Bump', function(data){
    console.log(28);
    $('.first').toggleClass('show', true);
    setTimeout(function(){ 
      $('.first').toggleClass('animated', true);
    },500);
    setTimeout(function(){ $('.first').toggleClass('animated', false); },2000);
    setTimeout(function(){ $('.first').toggleClass('show', false); },2500);
  });
  
  socket.on('Waiting', function(data){
    console.log(38);
    $('.waiting').toggleClass('show', true);
    setTimeout(function(){ 
      $('.waiting').toggleClass('animated', true);
    },500);
  });
  
  socket.on('Loser', function(data){
    var playedCell = data.cell.toString();
    
    $('#'+playedCell).toggleClass('played', true);
    $('.waiting').toggleClass('animated', false);
    $('.loser').toggleClass('show', true);
    setTimeout(function(){ 
      $('.loser').toggleClass('animated', true);
      $('.waiting').toggleClass('show', false);
    },500);
  });
  
  socket.on('YourTurn', function(data){
    var playedCell = data.cell.toString();
    
    $('#'+playedCell).toggleClass('played', true);
    $('.disabled').toggleClass('disabled', false);
    $('.waiting').toggleClass('animated', false);
    $('.your-turn').toggleClass('show', true);
    setTimeout(function(){ 
      $('.your-turn').toggleClass('animated', true);
      $('.waiting').toggleClass('show', false);
    },500);
    setTimeout(function(){ $('.your-turn').toggleClass('animated', false); },2000);
    setTimeout(function(){ $('.your-turn').toggleClass('show', false); },2500);
  });
  
  
  function checkSolution(){
    if ( $('#cell1').hasClass('selected') ) {
      if ( $('#cell2').hasClass('selected') ) {
        if ( $('#cell3').hasClass('selected') ) {
          return true;
        } else { return false; }
      } else if ( $('#cell4').hasClass('selected') ) {
        if ( $('#cell7').hasClass('selected') ) {
          return true;
        } else { return false; }
      } else if ( $('#cell5').hasClass('selected') ) {
        if ( $('#cell9').hasClass('selected') ) {
          return true;
        } else { return false; }
      }
    } else if ( $('#cell2').hasClass('selected') ) {
      if ( $('#cell5').hasClass('selected') ) {
        if ( $('#cell8').hasClass('selected') ) {
          return true;
        } else { return false; }
      }
    } else if ( $('#cell3').hasClass('selected') ) {
      if ( $('#cell6').hasClass('selected') ) {
        if ( $('#cell9').hasClass('selected') ) {
          return true;
        } else { return false; }
      } else if ( $('#cell5').hasClass('selected') ) {
        if ( $('#cell7').hasClass('selected') ) {
          return true;
        } else { return false; }
      }
    } else if ( $('#cell4').hasClass('selected') ) {
      if ( $('#cell5').hasClass('selected') ) {
        if ( $('#cell6').hasClass('selected') ) {
          return true;
        } else { return false; }
      }
    } else if ( $('#cell7').hasClass('selected') ) {
      if ( $('#cell8').hasClass('selected') ) {
        if ( $('#cell9').hasClass('selected') ) {
          return true;
        } else { return false; }
      }
    } else { return false; }
  }
  
  
  $('.cell').on("click", function(){
    if ( !$('.disabled').length && !$(this).hasClass('played') ) {
      var $this = $(this),
          whichCell = $this.attr("id");
      $this.toggleClass('selected', true);
      $('#game').toggleClass('disabled', true);
      
      if ( !checkSolution() ) {
      
        $('.waiting').toggleClass('show', true);
        setTimeout(function(){ 
          $('.waiting').toggleClass('animated', true);
        },500);
        socket.emit('turnOver', {team: teamName, cell: whichCell});
      } else {
        $('.winner').toggleClass('show', true);
        setTimeout(function(){ 
          $('.winner').toggleClass('animated', true);
        },500);
        socket.emit('Win', {team: teamName, cell: whichCell });
      }
    }
  });
  
});