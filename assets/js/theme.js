$(document).ready(function () {
  var ratingTemplate = Handlebars.compile($('#ratingTemplate').html())

  var swiper = new Swiper('.swiper-container', {
    pagination: '.swiper-pagination',
    paginationClickable: true,
    nextButton: '.swiper-button-next',
    prevButton: '.swiper-button-prev',
    loop: true
  })

  $(window).on('popstate', function (e) {
    if (e.target.location.href === window.location.origin + '/') {
      window.location = '/'
    }
  })

  if (window.location.origin === document.baseURI) {
    window.location = '/'
  }

  function updateRatings () {
    $.ajax({url: 'http://192.168.0.107:3000/stars/', data: JSON.stringify({url: $('#ratings').attr('data-url')}), method: 'POST', contentType: 'application/json', success: function (result) {
      $('#ratings').html(ratingTemplate(JSON.parse(result)))
    }})
  }

  // Setup star rating
  $('#theme-wrapper').on('mouseover', '.rating-star', function () {
    var hovered = $(this)
    $(hovered).parent().find('.rating-star').each(function (k, element) {
      if ($(element).attr('data-rating') <= $(hovered).attr('data-rating')) {
        $(element).text('star')
      } else {
        $(element).text('star_border')
      }
    })
  })
  $('#theme-wrapper').on('mouseleave', '.rating-star', function () {
    $('.rating-star').each(function (k, element) {
      $(element).text($(element).attr('data-original'))
    })
  })
  $('#theme-wrapper').on('click', '.rating-star', function () {
    $.ajax({
      url: 'http://192.168.0.107:3000/star',
      data: JSON.stringify({url: $('#ratings').attr('data-url'), stars: $(this).attr('data-rating')}),
      method: 'POST',
      contentType: 'application/json',
      success: function () {
        updateRatings()
      },
      error: function (e) {
        if (e.status === 403) {
          $('#ratingError').slideDown().delay(5000).slideUp()
        }
      }
    })
  })

  updateRatings()
})
