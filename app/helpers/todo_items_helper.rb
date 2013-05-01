module TodoItemsHelper
  def svg_object(name)
    # Why the extra span, bro?
    # Because we want to be able to wrap it in a link.
    # See: http://stackoverflow.com/a/12732030/209190
    "<span><object data=\"#{image_path(name + '.svg')}\" type=\"image/svg+xml\">#{image_tag(name + '.png')}</object></span>".html_safe
  end
end