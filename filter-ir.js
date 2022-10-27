{ /* < script > */ }


/***
 *   @author Victor Chimenti, MSCS
 *   @file filter-ir.js
 *   @see https://www.seattleu.edu/ir/
 *      InformSU Video Guides
 *      
 *   @version 6.0
 * 
 */




/***
 * Populate Dropdown Menu Select Option
 * Currently using the T4 List Group Element
 * 
 */
const listItemsNode = document.querySelectorAll('li.list-group-item');
let select = document.getElementById("categoryOptions");
let listItemsArr = []
for (const item of listItemsNode) {

    listItemsArr.push(item.innerHTML);

}

const listSet = new Set(listItemsArr);
let optionArr = Array.from(listSet);
optionArr.sort();
for (let i = 0; i < optionArr.length; i++) {

    let encodedStr = optionArr[i].replace(/&/g, "&");
    let el = document.createElement("option");
    el.textContent = encodedStr;
    el.value = encodedStr;
    select.appendChild(el);
}




$(function() {
    $(window).load(function() {
        // Once window loads set a timeout delay
        setTimeout(function() {




            //** global array holds list of content items that will render after filter selection **//
            let visibleItems = [];
            let parseItems = {};




            //   ***   Process and Parse Visible Items   ***   //
            $(function() {
                let parseItemsToDisplay = function() {
                    visibleItems = $('.profileItem').not('.hideByDropdownCategories, .hideByText');
                    if (!visibleItems.length > 0) {
                        $('.noResultsToShow').removeClass('hideResultsMessage');
                    } else {
                        $('.noResultsToShow').addClass('hideResultsMessage');
                    }
                };
                parseItems.process = parseItemsToDisplay;
            });




            //  ***   Keyword Search   ***   //
            $(function() {

                $('#find-experts').on('keyup', function() {

                    let keyword = $(this).val().toLowerCase();
                    $(function() {
                        $('.profileItem').filter(function() {
                            $(this).toggleClass('hideByText', !($(this).text().toLowerCase().indexOf(keyword) > -1));
                        });
                    });

                    parseItems.process();
                });
            });




            //   ***   Category Filter   ***   //
            $(function() {

                $('#categoryOptions').change(function() {

                    let typeKey = $(this).val();
                    if (typeKey) {

                        $('ul.list-group').filter(function(i, e) {
                            var typeValue = $(this).text();
                            if (typeValue.match(typeKey)) {
                                $(this).parents('.profileItem').removeClass('hideByDropdownCategories');
                            } else {
                                $(this).parents('.profileItem').addClass('hideByDropdownCategories');
                            }
                        });

                    } else {

                        $('.profileItem').removeClass('hideByDropdownCategories');
                    }

                    parseItems.process();
                });
            });




        }, 10);
    });
});


// </script>