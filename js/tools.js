$(document).ready(function() {

    $('body').on('click', '.window-link', function(e) {
        var curLink = $(this);
        if (curLink.data('title') == 'Y') {
            windowOpen(curLink.attr('href'), null, function() {
                $('.nd-window .nd-form-details-text').html($('title').text());
                $('.nd-window form').append('<textarea name="details" id="details" style="display:none"></textarea>');
                $('#details').val($('title').text());
            });
        } else if (typeof (curLink.data('text')) != 'undefined') {
            windowOpen(curLink.attr('href'), null, function() {
                $('.nd-window .nd-form-details-text').html(curLink.data('text'));
                $('.nd-window form').append('<textarea name="details" id="details" style="display:none"></textarea>');
                $('#details').val(curLink.data('text'));
            });
        } else if (typeof (curLink.data('tarif')) != 'undefined') {
            windowOpen(curLink.attr('href'), null, function() {
                var obj = curLink.data('tarif');
                var newHTML = '';
                var newText = '';
                for (var i = 0; i < obj.rows.length; i++) {
                    var curType = obj.rows[i].type;
                    var curTitle = obj.rows[i].title;
                    var curValue = obj.rows[i].value;
                    if (curType == '1') {
                        newHTML += '<div class="nd-form-details-list-row nd-form-details-list-row-2">';
                    } else if (curType == '2') {
                        newHTML += '<div class="nd-form-details-list-row nd-form-details-list-row-summ">';
                    } else {
                        newHTML += '<div class="nd-form-details-list-row">';
                    }
                    newHTML += '<div class="nd-form-details-prop">' + curTitle + '</div>';
                    newText += curTitle;
                    if (curValue != '') {
                        newHTML += '<div class="nd-form-details-value">' + curValue + '</div>';
                        newText += ':' + curValue;
                    }
                    newHTML += '</div>';
                    newText += '\n';
                }
                $('.nd-window .nd-form-details-list').html(newHTML);
                $('.nd-window form').append('<textarea name="details" id="details" style="display:none"></textarea>');
                $('#details').val(newText);
            });
        } else {
            windowOpen(curLink.attr('href'));
        }
        e.preventDefault();
    });

    $('body').on('keyup', function(e) {
        if (e.keyCode == 27) {
            windowClose();
        }
    });

    $(document).click(function(e) {
        if ($(e.target).hasClass('nd-window')) {
            windowClose();
        }
    });

    $(window).resize(function() {
        windowPosition();
    });

    $('body').on('click', '.nd-window-close, .nd-window-close-link', function(e) {
        windowClose();
        e.preventDefault();
    });

});

