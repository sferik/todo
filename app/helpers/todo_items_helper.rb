module TodoItemsHelper
  def svg_object(name)
    "<object data=\"#{image_path(name + '.svg')}\" type=\"image/svg+xml\">#{image_tag(name + '.png')}</object>".html_safe
  end
end