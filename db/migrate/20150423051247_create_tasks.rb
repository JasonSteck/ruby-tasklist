class CreateTasks < ActiveRecord::Migration
  def change
    create_table :tasks do |t|
      t.string :name
      t.string :category
      t.text :description
      t.boolean :isComplete, :default => false

      t.timestamps null: false
    end
  end
end
