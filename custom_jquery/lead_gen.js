jQuery(document).ready(function($) {

            $("#cat1").click(function() {
                console.log("Handler for .cat1() called.");
            });
            window.schedule_index = "";
            window.timing_webinar = "";
            window.category = "";
            window.sub_text = {
                0: "Almost Full",
                1: "Filling Fast"
            };
            window.saveSlot = function(scheduleSlot, timing_webinar) {
                window.schedule_index = scheduleSlot;
                console.log(scheduleSlot);
                $('#timingSlot').text(timing_webinar);
                window.timing_webinar = timing_webinar;
            }

            window.saveCategory = function(category) {
                window.category = category;
                console.log(category);
            }
            // $ Works! You can test it with next line if you like
            $.ajax({

                url: 'https://webinarjam.herokuapp.com/schedule/webinars/DEFAULT/',
                type: 'GET',
                success: function(data) {
                    var buttonCSS = $('#getcss').attr('data-css');
                    var textCSSDiv = $('#getcssTextDiv').attr('data-css')
                    var textCSSP = $('#getcssTextP').attr('data-css')
                    var index;
                    for (index = 0; index < data.length; ++index) {
                        slot_htm = `<div class="thrv_wrapper thrv-button tve_ea_tl_state_switch" data-css="` + buttonCSS + `" data-tcb_hover_state_parent="" data-button-style="full_rounded"><a href="javascript:void(0);" onclick="javascript:saveSlot('` + data[index].schedule + `','` + data[index].date + `')" class="tcb-button-link tve_evt_manager_listen tve_et_click" data-tcb-events="__TCB_EVENT_[{&quot;config&quot;:{&quot;anim&quot;:&quot;instant&quot;,&quot;s&quot;:&quot;84&quot;},&quot;a&quot;:&quot;tl_state_switch&quot;,&quot;t&quot;:&quot;click&quot;}]_TNEVE_BCT__"><span class="tcb-button-texts"><span class="tcb-button-text thrv-inline-text" data-css="tve-u-165cb755d3b7fac">` + data[index].date + `</span></span></a></div>`
                        if (index < 2) {
                            slot_htm += `<div class="thrv_wrapper thrv_text_element" data-css="` + textCSSDiv + `"><p data-css="` + textCSSP + `" style="text-align: center;"><em>(` + window.sub_text[index] + `)</em></p></div>`
                        }
                        $("#slot").append(slot_htm)
                    };
                },
                error: function(request, error) {
                    console.log("Request: " + JSON.stringify(request));
                }
            });

            $("#submitLead").click(function(e) {
                    e.preventDefault();
                    var data = {
                        "first_name": $("#name_reg").val(),
                        "email": $("#email_reg").val(),
                        "phone": $("#phone_reg").val(),
                        "category": window.category,
                    }

                    $.ajax({
                        url: 'https://webinarjam.herokuapp.com/register/webinars/DEFAULT/jot/',
                        type: 'POST',
                        data: JSON.stringify(data),
											  dataType: 'json',
											  contentType: 'application/json',
                        success: function(data) {
                            console.log(data);
													  window.location.href = data.redirect_uri;
                        },
                        error: function(request, error) {
                            alert("Something went wrong,please try again");
                        },
                    });
			});
});
