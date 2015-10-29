var s,
    g,
    stars,
    bars,
    dotUnit = 15,
    progress,
    duration,
    fadeout = 6.8,
    uniqueEvents = [],
    prevEvent = [],
    currentEvent,
    tally = 0;
    index = 0;
    count = 0,
    totals = 0,
    accentColor = 'darkred';

docReady(function(){
  Snap.load('media/BlankMap-World6.svg', function ( loadedFragment ) {
      onSVGLoaded(loadedFragment);
  });
  s = Snap('#world');
  //g = s.group();

});

function onSVGLoaded( data ){ 
  s.append( data );
  g = s.g();

  var map = Snap('#world6'),
      bb = map.getBBox(),
      vb = map.attr('viewBox');
  g.add(map);
  //s.attr('viewBox', vb);

  g.attr({
    'transform': 'matrix(1,0,0,1,' + vb.x + ',' + vb.y + ')'
  });

  initDrag();
  labelAxis();


  addLocations();
  animateTravel();
}

function initDrag(){
   g.attr({
    transform: 's1.5,1.5,-370,-250', 
    cursor: '-webkit-grab'
  });
  g.mousedown(function(){
    g.attr({
      cursor: '-webkit-grabbing'
    })
  })
  g.mouseup(function(){
    g.attr({
      cursor: '-webkit-grab'
    })
  })
  //g.hover( hoverover, hoverout );
  //g.text(300,100, 'hover over me');

  var us = g.select('#us');
  g.drag(move, start, stop );
}

var move = function(dx,dy) {
  this.attr({
      transform: this.data('origTransform') + (this.data('origTransform') ? "T" : "t") + [dx, dy]
  });
}

var start = function() {
  this.data('origTransform', this.transform().local );
}
var stop = function() {
  console.log('finished dragging');
}

var hoverover = function() { g.animate({ transform: 's2r45,150,150' }, 1000, mina.bounce ) };
var hoverout = function() { g.animate({ transform: 's1r0,150,150' }, 1000, mina.bounce ) };

function addLocations(){
  var radius = 4.5,
      l = data.length; // var data is defined in media/data.js

  // creates a group element
  stars = g.g().addClass('dots');

  for (var i=0; i<l; i++){

    var date = data[i].startDate,
        locL = locations.length,
        posX,
        posY,
        star;

    // iterate over each element in the array
    for (var j=0; j<locL; j++){
      // look for the entry with a matching `code` value
      if (locations[j].location == data[i].location){
         posX = locations[j].x;
         posY = locations[j].y;
      }
    }


    //dot = g.circle(posX, posY, radius);
    star = g.path('M 0.000 15.000,L 23.511 32.361,L 14.266 4.635,L 38.042 -12.361,L 8.817 -12.135,L 0.000 -40.000,L -8.817 -12.135,L -38.042 -12.361,L -14.266 4.635,L -23.511 32.361,L 0.000 15.000');

    star.attr({
      transform: 's.15,.15,' + posX*1.18 + ',' + posY*1.18, 
      id: 'e-' + i,
      'data-event': data[i].event,
      'data-location': data[i].location,
      'data-sd': data[i].startDate,
      'data-ed': data[i].endDate,
      class: 'event',
      opacity: 0
    }).hover(function(){
      this.attr({
        //fill: '#00a99d',
        cursor: 'pointer'
      });
    }, function(){      
      this.attr({
        cursor: '-webkit-grab'
      });
    });

    // Adds the use element to our group
    stars.add(star);
  }

}

function animateTravel(){
  var star = stars[0];
  star.animate({
    fill: '#00a99d',
    opacity: 1
  }, 500, mina.easeinout, shootStar(0) );
}

function shootStar(i){
  var thisStar = stars[i],
      nextStar = stars[i+1],
      matrix; 
  if (nextStar){
    matrix = nextStar.matrix;
    thisStar.animate({
      opacity: 1
    }, 500, mina.easeinout);
    thisStar.animate({
      transform: matrix
    }, 2000, mina.easeinout, function(){
      i++;
      shootStar(i);
    });
  }
}


function initGraphic(){

  // timetracker box
  /*rect = s.rect(dotUnit/4, vbh*(dotUnit + 1), vbw-dotUnit/2, dotUnit/6);
  rect.attr({
    fill: '#aaaaaa',
    id: 'xaxis'
  })


  progress = s.rect(dotUnit/4, vbh*(dotUnit + 1), 0, dotUnit/6);
  progress.attr({
    fill: accentColor
  })*/

  
}

