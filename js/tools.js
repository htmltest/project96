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

function initForm(curForm) {
    curForm.find('input.maskPhone').mask('+7 (999) 999-99-99');

    curForm.find('.form-input input.required').parent().addClass('required');
    curForm.find('.form-input input:disabled, .form-input textarea:disabled').parent().addClass('disabled');

    curForm.find('#address-street').on('keyup', function(e) {
        var curField = $(this);
        var curValue = curField.val();
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

                var curBlock = curField.parent();
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
                }
            });
        }
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