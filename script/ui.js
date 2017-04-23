( function () { 
    'use strict';

    var $addGold = document.querySelector(".add-btn");
    var $addCat = document.querySelector(".cat-btn");
    var $feed = document.querySelector(".feed-btn");
    var $closeModal = document.querySelector(".err-btn");

    $addGold.addEventListener("click", tank.addFishFunc);

    $addCat.addEventListener("click", tank.addFishFunc);


    $feed.addEventListener("click", function() {
        tank.feed();
    })

    $closeModal.addEventListener("click", function() {
        tank.closeModal();
    })

}) ();