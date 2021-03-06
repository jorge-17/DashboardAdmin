/*
* Permit.js
* @version		0.3
* @copyright	Tarek Anandan (http://www.technotarek.com)
*/
;(function($, window, document, undefined) {

    $.permit = function(options){
        var cPrefix = 'permit_';
        var settings = $.extend( {}, $.permit.defaults, options );

        // hide default permitted content
        $('.permit-all, .permit-force').hide();
        // hide user specified permitted content
        $.each($(settings.permits), function(index, value) {
            $('.permit-'+value).hide();
        });

        $.each($(settings.permits), function(index, value) {

            // Iterate through user specified permits to show permitted content
            if($.cookie(cPrefix+settings.permits[index]))
            {
                // hide all permit content except selected permits
                for(var i=0;i<settings.permits.length;i++)
                {
                    if(i!=index)
                    {
                        $('.permit-'+value).hide();
                    }
                }
                // show permitted content
                $('.permit-'+value).show();
            }

            // Create custom permit issuing triggers
            var triggerEvent = ($('.permit-issue-'+value).data('permit-trigger') ? $('.permit-issue-'+value).data('permit-trigger') : 'click');
            $('.permit-issue-'+value).on(triggerEvent,function() {
                var destination = $(this).data('permit-destination');
                revokeAllPermits(settings.permits);
                $.permit.issuePermit(value,destination);
            });

            // Create custom permit revoking triggers
            var triggerEvent = ($('.permit-revoke-'+value).data('permit-trigger') ? $('.permit-revoke-'+value).data('permit-trigger') : 'click');
            $('.permit-revoke-'+value).on(triggerEvent,function() {
                var destination = $(this).data('permit-destination');
                var newPermit = $(this).data('permit-new');
                $.permit.revokePermit(value,newPermit,destination);
            });

        });

        // check to see if any permits exist, if not...
        if(permitExists()<1){
            // show public content
            $('.permit-none').show();
            // show forced message content based on data-permit-message attribute
            $('.permit-force').each(function() {
                var message = $(this).data('permit-message');
                $(this).html(message).show();
            });
        }else{
            // if any permit exists, hide permit-less state content
            $('.permit-none').hide();
            // if any permit exists, show globally permitted state content
            $('.permit-all').show();
        }

        buildPermitAgent(settings.permits);

        // ************ PUBLIC FUNCTIONS ************** //

        // This function issues new permits
        $.permit.issuePermit = function (permit,destination) {
            // create the permit, give it a value of 1
            $.cookie(cPrefix+permit, 1);
            director(destination);
        };

        // This function revokes a specific permit
        $.permit.revokePermit = function (permit,newPermit,destination){
            $.removeCookie(cPrefix+permit);
            // if a new permit type is specified, issue that
            if(newPermit){
                $.permit.issuePermit(newPermit);
            }
            director(destination);
        };

        // ******** PRIVATE FUNCTIONS *********** //

        // This function handles all reloads/redirects after permits are issued or revoked
        function director(destination){
            if(destination){
                window.location.href = destination;
            }else{
                window.location.reload();
            }
        }

        // This function checks to see if any permits exist
        function permitExists(permit){
            // if no parameter is passed to the function, set the parameter equal to the permits setting object
            permit = typeof permit !== 'undefined' ? permit : settings.permits;
            var i = 0;
            $.each($(settings.permits), function(index, value) {
                if($.cookie(cPrefix+settings.permits[index]))
                {
                    i++;
                }
            });
            return i;
        }

        // This function builds the dynamic permit issuing agent to help issue new permits
        function buildPermitAgent(permits){
            var a = '<select id="permit-options" class="form-control input-sm">';
            $.each($(permits), function(index, value) {
                a += '<option value="'+value+'">'+value+'</option>';
            });
            a += '</select>';
            $('#permit-agent').html(a);
        }

        // This function revokes all permits
        function revokeAllPermits(permits){
            $.each($(permits), function(index, value) {
                $.removeCookie(cPrefix+value);
            });
        };

        // Issue new permit via Agent
        $('.permit-reissue').on('click',function(){

            // remove all existing permits
            revokeAllPermits(settings.permits);
            // determine selected permit
            var permit = $('#permit-options').val();
            // issue new permit
            $.permit.issuePermit(permit);

        });

        // Revoke all permits and redirect
        $('.permit-revoke-all').on('click',function()
        {
            var destination = $(this).data('permit-destination');
            revokeAllPermits(settings.permits);
            director(destination);
        });

    };

    $.permit.defaults = {
        permits: ['Admin'], // value: array permit levels, default to admin; sets the available permission levels
        reissueDestination: 'reload'
    };

})(jQuery, window, document );