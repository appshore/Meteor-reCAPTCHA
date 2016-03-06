# Google reCAPTCHA V2 for Meteor

This package implements the version 2 of Google reCAPTCHA. This is a fork of the packages [Altapp/Meteor-reCAPTCHA](https://github.com/Altapp/Meteor-reCAPTCHA) which implements Google reCAPTCHA version 1 and package [yuea/Meteor-reCAPTCHA](https://github.com/yuea/Meteor-reCAPTCHA) for version 2.

Google reCAPTCHA is a free CAPTCHA service that protects your site against spam, malicious registrations and other forms of attacks where computers try to disguise themselves as a human. In addition to protecting your site, reCAPTCHA also helps digitize old books and newspapers.

Google reCAPTCHA documentation is available at https://developers.google.com/recaptcha

You will need to sign up for an API key at https://www.google.com/recaptcha/admin

## Installation

``` sh
$ meteor add appshore:recaptcha
```

## Setup

###On The Client

Add your reCAPTCHA public key (from Google) to the package. Do this in client-side code. Config values listed below are package defaults

``` javascript
Meteor.startup(function() {
    reCAPTCHA.config({
        sitekey: 'your_public_site_key_from_google', //REQUIRED
        theme: 'light', //OPTIONAL. <light|dark> Specifies the color theme of the widget
        type: 'image', //OPTIONAL. <audio|image> Specifies the type of captcha to serve
        size: 'normal', //OPTIONAL. <normal|compact> Specifies the type of captcha to serve
        callback: function(val) {}, //OPTIONAL. The name of your callback function to be executed when the user submits a successful CAPTCHA response. The user's response, g-recaptcha-response, will be the input for your callback function.
        tabindex: 0, //OPTIONAL. The tabindex of the widget and challenge. If other elements in your page use tabindex, it should be set to make user navigation easier.
        "expired-callback": function() {} //OPTIONAL. The name of your callback function to be executed when the recaptcha response expires and the user needs to solve a new CAPTCHA.
    });
});
```

[Official documentation](https://developers.google.com/recaptcha/docs/display#render_param)

###On The Server

Add your reCAPTCHA private key (from Google) to the package. Do this in server-only code (not just an 'isServer' block) to keep your key secret.

``` javascript
Meteor.startup(function() {
    reCAPTCHA.config({
        privatekey: 'your_private_key_from_google'
    });
});
```

## Usage

###On The Client

Include the `{{> reCAPTCHA}}` template block in your form template.

``` html
<template name="myTemplate">
    <form>
    	<!-- your form fields... -->

    	{{> reCAPTCHA}}

    	<button type="submit">Submit</button>
    </form>
</template>
```

Add an id parameter to the `{{> reCAPTCHA}}` template block to display more than one captcha.

``` html
<template name="myTemplate">
    <form>
        <!-- no need of id for the first one -->
    	{{> reCAPTCHA}}

    	<button type="submit">Submit</button>
    </form>

    <form>
        {{> reCAPTCHA id='captcha2'}}

        <button type="submit">Submit 2</button>
    </form>
</template>
```

In your submit event, include the reCAPTCHA data in your method call.

``` javascript
Template.myTemplate.events({
    'submit form': function(evt) {
        evt.preventDefault();


        //console.log('g-recaptcha-response', $('#g-recaptcha-response').val(), evt);

        var formData = {
            //get the data from your form fields
            ...

            // and the recaptcha response
            g-recaptcha-response : $('#g-recaptcha-response').val()
        };

        Meteor.call('formSubmissionMethod', formData, function (error, result) {
            // recaptcha server response will be in result
            console.log('result: ', error, result);
        });
    }
});
```

###On The Server

In the server method, pass the captcha data and the user's IP address to `reCAPTCHA.verifyCaptcha(clientIP, captchaData)` to verify that the user entered the correct text.

``` javascript
Meteor.methods({
    formSubmissionMethod: function(formData) {

        var verifyCaptchaResponse = reCAPTCHA.verifyCaptcha(this.connection.clientAddress, formData.g-recaptcha-response);

        //console.log('reCAPTCHA response', verifyCaptchaResponse.data);
        /* verifyCaptchaResponse.data returns a json {
                'success': true|false,
                'error-codes': an-error-code
            };
            // check at https://developers.google.com/recaptcha/docs/verify
        */

        if( verifyCaptchaResponse.data.success === false ){
            return verifyCaptchaResponse.data;
        }

        //do stuff with your formData

        return true;
    }
});
```
