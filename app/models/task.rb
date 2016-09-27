# CS 4540, Spring 2015
# Written by Paul Hanson and Jason Steck

class Task < ActiveRecord::Base

  validates :name, presence: true
  validates :category, presence: true

  # List of all the possible category options
  @@categoryOptions = [['work', 'work'], ['school', 'school'], ['family', 'family'], ['recreation', 'recreation'], ['errands', 'errands'], ['romance', 'romance'], ['other', 'other']]

  # Allow outside access to the category options
  def self.categoryOptions
    @@categoryOptions
  end

end