function bigButtons(){
  //play button stuff
  var playMatrix = new Snap.Matrix();
  playMatrix.scale(.4,.4);            // play with scaling before and after the rotate
  playMatrix.translate(660, 210);

  var playbg = s.rect(0,0,180,183).transform(playMatrix).attr({
    fill: '#444444'
  });
  var play = s.polyline([45,40,140,90,45,140]).transform(playMatrix).attr({
    fill: '#fff'
  });

  var playgroup = s.group();
  playgroup.add(playbg, play);
  playgroup.attr({
    class: 'playgroup',
    cursor: 'pointer',
    opacity: .9
  });
  playgroup.hover(function(){
    playgroup.animate({
      opacity: 1
    }, 250, mina.easeinout)
  }, function(){
    playgroup.animate({
      opacity: .9
    }, 250, mina.easeinout)
  });


  playgroup.click(function(){
    var scale = 0;
    playgroup.animate({
      //transform: miniMatrix
      opacity:0
    }, 250, mina.easeinout, function(){
      this.remove();
    });
    document.getElementById('playBtn').click();
  })
}

function labelAxis(){

  // creates a group element
  bars = s.g().addClass('bars');

  duration = data.length;

  for (var i=0, l=data.length; i<l; i++){
    var date = data[i].startDate,
        total = data[i].event,
        location = data[i].location,
        b2s = i,///2.01, //beats to seconds
        percent = b2s/duration,
        posX = s.attr('viewBox').width * percent + 10, //plus 10 to visually center timeline
        posY = s.attr('viewBox').height-3;

    var incident = s.rect(posX, posY, 3, 3);
    incident.attr({
      fill: '#aaaaaa',
      class: 'bar'
    }).data({
      'date': date,
      'location': location,
      'total': total
    }).click(function(){
      tooltip(this, posY);
    }).hover(function(){
      tooltip(this, posY);
    }, function(){
      s.select('#ttip-data').remove();
    });




    if ( (i == 0) || (i == l-1) ){
      var splitDate = date.split('-'),
          //label = parseInt(splitDate[0]) + '/' + splitDate[2],
          //label = splitDate[2],
          label = date,
          t1;
      if (i == l-1){
        t1 = s.text(posX-38, posY, label); //minus 15 due to extra time at end of audio track
      } else {
        t1 = s.text(posX, posY, label);
      }
      t1.attr({
        fill: '#666666',
        'font-size': 8,
        'transform': 'matrix(1,0,0,1,140,160)'
      });
    } 

    // Adds the use element to our group
    bars.add(incident);
    bars.attr('transform', 'matrix(1,0,0,1,140,170)');
  }
}

function prettyTime(time){
  // Minutes and seconds
  var mins = ~~(time / 60);
  var secs = time % 60;

  // Hours, minutes and seconds
  var hrs = ~~(time / 3600);
  var mins = ~~((time % 3600) / 60);
  var secs = time % 60;

  // Output like "1:01" or "4:03:59" or "123:03:59"
  ret = "";

  if (hrs > 0) {
      ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
  }

  ret += "" + mins + ":" + (secs < 10 ? "0" : "");
  //ret += "" + parseFloat(secs).toFixed(2);
  ret += "" + parseInt(secs);
  return ret;
}

function str_pad_left(string,pad,length) {
  return (new Array(length+1).join(pad)+string).slice(-length);
}

function updateTime(audio){
  var acurrent = audio.currentTime;

  var currentTime = Math.floor(acurrent);
  
  document.getElementById('tracktime').innerHTML = prettyTime(audio.currentTime) + ' | ' + prettyTime(duration);
}

function progressBar(audio){
  var acurrent = audio.currentTime,
      length = uniqueEvents.length,
      percent = acurrent/(duration - fadeout),
      maxWidth = s.select('#xaxis').attr('width'),
      newWidth = (s.attr('viewBox').width - dotUnit/2) * percent + 1;

  if (newWidth <= maxWidth) {
    progress.animate({
      'width': newWidth
    }, 300);
  }
}