function initForm(curForm) {
    curForm.find('input, textarea').each(function() {
        var curField = $(this);
        if (curField.attr('placeholder')) {
            var curBlock = curField.parent();
            curBlock.prepend('<div class="nd-form-input-label">' + curField.attr('placeholder') + '</div>');
        }
    });

    curForm.find('input, textarea').on('keyup', function(e) {
        if ($(this).val() != '') {
            $(this).parent().addClass('nd-form-input-full');
        } else {
            $(this).parent().removeClass('nd-form-input-full');
        }
    });

    curForm.find('input, textarea').on('blur', function(e) {
        var curField = $(this);
        if (curField.val() == '') {
            curField.parent().removeClass('nd-form-input-full');
        }
        window.setTimeout(function() {
            if (curField.val() == '') {
                curField.parent().removeClass('nd-form-input-full');
            }
        }, 100);
    });

    curForm.find('input.maskPhone').mask('+7 (999) 999-99-99');

    curForm.find('.nd-form-input input.required').parent().addClass('required');
    curForm.find('.nd-form-input input:disabled, .nd-form-input textarea:disabled').parent().addClass('disabled');
    curForm.find('.nd-form-input input').attr('autocomplete', 'off');

    curForm.find('input.required, textarea.required').on('keyup blur change click', function() {
        var curField = $(this);
        var curForm = curField.parents().filter('form');
        if (!curField.hasClass('email') && !curField.hasClass('maskPhone') && !curField.hasClass('addressStreet') && !curField.hasClass('addressHome')) {
            if (curField.val() == '') {
                curField.removeClass('valid');
                curField.addClass('error');
                if (curField.parent().find('label').length == 0) {
                    curField.after('<label class="error"></label>');
                }
                if (curField.data('require-msg')) {
                    curField.parent().find('label').html(curField.data('require-msg'));
                }
            } else {
                curField.addClass('valid');
                curField.removeClass('error');
                curField.parent().find('label').remove();
            }
        } else if (curField.hasClass('email')) {
            if (curField.val() == '') {
                curField.removeClass('valid');
                curField.addClass('error');
                if (curField.parent().find('label').length == 0) {
                    curField.after('<label class="error"></label>');
                }
                if (curField.data('require-msg')) {
                    curField.parent().find('label').html(curField.data('require-msg'));
                }
            } else {
                if (/^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/.test(curField.val())) {
                    curField.addClass('valid');
                    curField.removeClass('error');
                    curField.parent().find('label').remove();
                } else {
                    curField.removeClass('valid');
                    curField.addClass('error');
                    if (curField.parent().find('label').length == 0) {
                        curField.after('<label class="error"></label>');
                    }
                    if (curField.data('require-msg')) {
                        curField.parent().find('label').html(curField.data('require-msg'));
                    }
                    if (curField.data('email-msg')) {
                        curField.parent().find('label').html(curField.data('email-msg'));
                    }
                }
            }
        } else if (curField.hasClass('maskPhone')) {
            if (curField.val() == '') {
                curField.removeClass('valid');
                curField.addClass('error');
                if (curField.parent().find('label').length == 0) {
                    curField.after('<label class="error"></label>');
                }
                if (curField.data('require-msg')) {
                    curField.parent().find('label').html(curField.data('require-msg'));
                }
            } else {
                if (/^\+7 \(\d{3}\) \d{3}\-\d{2}\-\d{2}$/.test(curField.val())) {
                    curField.addClass('valid');
                    curField.removeClass('error');
                    curField.parent().find('label').remove();
                } else {
                    curField.removeClass('valid');
                    curField.addClass('error');
                    if (curField.parent().find('label').length == 0) {
                        curField.after('<label class="error"></label>');
                    }
                    if (curField.data('require-msg')) {
                        curField.parent().find('label').html(curField.data('require-msg'));
                    }
                    if (curField.data('phone-msg')) {
                        curField.parent().find('label').html(curField.data('phone-msg'));
                    }
                }
            }
        }

        if (curForm.find('input.required:not(.valid), textarea.required:not(.valid)').length == 0) {
            curForm.find('.nd-form-submit .nd-btn').removeClass('disabled');
        } else {
            curForm.find('.nd-form-submit .nd-btn').addClass('disabled');
        }
    });

    curForm.on('submit', function(e) {
        var curForm = $(this);
        curForm.find('input.required:not(.valid):not(:disabled), textarea.required:not(.valid):not(:disabled)').each(function() {
            var curField = $(this);
            if (curField.val() == '') {
                curField.addClass('error');
                if (curField.parent().find('label').length == 0) {
                    curField.after('<label class="error"></label>');
                }
                if (curField.data('require-msg')) {
                    curField.parent().find('label').html(curField.data('require-msg'));
                }
            }
        });

        if (curForm.find('input.required:not(.valid), textarea.required:not(.valid)').length == 0) {
            if (curForm.hasClass('nd-window-form')) {
                windowOpen(curForm.attr('action'), curForm.serialize());
                e.preventDefault();
            }
        } else {
            e.preventDefault();
        }
    });

    curForm.find('input.addressStreet').on('blur', function(e) {
        var curField = $(this);
        if (curField.hasClass('required') && !curField.hasClass('valid')) {
            curField.addClass('error').removeClass('valid');
            if (curField.parent().find('label').length == 0) {
                curField.after('<label class="error"></label>');
            }
            if (curField.data('require-msg')) {
                curField.parent().find('label').html(curField.data('require-msg'));
            }
        }

        if (curForm.find('input.required:not(.valid), textarea.required:not(.valid)').length == 0) {
            curForm.find('.nd-form-submit .nd-btn').removeClass('disabled');
        } else {
            curForm.find('.nd-form-submit .nd-btn').addClass('disabled');
        }
        window.setTimeout(function() { curField.parent().find('.nd-form-input-list').remove()}, 500);
    });

    curForm.find('input.addressStreet').on('keydown', function(e) {
        switch(e.keyCode) {
            case 13:
                return false;
                break;
            default:
                break;
        }
    });

    curForm.find('input.addressStreet').on('keyup', function(e) {
        var curField = $(this);
        var curValue = curField.val();
        var curBlock = curField.parent();
        switch(e.keyCode) {
            case 27:
                curBlock.find('.nd-form-input-list').remove();
                curField.trigger('blur');
                break;

            case 38:
                if (curBlock.find('.nd-form-input-list').length > 0) {
                    var curIndex = curBlock.find('.nd-form-input-list li').index(curBlock.find('.nd-form-input-list li.active'));
                    curIndex--;
                    if (curIndex < 0) {
                        curIndex = curBlock.find('.nd-form-input-list li').length - 1;
                    }
                    curBlock.find('.nd-form-input-list li.active').removeClass('active');
                    curBlock.find('.nd-form-input-list li').eq(curIndex).addClass('active');
                    curField.val(curBlock.find('.nd-form-input-list li').eq(curIndex).text());
                    curForm.find('input.addressHome').val('');
                    curForm.find('input.addressHome').removeClass('valid');
                    curForm.find('input.addressHome').prop('disabled', true);
                    curForm.find('input.addressHome').parent().addClass('disabled');
                    curForm.find('input.required-address').prop('disabled', true);
                    curForm.find('input.required-address').parent().addClass('disabled');
                    curForm.find('.nd-form-submit .nd-btn').addClass('disabled');
                    curForm.find('.nd-form-connection-status-ok, .nd-form-connection-status-fail').hide();
                    curForm.find('.nd-form-connection-status-default').show();
                    curField.removeClass('error').addClass('valid');
                    curField.parent().find('label').remove();
                }
                break;

            case 40:
                if (curBlock.find('.nd-form-input-list').length > 0) {
                    var curIndex = curBlock.find('.nd-form-input-list li').index(curBlock.find('.nd-form-input-list li.active'));
                    curIndex++;
                    if (curIndex > curBlock.find('.nd-form-input-list li').length - 1) {
                        curIndex = 0;
                    }
                    curBlock.find('.nd-form-input-list li.active').removeClass('active');
                    curBlock.find('.nd-form-input-list li').eq(curIndex).addClass('active');
                    curField.val(curBlock.find('.nd-form-input-list li').eq(curIndex).text());
                    curForm.find('input.addressHome').val('');
                    curForm.find('input.addressHome').removeClass('valid');
                    curForm.find('input.addressHome').prop('disabled', true);
                    curForm.find('input.addressHome').parent().addClass('disabled');
                    curForm.find('input.required-address').prop('disabled', true);
                    curForm.find('input.required-address').parent().addClass('disabled');
                    curForm.find('.nd-form-submit .nd-btn').addClass('disabled');
                    curForm.find('.nd-form-connection-status-ok, .nd-form-connection-status-fail').hide();
                    curForm.find('.nd-form-connection-status-default').show();
                    curField.removeClass('error').addClass('valid');
                    curField.parent().find('label').remove();
                }
                break;

            case 35:
                break;

            case 36:
                break;

            case 37:
                break;

            case 39:
                break;

            case 13:
                curField.trigger('blur');
                if (curForm.find('.nd-form-input-list li.active').length > 0) {
                    curForm.find('input.addressHome').prop('disabled', false);
                    curForm.find('input.addressHome').parent().removeClass('disabled');
                    curForm.find('input.addressHome').trigger('focus');
                }
                break;

            default:
                curBlock.find('.nd-form-input-list li.active').removeClass('active');
                curField.removeClass('valid').addClass('error');
                if (curField.parent().find('label').length == 0) {
                    curField.after('<label class="error"></label>');
                }
                if (curField.data('require-msg')) {
                    curField.parent().find('label').html(curField.data('require-msg'));
                }
                curForm.find('input.addressHome').val('');
                curForm.find('input.addressHome').removeClass('valid');
                curForm.find('input.addressHome').prop('disabled', true);
                curForm.find('input.addressHome').parent().addClass('disabled');
                curForm.find('input.required-address').prop('disabled', true);
                curForm.find('input.required-address').parent().addClass('disabled');
                curForm.find('.nd-form-submit .nd-btn').addClass('disabled');
                curForm.find('.nd-form-connection-status-ok, .nd-form-connection-status-fail').hide();
                curForm.find('.nd-form-connection-status-default').show();
                if (curValue.length > 1) {
                    ymaps.suggest(`г. Москва, ${curValue}`, {
                        boundedBy: [[55.969188, 37.271944], [55.487158, 37.969576]]
                    }).then(function(items) {
                        var streets = items.map(el => el.value.replace(/Россия, Москва,?/, '').replace(/\w+,/ig, '').trim())
                            .filter(e => {
                                const reservedWords = [
                                    'метро',
                                    'река',
                                    'тоннель',
                                    ',',
                                    'сад',
                                    'больница',
                                    'Борисовский пруд',
                                ];
                                if (reservedWords.some((word) => ~e.indexOf(word))) return;
                                return (e.length < 45) && (e.length > 3)
                            });

                        curBlock.find('.nd-form-input-list').remove();
                        curBlock.data('streets', streets);
                        if (streets.length > 0) {
                            var newHTML = '<ul class="nd-form-input-list">';
                            for (var i = 0; i < streets.length; i++) {
                                newHTML += '<li>' + streets[i] + '</li>';
                            }
                            newHTML += '</ul>';
                            curBlock.append(newHTML);
                            curBlock.find('.nd-form-input-list li').click(function() {
                                curField.val($(this).html());
                                curField.removeClass('error').addClass('valid');
                                if (curForm.find('input.required:not(.valid), textarea.required:not(.valid)').length == 0) {
                                    curForm.find('.nd-form-submit .nd-btn').removeClass('disabled');
                                } else {
                                    curForm.find('.nd-form-submit .nd-btn').addClass('disabled');
                                }
                                curField.parent().find('label').remove();
                                curBlock.find('.nd-form-input-list').remove();
                                curForm.find('input.addressHome').prop('disabled', false);
                                curForm.find('input.addressHome').parent().removeClass('disabled');
                                curForm.find('input.addressHome').trigger('focus');
                            });
                            curBlock.find('.nd-form-input-list li').mouseover(function() {
                                curBlock.find('.nd-form-input-list li.active').removeClass('active');
                                $(this).addClass('active');
                            });
                        }
                    });
                }
                break;
        }

        if (curForm.find('input.required:not(.valid), textarea.required:not(.valid)').length == 0) {
            curForm.find('.nd-form-submit .nd-btn').removeClass('disabled');
        } else {
            curForm.find('.nd-form-submit .nd-btn').addClass('disabled');
        }
        return false;
    });

    curForm.find('input.addressHome').on('keydown', function(e) {
        switch(e.keyCode) {
            case 13:
                return false;
                break;
            default:
                break;
        }
    });

    curForm.find('input.addressHome').on('blur', function(e) {
        var curField = $(this);
        if (curField.hasClass('required') && !curField.hasClass('valid')) {
            curField.addClass('error').removeClass('valid');
            if (curField.parent().find('label').length == 0) {
                curField.after('<label class="error"></label>');
            }
            if (curField.data('require-msg')) {
                curField.parent().find('label').html(curField.data('require-msg'));
            }
        }

        if (curForm.find('input.required:not(.valid), textarea.required:not(.valid)').length == 0) {
            curForm.find('.nd-form-submit .nd-btn').removeClass('disabled');
        } else {
            curForm.find('.nd-form-submit .nd-btn').addClass('disabled');
        }
        window.setTimeout(function() { curField.parent().find('.nd-form-input-list').remove()}, 500);
    });

    curForm.find('input.addressHome').on('keyup', function(e) {
        var curField = $(this);
        var curValue = curField.val();
        var curBlock = curField.parent();
        switch(e.keyCode) {
            case 27:
                curBlock.find('.nd-form-input-list').remove();
                curField.trigger('blur');
                break;

            case 38:
                if (curBlock.find('.nd-form-input-list').length > 0) {
                    var curIndex = curBlock.find('.nd-form-input-list li').index(curBlock.find('.nd-form-input-list li.active'));
                    curIndex--;
                    if (curIndex < 0) {
                        curIndex = curBlock.find('.nd-form-input-list li').length - 1;
                    }
                    curBlock.find('.nd-form-input-list li.active').removeClass('active');
                    curBlock.find('.nd-form-input-list li').eq(curIndex).addClass('active');
                    curField.val(curBlock.find('.nd-form-input-list li').eq(curIndex).text());
                    curForm.find('input.required-address').prop('disabled', true);
                    curForm.find('input.required-address').parent().addClass('disabled');
                    curForm.find('.nd-form-submit .nd-btn').addClass('disabled');
                    curForm.find('.nd-form-connection-status-ok, .nd-form-connection-status-fail').hide();
                    curForm.find('.nd-form-connection-status-default').show();
                    curField.removeClass('error').addClass('valid');
                    curField.parent().find('label').remove();
                }
                break;

            case 40:
                if (curBlock.find('.nd-form-input-list').length > 0) {
                    var curIndex = curBlock.find('.nd-form-input-list li').index(curBlock.find('.nd-form-input-list li.active'));
                    curIndex++;
                    if (curIndex > curBlock.find('.nd-form-input-list li').length - 1) {
                        curIndex = 0;
                    }
                    curBlock.find('.nd-form-input-list li.active').removeClass('active');
                    curBlock.find('.nd-form-input-list li').eq(curIndex).addClass('active');
                    curField.val(curBlock.find('.nd-form-input-list li').eq(curIndex).text());
                    curForm.find('input.required-address').prop('disabled', true);
                    curForm.find('input.required-address').parent().addClass('disabled');
                    curForm.find('.nd-form-submit .nd-btn').addClass('disabled');
                    curForm.find('.nd-form-connection-status-ok, .nd-form-connection-status-fail').hide();
                    curForm.find('.nd-form-connection-status-default').show();
                    curField.removeClass('error').addClass('valid');
                    curField.parent().find('label').remove();
                }
                break;

            case 35:
                break;

            case 36:
                break;

            case 37:
                break;

            case 39:
                break;

            case 13:
                if (curBlock.find('.nd-form-input-list li.active').length == 0) {
                    curField.val('');
                    curField.removeClass('valid');
                }
                curField.trigger('blur');
                if (curField.hasClass('valid')) {
                    curForm.find('input.required-address').prop('disabled', false);
                    curForm.find('input.required-address').parent().removeClass('disabled');
                    var urlcheck = $('.nd-form-connection-status-default').data('urlcheck');
                    if (typeof (urlcheck) != 'undefined') {
                        $.ajax({
                            type: 'POST',
                            url: urlcheck,
                            dataType: 'html',
                            data: curForm.serialize(),
                            cache: false
                        }).done(function(html) {
                            if (html == 'ok') {
                                curForm.find('.nd-form-connection-status-default, .nd-form-connection-status-fail').hide();
                                curForm.find('.nd-form-connection-status-ok').show();
                            } else {
                                curForm.find('.nd-form-connection-status-default, .nd-form-connection-status-ok').hide();
                                curForm.find('.nd-form-connection-status-fail').show();
                            }
                        });
                    }
                }
                break;

            default:
                curBlock.find('.nd-form-input-list li.active').removeClass('active');
                curField.removeClass('valid').addClass('error');
                if (curField.parent().find('label').length == 0) {
                    curField.after('<label class="error"></label>');
                }
                if (curField.data('require-msg')) {
                    curField.parent().find('label').html(curField.data('require-msg'));
                }
                curForm.find('input.required-address').prop('disabled', true);
                curForm.find('input.required-address').parent().addClass('disabled');
                curForm.find('.nd-form-submit .nd-btn').addClass('disabled');
                curForm.find('.nd-form-connection-status-ok, .nd-form-connection-status-fail').hide();
                curForm.find('.nd-form-connection-status-default').show();
                var street = curBlock.parents().filter('form').find('input.addressStreet').val();
                ymaps.suggest(`г. Москва, ${street}, ${curValue}`, {
                    boundedBy: [[55.969188, 37.271944], [55.487158, 37.969576]]
                }).then(function(items) {
                    var houses = items.map(el => el.value.replace(/,|Москва|Россия/ig, '').replace(/\w+,/ig, '').replace(street, '').trim()).filter(e => (e.length < 10) );
                    curBlock.find('.nd-form-input-list').remove();
                    curBlock.data('houses', houses);
                    if (houses.length > 0) {
                        var newHTML = '<ul class="nd-form-input-list">';
                        for (var i = 0; i < houses.length; i++) {
                            newHTML += '<li>' + houses[i] + '</li>';
                        }
                        newHTML += '</ul>';
                        curBlock.append(newHTML);
                        curBlock.find('.nd-form-input-list li').click(function() {
                            curField.val($(this).html());
                            curField.removeClass('error').addClass('valid');
                            if (curForm.find('input.required:not(.valid), textarea.required:not(.valid)').length == 0) {
                                curForm.find('.nd-form-submit .nd-btn').removeClass('disabled');
                            } else {
                                curForm.find('.nd-form-submit .nd-btn').addClass('disabled');
                            }
                            curField.parent().find('label').remove();
                            curBlock.find('.nd-form-input-list').remove();
                            curForm.find('input.required-address').prop('disabled', false);
                            curForm.find('input.required-address').parent().removeClass('disabled');
                            var urlcheck = $('.nd-form-connection-status-default').data('urlcheck');
                            if (typeof (urlcheck) != 'undefined') {
                                $.ajax({
                                    type: 'POST',
                                    url: urlcheck,
                                    dataType: 'html',
                                    data: curForm.serialize(),
                                    cache: false
                                }).done(function(html) {
                                    if (html == 'ok') {
                                        curForm.find('.nd-form-connection-status-default, .nd-form-connection-status-fail').hide();
                                        curForm.find('.nd-form-connection-status-ok').show();
                                    } else {
                                        curForm.find('.nd-form-connection-status-default, .nd-form-connection-status-ok').hide();
                                        curForm.find('.nd-form-connection-status-fail').show();
                                    }
                                });
                            }
                        });
                        curBlock.find('.nd-form-input-list li').mouseover(function() {
                            curBlock.find('.nd-form-input-list li.active').removeClass('active');
                            $(this).addClass('active');
                        });
                    }
                });
                break;
        }

        if (curForm.find('input.required:not(.valid), textarea.required:not(.valid)').length == 0) {
            curForm.find('.nd-form-submit .nd-btn').removeClass('disabled');
        } else {
            curForm.find('.nd-form-submit .nd-btn').addClass('disabled');
        }
        return false;
    });
}

