$(document).ready ->
  updateItem = (container, complete, checkbox) ->
    li = $(checkbox).parents('li')
    id = li.attr('data-id')
    $.ajax
      url: "/todo_items/#{id}"
      method: 'put'
      data:
        todo_item:
          completed: complete
      dataType: 'json'
      success: ->
        list = $(container)
        list.append li

  $('#todo').on 'click', 'li input[type=checkbox]', ->
    updateItem '#completed', true, this

  $('#completed').on 'click', 'li input[type=checkbox]', ->
    updateItem '#todo', false, this

  allowSubmit = true
  $('form').on 'submit', (event) ->
    event.preventDefault()
    return false unless allowSubmit
    allowSubmit = false
    form = $(this)
    input = $('#todo_item_name')
    inputValue = input.val()
    year = $('#todo_item_due_at_1i').val()
    month = $('#todo_item_due_at_2i').val()
    day = $('#todo_item_due_at_3i').val()
    date = new Date("#{year}-#{month}-#{day}")
    item =
      name: inputValue
      due_at: date
    timer = undefined
    $.ajax
      url: form.attr('action')
      method: form.attr('method')
      data:
        todo_item: item
      dataType: 'json'
      beforeSend: ->
        timer = setTimeout(->
          $('.spinner').fadeIn()
        , 1000)
      complete: ->
        allowSubmit = true
        clearTimeout timer
        $('.spinner').fadeOut()
      success: (todo) ->
        list = $('#todo')
        entry = $("<li data-id=\"#{todo.id}\"></li>")
        checkbox = $("<span class=\"item_checkbox\"><input type=\"checkbox\"></span>").append(' ');
        name = $("<span class=\"item_name\">#{todo.name}</span>").append(' ');
        time = $("<time datetime=\"#{todo.due_at}\" class=\"item_due_at\">#{moment(todo.due_at).format('dddd, MMMM D, YYYY')}</time>").append(' ');
        deleteButton = $("<span class=\"item_delete\"><a href=\"/todo_items/#{todo.id}\" data-confirm=\"Are you sure?\" data-method=\"delete\" rel=\"nofollow\"><span><object data=\"/assets/trash.svg\" type=\"image/svg+xml\"><img alt=\"Trash\" src=\"/assets/trash.png\" /></object></span></a></span>")
        entry.append checkbox, name, time, deleteButton
        entry.appendTo list
        input.val ''
        input.focus()
      error: ->
        $('.error').slideDown()
        setTimeout(->
          $('.error').slideUp()
        , 3000)
