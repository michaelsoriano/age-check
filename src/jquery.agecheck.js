/*
 * Plugin: ageCheck.js
 * Description: A simple plugin to verify user's age.
 * Uses sessionStorage/localStorage API to store if user is verified.
 * Options can be passed for easy customization.
 * Author: Michael Soriano
 * Author's website: http://michaelsoriano.com
 *
 */

(function ($) {
  $.ageCheck = function (options) {
    const settings = $.extend({
      minAge: 21,
      redirectTo: '',
      redirectOnFail: '',
      title: 'Age Verification',
      copy: 'This Website requires you to be [21] years or older to enter. Please enter your Date of Birth in the fields below in order to continue:',
      success: null,
      successMsg: {
        header: 'Success!',
        body: 'You are now being redirected back to the application...'
      },
      underAgeMsg: 'Sorry, you are not old enough to view this site...',
      underAge: null,
      errorMsg: {
        invalidDay: 'Day is invalid or empty',
        invalidYear: 'Year is invalid or empty'
      },
      storage: 'sessionStorage',
      storageExpires: null,
    }, options);

    var storage = window[settings.storage];

    const _this = {
      month: '',
      day: '',
      year: '',
      age: '',
      errors: [],
      setValues() {
        const month = $('.ac-container .month').val();
        const day = $('.ac-container .day').val();
        _this.month = month;
        _this.day = day.replace(/^0+/, ''); // remove leading zero
        _this.year = $('.ac-container .year').val();
      },
      validate() {
        _this.errors = [];
        if (/^([0-9]|[12]\d|3[0-1])$/.test(_this.day) === false) {
          _this.errors.push(settings.errorMsg.invalidDay);
        }
        if (/^(19|20)\d{2}$/.test(_this.year) === false) {
          _this.errors.push(settings.errorMsg.invalidYear);
        }
        _this.clearErrors();
        _this.displayErrors();
        return _this.errors.length < 1;
      },
      clearErrors() {
        $('.errors').html('');
      },
      displayErrors() {
        let html = '<ul>';
        for (let i = 0; i < _this.errors.length; i++) {
          html += `<li><span>x</span>${_this.errors[i]}</li>`;
        }
        html += '</ul>';
        setTimeout(() => {
          $('.ac-container .errors').html(html);
        }, 200);
      },
      reCenter(b) {
        b.css('top', `${Math.max(0, (($(window).height() - (b.outerHeight() + 150)) / 2))}px`);
        b.css('left', `${Math.max(0, (($(window).width() - b.outerWidth()) / 2))}px`);
      },
      buildHtml() {
        const copy = settings.copy;
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        let html = '';
        html += '<div class="ac-overlay"></div>';
        html += '<div class="ac-container">';
        html += `<h2>${settings.title}</h2>`;
        html += `<p>${copy.replace('[21]', `<strong>${settings.minAge}</strong>`)}` + '</p>';
        html += '<div class="errors"></div>';
        html += '<div class="fields"><select class="month">';
        for (let i = 0; i < months.length; i++) {
          html += `<option value="${i}">${months[i]}</option>`;
        }
        html += '</select>';
        html += '<input class="day" maxlength="2" placeholder="01" />';
        html += '<input class="year" maxlength="4" placeholder="1989"/>';
        html += '<button>Submit</button></div></div>';

        $('body').append(html);

        $('.ac-overlay').animate({
          opacity: 0.8,
        }, 500, () => {
          _this.reCenter($('.ac-container'));
          $('.ac-container').css({
            opacity: 1,
          });
        });

        $('.ac-container .day, .ac-container .year').focus(function () {
          $(this).removeAttr('placeholder');
        });
      },
      setAge() {
        _this.age = '';
        const birthday = new Date(_this.year, _this.month, _this.day);
        const ageDifMs = Date.now() - birthday.getTime();
        const ageDate = new Date(ageDifMs); // miliseconds from epoch
        _this.age = Math.abs(ageDate.getUTCFullYear() - 1970);
      },
      getStorage() {
        if(settings.storage === 'cookie') {
          return document.cookie.split(';').filter((item) => item.trim().startsWith('ageVerified=')).length;
        } else {
          return storage.getItem('ageVerified') === 'true';
        }
      },
      setStorage(key, val, expires) {
        try {
          if(settings.storage === 'cookie') {
            if(expires) {
              let date = new Date();
              date.setTime(date.getTime() + (expires * 24 * 60 * 60 * 1000));
              expires = date.toGMTString();
            }
            document.cookie = "ageVerified=true; expires=" + expires + ";";
          } else {
            storage.setItem(key, val);
          }
          return true;
        } catch (e) {
          return false;
        }
      },
      handleSuccess() {
        const successMsg = `<h3>${settings.successMsg.header}</h3><p>${settings.successMsg.body}</p>`;
        $('.ac-container').html(successMsg);
        setTimeout(() => {
          $('.ac-container').animate({
            top: '-350px',
          }, 200, () => {
            $('.ac-overlay').animate({
              opacity: '0',
            }, 500, () => {
              if (settings.redirectTo !== '') {
                window.location.replace(settings.redirectTo);
              } else {
                $('.ac-overlay, .ac-container').remove();
                if (settings.success) {
                  settings.success();
                }
              }
            });
          });
        }, 2000);
      },
      handleUnderAge() {
        const underAgeMsg = `<h3>${settings.underAgeMsg}</h3>`;
        $('.ac-container').html(underAgeMsg);
        if (settings.redirectOnFail !== '') {
          setTimeout(() => {
            window.location.replace(settings.redirectOnFail);
          }, 2000);
        }
        if (settings.underAge) {
          settings.underAge();
        }
      },
    }; // end _this

    if (_this.getStorage()) {
      return false;
    }

    _this.buildHtml();

    $('.ac-container button').on('click', () => {
      _this.setValues();
      if (_this.validate() === true) {
        _this.setAge();

        if (_this.age >= settings.minAge) {
          if (!_this.setStorage('ageVerified', 'true', settings.storageExpires)) {
            console.log(settings.storage + ' not supported by your browser');
          }
          _this.handleSuccess();
        } else {
          _this.handleUnderAge();
        }
      }
    });

    $(window).resize(() => {
      _this.reCenter($('.ac-container'));
      setTimeout(() => {
        _this.reCenter($('.ac-container'));
      }, 500);
    });
  };
}(jQuery));