function windowOpen(linkWindow, dataWindow, callbackWindow) {
    $('html').addClass('nd-window-open');

    if ($('.nd-window').length == 0) {
        $('body').append('<div class="nd-window"><div class="nd-window-loading"></div></div>')
    }

    $.ajax({
        type: 'POST',
        url: linkWindow,
        dataType: 'html',
        data: dataWindow,
        cache: false
    }).done(function(html) {
        if ($('.nd-window').length > 0) {
            $('.nd-window').remove();
        }
        $('body').append('<div class="nd-window"><div class="nd-window-loading"></div></div>')

        $('.nd-window').append('<div class="nd-window-container nd-window-container-load"><div class="nd-window-content">' + html + '</div></div>')

        if ($('.nd-window-container img').length > 0) {
            $('.nd-window-container img').each(function() {
                $(this).attr('src', $(this).attr('src'));
            });
            $('.nd-window-container').data('curImg', 0);
            $('.nd-window-container img').one('load', function() {
                var curImg = $('.nd-window-container').data('curImg');
                curImg++;
                $('.nd-window-container').data('curImg', curImg);
                if ($('.nd-window-container img').length == curImg) {
                    $('.nd-window-container').removeClass('window-container-load');
                    windowPosition();
                }
            });
        } else {
            $('.nd-window-container').removeClass('nd-window-container-load');
            windowPosition();
        }

        if (typeof (callbackWindow) != 'undefined') {
            callbackWindow.call();
        }

        $('.nd-window form').each(function() {
            initForm($(this));
            $(this).find('input[type="text"]:visible:not(:disabled)').eq(0).trigger('focus');
        });
    });
}

function windowPosition() {
    if ($('.nd-window').length > 0) {
        $('.nd-window-container').css({'left': '50%', 'margin-left': -$('.nd-window-container').width() / 2});

        $('.nd-window-container').css({'top': '50%', 'margin-top': -$('.nd-window-container').height() / 2, 'padding-bottom': 0});
        if ($('.nd-window-container').height() > $('.nd-window').height()) {
            $('.nd-window-container').css({'top': 0, 'margin-top': 0, 'padding-bottom': 0});
        }
    }
}

function windowClose() {
    if ($('.nd-window').length > 0) {
        $('.nd-window').remove();
        $('html').removeClass('nd-window-open');
    }
}