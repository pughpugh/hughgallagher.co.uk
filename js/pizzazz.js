$(document).ready(function(){
    var pages=$("#allpages");
    var page1=$("#page1");
    var page2=$("#page2");
    var page3=$("#page3");

    $(window).bind( 'hashchange', function(e) {
        var hash = $.param.fragment();

        if( hash === 'cv' ){
            pages.animate({ left: "0px" }, 400 );
            page1.fadeIn();
            page2.fadeOut();
            page3.fadeOut();
        }
        else if( hash === 'more' ){
            pages.animate({ left: "-890px" }, 400 );
            page1.fadeOut();
            page2.fadeIn();
            page3.fadeOut();
        }
        else if( hash === 'contact' ){
            pages.animate({ left: "-1780px" }, 400 );
            page1.fadeOut();
            page2.fadeIn();
            page3.fadeIn();
        }
    });

    // Set page on initial load
    var hash = $.param.fragment();
    if( hash == 'more' ){
        pages.css({ left: "-890px" })
        page1.hide();
        page2.show();
    }
    else if( hash == 'contact' ){
        pages.css({ left: "-1780px" });
        page1.hide();
        page3.show();
    }
    else {
        $.bbq.pushState( '#cv' );
    }
});
