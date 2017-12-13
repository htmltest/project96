$(document).ready(function() {

    $.validator.addMethod('maskPhone',
        function(value, element) {
            if (value == '') {
                return true;
            }
            return /^\+7 \(\d{3}\) \d{3}\-\d{2}\-\d{2}$/.test(value);
        },
        'Неверный формат номера телефона'
    );

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
    curForm.find('input.maskPhone').mask('+7 (999) 999-99-99');

    curForm.find('.nd-form-input input.required').parent().addClass('required');
    curForm.find('.nd-form-input input:disabled, .nd-form-input textarea:disabled').parent().addClass('disabled');

    curForm.find('#address-street').on('keydown', function(e) {
        switch(e.keyCode) {
            case 13:
                return false;
                break;
            default:
                break;
        }
    });

    curForm.find('#address-street').on('keyup', function(e) {
        var curField = $(this);
        var curValue = curField.val();
        var curBlock = curField.parent();
        switch(e.keyCode) {
            case 27:
                curBlock.find('.nd-form-input-list').remove();
                curField.val('');
                curField.trigger('blur');
                return false;
                break;

            case 38:
                var curIndex = curBlock.find('.nd-form-input-list li').index(curBlock.find('.nd-form-input-list li.active'));
                curIndex--;
                if (curIndex < 0) {
                    curIndex = curBlock.find('.nd-form-input-list li').length - 1;
                }
                curBlock.find('.nd-form-input-list li.active').removeClass('active');
                curBlock.find('.nd-form-input-list li').eq(curIndex).addClass('active');
                curField.val(curBlock.find('.nd-form-input-list li').eq(curIndex).text());
                break;

            case 40:
                var curIndex = curBlock.find('.nd-form-input-list li').index(curBlock.find('.nd-form-input-list li.active'));
                curIndex++;
                if (curIndex > curBlock.find('.nd-form-input-list li').length - 1) {
                    curIndex = 0;
                }
                curBlock.find('.nd-form-input-list li.active').removeClass('active');
                curBlock.find('.nd-form-input-list li').eq(curIndex).addClass('active');
                curField.val(curBlock.find('.nd-form-input-list li').eq(curIndex).text());
                break;

            case 13:
                curBlock.find('.nd-form-input-list').remove();
                $('#address-house').parent().removeClass('disabled');
                $('#address-house').prop('disabled', false);
                $('#address-house').focus();
                break;

            default:
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
                        if (streets.length > 0) {
                            var newHTML = '<ul class="nd-form-input-list">';
                            for (var i = 0; i < streets.length; i++) {
                                newHTML += '<li>' + streets[i] + '</li>';
                            }
                            newHTML += '</ul>';
                            curBlock.append(newHTML);
                            curBlock.find('.nd-form-input-list li').click(function() {
                                curField.val($(this).html());
                                curBlock.find('.nd-form-input-list').remove();
                                curForm.find('#address-house').prop('disabled', false).parent().removeClass('disabled');
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
       return false;
    });

    curForm.find('#address-house').on('keydown', function(e) {
        switch(e.keyCode) {
            case 13:
                return false;
                break;
            default:
                break;
        }
    });

    curForm.find('#address-house').on('keyup', function(e) {
        var curField = $(this);
        var curValue = curField.val();
        var curBlock = curField.parent();
        switch(e.keyCode) {
            case 27:
                curBlock.find('.nd-form-input-list').remove();
                curField.val('');
                curField.trigger('blur');
                return false;
                break;

            case 38:
                var curIndex = curBlock.find('.nd-form-input-list li').index(curBlock.find('.nd-form-input-list li.active'));
                curIndex--;
                if (curIndex < 0) {
                    curIndex = curBlock.find('.nd-form-input-list li').length - 1;
                }
                curBlock.find('.nd-form-input-list li.active').removeClass('active');
                curBlock.find('.nd-form-input-list li').eq(curIndex).addClass('active');
                curField.val(curBlock.find('.nd-form-input-list li').eq(curIndex).text());
                break;

            case 40:
                var curIndex = curBlock.find('.nd-form-input-list li').index(curBlock.find('.nd-form-input-list li.active'));
                curIndex++;
                if (curIndex > curBlock.find('.nd-form-input-list li').length - 1) {
                    curIndex = 0;
                }
                curBlock.find('.nd-form-input-list li.active').removeClass('active');
                curBlock.find('.nd-form-input-list li').eq(curIndex).addClass('active');
                curField.val(curBlock.find('.nd-form-input-list li').eq(curIndex).text());
                break;

            case 13:
                curBlock.find('.nd-form-input-list').remove();
                $('#address-house').blur();
                $('.nd-form-input input.required-address').each(function() {
                    $(this).prop('disabled', false);
                    $(this).parent().removeClass('disabled');
                });
                break;

            default:
                var street = curForm.find('#address-street').val();
                ymaps.suggest(`г. Москва, ${street}, ${curValue}`, {
                    boundedBy: [[55.969188, 37.271944], [55.487158, 37.969576]]
                }).then(function(items) {
                    var houses = items.map(el => el.value.replace(/,|Москва|Россия/ig, '').replace(/\w+,/ig, '').replace(street, '').trim()).filter(e => (e.length < 10) );
                    curBlock.find('.nd-form-input-list').remove();
                    if (houses.length > 0) {
                        var newHTML = '<ul class="nd-form-input-list">';
                        for (var i = 0; i < houses.length; i++) {
                            newHTML += '<li>' + houses[i] + '</li>';
                        }
                        newHTML += '</ul>';
                        curBlock.append(newHTML);
                        curBlock.find('.nd-form-input-list li').click(function() {
                            curField.val($(this).html());
                            curBlock.find('.nd-form-input-list').remove();
                            $('.nd-form-input input.required-address').each(function() {
                                $(this).prop('disabled', disabled);
                                $(this).parent().removeClass('disabled');
                            });
                        });
                        curBlock.find('.nd-form-input-list li').mouseover(function() {
                            curBlock.find('.nd-form-input-list li.active').removeClass('active');
                            $(this).addClass('active');
                        });
                    }
                });
                break;
       }
       return false;
    });

    if (curForm.hasClass('nd-window-form')) {
        curForm.validate({
            ignore: '',
            submitHandler: function(form) {
                windowOpen($(form).attr('action'), $(form).serialize());
            }
        });
    } else {
        curForm.validate({
            ignore: ''
        });
    }
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
        });
    });
}

function windowPosition() {
    if ($('.nd-window').length > 0) {
        $('.nd-window-container').css({'left': '50%', 'margin-left': -$('.nd-window-container').width() / 2});

        $('.nd-window-container').css({'top': '50%', 'margin-top': -$('.nd-window-container').height() / 2, 'padding-bottom': 0});
        if ($('.nd-window-container').height() > $('.nd-window').height() - 60) {
            $('.nd-window-container').css({'top': '30px', 'margin-top': 0, 'padding-bottom': 30});
        }
    }
}

function windowClose() {
    if ($('.nd-window').length > 0) {
        $('.nd-window').remove();
        $('html').removeClass('nd-window-open');
    }
}