reCAPTCHA = {
    settings: {},
    
    config: function(settings) {
        return _.extend(this.settings, settings);
    },
}


window.onloadcaptcha = function() { 
	$( "#recaptcha-container" ).empty();
	grecaptcha.render('recaptcha-container', {
        	sitekey: reCAPTCHA.settings.publickey,
            theme: reCAPTCHA.settings.theme,
            callback: function () {
            return;
        }
    });
};

Template.reCAPTCHA.rendered = function() {
    $.getScript('//www.google.com/recaptcha/api.js?onload=onloadcaptcha&render=explicit');
}
