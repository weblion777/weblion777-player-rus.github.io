function getCookie(a){var b=document.cookie.match(new RegExp('(?:^|; )'+a.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g,'\\$1')+'=([^;]*)'));return b?decodeURIComponent(b[1]):void 0}
function setCookie(a,b,c){c=c||{};var e=c.expires;if('number'==typeof e&&e){var f=new Date;f.setTime(f.getTime()+1e3*e),e=c.expires=f}e&&e.toUTCString&&(c.expires=e.toUTCString()),b=encodeURIComponent(b);var g=a+'='+b;for(var h in c){g+='; '+h;var i=c[h];!0!==i&&(g+='='+i)}document.cookie=g}
function deleteCookie(a){setCookie(a,'',{expires:-1})}
// console.log(domain);
if (typeof cookie_name != 'undefined') {
    if (getCookie(cookie_name+'_'+domain) === undefined) setCookie(cookie_name+'_'+domain, window.location.protocol + '//' + domain + '/', {expires: 0,domain: '.hdvb.cc'});
}


var iframeMouseOver = false;
window.onload = function() {

 // проверка что нажата реклама за 10 минут до конца
    document.getElementById('banner_before_end').addEventListener('mouseover', function () {
        iframeMouseOver = true;
    });
    document.getElementById('banner_before_end').addEventListener('mouseout', function () {
        iframeMouseOver = false;
    });
}



function television (){
    var i,
    television = '',
    userAgent = window.navigator.userAgent.toLowerCase();

    television = [
      "googletv",
      "viera",
      "smarttv",
      "internet.tv",
      "netcast",
      "nettv",
      "appletv",
      "boxee",
      "kylo",
      "roku",
      "dlnadoc",
      "roku",
      "pov_tv",
      "hbbtv",
      "ce-html"
    ];

    i = 0;
    while (i < television.length) {
      if ( userAgent.indexOf(television[i]) !== -1 ) {
        return true;
      }
      i++;
    }
    return false;
};

var redomain = new URL(iframe_domain);
    redomain = redomain.hostname;

if (typeof redomain != 'undefined' && redomain != '') {
    redomain = redomain.split('.');
    if (redomain.length > 2) {
        redomain = "." + redomain[1] + "." + redomain[2];
    } else {
        redomain = "." + redomain[0] + "." + redomain[1];
    }
}
var NativeAdv = function ( configs ) {
    this.configs = configs;
    this.player = document.getElementById (this.configs.id);
    this.adv = this.configs.adv.ads;
    
    if (typeof this.adv.preroll === null||typeof this.adv.preroll === undefined) return; 
    if (typeof this.adv.postroll === null||typeof this.adv.postroll === undefined) return; 

    this.lastLink = '';
    this.Vast = null; 
 
    this.actPid = false;
    this.preroll = false;
    this.postroll = false;

    this.vast_configs = {
        'media_type' : 'video/mp4',
        'media_bitrate_min' : 300,
        'media_bitrate_max' : 3000
    };

    var self = this;

    this.preRoll = function () {
        if (self.preroll === false && self.postroll === false && typeof self.adv.preroll === "string" && self.actPid === false) {

            self.Vast = self.readVastFile(self.adv.preroll, self.vast_configs);
            if (self.Vast == null) return;
           
            self.player.pause();
            self.lastLink = self.player.src;
            self.player.src = self.Vast.media_file;
            self.actPid = true;
            self.preroll = true;

            setTimeout(function (){ self.player.play(); }, 150);
        }        
    }

    this.postRoll = function () {
        if (self.postroll === false && typeof self.adv.postroll === "string" && self.actPid === false) {

            self.Vast = self.readVastFile(self.adv.postroll, self.vast_configs);
            if (self.Vast == null) return;

            self.player.pause();
            self.lastLink = self.player.src;
            self.player.src = self.Vast.media_file;
            self.actPid = true;
            self.postroll = true;

            setTimeout(function (){ self.player.play(); }, 150);
        }        
    }

    this.skipAdv = function () {
        if (self.actPid === true) {
            self.player.src = self.lastLink;
            self.actPid = false;
            self.Vast = '';
            setTimeout(function (){ self.player.play(); }, 150);
        } else self.postRoll();
    }

    this.runNativeAdv = function () {
        self.player.addEventListener('playing', self.preRoll);
        self.player.addEventListener('click', self.addClickthrough);
        self.player.addEventListener('touchstart', self.addClickthrough);
        self.player.addEventListener('pause', self.eventPause);
        self.player.addEventListener('timeupdate', self.videoPlayerTimeupdate);
        self.player.addEventListener('ended', self.skipAdv);
    }

    this.addClickthrough = function () {
        if (self.player.paused === false && self.actPid === true) {
            window.open(self.Vast.clickthrough_url, '_blank');          
            window.open(self.Vast.clickthrough_url, '_system');          
            if(self.Vast.clickthrough_tracking !=null){
                for(var k=0;k<self.Vast.clickthrough_tracking.length;k++){
                    self.addPixel(self.Vast.clickthrough_tracking[k].childNodes[0].nodeValue);
                }
            }  
            self.player.pause();
        } else self.player.play();    
    }

    this.eventPause = function () {        
        if(self.Vast != '' && self.actPid === true) {
            if(typeof self.Vast.tracking_pause_tracked != null && self.Vast.tracking_pause_tracked === false && self.actPid === true){
                if(self.Vast.tracking_pause != null){
                    var arrTrack = self.Vast.tracking_pause.split(" ");
                    for(var i=0;i<arrTrack.length;i++){
                        self.addPixel(arrTrack[i]);
                    }
                }
                self.Vast.tracking_pause_tracked=true;
            }  
            self.player.removeEventListener('pause', self.eventPause);
        }
    }

    this.readVastFile = function (vast_url, options){
        vast_url = vast_url.split('#');
        // console.log('vast1='+vast_url[0]);
        // vast_url[0] = 'https://aj1907.online/zKUlECTrnDQeeCQH_OnmIzwiwX3fo2-0n5Wz2dD9BWWTSlSIafahTTVjICwOpU8ajhPNktan63tZIagqRAR-NQLlUB8rNMPc';
        // console.log('vast2='+vast_url[0]);
        vast_url = vast_url[0] +
        '?cp.host=' + ( domain.length > 0 ? domain : 'VASTHost_Fail') +
        '&cp.ip='+ ( user_ip.length > 0 ? user_ip : 'VASTIP_Fail') +
        '&cp.adblock=' + (typeof adblock === 'undefined' ? 'true' : 'false') +
        '#' + vast_url[1];

        // iframe_domain = 'http://hdvbtest.xyz';
        // if (typeof adblock === 'undefined'/* && (new RegExp(/vasttest=ok/g)).test(window.location.href) === true*/ ) {
        // if (
        //     (new RegExp(
        //         /zi8jz2vgzS5VdvS8_k7DK5APde-qOEqO1AvrzPjV_Ex-Bb8w5tqeqXrSjvWDxekvgkzDka9c9Ql2jmRLk22G8TObTVKcatLI/g
        //     )).test(vast_url) !== true
        // ) {
        // if (country_code != 'ru' /*|| city_name == 'moscow' || city_name == 'st petersburg'*/) {
            // console.log(vast_url);
            vast_url =  iframe_domain + '/vast/readvastfile/?xml=1&vast_url=' + encodeURIComponent(vast_url);
            // vast_url = 'http://hdvbtest.xyz/vast/readvastfile/?xml=1&vast_url=' + encodeURIComponent(vast_url);
            // console.log('readvastfile');
        // }

        // console.log(vast_url);

        //Read XML file
        var xmlHttpReq, xmlDoc;
        xmlHttpReq= window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");

        xmlHttpReq.open("GET",vast_url,false);
        xmlHttpReq.send();
        xmlDoc=xmlHttpReq.responseXML;
        var obj_vast ={};

        //Get impression tag
        var impression = xmlDoc.getElementsByTagName("Impression");
        if(impression != null){
            obj_vast.impression = impression;
        } else {
            return false;
        }
        
        //Get Creative
        var creative = xmlDoc.getElementsByTagName("Creative");             
        var media_files;
        var time;
        var tracking_events;
        for(var i=0;i<creative.length;i++){
            // obj_vast.time = $(creative[i].getElementsByTagName("Linear")).attr('skipoffset');

            obj_vast.time = typeof creative[i].getElementsByTagName("Linear")[0].attributes.skipoffset != 'undefined'
                            ? creative[i].getElementsByTagName("Linear")[0].attributes.skipoffset.nodeValue : '00:00:10';

            // console.log('adblock='+(typeof adblock === 'undefined'));
            // console.log(adblock);

            // if ( typeof adblock === 'undefined'/* &&  domain == 'octopushome.org'*/ ) {
            // if ( domain == 'kino-fs.pro' ) {
            //     obj_vast.time = '00:00:05';
            // }

            var time = obj_vast.time.split(':');
            obj_vast.time = (+time[0]) * 60 * 60 + (+time[1]) * 60 + (+time[2]);

            var creative_linear = creative[i].getElementsByTagName("Linear");
            if(creative_linear != null){
                for(var j=0;j<creative_linear.length;j++){
                    
                    //Get media files
                    var creative_linear_mediafiles = creative_linear[j].getElementsByTagName("MediaFiles");
                    if(creative_linear_mediafiles!=null){
                        for(var k=0;k<creative_linear_mediafiles.length;k++){
                            var creative_linear_mediafiles_mediafile = creative_linear_mediafiles[k].getElementsByTagName("MediaFile");
                            if(creative_linear_mediafiles_mediafile!=null){
                                media_files = creative_linear_mediafiles_mediafile;
                            }
                        }
                    }
                    
                    //Get Clickthrough URL
                    var creative_linear_videoclicks = creative_linear[j].getElementsByTagName("VideoClicks");
                    if(creative_linear_videoclicks!=null){
                        for(var k=0;k<creative_linear_videoclicks.length;k++){
                            var creative_linear_videoclicks_clickthrough = creative_linear_videoclicks[k].getElementsByTagName("ClickThrough")[0].childNodes[0].nodeValue;
                            var creative_linear_videoclicks_clickthrough_tracking = creative_linear_videoclicks[k].getElementsByTagName("ClickTracking");
                            if(creative_linear_videoclicks_clickthrough!=null){
                                obj_vast.clickthrough_url = creative_linear_videoclicks_clickthrough;
                            }
                            if(creative_linear_videoclicks_clickthrough_tracking!=null){
                                obj_vast.clickthrough_tracking = creative_linear_videoclicks_clickthrough_tracking;
                            }
                        }
                    }
                    
                    // Get Tracking Events
                    var creative_linear_trackingevents = creative_linear[j].getElementsByTagName("TrackingEvents");
                    if(creative_linear_trackingevents!=null){
                        for(var k=0;k<creative_linear_trackingevents.length;k++){
                                var creative_linear_trackingevents_tracking = creative_linear_trackingevents[k].getElementsByTagName("Tracking");
                                if(creative_linear_trackingevents_tracking!=null){
                                    tracking_events = creative_linear_trackingevents_tracking;
                                }
                        }
                    }
                    
                    //Get AD Duration                    
                    var creative_linear_duration =  creative_linear[j].getElementsByTagName("Duration")[0];
                    if(creative_linear_duration!=null){
                        obj_vast.duration = creative_linear_duration.childNodes[0].nodeValue;
                        var arrD = obj_vast.duration.split(':');
                        var strSecs = (+arrD[0]) * 60 * 60 + (+arrD[1]) * 60 + (+arrD[2]);
                        obj_vast.duration = strSecs;
                    }
                    
                }
            }
        }
                        
        for(var i=0;i<media_files.length;i++){
            if(media_files[i].getAttribute('type')==options.media_type){
                // if((media_files[i].getAttribute('bitrate')>options.media_bitrate_min) && (media_files[i].getAttribute('bitrate')<options.media_bitrate_max)){
                    obj_vast.media_file=media_files[i].childNodes[0].nodeValue;
                // }
            }
        }

        // console.log(obj_vast);
          
        // //Tracking events
        if (tracking_events !== null && tracking_events !== undefined) {
            for(var i=0;i<tracking_events.length;i++){
                    if(tracking_events[i].getAttribute('event')=="start"){
                            if(obj_vast.tracking_start != null){
                                obj_vast.tracking_start += " "+tracking_events[i].childNodes[0].nodeValue;
                            }else{
                                obj_vast.tracking_start =tracking_events[i].childNodes[0].nodeValue;
                            }                       
                            obj_vast.tracking_start_tracked=false;
                    }
                    if(tracking_events[i].getAttribute('event')=="firstQuartile"){
                            if(obj_vast.tracking_first_quartile != null){
                                obj_vast.tracking_first_quartile += " "+tracking_events[i].childNodes[0].nodeValue;
                            }else{
                                obj_vast.tracking_first_quartile =tracking_events[i].childNodes[0].nodeValue;
                            }
                            obj_vast.tracking_first_quartile_tracked=false;
                    }
                    if(tracking_events[i].getAttribute('event')=="midpoint"){
                            if(obj_vast.tracking_midpoint != null){
                                obj_vast.tracking_midpoint += " "+tracking_events[i].childNodes[0].nodeValue;
                            }else{
                                obj_vast.tracking_midpoint =tracking_events[i].childNodes[0].nodeValue;
                            }
                            obj_vast.tracking_midpoint_tracked=false;
                    }
                    if(tracking_events[i].getAttribute('event')=="thirdQuartile"){
                            if(obj_vast.tracking_third_quartile != null){
                                obj_vast.tracking_third_quartile += " "+tracking_events[i].childNodes[0].nodeValue;
                            }else{
                                obj_vast.tracking_third_quartile =tracking_events[i].childNodes[0].nodeValue;
                            }
                            obj_vast.tracking_third_quartile_tracked=false;
                    }
                    if(tracking_events[i].getAttribute('event')=="complete"){
                            if(obj_vast.tracking_complete != null){
                                obj_vast.tracking_complete += " "+tracking_events[i].childNodes[0].nodeValue;
                            }else{
                                obj_vast.tracking_complete =tracking_events[i].childNodes[0].nodeValue;
                            }
                            obj_vast.tracking_complete_tracked=false;
                    }
                    if(tracking_events[i].getAttribute('event')=="mute"){
                            if(obj_vast.tracking_mute != null){
                                obj_vast.tracking_mute += " "+tracking_events[i].childNodes[0].nodeValue;
                            }else{
                                obj_vast.tracking_mute =tracking_events[i].childNodes[0].nodeValue;
                            }
                            obj_vast.tracking_mute_tracked=false;
                    }
                    if(tracking_events[i].getAttribute('event')=="unmute"){
                            if(obj_vast.tracking_unmute != null){
                                obj_vast.tracking_unmute += " "+tracking_events[i].childNodes[0].nodeValue;
                            }else{
                                obj_vast.tracking_unmute =tracking_events[i].childNodes[0].nodeValue;
                            }
                            obj_vast.tracking_unmute_tracked=false;
                    }
                    if(tracking_events[i].getAttribute('event')=="pause"){
                            if(obj_vast.tracking_pause != null){
                                obj_vast.tracking_pause += " "+tracking_events[i].childNodes[0].nodeValue;
                            }else{
                                obj_vast.tracking_pause =tracking_events[i].childNodes[0].nodeValue;
                            }
                            obj_vast.tracking_pause_tracked=false;
                    }
                    if(tracking_events[i].getAttribute('event')=="resume"){
                            if(obj_vast.tracking_resume != null){
                                obj_vast.tracking_resume += " "+tracking_events[i].childNodes[0].nodeValue;
                            }else{
                                obj_vast.tracking_resume =tracking_events[i].childNodes[0].nodeValue;
                            }
                            obj_vast.tracking_resume_tracked=false;
                    }
                    if(tracking_events[i].getAttribute('event')=="fullscreen"){
                            if(obj_vast.tracking_fullscreen != null){
                                obj_vast.tracking_fullscreen += " "+tracking_events[i].childNodes[0].nodeValue;
                            }else{
                                obj_vast.tracking_fullscreen =tracking_events[i].childNodes[0].nodeValue;
                            }
                            obj_vast.tracking_fullscreen_tracked=false;
                    }
                    if(tracking_events[i].getAttribute('event')=="skip"){
                            if(obj_vast.tracking_skip != null){
                                obj_vast.tracking_skip += " "+tracking_events[i].childNodes[0].nodeValue;
                            }else{
                                obj_vast.tracking_skip =tracking_events[i].childNodes[0].nodeValue;
                            }
                            obj_vast.tracking_skip_tracked=false;
                    }
                    if(tracking_events[i].getAttribute('event')=="close"){
                            if(obj_vast.tracking_close != null){
                                obj_vast.tracking_close += " "+tracking_events[i].childNodes[0].nodeValue;
                            }else{
                                obj_vast.tracking_close =tracking_events[i].childNodes[0].nodeValue;
                            }
                            obj_vast.tracking_close_tracked=false;
                    }
            }
        }
        return obj_vast;
    }

    this.addPixel = function ( pixel_url ){
        var image = new Image(1,1); 
        image.src = pixel_url;
    }

    this.videoPlayerTimeupdate = function(event) {
        if(self.Vast != '' && self.actPid === true) {
            var current_time =Math.floor(self.player.currentTime);
            if((current_time==0)){               
                if(self.Vast.tracking_start_tracked ==false){
                    if(self.Vast.tracking_start != null){
                        var arrTrack = self.Vast.tracking_start.split(" ");
                        for(var i=0;i<arrTrack.length;i++){
                            var img_track = new Image();
                            img_track.src=arrTrack[i];
                        }
                    }
                    self.Vast.tracking_start_tracked=true;
                }               
            }

            if( current_time > (Math.floor(self.player.duration/4)) && self.Vast.tracking_first_quartile_tracked === false){        
                if(self.Vast.tracking_first_quartile != null){
                    var arrTrack = self.Vast.tracking_first_quartile.split(" ");
                    for(var i=0;i<arrTrack.length;i++) {
                        self.addPixel(arrTrack[i]);
                    }
                }
                self.Vast.tracking_first_quartile_tracked=true;
            }

            if(current_time > (Math.floor(self.player.duration/2)) && self.Vast.tracking_midpoint_tracked === false){ 
                if(self.Vast.tracking_midpoint != null){
                    var arrTrack = self.Vast.tracking_midpoint.split(" ");
                    for(var i=0;i<arrTrack.length;i++) {
                        self.addPixel(arrTrack[i]);
                    }
                }
                self.Vast.tracking_midpoint_tracked=true;
            }

            if(current_time > ((Math.floor(self.player.duration/2)) + (Math.floor(self.player.duration/4))) && self.Vast.tracking_third_quartile_tracked === false){
                if(self.Vast.tracking_third_quartile != null){
                    var arrTrack = self.Vast.tracking_third_quartile.split(" ");
                    for(var i=0;i<arrTrack.length;i++) {
                        self.addPixel(arrTrack[i]);
                    }
                }
                self.Vast.tracking_third_quartile_tracked=true;
            }

            if(current_time>=(self.player.duration-1) && (self.Vast.tracking_complete_tracked === false)){ 
                if(self.Vast.tracking_complete != null){
                    var arrTrack = self.Vast.tracking_complete.split(" ");
                    for(var i=0;i<arrTrack.length;i++) {
                        self.addPixel(arrTrack[i]);
                    }
                }
                self.Vast.tracking_complete_tracked=true;
            }
        }
    } 


    this.runNativeAdv();
}