function addEvents(audio){
  var acurrent = audio.currentTime,
      length = uniqueEvents.length;

  for (var i = 0; i < length; i++) {
    var beat = uniqueEvents[i][1];
        next = 0;

    if (uniqueEvents[i+1]){
      next = uniqueEvents[i+1][1];
    }

    if ( (acurrent >= beat-.25) || (acurrent >= beat+.25) && (acurrent < next) ) {
      currentEvent = uniqueEvents[i];
      index = i;
    } 
  }

  if (currentEvent[0] == prevEvent[0]) {
    // same event
    var html = 'Last incident: <span>' + currentEvent[0] + '</span><br />';
    html += 'Location: <span>' + currentEvent[3] + '</span><br />';
    html += 'Fatalities: <span>' + currentEvent[2] + '</span>';
    document.getElementById('info-box').innerHTML = html;
  } else {
    // new event
    animateDots(currentEvent);
    var bar = s.selectAll('rect.bar')[index],
        clone = bar.clone(),
        speed = (duration/bar.getBBox().width)*10;

    clone.before(bar)
    .attr({
      'fill': accentColor,
      'width': 0,
      'height': 0,
      'class': 'clone'
    })
    .animate({ 
      'width': bar.getBBox().width,
      'height': bar.getBBox().height
    }, 1500, mina.linear)
    .click(function(){
      tooltip(bar, bar.attr('y')-dotUnit/2);
    })
    .hover(function(){
      tooltip(bar, bar.attr('y')-dotUnit/2);
    }, function(){
      s.select('#ttip-data').remove();
    });
  }

  if ( (acurrent > uniqueEvents[length - 1][1]-.25) && (acurrent < (uniqueEvents[length - 1][1]) ) ){
    animateDots(uniqueEvents[length-1]);
  }

  prevEvent = currentEvent;

}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function animateDots(event){
  var date = event[0],
      total = event[2],
      title = event[3],
      selectedCount = 0;

  totals += total; //need to subtact this from total fatalities so that the random number generator has the correct range 

  for (var i=0; i<total; i++){
    var delay = 35*(i);

    setTimeout(function(){
      var max = data.length-totals;
      if (max > 5){
        var random = getRandomInt(1, max);
        selected = s.selectAll('circle.light')[random];//:nth-of-type(' + random + ')');
      } else {
        selected = s.selectAll('circle.light')[0];
      }
      
      if (selected){
        dots.append(selected); //brings selected dot to front
        selected.attr({
          class: '',
          fill: accentColor
        });
        selected.animate({
          cy: 330
          //transform: 'r90,200,200'//,
          //opacity: 0
        }, 1500, mina.easeinout);
        selected.animate({
          opacity: 0,
          //fill: '#444444'
        }, 850);
      } 
    }, delay);
    selectedCount++;
  }

  var lights = s.selectAll('.light').length;
  //console.log('lights left:' + lights);
  //console.log('difference:' + (data.length - lights) );

  count++;
  //console.log(date + ' fatalities=' + total + ' count=' + count + /*' random=' + random + */' selectedcount=' + selectedCount + ' grandtotal=' + totals);

}

function tooltip(elem, posY){
  var date = elem.data('date'),
      location = elem.data('location'),
      total = elem.data('total'),
      text = date + '   |   ' + location + '   |   ' + total + ' fatalities',
      info = s.text(0, posY, text),
      tip = s.select('#ttip-data'),
      posX;

  if (tip) {
    tip.remove();
  }

  info.attr({
    fill: '#666666',
    opacity: 0,
    'font-size': 8,
    id: 'ttip-data'
  });
  info.node.setAttributeNS('http://www.w3.org/XML/1998/namespace', 'xml:space', 'preserve');
  posX = s.select('#xaxis').attr('width')/2 - info.node.clientWidth/2;
  info.attr({
    x: posX
  })
  info.animate({
    opacity: 1
  }, 100)
}

function audioHooks(audio){
  addEvents(audio);
  updateTime(audio);
  setTimeout(function(){
    progressBar(audio);
  },100)
}
function audioData(audio){
  duration = audio.duration;
  labelAxis();
  updateTime(audio);
  audio.addEventListener("ended",function() {
    document.getElementById('pauseBtn').style.display = 'none';
    document.getElementById('playBtn').style.display = 'inline';
  });
}
function checkAudio(){
  var audio = document.getElementById('track');
  if(audio.ended){
    rewind(audio);
  } else {
    audio.play();
    var bigPlay = s.select('.playgroup')
    if (bigPlay){
      bigPlay.animate({
        opacity:0
      }, 250, mina.easeinout, function(){
        this.remove();
      });
    }
  }
  document.getElementById('pauseBtn').style.display = 'inline';
  document.getElementById('playBtn').style.display = 'none';
}
function pauseAudio(){
  document.getElementById('track').pause();
  document.getElementById('pauseBtn').style.display = 'none';
  document.getElementById('playBtn').style.display = 'inline';
}
function restart(){
  document.getElementById('ms-timeline').innerHTML = '';
  var audio = document.getElementById('track');
  if(audio.ended){
    rewind(audio);
  } else {
    rewind(audio); 
  }
}
function rewind(audio){
  resetGlobals();
  audio.pause();
  audio.currentTime = 0;
  initGraphic();
  audioData(audio);
  audio.play();
  document.getElementById('pauseBtn').style.display = 'inline';
  document.getElementById('playBtn').style.display = 'none';
}
function resetGlobals(){
  s.selectAll('.bars').remove();
  s.selectAll('.dots').remove();
  s.selectAll('rect').remove();
  s.selectAll('text').remove();
  dotUnit = 15;
  dots = [];
  bars = [];
  progress = '';
  duration = 226.063688;
  uniqueEvents = [];
  prevEvent = [];
  currentEvent = [];
  tally = 0;
  index = 0;
  count = 0;
  totals = 0;
}