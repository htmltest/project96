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
                $('.window .form-details-text').html($('title').text());
                if (typeof (curLink.data('inputs')) != 'undefined') {
                    var obj = curLink.data('inputs');
                    var newHTML = '';
                    for (var i = 0; i < obj.inputs.length; i++) {
                        var curName = obj.inputs[i].name;
                        var curValue = obj.inputs[i].value;
                        newHTML += '<input type="hidden" name="' + curName + '" value="' + curValue + '" />';
                    }
                    $('.window form').append(newHTML);
                }
            });
        } else if (typeof (curLink.data('text')) != 'undefined') {
            windowOpen(curLink.attr('href'), null, function() {
                $('.window .form-details-text').html(curLink.data('text'));
                if (typeof (curLink.data('inputs')) != 'undefined') {
                    var obj = curLink.data('inputs');
                    var newHTML = '';
                    for (var i = 0; i < obj.inputs.length; i++) {
                        var curName = obj.inputs[i].name;
                        var curValue = obj.inputs[i].value;
                        newHTML += '<input type="hidden" name="' + curName + '" value="' + curValue + '" />';
                    }
                    $('.window form').append(newHTML);
                }
            });
        } else if (typeof (curLink.data('tarif')) != 'undefined') {
            windowOpen(curLink.attr('href'), null, function() {
                var obj = curLink.data('tarif');
                var newHTML = '';
                for (var i = 0; i < obj.rows.length; i++) {
                    var curType = obj.rows[i].type;
                    var curTitle = obj.rows[i].title;
                    var curValue = obj.rows[i].value;
                    if (curType == '1') {
                        newHTML += '<div class="form-details-list-row form-details-list-row-2">';
                    } else if (curType == '2') {
                        newHTML += '<div class="form-details-list-row form-details-list-row-summ">';
                    } else {
                        newHTML += '<div class="form-details-list-row">';
                    }
                    newHTML += '<div class="form-details-prop">' + curTitle + '</div>';
                    if (curValue != '') {
                        newHTML += '<div class="form-details-value">' + curValue + '</div>';
                    }
                    newHTML += '</div>';
                }
                $('.window .form-details-list').html(newHTML);

                if (typeof (curLink.data('inputs')) != 'undefined') {
                    var obj = curLink.data('inputs');
                    var newHTML = '';
                    for (var i = 0; i < obj.inputs.length; i++) {
                        var curName = obj.inputs[i].name;
                        var curValue = obj.inputs[i].value;
                        newHTML += '<input type="hidden" name="' + curName + '" value="' + curValue + '" />';
                    }
                    $('.window form').append(newHTML);
                }
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
        if ($(e.target).hasClass('window')) {
            windowClose();
        }
    });

    $(window).resize(function() {
        windowPosition();
    });

    $('body').on('click', '.window-close, .window-close-link', function(e) {
        windowClose();
        e.preventDefault();
    });

});

var streets = [];