var AdvPlayer = function ( api ) {
    this.api = api;
    this.video_play_2;
    this.timeline = document.getElementsByClassName('fp-timeline')[0];

    this.actPid = false;

    this.preroll = false;
    this.midroll = false;
    this.postroll = false;
    this.pauseroll = false;

    this.prerollStart = false;
    this.midrollStart = false;
    this.postrollStart = false;
    this.pauserollStart = false;

    this.vast_id = '';
    this.arrTrack = '';

    this.currentMidroll = 0;

    var self = this;
    
    this.readVastFile = function (vast_url, options){
        vast_url = vast_url.split('#');
        // console.log('vast1='+vast_url[0]);
        // vast_url[0] = 'https://aj1907.online/zKUlECTrnDQeeCQH_OnmIzwiwX3fo2-0n5Wz2dD9BWWTSlSIafahTTVjICwOpU8ajhPNktan63tZIagqRAR-NQLlUB8rNMPc';
        // console.log('vast2='+vast_url[0]);
        vast_url = vast_url[0] +
        '?cp.host=' + ( domain.length > 0 ? domain : 'VASTHost_Fail') +
        '&cp.ip=' + ( user_ip.length > 0 ? user_ip : 'VASTIP_Fail') +
        '&cp.adblock=' + (typeof adblock === 'undefined' ? 'true' : 'false') +
        '#' + vast_url[1];

        //Read XML file
        var xmlHttpReq, xmlDoc;
        xmlHttpReq= window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");

        // iframe_domain = 'http://hdvbtest.xyz';
        // if (typeof adblock === 'undefined'/* && (new RegExp(/vasttest=ok/g)).test(window.location.href) === true*/ ) {
        // if (
        //     (new RegExp(
        //         /zi8jz2vgzS5VdvS8_k7DK5APde-qOEqO1AvrzPjV_Ex-Bb8w5tqeqXrSjvWDxekvgkzDka9c9Ql2jmRLk22G8TObTVKcatLI/g
        //     )).test(vast_url) !== true
        // ) {
        // if (country_code != 'ru' /*|| city_name == 'moscow' || city_name == 'st petersburg'*/) {
            // console.log(vast_url);
            vast_url = iframe_domain + '/vast/readvastfile/?xml=1&vast_url=' + encodeURIComponent(vast_url);
            // vast_url = 'http://hdvbtest.xyz/vast/readvastfile/?xml=1&vast_url=' + encodeURIComponent(vast_url);
            // console.log('readvastfile');
        // }

        // console.log(vast_url);

        xmlHttpReq.open("GET",vast_url, false);
        xmlHttpReq.send();
        xmlDoc=xmlHttpReq.responseXML;
        var obj_vast ={};

        //Get impression tag
        var impression = xmlDoc.getElementsByTagName("Impression");
        if(impression != null){
            obj_vast.impression = impression;
        } 
        else {
            return false;
        }

        if (impression.length === 0) {
            return false;
        }

        //Get Creative
        var creative = xmlDoc.getElementsByTagName("Creative");   
        if (creative.length > 1) {
            var crea = creative[0];
            creative = '';
            creative = [];
            creative[0] = crea;
        }      
        // console.log(creative);

        var media_files;
        var time;
        var tracking_events;
        for(var i=0;i<creative.length;i++){
            // obj_vast.time = $(creative[i].getElementsByTagName("Linear")).attr('skipoffset'); 

            obj_vast.time = typeof creative[i].getElementsByTagName("Linear")[0].attributes.skipoffset != 'undefined'
                            ? creative[i].getElementsByTagName("Linear")[0].attributes.skipoffset.nodeValue : '00:00:10';

            // console.log('adblock='+(typeof adblock === 'undefined'));
            // console.log(adblock);

            // if ( typeof adblock === 'undefined'/* &&  domain == 'octopushome.org'*/ ) {
            // if ( domain == 'kino-fs.pro' ) {
            //     obj_vast.time = '00:00:05';
            // }

            var time = obj_vast.time.split(':');
            obj_vast.time = (+time[0]) * 60 * 60 + (+time[1]) * 60 + (+time[2]);

            var creative_linear = creative[i].getElementsByTagName("Linear");
            if(creative_linear != null){
                for(var j=0;j<creative_linear.length;j++){
                    
                    //Get media files
                    var creative_linear_mediafiles = creative_linear[j].getElementsByTagName("MediaFiles");
                    // console.log(creative_linear[j]);
                    // console.log(creative_linear[j].getElementsByTagName("MediaFiles"));
                    if(creative_linear_mediafiles!=null){
                        for(var k=0;k<creative_linear_mediafiles.length;k++){
                            var creative_linear_mediafiles_mediafile = creative_linear_mediafiles[k].getElementsByTagName("MediaFile");
                            if(creative_linear_mediafiles_mediafile!=null){
                                media_files = creative_linear_mediafiles_mediafile;
                            }
                        }
                    }

                    //Get Clickthrough URL
                    var creative_linear_videoclicks = creative_linear[j].getElementsByTagName("VideoClicks");
                    if(creative_linear_videoclicks!=null){
                        for(var k=0;k<creative_linear_videoclicks.length;k++){
                            var creative_linear_videoclicks_clickthrough = creative_linear_videoclicks[k].getElementsByTagName("ClickThrough")[0].childNodes[0].nodeValue;
                            var creative_linear_videoclicks_clickthrough_tracking = creative_linear_videoclicks[k].getElementsByTagName("ClickTracking");
                            if(creative_linear_videoclicks_clickthrough!=null){
                                obj_vast.clickthrough_url = creative_linear_videoclicks_clickthrough;
                            }
                            if(creative_linear_videoclicks_clickthrough_tracking!=null){
                                obj_vast.clickthrough_tracking = creative_linear_videoclicks_clickthrough_tracking;
                            }
                        }
                    }
                    
                    // Get Tracking Events
                    var creative_linear_trackingevents = creative_linear[j].getElementsByTagName("TrackingEvents");
                    if(creative_linear_trackingevents!=null){
                        for(var k=0;k<creative_linear_trackingevents.length;k++){
                                var creative_linear_trackingevents_tracking = creative_linear_trackingevents[k].getElementsByTagName("Tracking");
                                if(creative_linear_trackingevents_tracking!=null){
                                    tracking_events = creative_linear_trackingevents_tracking;
                                }
                        }
                    }
                    
                    //Get AD Duration                    
                    var creative_linear_duration =  creative_linear[j].getElementsByTagName("Duration")[0];
                    if(creative_linear_duration!=null){
                        obj_vast.duration = creative_linear_duration.childNodes[0].nodeValue;
                        var arrD = obj_vast.duration.split(':');
                        var strSecs = (+arrD[0]) * 60 * 60 + (+arrD[1]) * 60 + (+arrD[2]);
                        obj_vast.duration = strSecs;
                    }
                    
                }
            }
        }
                        
        for(var i=0;i<media_files.length;i++){
            if(media_files[i].getAttribute('type')==options.media_type){
                if((media_files[i].getAttribute('bitrate')>options.media_bitrate_min) && (media_files[i].getAttribute('bitrate')<options.media_bitrate_max)){
                    obj_vast.media_file=media_files[i].childNodes[0].nodeValue;
                }
            }
        }
                    
        // console.log(obj_vast);

          
        // //Tracking events
        if (tracking_events !== null && tracking_events !== undefined) {
            for(var i=0;i<tracking_events.length;i++){
                    if(tracking_events[i].getAttribute('event')=="start"){
                            if(obj_vast.tracking_start != null){
                                obj_vast.tracking_start += " "+tracking_events[i].childNodes[0].nodeValue;
                            }else{
                                obj_vast.tracking_start =tracking_events[i].childNodes[0].nodeValue;
                            }                       
                            obj_vast.tracking_start_tracked=false;
                    }
                    if(tracking_events[i].getAttribute('event')=="firstQuartile"){
                            if(obj_vast.tracking_first_quartile != null){
                                obj_vast.tracking_first_quartile += " "+tracking_events[i].childNodes[0].nodeValue;
                            }else{
                                obj_vast.tracking_first_quartile =tracking_events[i].childNodes[0].nodeValue;
                            }
                            obj_vast.tracking_first_quartile_tracked=false;
                    }
                    if(tracking_events[i].getAttribute('event')=="midpoint"){
                            if(obj_vast.tracking_midpoint != null){
                                obj_vast.tracking_midpoint += " "+tracking_events[i].childNodes[0].nodeValue;
                            }else{
                                obj_vast.tracking_midpoint =tracking_events[i].childNodes[0].nodeValue;
                            }
                            obj_vast.tracking_midpoint_tracked=false;
                    }
                    if(tracking_events[i].getAttribute('event')=="thirdQuartile"){
                            if(obj_vast.tracking_third_quartile != null){
                                obj_vast.tracking_third_quartile += " "+tracking_events[i].childNodes[0].nodeValue;
                            }else{
                                obj_vast.tracking_third_quartile =tracking_events[i].childNodes[0].nodeValue;
                            }
                            obj_vast.tracking_third_quartile_tracked=false;
                    }
                    if(tracking_events[i].getAttribute('event')=="complete"){
                            if(obj_vast.tracking_complete != null){
                                obj_vast.tracking_complete += " "+tracking_events[i].childNodes[0].nodeValue;
                            }else{
                                obj_vast.tracking_complete =tracking_events[i].childNodes[0].nodeValue;
                            }
                            obj_vast.tracking_complete_tracked=false;
                    }
                    if(tracking_events[i].getAttribute('event')=="mute"){
                            if(obj_vast.tracking_mute != null){
                                obj_vast.tracking_mute += " "+tracking_events[i].childNodes[0].nodeValue;
                            }else{
                                obj_vast.tracking_mute =tracking_events[i].childNodes[0].nodeValue;
                            }
                            obj_vast.tracking_mute_tracked=false;
                    }
                    if(tracking_events[i].getAttribute('event')=="unmute"){
                            if(obj_vast.tracking_unmute != null){
                                obj_vast.tracking_unmute += " "+tracking_events[i].childNodes[0].nodeValue;
                            }else{
                                obj_vast.tracking_unmute =tracking_events[i].childNodes[0].nodeValue;
                            }
                            obj_vast.tracking_unmute_tracked=false;
                    }
                    if(tracking_events[i].getAttribute('event')=="pause"){
                            if(obj_vast.tracking_pause != null){
                                obj_vast.tracking_pause += " "+tracking_events[i].childNodes[0].nodeValue;
                            }else{
                                obj_vast.tracking_pause =tracking_events[i].childNodes[0].nodeValue;
                            }
                            obj_vast.tracking_pause_tracked=false;
                    }
                    if(tracking_events[i].getAttribute('event')=="resume"){
                            if(obj_vast.tracking_resume != null){
                                obj_vast.tracking_resume += " "+tracking_events[i].childNodes[0].nodeValue;
                            }else{
                                obj_vast.tracking_resume =tracking_events[i].childNodes[0].nodeValue;
                            }
                            obj_vast.tracking_resume_tracked=false;
                    }
                    if(tracking_events[i].getAttribute('event')=="fullscreen"){
                            if(obj_vast.tracking_fullscreen != null){
                                obj_vast.tracking_fullscreen += " "+tracking_events[i].childNodes[0].nodeValue;
                            }else{
                                obj_vast.tracking_fullscreen =tracking_events[i].childNodes[0].nodeValue;
                            }
                            obj_vast.tracking_fullscreen_tracked=false;
                    }
                    if(tracking_events[i].getAttribute('event')=="skip"){
                            if(obj_vast.tracking_skip != null){
                                obj_vast.tracking_skip += " "+tracking_events[i].childNodes[0].nodeValue;
                            }else{
                                obj_vast.tracking_skip =tracking_events[i].childNodes[0].nodeValue;
                            }
                            obj_vast.tracking_skip_tracked=false;
                    }
                    if(tracking_events[i].getAttribute('event')=="close"){
                            if(obj_vast.tracking_close != null){
                                obj_vast.tracking_close += " "+tracking_events[i].childNodes[0].nodeValue;
                            }else{
                                obj_vast.tracking_close =tracking_events[i].childNodes[0].nodeValue;
                            }
                            obj_vast.tracking_close_tracked=false;
                    }
            }
        }
        return obj_vast;
    }

    this.pauseGeneratePlayer = function () {
        if ( self.api.paused === false ) {
            self.api.pause();
            self.api.mute(true);
        }
    },

    this.addPixel = function ( pixel_url ){
        var image = new Image(1,1); 
        image.src = pixel_url;
    }

    this.videoPlayerTimeupdate = function(event) {
        var current_time =Math.floor(self.Video.currentTime);
        if((current_time==0)){               
            if(self.Vast.tracking_start_tracked ==false){
                if(self.Vast.tracking_start != null){
                    var arrTrack = self.Vast.tracking_start.split(" ");
                    for(var i=0;i<arrTrack.length;i++){
                        var img_track = new Image();
                        img_track.src=arrTrack[i];
                        self.arrTrack = arrTrack[i];
                    }

                    var img_2 = new Image();
                    img_2.src = self.Vast.impression[0].textContent;
                }
                self.Vast.tracking_start_tracked=true;
            }               
        }

        if( current_time > (Math.floor(self.Video.duration/4)) && self.Vast.tracking_first_quartile_tracked === false){        
            if(self.Vast.tracking_first_quartile != null){
                var arrTrack = self.Vast.tracking_first_quartile.split(" ");
                for(var i=0;i<arrTrack.length;i++) {
                    self.addPixel(arrTrack[i]);
                }
            }
            self.Vast.tracking_first_quartile_tracked=true;
        }

        if(current_time > (Math.floor(self.Video.duration/2)) && self.Vast.tracking_midpoint_tracked === false){ 
            if(self.Vast.tracking_midpoint != null){
                var arrTrack = self.Vast.tracking_midpoint.split(" ");
                for(var i=0;i<arrTrack.length;i++) {
                    self.addPixel(arrTrack[i]);
                }
            }
            self.Vast.tracking_midpoint_tracked=true;
        }

        if(current_time > ((Math.floor(self.Video.duration/2)) + (Math.floor(self.Video.duration/4))) && self.Vast.tracking_third_quartile_tracked === false){
            if(self.Vast.tracking_third_quartile != null){
                var arrTrack = self.Vast.tracking_third_quartile.split(" ");
                for(var i=0;i<arrTrack.length;i++) {
                    self.addPixel(arrTrack[i]);
                }
            }
            self.Vast.tracking_third_quartile_tracked=true;
        }

        if(current_time>=(self.Video.duration-1) && (self.Vast.tracking_complete_tracked === false)){ 
            if(self.Vast.tracking_complete != null){
                var arrTrack = self.Vast.tracking_complete.split(" ");
                for(var i=0;i<arrTrack.length;i++) {
                    self.addPixel(arrTrack[i]);
                }
            }
            self.Vast.tracking_complete_tracked=true;
        }
    } 

    this.setSrcVideoPlayer = function ( src ) {
        this.Video.src = src;

        // Отправка статистики о просмотре рекламы через VAST гео не Россия
        // Отправляем Start запись
        if (domain != ''/* && country_code != 'ru'*/) {
            var clone_skip = window.location.protocol+'//'+window.location.host+'/vast/counter?event=start&id='+self.vast_id+'&ip='+user_ip+'&base='+(btoa(self.arrTrack))+'&host='+domain+'&token='+cookie_name;
            self.addPixel(clone_skip);
        }
    }

    this.videoPlayerEnded = function ( type ) {
        document.querySelector('div.fp-eng').style.display = 'none'; 
        $(document.querySelector('div.fp-eng')).find('video').attr('src', ''); 
        $(document.getElementsByClassName('flowplayer')[0]).removeClass('is-ad-visible');
        
        self.removeAllEventListeners( self.Video );

        var clone_skip = '';

        // setTimeout(self.pauseGeneratePlayer, 500);
        if(self.Vast.tracking_skip_tracked === false){
            if(self.Vast.tracking_skip != null){
                var arrTrack = self.Vast.tracking_skip.split(" ");
                for(var i=0;i<arrTrack.length;i++){
                    self.addPixel(arrTrack[i]);

                    // Отправка статистики о просмотре рекламы через VAST гео не Россия
                    // Отправляем Skip запись
                    if (domain != ''/* && country_code != 'ru'*/) {
                        clone_skip = window.location.protocol+'//'+window.location.host+'/vast/counter?event=skip&id='+self.vast_id+'&ip='+user_ip+'&base='+(btoa(arrTrack[i]))+'&host='+domain+'&token='+cookie_name;
                        self.addPixel(clone_skip);
                    }

                }
            }
            self.Vast.tracking_skip_tracked=true;
        }

        if ( self.preroll && self.prerollStart === false ) {
            self.prerollStart = true;
        } else if ( self.prerollStart === true && self.midroll !== false && self.midrollStart[self.currentMidroll] ) {
            self.midrollStart[self.currentMidroll] = true;
            self.currentMidroll ++;
        }

        self.actPid = false;

        self.Vast = '';

        // if (self.pauseRoll === true){
            // setTimeout(function (){ self.api.playDisplayNone(); self.api.mute(false); }, 300 );
        // } else {
            setTimeout(function (){
                self.api.playDisplayNone(); 
                self.api.mute(false); 
            }, 300 );
        // }
    }

    this.skipTimer = function ( time ) {
        document.getElementById('skip').style.display = 'block';
        document.getElementById('ads-skip-timer').style.display = 'none';
        document.getElementById('close_button').style.display = 'none';
        document.getElementsByClassName('icon')[0].style.display = 'none';        
        document.getElementById('vast_time').innerText = time; time -- ;

        var interval = setInterval( function () {
            self.pauseGeneratePlayer();
            if ( self.Video.paused === false) {
                if (time > 0) {
                    document.getElementById('vast_time').innerText = time;
                    time -- ;
                } else {
                    document.getElementById('skip').style.display = 'none';
                    document.getElementsByClassName('icon')[0].style.display = 'block';
                    var close_button = document.getElementById('close_button');
                        close_button.style.display = 'block';
                    var adsSkipTimer = document.getElementById('ads-skip-timer');
                        adsSkipTimer.style.display = 'block';

                    close_button.onclick = function () {
                        // setTimeout(self.pauseGeneratePlayer, 500);
                        if(self.Vast.tracking_close_tracked ===false){
                            if(self.Vast.tracking_close != null){
                                var arrTrack = self.Vast.tracking_close.split(" ");
                                for(var i=0;i<arrTrack.length;i++){
                                    self.addPixel(arrTrack[i]);
                                }
                            }
                            self.Vast.tracking_close_tracked=true;
                        }  

                        self.videoPlayerEnded();
                        close_button.onclick = null;
                        return false;
                    };

                    adsSkipTimer.onclick = function () {
                        self.videoPlayerEnded();
                        adsSkipTimer.onclick = null;
                        return false;
                    };
                    clearInterval(interval);                    
                }
            }
        }, 1000);
    }

    this.removeAllEventListeners = function ( obj ) {
        if ( typeof obj._eventListeners == 'undefined' || obj._eventListeners.length == 0 ) {
            return; 
        }
        
        for(var i = 0, len = obj._eventListeners.length; i < len; i++) {
            var e = obj._eventListeners[i];
            obj.removeEventListener(e.event, e.callback);
        }

        obj._eventListeners = [];
    }

    this.videoPlayerMute = function ( event ) {  
        var volume = document.getElementsByClassName('adv_volume')[0]; 
        if ( volume.classList[1] == 'mute' ) {     
            self.Video.muted = false;
            $(volume).removeClass ('mute').addClass('volume_on');

            if(self.Vast.tracking_mute_tracked === false){
                if(self.Vast.tracking_mute != null){
                    var arrTrack = self.Vast.tracking_mute.split(" ");
                    for(var i=0;i<arrTrack.length;i++){
                        self.addPixel(arrTrack[i]);
                    }
                }
                self.Vast.tracking_mute_tracked=true;
            }     

        } else {
            self.Video.muted = true;
            $(volume).removeClass ('volume_on').addClass('mute');

            if(self.Vast.tracking_unmute_tracked === false){
                if(self.Vast.tracking_unmute != null){
                    var arrTrack = self.Vast.tracking_unmute.split(" ");
                    for(var i=0;i<arrTrack.length;i++){
                        self.addPixel(arrTrack[i]);
                    }
                }
                self.Vast.tracking_unmute_tracked=true;
            }  
        } 
    } 

    this.playAdPlayer = function (a, b) {
        if ( self.Video.paused === true ) {
            self.Video.play(); 
            self.PlayerBlock.className = "";            
        } 
        else {
            self.Video.pause();
            self.PlayerBlock.className = "Play"; 
        }
    }

    this.timeQuartile = function ( quartile ) {
        var duration = self.api.video.duration;
        if ( quartile.indexOf('/') > -1 ) {
            quartile = quartile.replace('/', '');
            return (duration / quartile);
        } else if ( quartile == 'firstQuartile' ) {
            return (Math.floor(duration/4));
        } else if ( quartile == 'midpoint' ) {
            return (Math.floor(duration/2));
        } else if ( quartile == 'thirdQuartile' ) {
            return ((Math.floor(duration/2)) + (Math.floor(duration/4)));
        } 
    }

    this.createHTMLPlayer = function (flag) {
        var SkipButton, SkipButtonA, MuteButton, MuteButtonA, MuteButtonSpan, PlayerBlock, Video, AdsBlock, CloseButton,

        SkipButtonA = document.createElement('div');
        SkipButton = document.createElement('div');
        MuteButtonSpan = document.createElement('span');
        MuteButtonA = document.createElement('a');
        MuteButton = document.createElement('div');
        PlayerBlock = document.createElement('div');
        CloseButton = document.createElement('div');
        Video = document.createElement('video');
        AdsBlock = document.createElement('div');
        Engine = document.createElement('div');
        AdBlock = document.createElement('div');
        
        SkipButtonA.className = 'skip_adv skip_adv_referer';
        SkipButton.className = 'skip_block';
        SkipButton.id = 'adcblock';
        AdBlock.className = 'advertisment-label';
        MuteButtonA.className = 'adv_volume volume_on';
        MuteButton.className = 'skip_button_volume';
        CloseButton.id = 'close_button';
        Engine.className = 'fp-eng fp-eng2';

        if (flag === true) {
            Engine.style.display = 'none';
        }

        if( navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i)){
            PlayerBlock.className = 'Play';
        }

        PlayerBlock.id = 'PlayerBlock';
        SkipButtonA.innerHTML = "<div style=\"display:none\" id=\"ads-skip-timer\">Пропустить рекламу</div> <div style=\"display:none\" class=\"icon\"></div> <div id=\"skip\">\u0420\u0435\u043A\u043B\u0430\u043C\u0443\u0020\u043C\u043E\u0436\u043D\u043E\u0020\u0431\u0443\u0434\u0435\u0442\u0020\u043F\u0440\u043E\u043F\u0443\u0441\u0442\u0438\u0442\u044C\u0020\u0447\u0435\u0440\u0435\u0437 <span id=\"vast_time\">{{ time }}</span> \u0441\u0435\u043A.</div>";
        MuteButtonSpan.innerText = '';
        MuteButton.innerText = '';

        Video.id = 'video_play_2';
        Video.setAttribute('autoplay', 'autoplay');
        Video.setAttribute('preload', 'auto');
        Video.setAttribute('playsinline', 'true');
        Video.setAttribute('webkit-playsinline', 'true');
        Video.setAttribute('type', 'video/mp4');
        Video.style.backgroundColor = 'rgb(0, 0, 0)';
        Video.style.position = 'absolute';
        Video.style.width = '100%';
        Video.style.height = '100%';
        Video.style.left = '0';
        Video.src = '';

        Video.volume = 0.2;
        
        AdsBlock.style.position = 'absolute';
        AdsBlock.style.width = '100%';
        AdsBlock.style.height = '100%';
        AdsBlock.style.top = '0';
        AdsBlock.style.zIndex = '9999';

        SkipButtonA.setAttribute("target", "_blank");
        SkipButtonA.setAttribute("href", "#");

        SkipButton.insertBefore( SkipButtonA , null );
        MuteButtonA.insertBefore( MuteButtonSpan, null );
        MuteButton.insertBefore( MuteButtonA, null );
        PlayerBlock.insertBefore( AdBlock, null );
        PlayerBlock.insertBefore( Video, null );

        AdsBlock.insertBefore( CloseButton, null );
        AdsBlock.insertBefore( MuteButton, null );
        AdsBlock.insertBefore( SkipButton, null );
        AdsBlock.insertBefore( PlayerBlock, null );

        Engine.insertBefore( AdsBlock, null );

        this.Video = Video;
        this.MuteButton = MuteButton;
        this.SkipButton = SkipButton;
        this.CloseButton = CloseButton;
        this.PlayerBlock = PlayerBlock;
        this.AdsBlock = AdsBlock;
        this.Engine = Engine;

        delete SkipButtonA;
        delete SkipButton;
        delete CloseButton;
        delete MuteButtonSpan;
        delete MuteButtonA;
        delete MuteButton;
        delete PlayerBlock;
        delete Video;

        var fpPlayer = document.getElementsByClassName('fp-player')[0];
        fpPlayer.insertBefore(this.Engine, null);   
    }

    this.addClickthrough = function () {
        if (self.Video.paused === false) {
            window.open(self.Vast.clickthrough_url);          
            if(self.Vast.clickthrough_tracking !=null){
                for(var k=0;k<self.Vast.clickthrough_tracking.length;k++){
                    self.addPixel(self.Vast.clickthrough_tracking[k].childNodes[0].nodeValue);
                }
            }  
        }       
    }

    this.eventResume = function () {
        if(self.Vast.tracking_resume_tracked === false){
            if(self.Vast.tracking_resume != null){
                var arrTrack = self.Vast.tracking_resume.split(" ");
                for(var i=0;i<arrTrack.length;i++){
                    self.addPixel(arrTrack[i]);
                }
            }
            self.Vast.tracking_resume_tracked=true;
        }  
        self.Video.removeEventListener('resume', self.eventResume); 
    }

    this.eventPause = function () {        
        if(self.Vast.tracking_pause_tracked === false){
            if(self.Vast.tracking_pause != null){
                var arrTrack = self.Vast.tracking_pause.split(" ");
                for(var i=0;i<arrTrack.length;i++){
                    self.addPixel(arrTrack[i]);
                }
            }
            self.Vast.tracking_pause_tracked=true;
        }  
        self.Video.removeEventListener('pause', self.eventPause); 
    }

    this.httpBuildQuery = function ( formdata, numeric_prefix, arg_separator ) {

        var key, use_val, use_key, i = 0, tmp_arr = [];

        if(!arg_separator){
            arg_separator = '&';
        }

        for(key in formdata){
            use_key = escape(key);
            use_val = escape((formdata[key].toString()));
            use_val = use_val.replace(/%20/g, '+');

            if(numeric_prefix && !isNaN(key)){
                use_key = numeric_prefix + i;
            }
            tmp_arr[i] = use_key + '=' + use_val;
            i++;
        }

        return tmp_arr.join(arg_separator);
    }

    this.sendStat = function (adblock) {
        // return true; 
        var xmlHttpReq = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
        xmlHttpReq.open("POST", '/stats/event', true);
        xmlHttpReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xmlHttpReq.send(self.httpBuildQuery({
            host: domain,
            adblock: adblock,
            token: self.api.conf.conf.token
        }));
        // return true;
        delete xmlHttpReq;
    }

    this.adSkip = function () {
        //setTimeout(self.pauseGeneratePlayer, 500);
        if(self.Vast.tracking_close_tracked ===false){
            if(self.Vast.tracking_close != null){
                var arrTrack = self.Vast.tracking_close.split(" ");
                for(var i=0;i<arrTrack.length;i++){
                    self.addPixel(arrTrack[i]);
                }
            }
            self.Vast.tracking_close_tracked=true;
        }  
        self.videoPlayerEnded();
    }

    this.playRoll = function ( vast ) {
        // // Отправка статистики о просмотре рекламы через VAST регион Россия, Москва и Санкт-Петербург
        // // Отправляем Start и Skip записи
        // // Саму рекламу не показываем в этом случае
        // if ( country_code == 'ru' && ( city_name == 'moscow' || city_name == 'st petersburg') ) {
        //     console.log('playRoll ru');
        //     console.log(vast);
        //     var arr_vast_id = vast.split('-');
        //     var tmp_vast_id = arr_vast_id[arr_vast_id.length-1];
        //     var clone_skip = window.location.protocol+'//'+window.location.host+'/vast/counter?event=start&id='+tmp_vast_id+'&ip='+user_ip+'&base='+(btoa(self.arrTrack))+'&host='+domain+'&token='+cookie_name;
        //     self.addPixel(clone_skip);
        //
        //     setTimeout (function () {
        //         clone_skip = window.location.protocol+'//'+window.location.host+'/vast/counter?event=skip&id='+tmp_vast_id+'&ip='+user_ip+'&base='+(btoa(self.arrTrack))+'&host='+domain+'&token='+cookie_name;
        //         self.addPixel(clone_skip);
        //     }, 11000);
        //
        //     console.log('Advertising for Russian country is disabled');
        //     self.Vast = '';
        //     self.videoPlayerEnded();
        //     return true;
        //     // throw 'Advertising for Russian country is disabled';
        // }
        // // Конец отправки статистики о просмотре рекламы

        self.pauseGeneratePlayer();

        document.querySelector('div.fp-eng').style.display = ''; 
        document.getElementsByClassName('flowplayer')[0].classList.add('is-ad-visible');

        var vast_url2 = '';

        if (vast.indexOf('/vast.xml?id=') < 0) {
            vast_url2 = window.location.protocol+'//'+window.location.host+'/vas/clone?u=' + btoa(vast);
        }

        vast_url2 += '&host=' + domain;
        vast_url2 += '&t=' + self.api.conf.conf.token;
        
        if ( document.getElementsByClassName('advertisment-label')[0].offsetParent === null ){
            vast_url2 += '&a=true.m3u8';
        }

        var vast_id = vast.split('-');
        self.vast_id = vast_id[vast_id.length-1];

        self.Vast = this.readVastFile(vast, {
            'media_type' : 'video/mp4',
            'media_bitrate_min' : 200,
            'media_bitrate_max' : 3000
        });     

        if (self.Vast === false) {
            return false;
        }

        this.skipTimer( self.Vast.time );

        self.Video.addEventListener('play', function () {
            if ( self.Video.paused === true ) 
                self.PlayerBlock.className = "Play"; 
            else self.PlayerBlock.className = "";
        });

        if (self.Video.muted === true) {
            var volume = document.getElementsByClassName('adv_volume')[0]; 
            self.Video.muted = false;
            $(volume).removeClass ('mute').addClass('volume_on');
        }

        self.videoPlayerTimeupdate();
        this.setSrcVideoPlayer( self.Vast.media_file );
        var oo = 0;
        var int = setInterval(function () {
            self.videoPlayerTimeupdate();
            if ((self.Video.time-1) < oo) clearInterval(int);
            oo++;
        }, 1000);

        // self.Video.addEventListener('progress', self.pauseGeneratePlayer);
        self.Video.addEventListener('pause', self.eventPause);
        self.Video.addEventListener('resume', self.eventResume);
        this.Video.addEventListener('click', self.addClickthrough);
        self.Video.addEventListener('ended', self.adSkip);
    }

    this.convertTime = function(time) {
        var duration_sec = self.api.video.duration;
        var pro = ((time-duration_sec)/duration_sec) * 100;
        var jo = 100 + pro;
        return jo;
    }

    this.creatTimeStamps = function (time) {
        $(self.timeline).append('<div style="height: 100%; width: 2px; background: gold; z-index: 99; left: '+(self.convertTime(time))+'%" ></div>', null);
    }

    this.createPlayer = function (vast) {

        // console.log('cookie_name='+cookie_name);
        // console.log('domain:' + domain);
        // console.log('country_code:' + country_code);
        // console.log('city_name:' + city_name);
        // console.log('region:' + region);

        // Отправка статистики о просмотре рекламы через VAST для сайта kino-fs.pro
        // Отправляем Start и Skip записи
        // Саму рекламу не показываем в этом случае
        if( typeof adblock !== 'undefined' && (new RegExp(/kino\-fs\.pro/g)).test(domain) === true ) {
            var clone_skip = window.location.protocol+'//'+window.location.host+'/vast/counter?event=start&id=20&ip='+user_ip+'&base='+(btoa(self.arrTrack))+'&host='+domain+'&token='+cookie_name;
            self.addPixel(clone_skip);

            setTimeout (function () {
                clone_skip = window.location.protocol+'//'+window.location.host+'/vast/counter?event=skip&id=20&ip='+user_ip+'&base='+(btoa(self.arrTrack))+'&host='+domain+'&token='+cookie_name;
                self.addPixel(clone_skip);
            }, 11000);

            return;
        }

        // Если пользовател ещё не начинал смотреть фильм
        if ( localStorage && localStorage[cookie_name] === undefined ) {
            // Отправляем статистику о просмотре фильма, с параметром adblock
            self.sendStat(
                ( typeof adblock === 'undefined' ? 'y' : 'n' )
            );
        }

        // Если у пользователя реклама в админке выключена или включен adblock
        if ( typeof adblock === 'undefined' || vast == '' || vast == null ) {
            // Рекламу проиграть даже не пытаемся, выходим
            return;
        }

        if ( typeof vast !== "undefined" && typeof vast.ads.preroll === "string") { 
            self.pauseGeneratePlayer();
            self.createHTMLPlayer(false); 
        } else {
            self.createHTMLPlayer(true); 
        }

        if ( typeof vast !== "undefined" ) {

            // PreRoll
            if ( typeof vast.ads.preroll === "string" && self.actPid === false ) {
                self.preroll = vast.ads.preroll;
                // if( typeof adblock === 'undefined'/* && (new RegExp(/vasttest=ok/g)).test(window.location.href) === true*/ ) {
                //     var vvv = this.playRoll( self.preroll );
                // } else {
                    try {
                        var vvv = this.playRoll( self.preroll );
                    }
                    catch(err) {
                        // console.log(err);
                        self.Vast = '';
                        self.videoPlayerEnded();
                        return false;
                    }
                // }

                if (vvv === false) {
                    self.Vast = '';
                    self.videoPlayerEnded();
                    return false;
                }
                self.actPid = true;
            }   

            // MidRoll`s
            if ( typeof vast.ads.midroll === "object") {
                self.midroll = vast.ads.midroll;

                self.midroll.forEach ( function( ad, key ) {
                    if ( typeof ad.time == "string" ){ 
                        if ( ad.time == 'firstQuartile' || ad.time == 'midpoint' || ad.time == 'thirdQuartile' || ad.time.indexOf('/') > -1 ) {
                            ad.time = self.timeQuartile( ad.time );
                            self.midroll[key].time = ad.time; 
                        }
                    }
                    self.creatTimeStamps(ad.time);
                    self.midroll[key].start = false;
                });

                self.midroll.forEach ( function( ad, key) {
                    if ( typeof ad.time !== "undefined" && typeof ad.url !== "undefined" ) {
                        self.api.on('progress', function () {
                            if (
                                self.api.video.time >= ad.time && typeof self.midrollStart[self.currentMidroll] === "undefined" && ad.start === false && self.actPid === false
                                // ( country_code != 'ru' && self.api.video.time >= ad.time && typeof self.midrollStart[self.currentMidroll] === "undefined" && ad.start === false && self.actPid === false ) ||
                                // ( country_code == 'ru' && self.api.video.time >= ad.time && typeof self.midrollStart[self.currentMidroll] === "undefined" && ad.start === false )
                            ) {
                                try {
                                    if ( typeof adblock !== 'undefined' ) {
                                        self.playRoll( ad.url );
                                    }
                                }
                                catch(err) {
                                    // console.log(err);
                                    self.Vast = '';
                                    self.videoPlayerEnded();
                                    return false;
                                }
                                self.midrollStart[self.currentMidroll] = true;
                                self.currentMidroll++;
                                self.midroll[key].start = true; ad.start = true;

                                self.actPid = true;
                            }
                        });                        
                    }
                });
            }


            // показ баннера за 10 минут до конца фильма
            var imgBannerDisplayed = false;
            var bannerShowTime = 60; //сколько показывать баннер
            var bannerCloseButtonTime = 15; // через сколько показывать кнопку закрыть
            var showCloseButton = true; // показывать кнопку закрыть?
            var startBannerTime = 0;
			var timeToShowAds = Math.floor(self.api.video.duration - 10*60);
			
            self.api.on('progress', function () {
                if( (self.api.video.time > (self.api.video.duration - 10*60)  && imgBannerDisplayed === false && document.getElementsByClassName('fp-eng')[0].style.display === 'none') || (document.getElementsByClassName('fp-eng')[0].style.display === 'none' && Math.floor(self.api.video.time) == timeToShowAds)){ // self.api.video.duration - длительность фильма
                    if( startBannerTime == 0 || startBannerTime + 60 > self.api.video.time) // проверка показа баннера в течении минуты
                    {
                        if(startBannerTime == 0 ) startBannerTime = self.api.video.time;
                        document.getElementById('banner_before_end').style.display = "block";

                        if(showCloseButton && startBannerTime + 15 < self.api.video.time && !document.body.contains( document.getElementsByClassName('img_banner_close_button')[0] )) //проверка показа кнопки закрыть через 15 с
                            document.getElementById('banner_before_end').insertAdjacentHTML('afterbegin', "<div id='close_button' class='img_banner_close_button' style='top:-20px;right:-20px;background: #999'></div>");
                    }
                }

                if(startBannerTime + 60 < self.api.video.time)
                    hideImageBanner()
            });

            document.addEventListener('click',function(e){
                if(e.target.classList.contains("img_banner_close_button"))
                    hideImageBanner()
            });

            window.addEventListener('blur',function(){
                if(iframeMouseOver)
                    hideImageBanner()
            });

            function hideImageBanner()
            {
                document.getElementById('banner_before_end').style.display="none";
                imgBannerDisplayed = true;
				startBannerTime = 0;
            }





            // PostRoll
            if ( typeof vast.ads.postroll === "string") {
                self.postroll = vast.ads.postroll;
                self.api.on('finish', function () {
                    if (self.postroll && self.actPid === false && self.postrollStart === false) {
                        try {
                            self.playRoll( self.postroll );
                        }
                        catch(err) {
                            // console.log(err);
                            self.Vast = '';
                            self.videoPlayerEnded();
                            return false;
                        }
                        self.actPid = true;
                        self.postrollStart = true;
                    }
                });     
            }

            // PauseRoll
            if ( typeof vast.ads.pauseroll === "string") {
                self.pauseroll = vast.ads.pauseroll;
                self.api.on('pause', function () {
                    if (self.api.video.time > (self.api.video.duration/10) && self.pauseroll && self.actPid === false && self.pauserollStart === false) {
                        try {
                            self.playRoll( self.pauseroll );
                        }
                        catch(err) {
                            // console.log(err);
                            self.Vast = '';
                            self.videoPlayerEnded();
                            return false;
                        }
                        self.actPid = true;
                        self.pauserollStart = true;
                    }
                });     
            }
        }

        this.PlayerBlock.addEventListener('click', this.playAdPlayer);
        this.MuteButton.addEventListener('click', this.videoPlayerMute);
    }

    this.createPlayer ( api.conf.clip.ads );
}

var VpaidAd = function (url, cl, ap) {

  this.api = ap;
  this.url = url;
  this.vpaid;
  this.vpaidframe;
  this.vpaidslot2;
  this.videoVpaid;
  this.divVpaid;

  var vpaidslot2;

  var self = this;

  this.css = function(e, o) {
    if (e) {
      for (var key in o) {
        if (o.hasOwnProperty(key)) {
          if (o[key] != 'NaNpx' && o[key] != undefined) {
            if (typeof o[key] == 'number' && key != 'opacity' && key != 'zIndex') {
              o[key] += 'px'
            }
            if ((key.indexOf("color") > -1 || key.indexOf("Color") > -1) && o[key].indexOf("#") == -1 && o[key].indexOf("rgba") == -1) {
              o[key] = '#' + o[key]
            }
            if (key == "transform") {
              e.style['-ms-' + key] = o[key];
              e.style['-moz-' + key] = o[key];
              e.style['-webkit-' + key] = o[key];
              e.style['-o-' + key] = o[key]
            }
            if (key == "fontFamily") {
              if (o[key].indexOf(" ") > -1) {
                o[key] = '"' + o[key] + '"'
              }
            }
            if (key == "box-sizing") {
              e.style.setProperty(key, o[key], 'important')
            } else {
              e.style[key] = o[key]
            }
          }
        }
      }
    }
  }


  this.readVastFile = function (vast_url){
    var res = {};

    var xmlHttpReq, xmlDoc;
    xmlHttpReq= window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");

    xmlHttpReq.open("GET",vast_url,false);
    xmlHttpReq.send();
    xmlDoc=xmlHttpReq.responseXML;
    var obj_vast ={};

    // AdSystem
    var AdSystem = xmlDoc.getElementsByTagName("AdSystem")[0].innerHTML;
    if(AdSystem != null){
        res.AdSystem = AdSystem;
    } else {
        res.AdSystem = '';
    }

    // AdParameters
    var AdParameters = xmlDoc.getElementsByTagName("AdParameters")[0];
    if(AdParameters != null){
        res.AdParameters = AdParameters.textContent.trim();
    } else {
        return false;
    }

    // Duration
    var Duration = xmlDoc.getElementsByTagName("Duration")[0];
    if(Duration != null){
        var dur = Duration.textContent.trim();
            dur = dur.split(':');
            dur = (+dur[0]) * 60 * 60 + (+dur[1]) * 60 + (+dur[2]);
        res.Duration = dur;
    } else {
        res.Duration = '30';
    }

    // MediaFile
    var MediaFile = xmlDoc.getElementsByTagName("MediaFile");
    if(MediaFile != null){

      res.Width     = typeof MediaFile[0].attributes.width === 'undefined' ? '100%' : MediaFile[0].attributes.width.nodeValue;
      res.Height    = typeof MediaFile[0].attributes.height === 'undefined' ? '100%' : MediaFile[0].attributes.height.nodeValue;
      res.Bitrate   = typeof MediaFile[0].attributes.bitrate === 'undefined' ? '' : MediaFile[0].attributes.bitrate.nodeValue;
      res.Delivery  = typeof MediaFile[0].attributes.delivery === 'undefined' ? 'progressive' : MediaFile[0].attributes.delivery.nodeValue;
      res.Scalable  = typeof MediaFile[0].attributes.scalable === 'undefined' ? 'true' : MediaFile[0].attributes.scalable.nodeValue;

      res.File = MediaFile[0].textContent.trim();
    } else
        return false;

    return res;
  }

  this.configs = self.readVastFile(url);

  this.waitVpaid = function (e) {
    if (e.data == 'HDVB_VPAID_LOADED') {
      window.removeEventListener("message", self.waitVpaid);
      self.initVpaid();
    }
  }

  this.stopVPAIDstartPlayer = function () {
    self.api.play();

    console.log('stopVPAIDstartPlayer');
    document.getElementById('hdvb_vpaid_div').remove()
  }

  this.vpaidStartAd = function () { console.log('vpaidStartAd'); self.api.pause();};
  this.vpaidStopAd = function () { console.log('vpaidStopAd'); self.stopVPAIDstartPlayer(); };
  this.vpaidSkipAd = function () { console.log('vpaidSkipAd'); self.stopVPAIDstartPlayer(); };
  this.vpaidAdLoaded = function () {
    console.log("VPAID Loaded, ad " + self.vpaid.getAdLinear());
	self.api.pause();
    if (self.vpaid.getAdLinear() != 'nonlinear') {
      self.vpaid.startAd();
      console.log('nonlinear');
    } else {
      self.vpaidAdError("Nonlinear")
    }
  };

  this.vpaidAdLinearChange = function () { console.log('vpaidAdLinearChange'); };
  this.vpaidAdSizeChange = function () { console.log('vpaidAdSizeChange'); };
  this.vpaidAdExpandedChange = function () { console.log('vpaidAdExpandedChange'); };
  this.vpaidAdSkippableStateChange = function () { console.log('vpaidAdSkippableStateChange'); };
  this.vpaidAdDurationChange = function () { console.log('vpaidAdDurationChange'); };
  this.vpaidAdRemainingTimeChange = function () { console.log('vpaidAdRemainingTimeChange'); self.stopVPAIDstartPlayer();};
  this.vpaidAdVolumeChange = function () { console.log('vpaidAdVolumeChange'); };
  this.vpaidAdImpression = function () { console.log('vpaidAdImpression'); };
  this.vpaidAdClickThru = function () { console.log('vpaidAdClickThru'); };
  this.vpaidAdInteraction = function () { console.log('vpaidAdInteraction'); };
  this.vpaidAdVideoStart = function () { console.log('vpaidAdVideoStart'); self.api.pause();};
  this.vpaidAdVideoFirstQuartile = function () { console.log('vpaidAdVideoFirstQuartile'); };
  this.vpaidAdVideoMidpoint = function () { console.log('vpaidAdVideoMidpoint'); };
  this.vpaidAdVideoThirdQuartile = function () { console.log('vpaidAdVideoThirdQuartile'); };
  this.vpaidAdVideoComplete = function () { console.log('vpaidAdVideoComplete'); };
  this.vpaidAdUserAcceptInvitation = function () { console.log('vpaidAdUserAcceptInvitation'); };
  this.vpaidAdUserMinimize = function () { console.log('vpaidAdUserMinimize'); };
  this.vpaidAdUserClose = function () { console.log('vpaidAdUserClose'); };
  this.vpaidAdPaused = function () { console.log('vpaidAdPaused'); };
  this.vpaidAdPlaying = function () { console.log('vpaidAdPlaying'); };
  this.vpaidAdError = function (a) { console.log('vpaidAdError', a); self.stopVPAIDstartPlayer(); };
  this.vpaidAdErrorVpaid = function () { console.log('vpaidAdErrorVpaid'); self.stopVPAIDstartPlayer(); };
  this.vpaidAdLog = function () { console.log('vpaidAdLog'); };
  this.vpaidAdViewable = function () { console.log('vpaidAdViewable'); };

  this.vpaidCallbacks = {
      AdStarted:              self.vpaidStartAd,
      AdStopped:              self.vpaidStopAd,
      AdSkipped:              self.vpaidSkipAd,
      AdLoaded:               self.vpaidAdLoaded,
      AdLinearChange:         self.vpaidAdLinearChange,
      AdSizeChange:           self.vpaidAdSizeChange,
      AdExpandedChange:       self.vpaidAdExpandedChange,
      AdSkippableStateChange: self.vpaidAdSkippableStateChange,
      AdDurationChange:       self.vpaidAdDurationChange,
      AdRemainingTimeChange:  self.vpaidAdRemainingTimeChange,
      AdVolumeChange:         self.vpaidAdVolumeChange,
      AdImpression:           self.vpaidAdImpression,
      AdClickThru:            self.vpaidAdClickThru,
      AdInteraction:          self.vpaidAdInteraction,
      AdVideoStart:           self.vpaidAdVideoStart,
      AdVideoFirstQuartile:   self.vpaidAdVideoFirstQuartile,
      AdVideoMidpoint:        self.vpaidAdVideoMidpoint,
      AdVideoThirdQuartile:   self.vpaidAdVideoThirdQuartile,
      AdVideoComplete:        self.vpaidAdVideoComplete,
      AdUserAcceptInvitation: self.vpaidAdUserAcceptInvitation,
      AdUserMinimize:         self.vpaidAdUserMinimize,
      AdUserClose:            self.vpaidAdUserClose,
      AdPaused:               self.vpaidAdPaused,
      AdPlaying:              self.vpaidAdPlaying,
      AdError:                self.vpaidAdError,
      AdErrorVpaid:           self.vpaidAdErrorVpaid,
      AdLog:                  self.vpaidAdLog,
      AdViewable:             self.vpaidAdViewable
  };

  this.addPixel = function ( pixel_url ){
	var image = new Image(1,1);
	image.src = pixel_url;
  }

  this.vpaidStart = function (id) {
      self.api.pause();

      self.videoVpaid = document.createElement('video');
      self.videoVpaid.setAttribute('preload', 'auto');
      self.videoVpaid.setAttribute('x-webkit-airplay', 'allow');
      self.videoVpaid.setAttribute('webkit-playsinline', 'true');
      self.videoVpaid.setAttribute('cursor', 'pointer');
      self.videoVpaid.setAttribute('playsinline', '1');
      // videoVpaid.setAttribute('', '');

      self.css(self.videoVpaid, {
          "width": "100%",
          "height": "100%",
          "object-fit": "contain",
          "min-height": "auto",
          "max-height": "none",
          "min-width": "auto",
          "max-width": "none",
          "z-index": "999"
      });

      self.divVpaid = document.createElement('div');
      self.divVpaid.id = "hdvb_vpaid_div";

      self.css(self.divVpaid, {
          "position": "absolute",
          "top": "0px",
          "left": "0px",
          "width": "100%",
          "height": "100%",
          "color": "white",
          "z-index": "999",
          "background": "black"
      });

      self.vpaidframe = document.createElement('iframe');
      self.vpaidframe.id = "hdvb_vpaid";
      self.vpaidframe.allow = "autoplay";
      self.vpaidframe.scrolling = "no";
      self.vpaidframe.setAttribute('allowFullScreen', '');

      self.divVpaid.appendChild(self.vpaidframe);
      self.divVpaid.appendChild(self.videoVpaid);

      var ss = document.getElementById(id);
      ss.appendChild(self.divVpaid);

      var base = document.createElement('base');
      base.href = window.location.protocol + "//" + window.location.host + '/';
      self.vpaidframe.contentWindow.document.getElementsByTagName('head')[0].appendChild(base);

      self.css(self.vpaidframe, {
          "position": "absolute",
          "top": "0",
          "left": "0",
          "width": "100%",
          "height": "100%",
          "border": 0,
          "z-index": "999"
      });

      // Отправка статистики о просмотре рекламы через VPAID регион Россия, не Москва и не Санкт-Петербург
      // Отправляем Start и Skip записи
      if ( country_code == 'ru' && city_name != 'moscow' && city_name != 'st petersburg' ) {
          var vast = self.api.conf.clip.ads.ads.preroll;
          var arr_vast_id = vast.split('-');
          var tmp_vast_id = arr_vast_id[arr_vast_id.length - 1];
          var clone_skip = window.location.protocol + '//' + window.location.host + '/vast/counter?event=start&id=' + tmp_vast_id + '&ip=' + user_ip + '&base=' + (btoa(self.url)) + '&host=' + domain + '&token=' + cookie_name;
          self.addPixel(clone_skip);

          setTimeout(function () {
              clone_skip = window.location.protocol + '//' + window.location.host + '/vast/counter?event=skip&id=' + tmp_vast_id + '&ip=' + user_ip + '&base=' + (btoa(self.url)) + '&host=' + domain + '&token=' + cookie_name;
              self.addPixel(clone_skip);
          }, 11000);
      }
      // Конец отправки статистики о просмотре рекламы

    self.vpaidframeloaded();
  }

  this.vpaidframeloaded = function () {
    try {
      if (self.vpaidframe.contentWindow) {
        var defaultTemplate = '<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body style="margin:0;padding:0"><script type="text/javascript" src="' + self.configs.File + '"></script><script type="text/javascript">window.parent.postMessage("HDVB_VPAID_LOADED","*");</script></body></html>';
        window.addEventListener("message", self.waitVpaid);
        self.vpaidframe.contentWindow.document.open();
        self.vpaidframe.contentWindow.document.write(defaultTemplate);
        self.vpaidframe.contentWindow.document.close()
      }
    } catch (e) {
      console.log("VPAID frame error");
      console.log(901)
    }
  }

  this.initVpaid = function () {
    if (self.vpaidframe.contentWindow) {
      var fn = self.vpaidframe.contentWindow['getVPAIDAd'];
      if (fn && typeof fn == 'function') {
          self.vpaid = fn();
          if (self.vpaid) {
            self.Vpaid()
          } else {
            self.stopVPAIDstartPlayer();
          }
      } else {
        self.stopVPAIDstartPlayer();
      }
    }
  }

  this.Vpaid = function () {
    if (typeof self.vpaid.handshakeVersion == "function") {
      for (var eventName in self.vpaidCallbacks) {
        if (self.vpaidCallbacks.hasOwnProperty(eventName)) {
          self.vpaid.subscribe(self.vpaidCallbacks[eventName], eventName, this)
        }
      }

      self.vpaidslot2 = document.createElement("div");
      self.vpaidframe.contentDocument.body.appendChild(self.vpaidslot2);

      self.css(self.vpaidslot2, {
        "position": "absolute",
        "top": "0",
        "left": "0",
        "width": "100%",
        "height": "100%",
        "z-index": "999"
      });

      self.vpaid.initAd(self.configs.Width, self.configs.Height, 'fullscreen', 720,  {"AdParameters": self.configs.AdParameters}, {
        "slot": self.vpaidslot2,
        "videoSlot": self.videoVpaid,
        'videoSlotCanAutoPlay': true
      });
    } else {
        console.log("VPAID incorrect");
    }
  }


  self.vpaidStart(cl);
}

