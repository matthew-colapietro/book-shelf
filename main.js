var books = [];

var renderBooks = function () {
  $('.books').empty();

  for (var i = 0; i < books.length; i++) {
    var source = $('#book-template').html();
    var template = Handlebars.compile(source);
    
    var newBookHTML = template({title: books[i].title, author: books[i].author, pageCount: books[i].pages, isbn: books[i].isbn, imageURL: books[i].imageURL})
    $('.books').append(newBookHTML);
  }
};

var fetch = function (query) {
  $.ajax({
    method: "GET",
    url: "https://www.googleapis.com/books/v1/volumes?q=" + query,
    dataType: "json",
    beforeSend: function() {
      $(document).ajaxStart(function(){ 
        $("body").addClass('ajaxLoading');
        $(".btn").addClass('ajaxLoading');
      });
    },
    complete: function() {
      $(document).ajaxStop(function(){ 
        $("body").removeClass('ajaxLoading');
        $(".btn").removeClass('ajaxLoading');
      });
    },
    success: function(data) {
      addBooks(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    },
  });
};

var addBooks = function (data) {
  books = [];
  //loop through all books that come back from api
    data.items.forEach(item => {
    //build individual books
    var newBook = {
      title: item.volumeInfo.title || null,
      author: item.volumeInfo.authors ? item.volumeInfo.authors[0] : null,
      pages: item.volumeInfo.pageCount || null,
      isbn: item.volumeInfo.industryIdentifiers[0].identifier,
      imageURL: item.volumeInfo.imageLinks ? item.volumeInfo.imageLinks.thumbnail : null
    }
    //push to books array
    books.push(newBook);
  });
  renderBooks();
};


$('.search').on('click', function () {
  var search = $('#search-query').val();

  fetch(search);
});