function initForm(curForm) {
    curForm.find('input.maskPhone').mask('+7 (999) 999-99-99');

    curForm.find('.form-input input.required').parent().addClass('required');
    curForm.find('.form-input input:disabled, .form-input textarea:disabled').parent().addClass('disabled');

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
                curBlock.find('.form-input-list').remove();
                curField.val('');
                curField.trigger('blur');
                return false;
                break;

            case 38:
                var curIndex = curBlock.find('.form-input-list li').index(curBlock.find('.form-input-list li.active'));
                curIndex--;
                if (curIndex < 0) {
                    curIndex = curBlock.find('.form-input-list li').length - 1;
                }
                curBlock.find('.form-input-list li.active').removeClass('active');
                curBlock.find('.form-input-list li').eq(curIndex).addClass('active');
                curField.val(curBlock.find('.form-input-list li').eq(curIndex).text());
                break;

            case 40:
                var curIndex = curBlock.find('.form-input-list li').index(curBlock.find('.form-input-list li.active'));
                curIndex++;
                if (curIndex > curBlock.find('.form-input-list li').length - 1) {
                    curIndex = 0;
                }
                curBlock.find('.form-input-list li.active').removeClass('active');
                curBlock.find('.form-input-list li').eq(curIndex).addClass('active');
                curField.val(curBlock.find('.form-input-list li').eq(curIndex).text());
                break;

            case 13:
                curBlock.find('.form-input-list').remove();
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

                        curBlock.find('.form-input-list').remove();
                        if (streets.length > 0) {
                            var newHTML = '<ul class="form-input-list">';
                            for (var i = 0; i < streets.length; i++) {
                                newHTML += '<li>' + streets[i] + '</li>';
                            }
                            newHTML += '</ul>';
                            curBlock.append(newHTML);
                            curBlock.find('.form-input-list li').click(function() {
                                curField.val($(this).html());
                                curBlock.find('.form-input-list').remove();
                                curForm.find('#address-house').prop('disabled', false).parent().removeClass('disabled');
                            });
                            curBlock.find('.form-input-list li').mouseover(function() {
                                curBlock.find('.form-input-list li.active').removeClass('active');
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
                curBlock.find('.form-input-list').remove();
                curField.val('');
                curField.trigger('blur');
                return false;
                break;

            case 38:
                var curIndex = curBlock.find('.form-input-list li').index(curBlock.find('.form-input-list li.active'));
                curIndex--;
                if (curIndex < 0) {
                    curIndex = curBlock.find('.form-input-list li').length - 1;
                }
                curBlock.find('.form-input-list li.active').removeClass('active');
                curBlock.find('.form-input-list li').eq(curIndex).addClass('active');
                curField.val(curBlock.find('.form-input-list li').eq(curIndex).text());
                break;

            case 40:
                var curIndex = curBlock.find('.form-input-list li').index(curBlock.find('.form-input-list li.active'));
                curIndex++;
                if (curIndex > curBlock.find('.form-input-list li').length - 1) {
                    curIndex = 0;
                }
                curBlock.find('.form-input-list li.active').removeClass('active');
                curBlock.find('.form-input-list li').eq(curIndex).addClass('active');
                curField.val(curBlock.find('.form-input-list li').eq(curIndex).text());
                break;

            case 13:
                curBlock.find('.form-input-list').remove();
                $('#address-house').blur();
                $('.form-input input.required-address').each(function() {
                    $(this).prop('disabled', disabled);
                    $(this).parent().removeClass('disabled');
                });
                break;

            default:
                var street = curForm.find('#address-street').val();
                ymaps.suggest(`г. Москва, ${street}, ${curValue}`, {
                    boundedBy: [[55.969188, 37.271944], [55.487158, 37.969576]]
                }).then(function(items) {
                    var houses = items.map(el => el.value.replace(/,|Москва|Россия/ig, '').replace(/\w+,/ig, '').replace(street, '').trim()).filter(e => (e.length < 10) );
                    curBlock.find('.form-input-list').remove();
                    if (streets.length > 0) {
                        var newHTML = '<ul class="form-input-list">';
                        for (var i = 0; i < houses.length; i++) {
                            newHTML += '<li>' + houses[i] + '</li>';
                        }
                        newHTML += '</ul>';
                        curBlock.append(newHTML);
                        curBlock.find('.form-input-list li').click(function() {
                            curField.val($(this).html());
                            curBlock.find('.form-input-list').remove();
                            $('.form-input input.required-address').each(function() {
                                $(this).prop('disabled', disabled);
                                $(this).parent().removeClass('disabled');
                            });
                        });
                        curBlock.find('.form-input-list li').mouseover(function() {
                            curBlock.find('.form-input-list li.active').removeClass('active');
                            $(this).addClass('active');
                        });
                    }
                });
                break;
       }
       return false;
    });

    if (curForm.hasClass('window-form')) {
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
    $('html').addClass('window-open');

    if ($('.window').length == 0) {
        $('body').append('<div class="window"><div class="window-loading"></div></div>')
    }

    $.ajax({
        type: 'POST',
        url: linkWindow,
        dataType: 'html',
        data: dataWindow,
        cache: false
    }).done(function(html) {
        if ($('.window').length > 0) {
            $('.window').remove();
        }
        $('body').append('<div class="window"><div class="window-loading"></div></div>')

        $('.window').append('<div class="window-container window-container-load"><div class="window-content">' + html + '</div></div>')

        if ($('.window-container img').length > 0) {
            $('.window-container img').each(function() {
                $(this).attr('src', $(this).attr('src'));
            });
            $('.window-container').data('curImg', 0);
            $('.window-container img').one('load', function() {
                var curImg = $('.window-container').data('curImg');
                curImg++;
                $('.window-container').data('curImg', curImg);
                if ($('.window-container img').length == curImg) {
                    $('.window-container').removeClass('window-container-load');
                    windowPosition();
                }
            });
        } else {
            $('.window-container').removeClass('window-container-load');
            windowPosition();
        }

        if (typeof (callbackWindow) != 'undefined') {
            callbackWindow.call();
        }

        $('.window form').each(function() {
            initForm($(this));
        });
    });
}

function windowPosition() {
    if ($('.window').length > 0) {
        $('.window-container').css({'left': '50%', 'margin-left': -$('.window-container').width() / 2});

        $('.window-container').css({'top': '50%', 'margin-top': -$('.window-container').height() / 2, 'padding-bottom': 0});
        if ($('.window-container').height() > $('.window').height() - 60) {
            $('.window-container').css({'top': '30px', 'margin-top': 0, 'padding-bottom': 30});
        }
    }
}

function windowClose() {
    if ($('.window').length > 0) {
        $('.window').remove();
        $('html').removeClass('window-open');
    }
}