/* 
 * Plugin: ageCheck.js
 * Description: A simple plugin to verify user's age. Uses sessionStorage API to store if user is verified - only kept until browser is closed.
 * Options can be passed for easy customization. 
 * Author: Michael Soriano
 * Author's website: http://fearlessflyer.com*
 * 
 */
(function ($){   
    
    $.ageCheck = function(options) {
        
        var settings = $.extend({
            minAge : 21,          
            redirectTo : '', 
            title : 'Age Verification', 
            copy : 'This Website requires you to be [21] years or older to enter. Please enter your Date of Birth in the fields below in order to continue:'
        }, options);
        
        
        var _this = {
            month : '',  
            day : '',  
            year : '',   
            age : '',
            errors : Array(), 
            setValues : function(){
                var month = $('.month').val();
                var day = $('.day').val()
                _this.month = month; 
                _this.day = day.replace(/^0+/, ''); //remove leading zero
                _this.year = $('.year').val();
            },
            validate : function(){
                _this.errors = [];
                if (/^([0-9]|[12]\d|3[0-1])$/.test(_this.day) === false) {
                    _this.errors.push('Day is invalid or empty');
                };
                if (/^(19|20)\d{2}$/.test(_this.year) === false) {
                    _this.errors.push('Year is invalid or empty');
                };
                _this.clearErrors();
                _this.displayErrors();
                return _this.errors.length < 1;
            }, 
            clearErrors : function(){         
                $('.errors').html('');
            }, 
            displayErrors : function(){
                var html = '<ul>';
                for (var i = 0; i < _this.errors.length; i++) {
                    html += '<li><span>x</span>' + _this.errors[i] + '</li>';
                }
                html += '</ul>';
                setTimeout(function(){$('.errors').html(html)},200);
            },
            reCenter : function (b){
                b.css("top", Math.max(0, (($(window).height() - (b.outerHeight() + 150)) / 2) + 
                                            $(window).scrollTop()) + "px");
                b.css("left", Math.max(0, (($(window).width() - b.outerWidth()) / 2) + 
                                            $(window).scrollLeft()) + "px");
            }, 
            buildHtml : function(){
            
                var copy = settings.copy; 
                var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
                var html = '';
                html += '<div class="ac-overlay"></div>';
                html += '<div class="ac-container">';
                html += '<h2>' + settings.title + '</h2>';
                html += '<p>' + copy.replace('[21]','<strong>'+settings.minAge+'</strong>'); + '</p>';
                html += '<div class="errors"></div>';
                html += '<div class="fields"><select class="month">';
                for(var i=0;i<months.length;i++){
                    html += '<option value="'+i+'">'+months[i]+'</option>'
                }
                html += '</select>';
                html += '<input class="day" maxlength="2" placeholder="01" />';
                html += '<input class="year" maxlength="4" placeholder="1989"/>';
                html += '<button>Submit</button></div></div>';
                
                $('body').append(html);
                
                $('.ac-overlay').animate({
                    opacity: 0.8
                }, 500, function() {
                    _this.reCenter($('.ac-container'));
                    $('.ac-container').css({opacity: 1})
                });
            }, 
            setAge : function(){
                _this.age = '';                 
                var birthday = new Date(_this.year, _this.month, _this.day);  
                var ageDifMs = Date.now() - birthday.getTime();
                var ageDate = new Date(ageDifMs); // miliseconds from epoch
                _this.age = Math.abs(ageDate.getUTCFullYear() - 1970);
            }, 
            setSessionStorage  : function(key, val){
                try {
                    sessionStorage.setItem(key,val);
                    return true;
                } catch (e) {
                    return false;
                }
            },
            handleSuccess : function(){                
                var successMsg = '<h3>Success!</h3><p>You are now being redirected back to the application...</p>';
                $('.ac-container').html(successMsg);
                setTimeout(function(){
                    $('.ac-container').animate({'top':'-350px'},200, function(){
                         $('.ac-overlay').animate({'opacity':'0'},500, function(){
                            if (settings.redirectTo != '') {
                                window.location.replace(settings.redirectTo);
                            }else{
                                $('.ac-overlay, .ac-container').remove();
                            }
                         });
                    });
                },2000);
            }
            
        }; //end _this
         
        if(sessionStorage.getItem("ageVerified") == "true"){
            return false;
        }
        
        _this.buildHtml();  
        
        $('.ac-container button').on('click', function(){
            _this.setValues();
            if (_this.validate() === true) {
                _this.setAge();
                
                if(_this.age >= settings.minAge){
                    if(!_this.setSessionStorage("ageVerified", "true")){
                        console.log('sessionStorage not supported by your browser');
                    };
                    _this.handleSuccess();
                }else{
                    _this.errors.push('You are not old enough');
                    _this.displayErrors();
                }
            }
        });
        
        $(window).resize(function() {
            _this.reCenter($('.ac-container'));
            setTimeout(function() {
                _this.reCenter($('.ac-container'));
            }, 500);
        });
    };
}(jQuery));