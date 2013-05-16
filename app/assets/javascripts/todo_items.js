$(document).ready(function () {
  function updateItem(container, complete, checkbox) {
    var li = $(checkbox).parents('li');
    var id = li.attr('data-id');
    $.ajax({
      url: '/todo_items/' + id,
      method: 'put',
      data: {todo_item: {completed: complete}},
      dataType: 'json',
      success: function () {
        var list = $(container);
        list.append(li);
      }
    });
  }

  $('#todo').on('click', 'li input[type=checkbox]', function () { updateItem('#completed', true, this); });

  $('#completed').on('click', 'li input[type=checkbox]', function () { updateItem('#todo', false, this); });

  var allowSubmit = true;
  $('form').on('submit', function (event) {
    event.preventDefault();
    if (!allowSubmit) { return false; }
    allowSubmit = false;
    var form = $(this);
    var input = $('#todo_item_name');
    var inputValue = input.val();
    var year = $('#todo_item_due_at_1i').val();
    var month = $('#todo_item_due_at_2i').val();
    var day = $('#todo_item_due_at_3i').val();
    var date = new Date(year + '-' + month + '-' + day);
    var item = {name: inputValue, due_at: date};
    var timer;
    $.ajax({
      url: form.attr('action'),
      method: form.attr('method'),
      data: {todo_item: item},
      dataType: 'json',
      beforeSend: function () {
        timer = setTimeout(function () { $('.spinner').fadeIn(); }, 1000);
      },
      complete: function () {
        allowSubmit = true;
        clearTimeout(timer);
        $('.spinner').fadeOut();
      },
      success: function (todo) {
        var list = $('#todo');
        var entry = $('<li data-id="' + todo.id + '"></li>');
        var checkbox = $('<span class="item_checkbox"><input type="checkbox"></span>').append(' ');
        var name = $('<span class="item_name">' + todo.name + ' </span>').append(' ');
        var time = $('<time datetime="' + todo.due_at + '" class="item_due_at">' + moment(todo.due_at).format('dddd, MMMM D, YYYY') + '</time>').append(' ');
        var deleteButton = $('<span class="item_delete"><a href="/todo_items/' + todo.id + '" data-confirm="Are you sure?" data-method="delete" rel="nofollow"><span><object data="/assets/trash.svg" type="image/svg+xml"><img alt="Trash" src="/assets/trash.png"></object></span></a></span>');
        entry.append(checkbox, name, time, deleteButton);
        entry.appendTo(list);
        input.val('');
        input.focus();
      },
      error: function () {
        $('.error').slideDown();
        setTimeout(function () { $('.error').slideUp(); }, 3000);
      }
    });
  });

});
