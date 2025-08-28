$(document).ready(function () {
    // load from json/ folder and use "img" key from the JSON
    $.getJSON('json/malay-street-food.json')
        .done(function (data) {
            var grid = $('#food-list');

            data.forEach(function (item) {
                var imageSrc = item.img || 'img/placeholder.png'; // fallback image
                var card = `<div class="card">
                                <img class="card-img-top" src="${imageSrc}" alt="${item.name}">
                                <div class="card-body">
                                    <h5 class="card-title">${item.name}</h5>
                                    <p class="card-text">${item.description}</p>
                                    <a class="btn btn-sm btn-primary" href="${item.link}">Learn More</a>
                                </div>
                            </div>`;
                grid.append(card);
            });

            function setCardHeights() {
                var maxHeight = 0;
                $('.card').each(function () {
                    $(this).css('height', 'auto');
                    if ($(this).height() > maxHeight) maxHeight = $(this).height();
                });
                $('.card').height(maxHeight);
            }

            setCardHeights();
            $(window).on('resize', setCardHeights);
        })
        .fail(function (jqxhr, textStatus, error) {
            console.error('Failed to load json/malay-street-food.json:', textStatus, error);
            $('#food-list').append('<p class="text-danger">Could not load food list. Check the console for details.</p>');
        });
});