var main = function(o) {
    function r(u) {
        if (d[u]) return d[u].exports;
        var c = d[u] = {
            i: u,
            l: !1,
            exports: {}
        };
        return o[u].call(c.exports, c, c.exports, r), c.l = !0, c.exports
    }
    var d = {};
    return r.m = o, r.c = d, r.d = function(u, c, f) {
        r.o(u, c) || Object.defineProperty(u, c, {
            configurable: !1,
            enumerable: !0,
            get: f
        })
    }, r.n = function(u) {
        var c = u && u.__esModule ? function() {
            return u['default']
        } : function() {
            return u
        };
        return r.d(c, 'a', c), c
    }, r.o = function(u, c) {
        return Object.prototype.hasOwnProperty.call(u, c)
    }, r.p = './', r(r.s = 2)
}([function(o, r) {
    var u, c;
    (function(f, h) {
        'use strict';
        'object' == typeof o && 'object' == typeof o.exports ? o.exports = f.document ? h(f, !0) : function(g) {
            if (!g.document) throw new Error('jQuery requires a wfindow with a document');
            return h(g)
        } : h(f)
    })('undefined' == typeof window ? this : window, function(f, h) {
        'use strict';

        function g(Cn, Sn, Nn) {
            Sn = Sn || Ne;
            var Dn, En = Sn.createElement('script');
            if (En.text = Cn, Nn)
                for (Dn in _e) Nn[Dn] && (En[Dn] = Nn[Dn]);
            Sn.head.appendChild(En).parentNode.removeChild(En)
        }

        function y(Cn) {
            return null == Cn ? Cn + '' : 'object' == typeof Cn || 'function' == typeof Cn ? qe[Pe.call(Cn)] || 'object' : typeof Cn
        }

        function x(Cn) {
            var Sn = !!Cn && 'length' in Cn && Cn.length,
                Nn = y(Cn);
            return Be(Cn) || We(Cn) ? !1 : 'array' === Nn || 0 === Sn || 'number' == typeof Sn && 0 < Sn && Sn - 1 in Cn
        }

        function T(Cn, Sn) {
            return Cn.nodeName && Cn.nodeName.toLowerCase() === Sn.toLowerCase()
        }

        function k(Cn, Sn, Nn) {
            return Be(Sn) ? Fe.grep(Cn, function(Dn, En) {
                return !!Sn.call(Dn, En, Dn) !== Nn
            }) : Sn.nodeType ? Fe.grep(Cn, function(Dn) {
                return Dn === Sn !== Nn
            }) : 'string' == typeof Sn ? Fe.filter(Sn, Cn, Nn) : Fe.grep(Cn, function(Dn) {
                return -1 < Ae.call(Sn, Dn) !== Nn
            })
        }

        function C(Cn, Sn) {
            for (;
                (Cn = Cn[Sn]) && 1 !== Cn.nodeType;);
            return Cn
        }

        function S(Cn) {
            var Sn = {};
            return Fe.each(Cn.match(et) || [], function(Nn, Dn) {
                Sn[Dn] = !0
            }), Sn
        }

        function N(Cn) {
            return Cn
        }

        function D(Cn) {
            throw Cn
        }

        function E(Cn, Sn, Nn, Dn) {
            var En;
            try {
                Cn && Be(En = Cn.promise) ? En.call(Cn).done(Sn).fail(Nn) : Cn && Be(En = Cn.then) ? En.call(Cn, Sn, Nn) : Sn.apply(void 0, [Cn].slice(Dn))
            } catch (jn) {
                Nn.apply(void 0, [jn])
            }
        }

        function L() {
            Ne.removeEventListener('DOMContentLoaded', L), f.removeEventListener('load', L), Fe.ready()
        }

        function A(Cn, Sn) {
            return Sn.toUpperCase()
        }

        function q(Cn) {
            return Cn.replace(ot, 'ms-').replace(st, A)
        }

        function P() {
            this.expando = Fe.expando + P.uid++
        }

        function O(Cn) {
            return 'true' === Cn || 'false' !== Cn && ('null' === Cn ? null : Cn === +Cn + '' ? +Cn : lt.test(Cn) ? JSON.parse(Cn) : Cn)
        }

        function H(Cn, Sn, Nn) {
            var Dn;
            if (void 0 === Nn && 1 === Cn.nodeType)
                if (Dn = 'data-' + Sn.replace(pt, '-$&').toLowerCase(), Nn = Cn.getAttribute(Dn), 'string' == typeof Nn) {
                    try {
                        Nn = O(Nn)
                    } catch (En) {}
                    dt.set(Cn, Sn, Nn)
                } else Nn = void 0;
            return Nn
        }

        function M(Cn, Sn, Nn, Dn) {
            var En, jn, Ln = 20,
                An = Dn ? function() {
                    return Dn.cur()
                } : function() {
                    return Fe.css(Cn, Sn, '')
                },
                qn = An(),
                Pn = Nn && Nn[3] || (Fe.cssNumber[Sn] ? '' : 'px'),
                On = (Fe.cssNumber[Sn] || 'px' !== Pn && +qn) && ft.exec(Fe.css(Cn, Sn));
            if (On && On[3] !== Pn) {
                for (qn /= 2, Pn = Pn || On[3], On = +qn || 1; Ln--;) Fe.style(Cn, Sn, On + Pn), 0 >= (1 - jn) * (1 - (jn = An() / qn || 0.5)) && (Ln = 0), On /= jn;
                On *= 2, Fe.style(Cn, Sn, On + Pn), Nn = Nn || []
            }
            return Nn && (On = +On || +qn || 0, En = Nn[1] ? On + (Nn[1] + 1) * Nn[2] : +Nn[2], Dn && (Dn.unit = Pn, Dn.start = On, Dn.end = En)), En
        }

        function I(Cn) {
            var Sn, Nn = Cn.ownerDocument,
                Dn = Cn.nodeName,
                En = yt[Dn];
            return En ? En : (Sn = Nn.body.appendChild(Nn.createElement(Dn)), En = Fe.css(Sn, 'display'), Sn.parentNode.removeChild(Sn), 'none' === En && (En = 'block'), yt[Dn] = En, En)
        }

        function B(Cn, Sn) {
            for (var Nn, Dn, En = [], jn = 0, Ln = Cn.length; jn < Ln; jn++)(Dn = Cn[jn], !!Dn.style) && (Nn = Dn.style.display, Sn ? ('none' === Nn && (En[jn] = rt.get(Dn, 'display') || null, !En[jn] && (Dn.style.display = '')), '' === Dn.style.display && ht(Dn) && (En[jn] = I(Dn))) : 'none' !== Nn && (En[jn] = 'none', rt.set(Dn, 'display', Nn)));
            for (jn = 0; jn < Ln; jn++) null != En[jn] && (Cn[jn].style.display = En[jn]);
            return Cn
        }

        function W(Cn, Sn) {
            var Nn;
            return Nn = 'undefined' == typeof Cn.getElementsByTagName ? 'undefined' == typeof Cn.querySelectorAll ? [] : Cn.querySelectorAll(Sn || '*') : Cn.getElementsByTagName(Sn || '*'), void 0 === Sn || Sn && T(Cn, Sn) ? Fe.merge([Cn], Nn) : Nn
        }

        function R(Cn, Sn) {
            for (var Nn = 0, Dn = Cn.length; Nn < Dn; Nn++) rt.set(Cn[Nn], 'globalEval', !Sn || rt.get(Sn[Nn], 'globalEval'))
        }

        function F(Cn, Sn, Nn, Dn, En) {
            for (var jn, Ln, An, qn, Pn, On, Hn = Sn.createDocumentFragment(), Mn = [], In = 0, Bn = Cn.length; In < Bn; In++)
                if (jn = Cn[In], jn || 0 === jn)
                    if ('object' === y(jn)) Fe.merge(Mn, jn.nodeType ? [jn] : jn);
                    else if (!Tt.test(jn)) Mn.push(Sn.createTextNode(jn));
            else {
                for (Ln = Ln || Hn.appendChild(Sn.createElement('div')), An = (bt.exec(jn) || ['', ''])[1].toLowerCase(), qn = wt[An] || wt._default, Ln.innerHTML = qn[1] + Fe.htmlPrefilter(jn) + qn[2], On = qn[0]; On--;) Ln = Ln.lastChild;
                Fe.merge(Mn, Ln.childNodes), Ln = Hn.firstChild, Ln.textContent = ''
            }
            for (Hn.textContent = '', In = 0; jn = Mn[In++];) {
                if (Dn && -1 < Fe.inArray(jn, Dn)) {
                    En && En.push(jn);
                    continue
                }
                if (Pn = Fe.contains(jn.ownerDocument, jn), Ln = W(Hn.appendChild(jn), 'script'), Pn && R(Ln), Nn)
                    for (On = 0; jn = Ln[On++];) vt.test(jn.type || '') && Nn.push(jn)
            }
            return Hn
        }

        function z() {
            return !0
        }

        function U() {
            return !1
        }

        function X() {
            try {
                return Ne.activeElement
            } catch (Cn) {}
        }

        function V(Cn, Sn, Nn, Dn, En, jn) {
            var Ln, An;
            if ('object' == typeof Sn) {
                for (An in 'string' != typeof Nn && (Dn = Dn || Nn, Nn = void 0), Sn) V(Cn, An, Nn, Dn, Sn[An], jn);
                return Cn
            }
            if (null == Dn && null == En ? (En = Nn, Dn = Nn = void 0) : null == En && ('string' == typeof Nn ? (En = Dn, Dn = void 0) : (En = Dn, Dn = Nn, Nn = void 0)), !1 === En) En = U;
            else if (!En) return Cn;
            return 1 === jn && (Ln = En, En = function(qn) {
                return Fe().off(qn), Ln.apply(this, arguments)
            }, En.guid = Ln.guid || (Ln.guid = Fe.guid++)), Cn.each(function() {
                Fe.event.add(this, Sn, En, Dn, Nn)
            })
        }

        function Y(Cn, Sn) {
            return T(Cn, 'table') && T(11 === Sn.nodeType ? Sn.firstChild : Sn, 'tr') ? Fe(Cn).children('tbody')[0] || Cn : Cn
        }

        function G(Cn) {
            return Cn.type = (null !== Cn.getAttribute('type')) + '/' + Cn.type, Cn
        }

        function Q(Cn) {
            return 'true/' === (Cn.type || '').slice(0, 5) ? Cn.type = Cn.type.slice(5) : Cn.removeAttribute('type'), Cn
        }

        function K(Cn, Sn) {
            var Nn, Dn, En, jn, Ln, An, qn, Pn;
            if (1 === Sn.nodeType) {
                if (rt.hasData(Cn) && (jn = rt.access(Cn), Ln = rt.set(Sn, jn), Pn = jn.events, Pn))
                    for (En in delete Ln.handle, Ln.events = {}, Pn)
                        for (Nn = 0, Dn = Pn[En].length; Nn < Dn; Nn++) Fe.event.add(Sn, En, Pn[En][Nn]);
                dt.hasData(Cn) && (An = dt.access(Cn), qn = Fe.extend({}, An), dt.set(Sn, qn))
            }
        }

        function J(Cn, Sn) {
            var Nn = Sn.nodeName.toLowerCase();
            'input' === Nn && xt.test(Cn.type) ? Sn.checked = Cn.checked : ('input' === Nn || 'textarea' === Nn) && (Sn.defaultValue = Cn.defaultValue)
        }

        function Z(Cn, Sn, Nn, Dn) {
            Sn = je.apply([], Sn);
            var En, jn, Ln, An, qn, Pn, On = 0,
                Hn = Cn.length,
                In = Sn[0],
                Bn = Be(In);
            if (Bn || 1 < Hn && 'string' == typeof In && !Ie.checkClone && jt.test(In)) return Cn.each(function(Wn) {
                var _n = Cn.eq(Wn);
                Bn && (Sn[0] = In.call(this, Wn, _n.html())), Z(_n, Sn, Nn, Dn)
            });
            if (Hn && (En = F(Sn, Cn[0].ownerDocument, !1, Cn, Dn), jn = En.firstChild, 1 === En.childNodes.length && (En = jn), jn || Dn)) {
                for (Ln = Fe.map(W(En, 'script'), G), An = Ln.length; On < Hn; On++) qn = En, On != Hn - 1 && (qn = Fe.clone(qn, !0, !0), An && Fe.merge(Ln, W(qn, 'script'))), Nn.call(Cn[On], qn, On);
                if (An)
                    for (Pn = Ln[Ln.length - 1].ownerDocument, Fe.map(Ln, Q), On = 0; On < An; On++) qn = Ln[On], vt.test(qn.type || '') && !rt.access(qn, 'globalEval') && Fe.contains(Pn, qn) && (qn.src && 'module' !== (qn.type || '').toLowerCase() ? Fe._evalUrl && Fe._evalUrl(qn.src) : g(qn.textContent.replace(Lt, ''), Pn, qn))
            }
            return Cn
        }

        function ee(Cn, Sn, Nn) {
            for (var Dn, En = Sn ? Fe.filter(Sn, Cn) : Cn, jn = 0; null != (Dn = En[jn]); jn++) Nn || 1 !== Dn.nodeType || Fe.cleanData(W(Dn)), Dn.parentNode && (Nn && Fe.contains(Dn.ownerDocument, Dn) && R(W(Dn, 'script')), Dn.parentNode.removeChild(Dn));
            return Cn
        }

        function te(Cn, Sn, Nn) {
            var Dn, En, jn, Ln, An = Cn.style;
            return Nn = Nn || qt(Cn), Nn && (Ln = Nn.getPropertyValue(Sn) || Nn[Sn], '' === Ln && !Fe.contains(Cn.ownerDocument, Cn) && (Ln = Fe.style(Cn, Sn)), !Ie.pixelBoxStyles() && At.test(Ln) && Pt.test(Sn) && (Dn = An.width, En = An.minWidth, jn = An.maxWidth, An.minWidth = An.maxWidth = An.width = Ln, Ln = Nn.width, An.width = Dn, An.minWidth = En, An.maxWidth = jn)), void 0 == Ln ? Ln : Ln + ''
        }

        function ne(Cn, Sn) {
            return {
                get: function() {
                    return Cn() ? void delete this.get : (this.get = Sn).apply(this, arguments)
                }
            }
        }

        function ae(Cn) {
            if (Cn in Wt) return Cn;
            for (var Sn = Cn[0].toUpperCase() + Cn.slice(1), Nn = Bt.length; Nn--;)
                if (Cn = Bt[Nn] + Sn, Cn in Wt) return Cn
        }

        function oe(Cn) {
            var Sn = Fe.cssProps[Cn];
            return Sn || (Sn = Fe.cssProps[Cn] = ae(Cn) || Cn), Sn
        }

        function se(Cn, Sn, Nn) {
            var Dn = ft.exec(Sn);
            return Dn ? Math.max(0, Dn[2] - (Nn || 0)) + (Dn[3] || 'px') : Sn
        }

        function ie(Cn, Sn, Nn, Dn, En, jn) {
            var Ln = 'width' === Sn ? 1 : 0,
                An = 0,
                qn = 0;
            if (Nn === (Dn ? 'border' : 'content')) return 0;
            for (; 4 > Ln; Ln += 2) 'margin' === Nn && (qn += Fe.css(Cn, Nn + mt[Ln], !0, En)), Dn ? ('content' === Nn && (qn -= Fe.css(Cn, 'padding' + mt[Ln], !0, En)), 'margin' !== Nn && (qn -= Fe.css(Cn, 'border' + mt[Ln] + 'Width', !0, En))) : (qn += Fe.css(Cn, 'padding' + mt[Ln], !0, En), 'padding' === Nn ? An += Fe.css(Cn, 'border' + mt[Ln] + 'Width', !0, En) : qn += Fe.css(Cn, 'border' + mt[Ln] + 'Width', !0, En));
            return !Dn && 0 <= jn && (qn += Math.max(0, Math.ceil(Cn['offset' + Sn[0].toUpperCase() + Sn.slice(1)] - jn - qn - An - 0.5))), qn
        }

        function re(Cn, Sn, Nn) {
            var Dn = qt(Cn),
                En = te(Cn, Sn, Dn),
                jn = 'border-box' === Fe.css(Cn, 'boxSizing', !1, Dn),
                Ln = jn;
            if (At.test(En)) {
                if (!Nn) return En;
                En = 'auto'
            }
            return Ln = Ln && (Ie.boxSizingReliable() || En === Cn.style[Sn]), 'auto' !== En && (parseFloat(En) || 'inline' !== Fe.css(Cn, 'display', !1, Dn)) || (En = Cn['offset' + Sn[0].toUpperCase() + Sn.slice(1)], Ln = !0), En = parseFloat(En) || 0, En + ie(Cn, Sn, Nn || (jn ? 'border' : 'content'), Ln, Dn, En) + 'px'
        }

        function de(Cn, Sn, Nn, Dn, En) {
            return new de.prototype.init(Cn, Sn, Nn, Dn, En)
        }

        function le() {
            Rt && (!1 === Ne.hidden && f.requestAnimationFrame ? f.requestAnimationFrame(le) : f.setTimeout(le, Fe.fx.interval), Fe.fx.tick())
        }

        function pe() {
            return f.setTimeout(function() {
                _t = void 0
            }), _t = Date.now()
        }

        function ue(Cn, Sn) {
            var Nn, Dn = 0,
                En = {
                    height: Cn
                };
            for (Sn = Sn ? 1 : 0; 4 > Dn; Dn += 2 - Sn) Nn = mt[Dn], En['margin' + Nn] = En['padding' + Nn] = Cn;
            return Sn && (En.opacity = En.width = Cn), En
        }

        function ce(Cn, Sn, Nn) {
            for (var Dn, En = (he.tweeners[Sn] || []).concat(he.tweeners['*']), jn = 0, Ln = En.length; jn < Ln; jn++)
                if (Dn = En[jn].call(Nn, Sn, Cn)) return Dn
        }

        function me(Cn, Sn) {
            var Nn, Dn, En, jn, Ln;
            for (Nn in Cn)
                if (Dn = q(Nn), En = Sn[Dn], jn = Cn[Nn], Array.isArray(jn) && (En = jn[1], jn = Cn[Nn] = jn[0]), Nn != Dn && (Cn[Dn] = jn, delete Cn[Nn]), Ln = Fe.cssHooks[Dn], Ln && 'expand' in Ln)
                    for (Nn in jn = Ln.expand(jn), delete Cn[Dn], jn) Nn in Cn || (Cn[Nn] = jn[Nn], Sn[Nn] = En);
                else Sn[Dn] = En
        }

        function he(Cn, Sn, Nn) {
            var Dn, En, jn = 0,
                Ln = he.prefilters.length,
                An = Fe.Deferred().always(function() {
                    delete qn.elem
                }),
                qn = function() {
                    if (En) return !1;
                    for (var Hn = _t || pe(), Mn = Math.max(0, Pn.startTime + Pn.duration - Hn), In = Mn / Pn.duration || 0, Bn = 1 - In, Wn = 0, _n = Pn.tweens.length; Wn < _n; Wn++) Pn.tweens[Wn].run(Bn);
                    return (An.notifyWith(Cn, [Pn, Bn, Mn]), 1 > Bn && _n) ? Mn : (_n || An.notifyWith(Cn, [Pn, 1, 0]), An.resolveWith(Cn, [Pn]), !1)
                },
                Pn = An.promise({
                    elem: Cn,
                    props: Fe.extend({}, Sn),
                    opts: Fe.extend(!0, {
                        specialEasing: {},
                        easing: Fe.easing._default
                    }, Nn),
                    originalProperties: Sn,
                    originalOptions: Nn,
                    startTime: _t || pe(),
                    duration: Nn.duration,
                    tweens: [],
                    createTween: function(Hn, Mn) {
                        var In = Fe.Tween(Cn, Pn.opts, Hn, Mn, Pn.opts.specialEasing[Hn] || Pn.opts.easing);
                        return Pn.tweens.push(In), In
                    },
                    stop: function(Hn) {
                        var Mn = 0,
                            In = Hn ? Pn.tweens.length : 0;
                        if (En) return this;
                        for (En = !0; Mn < In; Mn++) Pn.tweens[Mn].run(1);
                        return Hn ? (An.notifyWith(Cn, [Pn, 1, 0]), An.resolveWith(Cn, [Pn, Hn])) : An.rejectWith(Cn, [Pn, Hn]), this
                    }
                }),
                On = Pn.props;
            for (me(On, Pn.opts.specialEasing); jn < Ln; jn++)
                if (Dn = he.prefilters[jn].call(Pn, Cn, On, Pn.opts), Dn) return Be(Dn.stop) && (Fe._queueHooks(Pn.elem, Pn.opts.queue).stop = Dn.stop.bind(Dn)), Dn;
            return Fe.map(On, ce, Pn), Be(Pn.opts.start) && Pn.opts.start.call(Cn, Pn), Pn.progress(Pn.opts.progress).done(Pn.opts.done, Pn.opts.complete).fail(Pn.opts.fail).always(Pn.opts.always), Fe.fx.timer(Fe.extend(qn, {
                elem: Cn,
                anim: Pn,
                queue: Pn.opts.queue
            })), Pn
        }

        function ge(Cn) {
            var Sn = Cn.match(et) || [];
            return Sn.join(' ')
        }

        function ye(Cn) {
            return Cn.getAttribute && Cn.getAttribute('class') || ''
        }

        function xe(Cn) {
            return Array.isArray(Cn) ? Cn : 'string' == typeof Cn ? Cn.match(et) || [] : []
        }

        function be(Cn, Sn, Nn, Dn) {
            if (Array.isArray(Sn)) Fe.each(Sn, function(jn, Ln) {
                Nn || en.test(Cn) ? Dn(Cn, Ln) : be(Cn + '[' + ('object' == typeof Ln && null != Ln ? jn : '') + ']', Ln, Nn, Dn)
            });
            else if (!Nn && 'object' === y(Sn))
                for (var En in Sn) be(Cn + '[' + En + ']', Sn[En], Nn, Dn);
            else Dn(Cn, Sn)
        }

        function ve(Cn) {
            return function(Sn, Nn) {
                'string' != typeof Sn && (Nn = Sn, Sn = '*');
                var Dn, En = 0,
                    jn = Sn.toLowerCase().match(et) || [];
                if (Be(Nn))
                    for (; Dn = jn[En++];) '+' === Dn[0] ? (Dn = Dn.slice(1) || '*', (Cn[Dn] = Cn[Dn] || []).unshift(Nn)) : (Cn[Dn] = Cn[Dn] || []).push(Nn)
            }
        }

        function we(Cn, Sn, Nn, Dn) {
            function En(An) {
                var qn;
                return jn[An] = !0, Fe.each(Cn[An] || [], function(Pn, On) {
                    var Hn = On(Sn, Nn, Dn);
                    return 'string' != typeof Hn || Ln || jn[Hn] ? Ln ? !(qn = Hn) : void 0 : (Sn.dataTypes.unshift(Hn), En(Hn), !1)
                }), qn
            }
            var jn = {},
                Ln = Cn === hn;
            return En(Sn.dataTypes[0]) || !jn['*'] && En('*')
        }

        function Te(Cn, Sn) {
            var Nn, Dn, En = Fe.ajaxSettings.flatOptions || {};
            for (Nn in Sn) void 0 !== Sn[Nn] && ((En[Nn] ? Cn : Dn || (Dn = {}))[Nn] = Sn[Nn]);
            return Dn && Fe.extend(!0, Cn, Dn), Cn
        }

        function ke(Cn, Sn, Nn) {
            for (var Dn, En, jn, Ln, An = Cn.contents, qn = Cn.dataTypes;
                '*' === qn[0];) qn.shift(), void 0 == Dn && (Dn = Cn.mimeType || Sn.getResponseHeader('Content-Type'));
            if (Dn)
                for (En in An)
                    if (An[En] && An[En].test(Dn)) {
                        qn.unshift(En);
                        break
                    }
            if (qn[0] in Nn) jn = qn[0];
            else {
                for (En in Nn) {
                    if (!qn[0] || Cn.converters[En + ' ' + qn[0]]) {
                        jn = En;
                        break
                    }
                    Ln || (Ln = En)
                }
                jn = jn || Ln
            }
            return jn ? (jn !== qn[0] && qn.unshift(jn), Nn[jn]) : void 0
        }

        function Ce(Cn, Sn, Nn, Dn) {
            var En, jn, Ln, An, qn, Pn = {},
                On = Cn.dataTypes.slice();
            if (On[1])
                for (Ln in Cn.converters) Pn[Ln.toLowerCase()] = Cn.converters[Ln];
            for (jn = On.shift(); jn;)
                if (Cn.responseFields[jn] && (Nn[Cn.responseFields[jn]] = Sn), !qn && Dn && Cn.dataFilter && (Sn = Cn.dataFilter(Sn, Cn.dataType)), qn = jn, jn = On.shift(), jn)
                    if ('*' === jn) jn = qn;
                    else if ('*' !== qn && qn != jn) {
                if (Ln = Pn[qn + ' ' + jn] || Pn['* ' + jn], !Ln)
                    for (En in Pn)
                        if (An = En.split(' '), An[1] === jn && (Ln = Pn[qn + ' ' + An[0]] || Pn['* ' + An[0]], Ln)) {
                            !0 === Ln ? Ln = Pn[En] : !0 !== Pn[En] && (jn = An[0], On.unshift(An[1]));
                            break
                        }
                if (!0 !== Ln)
                    if (Ln && Cn.throws) Sn = Ln(Sn);
                    else try {
                        Sn = Ln(Sn)
                    } catch (Hn) {
                        return {
                            state: 'parsererror',
                            error: Ln ? Hn : 'No conversion from ' + qn + ' to ' + jn
                        }
                    }
            }
            return {
                state: 'success',
                data: Sn
            }
        }
        var Se = [],
            Ne = f.document,
            De = Object.getPrototypeOf,
            Ee = Se.slice,
            je = Se.concat,
            Le = Se.push,
            Ae = Se.indexOf,
            qe = {},
            Pe = qe.toString,
            Oe = qe.hasOwnProperty,
            He = Oe.toString,
            Me = He.call(Object),
            Ie = {},
            Be = function(Sn) {
                return 'function' == typeof Sn && 'number' != typeof Sn.nodeType
            },
            We = function(Sn) {
                return null != Sn && Sn === Sn.window
            },
            _e = {
                type: !0,
                src: !0,
                noModule: !0
            },
            Re = '3.3.1',
            Fe = function(Cn, Sn) {
                return new Fe.fn.init(Cn, Sn)
            },
            ze = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
        Fe.fn = Fe.prototype = {
            jquery: Re,
            constructor: Fe,
            length: 0,
            toArray: function() {
                return Ee.call(this)
            },
            get: function(Cn) {
                return null == Cn ? Ee.call(this) : 0 > Cn ? this[Cn + this.length] : this[Cn]
            },
            pushStack: function(Cn) {
                var Sn = Fe.merge(this.constructor(), Cn);
                return Sn.prevObject = this, Sn
            },
            each: function(Cn) {
                return Fe.each(this, Cn)
            },
            map: function(Cn) {
                return this.pushStack(Fe.map(this, function(Sn, Nn) {
                    return Cn.call(Sn, Nn, Sn)
                }))
            },
            slice: function() {
                return this.pushStack(Ee.apply(this, arguments))
            },
            first: function() {
                return this.eq(0)
            },
            last: function() {
                return this.eq(-1)
            },
            eq: function(Cn) {
                var Sn = this.length,
                    Nn = +Cn + (0 > Cn ? Sn : 0);
                return this.pushStack(0 <= Nn && Nn < Sn ? [this[Nn]] : [])
            },
            end: function() {
                return this.prevObject || this.constructor()
            },
            push: Le,
            sort: Se.sort,
            splice: Se.splice
        }, Fe.extend = Fe.fn.extend = function() {
            var Cn, Sn, Nn, Dn, En, jn, Ln = arguments[0] || {},
                An = 1,
                qn = arguments.length,
                Pn = !1;
            for ('boolean' == typeof Ln && (Pn = Ln, Ln = arguments[An] || {}, An++), 'object' == typeof Ln || Be(Ln) || (Ln = {}), An === qn && (Ln = this, An--); An < qn; An++)
                if (null != (Cn = arguments[An]))
                    for (Sn in Cn)(Nn = Ln[Sn], Dn = Cn[Sn], Ln !== Dn) && (Pn && Dn && (Fe.isPlainObject(Dn) || (En = Array.isArray(Dn))) ? (En ? (En = !1, jn = Nn && Array.isArray(Nn) ? Nn : []) : jn = Nn && Fe.isPlainObject(Nn) ? Nn : {}, Ln[Sn] = Fe.extend(Pn, jn, Dn)) : void 0 != Dn && (Ln[Sn] = Dn));
            return Ln
        }, Fe.extend({
            expando: 'jQuery' + (Re + Math.random()).replace(/\D/g, ''),
            isReady: !0,
            error: function(Cn) {
                throw new Error(Cn)
            },
            noop: function() {},
            isPlainObject: function(Cn) {
                var Sn, Nn;
                return Cn && '[object Object]' === Pe.call(Cn) && ((Sn = De(Cn), !!!Sn) || (Nn = Oe.call(Sn, 'constructor') && Sn.constructor, 'function' == typeof Nn && He.call(Nn) === Me))
            },
            isEmptyObject: function(Cn) {
                for (var Sn in Cn) return !1;
                return !0
            },
            globalEval: function(Cn) {
                g(Cn)
            },
            each: function(Cn, Sn) {
                var Nn, Dn = 0;
                if (x(Cn))
                    for (Nn = Cn.length; Dn < Nn && !1 !== Sn.call(Cn[Dn], Dn, Cn[Dn]); Dn++);
                else
                    for (Dn in Cn)
                        if (!1 === Sn.call(Cn[Dn], Dn, Cn[Dn])) break;
                return Cn
            },
            trim: function(Cn) {
                return null == Cn ? '' : (Cn + '').replace(ze, '')
            },
            makeArray: function(Cn, Sn) {
                var Nn = Sn || [];
                return null != Cn && (x(Object(Cn)) ? Fe.merge(Nn, 'string' == typeof Cn ? [Cn] : Cn) : Le.call(Nn, Cn)), Nn
            },
            inArray: function(Cn, Sn, Nn) {
                return null == Sn ? -1 : Ae.call(Sn, Cn, Nn)
            },
            merge: function(Cn, Sn) {
                for (var Nn = +Sn.length, Dn = 0, En = Cn.length; Dn < Nn; Dn++) Cn[En++] = Sn[Dn];
                return Cn.length = En, Cn
            },
            grep: function(Cn, Sn, Nn) {
                for (var Dn, En = [], jn = 0, Ln = Cn.length; jn < Ln; jn++) Dn = !Sn(Cn[jn], jn), Dn !== !Nn && En.push(Cn[jn]);
                return En
            },
            map: function(Cn, Sn, Nn) {
                var Dn, En, jn = 0,
                    Ln = [];
                if (x(Cn))
                    for (Dn = Cn.length; jn < Dn; jn++) En = Sn(Cn[jn], jn, Nn), null != En && Ln.push(En);
                else
                    for (jn in Cn) En = Sn(Cn[jn], jn, Nn), null != En && Ln.push(En);
                return je.apply([], Ln)
            },
            guid: 1,
            support: Ie
        }), 'function' == typeof Symbol && (Fe.fn[Symbol.iterator] = Se[Symbol.iterator]), Fe.each('Boolean Number String Function Array Date RegExp Object Error Symbol'.split(' '), function(Cn, Sn) {
            qe['[object ' + Sn + ']'] = Sn.toLowerCase()
        });
        var $e = function(Cn) {
            function Sn(Qa, Ka, Ja, Za) {
                var eo, no, ao, oo, so, io, ro, lo = Ka && Ka.ownerDocument,
                    po = Ka ? Ka.nodeType : 9;
                if (Ja = Ja || [], 'string' != typeof Qa || !Qa || 1 !== po && 9 !== po && 11 !== po) return Ja;
                if (!Za && ((Ka ? Ka.ownerDocument || Ka : ca) !== aa && na(Ka), Ka = Ka || aa, sa)) {
                    if (11 !== po && (so = Fa.exec(Qa)))
                        if (!(eo = so[1])) {
                            if (so[2]) return ka.apply(Ja, Ka.getElementsByTagName(Qa)), Ja;
                            if ((eo = so[3]) && Xn.getElementsByClassName && Ka.getElementsByClassName) return ka.apply(Ja, Ka.getElementsByClassName(eo)), Ja
                        } else if (9 === po) {
                        if (!(ao = Ka.getElementById(eo))) return Ja;
                        if (ao.id === eo) return Ja.push(ao), Ja
                    } else if (lo && (ao = lo.getElementById(eo)) && la(Ka, ao) && ao.id === eo) return Ja.push(ao), Ja;
                    if (Xn.qsa && !ya[Qa + ' '] && (!ia || !ia.test(Qa))) {
                        if (1 !== po) lo = Ka, ro = Qa;
                        else if ('object' !== Ka.nodeName.toLowerCase()) {
                            for ((oo = Ka.getAttribute('id')) ? oo = oo.replace(Xa, Va) : Ka.setAttribute('id', oo = pa), io = Qn(Qa), no = io.length; no--;) io[no] = '#' + oo + ' ' + In(io[no]);
                            ro = io.join(','), lo = za.test(Qa) && Hn(Ka.parentNode) || Ka
                        }
                        if (ro) try {
                            return ka.apply(Ja, lo.querySelectorAll(ro)), Ja
                        } catch (uo) {} finally {
                            oo === pa && Ka.removeAttribute('id')
                        }
                    }
                }
                return Jn(Qa.replace(qa, '$1'), Ka, Ja, Za)
            }

            function Nn() {
                function Qa(Ja, Za) {
                    return Ka.push(Ja + ' ') > Vn.cacheLength && delete Qa[Ka.shift()], Qa[Ja + ' '] = Za
                }
                var Ka = [];
                return Qa
            }

            function Dn(Qa) {
                return Qa[pa] = !0, Qa
            }

            function En(Qa) {
                var Ka = aa.createElement('fieldset');
                try {
                    return !!Qa(Ka)
                } catch (Ja) {
                    return !1
                } finally {
                    Ka.parentNode && Ka.parentNode.removeChild(Ka), Ka = null
                }
            }

            function jn(Qa, Ka) {
                for (var Ja = Qa.split('|'), Za = Ja.length; Za--;) Vn.attrHandle[Ja[Za]] = Ka
            }

            function Ln(Qa, Ka) {
                var Ja = Ka && Qa,
                    Za = Ja && 1 === Qa.nodeType && 1 === Ka.nodeType && Qa.sourceIndex - Ka.sourceIndex;
                if (Za) return Za;
                if (Ja)
                    for (; Ja = Ja.nextSibling;)
                        if (Ja === Ka) return -1;
                return Qa ? 1 : -1
            }

            function An(Qa) {
                return function(Ka) {
                    var Ja = Ka.nodeName.toLowerCase();
                    return 'input' === Ja && Ka.type === Qa
                }
            }

            function qn(Qa) {
                return function(Ka) {
                    var Ja = Ka.nodeName.toLowerCase();
                    return ('input' === Ja || 'button' === Ja) && Ka.type === Qa
                }
            }

            function Pn(Qa) {
                return function(Ka) {
                    return 'form' in Ka ? Ka.parentNode && !1 === Ka.disabled ? 'label' in Ka ? 'label' in Ka.parentNode ? Ka.parentNode.disabled === Qa : Ka.disabled === Qa : Ka.isDisabled === Qa || Ka.isDisabled !== !Qa && Ga(Ka) === Qa : Ka.disabled === Qa : !!('label' in Ka) && Ka.disabled === Qa
                }
            }

            function On(Qa) {
                return Dn(function(Ka) {
                    return Ka = +Ka, Dn(function(Ja, Za) {
                        for (var eo, no = Qa([], Ja.length, Ka), ao = no.length; ao--;) Ja[eo = no[ao]] && (Ja[eo] = !(Za[eo] = Ja[eo]))
                    })
                })
            }

            function Hn(Qa) {
                return Qa && 'undefined' != typeof Qa.getElementsByTagName && Qa
            }

            function Mn() {}

            function In(Qa) {
                for (var Ka = 0, Ja = Qa.length, Za = ''; Ka < Ja; Ka++) Za += Qa[Ka].value;
                return Za
            }

            function Bn(Qa, Ka, Ja) {
                var Za = Ka.dir,
                    eo = Ka.next,
                    no = eo || Za,
                    ao = Ja && 'parentNode' === no,
                    oo = ma++;
                return Ka.first ? function(so, io, ro) {
                    for (; so = so[Za];)
                        if (1 === so.nodeType || ao) return Qa(so, io, ro);
                    return !1
                } : function(so, io, ro) {
                    var lo, po, uo, co = [fa, oo];
                    if (ro) {
                        for (; so = so[Za];)
                            if ((1 === so.nodeType || ao) && Qa(so, io, ro)) return !0;
                    } else
                        for (; so = so[Za];)
                            if (1 === so.nodeType || ao)
                                if (uo = so[pa] || (so[pa] = {}), po = uo[so.uniqueID] || (uo[so.uniqueID] = {}), eo && eo === so.nodeName.toLowerCase()) so = so[Za] || so;
                                else {
                                    if ((lo = po[no]) && lo[0] === fa && lo[1] === oo) return co[2] = lo[2];
                                    if (po[no] = co, co[2] = Qa(so, io, ro)) return !0
                                } return !1
                }
            }

            function Wn(Qa) {
                return 1 < Qa.length ? function(Ka, Ja, Za) {
                    for (var eo = Qa.length; eo--;)
                        if (!Qa[eo](Ka, Ja, Za)) return !1;
                    return !0
                } : Qa[0]
            }

            function _n(Qa, Ka, Ja) {
                for (var Za = 0, eo = Ka.length; Za < eo; Za++) Sn(Qa, Ka[Za], Ja);
                return Ja
            }

            function Rn(Qa, Ka, Ja, Za, eo) {
                for (var no, ao = [], oo = 0, so = Qa.length; oo < so; oo++)(no = Qa[oo]) && (!Ja || Ja(no, Za, eo)) && (ao.push(no), null != Ka && Ka.push(oo));
                return ao
            }

            function Fn(Qa, Ka, Ja, Za, eo, no) {
                return Za && !Za[pa] && (Za = Fn(Za)), eo && !eo[pa] && (eo = Fn(eo, no)), Dn(function(ao, oo, so, io) {
                    var ro, lo, po, uo = [],
                        co = [],
                        fo = oo.length,
                        mo = ao || _n(Ka || '*', so.nodeType ? [so] : so, []),
                        ho = Qa && (ao || !Ka) ? Rn(mo, uo, Qa, so, io) : mo,
                        go = Ja ? eo || (ao ? Qa : fo || Za) ? [] : oo : ho;
                    if (Ja && Ja(ho, go, so, io), Za)
                        for (ro = Rn(go, co), Za(ro, [], so, io), lo = ro.length; lo--;)(po = ro[lo]) && (go[co[lo]] = !(ho[co[lo]] = po));
                    if (!ao) go = Rn(go === oo ? go.splice(fo, go.length) : go), eo ? eo(null, oo, go, io) : ka.apply(oo, go);
                    else if (eo || Qa) {
                        if (eo) {
                            for (ro = [], lo = go.length; lo--;)(po = go[lo]) && ro.push(ho[lo] = po);
                            eo(null, go = [], ro, io)
                        }
                        for (lo = go.length; lo--;)(po = go[lo]) && -1 < (ro = eo ? Sa(ao, po) : uo[lo]) && (ao[ro] = !(oo[ro] = po))
                    }
                })
            }

            function zn(Qa) {
                for (var Ka, Ja, Za, eo = Qa.length, no = Vn.relative[Qa[0].type], ao = no || Vn.relative[' '], oo = no ? 1 : 0, so = Bn(function(lo) {
                        return lo === Ka
                    }, ao, !0), io = Bn(function(lo) {
                        return -1 < Sa(Ka, lo)
                    }, ao, !0), ro = [function(lo, po, uo) {
                        var co = !no && (uo || po !== Zn) || ((Ka = po).nodeType ? so(lo, po, uo) : io(lo, po, uo));
                        return Ka = null, co
                    }]; oo < eo; oo++)
                    if (Ja = Vn.relative[Qa[oo].type]) ro = [Bn(Wn(ro), Ja)];
                    else {
                        if (Ja = Vn.filter[Qa[oo].type].apply(null, Qa[oo].matches), Ja[pa]) {
                            for (Za = ++oo; Za < eo && !Vn.relative[Qa[Za].type]; Za++);
                            return Fn(1 < oo && Wn(ro), 1 < oo && In(Qa.slice(0, oo - 1).concat({
                                value: ' ' === Qa[oo - 2].type ? '*' : ''
                            })).replace(qa, '$1'), Ja, oo < Za && zn(Qa.slice(oo, Za)), Za < eo && zn(Qa = Qa.slice(Za)), Za < eo && In(Qa))
                        }
                        ro.push(Ja)
                    }
                return Wn(ro)
            }

            function $n(Qa, Ka) {
                var Ja = 0 < Ka.length,
                    Za = 0 < Qa.length,
                    eo = function(no, ao, oo, so, io) {
                        var ro, lo, po, uo = 0,
                            co = '0',
                            fo = no && [],
                            mo = [],
                            ho = Zn,
                            go = no || Za && Vn.find.TAG('*', io),
                            yo = fa += null == ho ? 1 : Math.random() || 0.1,
                            xo = go.length;
                        for (io && (Zn = ao === aa || ao || io); co !== xo && null != (ro = go[co]); co++) {
                            if (Za && ro) {
                                for (lo = 0, ao || ro.ownerDocument === aa || (na(ro), oo = !sa); po = Qa[lo++];)
                                    if (po(ro, ao || aa, oo)) {
                                        so.push(ro);
                                        break
                                    }
                                io && (fa = yo)
                            }
                            Ja && ((ro = !po && ro) && uo--, no && fo.push(ro))
                        }
                        if (uo += co, Ja && co !== uo) {
                            for (lo = 0; po = Ka[lo++];) po(fo, mo, ao, oo);
                            if (no) {
                                if (0 < uo)
                                    for (; co--;) fo[co] || mo[co] || (mo[co] = wa.call(so));
                                mo = Rn(mo)
                            }
                            ka.apply(so, mo), io && !no && 0 < mo.length && 1 < uo + Ka.length && Sn.uniqueSort(so)
                        }
                        return io && (fa = yo, Zn = ho), fo
                    };
                return Ja ? Dn(eo) : eo
            }
            var Un, Xn, Vn, Yn, Gn, Qn, Kn, Jn, Zn, ea, ta, na, aa, oa, sa, ia, ra, da, la, pa = 'sizzle' + 1 * new Date,
                ca = Cn.document,
                fa = 0,
                ma = 0,
                ha = Nn(),
                ga = Nn(),
                ya = Nn(),
                xa = function(Qa, Ka) {
                    return Qa === Ka && (ta = !0), 0
                },
                ba = {}.hasOwnProperty,
                va = [],
                wa = va.pop,
                Ta = va.push,
                ka = va.push,
                Ca = va.slice,
                Sa = function(Qa, Ka) {
                    for (var Ja = 0, Za = Qa.length; Ja < Za; Ja++)
                        if (Qa[Ja] === Ka) return Ja;
                    return -1
                },
                Na = 'checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped',
                Da = '[\\x20\\t\\r\\n\\f]',
                Ea = '(?:\\\\.|[\\w-]|[^\0-\\xa0])+',
                Aa = /[\x20\t\r\n\f]+/g,
                qa = /^[\x20\t\r\n\f]+|((?:^|[^\\])(?:\\.)*)[\x20\t\r\n\f]+$/g,
                Pa = /^[\x20\t\r\n\f]*,[\x20\t\r\n\f]*/,
                Oa = /^[\x20\t\r\n\f]*([>+~]|[\x20\t\r\n\f])[\x20\t\r\n\f]*/,
                Ha = /=[\x20\t\r\n\f]*([^\]'"]*?)[\x20\t\r\n\f]*\]/g,
                Ma = /:((?:\\.|[\w-]|[^-\xa0])+)(?:\((('((?:\\.|[^\\'])*)'|"((?:\\.|[^\\"])*)")|((?:\\.|[^\\()[\]]|\[[\x20\t\r\n\f]*((?:\\.|[\w-]|[^-\xa0])+)(?:[\x20\t\r\n\f]*([*^$|!~]?=)[\x20\t\r\n\f]*(?:'((?:\\.|[^\\'])*)'|"((?:\\.|[^\\"])*)"|((?:\\.|[\w-]|[^-\xa0])+))|)[\x20\t\r\n\f]*\])*)|.*)\)|)/,
                Ia = /^(?:\\.|[\w-]|[^-\xa0])+$/,
                Ba = {
                    ID: /^#((?:\\.|[\w-]|[^-\xa0])+)/,
                    CLASS: /^\.((?:\\.|[\w-]|[^-\xa0])+)/,
                    TAG: /^((?:\\.|[\w-]|[^-\xa0])+|[*])/,
                    ATTR: /^\[[\x20\t\r\n\f]*((?:\\.|[\w-]|[^-\xa0])+)(?:[\x20\t\r\n\f]*([*^$|!~]?=)[\x20\t\r\n\f]*(?:'((?:\\.|[^\\'])*)'|"((?:\\.|[^\\"])*)"|((?:\\.|[\w-]|[^-\xa0])+))|)[\x20\t\r\n\f]*\]/,
                    PSEUDO: /^:((?:\\.|[\w-]|[^-\xa0])+)(?:\((('((?:\\.|[^\\'])*)'|"((?:\\.|[^\\"])*)")|((?:\\.|[^\\()[\]]|\[[\x20\t\r\n\f]*((?:\\.|[\w-]|[^-\xa0])+)(?:[\x20\t\r\n\f]*([*^$|!~]?=)[\x20\t\r\n\f]*(?:'((?:\\.|[^\\'])*)'|"((?:\\.|[^\\"])*)"|((?:\\.|[\w-]|[^-\xa0])+))|)[\x20\t\r\n\f]*\])*)|.*)\)|)/,
                    CHILD: /^:(only|first|last|nth|nth-last)-(child|of-type)(?:\([\x20\t\r\n\f]*(even|odd|(([+-]|)(\d*)n|)[\x20\t\r\n\f]*(?:([+-]|)[\x20\t\r\n\f]*(\d+)|))[\x20\t\r\n\f]*\)|)/i,
                    bool: /^(?:checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped)$/i,
                    needsContext: /^[\x20\t\r\n\f]*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\([\x20\t\r\n\f]*((?:-\d)?\d*)[\x20\t\r\n\f]*\)|)(?=[^-]|$)/i
                },
                Wa = /^(?:input|select|textarea|button)$/i,
                _a = /^h\d$/i,
                Ra = /^[^{]+\{\s*\[native \w/,
                Fa = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
                za = /[+~]/,
                $a = /\\([\da-f]{1,6}[\x20\t\r\n\f]?|([\x20\t\r\n\f])|.)/ig,
                Ua = function(Qa, Ka, Ja) {
                    var Za = '0x' + Ka - 65536;
                    return Za != Za || Ja ? Ka : 0 > Za ? String.fromCharCode(Za + 65536) : String.fromCharCode(55296 | Za >> 10, 56320 | 1023 & Za)
                },
                Xa = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,
                Va = function(Qa, Ka) {
                    return Ka ? '\0' === Qa ? '\uFFFD' : Qa.slice(0, -1) + '\\' + Qa.charCodeAt(Qa.length - 1).toString(16) + ' ' : '\\' + Qa
                },
                Ya = function() {
                    na()
                },
                Ga = Bn(function(Qa) {
                    return !0 === Qa.disabled && ('form' in Qa || 'label' in Qa)
                }, {
                    dir: 'parentNode',
                    next: 'legend'
                });
            try {
                ka.apply(va = Ca.call(ca.childNodes), ca.childNodes), va[ca.childNodes.length].nodeType
            } catch (Qa) {
                ka = {
                    apply: va.length ? function(Ka, Ja) {
                        Ta.apply(Ka, Ca.call(Ja))
                    } : function(Ka, Ja) {
                        for (var Za = Ka.length, eo = 0; Ka[Za++] = Ja[eo++];);
                        Ka.length = Za - 1
                    }
                }
            }
            for (Un in Xn = Sn.support = {}, Gn = Sn.isXML = function(Qa) {
                    var Ka = Qa && (Qa.ownerDocument || Qa).documentElement;
                    return !!Ka && 'HTML' !== Ka.nodeName
                }, na = Sn.setDocument = function(Qa) {
                    var Ka, Ja, Za = Qa ? Qa.ownerDocument || Qa : ca;
                    return Za !== aa && 9 === Za.nodeType && Za.documentElement ? (aa = Za, oa = aa.documentElement, sa = !Gn(aa), ca !== aa && (Ja = aa.defaultView) && Ja.top !== Ja && (Ja.addEventListener ? Ja.addEventListener('unload', Ya, !1) : Ja.attachEvent && Ja.attachEvent('onunload', Ya)), Xn.attributes = En(function(eo) {
                        return eo.className = 'i', !eo.getAttribute('className')
                    }), Xn.getElementsByTagName = En(function(eo) {
                        return eo.appendChild(aa.createComment('')), !eo.getElementsByTagName('*').length
                    }), Xn.getElementsByClassName = Ra.test(aa.getElementsByClassName), Xn.getById = En(function(eo) {
                        return oa.appendChild(eo).id = pa, !aa.getElementsByName || !aa.getElementsByName(pa).length
                    }), Xn.getById ? (Vn.filter.ID = function(eo) {
                        var no = eo.replace($a, Ua);
                        return function(ao) {
                            return ao.getAttribute('id') === no
                        }
                    }, Vn.find.ID = function(eo, no) {
                        if ('undefined' != typeof no.getElementById && sa) {
                            var ao = no.getElementById(eo);
                            return ao ? [ao] : []
                        }
                    }) : (Vn.filter.ID = function(eo) {
                        var no = eo.replace($a, Ua);
                        return function(ao) {
                            var oo = 'undefined' != typeof ao.getAttributeNode && ao.getAttributeNode('id');
                            return oo && oo.value === no
                        }
                    }, Vn.find.ID = function(eo, no) {
                        if ('undefined' != typeof no.getElementById && sa) {
                            var ao, oo, so, io = no.getElementById(eo);
                            if (io) {
                                if (ao = io.getAttributeNode('id'), ao && ao.value === eo) return [io];
                                for (so = no.getElementsByName(eo), oo = 0; io = so[oo++];)
                                    if (ao = io.getAttributeNode('id'), ao && ao.value === eo) return [io]
                            }
                            return []
                        }
                    }), Vn.find.TAG = Xn.getElementsByTagName ? function(eo, no) {
                        return 'undefined' == typeof no.getElementsByTagName ? Xn.qsa ? no.querySelectorAll(eo) : void 0 : no.getElementsByTagName(eo)
                    } : function(eo, no) {
                        var ao, oo = [],
                            so = 0,
                            io = no.getElementsByTagName(eo);
                        if ('*' === eo) {
                            for (; ao = io[so++];) 1 === ao.nodeType && oo.push(ao);
                            return oo
                        }
                        return io
                    }, Vn.find.CLASS = Xn.getElementsByClassName && function(eo, no) {
                        if ('undefined' != typeof no.getElementsByClassName && sa) return no.getElementsByClassName(eo)
                    }, ra = [], ia = [], (Xn.qsa = Ra.test(aa.querySelectorAll)) && (En(function(eo) {
                        oa.appendChild(eo).innerHTML = '<a id=\'' + pa + '\'></a><select id=\'' + pa + '-\r\\\' msallowcapture=\'\'><option selected=\'\'></option></select>', eo.querySelectorAll('[msallowcapture^=\'\']').length && ia.push('[*^$]=' + Da + '*(?:\'\'|"")'), eo.querySelectorAll('[selected]').length || ia.push('\\[' + Da + '*(?:value|' + Na + ')'), eo.querySelectorAll('[id~=' + pa + '-]').length || ia.push('~='), eo.querySelectorAll(':checked').length || ia.push(':checked'), eo.querySelectorAll('a#' + pa + '+*').length || ia.push('.#.+[+~]')
                    }), En(function(eo) {
                        eo.innerHTML = '<a href=\'\' disabled=\'disabled\'></a><select disabled=\'disabled\'><option/></select>';
                        var no = aa.createElement('input');
                        no.setAttribute('type', 'hidden'), eo.appendChild(no).setAttribute('name', 'D'), eo.querySelectorAll('[name=d]').length && ia.push('name' + Da + '*[*^$|!~]?='), 2 !== eo.querySelectorAll(':enabled').length && ia.push(':enabled', ':disabled'), oa.appendChild(eo).disabled = !0, 2 !== eo.querySelectorAll(':disabled').length && ia.push(':enabled', ':disabled'), eo.querySelectorAll('*,:x'), ia.push(',.*:')
                    })), (Xn.matchesSelector = Ra.test(da = oa.matches || oa.webkitMatchesSelector || oa.mozMatchesSelector || oa.oMatchesSelector || oa.msMatchesSelector)) && En(function(eo) {
                        Xn.disconnectedMatch = da.call(eo, '*'), da.call(eo, '[s!=\'\']:x'), ra.push('!=', ':(' + Ea + ')(?:\\(((\'((?:\\\\.|[^\\\\\'])*)\'|"((?:\\\\.|[^\\\\"])*)")|((?:\\\\.|[^\\\\()[\\]]|' + ('\\[' + Da + '*(' + Ea + ')(?:' + Da + '*([*^$|!~]?=)' + Da + '*(?:\'((?:\\\\.|[^\\\\\'])*)\'|"((?:\\\\.|[^\\\\"])*)"|(' + Ea + '))|)' + Da + '*\\]') + ')*)|.*)\\)|)')
                    }), ia = ia.length && new RegExp(ia.join('|')), ra = ra.length && new RegExp(ra.join('|')), Ka = Ra.test(oa.compareDocumentPosition), la = Ka || Ra.test(oa.contains) ? function(eo, no) {
                        var ao = 9 === eo.nodeType ? eo.documentElement : eo,
                            oo = no && no.parentNode;
                        return eo === oo || !!(oo && 1 === oo.nodeType && (ao.contains ? ao.contains(oo) : eo.compareDocumentPosition && 16 & eo.compareDocumentPosition(oo)))
                    } : function(eo, no) {
                        if (no)
                            for (; no = no.parentNode;)
                                if (no === eo) return !0;
                        return !1
                    }, xa = Ka ? function(eo, no) {
                        if (eo === no) return ta = !0, 0;
                        var ao = !eo.compareDocumentPosition - !no.compareDocumentPosition;
                        return ao ? ao : (ao = (eo.ownerDocument || eo) === (no.ownerDocument || no) ? eo.compareDocumentPosition(no) : 1, 1 & ao || !Xn.sortDetached && no.compareDocumentPosition(eo) === ao ? eo === aa || eo.ownerDocument === ca && la(ca, eo) ? -1 : no === aa || no.ownerDocument === ca && la(ca, no) ? 1 : ea ? Sa(ea, eo) - Sa(ea, no) : 0 : 4 & ao ? -1 : 1)
                    } : function(eo, no) {
                        if (eo === no) return ta = !0, 0;
                        var ao, oo = 0,
                            so = eo.parentNode,
                            io = no.parentNode,
                            ro = [eo],
                            lo = [no];
                        if (!so || !io) return eo === aa ? -1 : no === aa ? 1 : so ? -1 : io ? 1 : ea ? Sa(ea, eo) - Sa(ea, no) : 0;
                        if (so === io) return Ln(eo, no);
                        for (ao = eo; ao = ao.parentNode;) ro.unshift(ao);
                        for (ao = no; ao = ao.parentNode;) lo.unshift(ao);
                        for (; ro[oo] === lo[oo];) oo++;
                        return oo ? Ln(ro[oo], lo[oo]) : ro[oo] === ca ? -1 : lo[oo] === ca ? 1 : 0
                    }, aa) : aa
                }, Sn.matches = function(Qa, Ka) {
                    return Sn(Qa, null, null, Ka)
                }, Sn.matchesSelector = function(Qa, Ka) {
                    if ((Qa.ownerDocument || Qa) !== aa && na(Qa), Ka = Ka.replace(Ha, '=\'$1\']'), Xn.matchesSelector && sa && !ya[Ka + ' '] && (!ra || !ra.test(Ka)) && (!ia || !ia.test(Ka))) try {
                        var Ja = da.call(Qa, Ka);
                        if (Ja || Xn.disconnectedMatch || Qa.document && 11 !== Qa.document.nodeType) return Ja
                    } catch (Za) {}
                    return 0 < Sn(Ka, aa, null, [Qa]).length
                }, Sn.contains = function(Qa, Ka) {
                    return (Qa.ownerDocument || Qa) !== aa && na(Qa), la(Qa, Ka)
                }, Sn.attr = function(Qa, Ka) {
                    (Qa.ownerDocument || Qa) !== aa && na(Qa);
                    var Ja = Vn.attrHandle[Ka.toLowerCase()],
                        Za = Ja && ba.call(Vn.attrHandle, Ka.toLowerCase()) ? Ja(Qa, Ka, !sa) : void 0;
                    return void 0 === Za ? Xn.attributes || !sa ? Qa.getAttribute(Ka) : (Za = Qa.getAttributeNode(Ka)) && Za.specified ? Za.value : null : Za
                }, Sn.escape = function(Qa) {
                    return (Qa + '').replace(Xa, Va)
                }, Sn.error = function(Qa) {
                    throw new Error('Syntax error, unrecognized expression: ' + Qa)
                }, Sn.uniqueSort = function(Qa) {
                    var Ka, Ja = [],
                        Za = 0,
                        eo = 0;
                    if (ta = !Xn.detectDuplicates, ea = !Xn.sortStable && Qa.slice(0), Qa.sort(xa), ta) {
                        for (; Ka = Qa[eo++];) Ka === Qa[eo] && (Za = Ja.push(eo));
                        for (; Za--;) Qa.splice(Ja[Za], 1)
                    }
                    return ea = null, Qa
                }, Yn = Sn.getText = function(Qa) {
                    var Ka, Ja = '',
                        Za = 0,
                        eo = Qa.nodeType;
                    if (!eo)
                        for (; Ka = Qa[Za++];) Ja += Yn(Ka);
                    else if (1 === eo || 9 === eo || 11 === eo) {
                        if ('string' == typeof Qa.textContent) return Qa.textContent;
                        for (Qa = Qa.firstChild; Qa; Qa = Qa.nextSibling) Ja += Yn(Qa)
                    } else if (3 === eo || 4 === eo) return Qa.nodeValue;
                    return Ja
                }, Vn = Sn.selectors = {
                    cacheLength: 50,
                    createPseudo: Dn,
                    match: Ba,
                    attrHandle: {},
                    find: {},
                    relative: {
                        '>': {
                            dir: 'parentNode',
                            first: !0
                        },
                        ' ': {
                            dir: 'parentNode'
                        },
                        '+': {
                            dir: 'previousSibling',
                            first: !0
                        },
                        '~': {
                            dir: 'previousSibling'
                        }
                    },
                    preFilter: {
                        ATTR: function(Qa) {
                            return Qa[1] = Qa[1].replace($a, Ua), Qa[3] = (Qa[3] || Qa[4] || Qa[5] || '').replace($a, Ua), '~=' === Qa[2] && (Qa[3] = ' ' + Qa[3] + ' '), Qa.slice(0, 4)
                        },
                        CHILD: function(Qa) {
                            return Qa[1] = Qa[1].toLowerCase(), 'nth' === Qa[1].slice(0, 3) ? (!Qa[3] && Sn.error(Qa[0]), Qa[4] = +(Qa[4] ? Qa[5] + (Qa[6] || 1) : 2 * ('even' === Qa[3] || 'odd' === Qa[3])), Qa[5] = +(Qa[7] + Qa[8] || 'odd' === Qa[3])) : Qa[3] && Sn.error(Qa[0]), Qa
                        },
                        PSEUDO: function(Qa) {
                            var Ka, Ja = !Qa[6] && Qa[2];
                            return Ba.CHILD.test(Qa[0]) ? null : (Qa[3] ? Qa[2] = Qa[4] || Qa[5] || '' : Ja && Ma.test(Ja) && (Ka = Qn(Ja, !0)) && (Ka = Ja.indexOf(')', Ja.length - Ka) - Ja.length) && (Qa[0] = Qa[0].slice(0, Ka), Qa[2] = Ja.slice(0, Ka)), Qa.slice(0, 3))
                        }
                    },
                    filter: {
                        TAG: function(Qa) {
                            var Ka = Qa.replace($a, Ua).toLowerCase();
                            return '*' === Qa ? function() {
                                return !0
                            } : function(Ja) {
                                return Ja.nodeName && Ja.nodeName.toLowerCase() === Ka
                            }
                        },
                        CLASS: function(Qa) {
                            var Ka = ha[Qa + ' '];
                            return Ka || (Ka = new RegExp('(^|' + Da + ')' + Qa + '(' + Da + '|$)')) && ha(Qa, function(Ja) {
                                return Ka.test('string' == typeof Ja.className && Ja.className || 'undefined' != typeof Ja.getAttribute && Ja.getAttribute('class') || '')
                            })
                        },
                        ATTR: function(Qa, Ka, Ja) {
                            return function(Za) {
                                var eo = Sn.attr(Za, Qa);
                                return null == eo ? '!=' === Ka : !Ka || (eo += '', '=' === Ka ? eo === Ja : '!=' === Ka ? eo !== Ja : '^=' === Ka ? Ja && 0 === eo.indexOf(Ja) : '*=' === Ka ? Ja && -1 < eo.indexOf(Ja) : '$=' === Ka ? Ja && eo.slice(-Ja.length) === Ja : '~=' === Ka ? -1 < (' ' + eo.replace(Aa, ' ') + ' ').indexOf(Ja) : '|=' == Ka && (eo === Ja || eo.slice(0, Ja.length + 1) === Ja + '-'))
                            }
                        },
                        CHILD: function(Qa, Ka, Ja, Za, eo) {
                            var no = 'nth' !== Qa.slice(0, 3),
                                ao = 'last' !== Qa.slice(-4),
                                oo = 'of-type' === Ka;
                            return 1 === Za && 0 === eo ? function(so) {
                                return !!so.parentNode
                            } : function(so, io, ro) {
                                var lo, po, uo, co, fo, mo, ho = no == ao ? 'previousSibling' : 'nextSibling',
                                    go = so.parentNode,
                                    yo = oo && so.nodeName.toLowerCase(),
                                    xo = !ro && !oo,
                                    bo = !1;
                                if (go) {
                                    if (no) {
                                        for (; ho;) {
                                            for (co = so; co = co[ho];)
                                                if (oo ? co.nodeName.toLowerCase() === yo : 1 === co.nodeType) return !1;
                                            mo = ho = 'only' === Qa && !mo && 'nextSibling'
                                        }
                                        return !0
                                    }
                                    if (mo = [ao ? go.firstChild : go.lastChild], ao && xo) {
                                        for (co = go, uo = co[pa] || (co[pa] = {}), po = uo[co.uniqueID] || (uo[co.uniqueID] = {}), lo = po[Qa] || [], fo = lo[0] === fa && lo[1], bo = fo && lo[2], co = fo && go.childNodes[fo]; co = ++fo && co && co[ho] || (bo = fo = 0) || mo.pop();)
                                            if (1 === co.nodeType && ++bo && co === so) {
                                                po[Qa] = [fa, fo, bo];
                                                break
                                            }
                                    } else if (xo && (co = so, uo = co[pa] || (co[pa] = {}), po = uo[co.uniqueID] || (uo[co.uniqueID] = {}), lo = po[Qa] || [], fo = lo[0] === fa && lo[1], bo = fo), !1 == bo)
                                        for (;
                                            (co = ++fo && co && co[ho] || (bo = fo = 0) || mo.pop()) && !((oo ? co.nodeName.toLowerCase() === yo : 1 === co.nodeType) && ++bo && (xo && (uo = co[pa] || (co[pa] = {}), po = uo[co.uniqueID] || (uo[co.uniqueID] = {}), po[Qa] = [fa, bo]), co === so)););
                                    return bo -= eo, bo === Za || 0 == bo % Za && 0 <= bo / Za
                                }
                            }
                        },
                        PSEUDO: function(Qa, Ka) {
                            var Ja, Za = Vn.pseudos[Qa] || Vn.setFilters[Qa.toLowerCase()] || Sn.error('unsupported pseudo: ' + Qa);
                            return Za[pa] ? Za(Ka) : 1 < Za.length ? (Ja = [Qa, Qa, '', Ka], Vn.setFilters.hasOwnProperty(Qa.toLowerCase()) ? Dn(function(eo, no) {
                                for (var ao, oo = Za(eo, Ka), so = oo.length; so--;) ao = Sa(eo, oo[so]), eo[ao] = !(no[ao] = oo[so])
                            }) : function(eo) {
                                return Za(eo, 0, Ja)
                            }) : Za
                        }
                    },
                    pseudos: {
                        not: Dn(function(Qa) {
                            var Ka = [],
                                Ja = [],
                                Za = Kn(Qa.replace(qa, '$1'));
                            return Za[pa] ? Dn(function(eo, no, ao, oo) {
                                for (var so, io = Za(eo, null, oo, []), ro = eo.length; ro--;)(so = io[ro]) && (eo[ro] = !(no[ro] = so))
                            }) : function(eo, no, ao) {
                                return Ka[0] = eo, Za(Ka, null, ao, Ja), Ka[0] = null, !Ja.pop()
                            }
                        }),
                        has: Dn(function(Qa) {
                            return function(Ka) {
                                return 0 < Sn(Qa, Ka).length
                            }
                        }),
                        contains: Dn(function(Qa) {
                            return Qa = Qa.replace($a, Ua),
                                function(Ka) {
                                    return -1 < (Ka.textContent || Ka.innerText || Yn(Ka)).indexOf(Qa)
                                }
                        }),
                        lang: Dn(function(Qa) {
                            return Ia.test(Qa || '') || Sn.error('unsupported lang: ' + Qa), Qa = Qa.replace($a, Ua).toLowerCase(),
                                function(Ka) {
                                    var Ja;
                                    do
                                        if (Ja = sa ? Ka.lang : Ka.getAttribute('xml:lang') || Ka.getAttribute('lang')) return Ja = Ja.toLowerCase(), Ja === Qa || 0 === Ja.indexOf(Qa + '-'); while ((Ka = Ka.parentNode) && 1 === Ka.nodeType);
                                    return !1
                                }
                        }),
                        target: function(Qa) {
                            var Ka = Cn.location && Cn.location.hash;
                            return Ka && Ka.slice(1) === Qa.id
                        },
                        root: function(Qa) {
                            return Qa === oa
                        },
                        focus: function(Qa) {
                            return Qa === aa.activeElement && (!aa.hasFocus || aa.hasFocus()) && !!(Qa.type || Qa.href || ~Qa.tabIndex)
                        },
                        enabled: Pn(!1),
                        disabled: Pn(!0),
                        checked: function(Qa) {
                            var Ka = Qa.nodeName.toLowerCase();
                            return 'input' === Ka && !!Qa.checked || 'option' === Ka && !!Qa.selected
                        },
                        selected: function(Qa) {
                            return Qa.parentNode && Qa.parentNode.selectedIndex, !0 === Qa.selected
                        },
                        empty: function(Qa) {
                            for (Qa = Qa.firstChild; Qa; Qa = Qa.nextSibling)
                                if (6 > Qa.nodeType) return !1;
                            return !0
                        },
                        parent: function(Qa) {
                            return !Vn.pseudos.empty(Qa)
                        },
                        header: function(Qa) {
                            return _a.test(Qa.nodeName)
                        },
                        input: function(Qa) {
                            return Wa.test(Qa.nodeName)
                        },
                        button: function(Qa) {
                            var Ka = Qa.nodeName.toLowerCase();
                            return 'input' === Ka && 'button' === Qa.type || 'button' === Ka
                        },
                        text: function(Qa) {
                            var Ka;
                            return 'input' === Qa.nodeName.toLowerCase() && 'text' === Qa.type && (null == (Ka = Qa.getAttribute('type')) || 'text' === Ka.toLowerCase())
                        },
                        first: On(function() {
                            return [0]
                        }),
                        last: On(function(Qa, Ka) {
                            return [Ka - 1]
                        }),
                        eq: On(function(Qa, Ka, Ja) {
                            return [0 > Ja ? Ja + Ka : Ja]
                        }),
                        even: On(function(Qa, Ka) {
                            for (var Ja = 0; Ja < Ka; Ja += 2) Qa.push(Ja);
                            return Qa
                        }),
                        odd: On(function(Qa, Ka) {
                            for (var Ja = 1; Ja < Ka; Ja += 2) Qa.push(Ja);
                            return Qa
                        }),
                        lt: On(function(Qa, Ka, Ja) {
                            for (var Za = 0 > Ja ? Ja + Ka : Ja; 0 <= --Za;) Qa.push(Za);
                            return Qa
                        }),
                        gt: On(function(Qa, Ka, Ja) {
                            for (var Za = 0 > Ja ? Ja + Ka : Ja; ++Za < Ka;) Qa.push(Za);
                            return Qa
                        })
                    }
                }, Vn.pseudos.nth = Vn.pseudos.eq, {
                    radio: !0,
                    checkbox: !0,
                    file: !0,
                    password: !0,
                    image: !0
                }) Vn.pseudos[Un] = An(Un);
            for (Un in {
                    submit: !0,
                    reset: !0
                }) Vn.pseudos[Un] = qn(Un);
            return Mn.prototype = Vn.filters = Vn.pseudos, Vn.setFilters = new Mn, Qn = Sn.tokenize = function(Qa, Ka) {
                var Ja, Za, eo, no, ao, oo, so, io = ga[Qa + ' '];
                if (io) return Ka ? 0 : io.slice(0);
                for (ao = Qa, oo = [], so = Vn.preFilter; ao;) {
                    for (no in (!Ja || (Za = Pa.exec(ao))) && (Za && (ao = ao.slice(Za[0].length) || ao), oo.push(eo = [])), Ja = !1, (Za = Oa.exec(ao)) && (Ja = Za.shift(), eo.push({
                            value: Ja,
                            type: Za[0].replace(qa, ' ')
                        }), ao = ao.slice(Ja.length)), Vn.filter)(Za = Ba[no].exec(ao)) && (!so[no] || (Za = so[no](Za))) && (Ja = Za.shift(), eo.push({
                        value: Ja,
                        type: no,
                        matches: Za
                    }), ao = ao.slice(Ja.length));
                    if (!Ja) break
                }
                return Ka ? ao.length : ao ? Sn.error(Qa) : ga(Qa, oo).slice(0)
            }, Kn = Sn.compile = function(Qa, Ka) {
                var Ja, Za = [],
                    eo = [],
                    no = ya[Qa + ' '];
                if (!no) {
                    for (Ka || (Ka = Qn(Qa)), Ja = Ka.length; Ja--;) no = zn(Ka[Ja]), no[pa] ? Za.push(no) : eo.push(no);
                    no = ya(Qa, $n(eo, Za)), no.selector = Qa
                }
                return no
            }, Jn = Sn.select = function(Qa, Ka, Ja, Za) {
                var eo, no, ao, oo, so, io = 'function' == typeof Qa && Qa,
                    ro = !Za && Qn(Qa = io.selector || Qa);
                if (Ja = Ja || [], 1 === ro.length) {
                    if (no = ro[0] = ro[0].slice(0), 2 < no.length && 'ID' === (ao = no[0]).type && 9 === Ka.nodeType && sa && Vn.relative[no[1].type]) {
                        if (Ka = (Vn.find.ID(ao.matches[0].replace($a, Ua), Ka) || [])[0], !Ka) return Ja;
                        io && (Ka = Ka.parentNode), Qa = Qa.slice(no.shift().value.length)
                    }
                    for (eo = Ba.needsContext.test(Qa) ? 0 : no.length; eo-- && (ao = no[eo], !Vn.relative[oo = ao.type]);)
                        if ((so = Vn.find[oo]) && (Za = so(ao.matches[0].replace($a, Ua), za.test(no[0].type) && Hn(Ka.parentNode) || Ka))) {
                            if (no.splice(eo, 1), Qa = Za.length && In(no), !Qa) return ka.apply(Ja, Za), Ja;
                            break
                        }
                }
                return (io || Kn(Qa, ro))(Za, Ka, !sa, Ja, !Ka || za.test(Qa) && Hn(Ka.parentNode) || Ka), Ja
            }, Xn.sortStable = pa.split('').sort(xa).join('') === pa, Xn.detectDuplicates = !!ta, na(), Xn.sortDetached = En(function(Qa) {
                return 1 & Qa.compareDocumentPosition(aa.createElement('fieldset'))
            }), En(function(Qa) {
                return Qa.innerHTML = '<a href=\'#\'></a>', '#' === Qa.firstChild.getAttribute('href')
            }) || jn('type|href|height|width', function(Qa, Ka, Ja) {
                if (!Ja) return Qa.getAttribute(Ka, 'type' === Ka.toLowerCase() ? 1 : 2)
            }), Xn.attributes && En(function(Qa) {
                return Qa.innerHTML = '<input/>', Qa.firstChild.setAttribute('value', ''), '' === Qa.firstChild.getAttribute('value')
            }) || jn('value', function(Qa, Ka, Ja) {
                if (!Ja && 'input' === Qa.nodeName.toLowerCase()) return Qa.defaultValue
            }), En(function(Qa) {
                return null == Qa.getAttribute('disabled')
            }) || jn(Na, function(Qa, Ka, Ja) {
                var Za;
                if (!Ja) return !0 === Qa[Ka] ? Ka.toLowerCase() : (Za = Qa.getAttributeNode(Ka)) && Za.specified ? Za.value : null
            }), Sn
        }(f);
        Fe.find = $e, Fe.expr = $e.selectors, Fe.expr[':'] = Fe.expr.pseudos, Fe.uniqueSort = Fe.unique = $e.uniqueSort, Fe.text = $e.getText, Fe.isXMLDoc = $e.isXML, Fe.contains = $e.contains, Fe.escapeSelector = $e.escape;
        var Ue = function(Cn, Sn, Nn) {
                for (var Dn = [];
                    (Cn = Cn[Sn]) && 9 !== Cn.nodeType;)
                    if (1 === Cn.nodeType) {
                        if (void 0 !== Nn && Fe(Cn).is(Nn)) break;
                        Dn.push(Cn)
                    }
                return Dn
            },
            Xe = function(Cn, Sn) {
                for (var Nn = []; Cn; Cn = Cn.nextSibling) 1 === Cn.nodeType && Cn !== Sn && Nn.push(Cn);
                return Nn
            },
            Ve = Fe.expr.match.needsContext,
            Ye = /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;
        Fe.filter = function(Cn, Sn, Nn) {
            var Dn = Sn[0];
            return Nn && (Cn = ':not(' + Cn + ')'), 1 === Sn.length && 1 === Dn.nodeType ? Fe.find.matchesSelector(Dn, Cn) ? [Dn] : [] : Fe.find.matches(Cn, Fe.grep(Sn, function(En) {
                return 1 === En.nodeType
            }))
        }, Fe.fn.extend({
            find: function(Cn) {
                var Sn, Nn, Dn = this.length,
                    En = this;
                if ('string' != typeof Cn) return this.pushStack(Fe(Cn).filter(function() {
                    for (Sn = 0; Sn < Dn; Sn++)
                        if (Fe.contains(En[Sn], this)) return !0
                }));
                for (Nn = this.pushStack([]), Sn = 0; Sn < Dn; Sn++) Fe.find(Cn, En[Sn], Nn);
                return 1 < Dn ? Fe.uniqueSort(Nn) : Nn
            },
            filter: function(Cn) {
                return this.pushStack(k(this, Cn || [], !1))
            },
            not: function(Cn) {
                return this.pushStack(k(this, Cn || [], !0))
            },
            is: function(Cn) {
                return !!k(this, 'string' == typeof Cn && Ve.test(Cn) ? Fe(Cn) : Cn || [], !1).length
            }
        });
        var Ge, Qe = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,
            Ke = Fe.fn.init = function(Cn, Sn, Nn) {
                var Dn, En;
                if (!Cn) return this;
                if (Nn = Nn || Ge, 'string' == typeof Cn) {
                    if (Dn = '<' === Cn[0] && '>' === Cn[Cn.length - 1] && 3 <= Cn.length ? [null, Cn, null] : Qe.exec(Cn), Dn && (Dn[1] || !Sn)) {
                        if (Dn[1]) {
                            if (Sn = Sn instanceof Fe ? Sn[0] : Sn, Fe.merge(this, Fe.parseHTML(Dn[1], Sn && Sn.nodeType ? Sn.ownerDocument || Sn : Ne, !0)), Ye.test(Dn[1]) && Fe.isPlainObject(Sn))
                                for (Dn in Sn) Be(this[Dn]) ? this[Dn](Sn[Dn]) : this.attr(Dn, Sn[Dn]);
                            return this
                        }
                        return En = Ne.getElementById(Dn[2]), En && (this[0] = En, this.length = 1), this
                    }
                    return !Sn || Sn.jquery ? (Sn || Nn).find(Cn) : this.constructor(Sn).find(Cn)
                }
                return Cn.nodeType ? (this[0] = Cn, this.length = 1, this) : Be(Cn) ? void 0 === Nn.ready ? Cn(Fe) : Nn.ready(Cn) : Fe.makeArray(Cn, this)
            };
        Ke.prototype = Fe.fn, Ge = Fe(Ne);
        var Je = /^(?:parents|prev(?:Until|All))/,
            Ze = {
                children: !0,
                contents: !0,
                next: !0,
                prev: !0
            };
        Fe.fn.extend({
            has: function(Cn) {
                var Sn = Fe(Cn, this),
                    Nn = Sn.length;
                return this.filter(function() {
                    for (var Dn = 0; Dn < Nn; Dn++)
                        if (Fe.contains(this, Sn[Dn])) return !0
                })
            },
            closest: function(Cn, Sn) {
                var Nn, Dn = 0,
                    En = this.length,
                    jn = [],
                    Ln = 'string' != typeof Cn && Fe(Cn);
                if (!Ve.test(Cn))
                    for (; Dn < En; Dn++)
                        for (Nn = this[Dn]; Nn && Nn !== Sn; Nn = Nn.parentNode)
                            if (11 > Nn.nodeType && (Ln ? -1 < Ln.index(Nn) : 1 === Nn.nodeType && Fe.find.matchesSelector(Nn, Cn))) {
                                jn.push(Nn);
                                break
                            }
                return this.pushStack(1 < jn.length ? Fe.uniqueSort(jn) : jn)
            },
            index: function(Cn) {
                return Cn ? 'string' == typeof Cn ? Ae.call(Fe(Cn), this[0]) : Ae.call(this, Cn.jquery ? Cn[0] : Cn) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1
            },
            add: function(Cn, Sn) {
                return this.pushStack(Fe.uniqueSort(Fe.merge(this.get(), Fe(Cn, Sn))))
            },
            addBack: function(Cn) {
                return this.add(null == Cn ? this.prevObject : this.prevObject.filter(Cn))
            }
        }), Fe.each({
            parent: function(Cn) {
                var Sn = Cn.parentNode;
                return Sn && 11 !== Sn.nodeType ? Sn : null
            },
            parents: function(Cn) {
                return Ue(Cn, 'parentNode')
            },
            parentsUntil: function(Cn, Sn, Nn) {
                return Ue(Cn, 'parentNode', Nn)
            },
            next: function(Cn) {
                return C(Cn, 'nextSibling')
            },
            prev: function(Cn) {
                return C(Cn, 'previousSibling')
            },
            nextAll: function(Cn) {
                return Ue(Cn, 'nextSibling')
            },
            prevAll: function(Cn) {
                return Ue(Cn, 'previousSibling')
            },
            nextUntil: function(Cn, Sn, Nn) {
                return Ue(Cn, 'nextSibling', Nn)
            },
            prevUntil: function(Cn, Sn, Nn) {
                return Ue(Cn, 'previousSibling', Nn)
            },
            siblings: function(Cn) {
                return Xe((Cn.parentNode || {}).firstChild, Cn)
            },
            children: function(Cn) {
                return Xe(Cn.firstChild)
            },
            contents: function(Cn) {
                return T(Cn, 'iframe') ? Cn.contentDocument : (T(Cn, 'template') && (Cn = Cn.content || Cn), Fe.merge([], Cn.childNodes))
            }
        }, function(Cn, Sn) {
            Fe.fn[Cn] = function(Nn, Dn) {
                var En = Fe.map(this, Sn, Nn);
                return 'Until' !== Cn.slice(-5) && (Dn = Nn), Dn && 'string' == typeof Dn && (En = Fe.filter(Dn, En)), 1 < this.length && (!Ze[Cn] && Fe.uniqueSort(En), Je.test(Cn) && En.reverse()), this.pushStack(En)
            }
        });
        var et = /[^\x20\t\r\n\f]+/g;
        Fe.Callbacks = function(Cn) {
            Cn = 'string' == typeof Cn ? S(Cn) : Fe.extend({}, Cn);
            var Sn, Nn, Dn, En, jn = [],
                Ln = [],
                An = -1,
                qn = function() {
                    for (En = En || Cn.once, Dn = Sn = !0; Ln.length; An = -1)
                        for (Nn = Ln.shift(); ++An < jn.length;) !1 === jn[An].apply(Nn[0], Nn[1]) && Cn.stopOnFalse && (An = jn.length, Nn = !1);
                    Cn.memory || (Nn = !1), Sn = !1, En && (Nn ? jn = [] : jn = '')
                },
                Pn = {
                    add: function() {
                        return jn && (Nn && !Sn && (An = jn.length - 1, Ln.push(Nn)), function On(Hn) {
                            Fe.each(Hn, function(Mn, In) {
                                Be(In) ? (!Cn.unique || !Pn.has(In)) && jn.push(In) : In && In.length && 'string' !== y(In) && On(In)
                            })
                        }(arguments), Nn && !Sn && qn()), this
                    },
                    remove: function() {
                        return Fe.each(arguments, function(On, Hn) {
                            for (var Mn; - 1 < (Mn = Fe.inArray(Hn, jn, Mn));) jn.splice(Mn, 1), Mn <= An && An--
                        }), this
                    },
                    has: function(On) {
                        return On ? -1 < Fe.inArray(On, jn) : 0 < jn.length
                    },
                    empty: function() {
                        return jn && (jn = []), this
                    },
                    disable: function() {
                        return En = Ln = [], jn = Nn = '', this
                    },
                    disabled: function() {
                        return !jn
                    },
                    lock: function() {
                        return En = Ln = [], Nn || Sn || (jn = Nn = ''), this
                    },
                    locked: function() {
                        return !!En
                    },
                    fireWith: function(On, Hn) {
                        return En || (Hn = Hn || [], Hn = [On, Hn.slice ? Hn.slice() : Hn], Ln.push(Hn), !Sn && qn()), this
                    },
                    fire: function() {
                        return Pn.fireWith(this, arguments), this
                    },
                    fired: function() {
                        return !!Dn
                    }
                };
            return Pn
        }, Fe.extend({
            Deferred: function(Cn) {
                var Sn = [
                        ['notify', 'progress', Fe.Callbacks('memory'), Fe.Callbacks('memory'), 2],
                        ['resolve', 'done', Fe.Callbacks('once memory'), Fe.Callbacks('once memory'), 0, 'resolved'],
                        ['reject', 'fail', Fe.Callbacks('once memory'), Fe.Callbacks('once memory'), 1, 'rejected']
                    ],
                    Nn = 'pending',
                    Dn = {
                        state: function() {
                            return Nn
                        },
                        always: function() {
                            return En.done(arguments).fail(arguments), this
                        },
                        'catch': function(jn) {
                            return Dn.then(null, jn)
                        },
                        pipe: function() {
                            var jn = arguments;
                            return Fe.Deferred(function(Ln) {
                                Fe.each(Sn, function(An, qn) {
                                    var Pn = Be(jn[qn[4]]) && jn[qn[4]];
                                    En[qn[1]](function() {
                                        var On = Pn && Pn.apply(this, arguments);
                                        On && Be(On.promise) ? On.promise().progress(Ln.notify).done(Ln.resolve).fail(Ln.reject) : Ln[qn[0] + 'With'](this, Pn ? [On] : arguments)
                                    })
                                }), jn = null
                            }).promise()
                        },
                        then: function(jn, Ln, An) {
                            function qn(On, Hn, Mn, In) {
                                return function() {
                                    var Bn = this,
                                        Wn = arguments,
                                        _n = function() {
                                            var Fn, zn;
                                            if (!(On < Pn)) {
                                                if (Fn = Mn.apply(Bn, Wn), Fn === Hn.promise()) throw new TypeError('Thenable self-resolution');
                                                zn = Fn && ('object' == typeof Fn || 'function' == typeof Fn) && Fn.then, Be(zn) ? In ? zn.call(Fn, qn(Pn, Hn, N, In), qn(Pn, Hn, D, In)) : (Pn++, zn.call(Fn, qn(Pn, Hn, N, In), qn(Pn, Hn, D, In), qn(Pn, Hn, N, Hn.notifyWith))) : (Mn !== N && (Bn = void 0, Wn = [Fn]), (In || Hn.resolveWith)(Bn, Wn))
                                            }
                                        },
                                        Rn = In ? _n : function() {
                                            try {
                                                _n()
                                            } catch (Fn) {
                                                Fe.Deferred.exceptionHook && Fe.Deferred.exceptionHook(Fn, Rn.stackTrace), On + 1 >= Pn && (Mn !== D && (Bn = void 0, Wn = [Fn]), Hn.rejectWith(Bn, Wn))
                                            }
                                        };
                                    On ? Rn() : (Fe.Deferred.getStackHook && (Rn.stackTrace = Fe.Deferred.getStackHook()), f.setTimeout(Rn))
                                }
                            }
                            var Pn = 0;
                            return Fe.Deferred(function(On) {
                                Sn[0][3].add(qn(0, On, Be(An) ? An : N, On.notifyWith)), Sn[1][3].add(qn(0, On, Be(jn) ? jn : N)), Sn[2][3].add(qn(0, On, Be(Ln) ? Ln : D))
                            }).promise()
                        },
                        promise: function(jn) {
                            return null == jn ? Dn : Fe.extend(jn, Dn)
                        }
                    },
                    En = {};
                return Fe.each(Sn, function(jn, Ln) {
                    var An = Ln[2],
                        qn = Ln[5];
                    Dn[Ln[1]] = An.add, qn && An.add(function() {
                        Nn = qn
                    }, Sn[3 - jn][2].disable, Sn[3 - jn][3].disable, Sn[0][2].lock, Sn[0][3].lock), An.add(Ln[3].fire), En[Ln[0]] = function() {
                        return En[Ln[0] + 'With'](this === En ? void 0 : this, arguments), this
                    }, En[Ln[0] + 'With'] = An.fireWith
                }), Dn.promise(En), Cn && Cn.call(En, En), En
            },
            when: function(Cn) {
                var Sn = arguments.length,
                    Nn = Sn,
                    Dn = Array(Nn),
                    En = Ee.call(arguments),
                    jn = Fe.Deferred(),
                    Ln = function(An) {
                        return function(qn) {
                            Dn[An] = this, En[An] = 1 < arguments.length ? Ee.call(arguments) : qn, --Sn || jn.resolveWith(Dn, En)
                        }
                    };
                if (1 >= Sn && (E(Cn, jn.done(Ln(Nn)).resolve, jn.reject, !Sn), 'pending' === jn.state() || Be(En[Nn] && En[Nn].then))) return jn.then();
                for (; Nn--;) E(En[Nn], Ln(Nn), jn.reject);
                return jn.promise()
            }
        });
        var tt = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;
        Fe.Deferred.exceptionHook = function(Cn, Sn) {
            f.console && f.console.warn && Cn && tt.test(Cn.name) && f.console.warn('jQuery.Deferred exception: ' + Cn.message, Cn.stack, Sn)
        }, Fe.readyException = function(Cn) {
            f.setTimeout(function() {
                throw Cn
            })
        };
        var nt = Fe.Deferred();
        Fe.fn.ready = function(Cn) {
            return nt.then(Cn).catch(function(Sn) {
                Fe.readyException(Sn)
            }), this
        }, Fe.extend({
            isReady: !1,
            readyWait: 1,
            ready: function(Cn) {
                (!0 === Cn ? !--Fe.readyWait : !Fe.isReady) && (Fe.isReady = !0, !0 !== Cn && 0 < --Fe.readyWait || nt.resolveWith(Ne, [Fe]))
            }
        }), Fe.ready.then = nt.then, 'complete' !== Ne.readyState && ('loading' === Ne.readyState || Ne.documentElement.doScroll) ? (Ne.addEventListener('DOMContentLoaded', L), f.addEventListener('load', L)) : f.setTimeout(Fe.ready);
        var at = function(Cn, Sn, Nn, Dn, En, jn, Ln) {
                var An = 0,
                    qn = Cn.length,
                    Pn = null == Nn;
                if ('object' === y(Nn))
                    for (An in En = !0, Nn) at(Cn, Sn, An, Nn[An], !0, jn, Ln);
                else if (void 0 !== Dn && (En = !0, Be(Dn) || (Ln = !0), Pn && (Ln ? (Sn.call(Cn, Dn), Sn = null) : (Pn = Sn, Sn = function(On, Hn, Mn) {
                        return Pn.call(Fe(On), Mn)
                    })), Sn))
                    for (; An < qn; An++) Sn(Cn[An], Nn, Ln ? Dn : Dn.call(Cn[An], An, Sn(Cn[An], Nn)));
                return En ? Cn : Pn ? Sn.call(Cn) : qn ? Sn(Cn[0], Nn) : jn
            },
            ot = /^-ms-/,
            st = /-([a-z])/g,
            it = function(Cn) {
                return 1 === Cn.nodeType || 9 === Cn.nodeType || !+Cn.nodeType
            };
        P.uid = 1, P.prototype = {
            cache: function(Cn) {
                var Sn = Cn[this.expando];
                return Sn || (Sn = {}, it(Cn) && (Cn.nodeType ? Cn[this.expando] = Sn : Object.defineProperty(Cn, this.expando, {
                    value: Sn,
                    configurable: !0
                }))), Sn
            },
            set: function(Cn, Sn, Nn) {
                var Dn, En = this.cache(Cn);
                if ('string' == typeof Sn) En[q(Sn)] = Nn;
                else
                    for (Dn in Sn) En[q(Dn)] = Sn[Dn];
                return En
            },
            get: function(Cn, Sn) {
                return void 0 === Sn ? this.cache(Cn) : Cn[this.expando] && Cn[this.expando][q(Sn)]
            },
            access: function(Cn, Sn, Nn) {
                return void 0 === Sn || Sn && 'string' == typeof Sn && void 0 === Nn ? this.get(Cn, Sn) : (this.set(Cn, Sn, Nn), void 0 === Nn ? Sn : Nn)
            },
            remove: function(Cn, Sn) {
                var Nn, Dn = Cn[this.expando];
                if (void 0 !== Dn) {
                    if (void 0 !== Sn)
                        for (Array.isArray(Sn) ? Sn = Sn.map(q) : (Sn = q(Sn), Sn = (Sn in Dn) ? [Sn] : Sn.match(et) || []), Nn = Sn.length; Nn--;) delete Dn[Sn[Nn]];
                    (void 0 === Sn || Fe.isEmptyObject(Dn)) && (Cn.nodeType ? Cn[this.expando] = void 0 : delete Cn[this.expando])
                }
            },
            hasData: function(Cn) {
                var Sn = Cn[this.expando];
                return void 0 !== Sn && !Fe.isEmptyObject(Sn)
            }
        };
        var rt = new P,
            dt = new P,
            lt = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
            pt = /[A-Z]/g;
        Fe.extend({
            hasData: function(Cn) {
                return dt.hasData(Cn) || rt.hasData(Cn)
            },
            data: function(Cn, Sn, Nn) {
                return dt.access(Cn, Sn, Nn)
            },
            removeData: function(Cn, Sn) {
                dt.remove(Cn, Sn)
            },
            _data: function(Cn, Sn, Nn) {
                return rt.access(Cn, Sn, Nn)
            },
            _removeData: function(Cn, Sn) {
                rt.remove(Cn, Sn)
            }
        }), Fe.fn.extend({
            data: function(Cn, Sn) {
                var Nn, Dn, En, jn = this[0],
                    Ln = jn && jn.attributes;
                if (void 0 === Cn) {
                    if (this.length && (En = dt.get(jn), 1 === jn.nodeType && !rt.get(jn, 'hasDataAttrs'))) {
                        for (Nn = Ln.length; Nn--;) Ln[Nn] && (Dn = Ln[Nn].name, 0 === Dn.indexOf('data-') && (Dn = q(Dn.slice(5)), H(jn, Dn, En[Dn])));
                        rt.set(jn, 'hasDataAttrs', !0)
                    }
                    return En
                }
                return 'object' == typeof Cn ? this.each(function() {
                    dt.set(this, Cn)
                }) : at(this, function(An) {
                    var qn;
                    return jn && void 0 === An ? (qn = dt.get(jn, Cn), void 0 != qn) ? qn : (qn = H(jn, Cn), void 0 == qn ? void 0 : qn) : void this.each(function() {
                        dt.set(this, Cn, An)
                    })
                }, null, Sn, 1 < arguments.length, null, !0)
            },
            removeData: function(Cn) {
                return this.each(function() {
                    dt.remove(this, Cn)
                })
            }
        }), Fe.extend({
            queue: function(Cn, Sn, Nn) {
                var Dn;
                if (Cn) return Sn = (Sn || 'fx') + 'queue', Dn = rt.get(Cn, Sn), Nn && (!Dn || Array.isArray(Nn) ? Dn = rt.access(Cn, Sn, Fe.makeArray(Nn)) : Dn.push(Nn)), Dn || []
            },
            dequeue: function(Cn, Sn) {
                Sn = Sn || 'fx';
                var Nn = Fe.queue(Cn, Sn),
                    Dn = Nn.length,
                    En = Nn.shift(),
                    jn = Fe._queueHooks(Cn, Sn);
                'inprogress' === En && (En = Nn.shift(), Dn--), En && ('fx' === Sn && Nn.unshift('inprogress'), delete jn.stop, En.call(Cn, function() {
                    Fe.dequeue(Cn, Sn)
                }, jn)), !Dn && jn && jn.empty.fire()
            },
            _queueHooks: function(Cn, Sn) {
                var Nn = Sn + 'queueHooks';
                return rt.get(Cn, Nn) || rt.access(Cn, Nn, {
                    empty: Fe.Callbacks('once memory').add(function() {
                        rt.remove(Cn, [Sn + 'queue', Nn])
                    })
                })
            }
        }), Fe.fn.extend({
            queue: function(Cn, Sn) {
                var Nn = 2;
                return 'string' != typeof Cn && (Sn = Cn, Cn = 'fx', Nn--), arguments.length < Nn ? Fe.queue(this[0], Cn) : void 0 === Sn ? this : this.each(function() {
                    var Dn = Fe.queue(this, Cn, Sn);
                    Fe._queueHooks(this, Cn), 'fx' === Cn && 'inprogress' !== Dn[0] && Fe.dequeue(this, Cn)
                })
            },
            dequeue: function(Cn) {
                return this.each(function() {
                    Fe.dequeue(this, Cn)
                })
            },
            clearQueue: function(Cn) {
                return this.queue(Cn || 'fx', [])
            },
            promise: function(Cn, Sn) {
                var Nn, Dn = 1,
                    En = Fe.Deferred(),
                    jn = this,
                    Ln = this.length,
                    An = function() {
                        --Dn || En.resolveWith(jn, [jn])
                    };
                for ('string' != typeof Cn && (Sn = Cn, Cn = void 0), Cn = Cn || 'fx'; Ln--;) Nn = rt.get(jn[Ln], Cn + 'queueHooks'), Nn && Nn.empty && (Dn++, Nn.empty.add(An));
                return An(), En.promise(Sn)
            }
        });
        var ut = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
            ft = new RegExp('^(?:([+-])=|)(' + ut + ')([a-z%]*)$', 'i'),
            mt = ['Top', 'Right', 'Bottom', 'Left'],
            ht = function(Cn, Sn) {
                return Cn = Sn || Cn, 'none' === Cn.style.display || '' === Cn.style.display && Fe.contains(Cn.ownerDocument, Cn) && 'none' === Fe.css(Cn, 'display')
            },
            gt = function(Cn, Sn, Nn, Dn) {
                var En, jn, Ln = {};
                for (jn in Sn) Ln[jn] = Cn.style[jn], Cn.style[jn] = Sn[jn];
                for (jn in En = Nn.apply(Cn, Dn || []), Sn) Cn.style[jn] = Ln[jn];
                return En
            },
            yt = {};
        Fe.fn.extend({
            show: function() {
                return B(this, !0)
            },
            hide: function() {
                return B(this)
            },
            toggle: function(Cn) {
                return 'boolean' == typeof Cn ? Cn ? this.show() : this.hide() : this.each(function() {
                    ht(this) ? Fe(this).show() : Fe(this).hide()
                })
            }
        });
        var xt = /^(?:checkbox|radio)$/i,
            bt = /<([a-z][^\/\0>\x20\t\r\n\f]+)/i,
            vt = /^$|^module$|\/(?:java|ecma)script/i,
            wt = {
                option: [1, '<select multiple=\'multiple\'>', '</select>'],
                thead: [1, '<table>', '</table>'],
                col: [2, '<table><colgroup>', '</colgroup></table>'],
                tr: [2, '<table><tbody>', '</tbody></table>'],
                td: [3, '<table><tbody><tr>', '</tr></tbody></table>'],
                _default: [0, '', '']
            };
        wt.optgroup = wt.option, wt.tbody = wt.tfoot = wt.colgroup = wt.caption = wt.thead, wt.th = wt.td;
        var Tt = /<|&#?\w+;/;
        (function() {
            var Cn = Ne.createDocumentFragment(),
                Sn = Cn.appendChild(Ne.createElement('div')),
                Nn = Ne.createElement('input');
            Nn.setAttribute('type', 'radio'), Nn.setAttribute('checked', 'checked'), Nn.setAttribute('name', 't'), Sn.appendChild(Nn), Ie.checkClone = Sn.cloneNode(!0).cloneNode(!0).lastChild.checked, Sn.innerHTML = '<textarea>x</textarea>', Ie.noCloneChecked = !!Sn.cloneNode(!0).lastChild.defaultValue
        })();
        var kt = Ne.documentElement,
            Ct = /^key/,
            St = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
            Nt = /^([^.]*)(?:\.(.+)|)/;
        Fe.event = {
            global: {},
            add: function(Cn, Sn, Nn, Dn, En) {
                var jn, Ln, An, qn, Pn, On, Hn, Mn, In, Bn, Wn, _n = rt.get(Cn);
                if (_n)
                    for (Nn.handler && (jn = Nn, Nn = jn.handler, En = jn.selector), En && Fe.find.matchesSelector(kt, En), Nn.guid || (Nn.guid = Fe.guid++), (qn = _n.events) || (qn = _n.events = {}), (Ln = _n.handle) || (Ln = _n.handle = function(Rn) {
                            return 'undefined' != typeof Fe && Fe.event.triggered !== Rn.type ? Fe.event.dispatch.apply(Cn, arguments) : void 0
                        }), Sn = (Sn || '').match(et) || [''], Pn = Sn.length; Pn--;)(An = Nt.exec(Sn[Pn]) || [], In = Wn = An[1], Bn = (An[2] || '').split('.').sort(), !!In) && (Hn = Fe.event.special[In] || {}, In = (En ? Hn.delegateType : Hn.bindType) || In, Hn = Fe.event.special[In] || {}, On = Fe.extend({
                        type: In,
                        origType: Wn,
                        data: Dn,
                        handler: Nn,
                        guid: Nn.guid,
                        selector: En,
                        needsContext: En && Fe.expr.match.needsContext.test(En),
                        namespace: Bn.join('.')
                    }, jn), (Mn = qn[In]) || (Mn = qn[In] = [], Mn.delegateCount = 0, (!Hn.setup || !1 === Hn.setup.call(Cn, Dn, Bn, Ln)) && Cn.addEventListener && Cn.addEventListener(In, Ln)), Hn.add && (Hn.add.call(Cn, On), !On.handler.guid && (On.handler.guid = Nn.guid)), En ? Mn.splice(Mn.delegateCount++, 0, On) : Mn.push(On), Fe.event.global[In] = !0)
            },
            remove: function(Cn, Sn, Nn, Dn, En) {
                var jn, Ln, An, qn, Pn, On, Hn, Mn, In, Bn, Wn, _n = rt.hasData(Cn) && rt.get(Cn);
                if (_n && (qn = _n.events)) {
                    for (Sn = (Sn || '').match(et) || [''], Pn = Sn.length; Pn--;) {
                        if (An = Nt.exec(Sn[Pn]) || [], In = Wn = An[1], Bn = (An[2] || '').split('.').sort(), !In) {
                            for (In in qn) Fe.event.remove(Cn, In + Sn[Pn], Nn, Dn, !0);
                            continue
                        }
                        for (Hn = Fe.event.special[In] || {}, In = (Dn ? Hn.delegateType : Hn.bindType) || In, Mn = qn[In] || [], An = An[2] && new RegExp('(^|\\.)' + Bn.join('\\.(?:.*\\.|)') + '(\\.|$)'), Ln = jn = Mn.length; jn--;) On = Mn[jn], (En || Wn === On.origType) && (!Nn || Nn.guid === On.guid) && (!An || An.test(On.namespace)) && (!Dn || Dn === On.selector || '**' === Dn && On.selector) && (Mn.splice(jn, 1), On.selector && Mn.delegateCount--, Hn.remove && Hn.remove.call(Cn, On));
                        Ln && !Mn.length && ((!Hn.teardown || !1 === Hn.teardown.call(Cn, Bn, _n.handle)) && Fe.removeEvent(Cn, In, _n.handle), delete qn[In])
                    }
                    Fe.isEmptyObject(qn) && rt.remove(Cn, 'handle events')
                }
            },
            dispatch: function(Cn) {
                var Nn, Dn, En, jn, Ln, An, Sn = Fe.event.fix(Cn),
                    qn = Array(arguments.length),
                    Pn = (rt.get(this, 'events') || {})[Sn.type] || [],
                    On = Fe.event.special[Sn.type] || {};
                for (qn[0] = Sn, Nn = 1; Nn < arguments.length; Nn++) qn[Nn] = arguments[Nn];
                if (Sn.delegateTarget = this, !(On.preDispatch && !1 === On.preDispatch.call(this, Sn))) {
                    for (An = Fe.event.handlers.call(this, Sn, Pn), Nn = 0;
                        (jn = An[Nn++]) && !Sn.isPropagationStopped();)
                        for (Sn.currentTarget = jn.elem, Dn = 0;
                            (Ln = jn.handlers[Dn++]) && !Sn.isImmediatePropagationStopped();)(!Sn.rnamespace || Sn.rnamespace.test(Ln.namespace)) && (Sn.handleObj = Ln, Sn.data = Ln.data, En = ((Fe.event.special[Ln.origType] || {}).handle || Ln.handler).apply(jn.elem, qn), void 0 != En && !1 === (Sn.result = En) && (Sn.preventDefault(), Sn.stopPropagation()));
                    return On.postDispatch && On.postDispatch.call(this, Sn), Sn.result
                }
            },
            handlers: function(Cn, Sn) {
                var Nn, Dn, En, jn, Ln, An = [],
                    qn = Sn.delegateCount,
                    Pn = Cn.target;
                if (qn && Pn.nodeType && !('click' === Cn.type && 1 <= Cn.button))
                    for (; Pn !== this; Pn = Pn.parentNode || this)
                        if (1 === Pn.nodeType && ('click' !== Cn.type || !0 !== Pn.disabled)) {
                            for (jn = [], Ln = {}, Nn = 0; Nn < qn; Nn++) Dn = Sn[Nn], En = Dn.selector + ' ', void 0 === Ln[En] && (Ln[En] = Dn.needsContext ? -1 < Fe(En, this).index(Pn) : Fe.find(En, this, null, [Pn]).length), Ln[En] && jn.push(Dn);
                            jn.length && An.push({
                                elem: Pn,
                                handlers: jn
                            })
                        }
                return Pn = this, qn < Sn.length && An.push({
                    elem: Pn,
                    handlers: Sn.slice(qn)
                }), An
            },
            addProp: function(Cn, Sn) {
                Object.defineProperty(Fe.Event.prototype, Cn, {
                    enumerable: !0,
                    configurable: !0,
                    get: Be(Sn) ? function() {
                        if (this.originalEvent) return Sn(this.originalEvent)
                    } : function() {
                        if (this.originalEvent) return this.originalEvent[Cn]
                    },
                    set: function(Nn) {
                        Object.defineProperty(this, Cn, {
                            enumerable: !0,
                            configurable: !0,
                            writable: !0,
                            value: Nn
                        })
                    }
                })
            },
            fix: function(Cn) {
                return Cn[Fe.expando] ? Cn : new Fe.Event(Cn)
            },
            special: {
                load: {
                    noBubble: !0
                },
                focus: {
                    trigger: function() {
                        if (this !== X() && this.focus) return this.focus(), !1
                    },
                    delegateType: 'focusin'
                },
                blur: {
                    trigger: function() {
                        if (this === X() && this.blur) return this.blur(), !1
                    },
                    delegateType: 'focusout'
                },
                click: {
                    trigger: function() {
                        if ('checkbox' === this.type && this.click && T(this, 'input')) return this.click(), !1
                    },
                    _default: function(Cn) {
                        return T(Cn.target, 'a')
                    }
                },
                beforeunload: {
                    postDispatch: function(Cn) {
                        void 0 !== Cn.result && Cn.originalEvent && (Cn.originalEvent.returnValue = Cn.result)
                    }
                }
            }
        }, Fe.removeEvent = function(Cn, Sn, Nn) {
            Cn.removeEventListener && Cn.removeEventListener(Sn, Nn)
        }, Fe.Event = function(Cn, Sn) {
            return this instanceof Fe.Event ? void(Cn && Cn.type ? (this.originalEvent = Cn, this.type = Cn.type, this.isDefaultPrevented = Cn.defaultPrevented || void 0 === Cn.defaultPrevented && !1 === Cn.returnValue ? z : U, this.target = Cn.target && 3 === Cn.target.nodeType ? Cn.target.parentNode : Cn.target, this.currentTarget = Cn.currentTarget, this.relatedTarget = Cn.relatedTarget) : this.type = Cn, Sn && Fe.extend(this, Sn), this.timeStamp = Cn && Cn.timeStamp || Date.now(), this[Fe.expando] = !0) : new Fe.Event(Cn, Sn)
        }, Fe.Event.prototype = {
            constructor: Fe.Event,
            isDefaultPrevented: U,
            isPropagationStopped: U,
            isImmediatePropagationStopped: U,
            isSimulated: !1,
            preventDefault: function() {
                var Cn = this.originalEvent;
                this.isDefaultPrevented = z, Cn && !this.isSimulated && Cn.preventDefault()
            },
            stopPropagation: function() {
                var Cn = this.originalEvent;
                this.isPropagationStopped = z, Cn && !this.isSimulated && Cn.stopPropagation()
            },
            stopImmediatePropagation: function() {
                var Cn = this.originalEvent;
                this.isImmediatePropagationStopped = z, Cn && !this.isSimulated && Cn.stopImmediatePropagation(), this.stopPropagation()
            }
        }, Fe.each({
            altKey: !0,
            bubbles: !0,
            cancelable: !0,
            changedTouches: !0,
            ctrlKey: !0,
            detail: !0,
            eventPhase: !0,
            metaKey: !0,
            pageX: !0,
            pageY: !0,
            shiftKey: !0,
            view: !0,
            char: !0,
            charCode: !0,
            key: !0,
            keyCode: !0,
            button: !0,
            buttons: !0,
            clientX: !0,
            clientY: !0,
            offsetX: !0,
            offsetY: !0,
            pointerId: !0,
            pointerType: !0,
            screenX: !0,
            screenY: !0,
            targetTouches: !0,
            toElement: !0,
            touches: !0,
            which: function(Cn) {
                var Sn = Cn.button;
                return null == Cn.which && Ct.test(Cn.type) ? null == Cn.charCode ? Cn.keyCode : Cn.charCode : !Cn.which && void 0 !== Sn && St.test(Cn.type) ? 1 & Sn ? 1 : 2 & Sn ? 3 : 4 & Sn ? 2 : 0 : Cn.which
            }
        }, Fe.event.addProp), Fe.each({
            mouseenter: 'mouseover',
            mouseleave: 'mouseout',
            pointerenter: 'pointerover',
            pointerleave: 'pointerout'
        }, function(Cn, Sn) {
            Fe.event.special[Cn] = {
                delegateType: Sn,
                bindType: Sn,
                handle: function(Nn) {
                    var Dn, En = this,
                        jn = Nn.relatedTarget,
                        Ln = Nn.handleObj;
                    return jn && (jn === En || Fe.contains(En, jn)) || (Nn.type = Ln.origType, Dn = Ln.handler.apply(this, arguments), Nn.type = Sn), Dn
                }
            }
        }), Fe.fn.extend({
            on: function(Cn, Sn, Nn, Dn) {
                return V(this, Cn, Sn, Nn, Dn)
            },
            one: function(Cn, Sn, Nn, Dn) {
                return V(this, Cn, Sn, Nn, Dn, 1)
            },
            off: function(Cn, Sn, Nn) {
                var Dn, En;
                if (Cn && Cn.preventDefault && Cn.handleObj) return Dn = Cn.handleObj, Fe(Cn.delegateTarget).off(Dn.namespace ? Dn.origType + '.' + Dn.namespace : Dn.origType, Dn.selector, Dn.handler), this;
                if ('object' == typeof Cn) {
                    for (En in Cn) this.off(En, Sn, Cn[En]);
                    return this
                }
                return (!1 === Sn || 'function' == typeof Sn) && (Nn = Sn, Sn = void 0), !1 === Nn && (Nn = U), this.each(function() {
                    Fe.event.remove(this, Cn, Nn, Sn)
                })
            }
        });
        var Dt = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi,
            Et = /<script|<style|<link/i,
            jt = /checked\s*(?:[^=]|=\s*.checked.)/i,
            Lt = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;
        Fe.extend({
            htmlPrefilter: function(Cn) {
                return Cn.replace(Dt, '<$1></$2>')
            },
            clone: function(Cn, Sn, Nn) {
                var Dn, En, jn, Ln, An = Cn.cloneNode(!0),
                    qn = Fe.contains(Cn.ownerDocument, Cn);
                if (!Ie.noCloneChecked && (1 === Cn.nodeType || 11 === Cn.nodeType) && !Fe.isXMLDoc(Cn))
                    for (Ln = W(An), jn = W(Cn), (Dn = 0, En = jn.length); Dn < En; Dn++) J(jn[Dn], Ln[Dn]);
                if (Sn)
                    if (Nn)
                        for (jn = jn || W(Cn), Ln = Ln || W(An), (Dn = 0, En = jn.length); Dn < En; Dn++) K(jn[Dn], Ln[Dn]);
                    else K(Cn, An);
                return Ln = W(An, 'script'), 0 < Ln.length && R(Ln, !qn && W(Cn, 'script')), An
            },
            cleanData: function(Cn) {
                for (var Sn, Nn, Dn, En = Fe.event.special, jn = 0; void 0 !== (Nn = Cn[jn]); jn++)
                    if (it(Nn)) {
                        if (Sn = Nn[rt.expando]) {
                            if (Sn.events)
                                for (Dn in Sn.events) En[Dn] ? Fe.event.remove(Nn, Dn) : Fe.removeEvent(Nn, Dn, Sn.handle);
                            Nn[rt.expando] = void 0
                        }
                        Nn[dt.expando] && (Nn[dt.expando] = void 0)
                    }
            }
        }), Fe.fn.extend({
            detach: function(Cn) {
                return ee(this, Cn, !0)
            },
            remove: function(Cn) {
                return ee(this, Cn)
            },
            text: function(Cn) {
                return at(this, function(Sn) {
                    return void 0 === Sn ? Fe.text(this) : this.empty().each(function() {
                        (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) && (this.textContent = Sn)
                    })
                }, null, Cn, arguments.length)
            },
            append: function() {
                return Z(this, arguments, function(Cn) {
                    if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                        var Sn = Y(this, Cn);
                        Sn.appendChild(Cn)
                    }
                })
            },
            prepend: function() {
                return Z(this, arguments, function(Cn) {
                    if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                        var Sn = Y(this, Cn);
                        Sn.insertBefore(Cn, Sn.firstChild)
                    }
                })
            },
            before: function() {
                return Z(this, arguments, function(Cn) {
                    this.parentNode && this.parentNode.insertBefore(Cn, this)
                })
            },
            after: function() {
                return Z(this, arguments, function(Cn) {
                    this.parentNode && this.parentNode.insertBefore(Cn, this.nextSibling)
                })
            },
            empty: function() {
                for (var Cn, Sn = 0; null != (Cn = this[Sn]); Sn++) 1 === Cn.nodeType && (Fe.cleanData(W(Cn, !1)), Cn.textContent = '');
                return this
            },
            clone: function(Cn, Sn) {
                return Cn = null != Cn && Cn, Sn = null == Sn ? Cn : Sn, this.map(function() {
                    return Fe.clone(this, Cn, Sn)
                })
            },
            html: function(Cn) {
                return at(this, function(Sn) {
                    var Nn = this[0] || {},
                        Dn = 0,
                        En = this.length;
                    if (void 0 === Sn && 1 === Nn.nodeType) return Nn.innerHTML;
                    if ('string' == typeof Sn && !Et.test(Sn) && !wt[(bt.exec(Sn) || ['', ''])[1].toLowerCase()]) {
                        Sn = Fe.htmlPrefilter(Sn);
                        try {
                            for (; Dn < En; Dn++) Nn = this[Dn] || {}, 1 === Nn.nodeType && (Fe.cleanData(W(Nn, !1)), Nn.innerHTML = Sn);
                            Nn = 0
                        } catch (jn) {}
                    }
                    Nn && this.empty().append(Sn)
                }, null, Cn, arguments.length)
            },
            replaceWith: function() {
                var Cn = [];
                return Z(this, arguments, function(Sn) {
                    var Nn = this.parentNode;
                    0 > Fe.inArray(this, Cn) && (Fe.cleanData(W(this)), Nn && Nn.replaceChild(Sn, this))
                }, Cn)
            }
        }), Fe.each({
            appendTo: 'append',
            prependTo: 'prepend',
            insertBefore: 'before',
            insertAfter: 'after',
            replaceAll: 'replaceWith'
        }, function(Cn, Sn) {
            Fe.fn[Cn] = function(Nn) {
                for (var Dn, En = [], jn = Fe(Nn), Ln = jn.length - 1, An = 0; An <= Ln; An++) Dn = An === Ln ? this : this.clone(!0), Fe(jn[An])[Sn](Dn), Le.apply(En, Dn.get());
                return this.pushStack(En)
            }
        });
        var At = new RegExp('^(' + ut + ')(?!px)[a-z%]+$', 'i'),
            qt = function(Cn) {
                var Sn = Cn.ownerDocument.defaultView;
                return Sn && Sn.opener || (Sn = f), Sn.getComputedStyle(Cn)
            },
            Pt = new RegExp(mt.join('|'), 'i');
        (function() {
            function Cn() {
                if (qn) {
                    An.style.cssText = 'position:absolute;left:-11111px;width:60px;margin-top:1px;padding:0;border:0', qn.style.cssText = 'position:relative;display:block;box-sizing:border-box;overflow:scroll;margin:auto;border:1px;padding:1px;width:60%;top:1%', kt.appendChild(An).appendChild(qn);
                    var Pn = f.getComputedStyle(qn);
                    Nn = '1%' !== Pn.top, Ln = 12 === Sn(Pn.marginLeft), qn.style.right = '60%', jn = 36 === Sn(Pn.right), Dn = 36 === Sn(Pn.width), qn.style.position = 'absolute', En = 36 === qn.offsetWidth || 'absolute', kt.removeChild(An), qn = null
                }
            }

            function Sn(Pn) {
                return Math.round(parseFloat(Pn))
            }
            var Nn, Dn, En, jn, Ln, An = Ne.createElement('div'),
                qn = Ne.createElement('div');
            qn.style && (qn.style.backgroundClip = 'content-box', qn.cloneNode(!0).style.backgroundClip = '', Ie.clearCloneStyle = 'content-box' === qn.style.backgroundClip, Fe.extend(Ie, {
                boxSizingReliable: function() {
                    return Cn(), Dn
                },
                pixelBoxStyles: function() {
                    return Cn(), jn
                },
                pixelPosition: function() {
                    return Cn(), Nn
                },
                reliableMarginLeft: function() {
                    return Cn(), Ln
                },
                scrollboxSize: function() {
                    return Cn(), En
                }
            }))
        })();
        var Ot = /^(none|table(?!-c[ea]).+)/,
            Ht = /^--/,
            Mt = {
                position: 'absolute',
                visibility: 'hidden',
                display: 'block'
            },
            It = {
                letterSpacing: '0',
                fontWeight: '400'
            },
            Bt = ['Webkit', 'Moz', 'ms'],
            Wt = Ne.createElement('div').style;
        Fe.extend({
            cssHooks: {
                opacity: {
                    get: function(Cn, Sn) {
                        if (Sn) {
                            var Nn = te(Cn, 'opacity');
                            return '' === Nn ? '1' : Nn
                        }
                    }
                }
            },
            cssNumber: {
                animationIterationCount: !0,
                columnCount: !0,
                fillOpacity: !0,
                flexGrow: !0,
                flexShrink: !0,
                fontWeight: !0,
                lineHeight: !0,
                opacity: !0,
                order: !0,
                orphans: !0,
                widows: !0,
                zIndex: !0,
                zoom: !0
            },
            cssProps: {},
            style: function(Cn, Sn, Nn, Dn) {
                if (Cn && 3 !== Cn.nodeType && 8 !== Cn.nodeType && Cn.style) {
                    var En, jn, Ln, An = q(Sn),
                        qn = Ht.test(Sn),
                        Pn = Cn.style;
                    if (qn || (Sn = oe(An)), Ln = Fe.cssHooks[Sn] || Fe.cssHooks[An], void 0 !== Nn) {
                        if (jn = typeof Nn, 'string' === jn && (En = ft.exec(Nn)) && En[1] && (Nn = M(Cn, Sn, En), jn = 'number'), null == Nn || Nn !== Nn) return;
                        'number' === jn && (Nn += En && En[3] || (Fe.cssNumber[An] ? '' : 'px')), Ie.clearCloneStyle || '' !== Nn || 0 !== Sn.indexOf('background') || (Pn[Sn] = 'inherit'), Ln && 'set' in Ln && void 0 === (Nn = Ln.set(Cn, Nn, Dn)) || (qn ? Pn.setProperty(Sn, Nn) : Pn[Sn] = Nn)
                    } else return Ln && 'get' in Ln && void 0 !== (En = Ln.get(Cn, !1, Dn)) ? En : Pn[Sn]
                }
            },
            css: function(Cn, Sn, Nn, Dn) {
                var En, jn, Ln, An = q(Sn),
                    qn = Ht.test(Sn);
                return qn || (Sn = oe(An)), Ln = Fe.cssHooks[Sn] || Fe.cssHooks[An], Ln && 'get' in Ln && (En = Ln.get(Cn, !0, Nn)), void 0 == En && (En = te(Cn, Sn, Dn)), 'normal' === En && Sn in It && (En = It[Sn]), '' === Nn || Nn ? (jn = parseFloat(En), !0 === Nn || isFinite(jn) ? jn || 0 : En) : En
            }
        }), Fe.each(['height', 'width'], function(Cn, Sn) {
            Fe.cssHooks[Sn] = {
                get: function(Nn, Dn, En) {
                    if (Dn) return !Ot.test(Fe.css(Nn, 'display')) || Nn.getClientRects().length && Nn.getBoundingClientRect().width ? re(Nn, Sn, En) : gt(Nn, Mt, function() {
                        return re(Nn, Sn, En)
                    })
                },
                set: function(Nn, Dn, En) {
                    var jn, Ln = qt(Nn),
                        An = 'border-box' === Fe.css(Nn, 'boxSizing', !1, Ln),
                        qn = En && ie(Nn, Sn, En, An, Ln);
                    return An && Ie.scrollboxSize() === Ln.position && (qn -= Math.ceil(Nn['offset' + Sn[0].toUpperCase() + Sn.slice(1)] - parseFloat(Ln[Sn]) - ie(Nn, Sn, 'border', !1, Ln) - 0.5)), qn && (jn = ft.exec(Dn)) && 'px' !== (jn[3] || 'px') && (Nn.style[Sn] = Dn, Dn = Fe.css(Nn, Sn)), se(Nn, Dn, qn)
                }
            }
        }), Fe.cssHooks.marginLeft = ne(Ie.reliableMarginLeft, function(Cn, Sn) {
            if (Sn) return (parseFloat(te(Cn, 'marginLeft')) || Cn.getBoundingClientRect().left - gt(Cn, {
                marginLeft: 0
            }, function() {
                return Cn.getBoundingClientRect().left
            })) + 'px'
        }), Fe.each({
            margin: '',
            padding: '',
            border: 'Width'
        }, function(Cn, Sn) {
            Fe.cssHooks[Cn + Sn] = {
                expand: function(Nn) {
                    for (var Dn = 0, En = {}, jn = 'string' == typeof Nn ? Nn.split(' ') : [Nn]; 4 > Dn; Dn++) En[Cn + mt[Dn] + Sn] = jn[Dn] || jn[Dn - 2] || jn[0];
                    return En
                }
            }, 'margin' !== Cn && (Fe.cssHooks[Cn + Sn].set = se)
        }), Fe.fn.extend({
            css: function(Cn, Sn) {
                return at(this, function(Nn, Dn, En) {
                    var jn, Ln, An = {},
                        qn = 0;
                    if (Array.isArray(Dn)) {
                        for (jn = qt(Nn), Ln = Dn.length; qn < Ln; qn++) An[Dn[qn]] = Fe.css(Nn, Dn[qn], !1, jn);
                        return An
                    }
                    return void 0 === En ? Fe.css(Nn, Dn) : Fe.style(Nn, Dn, En)
                }, Cn, Sn, 1 < arguments.length)
            }
        }), Fe.Tween = de, de.prototype = {
            constructor: de,
            init: function(Cn, Sn, Nn, Dn, En, jn) {
                this.elem = Cn, this.prop = Nn, this.easing = En || Fe.easing._default, this.options = Sn, this.start = this.now = this.cur(), this.end = Dn, this.unit = jn || (Fe.cssNumber[Nn] ? '' : 'px')
            },
            cur: function() {
                var Cn = de.propHooks[this.prop];
                return Cn && Cn.get ? Cn.get(this) : de.propHooks._default.get(this)
            },
            run: function(Cn) {
                var Sn, Nn = de.propHooks[this.prop];
                return this.pos = this.options.duration ? Sn = Fe.easing[this.easing](Cn, this.options.duration * Cn, 0, 1, this.options.duration) : Sn = Cn, this.now = (this.end - this.start) * Sn + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), Nn && Nn.set ? Nn.set(this) : de.propHooks._default.set(this), this
            }
        }, de.prototype.init.prototype = de.prototype, de.propHooks = {
            _default: {
                get: function(Cn) {
                    var Sn;
                    return 1 !== Cn.elem.nodeType || null != Cn.elem[Cn.prop] && null == Cn.elem.style[Cn.prop] ? Cn.elem[Cn.prop] : (Sn = Fe.css(Cn.elem, Cn.prop, ''), Sn && 'auto' !== Sn ? Sn : 0)
                },
                set: function(Cn) {
                    Fe.fx.step[Cn.prop] ? Fe.fx.step[Cn.prop](Cn) : 1 === Cn.elem.nodeType && (null != Cn.elem.style[Fe.cssProps[Cn.prop]] || Fe.cssHooks[Cn.prop]) ? Fe.style(Cn.elem, Cn.prop, Cn.now + Cn.unit) : Cn.elem[Cn.prop] = Cn.now
                }
            }
        }, de.propHooks.scrollTop = de.propHooks.scrollLeft = {
            set: function(Cn) {
                Cn.elem.nodeType && Cn.elem.parentNode && (Cn.elem[Cn.prop] = Cn.now)
            }
        }, Fe.easing = {
            linear: function(Cn) {
                return Cn
            },
            swing: function(Cn) {
                return 0.5 - Math.cos(Cn * Math.PI) / 2
            },
            _default: 'swing'
        }, Fe.fx = de.prototype.init, Fe.fx.step = {};
        var _t, Rt, Ft = /^(?:toggle|show|hide)$/,
            zt = /queueHooks$/;
        Fe.Animation = Fe.extend(he, {
                tweeners: {
                    '*': [function(Cn, Sn) {
                        var Nn = this.createTween(Cn, Sn);
                        return M(Nn.elem, Cn, ft.exec(Sn), Nn), Nn
                    }]
                },
                tweener: function(Cn, Sn) {
                    Be(Cn) ? (Sn = Cn, Cn = ['*']) : Cn = Cn.match(et);
                    for (var Nn, Dn = 0, En = Cn.length; Dn < En; Dn++) Nn = Cn[Dn], he.tweeners[Nn] = he.tweeners[Nn] || [], he.tweeners[Nn].unshift(Sn)
                },
                prefilters: [function(Cn, Sn, Nn) {
                    var Dn, En, jn, Ln, An, qn, Pn, On, Mn = this,
                        In = {},
                        Bn = Cn.style,
                        Wn = Cn.nodeType && ht(Cn),
                        _n = rt.get(Cn, 'fxshow');
                    for (Dn in Nn.queue || (Ln = Fe._queueHooks(Cn, 'fx'), null == Ln.unqueued && (Ln.unqueued = 0, An = Ln.empty.fire, Ln.empty.fire = function() {
                            Ln.unqueued || An()
                        }), Ln.unqueued++, Mn.always(function() {
                            Mn.always(function() {
                                Ln.unqueued--, Fe.queue(Cn, 'fx').length || Ln.empty.fire()
                            })
                        })), Sn)
                        if (En = Sn[Dn], Ft.test(En)) {
                            if (delete Sn[Dn], jn = jn || 'toggle' === En, En === (Wn ? 'hide' : 'show'))
                                if ('show' === En && _n && void 0 !== _n[Dn]) Wn = !0;
                                else continue;
                            In[Dn] = _n && _n[Dn] || Fe.style(Cn, Dn)
                        }
                    if (qn = !Fe.isEmptyObject(Sn), qn || !Fe.isEmptyObject(In))
                        for (Dn in ('width' in Sn || 'height' in Sn) && 1 === Cn.nodeType && (Nn.overflow = [Bn.overflow, Bn.overflowX, Bn.overflowY], Pn = _n && _n.display, null == Pn && (Pn = rt.get(Cn, 'display')), On = Fe.css(Cn, 'display'), 'none' === On && (Pn ? On = Pn : (B([Cn], !0), Pn = Cn.style.display || Pn, On = Fe.css(Cn, 'display'), B([Cn]))), ('inline' === On || 'inline-block' === On && null != Pn) && 'none' === Fe.css(Cn, 'float') && (!qn && (Mn.done(function() {
                                Bn.display = Pn
                            }), null == Pn && (On = Bn.display, Pn = 'none' === On ? '' : On)), Bn.display = 'inline-block')), Nn.overflow && (Bn.overflow = 'hidden', Mn.always(function() {
                                Bn.overflow = Nn.overflow[0], Bn.overflowX = Nn.overflow[1], Bn.overflowY = Nn.overflow[2]
                            })), qn = !1, In) qn || (_n ? 'hidden' in _n && (Wn = _n.hidden) : _n = rt.access(Cn, 'fxshow', {
                            display: Pn
                        }), jn && (_n.hidden = !Wn), Wn && B([Cn], !0), Mn.done(function() {
                            for (Dn in Wn || B([Cn]), rt.remove(Cn, 'fxshow'), In) Fe.style(Cn, Dn, In[Dn])
                        })), qn = ce(Wn ? _n[Dn] : 0, Dn, Mn), Dn in _n || (_n[Dn] = qn.start, Wn && (qn.end = qn.start, qn.start = 0))
                }],
                prefilter: function(Cn, Sn) {
                    Sn ? he.prefilters.unshift(Cn) : he.prefilters.push(Cn)
                }
            }), Fe.speed = function(Cn, Sn, Nn) {
                var Dn = Cn && 'object' == typeof Cn ? Fe.extend({}, Cn) : {
                    complete: Nn || !Nn && Sn || Be(Cn) && Cn,
                    duration: Cn,
                    easing: Nn && Sn || Sn && !Be(Sn) && Sn
                };
                return Fe.fx.off ? Dn.duration = 0 : 'number' != typeof Dn.duration && (Dn.duration in Fe.fx.speeds ? Dn.duration = Fe.fx.speeds[Dn.duration] : Dn.duration = Fe.fx.speeds._default), (null == Dn.queue || !0 === Dn.queue) && (Dn.queue = 'fx'), Dn.old = Dn.complete, Dn.complete = function() {
                    Be(Dn.old) && Dn.old.call(this), Dn.queue && Fe.dequeue(this, Dn.queue)
                }, Dn
            }, Fe.fn.extend({
                fadeTo: function(Cn, Sn, Nn, Dn) {
                    return this.filter(ht).css('opacity', 0).show().end().animate({
                        opacity: Sn
                    }, Cn, Nn, Dn)
                },
                animate: function(Cn, Sn, Nn, Dn) {
                    var En = Fe.isEmptyObject(Cn),
                        jn = Fe.speed(Sn, Nn, Dn),
                        Ln = function() {
                            var An = he(this, Fe.extend({}, Cn), jn);
                            (En || rt.get(this, 'finish')) && An.stop(!0)
                        };
                    return Ln.finish = Ln, En || !1 === jn.queue ? this.each(Ln) : this.queue(jn.queue, Ln)
                },
                stop: function(Cn, Sn, Nn) {
                    var Dn = function(En) {
                        var jn = En.stop;
                        delete En.stop, jn(Nn)
                    };
                    return 'string' != typeof Cn && (Nn = Sn, Sn = Cn, Cn = void 0), Sn && !1 !== Cn && this.queue(Cn || 'fx', []), this.each(function() {
                        var En = !0,
                            jn = null != Cn && Cn + 'queueHooks',
                            Ln = Fe.timers,
                            An = rt.get(this);
                        if (jn) An[jn] && An[jn].stop && Dn(An[jn]);
                        else
                            for (jn in An) An[jn] && An[jn].stop && zt.test(jn) && Dn(An[jn]);
                        for (jn = Ln.length; jn--;) Ln[jn].elem === this && (null == Cn || Ln[jn].queue === Cn) && (Ln[jn].anim.stop(Nn), En = !1, Ln.splice(jn, 1));
                        (En || !Nn) && Fe.dequeue(this, Cn)
                    })
                },
                finish: function(Cn) {
                    return !1 !== Cn && (Cn = Cn || 'fx'), this.each(function() {
                        var Sn, Nn = rt.get(this),
                            Dn = Nn[Cn + 'queue'],
                            En = Nn[Cn + 'queueHooks'],
                            jn = Fe.timers,
                            Ln = Dn ? Dn.length : 0;
                        for (Nn.finish = !0, Fe.queue(this, Cn, []), En && En.stop && En.stop.call(this, !0), Sn = jn.length; Sn--;) jn[Sn].elem === this && jn[Sn].queue === Cn && (jn[Sn].anim.stop(!0), jn.splice(Sn, 1));
                        for (Sn = 0; Sn < Ln; Sn++) Dn[Sn] && Dn[Sn].finish && Dn[Sn].finish.call(this);
                        delete Nn.finish
                    })
                }
            }), Fe.each(['toggle', 'show', 'hide'], function(Cn, Sn) {
                var Nn = Fe.fn[Sn];
                Fe.fn[Sn] = function(Dn, En, jn) {
                    return null == Dn || 'boolean' == typeof Dn ? Nn.apply(this, arguments) : this.animate(ue(Sn, !0), Dn, En, jn)
                }
            }), Fe.each({
                slideDown: ue('show'),
                slideUp: ue('hide'),
                slideToggle: ue('toggle'),
                fadeIn: {
                    opacity: 'show'
                },
                fadeOut: {
                    opacity: 'hide'
                },
                fadeToggle: {
                    opacity: 'toggle'
                }
            }, function(Cn, Sn) {
                Fe.fn[Cn] = function(Nn, Dn, En) {
                    return this.animate(Sn, Nn, Dn, En)
                }
            }), Fe.timers = [], Fe.fx.tick = function() {
                var Cn, Sn = 0,
                    Nn = Fe.timers;
                for (_t = Date.now(); Sn < Nn.length; Sn++) Cn = Nn[Sn], Cn() || Nn[Sn] !== Cn || Nn.splice(Sn--, 1);
                Nn.length || Fe.fx.stop(), _t = void 0
            }, Fe.fx.timer = function(Cn) {
                Fe.timers.push(Cn), Fe.fx.start()
            }, Fe.fx.interval = 13, Fe.fx.start = function() {
                Rt || (Rt = !0, le())
            }, Fe.fx.stop = function() {
                Rt = null
            }, Fe.fx.speeds = {
                slow: 600,
                fast: 200,
                _default: 400
            }, Fe.fn.delay = function(Cn, Sn) {
                return Cn = Fe.fx ? Fe.fx.speeds[Cn] || Cn : Cn, Sn = Sn || 'fx', this.queue(Sn, function(Nn, Dn) {
                    var En = f.setTimeout(Nn, Cn);
                    Dn.stop = function() {
                        f.clearTimeout(En)
                    }
                })
            },
            function() {
                var Cn = Ne.createElement('input'),
                    Sn = Ne.createElement('select'),
                    Nn = Sn.appendChild(Ne.createElement('option'));
                Cn.type = 'checkbox', Ie.checkOn = '' !== Cn.value, Ie.optSelected = Nn.selected, Cn = Ne.createElement('input'), Cn.value = 't', Cn.type = 'radio', Ie.radioValue = 't' === Cn.value
            }();
        var $t, Ut = Fe.expr.attrHandle;
        Fe.fn.extend({
            attr: function(Cn, Sn) {
                return at(this, Fe.attr, Cn, Sn, 1 < arguments.length)
            },
            removeAttr: function(Cn) {
                return this.each(function() {
                    Fe.removeAttr(this, Cn)
                })
            }
        }), Fe.extend({
            attr: function(Cn, Sn, Nn) {
                var Dn, En, jn = Cn.nodeType;
                if (3 !== jn && 8 !== jn && 2 !== jn) return 'undefined' == typeof Cn.getAttribute ? Fe.prop(Cn, Sn, Nn) : (1 === jn && Fe.isXMLDoc(Cn) || (En = Fe.attrHooks[Sn.toLowerCase()] || (Fe.expr.match.bool.test(Sn) ? $t : void 0)), void 0 !== Nn) ? null === Nn ? void Fe.removeAttr(Cn, Sn) : En && 'set' in En && void 0 !== (Dn = En.set(Cn, Nn, Sn)) ? Dn : (Cn.setAttribute(Sn, Nn + ''), Nn) : En && 'get' in En && null !== (Dn = En.get(Cn, Sn)) ? Dn : (Dn = Fe.find.attr(Cn, Sn), null == Dn ? void 0 : Dn)
            },
            attrHooks: {
                type: {
                    set: function(Cn, Sn) {
                        if (!Ie.radioValue && 'radio' === Sn && T(Cn, 'input')) {
                            var Nn = Cn.value;
                            return Cn.setAttribute('type', Sn), Nn && (Cn.value = Nn), Sn
                        }
                    }
                }
            },
            removeAttr: function(Cn, Sn) {
                var Nn, Dn = 0,
                    En = Sn && Sn.match(et);
                if (En && 1 === Cn.nodeType)
                    for (; Nn = En[Dn++];) Cn.removeAttribute(Nn)
            }
        }), $t = {
            set: function(Cn, Sn, Nn) {
                return !1 === Sn ? Fe.removeAttr(Cn, Nn) : Cn.setAttribute(Nn, Nn), Nn
            }
        }, Fe.each(Fe.expr.match.bool.source.match(/\w+/g), function(Cn, Sn) {
            var Nn = Ut[Sn] || Fe.find.attr;
            Ut[Sn] = function(Dn, En, jn) {
                var Ln, An, qn = En.toLowerCase();
                return jn || (An = Ut[qn], Ut[qn] = Ln, Ln = null == Nn(Dn, En, jn) ? null : qn, Ut[qn] = An), Ln
            }
        });
        var Xt = /^(?:input|select|textarea|button)$/i,
            Vt = /^(?:a|area)$/i;
        Fe.fn.extend({
            prop: function(Cn, Sn) {
                return at(this, Fe.prop, Cn, Sn, 1 < arguments.length)
            },
            removeProp: function(Cn) {
                return this.each(function() {
                    delete this[Fe.propFix[Cn] || Cn]
                })
            }
        }), Fe.extend({
            prop: function(Cn, Sn, Nn) {
                var Dn, En, jn = Cn.nodeType;
                if (3 !== jn && 8 !== jn && 2 !== jn) return 1 === jn && Fe.isXMLDoc(Cn) || (Sn = Fe.propFix[Sn] || Sn, En = Fe.propHooks[Sn]), void 0 === Nn ? En && 'get' in En && null !== (Dn = En.get(Cn, Sn)) ? Dn : Cn[Sn] : En && 'set' in En && void 0 !== (Dn = En.set(Cn, Nn, Sn)) ? Dn : Cn[Sn] = Nn
            },
            propHooks: {
                tabIndex: {
                    get: function(Cn) {
                        var Sn = Fe.find.attr(Cn, 'tabindex');
                        return Sn ? parseInt(Sn, 10) : Xt.test(Cn.nodeName) || Vt.test(Cn.nodeName) && Cn.href ? 0 : -1
                    }
                }
            },
            propFix: {
                'for': 'htmlFor',
                'class': 'className'
            }
        }), Ie.optSelected || (Fe.propHooks.selected = {
            get: function(Cn) {
                var Sn = Cn.parentNode;
                return Sn && Sn.parentNode && Sn.parentNode.selectedIndex, null
            },
            set: function(Cn) {
                var Sn = Cn.parentNode;
                Sn && (Sn.selectedIndex, Sn.parentNode && Sn.parentNode.selectedIndex)
            }
        }), Fe.each(['tabIndex', 'readOnly', 'maxLength', 'cellSpacing', 'cellPadding', 'rowSpan', 'colSpan', 'useMap', 'frameBorder', 'contentEditable'], function() {
            Fe.propFix[this.toLowerCase()] = this
        }), Fe.fn.extend({
            addClass: function(Cn) {
                var Sn, Nn, Dn, En, jn, Ln, An, qn = 0;
                if (Be(Cn)) return this.each(function(Pn) {
                    Fe(this).addClass(Cn.call(this, Pn, ye(this)))
                });
                if (Sn = xe(Cn), Sn.length)
                    for (; Nn = this[qn++];)
                        if (En = ye(Nn), Dn = 1 === Nn.nodeType && ' ' + ge(En) + ' ', Dn) {
                            for (Ln = 0; jn = Sn[Ln++];) 0 > Dn.indexOf(' ' + jn + ' ') && (Dn += jn + ' ');
                            An = ge(Dn), En != An && Nn.setAttribute('class', An)
                        }
                return this
            },
            removeClass: function(Cn) {
                var Sn, Nn, Dn, En, jn, Ln, An, qn = 0;
                if (Be(Cn)) return this.each(function(Pn) {
                    Fe(this).removeClass(Cn.call(this, Pn, ye(this)))
                });
                if (!arguments.length) return this.attr('class', '');
                if (Sn = xe(Cn), Sn.length)
                    for (; Nn = this[qn++];)
                        if (En = ye(Nn), Dn = 1 === Nn.nodeType && ' ' + ge(En) + ' ', Dn) {
                            for (Ln = 0; jn = Sn[Ln++];)
                                for (; - 1 < Dn.indexOf(' ' + jn + ' ');) Dn = Dn.replace(' ' + jn + ' ', ' ');
                            An = ge(Dn), En != An && Nn.setAttribute('class', An)
                        }
                return this
            },
            toggleClass: function(Cn, Sn) {
                var Nn = typeof Cn,
                    Dn = 'string' == Nn || Array.isArray(Cn);
                return 'boolean' == typeof Sn && Dn ? Sn ? this.addClass(Cn) : this.removeClass(Cn) : Be(Cn) ? this.each(function(En) {
                    Fe(this).toggleClass(Cn.call(this, En, ye(this), Sn), Sn)
                }) : this.each(function() {
                    var En, jn, Ln, An;
                    if (Dn)
                        for (jn = 0, Ln = Fe(this), An = xe(Cn); En = An[jn++];) Ln.hasClass(En) ? Ln.removeClass(En) : Ln.addClass(En);
                    else(void 0 === Cn || 'boolean' == Nn) && (En = ye(this), En && rt.set(this, '__className__', En), this.setAttribute && this.setAttribute('class', En || !1 === Cn ? '' : rt.get(this, '__className__') || ''))
                })
            },
            hasClass: function(Cn) {
                var Sn, Nn, Dn = 0;
                for (Sn = ' ' + Cn + ' '; Nn = this[Dn++];)
                    if (1 === Nn.nodeType && -1 < (' ' + ge(ye(Nn)) + ' ').indexOf(Sn)) return !0;
                return !1
            }
        });
        var Yt = /\r/g;
        Fe.fn.extend({
            val: function(Cn) {
                var Sn, Nn, Dn, En = this[0];
                return arguments.length ? (Dn = Be(Cn), this.each(function(jn) {
                    var Ln;
                    1 !== this.nodeType || (Ln = Dn ? Cn.call(this, jn, Fe(this).val()) : Cn, null == Ln ? Ln = '' : 'number' == typeof Ln ? Ln += '' : Array.isArray(Ln) && (Ln = Fe.map(Ln, function(An) {
                        return null == An ? '' : An + ''
                    })), Sn = Fe.valHooks[this.type] || Fe.valHooks[this.nodeName.toLowerCase()], (!Sn || !('set' in Sn) || void 0 === Sn.set(this, Ln, 'value')) && (this.value = Ln))
                })) : En ? (Sn = Fe.valHooks[En.type] || Fe.valHooks[En.nodeName.toLowerCase()], Sn && 'get' in Sn && void 0 !== (Nn = Sn.get(En, 'value'))) ? Nn : (Nn = En.value, 'string' == typeof Nn ? Nn.replace(Yt, '') : null == Nn ? '' : Nn) : void 0
            }
        }), Fe.extend({
            valHooks: {
                option: {
                    get: function(Cn) {
                        var Sn = Fe.find.attr(Cn, 'value');
                        return null == Sn ? ge(Fe.text(Cn)) : Sn
                    }
                },
                select: {
                    get: function(Cn) {
                        var Sn, Nn, Dn, En = Cn.options,
                            jn = Cn.selectedIndex,
                            Ln = 'select-one' === Cn.type,
                            An = Ln ? null : [],
                            qn = Ln ? jn + 1 : En.length;
                        for (Dn = 0 > jn ? qn : Ln ? jn : 0; Dn < qn; Dn++)
                            if (Nn = En[Dn], (Nn.selected || Dn === jn) && !Nn.disabled && (!Nn.parentNode.disabled || !T(Nn.parentNode, 'optgroup'))) {
                                if (Sn = Fe(Nn).val(), Ln) return Sn;
                                An.push(Sn)
                            }
                        return An
                    },
                    set: function(Cn, Sn) {
                        for (var Nn, Dn, En = Cn.options, jn = Fe.makeArray(Sn), Ln = En.length; Ln--;) Dn = En[Ln], (Dn.selected = -1 < Fe.inArray(Fe.valHooks.option.get(Dn), jn)) && (Nn = !0);
                        return Nn || (Cn.selectedIndex = -1), jn
                    }
                }
            }
        }), Fe.each(['radio', 'checkbox'], function() {
            Fe.valHooks[this] = {
                set: function(Cn, Sn) {
                    if (Array.isArray(Sn)) return Cn.checked = -1 < Fe.inArray(Fe(Cn).val(), Sn)
                }
            }, Ie.checkOn || (Fe.valHooks[this].get = function(Cn) {
                return null === Cn.getAttribute('value') ? 'on' : Cn.value
            })
        }), Ie.focusin = 'onfocusin' in f;
        var Gt = /^(?:focusinfocus|focusoutblur)$/,
            Qt = function(Cn) {
                Cn.stopPropagation()
            };
        Fe.extend(Fe.event, {
            trigger: function(Cn, Sn, Nn, Dn) {
                var En, jn, Ln, An, qn, Pn, On, Hn, Mn = [Nn || Ne],
                    In = Oe.call(Cn, 'type') ? Cn.type : Cn,
                    Bn = Oe.call(Cn, 'namespace') ? Cn.namespace.split('.') : [];
                if ((jn = Hn = Ln = Nn = Nn || Ne, 3 !== Nn.nodeType && 8 !== Nn.nodeType) && !Gt.test(In + Fe.event.triggered) && (-1 < In.indexOf('.') && (Bn = In.split('.'), In = Bn.shift(), Bn.sort()), qn = 0 > In.indexOf(':') && 'on' + In, Cn = Cn[Fe.expando] ? Cn : new Fe.Event(In, 'object' == typeof Cn && Cn), Cn.isTrigger = Dn ? 2 : 3, Cn.namespace = Bn.join('.'), Cn.rnamespace = Cn.namespace ? new RegExp('(^|\\.)' + Bn.join('\\.(?:.*\\.|)') + '(\\.|$)') : null, Cn.result = void 0, Cn.target || (Cn.target = Nn), Sn = null == Sn ? [Cn] : Fe.makeArray(Sn, [Cn]), On = Fe.event.special[In] || {}, Dn || !On.trigger || !1 !== On.trigger.apply(Nn, Sn))) {
                    if (!Dn && !On.noBubble && !We(Nn)) {
                        for (An = On.delegateType || In, Gt.test(An + In) || (jn = jn.parentNode); jn; jn = jn.parentNode) Mn.push(jn), Ln = jn;
                        Ln === (Nn.ownerDocument || Ne) && Mn.push(Ln.defaultView || Ln.parentWindow || f)
                    }
                    for (En = 0;
                        (jn = Mn[En++]) && !Cn.isPropagationStopped();) Hn = jn, Cn.type = 1 < En ? An : On.bindType || In, Pn = (rt.get(jn, 'events') || {})[Cn.type] && rt.get(jn, 'handle'), Pn && Pn.apply(jn, Sn), Pn = qn && jn[qn], Pn && Pn.apply && it(jn) && (Cn.result = Pn.apply(jn, Sn), !1 === Cn.result && Cn.preventDefault());
                    return Cn.type = In, Dn || Cn.isDefaultPrevented() || On._default && !1 !== On._default.apply(Mn.pop(), Sn) || !it(Nn) || !qn || !Be(Nn[In]) || We(Nn) || (Ln = Nn[qn], Ln && (Nn[qn] = null), Fe.event.triggered = In, Cn.isPropagationStopped() && Hn.addEventListener(In, Qt), Nn[In](), Cn.isPropagationStopped() && Hn.removeEventListener(In, Qt), Fe.event.triggered = void 0, Ln && (Nn[qn] = Ln)), Cn.result
                }
            },
            simulate: function(Cn, Sn, Nn) {
                var Dn = Fe.extend(new Fe.Event, Nn, {
                    type: Cn,
                    isSimulated: !0
                });
                Fe.event.trigger(Dn, null, Sn)
            }
        }), Fe.fn.extend({
            trigger: function(Cn, Sn) {
                return this.each(function() {
                    Fe.event.trigger(Cn, Sn, this)
                })
            },
            triggerHandler: function(Cn, Sn) {
                var Nn = this[0];
                if (Nn) return Fe.event.trigger(Cn, Sn, Nn, !0)
            }
        }), Ie.focusin || Fe.each({
            focus: 'focusin',
            blur: 'focusout'
        }, function(Cn, Sn) {
            var Nn = function(Dn) {
                Fe.event.simulate(Sn, Dn.target, Fe.event.fix(Dn))
            };
            Fe.event.special[Sn] = {
                setup: function() {
                    var Dn = this.ownerDocument || this,
                        En = rt.access(Dn, Sn);
                    En || Dn.addEventListener(Cn, Nn, !0), rt.access(Dn, Sn, (En || 0) + 1)
                },
                teardown: function() {
                    var Dn = this.ownerDocument || this,
                        En = rt.access(Dn, Sn) - 1;
                    En ? rt.access(Dn, Sn, En) : (Dn.removeEventListener(Cn, Nn, !0), rt.remove(Dn, Sn))
                }
            }
        });
        var Kt = f.location,
            Jt = Date.now(),
            Zt = /\?/;
        Fe.parseXML = function(Cn) {
            var Sn;
            if (!Cn || 'string' != typeof Cn) return null;
            try {
                Sn = new f.DOMParser().parseFromString(Cn, 'text/xml')
            } catch (Nn) {
                Sn = void 0
            }
            return (!Sn || Sn.getElementsByTagName('parsererror').length) && Fe.error('Invalid XML: ' + Cn), Sn
        };
        var en = /\[\]$/,
            tn = /\r?\n/g,
            nn = /^(?:submit|button|image|reset|file)$/i,
            an = /^(?:input|select|textarea|keygen)/i;
        Fe.param = function(Cn, Sn) {
            var Nn, Dn = [],
                En = function(jn, Ln) {
                    var An = Be(Ln) ? Ln() : Ln;
                    Dn[Dn.length] = encodeURIComponent(jn) + '=' + encodeURIComponent(null == An ? '' : An)
                };
            if (Array.isArray(Cn) || Cn.jquery && !Fe.isPlainObject(Cn)) Fe.each(Cn, function() {
                En(this.name, this.value)
            });
            else
                for (Nn in Cn) be(Nn, Cn[Nn], Sn, En);
            return Dn.join('&')
        }, Fe.fn.extend({
            serialize: function() {
                return Fe.param(this.serializeArray())
            },
            serializeArray: function() {
                return this.map(function() {
                    var Cn = Fe.prop(this, 'elements');
                    return Cn ? Fe.makeArray(Cn) : this
                }).filter(function() {
                    var Cn = this.type;
                    return this.name && !Fe(this).is(':disabled') && an.test(this.nodeName) && !nn.test(Cn) && (this.checked || !xt.test(Cn))
                }).map(function(Cn, Sn) {
                    var Nn = Fe(this).val();
                    return null == Nn ? null : Array.isArray(Nn) ? Fe.map(Nn, function(Dn) {
                        return {
                            name: Sn.name,
                            value: Dn.replace(tn, '\r\n')
                        }
                    }) : {
                        name: Sn.name,
                        value: Nn.replace(tn, '\r\n')
                    }
                }).get()
            }
        });
        var sn = /%20/g,
            rn = /#.*$/,
            dn = /([?&])_=[^&]*/,
            ln = /^(.*?):[ \t]*([^\r\n]*)$/mg,
            pn = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
            un = /^(?:GET|HEAD)$/,
            cn = /^\/\//,
            mn = {},
            hn = {},
            gn = '*/'.concat('*'),
            yn = Ne.createElement('a');
        yn.href = Kt.href, Fe.extend({
            active: 0,
            lastModified: {},
            etag: {},
            ajaxSettings: {
                url: Kt.href,
                type: 'GET',
                isLocal: pn.test(Kt.protocol),
                global: !0,
                processData: !0,
                async: !0,
                contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                accepts: {
                    '*': gn,
                    text: 'text/plain',
                    html: 'text/html',
                    xml: 'application/xml, text/xml',
                    json: 'application/json, text/javascript'
                },
                contents: {
                    xml: /\bxml\b/,
                    html: /\bhtml/,
                    json: /\bjson\b/
                },
                responseFields: {
                    xml: 'responseXML',
                    text: 'responseText',
                    json: 'responseJSON'
                },
                converters: {
                    '* text': String,
                    'text html': !0,
                    'text json': JSON.parse,
                    'text xml': Fe.parseXML
                },
                flatOptions: {
                    url: !0,
                    context: !0
                }
            },
            ajaxSetup: function(Cn, Sn) {
                return Sn ? Te(Te(Cn, Fe.ajaxSettings), Sn) : Te(Fe.ajaxSettings, Cn)
            },
            ajaxPrefilter: ve(mn),
            ajaxTransport: ve(hn),
            ajax: function(Cn, Sn) {
                function Nn(Vn, Yn, Gn, Qn) {
                    var Kn, Jn, Zn, ea, ta, na = Yn;
                    Pn || (Pn = !0, An && f.clearTimeout(An), Dn = void 0, jn = Qn || '', Xn.readyState = 0 < Vn ? 4 : 0, Kn = 200 <= Vn && 300 > Vn || 304 === Vn, Gn && (ea = ke(In, Xn, Gn)), ea = Ce(In, ea, Xn, Kn), Kn ? (In.ifModified && (ta = Xn.getResponseHeader('Last-Modified'), ta && (Fe.lastModified[En] = ta), ta = Xn.getResponseHeader('etag'), ta && (Fe.etag[En] = ta)), 204 === Vn || 'HEAD' === In.type ? na = 'nocontent' : 304 === Vn ? na = 'notmodified' : (na = ea.state, Jn = ea.data, Zn = ea.error, Kn = !Zn)) : (Zn = na, (Vn || !na) && (na = 'error', 0 > Vn && (Vn = 0))), Xn.status = Vn, Xn.statusText = (Yn || na) + '', Kn ? _n.resolveWith(Bn, [Jn, na, Xn]) : _n.rejectWith(Bn, [Xn, na, Zn]), Xn.statusCode(Fn), Fn = void 0, On && Wn.trigger(Kn ? 'ajaxSuccess' : 'ajaxError', [Xn, In, Kn ? Jn : Zn]), Rn.fireWith(Bn, [Xn, na]), On && (Wn.trigger('ajaxComplete', [Xn, In]), !--Fe.active && Fe.event.trigger('ajaxStop')))
                }
                'object' == typeof Cn && (Sn = Cn, Cn = void 0), Sn = Sn || {};
                var Dn, En, jn, Ln, An, qn, Pn, On, Hn, Mn, In = Fe.ajaxSetup({}, Sn),
                    Bn = In.context || In,
                    Wn = In.context && (Bn.nodeType || Bn.jquery) ? Fe(Bn) : Fe.event,
                    _n = Fe.Deferred(),
                    Rn = Fe.Callbacks('once memory'),
                    Fn = In.statusCode || {},
                    zn = {},
                    $n = {},
                    Un = 'canceled',
                    Xn = {
                        readyState: 0,
                        getResponseHeader: function(Vn) {
                            var Yn;
                            if (Pn) {
                                if (!Ln)
                                    for (Ln = {}; Yn = ln.exec(jn);) Ln[Yn[1].toLowerCase()] = Yn[2];
                                Yn = Ln[Vn.toLowerCase()]
                            }
                            return null == Yn ? null : Yn
                        },
                        getAllResponseHeaders: function() {
                            return Pn ? jn : null
                        },
                        setRequestHeader: function(Vn, Yn) {
                            return null == Pn && (Vn = $n[Vn.toLowerCase()] = $n[Vn.toLowerCase()] || Vn, zn[Vn] = Yn), this
                        },
                        overrideMimeType: function(Vn) {
                            return null == Pn && (In.mimeType = Vn), this
                        },
                        statusCode: function(Vn) {
                            if (Vn)
                                if (Pn) Xn.always(Vn[Xn.status]);
                                else
                                    for (var Yn in Vn) Fn[Yn] = [Fn[Yn], Vn[Yn]];
                            return this
                        },
                        abort: function(Vn) {
                            var Yn = Vn || Un;
                            return Dn && Dn.abort(Yn), Nn(0, Yn), this
                        }
                    };
                if (_n.promise(Xn), In.url = ((Cn || In.url || Kt.href) + '').replace(cn, Kt.protocol + '//'), In.type = Sn.method || Sn.type || In.method || In.type, In.dataTypes = (In.dataType || '*').toLowerCase().match(et) || [''], null == In.crossDomain) {
                    qn = Ne.createElement('a');
                    try {
                        qn.href = In.url, qn.href = qn.href, In.crossDomain = yn.protocol + '//' + yn.host != qn.protocol + '//' + qn.host
                    } catch (Vn) {
                        In.crossDomain = !0
                    }
                }
                if (In.data && In.processData && 'string' != typeof In.data && (In.data = Fe.param(In.data, In.traditional)), we(mn, In, Sn, Xn), Pn) return Xn;
                for (Hn in On = Fe.event && In.global, On && 0 == Fe.active++ && Fe.event.trigger('ajaxStart'), In.type = In.type.toUpperCase(), In.hasContent = !un.test(In.type), En = In.url.replace(rn, ''), In.hasContent ? In.data && In.processData && 0 === (In.contentType || '').indexOf('application/x-www-form-urlencoded') && (In.data = In.data.replace(sn, '+')) : (Mn = In.url.slice(En.length), In.data && (In.processData || 'string' == typeof In.data) && (En += (Zt.test(En) ? '&' : '?') + In.data, delete In.data), !1 === In.cache && (En = En.replace(dn, '$1'), Mn = (Zt.test(En) ? '&' : '?') + '_=' + Jt++ + Mn), In.url = En + Mn), In.ifModified && (Fe.lastModified[En] && Xn.setRequestHeader('If-Modified-Since', Fe.lastModified[En]), Fe.etag[En] && Xn.setRequestHeader('If-None-Match', Fe.etag[En])), (In.data && In.hasContent && !1 !== In.contentType || Sn.contentType) && Xn.setRequestHeader('Content-Type', In.contentType), Xn.setRequestHeader('Accept', In.dataTypes[0] && In.accepts[In.dataTypes[0]] ? In.accepts[In.dataTypes[0]] + ('*' === In.dataTypes[0] ? '' : ', ' + gn + '; q=0.01') : In.accepts['*']), In.headers) Xn.setRequestHeader(Hn, In.headers[Hn]);
                if (In.beforeSend && (!1 === In.beforeSend.call(Bn, Xn, In) || Pn)) return Xn.abort();
                if (Un = 'abort', Rn.add(In.complete), Xn.done(In.success), Xn.fail(In.error), Dn = we(hn, In, Sn, Xn), !Dn) Nn(-1, 'No Transport');
                else {
                    if (Xn.readyState = 1, On && Wn.trigger('ajaxSend', [Xn, In]), Pn) return Xn;
                    In.async && 0 < In.timeout && (An = f.setTimeout(function() {
                        Xn.abort('timeout')
                    }, In.timeout));
                    try {
                        Pn = !1, Dn.send(zn, Nn)
                    } catch (Vn) {
                        if (Pn) throw Vn;
                        Nn(-1, Vn)
                    }
                }
                return Xn
            },
            getJSON: function(Cn, Sn, Nn) {
                return Fe.get(Cn, Sn, Nn, 'json')
            },
            getScript: function(Cn, Sn) {
                return Fe.get(Cn, void 0, Sn, 'script')
            }
        }), Fe.each(['get', 'post'], function(Cn, Sn) {
            Fe[Sn] = function(Nn, Dn, En, jn) {
                return Be(Dn) && (jn = jn || En, En = Dn, Dn = void 0), Fe.ajax(Fe.extend({
                    url: Nn,
                    type: Sn,
                    dataType: jn,
                    data: Dn,
                    success: En
                }, Fe.isPlainObject(Nn) && Nn))
            }
        }), Fe._evalUrl = function(Cn) {
            return Fe.ajax({
                url: Cn,
                type: 'GET',
                dataType: 'script',
                cache: !0,
                async: !1,
                global: !1,
                throws: !0
            })
        }, Fe.fn.extend({
            wrapAll: function(Cn) {
                var Sn;
                return this[0] && (Be(Cn) && (Cn = Cn.call(this[0])), Sn = Fe(Cn, this[0].ownerDocument).eq(0).clone(!0), this[0].parentNode && Sn.insertBefore(this[0]), Sn.map(function() {
                    for (var Nn = this; Nn.firstElementChild;) Nn = Nn.firstElementChild;
                    return Nn
                }).append(this)), this
            },
            wrapInner: function(Cn) {
                return Be(Cn) ? this.each(function(Sn) {
                    Fe(this).wrapInner(Cn.call(this, Sn))
                }) : this.each(function() {
                    var Sn = Fe(this),
                        Nn = Sn.contents();
                    Nn.length ? Nn.wrapAll(Cn) : Sn.append(Cn)
                })
            },
            wrap: function(Cn) {
                var Sn = Be(Cn);
                return this.each(function(Nn) {
                    Fe(this).wrapAll(Sn ? Cn.call(this, Nn) : Cn)
                })
            },
            unwrap: function(Cn) {
                return this.parent(Cn).not('body').each(function() {
                    Fe(this).replaceWith(this.childNodes)
                }), this
            }
        }), Fe.expr.pseudos.hidden = function(Cn) {
            return !Fe.expr.pseudos.visible(Cn)
        }, Fe.expr.pseudos.visible = function(Cn) {
            return !!(Cn.offsetWidth || Cn.offsetHeight || Cn.getClientRects().length)
        }, Fe.ajaxSettings.xhr = function() {
            try {
                return new f.XMLHttpRequest
            } catch (Cn) {}
        };
        var xn = {
                0: 200,
                1223: 204
            },
            bn = Fe.ajaxSettings.xhr();
        Ie.cors = !!bn && 'withCredentials' in bn, Ie.ajax = bn = !!bn, Fe.ajaxTransport(function(Cn) {
            var Sn, Nn;
            if (Ie.cors || bn && !Cn.crossDomain) return {
                send: function(Dn, En) {
                    var jn, Ln = Cn.xhr();
                    if (Ln.open(Cn.type, Cn.url, Cn.async, Cn.username, Cn.password), Cn.xhrFields)
                        for (jn in Cn.xhrFields) Ln[jn] = Cn.xhrFields[jn];
                    for (jn in Cn.mimeType && Ln.overrideMimeType && Ln.overrideMimeType(Cn.mimeType), Cn.crossDomain || Dn['X-Requested-With'] || (Dn['X-Requested-With'] = 'XMLHttpRequest'), Dn) Ln.setRequestHeader(jn, Dn[jn]);
                    Sn = function(An) {
                        return function() {
                            Sn && (Sn = Nn = Ln.onload = Ln.onerror = Ln.onabort = Ln.ontimeout = Ln.onreadystatechange = null, 'abort' === An ? Ln.abort() : 'error' === An ? 'number' == typeof Ln.status ? En(Ln.status, Ln.statusText) : En(0, 'error') : En(xn[Ln.status] || Ln.status, Ln.statusText, 'text' !== (Ln.responseType || 'text') || 'string' != typeof Ln.responseText ? {
                                binary: Ln.response
                            } : {
                                text: Ln.responseText
                            }, Ln.getAllResponseHeaders()))
                        }
                    }, Ln.onload = Sn(), Nn = Ln.onerror = Ln.ontimeout = Sn('error'), void 0 === Ln.onabort ? Ln.onreadystatechange = function() {
                        4 === Ln.readyState && f.setTimeout(function() {
                            Sn && Nn()
                        })
                    } : Ln.onabort = Nn, Sn = Sn('abort');
                    try {
                        Ln.send(Cn.hasContent && Cn.data || null)
                    } catch (An) {
                        if (Sn) throw An
                    }
                },
                abort: function() {
                    Sn && Sn()
                }
            }
        }), Fe.ajaxPrefilter(function(Cn) {
            Cn.crossDomain && (Cn.contents.script = !1)
        }), Fe.ajaxSetup({
            accepts: {
                script: 'text/javascript, application/javascript, application/ecmascript, application/x-ecmascript'
            },
            contents: {
                script: /\b(?:java|ecma)script\b/
            },
            converters: {
                'text script': function(Cn) {
                    return Fe.globalEval(Cn), Cn
                }
            }
        }), Fe.ajaxPrefilter('script', function(Cn) {
            void 0 === Cn.cache && (Cn.cache = !1), Cn.crossDomain && (Cn.type = 'GET')
        }), Fe.ajaxTransport('script', function(Cn) {
            if (Cn.crossDomain) {
                var Sn, Nn;
                return {
                    send: function(Dn, En) {
                        Sn = Fe('<script>').prop({
                            charset: Cn.scriptCharset,
                            src: Cn.url
                        }).on('load error', Nn = function(jn) {
                            Sn.remove(), Nn = null, jn && En('error' === jn.type ? 404 : 200, jn.type)
                        }), Ne.head.appendChild(Sn[0])
                    },
                    abort: function() {
                        Nn && Nn()
                    }
                }
            }
        });
        var vn = [],
            wn = /(=)\?(?=&|$)|\?\?/;
        Fe.ajaxSetup({
            jsonp: 'callback',
            jsonpCallback: function() {
                var Cn = vn.pop() || Fe.expando + '_' + Jt++;
                return this[Cn] = !0, Cn
            }
        }), Fe.ajaxPrefilter('json jsonp', function(Cn, Sn, Nn) {
            var Dn, En, jn, Ln = !1 !== Cn.jsonp && (wn.test(Cn.url) ? 'url' : 'string' == typeof Cn.data && 0 === (Cn.contentType || '').indexOf('application/x-www-form-urlencoded') && wn.test(Cn.data) && 'data');
            if (Ln || 'jsonp' === Cn.dataTypes[0]) return Dn = Cn.jsonpCallback = Be(Cn.jsonpCallback) ? Cn.jsonpCallback() : Cn.jsonpCallback, Ln ? Cn[Ln] = Cn[Ln].replace(wn, '$1' + Dn) : !1 !== Cn.jsonp && (Cn.url += (Zt.test(Cn.url) ? '&' : '?') + Cn.jsonp + '=' + Dn), Cn.converters['script json'] = function() {
                return jn || Fe.error(Dn + ' was not called'), jn[0]
            }, Cn.dataTypes[0] = 'json', En = f[Dn], f[Dn] = function() {
                jn = arguments
            }, Nn.always(function() {
                void 0 == En ? Fe(f).removeProp(Dn) : f[Dn] = En, Cn[Dn] && (Cn.jsonpCallback = Sn.jsonpCallback, vn.push(Dn)), jn && Be(En) && En(jn[0]), jn = En = void 0
            }), 'script'
        }), Ie.createHTMLDocument = function() {
            var Cn = Ne.implementation.createHTMLDocument('').body;
            return Cn.innerHTML = '<form></form><form></form>', 2 === Cn.childNodes.length
        }(), Fe.parseHTML = function(Cn, Sn, Nn) {
            if ('string' != typeof Cn) return [];
            'boolean' == typeof Sn && (Nn = Sn, Sn = !1);
            var Dn, En, jn;
            return (Sn || (Ie.createHTMLDocument ? (Sn = Ne.implementation.createHTMLDocument(''), Dn = Sn.createElement('base'), Dn.href = Ne.location.href, Sn.head.appendChild(Dn)) : Sn = Ne), En = Ye.exec(Cn), jn = !Nn && [], En) ? [Sn.createElement(En[1])] : (En = F([Cn], Sn, jn), jn && jn.length && Fe(jn).remove(), Fe.merge([], En.childNodes))
        }, Fe.fn.load = function(Cn, Sn, Nn) {
            var Dn, En, jn, Ln = this,
                An = Cn.indexOf(' ');
            return -1 < An && (Dn = ge(Cn.slice(An)), Cn = Cn.slice(0, An)), Be(Sn) ? (Nn = Sn, Sn = void 0) : Sn && 'object' == typeof Sn && (En = 'POST'), 0 < Ln.length && Fe.ajax({
                url: Cn,
                type: En || 'GET',
                dataType: 'html',
                data: Sn
            }).done(function(qn) {
                jn = arguments, Ln.html(Dn ? Fe('<div>').append(Fe.parseHTML(qn)).find(Dn) : qn)
            }).always(Nn && function(qn, Pn) {
                Ln.each(function() {
                    Nn.apply(this, jn || [qn.responseText, Pn, qn])
                })
            }), this
        }, Fe.each(['ajaxStart', 'ajaxStop', 'ajaxComplete', 'ajaxError', 'ajaxSuccess', 'ajaxSend'], function(Cn, Sn) {
            Fe.fn[Sn] = function(Nn) {
                return this.on(Sn, Nn)
            }
        }), Fe.expr.pseudos.animated = function(Cn) {
            return Fe.grep(Fe.timers, function(Sn) {
                return Cn === Sn.elem
            }).length
        }, Fe.offset = {
            setOffset: function(Cn, Sn, Nn) {
                var Dn, En, jn, Ln, An, qn, Pn, On = Fe.css(Cn, 'position'),
                    Hn = Fe(Cn),
                    Mn = {};
                'static' === On && (Cn.style.position = 'relative'), An = Hn.offset(), jn = Fe.css(Cn, 'top'), qn = Fe.css(Cn, 'left'), Pn = ('absolute' === On || 'fixed' === On) && -1 < (jn + qn).indexOf('auto'), Pn ? (Dn = Hn.position(), Ln = Dn.top, En = Dn.left) : (Ln = parseFloat(jn) || 0, En = parseFloat(qn) || 0), Be(Sn) && (Sn = Sn.call(Cn, Nn, Fe.extend({}, An))), null != Sn.top && (Mn.top = Sn.top - An.top + Ln), null != Sn.left && (Mn.left = Sn.left - An.left + En), 'using' in Sn ? Sn.using.call(Cn, Mn) : Hn.css(Mn)
            }
        }, Fe.fn.extend({
            offset: function(Cn) {
                if (arguments.length) return void 0 === Cn ? this : this.each(function(En) {
                    Fe.offset.setOffset(this, Cn, En)
                });
                var Sn, Nn, Dn = this[0];
                if (Dn) return Dn.getClientRects().length ? (Sn = Dn.getBoundingClientRect(), Nn = Dn.ownerDocument.defaultView, {
                    top: Sn.top + Nn.pageYOffset,
                    left: Sn.left + Nn.pageXOffset
                }) : {
                    top: 0,
                    left: 0
                }
            },
            position: function() {
                if (this[0]) {
                    var Cn, Sn, Nn, Dn = this[0],
                        En = {
                            top: 0,
                            left: 0
                        };
                    if ('fixed' === Fe.css(Dn, 'position')) Sn = Dn.getBoundingClientRect();
                    else {
                        for (Sn = this.offset(), Nn = Dn.ownerDocument, Cn = Dn.offsetParent || Nn.documentElement; Cn && (Cn === Nn.body || Cn === Nn.documentElement) && 'static' === Fe.css(Cn, 'position');) Cn = Cn.parentNode;
                        Cn && Cn !== Dn && 1 === Cn.nodeType && (En = Fe(Cn).offset(), En.top += Fe.css(Cn, 'borderTopWidth', !0), En.left += Fe.css(Cn, 'borderLeftWidth', !0))
                    }
                    return {
                        top: Sn.top - En.top - Fe.css(Dn, 'marginTop', !0),
                        left: Sn.left - En.left - Fe.css(Dn, 'marginLeft', !0)
                    }
                }
            },
            offsetParent: function() {
                return this.map(function() {
                    for (var Cn = this.offsetParent; Cn && 'static' === Fe.css(Cn, 'position');) Cn = Cn.offsetParent;
                    return Cn || kt
                })
            }
        }), Fe.each({
            scrollLeft: 'pageXOffset',
            scrollTop: 'pageYOffset'
        }, function(Cn, Sn) {
            var Nn = 'pageYOffset' === Sn;
            Fe.fn[Cn] = function(Dn) {
                return at(this, function(En, jn, Ln) {
                    var An;
                    return We(En) ? An = En : 9 === En.nodeType && (An = En.defaultView), void 0 === Ln ? An ? An[Sn] : En[jn] : void(An ? An.scrollTo(Nn ? An.pageXOffset : Ln, Nn ? Ln : An.pageYOffset) : En[jn] = Ln)
                }, Cn, Dn, arguments.length)
            }
        }), Fe.each(['top', 'left'], function(Cn, Sn) {
            Fe.cssHooks[Sn] = ne(Ie.pixelPosition, function(Nn, Dn) {
                if (Dn) return Dn = te(Nn, Sn), At.test(Dn) ? Fe(Nn).position()[Sn] + 'px' : Dn
            })
        }), Fe.each({
            Height: 'height',
            Width: 'width'
        }, function(Cn, Sn) {
            Fe.each({
                padding: 'inner' + Cn,
                content: Sn,
                '': 'outer' + Cn
            }, function(Nn, Dn) {
                Fe.fn[Dn] = function(En, jn) {
                    var Ln = arguments.length && (Nn || 'boolean' != typeof En),
                        An = Nn || (!0 === En || !0 === jn ? 'margin' : 'border');
                    return at(this, function(qn, Pn, On) {
                        var Hn;
                        return We(qn) ? 0 === Dn.indexOf('outer') ? qn['inner' + Cn] : qn.document.documentElement['client' + Cn] : 9 === qn.nodeType ? (Hn = qn.documentElement, Math.max(qn.body['scroll' + Cn], Hn['scroll' + Cn], qn.body['offset' + Cn], Hn['offset' + Cn], Hn['client' + Cn])) : void 0 === On ? Fe.css(qn, Pn, An) : Fe.style(qn, Pn, On, An)
                    }, Sn, Ln ? En : void 0, Ln)
                }
            })
        }), Fe.each('blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu'.split(' '), function(Cn, Sn) {
            Fe.fn[Sn] = function(Nn, Dn) {
                return 0 < arguments.length ? this.on(Sn, null, Nn, Dn) : this.trigger(Sn)
            }
        }), Fe.fn.extend({
            hover: function(Cn, Sn) {
                return this.mouseenter(Cn).mouseleave(Sn || Cn)
            }
        }), Fe.fn.extend({
            bind: function(Cn, Sn, Nn) {
                return this.on(Cn, null, Sn, Nn)
            },
            unbind: function(Cn, Sn) {
                return this.off(Cn, null, Sn)
            },
            delegate: function(Cn, Sn, Nn, Dn) {
                return this.on(Sn, Cn, Nn, Dn)
            },
            undelegate: function(Cn, Sn, Nn) {
                return 1 === arguments.length ? this.off(Cn, '**') : this.off(Sn, Cn || '**', Nn)
            }
        }), Fe.proxy = function(Cn, Sn) {
            var Nn, Dn, En;
            if ('string' == typeof Sn && (Nn = Cn[Sn], Sn = Cn, Cn = Nn), !!Be(Cn)) return Dn = Ee.call(arguments, 2), En = function() {
                return Cn.apply(Sn || this, Dn.concat(Ee.call(arguments)))
            }, En.guid = Cn.guid = Cn.guid || Fe.guid++, En
        }, Fe.holdReady = function(Cn) {
            Cn ? Fe.readyWait++ : Fe.ready(!0)
        }, Fe.isArray = Array.isArray, Fe.parseJSON = JSON.parse, Fe.nodeName = T, Fe.isFunction = Be, Fe.isWindow = We, Fe.camelCase = q, Fe.type = y, Fe.now = Date.now, Fe.isNumeric = function(Cn) {
            var Sn = Fe.type(Cn);
            return ('number' === Sn || 'string' === Sn) && !isNaN(Cn - parseFloat(Cn))
        }, u = [], c = function() {
            return Fe
        }.apply(r, u), !(void 0 !== c && (o.exports = c));
        var Tn = f.jQuery,
            kn = f.$;
        return Fe.noConflict = function(Cn) {
            return f.$ === Fe && (f.$ = kn), Cn && f.jQuery === Fe && (f.jQuery = Tn), Fe
        }, h || (f.jQuery = f.$ = Fe), Fe
    })
}, function(o, r) {
    'use strict';
    Object.defineProperty(r, '__esModule', {
        value: !0
    });
    var u = r.THROTTLE_RESIZE = 'optimizedResize',
        c = r.DEVICE_TYPE = {
            mobile: 'mobile',
            tablet: 'tablet',
            desktop: 'desktop'
        },
        f = r.TOKEN = '$657569439633119',
        h = r.SWF_PATH = '//releases.flowplayer.org/7.0.4/commercial/flowplayerhls.swf'
}, function(o, r, d) {
    'use strict';
    (function(u, c, f) {
        function h(D) {
            return D && D.__esModule ? D : {
                default: D
            }
        }
        d(3), d(4), d(5);
        var y = d(1),
            x = function(D) {
                if (D && D.__esModule) return D;
                var E = {};
                if (null != D)
                    for (var L in D) Object.prototype.hasOwnProperty.call(D, L) && (E[L] = D[L]);
                return E.default = D, E
            }(y),
            T = d(6),
            k = h(T),
            C = d(7),
            S = h(C);
        window.$ = u, f = c;
        var N = new S.default;
        (0, k.default)('resize', x.THROTTLE_RESIZE), N.init()
    }).call(r, d(0), d(0), d(0))
}, function() {}, function() {}, function() {}, function(o, r) {
    'use strict';
    Object.defineProperty(r, '__esModule', {
        value: !0
    });
    r.default = function(f, h, g) {
        var y = !1,
            x = g || window;
        x.addEventListener(f, function() {
            y || (y = !0, requestAnimationFrame(function() {
                x.dispatchEvent(new CustomEvent(h)), y = !1
            }))
        })
    }
}, function(o, r, d) {
    'use strict';
    (function(u) {
        function f(A, q) {
            if (!(A instanceof q)) throw new TypeError('Cannot call a class as a function')
        }

        function h(A, q) {
            var P;
            (void 0 === A || null === A) && (A = 0);
            var O = new Date(null),
                H = q ? [14, 5] : [11, 8];
            return O.setSeconds(A), (P = O.toISOString()).substr.apply(P, H)
        }

        function g() {
            var A = ['googletv', 'viera', 'smarttv', 'internet.tv', 'netcast', 'nettv', 'appletv', 'boxee', 'kylo', 'roku', 'dlnadoc', 'roku', 'pov_tv', 'hbbtv', 'ce-html', 'playstation', 'xbox'];
            for (var q in A)
                if (0 < navigator.userAgent.toLowerCase().indexOf(A[q].toLowerCase())) return !0;
            return !1
        }
        Object.defineProperty(r, '__esModule', {
            value: !0
        });
        var y = Object.assign || function(A) {
                for (var P, q = 1; q < arguments.length; q++)
                    for (var O in P = arguments[q], P) Object.prototype.hasOwnProperty.call(P, O) && (A[O] = P[O]);
                return A
            },
            x = function() {
                function A(q, P) {
                    for (var H, O = 0; O < P.length; O++) H = P[O], H.enumerable = H.enumerable || !1, H.configurable = !0, 'value' in H && (H.writable = !0), Object.defineProperty(q, H.key, H)
                }
                return function(q, P, O) {
                    return P && A(q.prototype, P), O && A(q, O), q
                }
            }(),
            T = d(1),
            k = function(A) {
                if (A && A.__esModule) return A;
                var q = {};
                if (null != A)
                    for (var P in A) Object.prototype.hasOwnProperty.call(A, P) && (q[P] = A[P]);
                return q.default = A, q
            }(T),
            C = d(8),
            S = k.DEVICE_TYPE,
            N = S.mobile,
            D = S.desktop,
            E = S.tablet;
        var L = function() {
            function A() {
                var q = this;
                f(this, A), this.writeDOM = function() {
                    q.DOM.$window = u(window), q.DOM.$body = q.DOM.$window.find('body'), q.DOM.$document = u(document)
                }, this.setEventListeners = function() {
                    u(window).on(k.THROTTLE_RESIZE, q.handleWindowResize).on('scroll', q.handleWindowScroll).on('load', q.handleWindowLoad), u(q.handleDocReady())
                }, this.switchResponsiveState = function() {
                    var P = q.deviceType === N,
                        O = q.deviceType === E,
                        H = q.deviceType === D;
                    !q.isInitMobile && P ? (q.applyMobileSet(), q.isInitMobile = !0, q.isInitTablet = !1, q.isInitDesktop = !1) : !q.isInitTablet && O ? (q.applyTabletSet(), q.isInitMobile = !1, q.isInitTablet = !0, q.isInitDesktop = !1) : !q.isInitDesktop && H && (q.applyDesktopSet(), q.isInitMobile = !1, q.isInitTablet = !1, q.isInitDesktop = !0)
                }, this.handleWindowResize = function() {
                    q.switchResponsiveState()
                }, this.handleWindowScroll = function() {}, this.handleDocReady = function() {
                    q.switchResponsiveState()
                }, this.handleWindowLoad = function() {
                    q.initFlowPlayer()
                }, this.handleParseSubtitle = function(P) {
                    for (var R, F, z, O = /^(([0-9]{1,2}:){1,2}[0-9]{2}[,.][0-9]{3})\s*--\> (([0-9]{1,2}:){1,2}[0-9]{2}[,.][0-9]{3})(.*)/, H = [], M = 0, I = P.split('\n'), B = I.length, W = {}; M < B; M++)
                        if (F = O.exec(I[M]), F) {
                            for (R = I[M - 1], z = '<p>' + I[++M] + '</p><br/>';
                                'string' == typeof I[++M] && I[M].trim() && M < I.length;) z += '<p>' + I[M] + '</p><br/>';
                            W = {
                                title: R,
                                startTime: q.parseSeconds(F[1]),
                                endTime: q.parseSeconds(F[3]),
                                text: z
                            }, H.push(W)
                        }
                    return H
                }, this.parseSeconds = function(P) {
                    var O = P.split(':');
                    return 2 == O.length && O.unshift(0), 60 * (60 * O[0]) + 60 * O[1] + parseFloat(O[2].replace(',', '.'))
                }, this.addExtraFeatures = function(P, O) {
                    P.conf = {
                        ima: {
                            locale: 'ru_ru'
                        }
                    };
                    var H = P.bean;
                    P(function(M, I) {
                        var W = I.querySelector('.fp-fullscreen');
                        M.on('ready', function() {
                            I.querySelector('.fp-controls').appendChild(W)
                        });
                        

                        // var loc = localStorage || false;
                        // console.log(window);

                        // if (localStorage) {
                        //     var R = JSON.parse(localStorage.getItem(O));
                        // } else {
                        //     var R = false;
                        // }

                        if (getCookie(O) !== undefined) {
                            var R = JSON.parse(decodeURIComponent(getCookie(O)));
                        } else {
                            var R = false;
                        }

                        var F = 0 <= ['iPad', 'iPhone', 'iPod'].indexOf(navigator.platform);
                        var aO = u('.flowplayer'),
                            configs = aO.data('config');
                            
                        if (!!R && 0 < R.playBack && !F && configs.track_watching === true) {                        
                            var z;

                            var t_time = eng === false ? 'Время' : 'Time';
                            var t_season = eng === false ? 'Сезон' : 'Season';
                            var t_episode = eng === false ? 'Серия' : 'Episode';
                            var t_translation = eng === false ? 'Озвучка' : '';

                            if (configs.type == 'serial') {
                                z = '<div class="fp-storage">';
                                z += '<div class="fp-storage__btn">';
                                    z += '<div class="help">'+(eng===false ? '\u041F\u0440\u043E\u0434\u043E\u043B\u0436\u0438\u0442\u044C' : 'Continue')+'</div>';
                                z += '</div>';
                                z += '<div class="fp-storage_time">'+t_time+': ' + h(R.playBack) + ' '+t_season+' ' + R.season + ' '+t_episode+' ' + R.episode + ' '+(t_translation=='' ? '' : t_translation+' ' + R.translation_name) + '</div>\n</div>';
                                z += '</div>';
                                
                                var local_token = window.location.pathname.replace('/serial/','').replace('/iframe', '');
                                var storagtoken = R.translation;

                                u(I).find('.fp-player').append(z);
                                u(I).find('.fp-player .fp-storage__btn').click(function() {                                 
                                    if (( R.translation ) == (window.location.pathname.replace('/serial/', '').replace('/iframe', '')) && document.getElementById('episodes').value == R.episode && document.getElementById('seasons').value == R.season ) {
                                        window.playFromCurrentPosition = true;
                                    } else {
                                        var nocontroll = '';
                                        if (window.location.search.indexOf('nocontrol') > 0) nocontroll = "&nocontrol=1"; 
                                        var url = window.location.protocol + '//' + window.location.host + window.location.pathname + '?s=' + R.season + '&e=' + R.episode + '&t=' + R.translation + '&time=' + R.playBack + '&d=' + domain + nocontroll;
                                        window.location.href = url;
                                    }
                                });

                            } else {
                                z = '<div class="fp-storage">\n<div class="fp-storage__btn"><div class="help">'+(eng===false ? '\u041F\u0440\u043E\u0434\u043E\u043B\u0436\u0438\u0442\u044C' : 'Continue')+'</div></div><div class="fp-storage_time">'+(eng===true?'You stopped at':'\u0412\u044B \u043E\u0441\u0442\u0430\u043D\u043E\u0432\u0438\u043B\u0438\u0441\u044C \u043D\u0430')+' ' + h(R.playBack) + '</div>\n</div>';
                                z += '<div class="fp-stop-progress"><div style="width: '+R.process+'%"></div></div>';
                                u(I).find('.fp-player').append(z);

                                u(I).find('.fp-player .fp-storage__btn').click(function() {
                                    window.playFromCurrentPosition = true;
                                    return /*u(I).find('.fp-storage').remove(), 
                                        M.seek(R.playBack),*/ 
                                        window.playFromCurrentPosition
                                });
                            }                           
                        }

                        M.one('ready', function() {
                            u(I).find('.fp-storage').remove(),
                            u(I).find('.fp-stop-progress').remove(),
                            window.playFromCurrentPosition && !!R && M.seek(R.playBack)
                        });

                        var advtime = function(duration, time) {
                            var duration_sec = duration;
                            var pro = ((time-duration_sec)/duration_sec) * 100;
                            var jo = 100 + pro;
                            return jo;
                        }

                        var U = 0;
                        var aO = u('.flowplayer'),
                            configs = aO.data('config');
                        M.on('progress', function(Q, K, J) {
                            var serial = configs.type=='serial'?true:false;
                            var duration = K.video.duration;
                            if (2 <= Math.abs(J - U)) {
                                U = J;
                                if (serial) {
                                    // if (localStorage) {
                                        var translation_name;
                                        Array.prototype.forEach.call($(document.getElementById('translation')).find('option'), function (value){
                                            if ($(value).attr('value') == document.getElementById('translation').value) {
                                                translation_name = $(value).html();
                                            }
                                        });
                                   

                                        setCookie (O, (
                                            encodeURIComponent(
                                                JSON.stringify({
                                                    playBack: J,
                                                    season: document.getElementById('seasons').value,
                                                    episode: document.getElementById('episodes').value,
                                                    translation: document.getElementById('translation') != null ? document.getElementById('translation').value : '' ,
                                                    translation_name: translation_name,
                                                    duration: duration,
                                                    process: advtime(duration, J)
                                                })
                                            ).toString()
                                        ), 
                                        {
                                            expires : (60*60*24*7),
                                            domain: redomain
                                        });

                                        // localStorage.setItem(O, JSON.stringify({
                                        //     playBack: J,
                                        //     season: document.getElementById('seasons').value,
                                        //     episode: document.getElementById('episodes').value,
                                        //     translation: document.getElementById('translation') != null ? document.getElementById('translation').value : '' ,
                                        //     translation_name: translation_name,
                                        //     duration: duration,
                                        //     process: advtime(duration, J)
                                        // }))
                                    // } 
                                } else {

                                        // console.log(encodeURIComponent(
                                        //         JSON.stringify({
                                        //             playBack: J,
                                        //             duration: duration,
                                        //             process: advtime(duration, J)
                                        //         })
                                        //     ).toString());
                                        
                                        setCookie(O, (
                                            encodeURIComponent(
                                                JSON.stringify({
                                                    playBack: J,
                                                    duration: duration,
                                                    process: advtime(duration, J)
                                                })
                                            ).toString()
                                        ), 
                                        {
                                            expires : (60*60*24*7),
                                            domain: redomain
                                        }); 


                                    // if (localStorage) {
                                    //     localStorage.setItem(O, JSON.stringify({
                                    //         playBack: J,
                                    //         duration: duration,
                                    //         process: advtime(duration, J)
                                    //     }));
                                    // }
                                }
                            }
                        }), M.on('volume', function(Q, K, J) {
                            var Z = u(I).find('.fp-volume-bar');
                                Z.fadeIn(200);

                            var ee = 'Громкость: ';

                                if (typeof eng != 'undefined') {
                                    if (eng === true) {
                                        ee = 'Volume: ';
                                    }
                                }

                                ee += Math.round(100 * J) + '%';
                            Z.text(ee), clearTimeout(window.volumeTimer), window.volumeTimer = setTimeout(function() {
                                Z.fadeOut(200)
                            }, 2e3)
                        }), H.off(I, 'click.player');
                        var X = [],
                            V = !1,
                            Y = !1,
                            G = !1;
                        H.on(I, 'click', '.fp-controls', function() {
                            return V = !0
                        }), H.on(I, 'click', '.fp-qsel-menu a', function() {
                            return Y = !0
                        }), H.on(I, 'click', '.fp-subtitle-menu a', function() {
                            return G = !0
                        }), H.on(I, 'click', function() {
                            X.push(setTimeout(function() {
                                V || Y || G || M.toggle(), V = !1, Y = !1, G = !1, H.on(I, 'dblclick', function() {
                                    M.fullscreen(), X.forEach(function(Q) {
                                        return clearTimeout(Q)
                                    }), X = []
                                })
                            }, 220))
                        }), u(document).on('mouseenter', '.fp-qsel', function() {
                            var Q = u('.flowplayer').find('.fp-qsel-menu')[0],
                                K = u('.flowplayer').find('.fp-subtitle-menu')[0];
                            M.showMenu(Q), M.hideMenu(K)
                        }), u(document).on('mouseleave', '.fp-qsel-menu', function() {
                            var Q = u('.flowplayer').find('.fp-qsel-menu')[0];
                            u(Q).hasClass('fp-active') && setTimeout(function() {
                                M.hideMenu(Q)
                            }, 500)
                        }), u(document).on('mouseenter', '.fp-cc', function() {
                            var Q = u('.flowplayer').find('.fp-qsel-menu')[0],
                                K = u('.flowplayer').find('.fp-subtitle-menu')[0];
                            M.showMenu(K), M.hideMenu(Q)
                        }), u(document).on('mouseleave', '.fp-subtitle-menu', function() {
                            var Q = u('.flowplayer').find('.fp-subtitle-menu')[0];
                            u(Q).hasClass('fp-active') && setTimeout(function() {
                                M.hideMenu(Q)
                            }, 500)
                        }), u(document).on('mouseleave', '.flowplayer', function() {
                            var Q = u('.flowplayer').find('.fp-qsel-menu')[0],
                                K = u('.flowplayer').find('.fp-subtitle-menu')[0];
                            M.hideMenu(Q), M.hideMenu(K)
                        })
                    })
                }, this.initFlowPlayer = function() {
                    function P() {
                        O.addClass('hidden'), 
                        O.remove(),
                        H.html('<video class="video" id="nativepl" name="nativepl" style="background:#000; background-color:#000;" width="100%" height="100%" src="' + M + '" type="application/x-mpegURL" controls><source src="' + M + '" type="application/x-mpegURL"></source>' + subtitles + '</video>')                  
                        new NativeAdv({id: 'nativepl', adv: AD});
                    }

                    var X, O = u('.flowplayer'),
                        configs = O.data('config');
                        
                    var H = u('#nativeplayer'),
                        M = configs.hls,
                        W = configs.token,
                        F = configs.href,
                        z = configs.type,
                        L = configs.logo,
                        VL = configs.volume_control_mouse,
                        AD = configs.ads,
                        poster = configs.poster,
                        hbte = configs.hbte,
                        time = configs.time,
                        subtitles = [];

                    if ( typeof configs.subtitle.ru != 'undefined' ) {
                        subtitles.push({
                            kind: 'subtitles',
                            srclang: 'ru',
                            label: 'Русский',
                            src: configs.subtitle.ru
                        });
                    }                    

                    if ( typeof configs.subtitle.ua != 'undefined' ) {
                        subtitles.push({
                            kind: 'subtitles',
                            srclang: 'ua',
                            label: 'Украинский',
                            src: configs.subtitle.ua
                        });
                    }                    

                    if ( typeof configs.subtitle.en != 'undefined' ) {
                        subtitles.push({
                            kind: 'subtitles',
                            srclang: 'en',
                            label: 'Английский',
                            src: configs.subtitle.en
                        });
                    }
                    
                    var V = y({}, C),
                        Y = V.webos,
                        G = V.android,
                        Q = V.ios,
                        K = V.tizen,
                        J = 0 <= ['iPad'].indexOf(navigator.platform),
                        Z = /(iPad|iPod)/g.test(navigator.userAgent);
                    
                    if (!!J || !!Z) P();
                    else {
                        var ee = C.name.toLowerCase(),
                        confs = {
                            clip: {
                                onCuepoint: [
                                    [10000]
                                ],
                                ads: AD,
                                subtitles: subtitles,
                                sources: [{
                                    // type: 'video/mp4',
                                    type: 'application/x-mpegurl',
                                    src: M
                                }],
                                logo: L,
                                vlc: VL,
                                hbte: hbte
                            },
                            conf: {
                                token: W,
                                href: F,
                                type: z,
                            },
                            autoplay: time ? true : false,
                            poster: poster,
                            subtitleParser: q.handleParseSubtitle,
                            hlsQualities: [{
                                level: -1,
                                label: 'AUTO'
                            }, {
                                level: 0,
                                label: '360p'
                            }, {
                                level: 1,
                                label: '480p'
                            }, {
                                level: 2,
                                label: '720p <span>HD</span>'
                            }, {
                                level: 3,
                                label: '1080p <span>HD</span>'
                            }, {
                                level: 4,
                                label: '2160 <span>4K</span>'
                            }, {
                                level: 5,
                                label: '4320 <span>8K</span>'
                            }],
                            hlsjs: {
                                maxBufferLength: 45,
                                maxMaxBufferLength: 60,
                                safari: true,
                                // autoStartLoad: true,
                                startPosition: 1,
                                smoothSwitching: !1 
                            },
                            swfHls: k.SWF_PATH,
                            key: k.TOKEN,
                            share: !1,
                            bgcolor: '#000000',
                            fullscreen: true,
                            native_fullscreen: true,
                            ratio: 9 / 16,
                            nativesubtitles: !0,
                            mutedAutoplay: !1,
                            mouseoutTimeout: 3e3
                        };

                        if (configs.logo_in_pause) confs.clip.lip = true;
                        
                        var flow = function () {
                            H.addClass('hidden'); 
                            H.remove(); 
                            q.addExtraFeatures(flowplayer, W); 
                            var api = flowplayer(O, confs);                              
                            if ((typeof auto != 'undefined') && auto) {
                                window.playFromCurrentPosition = true;
                                api.load();
                                api.seek(1);
                            } else if (time > 2) {
                                window.playFromCurrentPosition = true;
                                api.load();
                                api.seek(time);
                            } 

                            api.on("finish", function () {
                                if (next_id != '') {
                                    var a = {};

                                    var t_episode = eng === false ? 'Серия' : 'Episode';
                                    var t_sec = eng === false ? 'сек' : 'sec';
                                    var html = '<div class="fp-timer">\
                                                    <div class="fp-timer-block">'+next_id+' '+t_episode+'</div>\
                                                    <div class="fp-timer-time"> <span>5</span> '+t_sec+' </div>\
                                                </div>';

                                    $('.fp-player').prepend(html);

                                    if (document.getElementById('seasons') !== null) { a.s = document.getElementById('seasons').value; }
                                    if (document.getElementById('translation') !== null) { a.t = document.getElementById('translation').value;} else { a.t = cookie_name; }
                                        
                                    var c=window.location.protocol + "//" + window.location.host + window.location.pathname + "?e=" + next_id + "&s=" + a.s + "&t=" + a.t + "&auto=newepisode&time=3.0" + "&d="+domain;
                                    // console.log("c=", c);
                                    var i = 5;
                                    var t = setInterval(function(){
                                        if (i === 0) {
                                            clearInterval(t);
                                            window.location.href=c;
                                        } else {
                                            i--;
                                            $('.fp-timer-time span').text(i);
                                        }
                                    }, 1000);
                                }
                                // console.log(c);
                            });

                            var webOS = (new RegExp(/webOS|webos|WEBOS|wbos|wOSBrowser|webOSBrowser|webOS.TV|webOSTV|LG NetCast.TV|NetCast/gi)).test(((window.navigator && navigator.userAgent) || ""));
                            var common = flowplayer.common,
                                bean = flowplayer.bean;
                                 var pl = false;
                            api.on("ready", function () {




                                if (document.getElementsByClassName('fp-qsel').length < 1) {

                                    var q = {640: 1, 851: 2,852: 2,853: 2,854: 2, 1280: 3, 1920: 4, 3840: 5};
                                    var q2 = {0: 360, 1: 480, 2: 720, 3: 1080, 4: 2160};

                                    var el = api.conf.clip.sources[0].src;
                                    var m3u8 = el.replace('/index.m3u8', '');

                                    $.ajax({
                                        url: el,
                                        success: function (a, b, c) {
                                            var aa = a.match(new RegExp(/(RESOLUTION=([0-9]+)(x|х)([0-9]+)\s(.*).m3u8)/gi)), r = [], aaa = [], i = 0;
                                                // aa = aa.sort(function compareNumeric(a, b) {if (a > b) return 1; if (a < b) return -1;});
                                           
                                            aa.forEach(function (v, k) {
                                                if ((new RegExp(/(\.\/)/)).test(v)) {
                                                    var h = v.match(new RegExp(/(\.\/)(.*)\.m3u8/mi));
                                                    h = h[0].replace('\.\/', '');
                                                } else {
                                                    var h = v.match(new RegExp(/hls(.*)\.m3u8/i));
                                                    h = h[0];
                                                }

                                                var url = m3u8 + '/' + h;
                                                var w = v.match(new RegExp(/([0-9]+)(x|х)([0-9]+)/));
                                                aaa[w[1]] = url;
                                            });

                                            aaa.forEach(function (w, h) {
                                                r[i] = api.conf.hlsQualities[q[h]];
                                                // console.log(h, api.conf.hlsQualities[q[h]]);
                                                r[i].url = w;
                                                i ++;
                                            });

                                
                                            api.video.qualities = r;
                                            var params = {},
                                                qb = common.createElement("strong", {"class": "fp-qsel", 'id': 'fp-qual-button'}, "Auto"), 
                                                ht = common.createElement("div", {"class": "fp-menu fp-qsel-menu"}, ''), 
                                                hg = 0;

                                            Array.prototype.forEach.call(r, function (v, k) {
                                                params = {};
                                                params['data-quality'] = v.level;
                                                params['data-url'] = v.url;
                                                if (hg === v.level) params.class = "fp-selected fp-color";  
                                                ht.append(common.createElement("a", params, v.label));
                                            });                                           

                                            $('.fp-cc').after(qb);
                                            $('.fp-subtitle-menu').after(ht);

                                            $(document).on('click', '[data-url]', function(a) {
                                                var url = $(this).data('url');
                                                var quality = $(this).data('quality');
                                                var time = api.video.time;
                                                api.play(url, function () {
                                                    setTimeout(function(){
                                                        $(document.querySelectorAll('.fp-qsel')).text(q2[quality]);
                                                        $(document.querySelectorAll('[data-quality]')).removeClass('fp-selected').removeClass('fp-color');
                                                        $(document.querySelectorAll('[data-quality="'+quality+'"]')).addClass('fp-selected').addClass('fp-color');
                                                        api.seek(time);
                                                    }, 400);
                                                });
                                            });

                                            document.getElementById("fp-qual-button").addEventListener("click", function(event) {
                                                $(document.getElementsByClassName('fp-qsel-menu')[0]).toggleClass('fp-active');
                                            });
                                        }
                                    });
                                    
                                }

                                var header = u('.fp-header');
                                    header.prepend('<div class="fp-volume-bar"></div>');
                                var selects = document.querySelector('#tabs');                                
                                if (!webOS&&!pl) {
                                // if (!(webOS||television())&&!pl) {
                                    pl = true;

                                    // var vast = api.conf.clip.ads;
                                    //
                                    // // Если адблок включен или
                                    // // Реклама на сайте выключена или не указана ставка или
                                    // // Гео не Россия или Москва или Санкт-Петербург или
                                    // // Сайт kino-fs.pro
                                    // // Обрабатываем всё как раньше через VAST
                                    // // Иначе передаём управление рекламе через VPAID
                                    // if (
                                    //     typeof adblock === "undefined" ||
                                    //     typeof vast === "undefined" || typeof vast.ads.preroll !== "string" ||
                                    //     vast == '' || vast == null ||
                                    //     country_code != 'ru' || city_name == 'moscow' || city_name == 'st petersburg' ||
                                    //     (new RegExp(/kino\-fs\.pro/g)).test(domain) === true
                                    // ) {
                                        var AdvPlayerHDVB = new AdvPlayer ( api );
									// } else {
                                     //    var VpaidAd_fun = new VpaidAd(
                                     //        // 'https://v.kost.tv/v/6QQC3bY47ZVSU7Sb9mdPLk9NjIckfYW7JIeO7ySKQ_o',
                                     //        'https://utraff.com/vpaid/9_Q7AjRi3Nr4C1feiXbu_PeontAYXDH8b4ahCEPT39Q.xml',
                                     //        cookie_name,
                                     //        api
                                     //    );
									// }
								}
                            });
                        }

                        var mobile = null === navigator.userAgent.match(/MZ-|MiuiBrowser|XiaoMi|MEIZU|MZBrowser|UCBrowser|Fly|Redmi|LG-F320/i);
                        var chromeVersion = navigator.userAgent.match(/Chrome\/([0-9]+)\./i) || undefined;
                            chromeVersion = chromeVersion !== undefined && chromeVersion !== null ? parseInt(chromeVersion[1]) <= 25 : false;

                        var isMac = navigator.platform.toUpperCase().indexOf('MAC')>=0;

                        var tv = g() || Y || isMac || K;
                        var brows = 'safari' == ee || 
                                    'chrome' == ee || 
                                    'yandex browser' == ee || 
                                    'opera' == ee || 
                                    'firefox' == ee || 
                                    'internet explorer' == ee || 
                                    'microsoft edge' == ee;
                        if (tv) {
                            flow();
                        } else if (mobile || (flowplayer.support.firstframe || Q || brows)) {
                            flow();
                        } else P();
                    }
                }, this.applyMobileSet = function() {
                    // console.log('check mobile')
                }, this.applyTabletSet = function() {
                    // console.log('check tablet')
                }, this.applyDesktopSet = function() {
                    // console.log('check desktop')
                }, this.init = function() {
                    q.setEventListeners()
                }, this.isInitMobile = !1, this.isInitTablet = !1, this.isInitDesktop = !1, this.deviceType = null, this.DOM = {
                    $window: null,
                    $body: null,
                    $document: null
                }
            }
            return x(A, null, [{
                key: 'returnDeviceType',
                value: function() {
                    return window.getComputedStyle(document.querySelector('body'), '::before').getPropertyValue('content').replace(/'/g, '').replace(/"/g, '')
                }
            }]), A
        }();
        r.default = L
    }).call(r, d(0))
}, function(o, r, d) {
    ! function(u, c, f) {
        'undefined' != typeof o && o.exports ? o.exports = f() : d(9)(c, f)
    }(this, 'bowser', function() {
        function u(k) {
            function C(Z) {
                var ee = k.match(Z);
                return ee && 1 < ee.length && ee[1] || ''
            }

            function S(Z) {
                var ee = k.match(Z);
                return ee && 1 < ee.length && ee[2] || ''
            }
            var Q, D = C(/(ipod|iphone|ipad)/i).toLowerCase(),
                E = /like android/i.test(k),
                L = !E && /android/i.test(k),
                A = /nexus\s*[0-6]\s*/i.test(k),
                q = !A && /nexus\s*[0-9]+/i.test(k),
                P = /CrOS/.test(k),
                O = /silk/i.test(k),
                H = /sailfish/i.test(k),
                M = /tizen/i.test(k),
                I = /(web|hpw)os/i.test(k),
                B = /windows phone/i.test(k),
                W = /SamsungBrowser/i.test(k),
                R = !B && /windows/i.test(k),
                F = !D && !O && /macintosh/i.test(k),
                z = !L && !H && !M && !I && /linux/i.test(k),
                U = S(/edg([ea]|ios)\/(\d+(\.\d+)?)/i),
                X = C(/version\/(\d+(\.\d+)?)/i),
                V = /tablet/i.test(k) && !/tablet pc/i.test(k),
                Y = !V && /[^-]mobi/i.test(k),
                G = /xbox/i.test(k);
            /opera/i.test(k) ? Q = {
                name: 'Opera',
                opera: x,
                version: X || C(/(?:opera|opr|opios)[\s\/](\d+(\.\d+)?)/i)
            } : /opr\/|opios/i.test(k) ? Q = {
                name: 'Opera',
                opera: x,
                version: C(/(?:opr|opios)[\s\/](\d+(\.\d+)?)/i) || X
            } : /SamsungBrowser/i.test(k) ? Q = {
                name: 'Samsung Internet for Android',
                samsungBrowser: x,
                version: X || C(/(?:SamsungBrowser)[\s\/](\d+(\.\d+)?)/i)
            } : /coast/i.test(k) ? Q = {
                name: 'Opera Coast',
                coast: x,
                version: X || C(/(?:coast)[\s\/](\d+(\.\d+)?)/i)
            } : /yabrowser/i.test(k) ? Q = {
                name: 'Yandex Browser',
                yandexbrowser: x,
                version: X || C(/(?:yabrowser)[\s\/](\d+(\.\d+)?)/i)
            } : /ucbrowser/i.test(k) ? Q = {
                name: 'UC Browser',
                ucbrowser: x,
                version: C(/(?:ucbrowser)[\s\/](\d+(?:\.\d+)+)/i)
            } : /mxios/i.test(k) ? Q = {
                name: 'Maxthon',
                maxthon: x,
                version: C(/(?:mxios)[\s\/](\d+(?:\.\d+)+)/i)
            } : /epiphany/i.test(k) ? Q = {
                name: 'Epiphany',
                epiphany: x,
                version: C(/(?:epiphany)[\s\/](\d+(?:\.\d+)+)/i)
            } : /puffin/i.test(k) ? Q = {
                name: 'Puffin',
                puffin: x,
                version: C(/(?:puffin)[\s\/](\d+(?:\.\d+)?)/i)
            } : /sleipnir/i.test(k) ? Q = {
                name: 'Sleipnir',
                sleipnir: x,
                version: C(/(?:sleipnir)[\s\/](\d+(?:\.\d+)+)/i)
            } : /k-meleon/i.test(k) ? Q = {
                name: 'K-Meleon',
                kMeleon: x,
                version: C(/(?:k-meleon)[\s\/](\d+(?:\.\d+)+)/i)
            } : B ? (Q = {
                name: 'Windows Phone',
                osname: 'Windows Phone',
                windowsphone: x
            }, U ? (Q.msedge = x, Q.version = U) : (Q.msie = x, Q.version = C(/iemobile\/(\d+(\.\d+)?)/i))) : /msie|trident/i.test(k) ? Q = {
                name: 'Internet Explorer',
                msie: x,
                version: C(/(?:msie |rv:)(\d+(\.\d+)?)/i)
            } : P ? Q = {
                name: 'Chrome',
                osname: 'Chrome OS',
                chromeos: x,
                chromeBook: x,
                chrome: x,
                version: C(/(?:chrome|crios|crmo)\/(\d+(\.\d+)?)/i)
            } : /edg([ea]|ios)/i.test(k) ? Q = {
                name: 'Microsoft Edge',
                msedge: x,
                version: U
            } : /vivaldi/i.test(k) ? Q = {
                name: 'Vivaldi',
                vivaldi: x,
                version: C(/vivaldi\/(\d+(\.\d+)?)/i) || X
            } : H ? Q = {
                name: 'Sailfish',
                osname: 'Sailfish OS',
                sailfish: x,
                version: C(/sailfish\s?browser\/(\d+(\.\d+)?)/i)
            } : /seamonkey\//i.test(k) ? Q = {
                name: 'SeaMonkey',
                seamonkey: x,
                version: C(/seamonkey\/(\d+(\.\d+)?)/i)
            } : /firefox|iceweasel|fxios/i.test(k) ? (Q = {
                name: 'Firefox',
                firefox: x,
                version: C(/(?:firefox|iceweasel|fxios)[ \/](\d+(\.\d+)?)/i)
            }, /\((mobile|tablet);[^\)]*rv:[\d\.]+\)/i.test(k) && (Q.firefoxos = x, Q.osname = 'Firefox OS')) : O ? Q = {
                name: 'Amazon Silk',
                silk: x,
                version: C(/silk\/(\d+(\.\d+)?)/i)
            } : /phantom/i.test(k) ? Q = {
                name: 'PhantomJS',
                phantom: x,
                version: C(/phantomjs\/(\d+(\.\d+)?)/i)
            } : /slimerjs/i.test(k) ? Q = {
                name: 'SlimerJS',
                slimer: x,
                version: C(/slimerjs\/(\d+(\.\d+)?)/i)
            } : /blackberry|\bbb\d+/i.test(k) || /rim\stablet/i.test(k) ? Q = {
                name: 'BlackBerry',
                osname: 'BlackBerry OS',
                blackberry: x,
                version: X || C(/blackberry[\d]+\/(\d+(\.\d+)?)/i)
            } : I ? (Q = {
                name: 'WebOS',
                osname: 'WebOS',
                webos: x,
                version: X || C(/w(?:eb)?osbrowser\/(\d+(\.\d+)?)/i)
            }, /touchpad\//i.test(k) && (Q.touchpad = x)) : /bada/i.test(k) ? Q = {
                name: 'Bada',
                osname: 'Bada',
                bada: x,
                version: C(/dolfin\/(\d+(\.\d+)?)/i)
            } : M ? Q = {
                name: 'Tizen',
                osname: 'Tizen',
                tizen: x,
                version: C(/(?:tizen\s?)?browser\/(\d+(\.\d+)?)/i) || X
            } : /qupzilla/i.test(k) ? Q = {
                name: 'QupZilla',
                qupzilla: x,
                version: C(/(?:qupzilla)[\s\/](\d+(?:\.\d+)+)/i) || X
            } : /chromium/i.test(k) ? Q = {
                name: 'Chromium',
                chromium: x,
                version: C(/(?:chromium)[\s\/](\d+(?:\.\d+)?)/i) || X
            } : /chrome|crios|crmo/i.test(k) ? Q = {
                name: 'Chrome',
                chrome: x,
                version: C(/(?:chrome|crios|crmo)\/(\d+(\.\d+)?)/i)
            } : L ? Q = {
                name: 'Android',
                version: X
            } : /safari|applewebkit/i.test(k) ? (Q = {
                name: 'Safari',
                safari: x
            }, X && (Q.version = X)) : D ? (Q = {
                name: 'iphone' == D ? 'iPhone' : 'ipad' == D ? 'iPad' : 'iPod'
            }, X && (Q.version = X)) : /googlebot/i.test(k) ? Q = {
                name: 'Googlebot',
                googlebot: x,
                version: C(/googlebot\/(\d+(\.\d+))/i) || X
            } : Q = {
                name: C(/^(.*)\/(.*) /),
                version: S(/^(.*)\/(.*) /)
            }, !Q.msedge && /(apple)?webkit/i.test(k) ? (/(apple)?webkit\/537\.36/i.test(k) ? (Q.name = Q.name || 'Blink', Q.blink = x) : (Q.name = Q.name || 'Webkit', Q.webkit = x), !Q.version && X && (Q.version = X)) : !Q.opera && /gecko\//i.test(k) && (Q.name = Q.name || 'Gecko', Q.gecko = x, Q.version = Q.version || C(/gecko\/(\d+(\.\d+)?)/i)), !Q.windowsphone && (L || Q.silk) ? (Q.android = x, Q.osname = 'Android') : !Q.windowsphone && D ? (Q[D] = x, Q.ios = x, Q.osname = 'iOS') : F ? (Q.mac = x, Q.osname = 'macOS') : G ? (Q.xbox = x, Q.osname = 'Xbox') : R ? (Q.windows = x, Q.osname = 'Windows') : z && (Q.linux = x, Q.osname = 'Linux');
            var K = '';
            Q.windows ? K = function(Z) {
                return 'NT' === Z ? 'NT' : 'XP' === Z ? 'XP' : 'NT 5.0' === Z ? '2000' : 'NT 5.1' === Z ? 'XP' : 'NT 5.2' === Z ? '2003' : 'NT 6.0' === Z ? 'Vista' : 'NT 6.1' === Z ? '7' : 'NT 6.2' === Z ? '8' : 'NT 6.3' === Z ? '8.1' : 'NT 10.0' === Z ? '10' : void 0
            }(C(/Windows ((NT|XP)( \d\d?.\d)?)/i)) : Q.windowsphone ? K = C(/windows phone (?:os)?\s?(\d+(\.\d+)*)/i) : Q.mac ? (K = C(/Mac OS X (\d+([_\.\s]\d+)*)/i), K = K.replace(/[_\s]/g, '.')) : D ? (K = C(/os (\d+([_\s]\d+)*) like mac os x/i), K = K.replace(/[_\s]/g, '.')) : L ? K = C(/android[ \/-](\d+(\.\d+)*)/i) : Q.webos ? K = C(/(?:web|hpw)os\/(\d+(\.\d+)*)/i) : Q.blackberry ? K = C(/rim\stablet\sos\s(\d+(\.\d+)*)/i) : Q.bada ? K = C(/bada\/(\d+(\.\d+)*)/i) : Q.tizen && (K = C(/tizen[\/\s](\d+(\.\d+)*)/i)), K && (Q.osversion = K);
            var J = !Q.windows && K.split('.')[0];
            return V || q || 'ipad' == D || L && (3 == J || 4 <= J && !Y) || Q.silk ? Q.tablet = x : (Y || 'iphone' == D || 'ipod' == D || L || A || Q.blackberry || Q.webos || Q.bada) && (Q.mobile = x), Q.msedge || Q.msie && 10 <= Q.version || Q.yandexbrowser && 15 <= Q.version || Q.vivaldi && 1 <= Q.version || Q.chrome && 20 <= Q.version || Q.samsungBrowser && 4 <= Q.version || Q.firefox && 20 <= Q.version || Q.safari && 6 <= Q.version || Q.opera && 10 <= Q.version || Q.ios && Q.osversion && 6 <= Q.osversion.split('.')[0] || Q.blackberry && 10.1 <= Q.version || Q.chromium && 20 <= Q.version ? Q.a = x : Q.msie && 10 > Q.version || Q.chrome && 20 > Q.version || Q.firefox && 20 > Q.version || Q.safari && 6 > Q.version || Q.opera && 10 > Q.version || Q.ios && Q.osversion && 6 > Q.osversion.split('.')[0] || Q.chromium && 20 > Q.version ? Q.c = x : Q.x = x, Q
        }

        function c(k) {
            return k.split('.').length
        }

        function f(k, C) {
            var N, S = [];
            if (Array.prototype.map) return Array.prototype.map.call(k, C);
            for (N = 0; N < k.length; N++) S.push(C(k[N]));
            return S
        }

        function h(k) {
            for (var C = Math.max(c(k[0]), c(k[1])), S = f(k, function(N) {
                    var D = C - c(N);
                    return N += Array(D + 1).join('.0'), f(N.split('.'), function(E) {
                        return Array(20 - E.length).join('0') + E
                    }).reverse()
                }); 0 <= --C;) {
                if (S[0][C] > S[1][C]) return 1;
                if (S[0][C] !== S[1][C]) return -1;
                if (0 === C) return 0
            }
        }

        function g(k, C, S) {
            var N = T;
            'string' == typeof C && (S = C, C = void 0), void 0 === C && (C = !1), S && (N = u(S));
            var D = '' + N.version;
            for (var E in k)
                if (k.hasOwnProperty(E) && N[E]) {
                    if ('string' != typeof k[E]) throw new Error('Browser version in the minVersion map should be a string: ' + E + ': ' + (k + ''));
                    return 0 > h([D, k[E]])
                }
            return C
        }
        var x = !0,
            T = u('undefined' == typeof navigator ? '' : navigator.userAgent || '');
        return T.test = function(k) {
            for (var S, C = 0; C < k.length; ++C)
                if (S = k[C], 'string' == typeof S && S in T) return !0;
            return !1
        }, T.isUnsupportedBrowser = g, T.compareVersions = h, T.check = function(k, C, S) {
            return !g(k, C, S)
        }, T._detect = u, T.detect = u, T
    })
}, function(o) {
    o.exports = function() {
        throw new Error('define cannot be used indirect')
    }
}]);


