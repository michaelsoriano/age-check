# age-check

A simple plugin that verifies if a user is old enough to enter your site.

You can easily customize the plugin with options and it uses sessionStorage
(or localStorage or cookies) to keep from popping up again.

The modal box is responsive and uses an external CSS for easy styling.

## Usage

Add inside document ready: $.ageCheck()

## Options

- minAge (Age to validate against)
- redirectTo (URL to redirect when successful)
- title (Title text above the prompt)
- copy (Paragraph text below the title)
- success (Callback to be called on successful validation, takes no arguments)
- successMsg {header (Header on top of success message), body (text for success message)}
- underAgeMsg (Message when user didn't pass age requirements)
- underAge (Callback to be called on failed validation, takes no arguments)
- errorMsg {invalidDay (message for invalid day entered), invalidYear (message for invalid year entered)}
- storage (sessionStorage, localStorage, or cookie -- sessionStorage is the default)
- storageExpires (number of days to store the cookie, ONLY VALID for cookie storage method)

## To Minify JS + CSS

- npm install gulp
- npm install gulp-minify --save-dev
- npm install gulp-clean-css --save-dev
- npm install gulp-rename --save-dev
- run gulp compress

![alt tag](http://cdn.fearlessflyer.com/wp-content/uploads/2015/03/age-check-demo.gif)

Click http://michaelsoriano.com/jquery-plugin-check-user-age/ for instructions and options

and

Click https://cdn.rawgit.com/michaelsoriano/age-check/master/index.html for demo

