$(document).ready(function(){
  $('form').on('submit', function(event){
    event.preventDefault();
    var form = $(this);
    var inputValue = $('#todo_item_name').val();
    var year = $('#todo_item_due_at_1i').val();
    var month = $('#todo_item_due_at_2i').val();
    var day = $('#todo_item_due_at_3i').val();
    var date = new Date(year + '-' + month + '-' + day);
    var item = {name: inputValue, due_at: date};
    $.ajax({
      url: form.attr('action'),
      method: form.attr('method'),
      data: {todo_item: item},
      dataType: 'json'
    });
  });
});