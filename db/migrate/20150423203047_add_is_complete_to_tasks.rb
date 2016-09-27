class AddIsCompleteToTasks < ActiveRecord::Migration
  def change
    add_column :tasks, :isComplete, :boolean
  end
end
